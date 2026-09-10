const https = require('https');

https.get('https://henuhotel.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Error Page Text:\n' + data.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  });
});
