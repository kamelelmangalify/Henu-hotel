const inMemoryHotels = [
  {
    id: 'htl_henu_pyramids',
    owner_id: 'usr_nasr_henu',
    name: 'HENU Hotel Pyramids',
    slug: 'henu-hotel-pyramids',
    description: 'Boutique luxury hotel with direct breathtaking views of the Great Pyramids of Giza.',
    address: '12 Sphinx Street, Pyramids Plateau, Giza, Egypt',
    city: 'Giza',
    zone: 'Pyramids',
    latitude: 29.9792,
    longitude: 31.1342,
    star_rating: 4,
    check_in_time: '14:00',
    check_out_time: '12:00',
    commission_rate: 0.08,
    amenities: ['Free WiFi', 'Pyramid View Terrace', 'Breakfast Included', 'Airport Shuttle', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'htl_cairo_ritz',
    owner_id: 'usr_ritz_admin',
    name: 'The Nile Ritz-Carlton',
    slug: 'the-nile-ritz-carlton',
    description: 'Iconic luxury hotel situated in Downtown Cairo between the Nile River and Tahrir Square.',
    address: '1113 Corniche El Nile, Downtown, Cairo, Egypt',
    city: 'Cairo',
    zone: 'Downtown',
    latitude: 30.0444,
    longitude: 31.2357,
    star_rating: 5,
    check_in_time: '15:00',
    check_out_time: '12:00',
    commission_rate: 0.08,
    amenities: ['Spa & Wellness', 'Infinity Pool', 'Nile View Dining', 'Executive Lounge', 'Valet Parking'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: new Date().toISOString()
  }
];

const inMemoryRoomTypes = [
  {
    id: 'rt_henu_pyramid_suite',
    hotel_id: 'htl_henu_pyramids',
    name: 'Pyramid Direct View Royal Suite',
    description: 'King bed suite featuring uninterrupted direct panorama of Khufu and Khafre pyramids.',
    max_occupancy: 3,
    base_price_per_night: 120.00,
    size_sqm: 45,
    bed_type: 'King',
    amenities: ['Private Balcony', 'Pyramid View', 'Espresso Machine', 'Smart TV', 'Jacuzzi Bath'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
    created_at: new Date().toISOString()
  },
  {
    id: 'rt_henu_deluxe_double',
    hotel_id: 'htl_henu_pyramids',
    name: 'Deluxe Double Room',
    description: 'Spacious room with modern Egyptian handcrafted decor and queen bed.',
    max_occupancy: 2,
    base_price_per_night: 75.00,
    size_sqm: 30,
    bed_type: 'Queen',
    amenities: ['Free WiFi', 'Mini Bar', 'Air Conditioning', 'Rain Shower'],
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
    created_at: new Date().toISOString()
  },
  {
    id: 'rt_ritz_nile_deluxe',
    hotel_id: 'htl_cairo_ritz',
    name: 'Nile View Executive Deluxe',
    description: 'Panoramic views of the River Nile and Cairo Tower with marble bathroom.',
    max_occupancy: 2,
    base_price_per_night: 220.00,
    size_sqm: 48,
    bed_type: 'King',
    amenities: ['Nile View', 'Executive Access', 'Marble Bath', 'Bose Sound System'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
    created_at: new Date().toISOString()
  }
];

const inMemoryRooms = [
  { id: 'rm_101', hotel_id: 'htl_henu_pyramids', room_type_id: 'rt_henu_deluxe_double', room_number: '101', status: 'available' },
  { id: 'rm_102', hotel_id: 'htl_henu_pyramids', room_type_id: 'rt_henu_deluxe_double', room_number: '102', status: 'available' },
  { id: 'rm_103', hotel_id: 'htl_henu_pyramids', room_type_id: 'rt_henu_deluxe_double', room_number: '103', status: 'available' },
  { id: 'rm_301', hotel_id: 'htl_henu_pyramids', room_type_id: 'rt_henu_pyramid_suite', room_number: '301', status: 'available' },
  { id: 'rm_302', hotel_id: 'htl_henu_pyramids', room_type_id: 'rt_henu_pyramid_suite', room_number: '302', status: 'available' }
];

// Controller methods
async function createHotel(req, res) {
  try {
    const { name, description, address, city, zone, latitude, longitude, star_rating, amenities, images } = req.body;
    
    if (!name || !address || !city || !zone) {
      return res.status(400).json({ success: false, message: 'Name, address, city, and zone are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newHotel = {
      id: 'htl_' + Date.now(),
      owner_id: req.user.userId,
      name,
      slug,
      description: description || '',
      address,
      city,
      zone,
      latitude: latitude || 29.9792,
      longitude: longitude || 31.1342,
      star_rating: star_rating || 4,
      check_in_time: '14:00',
      check_out_time: '12:00',
      commission_rate: 0.08,
      amenities: amenities || [],
      images: images || [],
      created_at: new Date().toISOString()
    };

    inMemoryHotels.push(newHotel);

    return res.status(201).json({
      success: true,
      message: 'Hotel created successfully.',
      data: newHotel
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getAllHotels(req, res) {
  try {
    const { city, zone, star_rating } = req.query;
    let filtered = [...inMemoryHotels];

    if (city) {
      filtered = filtered.filter(h => h.city.toLowerCase() === city.toLowerCase());
    }
    if (zone) {
      filtered = filtered.filter(h => h.zone.toLowerCase() === zone.toLowerCase());
    }
    if (star_rating) {
      filtered = filtered.filter(h => h.star_rating === parseInt(star_rating, 10));
    }

    return res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getHotelById(req, res) {
  try {
    const { id } = req.params;
    const hotel = inMemoryHotels.find(h => h.id === id || h.slug === id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    const roomTypes = inMemoryRoomTypes.filter(rt => rt.hotel_id === hotel.id);
    const rooms = inMemoryRooms.filter(r => r.hotel_id === hotel.id);

    return res.json({
      success: true,
      data: {
        ...hotel,
        room_types: roomTypes,
        total_rooms: rooms.length
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Room Type Controllers
async function createRoomType(req, res) {
  try {
    const { id: hotel_id } = req.params;
    const { name, description, max_occupancy, base_price_per_night, size_sqm, bed_type, amenities, images } = req.body;

    const hotel = inMemoryHotels.find(h => h.id === hotel_id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    if (!name || !base_price_per_night) {
      return res.status(400).json({ success: false, message: 'Room type name and base price per night are required.' });
    }

    const newRoomType = {
      id: 'rt_' + Date.now(),
      hotel_id,
      name,
      description: description || '',
      max_occupancy: max_occupancy || 2,
      base_price_per_night: parseFloat(base_price_per_night),
      size_sqm: size_sqm || 30,
      bed_type: bed_type || 'King',
      amenities: amenities || [],
      images: images || [],
      created_at: new Date().toISOString()
    };

    inMemoryRoomTypes.push(newRoomType);

    return res.status(201).json({
      success: true,
      message: 'Room type added successfully.',
      data: newRoomType
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function addRoomInventory(req, res) {
  try {
    const { id: hotel_id } = req.params;
    const { room_type_id, room_numbers } = req.body;

    const hotel = inMemoryHotels.find(h => h.id === hotel_id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    if (!room_type_id || !Array.isArray(room_numbers) || room_numbers.length === 0) {
      return res.status(400).json({ success: false, message: 'room_type_id and an array of room_numbers are required.' });
    }

    const createdRooms = [];
    for (const num of room_numbers) {
      const roomObj = {
        id: 'rm_' + Date.now() + '_' + num,
        hotel_id,
        room_type_id,
        room_number: String(num),
        status: 'available'
      };
      inMemoryRooms.push(roomObj);
      createdRooms.push(roomObj);
    }

    return res.status(201).json({
      success: true,
      message: `${createdRooms.length} room units added to inventory.`,
      data: createdRooms
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  inMemoryHotels,
  inMemoryRoomTypes,
  inMemoryRooms,
  createHotel,
  getAllHotels,
  getHotelById,
  createRoomType,
  addRoomInventory
};
