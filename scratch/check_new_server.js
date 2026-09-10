const { Client } = require('d:/Henu/scratch/node_modules/ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('✅ Connected successfully!');
  conn.exec('pwd && whoami && ls -la && ls -la domains/ 2>/dev/null', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- Server Status & Folders ---');
      console.log(out);
      conn.end();
    });
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972',
  readyTimeout: 20000
});
