const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Checking QloApps installation progress on Hostinger...');

  const cmd = `
    echo "=== 1. Checking settings.inc.php ==="
    ls -la ~/public_html/qloapps/config/settings.inc.php 2>/dev/null || echo "settings.inc.php not yet created"

    echo "=== 2. Checking QloApps database tables ==="
    mysql -h 127.0.0.1 -u u732967645_m4qS2 -paXsOyZwKNR u732967645_Ts3tN -e "SHOW TABLES LIKE 'qlo_%';" 2>&1
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
