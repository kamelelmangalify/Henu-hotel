const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = fs.existsSync(chromePath) ? chromePath : edgePath;

// Brochure HTML path
const inputHtml = 'd:/Henu/brochure/brochure.html';
const tempPdf = 'd:/Henu/scratch/brochure_output.pdf';
const finalPdf = 'd:/Henu/brochure/مطوية_فندق_هينو_الأهرامات.pdf';

const cmd = `"${browser}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${tempPdf}" --no-pdf-header-footer "file:///${inputHtml}"`;

console.log('Compiling Brochure PDF...');
console.log('Running:', cmd);

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(tempPdf)) {
    fs.copyFileSync(tempPdf, finalPdf);
    console.log('Brochure PDF generated successfully at:', finalPdf);
    console.log('File size:', fs.statSync(finalPdf).size, 'bytes');
  } else {
    console.error('PDF file was not created.');
  }
} catch (err) {
  console.error('Error compiling brochure PDF:', err);
}
