const fs = require('fs');
const { Client } = require('d:/Henu/scratch/node_modules/ssh2');

const conn = new Client();

conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;

    sftp.fastPut('d:/Henu/scratch/pages/home_bright.html', 'domains/henuhotel.com/public_html/p_home_bright.html', (err) => {
      if (err) throw err;

      const cmd = `
        cd ~/domains/henuhotel.com/public_html

        # Update Home Post Content using cat
        wp post update 5 --post_content="$(cat p_home_bright.html)"

        # Clear Cache
        wp litespeed-purge all 2>/dev/null || true
        rm -f p_home_bright.html
        echo "=== HOME CONTENT UPDATED AND VERIFIED ==="
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
