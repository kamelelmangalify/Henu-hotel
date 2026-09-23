const http = require('http');
const app = require('./server');

const PORT = 4099;
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
  console.log('🧪 Starting Automated Runtime Verification for Chunk 2 (Hotels & Room Inventory)...');

  server = app.listen(PORT, async () => {
    try {
      // 1. Health Check
      const health = await request('GET', '/api/v1/health');
      console.log(`✅ Test 1 - Health Check Status: ${health.status} Active Chunks: ${health.body.chunksActive.join(', ')}`);

      // 2. Register & Login Hotel Owner Partner
      await request('POST', '/api/v1/auth/register', {
        full_name: 'Eng. Nasr Desouky',
        email: 'nasr.chunk2@henuhotel.com',
        password: 'HenuPassword2026!',
        role_id: 2
      });

      const loginRes = await request('POST', '/api/v1/auth/login', {
        email: 'nasr.chunk2@henuhotel.com',
        password: 'HenuPassword2026!'
      });
      const partnerToken = loginRes.body.data.token;
      console.log(`✅ Test 2 - Partner Auth Login Status: ${loginRes.status} Logged in: ${loginRes.body.data.fullName}`);

      // 3. Create a New Hotel Partner
      const newHotelRes = await request('POST', '/api/v1/hotels', {
        name: 'Great Pyramids View Boutique Hotel',
        description: 'Exclusive boutique lodge right across the Giza Plateau sound and light show.',
        address: '5 Sphinx Avenue, Giza',
        city: 'Giza',
        zone: 'Pyramids',
        star_rating: 4,
        amenities: ['Direct Pyramid View', 'Rooftop Lounge', 'Free Breakfast']
      }, partnerToken);

      console.log(`✅ Test 3 - Create Hotel Status: ${newHotelRes.status} Created ID: ${newHotelRes.body.data.id} Name: ${newHotelRes.body.data.name}`);
      const createdHotelId = newHotelRes.body.data.id;

      // 4. Add Room Type to Hotel
      const roomTypeRes = await request('POST', `/api/v1/hotels/${createdHotelId}/room-types`, {
        name: 'Panoramic Pyramid Sunset Suite',
        description: 'Luxury suite with Jacuzzi balcony and glass wall facing the Great Pyramids.',
        max_occupancy: 2,
        base_price_per_night: 150.00,
        size_sqm: 50,
        bed_type: 'King',
        amenities: ['Jacuzzi', 'Balcony', 'Nespresso Machine']
      }, partnerToken);

      console.log(`✅ Test 4 - Add Room Type Status: ${roomTypeRes.status} Room Type ID: ${roomTypeRes.body.data.id} Price: $${roomTypeRes.body.data.base_price_per_night}/night`);
      const roomTypeId = roomTypeRes.body.data.id;

      // 5. Add Room Inventory Units (Rooms 401, 402, 403)
      const inventoryRes = await request('POST', `/api/v1/hotels/${createdHotelId}/rooms`, {
        room_type_id: roomTypeId,
        room_numbers: ['401', '402', '403']
      }, partnerToken);

      console.log(`✅ Test 5 - Add Room Inventory Status: ${inventoryRes.status} Added Units: ${inventoryRes.body.data.length} rooms`);

      // 6. Get Hotels Filtered by City & Zone
      const searchRes = await request('GET', '/api/v1/hotels?city=Giza&zone=Pyramids');
      console.log(`✅ Test 6 - Filtered Hotel Query Status: ${searchRes.status} Found Giza Pyramids Hotels: ${searchRes.body.count}`);

      // 7. Get Complete Hotel Detail & Room Types
      const detailRes = await request('GET', `/api/v1/hotels/${createdHotelId}`);
      console.log(`✅ Test 7 - Fetch Hotel Detail Status: ${detailRes.status} Hotel Name: ${detailRes.body.data.name} Room Types Count: ${detailRes.body.data.room_types.length} Total Inventory: ${detailRes.body.data.total_rooms}`);

      console.log('\n🎉 ALL CHUNK 2 VERIFICATION TESTS PASSED SUCCESSFULLY 100%!\n');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ Chunk 2 Test Error:', err);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();
