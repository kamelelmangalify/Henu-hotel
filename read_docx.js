const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetFile = path.join('d:', 'Henu', '02_Contracts_and_Legal', 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني%20-%20for%20merge.docx');
const tempZip = path.join(__dirname, 'temp_doc.zip');
const tempDir = path.join(__dirname, 'temp_xml');

fs.copyFileSync(targetFile, tempZip);

const cmd = `powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${tempDir}' -Force"`;
execSync(cmd);

const xmlPath = path.join(tempDir, 'word', 'document.xml');
const xmlContent = fs.readFileSync(xmlPath, 'utf8');

const paragraphs = xmlContent.split('</w:p>');
paragraphs.forEach((p, i) => {
  const textMatches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
  const text = textMatches.map(m => m.replace(/<[^>]+>/g, '')).join('');
  if (text.trim()) {
    console.log(`[${i}] ${text}`);
  }
});

fs.rmSync(tempZip, { force: true });
fs.rmSync(tempDir, { recursive: true, force: true });
