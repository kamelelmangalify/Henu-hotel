const { Client } = require('d:/Henu/scratch/node_modules/ssh2');
const conn = new Client();

conn.on('ready', () => {
  conn.exec(`php -l ~/domains/henuhotel.com/public_html/wp-content/mu-plugins/*.php`, (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('PHP Lint Output:\n' + out);
      conn.end();
    });
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972'
});
