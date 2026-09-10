const fs = require('fs');
const { Client } = require('d:/Henu/scratch/node_modules/ssh2');

const conn = new Client();

console.log('Updating Home post content on WordPress...');

conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;

    sftp.fastPut('d:/Henu/scratch/pages/home_bright.html', 'domains/henuhotel.com/public_html/p_home_bright.html', (err) => {
      if (err) throw err;

      const cmd = `
        cd ~/domains/henuhotel.com/public_html

        # Update Home Page Content from file
        HOME_ID=$(wp post list --post_type=page --name=home --field=ID)
        wp post update $HOME_ID p_home_bright.html

        # Clear LiteSpeed and page cache
        wp litespeed-purge all 2>/dev/null || true
        rm -f p_home_bright.html
        echo "Updated Home Page ID $HOME_ID successfully!"
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
    });
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972'
});
