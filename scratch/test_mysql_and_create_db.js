const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Connected to Hostinger via SSH! Testing MySQL credentials...');

  const cmd = `
    # تجربة الاتصال بقاعدة البيانات وإمكانية إنشاء قاعدة بيانات جديدة
    mysql -h 127.0.0.1 -u u732967645_m4qS2 -paXsOyZwKNR -e "CREATE DATABASE IF NOT EXISTS u732967645_qloapps; SHOW DATABASES;" 2>&1
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
