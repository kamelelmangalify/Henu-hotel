const { Client } = require('d:/Henu/scratch/node_modules/ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('✅ Connected successfully!');
  
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP Error:', err);
      conn.end();
      return;
    }
    
    console.log('✅ SFTP is working perfectly!');
    sftp.readdir('.', (err, list) => {
      if (err) {
        console.error('Readdir error:', err);
      } else {
        console.log('Home files & folders:');
        console.log(list.map(item => item.filename));
      }
      
      // Check if domains folder exists
      sftp.readdir('domains', (err2, dList) => {
        if (!err2 && dList) {
          console.log('Domains list:', dList.map(item => item.filename));
        } else {
          console.log('No separate domains folder yet.');
        }
        conn.end();
      });
    });
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972',
  readyTimeout: 20000
});
