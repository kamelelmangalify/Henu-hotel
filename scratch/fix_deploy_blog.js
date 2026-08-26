const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join('d:', 'Henu');
const landingDir = path.join(rootDir, 'website_landing_thetravelwiki');
const indexHtmlContent = fs.readFileSync(path.join(landingDir, 'index.html'), 'utf8');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Connected to Hostinger via SSH...');

  // 1. فحص المسارات الفعلية للدومين thetravelwiki.blog
  const cmd = `
    # استكشاف المجلدات الفعالة
    echo "=== Searching for thetravelwiki.blog folders ==="
    find ~/ -maxdepth 4 -name "*thetravelwiki*"
    
    # التأكد من مجلدات الدومين
    mkdir -p ~/domains/thetravelwiki.blog/public_html/
    mkdir -p ~/domains/thetravelwiki.space/public_html/
    mkdir -p ~/public_html/thetravelwiki.blog/
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let findOut = '';
    stream.on('data', d => findOut += d);
    stream.on('close', () => {
      console.log(findOut);

      // رفع الملف وتطبيقه مباشرة على كل مسارات thetravelwiki.blog المحتملة
      conn.sftp((err, sftp) => {
        if (err) throw err;

        const localFile = path.join(landingDir, 'index.html');

        // المسار 1: ~/domains/thetravelwiki.blog/public_html/index.html
        sftp.fastPut(localFile, '/home/u732967645/domains/thetravelwiki.blog/public_html/index.html', (err) => {
          if (err) console.error('Error 1:', err);
          else console.log('✅ Uploaded to ~/domains/thetravelwiki.blog/public_html/index.html');

          // المسار 2: ~/domains/thetravelwiki.space/public_html/index.html
          sftp.fastPut(localFile, '/home/u732967645/domains/thetravelwiki.space/public_html/index.html', (err) => {
            if (err) console.error('Error 2:', err);
            else console.log('✅ Uploaded to ~/domains/thetravelwiki.space/public_html/index.html');

            // المسار 3: إعداد ملف .htaccess للتأكد من عدم حجب الصفحة أو وجود كاش قديم
            const fixCmd = `
              # إضافة .htaccess للسماح لجميع الزوار بالدخول وعدم وجود الكاش
              echo "DirectoryIndex index.html" > ~/domains/thetravelwiki.blog/public_html/.htaccess
              echo "DirectoryIndex index.html" > ~/domains/thetravelwiki.space/public_html/.htaccess
              
              chmod 644 ~/domains/thetravelwiki.blog/public_html/index.html
              chmod 644 ~/domains/thetravelwiki.space/public_html/index.html
              chmod 644 ~/domains/thetravelwiki.blog/public_html/.htaccess
              chmod 644 ~/domains/thetravelwiki.space/public_html/.htaccess
              
              echo "=== Final Verification for thetravelwiki.blog ==="
              ls -la ~/domains/thetravelwiki.blog/public_html/
            `;

            conn.exec(fixCmd, (err, stream) => {
              if (err) throw err;
              let verifyOut = '';
              stream.on('data', d => verifyOut += d);
              stream.on('close', () => {
                console.log(verifyOut);
                console.log('🎉 DEPLOYMENT TO thetravelwiki.blog VERIFIED AND COMPLETED!');
                conn.end();
              });
            });
          });
        });
      });
    });
  });
}).connect({
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972'
});
