const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join('d:', 'Henu');
const sitemapHtmlPath = path.join(rootDir, 'خريطة_توزيع_الملفات_والمستندات.html');
const sitemapPdfPath = path.join(rootDir, 'خريطة_توزيع_الملفات_والمستندات.pdf');

// قراءة الشعار إن وجد
const logoPath = path.join(rootDir, '02_Contracts_and_Legal', 'شعار_الفندق_عقود.jpg');
let logoDataUrl = '';
if (fs.existsSync(logoPath)) {
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  logoDataUrl = `data:image/jpeg;base64,${logoBase64}`;
}

function convertHtmlToPdf(htmlPath, pdfPath) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edgeAlt = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
  let exe = fs.existsSync(edgePath) ? edgePath : (fs.existsSync(edgeAlt) ? edgeAlt : 'msedge.exe');

  const cmd = `powershell -Command "& \\"${exe}\\" --headless --disable-gpu --no-sandbox --print-to-pdf=\\"${pdfPath}\\" \\"${htmlPath}\\""`;
  try {
    execSync(cmd, { encoding: 'utf8' });
    console.log(`✅ PDF Created: ${path.basename(pdfPath)}`);
  } catch (err) {}
}

const sitemapContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>خريطة توزيع الملفات والمستندات — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; line-height: 1.5; margin: 0; padding: 5px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 8px; margin-bottom: 12px; }
    .brand-logo { max-width: 80px; height: auto; border-radius: 4px; }
    .hotel-name { font-size: 13pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 16pt; font-weight: 800; color: #1F4E78; margin-top: 3px; }
    .folder-card { background: #FFFFFF; border: 1px solid #CBD5E0; border-right: 5px solid #1F4E78; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; font-size: 9pt; }
    .folder-name { font-size: 10.5pt; font-weight: 800; color: #1F4E78; margin-bottom: 4px; }
    ul { padding-right: 18px; margin: 3px 0; }
    li { margin-bottom: 3px; }
    .badge-pdf { background: #E53E3E; color: white; padding: 1px 5px; border-radius: 3px; font-size: 7.5pt; font-weight: bold; }
    .badge-excel { background: #38A169; color: white; padding: 1px 5px; border-radius: 3px; font-size: 7.5pt; font-weight: bold; }
    .badge-word { background: #2B6CB0; color: white; padding: 1px 5px; border-radius: 3px; font-size: 7.5pt; font-weight: bold; }
  </style>
</head>
<body>

  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">دليل وخريطة توزيع الملفات والمستندات الرسمية (Directory Sitemap)</div>
    <div style="font-size: 9pt; color: #4a5568;">النسخة الشاملة المزودة بالشيتات الجديدة للإيرادات والمصروفات وسجل استهلاك المياه والمشروبات والمناديل — 2026م</div>
  </div>

  <div class="folder-card" style="border-right-color: #38A169;">
    <div class="folder-name">📁 01_Accounting_System / الأنظمة الحسابية والجرد واستهلاك الضيافة</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل الايرادات والمصروفات.xlsx:</strong> يشمل 6 شيتات حركة الخزينة والمصروفات النثرية (1-A, 1-B, <strong>1-C, 2-A, 2-B Petty Cash</strong>).</li>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_استهلاك_المياه_والمشروبات_ومستلزمات_الضيافة.xlsx:</strong> شيت متكامل لرصد استهلاك المياه والنسكافيه والشاي والسكر والمناديل والصابون مع تنبيهات حد الأمان (Par Level).</li>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_أوامر_الشراء_حسب_الموردين.xlsx & QN_3 أمر توريد كوين</strong></li>
    </ul>
  </div>

  <div class="folder-card" style="border-right-color: #D9822B;">
    <div class="folder-name">📁 02_Contracts_and_Legal (العقود واللوائح القانونية)</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <span class="badge-word">WORD</span> <strong>عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_27غرفة.pdf / docx</strong></li>
      <li>📁 <strong>إيصالات_سداد_الإيجار_الشهرية:</strong> <span class="badge-pdf">PDF</span> <span class="badge-word">WORD</span> <strong>إيصال_استلام_إيجار_شهر_أغسطس_2026_نصر_دسوقي.pdf / docx</strong></li>
    </ul>
  </div>

  <div class="folder-card">
    <div class="folder-name">📁 04_Hotel_Booking_System (تطبيق الويب)</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>تطبيق الويب الفندقي PMS Web App (http://localhost:3000)</strong></li>
    </ul>
  </div>

</body>
</html>`;

fs.writeFileSync(sitemapHtmlPath, sitemapContent, 'utf8');
convertHtmlToPdf(sitemapHtmlPath, sitemapPdfPath);
