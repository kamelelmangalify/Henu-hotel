const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Client } = require('ssh2');

const rootDir = path.join('d:', 'Henu');
const qloDir = path.join(rootDir, 'QloApps');
const zipPath = path.join(rootDir, 'qloapps.zip');

console.log('📦 Zipping QloApps files...');

// الضغط المباشر لملفات QloApps
const zipCmd = `powershell -Command "Compress-Archive -Path '${path.join(qloDir, '*')}' -DestinationPath '${zipPath}' -Force"`;
execSync(zipCmd);
console.log('✅ Zip created at:', zipPath);

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Connected to Hostinger via SSH! Uploading QloApps...');

  conn.sftp((err, sftp) => {
    if (err) throw err;

    const remoteZip = 'qloapps.zip';
    console.log(`📤 Uploading ${zipPath} to Hostinger server...`);

    sftp.fastPut(zipPath, remoteZip, (err) => {
      if (err) {
        console.error('❌ Upload Error:', err);
        conn.end();
        return;
      }

      console.log('✅ Upload complete! Extracting QloApps into public_html/qloapps/ ...');

      const deployCmd = `
        # إنشاء مجلدات qloapps على كل الدومينات
        mkdir -p ~/domains/thetravelwiki.space/public_html/qloapps/
        mkdir -p ~/domains/thetravelwiki.blog/public_html/qloapps/

        # فك الضغط والتأكد من الملفات
        unzip -o qloapps.zip -d ~/domains/thetravelwiki.space/public_html/qloapps/
        unzip -o qloapps.zip -d ~/domains/thetravelwiki.blog/public_html/qloapps/

        # ضبط الصلاحيات
        chmod -R 755 ~/domains/thetravelwiki.space/public_html/qloapps/
        chmod -R 755 ~/domains/thetravelwiki.blog/public_html/qloapps/

        rm -f qloapps.zip

        echo "=== Verification of qloapps deployment ==="
        ls -la ~/domains/thetravelwiki.space/public_html/qloapps/
      `;

      conn.exec(deployCmd, (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('data', d => out += d);
        stream.on('close', (code) => {
          console.log(out);
          console.log('🎉 QLOAPPS DEPLOYED AND RUNNING ON HOSTINGER SUCCESSFULLY!');
          try { fs.unlinkSync(zipPath); } catch(e) {}
          conn.end();
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
