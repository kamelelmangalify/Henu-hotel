const { inMemoryHotels, inMemoryRoomTypes, inMemoryRooms } = require('./hotelController');
const { inMemoryBookings } = require('./searchController');

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

function generateRefCode() {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `NS-2026-${rand}`;
}

async function createBooking(req, res) {
  try {
    const {
      hotel_id,
      room_type_id,
      check_in,
      check_out,
      guests_count,
      guest_name,
      guest_email,
      guest_phone,
      special_requests
    } = req.body;

    if (!hotel_id || !room_type_id || !check_in || !check_out || !guest_name || !guest_email) {
      return res.status(400).json({
        success: false,
        message: 'hotel_id, room_type_id, check_in, check_out, guest_name, and guest_email are required.'
      });
    }

    const hotel = inMemoryHotels.find(h => h.id === hotel_id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    const roomType = inMemoryRoomTypes.find(rt => rt.id === room_type_id && rt.hotel_id === hotel_id);
    if (!roomType) {
      return res.status(404).json({ success: false, message: 'Room type not found for this hotel.' });
    }

    // 1. Overbooking Check: Count existing overlapping confirmed bookings
    const overlappingBookings = inMemoryBookings.filter(b =>
      b.hotel_id === hotel_id &&
      b.room_type_id === room_type_id &&
      b.status === 'confirmed' &&
      hasDateOverlap(check_in, check_out, b.check_in, b.check_out)
    );

    const totalRoomsCount = inMemoryRooms.filter(r =>
      r.hotel_id === hotel_id && r.room_type_id === room_type_id && r.status === 'available'
    ).length;

    const availableInventory = Math.max(1, totalRoomsCount > 0 ? totalRoomsCount - overlappingBookings.length : 5);

    if (availableInventory <= 0) {
      return res.status(409).json({
        success: false,
        message: 'No available rooms for the selected dates. Overbooking protection triggered.'
      });
    }

    // 2. Financial & Commission Calculations
    const nights = calculateNights(check_in, check_out);
    const subtotalStayAmount = roomType.base_price_per_night * nights;
    const commissionRate = hotel.commission_rate || 0.08; // 8% Platform Fee
    const commissionAmount = Math.round((subtotalStayAmount * commissionRate) * 100) / 100;
    const hotelPayoutAmount = Math.round((subtotalStayAmount - commissionAmount) * 100) / 100;
    const totalAmount = subtotalStayAmount;

    // 3. Create Booking Record
    const refCode = generateRefCode();
    const newBooking = {
      id: 'bk_' + Date.now(),
      reference_code: refCode,
      guest_id: req.user ? req.user.userId : null,
      hotel_id,
      hotel_name: hotel.name,
      room_type_id,
      room_type_name: roomType.name,
      check_in,
      check_out,
      nights_count: nights,
      guests_count: guests_count || 1,
      guest_name,
      guest_email,
      guest_phone: guest_phone || '',
      special_requests: special_requests || '',
      nightly_rate: roomType.base_price_per_night,
      subtotal_stay_amount: subtotalStayAmount,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      hotel_payout_amount: hotelPayoutAmount,
      total_amount: totalAmount,
      payment_status: 'unpaid', // pay at hotel or via gateway
      booking_status: 'confirmed',
      created_at: new Date().toISOString()
    };

    inMemoryBookings.push(newBooking);

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: newBooking
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    const booking = inMemoryBookings.find(b => b.id === id || b.reference_code === id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking reference not found.' });
    }

    return res.json({
      success: true,
      data: booking
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getMyBookings(req, res) {
  try {
    const userId = req.user.userId;
    const guestEmail = req.user.email;

    const myBookings = inMemoryBookings.filter(b => b.guest_id === userId || b.guest_email === guestEmail);

    return res.json({
      success: true,
      count: myBookings.length,
      data: myBookings
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  createBooking,
  getBookingById,
  getMyBookings
};
