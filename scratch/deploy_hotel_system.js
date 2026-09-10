const { Client } = require('d:/Henu/scratch/node_modules/ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
const localDir = 'D:/Henu/hotel_system_25';

conn.on('ready', () => {
  console.log('Connected to server via SSH.');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      return;
    }

    const files = ['index.html', 'style.css', 'app.js', 'firebase-config.js', 'logo.jpg', 'logo.png', '.htaccess'];
    const targets = [
      '/home/u535479989/domains/henuhotel.com/public_html/booking',
      '/home/u535479989/domains/booking.henuhotel.com/public_html'
    ];

    // Create directories if needed via mkdir
    let targetIdx = 0;

    const processTarget = () => {
      if (targetIdx >= targets.length) {
        console.log('🎉 All deployments completed successfully!');
        conn.end();
        return;
      }

      const targetDir = targets[targetIdx++];
      console.log(`\nDeploying to: ${targetDir}`);

      // Ensure directory exists
      sftp.mkdir(targetDir, (mkdirErr) => {
        // Ignore error if directory already exists
        let fileIdx = 0;
        const uploadNext = () => {
          if (fileIdx >= files.length) {
            processTarget();
            return;
          }

          const file = files[fileIdx++];
          const src = path.join(localDir, file);
          const dst = targetDir + '/' + file;

          if (!fs.existsSync(src)) {
            uploadNext();
            return;
          }

          sftp.fastPut(src, dst, (putErr) => {
            if (putErr) {
              console.error(`❌ Failed: ${file} -> ${putErr.message}`);
            } else {
              console.log(`✅ Uploaded: ${file}`);
            }
            uploadNext();
          });
        };

        uploadNext();
      });
    };

    processTarget();
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972'
});
