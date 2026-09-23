const express = require('express');
const router = express.Router();
const { searchHotels } = require('../controllers/searchController');

// GET /api/v1/search (Real-Time Availability & Filter Engine)
router.get('/', searchHotels);

module.exports = router;
