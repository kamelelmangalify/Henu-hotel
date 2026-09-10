const { Client } = require('d:/Henu/scratch/node_modules/ssh2');
const conn = new Client();

console.log('Connecting to new Hostinger server (89.117.169.80:65002)...');

conn.on('ready', () => {
  console.log('✅ SSH Connection SUCCESSFUL!');
  
  conn.exec('pwd && whoami && ls -la && ls -la domains/ 2>/dev/null', (err, stream) => {
    if (err) {
      console.error('Exec error:', err);
      conn.end();
      return;
    }
    
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('\n--- Server Info & Directories ---');
      console.log(out);
      console.log('---------------------------------');
      conn.end();
    });
  });
}).on('error', (err) => {
  console.error('❌ Connection failed:', err.message);
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972',
  readyTimeout: 20000
});
