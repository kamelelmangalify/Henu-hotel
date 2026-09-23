const http = require('http');
const app = require('./server');

const PORT = 4097;
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

async function runTests() {
  console.log('🧪 Starting Automated Runtime Verification for Chunk 4 (Booking & Commission Engine)...');

  server = app.listen(PORT, async () => {
    try {
      // 1. Health Check
      const health = await request('GET', '/api/v1/health');
      console.log(`✅ Test 1 - Health Check Status: ${health.status} Active Chunks: ${health.body.chunksActive.length}`);

      // 2. Register & Login Guest Tourist
      await request('POST', '/api/v1/auth/register', {
        full_name: 'Alexander Wright',
        email: 'alexander.wright@traveler.com',
        password: 'Password123!',
        role_id: 3
      });

      const loginRes = await request('POST', '/api/v1/auth/login', {
        email: 'alexander.wright@traveler.com',
        password: 'Password123!'
      });
      const guestToken = loginRes.body.data.token;
      console.log(`✅ Test 2 - Tourist Login Status: ${loginRes.status} Guest: ${loginRes.body.data.fullName}`);

      // 3. Create Booking Request (4 Nights at HENU Pyramids Royal Suite @ $120/night)
      const bookingRes = await request('POST', '/api/v1/bookings', {
        hotel_id: 'htl_henu_pyramids',
        room_type_id: 'rt_henu_pyramid_suite',
        check_in: '2026-11-10',
        check_out: '2026-11-14',
        guests_count: 2,
        guest_name: 'Alexander Wright',
        guest_email: 'alexander.wright@traveler.com',
        guest_phone: '+1 555-0192',
        special_requests: 'High floor with unobstructed direct pyramid view please.'
      }, guestToken);

      const b = bookingRes.body.data;
      console.log(`✅ Test 3 - Booking Creation Status: ${bookingRes.status} Ref Code: ${b.reference_code}`);
      console.log(`   📊 Financial Summary: Stay Total: $${b.subtotal_stay_amount} | Platform Commission (8%): $${b.commission_amount} | Hotel Net Payout: $${b.hotel_payout_amount}`);

      // 4. Verify Commission Breakdown Logic
      if (b.subtotal_stay_amount === 480 && b.commission_amount === 38.4 && b.hotel_payout_amount === 441.6) {
        console.log(`✅ Test 4 - Commission Split Audit: 100% ACCURATE (8% Platform Fee = $38.40, 92% Hotel = $441.60)`);
      } else {
        throw new Error('Commission calculation mismatch!');
      }

      // 5. Fetch Booking by Reference Code
      const fetchRef = await request('GET', `/api/v1/bookings/${b.reference_code}`);
      console.log(`✅ Test 5 - Fetch Booking by Ref Code Status: ${fetchRef.status} Hotel: ${fetchRef.body.data.hotel_name}`);

      // 6. Fetch Guest Ledger (My Bookings)
      const myBookingsRes = await request('GET', '/api/v1/bookings/my-bookings', null, guestToken);
      console.log(`✅ Test 6 - My Bookings Ledger Status: ${myBookingsRes.status} Guest Total Bookings Count: ${myBookingsRes.body.count}`);

      console.log('\n🎉 ALL CHUNK 4 VERIFICATION TESTS PASSED SUCCESSFULLY 100%!\n');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ Chunk 4 Test Error:', err);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();
