const { inMemoryBookings } = require('./searchController');
const { inMemoryPayments } = require('./adminController');

async function processPaymentCheckout(req, res) {
  try {
    const { booking_id, gateway_name, card_token } = req.body;

    if (!booking_id) {
      return res.status(400).json({ success: false, message: 'booking_id is required.' });
    }

    const booking = inMemoryBookings.find(b => b.id === booking_id || b.reference_code === booking_id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking reference not found.' });
    }

    const txnRef = 'TXN-' + Date.now();
    const newTxn = {
      id: 'pay_' + Date.now(),
      booking_id: booking.id,
      gateway_name: gateway_name || 'Paymob',
      transaction_reference: txnRef,
      amount: booking.total_amount,
      currency: 'USD',
      payment_status: 'success',
      created_at: new Date().toISOString()
    };

    inMemoryPayments.push(newTxn);

    // Update booking payment status
    booking.payment_status = 'paid';

    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully via Payment Gateway!',
      data: {
        transaction_reference: txnRef,
        booking_reference: booking.reference_code,
        amount_paid: booking.total_amount,
        status: 'PAID'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  processPaymentCheckout
};
