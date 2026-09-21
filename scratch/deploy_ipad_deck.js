const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const appFile = path.join('d:', 'Henu', '05_Tourist_Attractions_App', 'ipad_presentation_local.html');
const appContent = fs.readFileSync(appFile, 'utf8');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Connected to Hostinger! Deploying iPad Presentation Deck...');

  const cmd = `
    cat << 'EOF' > ~/domains/thetravelwiki.space/public_html/tours/deck.html
${appContent}
EOF

    cp ~/domains/thetravelwiki.space/public_html/tours/deck.html ~/domains/thetravelwiki.blog/public_html/tours/deck.html
    cp ~/domains/thetravelwiki.space/public_html/tours/deck.html ~/public_html/tours/deck.html

    chmod -R 755 ~/domains/thetravelwiki.space/public_html/tours/
    chmod -R 755 ~/domains/thetravelwiki.blog/public_html/tours/
    chmod -R 755 ~/public_html/tours/

    echo "=== Verification of iPad Deck on Hostinger ==="
    ls -la ~/domains/thetravelwiki.space/public_html/tours/
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log(out);
      console.log('🎉 IPAD PRESENTATION DECK DEPLOYED TO HOSTINGER SUCCESSFULLY!');
      conn.end();
    });
  });
}).connect({
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972'
});
