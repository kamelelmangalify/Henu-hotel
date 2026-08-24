const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Adding .htaccess configuration for subdomain...');
  
  const cmd = `
    # Create .htaccess in traveldeals.space/public_html/henu
    cat << 'EOF' > ~/domains/traveldeals.space/public_html/henu/.htaccess
DirectoryIndex index.html index.php
Options -Indexes

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /henu/
</IfModule>
EOF

    # Check traveldeals.space main .htaccess
    cat << 'EOF' >> ~/domains/traveldeals.space/public_html/.htaccess

# Rewrite for henu.traveldeals.space
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_HOST} ^henu\\.traveldeals\\.space$ [NC]
RewriteCond %{REQUEST_URI} !^/henu/
RewriteRule ^(.*)$ /henu/$1 [L]
</IfModule>
EOF

    echo "htaccess configured!"
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
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
