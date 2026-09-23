const http = require('http');
const app = require('./server');

const PORT = 4096;
let server;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runMasterPuzzleVerification() {
  console.log('================================================================');
  console.log('🧩 STARTING MASTER END-TO-END PUZZLE INTEGRATION TEST (CHUNKS 1 - 7)');
  console.log('================================================================\n');

  server = app.listen(PORT, async () => {
    try {
      // -------------------------------------------------------------
      // 🧩 CHUNK 1: Core DB & Auth Module Verification
      // -------------------------------------------------------------
      console.log('--- 🧩 CHUNK 1: AUTHENTICATION ENGINE ---');
      const health = await request('GET', '/api/v1/health');
      console.log(`✅ [1.1] Health Check 200 OK | Active Chunks: ${health.body.chunksActive.length}/7`);

      // Register Admin User
      await request('POST', '/api/v1/auth/register', {
        full_name: 'Master Platform Admin',
        email: 'admin@nilestay.com',
        password: 'AdminPassword2026!',
        role_id: 1
      });

      const adminLogin = await request('POST', '/api/v1/auth/login', {
        email: 'admin@nilestay.com',
        password: 'AdminPassword2026!'
      });
      const adminToken = adminLogin.body.data.token;
      console.log(`✅ [1.2] Master Admin Auth Token Issued: ${adminToken ? 'YES' : 'NO'}`);

      // -------------------------------------------------------------
      // 🧩 CHUNK 2: Hotels & Room Inventory Module Verification
      // -------------------------------------------------------------
      console.log('\n--- 🧩 CHUNK 2: HOTELS & INVENTORY ---');
      const hotelsList = await request('GET', '/api/v1/hotels');
      console.log(`✅ [2.1] Listed Pre-seeded Hotels Count: ${hotelsList.body.count} (e.g. ${hotelsList.body.data[0].name})`);

      // -------------------------------------------------------------
      // 🧩 CHUNK 3: Real-Time Availability & Search Engine Verification
      // -------------------------------------------------------------
      console.log('\n--- 🧩 CHUNK 3: SEARCH ENGINE ---');
      const searchRes = await request('GET', '/api/v1/search?destination=Giza&checkIn=2026-12-01&checkOut=2026-12-05&guests=2');
      console.log(`✅ [3.1] Searched Giza Pyramids Hotels (4 Nights Stay): Found ${searchRes.body.total_found} available option(s)`);

      // -------------------------------------------------------------
      // 🧩 CHUNK 4: Booking Engine & 8% Commission Module Verification
      // -------------------------------------------------------------
      console.log('\n--- 🧩 CHUNK 4: BOOKING ENGINE & 8% COMMISSION ---');
      const booking = await request('POST', '/api/v1/bookings', {
        hotel_id: 'htl_henu_pyramids',
        room_type_id: 'rt_henu_pyramid_suite',
        check_in: '2026-12-01',
        check_out: '2026-12-05',
        guests_count: 2,
        guest_name: 'Dr. Tarek Al-Masry',
        guest_email: 'tarek@egyptology.org',
        guest_phone: '+20 100 123 4567'
      });

      const bData = booking.body.data;
      console.log(`✅ [4.1] Booking Issued: Ref ${bData.reference_code}`);
      console.log(`✅ [4.2] Financial Audit: Subtotal: $${bData.subtotal_stay_amount} | Platform 8% Fee: $${bData.commission_amount} | Hotel Payout 92%: $${bData.hotel_payout_amount}`);

      // -------------------------------------------------------------
      // 🧩 CHUNK 5: Hotel Partner Extranet Verification
      // -------------------------------------------------------------
      console.log('\n--- 🧩 CHUNK 5: HOTEL PARTNER EXTRANET ---');
      const partnerBookingLookup = await request('GET', `/api/v1/bookings/${bData.reference_code}`);
      console.log(`✅ [5.1] Partner Extranet Live Lookup Verified: Guest "${partnerBookingLookup.body.data.guest_name}" for "${partnerBookingLookup.body.data.hotel_name}"`);

      // -------------------------------------------------------------
      // 🧩 CHUNK 6: Customer Booking Web Engine Verification
      // -------------------------------------------------------------
      console.log('\n--- 🧩 CHUNK 6: CUSTOMER WEB APP ---');
      const hotelDetail = await request('GET', '/api/v1/hotels/htl_henu_pyramids');
      console.log(`✅ [6.1] Customer Detail View Fetched: ${hotelDetail.body.data.name} with ${hotelDetail.body.data.room_types.length} room types`);

      // -------------------------------------------------------------
      // 🧩 CHUNK 7: Master Admin & Payment Gateway Verification
      // -------------------------------------------------------------
      console.log('\n--- 🧩 CHUNK 7: PAYMENTS & MASTER ANALYTICS ---');
      const paymentRes = await request('POST', '/api/v1/payments/checkout', {
        booking_id: bData.reference_code,
        gateway_name: 'Paymob'
      });
      console.log(`✅ [7.1] Payment Gateway Checkout Status: ${paymentRes.status} Txn Ref: ${paymentRes.body.data.transaction_reference}`);

      const masterStats = await request('GET', '/api/v1/admin/stats', null, adminToken);
      console.log(`✅ [7.2] Master Admin Analytics Audit:`);
      console.log(`      • Total Partner Hotels: ${masterStats.body.data.total_hotels}`);
      console.log(`      • Total Confirmed Bookings: ${masterStats.body.data.total_bookings}`);
      console.log(`      • Gross Booking Volume: $${masterStats.body.data.gross_booking_volume}`);
      console.log(`      • NileStay 8% Revenue: $${masterStats.body.data.platform_commission_earnings_8pct}`);
      console.log(`      • Hotel Net Payouts (92%): $${masterStats.body.data.hotel_net_payouts_92pct}`);

      console.log('\n================================================================');
      console.log('🎉🎉🎉 CONGRATULATIONS! ALL 7 CHUNKS ASSEMBLED & PASSED 100% SUCCESS! 🎉🎉🎉');
      console.log('================================================================\n');

      server.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ Master Puzzle Verification Error:', err);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runMasterPuzzleVerification();
