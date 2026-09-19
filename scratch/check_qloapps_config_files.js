const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Checking qloapps directory structure after install...');

  const cmd = `
    echo "=== Checking config directory in thetravelwiki.blog/public_html/qloapps/config ==="
    ls -la ~/domains/thetravelwiki.blog/public_html/qloapps/config/
    
    echo "=== Checking root public_html/qloapps/config ==="
    ls -la ~/public_html/qloapps/config/

    echo "=== Checking admin folder in qloapps ==="
    ls -d ~/domains/thetravelwiki.blog/public_html/qloapps/admin*
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
