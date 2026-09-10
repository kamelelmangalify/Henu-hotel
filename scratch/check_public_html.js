const { Client } = require('d:/Henu/scratch/node_modules/ssh2');
const conn = new Client();

conn.on('ready', () => {
  conn.exec('ls -la ~/domains/henuhotel.com/public_html/ && wp --info 2>/dev/null', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('Public HTML contents:\n' + out);
      conn.end();
    });
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972'
});
