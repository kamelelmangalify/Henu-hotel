const { Client } = require('d:/Henu/scratch/node_modules/ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Configuring site title, permalinks, and Kadence settings...');
  const cmd = `
    cd ~/domains/henuhotel.com/public_html

    # 1. Update Site Title & Tagline
    wp option update blogname "HENU Pyramids Hotel"
    wp option update blogdescription "Where Ancient Wonders Meet Modern Comfort"

    # 2. Set Permalinks to Post Name (%postname%)
    wp rewrite structure '/%postname%/' --hard

    # 3. Purge LiteSpeed Cache
    wp litespeed-purge all 2>/dev/null || true

    # 4. Verify Options
    echo "Site URL: $(wp option get siteurl)"
    echo "Home: $(wp option get home)"
    echo "Blogname: $(wp option get blogname)"
    echo "Permalinks: $(wp option get permalink_structure)"
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('=== Config Output ===\n' + out);
      conn.end();
    });
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972'
});
