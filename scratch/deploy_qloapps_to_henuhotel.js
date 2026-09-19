const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Connected to Hostinger! Deploying QloApps to henuhotel.com (root public_html)...');

  const cmd = `
    # إنشاء مجلد qloapps في الجذر الرئيسي ~/public_html/qloapps
    mkdir -p ~/public_html/qloapps/
    cp -r ~/domains/thetravelwiki.space/public_html/qloapps/* ~/public_html/qloapps/
    chmod -R 755 ~/public_html/qloapps/

    # أيضاً إنشاء مجلد للدومين إذا كان مضافاً كمستقل
    mkdir -p ~/domains/henuhotel.com/public_html/qloapps/ 2>/dev/null || true
    if [ -d "~/domains/henuhotel.com" ]; then
      cp -r ~/domains/thetravelwiki.space/public_html/qloapps/* ~/domains/henuhotel.com/public_html/qloapps/
      chmod -R 755 ~/domains/henuhotel.com/public_html/qloapps/
    fi

    echo "=== Verification of qloapps in ~/public_html/qloapps ==="
    ls -la ~/public_html/qloapps/install/
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log(out);
      console.log('🎉 QLOAPPS DEPLOYED TO HENUHOTEL.COM SUCCESSFULLY!');
      conn.end();
    });
  });
}).connect({
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972'
});
