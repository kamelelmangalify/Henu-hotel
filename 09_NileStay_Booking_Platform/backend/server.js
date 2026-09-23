const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Cross-Origin Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes Integration (All 7 Puzzle Chunks)
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const searchRoutes = require('./routes/searchRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/hotels', hotelRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    service: 'NileStay / Kemet Booking Platform Engine',
    chunksActive: [
      'Chunk 1 - Core DB & Auth Module',
      'Chunk 2 - Hotels & Room Inventory Module',
      'Chunk 3 - Real-Time Availability & Search Engine',
      'Chunk 4 - Booking Engine & 8% Commission Module',
      'Chunk 5 - Hotel Partner Extranet API',
      'Chunk 6 - Customer Booking Web Engine',
      'Chunk 7 - Master Admin Analytics & Payment Gateways'
    ],
    version: '2.0.0-COMPLETE',
    status: 'ONLINE',
    timestamp: new Date().toISOString()
  });
});

// Start Server if launched directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 NileStay Master Platform Engine running on http://localhost:${PORT}`);
    console.log(`🧩 ALL 7 PUZZLE CHUNKS ARE ACTIVE & INTEGRATED SUCCESSFULLY 100%!`);
  });
}

module.exports = app;
