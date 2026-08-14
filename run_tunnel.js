const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'tunnel.log');

function startTunnel() {
  console.log('Starting localtunnel process...');
  const child = spawn('npx.cmd', ['-y', 'localtunnel', '--port', '3000'], {
    shell: true
  });

  child.stdout.on('data', (data) => {
    const str = data.toString();
    console.log('[Tunnel]:', str);
    fs.appendFileSync(logFile, str, 'utf8');
  });

  child.stderr.on('data', (data) => {
    console.error('[Tunnel Error]:', data.toString());
  });

  child.on('close', (code) => {
    console.log(`Tunnel process exited with code ${code}. Restarting in 3 seconds...`);
    setTimeout(startTunnel, 3000);
  });
}

// Clear old log
fs.writeFileSync(logFile, '', 'utf8');
startTunnel();
