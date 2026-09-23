const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createBooking,
  getBookingById,
  getMyBookings
} = require('../controllers/bookingController');

// Public or Guest Booking Endpoint
router.post('/', createBooking);

// Protected My Bookings
router.get('/my-bookings', authenticate, getMyBookings);

// Booking Lookup by ID or Reference Code
router.get('/:id', getBookingById);

module.exports = router;
