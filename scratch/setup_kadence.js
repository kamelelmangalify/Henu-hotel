const { Client } = require('d:/Henu/scratch/node_modules/ssh2');
const conn = new Client();

console.log('Connecting to Hostinger to install Kadence...');

conn.on('ready', () => {
  const cmd = `
    cd ~/domains/henuhotel.com/public_html
    
    # 1. Install and activate Kadence Theme
    wp theme install kadence --activate
    
    # 2. Install and activate Kadence Blocks
    wp plugin install kadence-blocks --activate
    
    # 3. Create upload directory for hotel images
    mkdir -p wp-content/uploads/hotel
    
    # 4. Verify installation
    wp theme list
    wp plugin list
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('=== Kadence Setup Output ===\n' + out);
      conn.end();
    });
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972'
});
