const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Connected to Hostinger via SSH...');

  const cmd = `
    echo "=== Reading MySQL credentials from existing wp-config.php ==="
    grep -E "DB_NAME|DB_USER|DB_PASSWORD|DB_HOST" /home/u732967645/domains/thetravelwiki.blog/public_html/wp-config.php
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
