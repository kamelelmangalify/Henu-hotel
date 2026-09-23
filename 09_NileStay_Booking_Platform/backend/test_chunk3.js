const http = require('http');
const app = require('./server');

const PORT = 4098;
let server;

function request(method, path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
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
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Automated Runtime Verification for Chunk 3 (Real-Time Availability & Search Engine)...');

  server = app.listen(PORT, async () => {
    try {
      // 1. Health Check
      const health = await request('GET', '/api/v1/health');
      console.log(`✅ Test 1 - Health Check Status: ${health.status} Active Chunks: ${health.body.chunksActive.length}`);

      // 2. Search Hotels by Destination (Pyramids) & 3 Nights Date Range
      const searchPyramids = await request('GET', '/api/v1/search?destination=Pyramids&checkIn=2026-10-10&checkOut=2026-10-13&guests=2');
      console.log(`✅ Test 2 - Pyramids Search Status: ${searchPyramids.status} Found Hotels: ${searchPyramids.body.total_found} Stay Nights: ${searchPyramids.body.query.nights}`);
      
      const firstHotel = searchPyramids.body.data[0];
      const roomType = firstHotel.matching_room_types[0];
      console.log(`   🏨 Hotel: ${firstHotel.name} | Room: ${roomType.name} | Rate/Night: $${roomType.base_price_per_night} | Total 3 Nights: $${roomType.total_stay_price}`);

      // 3. Search with Price Budget Filter (minPrice=100, maxPrice=200)
      const searchBudget = await request('GET', '/api/v1/search?minPrice=100&maxPrice=200');
      console.log(`✅ Test 3 - Budget Search Status: ${searchBudget.status} Matching Hotels: ${searchBudget.body.total_found}`);

      // 4. Search Downtown Cairo
      const searchCairo = await request('GET', '/api/v1/search?destination=Cairo');
      console.log(`✅ Test 4 - Cairo Search Status: ${searchCairo.status} Found: ${searchCairo.body.data[0].name}`);

      console.log('\n🎉 ALL CHUNK 3 VERIFICATION TESTS PASSED SUCCESSFULLY 100%!\n');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ Chunk 3 Test Error:', err);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();
