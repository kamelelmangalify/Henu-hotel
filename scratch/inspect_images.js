const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Henu/New folder';
const destDir = 'd:/Henu/brochure/images';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
console.log('Files in New folder:', files);

files.forEach((file, index) => {
  const srcPath = path.join(srcDir, file);
  const ext = path.extname(file);
  const destName = `img_${index + 1}${ext}`;
  const destPath = path.join(destDir, destName);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied: "${file}" -> "${destName}" (${fs.statSync(srcPath).size} bytes)`);
});
