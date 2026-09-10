const https = require('https');

https.get('https://henuhotel.com/?t=' + Date.now(), (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/<header[\s\S]*?<\/header>/i);
    if (match) {
      console.log('=== LIVE HEADER HTML ===\n' + match[0]);
    } else {
      console.log('No header tag found. First 500 chars of body:');
      const bodyMatch = data.match(/<body[\s\S]*?>([\s\S]{500})/i);
      console.log(bodyMatch ? bodyMatch[0] : data.substring(0, 500));
    }
  });
}).on('error', err => console.error(err));
