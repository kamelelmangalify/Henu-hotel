const { inMemoryHotels } = require('./hotelController');
const { inMemoryBookings } = require('./searchController');

const inMemoryPayments = [
  {
    id: 'pay_demo_1',
    booking_id: 'bk_sample_1',
    gateway_name: 'Visa_Mastercard',
    transaction_reference: 'TXN-2026-981245',
    amount: 480.00,
    currency: 'USD',
    payment_status: 'success',
    created_at: new Date().toISOString()
  }
];

async function getMasterStats(req, res) {
  try {
    const totalHotels = inMemoryHotels.length;
    const totalBookings = inMemoryBookings.length;

    const grossVolume = inMemoryBookings.reduce((sum, b) => sum + (b.subtotal_stay_amount || 0), 0);
    const platformCommission = inMemoryBookings.reduce((sum, b) => sum + (b.commission_amount || 0), 0);
    const hotelPayouts = inMemoryBookings.reduce((sum, b) => sum + (b.hotel_payout_amount || 0), 0);

    return res.json({
      success: true,
      data: {
        total_hotels: totalHotels,
        total_bookings: totalBookings,
        gross_booking_volume: Math.round(grossVolume * 100) / 100,
        platform_commission_earnings_8pct: Math.round(platformCommission * 100) / 100,
        hotel_net_payouts_92pct: Math.round(hotelPayouts * 100) / 100,
        total_payments_processed: inMemoryPayments.length
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getMasterStats,
  inMemoryPayments
};
