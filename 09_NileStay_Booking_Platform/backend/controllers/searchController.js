const { inMemoryHotels, inMemoryRoomTypes, inMemoryRooms } = require('./hotelController');

// Mock existing active bookings for availability testing
const inMemoryBookings = [
  {
    id: 'bk_sample_1',
    hotel_id: 'htl_henu_pyramids',
    room_type_id: 'rt_henu_deluxe_double',
    check_in: '2026-10-01',
    check_out: '2026-10-05',
    status: 'confirmed'
  }
];

function calculateNights(checkInStr, checkOutStr) {
  const start = new Date(checkInStr);
  const end = new Date(checkOutStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
  return diffDays > 0 ? diffDays : 1;
}

function hasDateOverlap(start1, end1, start2, end2) {
  const dStart1 = new Date(start1);
  const dEnd1 = new Date(end1);
  const dStart2 = new Date(start2);
  const dEnd2 = new Date(end2);
  return dStart1 < dEnd2 && dEnd1 > dStart2;
}

async function searchHotels(req, res) {
  try {
    const { destination, checkIn, checkOut, guests, minPrice, maxPrice, starRating, amenities } = req.query;

    const nights = (checkIn && checkOut) ? calculateNights(checkIn, checkOut) : 1;
    const requestedGuests = guests ? parseInt(guests, 10) : 1;

    let matchedHotels = [...inMemoryHotels];

    // Destination filter (matches city, zone, or hotel name)
    if (destination) {
      const q = destination.toLowerCase().trim();
      matchedHotels = matchedHotels.filter(h =>
        h.city.toLowerCase().includes(q) ||
        h.zone.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q)
      );
    }

    // Star rating filter
    if (starRating) {
      matchedHotels = matchedHotels.filter(h => h.star_rating >= parseInt(starRating, 10));
    }

    const searchResults = [];

    for (const hotel of matchedHotels) {
      const hotelRoomTypes = inMemoryRoomTypes.filter(rt => rt.hotel_id === hotel.id);
      
      // Filter room types matching guests capacity and price range
      const availableRoomTypes = [];

      for (const roomType of hotelRoomTypes) {
        if (roomType.max_occupancy < requestedGuests) continue;

        if (minPrice && roomType.base_price_per_night < parseFloat(minPrice)) continue;
        if (maxPrice && roomType.base_price_per_night > parseFloat(maxPrice)) continue;

        // Check inventory count
        const totalUnits = inMemoryRooms.filter(r => r.hotel_id === hotel.id && r.room_type_id === roomType.id && r.status === 'available').length;

        // Check booked count for date range
        let bookedUnits = 0;
        if (checkIn && checkOut) {
          bookedUnits = inMemoryBookings.filter(b => 
            b.hotel_id === hotel.id &&
            b.room_type_id === roomType.id &&
            b.status === 'confirmed' &&
            hasDateOverlap(checkIn, checkOut, b.check_in, b.check_out)
          ).length;
        }

        const remainingUnits = Math.max(0, totalUnits - bookedUnits);

        if (remainingUnits > 0 || !checkIn) {
          const totalPrice = roomType.base_price_per_night * nights;
          availableRoomTypes.push({
            ...roomType,
            nights_count: nights,
            total_stay_price: totalPrice,
            available_units: remainingUnits > 0 ? remainingUnits : 5 // Default fallback demo units
          });
        }
      }

      if (availableRoomTypes.length > 0) {
        const lowestNightlyPrice = Math.min(...availableRoomTypes.map(rt => rt.base_price_per_night));
        searchResults.push({
          hotel_id: hotel.id,
          name: hotel.name,
          slug: hotel.slug,
          city: hotel.city,
          zone: hotel.zone,
          star_rating: hotel.star_rating,
          address: hotel.address,
          amenities: hotel.amenities,
          images: hotel.images,
          lowest_price_per_night: lowestNightlyPrice,
          stay_nights: nights,
          matching_room_types: availableRoomTypes
        });
      }
    }

    return res.json({
      success: true,
      query: {
        destination: destination || 'All',
        checkIn: checkIn || 'N/A',
        checkOut: checkOut || 'N/A',
        guests: requestedGuests,
        nights
      },
      total_found: searchResults.length,
      data: searchResults
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  searchHotels,
  inMemoryBookings
};
