const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Connected to Hostinger! Checking database u732967645_Ts3tN...');

  const cmd = `
    mysql -h 127.0.0.1 -u u732967645_m4qS2 -paXsOyZwKNR u732967645_Ts3tN -e "SHOW TABLES;"
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log('=== Tables in u732967645_Ts3tN ===\n' + out);
      conn.end();
    });
  });
}).connect({
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972'
});
