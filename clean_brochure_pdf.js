const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const htmlPath = path.join('D:', 'new supreme', 'code_artifact (1).html');
const pdfPath1 = path.join('D:', 'Henu', '06_Marketing_and_Feasibility_Study', 'برشور_الإدارة_الفندقية_والحجز_المباشر_بدون_عمولات.pdf');
const pdfPath2 = path.join('D:', 'new supreme', 'برشور_الإدارة_الفندقية_والحجز_المباشر_بدون_عمولات.pdf');

// قراءة الهوتميل وإضافة استايل إلغاء الهيدر والفوتر بـ CSS
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

if (!htmlContent.includes('@page { margin: 0')) {
  htmlContent = htmlContent.replace('</style>', `
        @page {
            margin: 0;
            size: A4;
        }
        @media print {
            body {
                padding: 20px;
                background-color: #020617 !important;
                -webkit-print-color-adjust: exact;
            }
        }
    </style>`);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
}

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeAlt = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
let exe = fs.existsSync(edgePath) ? edgePath : (fs.existsSync(edgeAlt) ? edgeAlt : 'msedge.exe');

// استخدام سويتشات كروم/إيدج لمنع الهيدر والفوتر نهائياً
execFileSync(exe, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--no-pdf-header-footer',
  '--print-to-pdf=' + pdfPath1,
  htmlPath
]);

execFileSync(exe, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--no-pdf-header-footer',
  '--print-to-pdf=' + pdfPath2,
  htmlPath
]);

console.log('✅ Clean PDF 1 Created (No Headers/Footers):', pdfPath1);
console.log('✅ Clean PDF 2 Created (No Headers/Footers):', pdfPath2);
