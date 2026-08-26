const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join('d:', 'Henu');
const landingDir = path.join(rootDir, 'website_landing_thetravelwiki');
const zipPath = path.join(rootDir, 'thetravelwiki-landing.zip');

// 1. ضغط ملفات صفحة الهبوط
console.log('📦 Zipping landing page files...');
const zipCmd = `powershell -Command "Compress-Archive -Path '${path.join(landingDir, '*')}' -DestinationPath '${zipPath}' -Force"`;
execSync(zipCmd);
console.log('✅ Zip created at:', zipPath);

const sshConfig = {
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972',
  readyTimeout: 30000
};

console.log('🔌 Connecting to Hostinger server:', sshConfig.host + ':' + sshConfig.port);

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ SSH Connection successful!');

  // استكشاف مجلدات الدومين على هوستنجر
  const checkCmd = 'ls -la ~/domains/ && ls -la ~/public_html/';
  conn.exec(checkCmd, (err, stream) => {
    if (err) throw err;
    let checkOut = '';
    stream.on('data', d => checkOut += d);
    stream.on('close', () => {
      console.log('📁 Server Domains Listing:\n' + checkOut);

      // رفع الـ Zip عبر SFTP
      conn.sftp((err, sftp) => {
        if (err) {
          console.error('❌ SFTP Error:', err);
          conn.end();
          return;
        }

        const remoteZip = 'thetravelwiki-landing.zip';
        console.log(`📤 Uploading ${zipPath} to remote ${remoteZip}...`);

        sftp.fastPut(zipPath, remoteZip, (err) => {
          if (err) {
            console.error('❌ Upload Error:', err);
            conn.end();
            return;
          }

          console.log('✅ Upload complete! Deploying to thetravelwiki.space...');

          // أوامر فك الضغط وتوزيع الهبوط في المجلدات المناسبة للدومين
          const deployCmd = `
            # إنشاء مجلدات الدومين لـ thetravelwiki.space
            mkdir -p ~/domains/thetravelwiki.space/public_html/
            mkdir -p ~/domains/thetravelwiki.blog/public_html/
            
            # فك الضغط في thetravelwiki.space
            unzip -o thetravelwiki-landing.zip -d ~/domains/thetravelwiki.space/public_html/
            
            # فك الضغط في thetravelwiki.blog إن وجد
            if [ -d "~/domains/thetravelwiki.blog" ]; then
              unzip -o thetravelwiki-landing.zip -d ~/domains/thetravelwiki.blog/public_html/
            fi

            # ضبط الصلاحيات وتنظيف الزيب
            chmod -R 755 ~/domains/thetravelwiki.space/public_html/
            rm -f thetravelwiki-landing.zip

            echo "=== Contents of thetravelwiki.space/public_html ==="
            ls -la ~/domains/thetravelwiki.space/public_html/
          `;

          conn.exec(deployCmd, (err, stream) => {
            if (err) throw err;
            let deployOut = '';
            stream.on('data', d => deployOut += d);
            stream.on('close', (code) => {
              console.log(deployOut);
              console.log('\n======================================================');
              console.log('🚀 LANDING PAGE DEPLOYED TO HOSTINGER (thetravelwiki.space) SUCCESSFULLY!');
              console.log('======================================================');
              
              // تنظيف ملف الزيب المحلي
              try { fs.unlinkSync(zipPath); } catch(e) {}
              conn.end();
            });
          });
        });
      });
    });
  });
}).on('error', (err) => {
  console.error('❌ Connection Error:', err);
}).connect(sshConfig);
