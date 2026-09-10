const https = require('https');

https.get('https://henuhotel.com/?t=' + Date.now(), (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    const hasFooter = data.includes('henu-footer');
    const hasAddress21 = data.includes('21 Gamal Abdel Nasser');
    const hasMapsUrl = data.includes('https://maps.app.goo.gl/N5mhKZM6KQVVA9z26');
    const hasCardImg = data.includes('henu-card-img');
    
    console.log('✅ Has Executive Footer:', hasFooter);
    console.log('✅ Has 21 Gamal Abdel Nasser St:', hasAddress21);
    console.log('✅ Has Correct Google Maps Link:', hasMapsUrl);
    console.log('✅ Has Uniform Card Images:', hasCardImg);

    const footerMatch = data.match(/<footer[\s\S]*?<\/footer>/i);
    if (footerMatch) {
      console.log('\n=== FOOTER PREVIEW (First 400 chars) ===\n' + footerMatch[0].substring(0, 400));
    }
  });
}).on('error', err => console.error(err));
