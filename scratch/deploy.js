const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972',
  readyTimeout: 30000
};

console.log('Connecting to Hostinger server:', config.host + ':' + config.port);

const conn = new Client();

conn.on('ready', () => {
  console.log('SSH Connection successful!');

  // Check remote directories first
  conn.exec('pwd && ls -la', (err, stream) => {
    if (err) throw err;
    let output = '';
    stream.on('close', (code, signal) => {
      console.log('Current directory listing:\n' + output);

      // Now open SFTP to upload the zip
      conn.sftp((err, sftp) => {
        if (err) {
          console.error('SFTP Error:', err);
          conn.end();
          return;
        }

        const localZip = 'd:/Henu/henu-website.zip';
        const remoteZip = 'henu-website.zip';

        console.log('Uploading ' + localZip + ' to remote ' + remoteZip + '...');
        sftp.fastPut(localZip, remoteZip, (err) => {
          if (err) {
            console.error('Upload Error:', err);
            conn.end();
            return;
          }

          console.log('Upload complete! Extracting into public_html...');

          // Unzip and fix permissions
          const cmd = 'unzip -o henu-website.zip -d public_html/ && ls -la public_html/ && rm -f henu-website.zip';
          conn.exec(cmd, (err, stream) => {
            if (err) throw err;
            let extractOutput = '';
            stream.on('close', (code) => {
              console.log('Extract command finished with code ' + code);
              console.log('public_html contents:\n' + extractOutput);
              console.log('\n========================================');
              console.log('🎉 DEPLOYMENT TO HOSTINGER SUCCESSFUL!');
              console.log('========================================');
              conn.end();
            }).on('data', (data) => {
              extractOutput += data;
            }).stderr.on('data', (data) => {
              console.error('STDERR:', data.toString());
            });
          });
        });
      });
    }).on('data', (data) => {
      output += data;
    });
  });
}).on('error', (err) => {
  console.error('Connection Error:', err);
}).connect(config);
