const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Connected to Hostinger. Setting up henu.traveldeals.space...');
  
  const cmd = `
    # Create subdomain directories in both standard Hostinger locations
    mkdir -p ~/domains/traveldeals.space/public_html/henu
    mkdir -p ~/domains/traveldeals.space/henu/public_html
    mkdir -p ~/domains/traveldeals.space/henu

    # Copy all website files into all potential subdomain folder paths
    cp -r ~/public_html/* ~/domains/traveldeals.space/public_html/henu/
    cp -r ~/public_html/* ~/domains/traveldeals.space/henu/public_html/
    cp -r ~/public_html/* ~/domains/traveldeals.space/henu/

    # Ensure permissions are correct
    chmod -R 755 ~/domains/traveldeals.space/public_html/henu
    chmod -R 755 ~/domains/traveldeals.space/henu

    # List contents
    echo "=== Contents of public_html/henu ==="
    ls -la ~/domains/traveldeals.space/public_html/henu
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log(out);
      console.log('Subdomain setup completed with exit code ' + code);
      conn.end();
    });
  });
}).connect({
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972'
});
