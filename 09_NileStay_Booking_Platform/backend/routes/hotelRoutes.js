const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
  createHotel,
  getAllHotels,
  getHotelById,
  createRoomType,
  addRoomInventory
} = require('../controllers/hotelController');

// Public Routes
router.get('/', getAllHotels);
router.get('/:id', getHotelById);

// Protected Partner / Admin Routes
router.post('/', authenticate, requireRole('hotel_owner', 'admin'), createHotel);
router.post('/:id/room-types', authenticate, requireRole('hotel_owner', 'admin'), createRoomType);
router.post('/:id/rooms', authenticate, requireRole('hotel_owner', 'admin'), addRoomInventory);

module.exports = router;
