const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Fixing QloApps .htaccess and file permissions...');

  const cmd = `
    # إضافة DirectoryIndex index.php في المجلد
    echo "DirectoryIndex index.php" > /home/u732967645/domains/thetravelwiki.blog/public_html/qloapps/.htaccess
    echo "DirectoryIndex index.php" > /home/u732967645/public_html/qloapps/.htaccess
    echo "DirectoryIndex index.php" > /home/u732967645/domains/thetravelwiki.space/public_html/qloapps/.htaccess

    chmod -R 755 /home/u732967645/domains/thetravelwiki.blog/public_html/qloapps/
    chmod -R 755 /home/u732967645/public_html/qloapps/
    chmod -R 755 /home/u732967645/domains/thetravelwiki.space/public_html/qloapps/

    find /home/u732967645/domains/thetravelwiki.blog/public_html/qloapps/ -type f -exec chmod 644 {} +
    find /home/u732967645/public_html/qloapps/ -type f -exec chmod 644 {} +
    find /home/u732967645/domains/thetravelwiki.space/public_html/qloapps/ -type f -exec chmod 644 {} +

    echo "=== Permissions & .htaccess updated successfully ==="
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
