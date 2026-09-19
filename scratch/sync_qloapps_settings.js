const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Syncing QloApps settings.inc.php across all domain paths...');

  const cmd = `
    cp /home/u732967645/domains/thetravelwiki.blog/public_html/qloapps/config/settings.inc.php /home/u732967645/public_html/qloapps/config/
    cp /home/u732967645/domains/thetravelwiki.blog/public_html/qloapps/config/settings.inc.php /home/u732967645/domains/thetravelwiki.space/public_html/qloapps/config/

    # حذف مجلد /install لحماية وتفعيل التطبيق بالكامل
    rm -rf /home/u732967645/domains/thetravelwiki.blog/public_html/qloapps/install
    rm -rf /home/u732967645/public_html/qloapps/install
    rm -rf /home/u732967645/domains/thetravelwiki.space/public_html/qloapps/install

    echo "=== Contents of settings.inc.php ==="
    cat /home/u732967645/domains/thetravelwiki.blog/public_html/qloapps/config/settings.inc.php
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log(out);
      conn.end();
    });
  });
}).connect({
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972'
});
