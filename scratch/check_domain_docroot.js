const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Inspecting Hostinger domain mapping and .htaccess...');

  const cmd = `
    echo "=== 1. Checking .htaccess in ~/public_html ==="
    cat ~/public_html/.htaccess 2>/dev/null || echo "No .htaccess in ~/public_html"

    echo "=== 2. Listing all subdirectories in ~/domains ==="
    ls -la ~/domains/*/public_html/ 2>/dev/null || true

    echo "=== 3. Checking qloapps in all public_html folders ==="
    find ~/ -name "qloapps" -type d 2>/dev/null
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
