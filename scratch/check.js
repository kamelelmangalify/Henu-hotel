const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Connected. Checking domains...');
  conn.exec('ls -la ~/domains/ && ls -la ~/public_html', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('Domains output:\n' + out);

      // Copy files to domain public_html if there is a domain folder
      const cmd = `
        for d in ~/domains/*; do
          if [ -d "$d/public_html" ]; then
            echo "Copying to $d/public_html/"
            cp -r ~/public_html/* "$d/public_html/"
          fi
        done
        echo "ALL DOMAINS UPDATED!"
      `;
      conn.exec(cmd, (err, stream2) => {
        let out2 = '';
        stream2.on('data', d => out2 += d);
        stream2.on('close', () => {
          console.log(out2);
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
