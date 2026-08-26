const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('🔧 Setting DirectoryIndex and disabling default.php on thetravelwiki.blog...');
  
  const cmd = `
    # الانتقال لمجلد thetravelwiki.blog/public_html
    cd ~/domains/thetravelwiki.blog/public_html/

    # تعطيل default.php و index.php مؤقتاً لتظهر index.html المباشرة
    [ -f default.php ] && mv default.php default.php.bak
    
    # كتابة htaccess قوي يضمن قراءة index.html فوراً بدلاً من وردبريس
    cat << 'EOF' > .htaccess
DirectoryIndex index.html
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.php$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
EOF

    chmod 644 .htaccess
    chmod 644 index.html
    echo "=== Verified htaccess and index.html ==="
    ls -la .htaccess index.html
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', code => {
      console.log(out);
      console.log('✅ Fix applied with exit code ' + code);
      conn.end();
    });
  });
}).connect({
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972'
});
