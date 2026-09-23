const express = require('express');
const router = express.Router();
const { processPaymentCheckout } = require('../controllers/paymentController');

// Gateway Payment Checkout
router.post('/checkout', processPaymentCheckout);

module.exports = router;
