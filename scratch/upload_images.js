const fs = require('fs');
const path = require('path');
const { Client } = require('d:/Henu/scratch/node_modules/ssh2');

const localImagesDir = 'd:/Henu/website/images';
const conn = new Client();

console.log('Connecting to upload hotel images to WordPress...');

conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;

    const remoteBase = 'domains/henuhotel.com/public_html/wp-content/uploads/hotel';

    function uploadFile(localPath, remotePath) {
      return new Promise((resolve, reject) => {
        sftp.fastPut(localPath, remotePath, (err) => {
          if (err) reject(err);
          else {
            console.log(`Uploaded: ${path.basename(localPath)}`);
            resolve();
          }
        });
      });
    }

    async function run() {
      // 1. Upload Logo
      const logoLocal = path.join(localImagesDir, 'logo.jpg');
      if (fs.existsSync(logoLocal)) {
        await uploadFile(logoLocal, `${remoteBase}/logo.jpg`);
      }

      // 2. Upload Hotel Photos
      const hotelDir = path.join(localImagesDir, 'hotel');
      const files = fs.readdirSync(hotelDir);
      for (const file of files) {
        const localP = path.join(hotelDir, file);
        if (fs.statSync(localP).isFile()) {
          await uploadFile(localP, `${remoteBase}/${file}`);
        }
      }

      console.log('All images uploaded successfully to WordPress!');
      conn.end();
    }

    run().catch(e => {
      console.error('Upload error:', e);
      conn.end();
    });
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972'
});
