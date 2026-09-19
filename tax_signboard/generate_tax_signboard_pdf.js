const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const htmlPath = path.join('d:', 'Henu', 'tax_signboard', 'door_sign_60x40.html');
const pdfPath = path.join('d:', 'Henu', 'tax_signboard', 'يافطة_المعاينة_الرسمية_60x40_شركة_المطعم_الأرجنتيني.pdf');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeAlt = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
let exe = fs.existsSync(edgePath) ? edgePath : (fs.existsSync(edgeAlt) ? edgeAlt : 'msedge.exe');

console.log('🖨️ Generating High-Res 60x40 cm PDF Tax Signboard...');
execFileSync(exe, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--no-pdf-header-footer',
  '--print-to-pdf=' + pdfPath,
  htmlPath
]);

console.log('✅ PDF Created successfully at:', pdfPath);
