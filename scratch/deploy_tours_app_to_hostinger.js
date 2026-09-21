const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const appFile = path.join('d:', 'Henu', '05_Tourist_Attractions_App', 'index.html');
const appContent = fs.readFileSync(appFile, 'utf8');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Connected to Hostinger! Deploying iPad Tours App...');

  const cmd = `
    mkdir -p ~/domains/thetravelwiki.space/public_html/tours/
    mkdir -p ~/domains/thetravelwiki.blog/public_html/tours/
    mkdir -p ~/public_html/tours/

    cat << 'EOF' > ~/domains/thetravelwiki.space/public_html/tours/index.html
${appContent}
EOF

    cp ~/domains/thetravelwiki.space/public_html/tours/index.html ~/domains/thetravelwiki.blog/public_html/tours/index.html
    cp ~/domains/thetravelwiki.space/public_html/tours/index.html ~/public_html/tours/index.html

    chmod -R 755 ~/domains/thetravelwiki.space/public_html/tours/
    chmod -R 755 ~/domains/thetravelwiki.blog/public_html/tours/
    chmod -R 755 ~/public_html/tours/

    echo "=== Verification of Tours App on Hostinger ==="
    ls -la ~/domains/thetravelwiki.space/public_html/tours/
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log(out);
      console.log('🎉 TOURS APP DEPLOYED TO HOSTINGER SUCCESSFULLY!');
      conn.end();
    });
  });
}).connect({
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972'
});
