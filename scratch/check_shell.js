const { Client } = require('d:/Henu/scratch/node_modules/ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('✅ SSH Connected!');
  conn.shell({ term: 'xterm-color' }, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', (d) => {
      out += d.toString();
    });
    
    stream.write('pwd; ls -la; exit\n');
    
    stream.on('close', () => {
      console.log('--- Shell Output ---');
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
