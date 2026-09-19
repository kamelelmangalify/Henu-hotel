const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Connected to Hostinger via SSH...');

  const cmd = `
    echo "=== 1. Searching for henuhotel.com domain directories ==="
    ls -la ~/domains/
    
    echo "=== 2. Checking MySQL command-line availability & databases ==="
    which mysql || echo "mysql CLI not in PATH"
    
    # محاولة فحص الاتصال بـ MySQL المحلي على السيرفر
    mysql -u root -e "SHOW DATABASES;" 2>&1 || true
    
    echo "=== 3. Checking existing configuration files or databases ==="
    find ~/ -name "wp-config.php" -o -name "settings.inc.php" -o -name ".env" 2>/dev/null | head -n 10
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
