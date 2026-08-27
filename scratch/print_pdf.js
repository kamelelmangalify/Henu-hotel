const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = fs.existsSync(chromePath) ? chromePath : edgePath;

const inputHtml = 'd:/Henu/scratch/presentation_print.html';
const tempPdf = 'd:/Henu/scratch/presentation_output.pdf';
const finalPdf = 'd:/Henu/06_Marketing_and_Feasibility_Study/عرض_دراسة_الجدوى_فندق_هينو.pdf';

const cmd = `"${browser}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${tempPdf}" --no-pdf-header-footer "file:///${inputHtml}"`;

console.log('Running:', cmd);
try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(tempPdf)) {
    fs.copyFileSync(tempPdf, finalPdf);
    console.log('PDF generated successfully at:', finalPdf);
    console.log('File size:', fs.statSync(finalPdf).size, 'bytes');
  } else {
    console.error('PDF file was not created.');
  }
} catch (err) {
  console.error('Error executing browser:', err);
}
