const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  conn.exec('find ~/domains -maxdepth 2 -type d', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('Domain folders:\n' + out);
      conn.end();
    });
  });
}).connect({
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972'
});
