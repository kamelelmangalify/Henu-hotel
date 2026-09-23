const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getMasterStats } = require('../controllers/adminController');

// Master Admin Platform Analytics
router.get('/stats', authenticate, requireRole('admin'), getMasterStats);

module.exports = router;
