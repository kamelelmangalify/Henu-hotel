const app = require('./server');
const http = require('http');

let server;
const PORT = 4099;

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
        } catch(e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Automated Runtime Verification for Chunk 1 (Core DB & Auth)...');
  server = app.listen(PORT);

  try {
    // 1. Health Check
    const health = await request('GET', '/api/v1/health');
    console.log('✅ Test 1 - Health Check Status:', health.status, health.body.service);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Register Tourist Guest
    const guestReg = await request('POST', '/api/v1/auth/register', {
      full_name: 'John Tourist',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1 202 555 0147',
      role_id: 3
    });
    console.log('✅ Test 2 - Tourist Guest Registration Status:', guestReg.status, 'Token Issued:', !!guestReg.body.data?.token);
    if (guestReg.status !== 201) throw new Error('Guest registration failed');

    // 3. Register Hotel Owner (HENU Hotel Partner)
    const ownerReg = await request('POST', '/api/v1/auth/register', {
      full_name: 'Nasr Desouky (HENU Hotel)',
      email: 'nasr@henuhotel.com',
      password: 'henu_password_2026',
      phone: '+20 122 260 0296',
      role_id: 2
    });
    console.log('✅ Test 3 - Hotel Partner Registration Status:', ownerReg.status, 'Role Assigned:', ownerReg.body.data?.role);
    if (ownerReg.status !== 201 || ownerReg.body.data.role !== 'hotel_owner') throw new Error('Owner registration failed');

    // 4. Login Test
    const loginRes = await request('POST', '/api/v1/auth/login', {
      email: 'nasr@henuhotel.com',
      password: 'henu_password_2026'
    });
    console.log('✅ Test 4 - Login Verification Status:', loginRes.status, 'Logged User:', loginRes.body.data?.fullName);
    if (loginRes.status !== 200 || !loginRes.body.data.token) throw new Error('Login verification failed');

    // 5. JWT Auth Profile Fetch (/me)
    const ownerToken = loginRes.body.data.token;
    const meRes = await request('GET', '/api/v1/auth/me', null, ownerToken);
    console.log('✅ Test 5 - Protected Profile Fetch Status:', meRes.status, 'Verified Email:', meRes.body.data?.email);
    if (meRes.status !== 200 || meRes.body.data.email !== 'nasr@henuhotel.com') throw new Error('JWT verification failed');

    console.log('\n🎉 ALL CHUNK 1 VERIFICATION TESTS PASSED SUCCESSFULLY 100%!');
  } catch (err) {
    console.error('❌ Verification Error:', err.message);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
