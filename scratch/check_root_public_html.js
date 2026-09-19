const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Connected to Hostinger! Inspecting root ~/public_html...');

  const cmd = `
    echo "=== Contents of ~/public_html ==="
    ls -la ~/public_html/
    
    echo "=== Checking if qloapps is in ~/public_html/ ==="
    ls -la ~/public_html/qloapps/ 2>/dev/null || echo "qloapps not in ~/public_html"
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log(out);
      conn.end();
    });
  });
}).connect({
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972'
});
