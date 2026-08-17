const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType } = require('docx');
const { execSync } = require('child_process');
const ExcelJS = require('exceljs');

const rootDir = path.join('d:', 'Henu');
const srcDir = path.join(rootDir, '03_Procurement_and_Orders');
const queenTargetFolder = path.join(rootDir, '01_Accounting_System', 'مستندات_المشتريات_والموردين', 'مورد_شركة_كوين_للكتانيات_QN');
const procDir = path.join(rootDir, '01_Accounting_System', 'مستندات_المشتريات_والموردين');
const archiveDir = path.join(rootDir, '_archive_and_old_versions');

if (!fs.existsSync(queenTargetFolder)) {
  fs.mkdirSync(queenTargetFolder, { recursive: true });
}
if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
}

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

async function organizeQueenOrders() {
  const f1 = path.join(srcDir, 'أمر_توريد_مفروشات_شركة_كوين_v3.pdf');
  const f2 = path.join(srcDir, 'أمر_توريد_مفروشات_شركة_كوين_جديد.pdf');

  const dest1 = path.join(queenTargetFolder, 'QN_3_أمر_توريد_مفروشات_شركة_كوين_v3.pdf');
  const dest2 = path.join(queenTargetFolder, 'QN_4_أمر_توريد_مفروشات_شركة_كوين_جديد.pdf');

  if (fs.existsSync(f1)) {
    fs.copyFileSync(f1, dest1);
    console.log(`✅ Copied: QN_3_أمر_توريد_مفروشات_شركة_كوين_v3.pdf`);
  }
  if (fs.existsSync(f2)) {
    fs.copyFileSync(f2, dest2);
    console.log(`✅ Copied: QN_4_أمر_توريد_مفروشات_شركة_كوين_جديد.pdf`);
  }

  // نقل الملفات الأصلية من 03_Procurement_and_Orders إلى الأرشيف لتنظيف الفولدر
  [f1, f2].forEach(file => {
    if (fs.existsSync(file)) {
      const bName = path.basename(file);
      const arcPath = path.join(archiveDir, bName);
      try {
        fs.renameSync(file, arcPath);
      } catch (e) {
        fs.copyFileSync(file, arcPath);
      }
    }
  });

  // تحديث شيت الإكسيل الموحد
  await updateMasterOrdersExcel();

  // تحديث الخريطة
  updateSitemap();
}

async function updateMasterOrdersExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Henu Hotel Procurement';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('سجل أوامر الشراء حسب الموردين', {
    views: [{ rightToLeft: true }]
  });

  sheet.mergeCells('A1:G1');
  const t = sheet.getCell('A1');
  t.value = '🛒 فندق هينو الأهرامات — سجل ودليل أوامر الشراء الكودية المسلسلة حسب الموردين (Vendor PO Log)';
  t.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  t.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  t.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 30;

  sheet.addRow([]);

  const headers = [
    'الكود المسلسل (PO Code)',
    'اسم المورد',
    'موضوع أمر الشراء',
    'تاريخ الإصدار',
    'إجمالي القيمة',
    'شروط الدفع',
    'حالة التوريد والاعتماد'
  ];

  const hRow = sheet.addRow(headers);
  hRow.height = 26;
  hRow.eachCell(cell => {
    cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  const allOrders = [
    ['QN_1', 'شركة كوين للكتانيات والبياضات الفندقية', 'أمر شراء وتوريد ملايات وأكياس مخدات فندقية', '2026-08-01', '20,600 جـ', 'نقداً عند التسليم بالعين', 'تم الاعتماد والتوريد 🟢'],
    ['QN_2', 'شركة كوين للكتانيات والبياضات الفندقية', 'أمر شراء وتوريد بشاكير وفوط حمامات فندقية', '2026-08-10', '16,125 جـ', 'نقداً عند التسليم', 'تم الاعتماد والتوريد 🟢'],
    ['QN_3', 'شركة كوين للكتانيات والبياضات الفندقية', 'أمر توريد مفروشات وبياضات شركة كوين v3 (سابق)', '2026-08-05', '35,400 جـ', 'مستند توريد سابق معتمد', 'مستند سابق معتمد 🟢'],
    ['QN_4', 'شركة كوين للكتانيات والبياضات الفندقية', 'أمر توريد مفروشات شركة كوين جديد (سابق)', '2026-08-11', '42,000 جـ', 'مستند توريد سابق معتمد', 'مستند سابق معتمد 🟢'],
    ['AH_1', 'شركة الأهرام لخدمات ومستلزمات الضيافة', 'أمر شراء وتوريد مستلزمات ضيافة النزلاء (Amenities)', '2026-08-03', '22,500 جـ', 'آجل 15 يوماً', 'تم الاعتماد والتوريد 🟢'],
    ['AH_2', 'شركة الأهرام لخدمات ومستلزمات الضيافة', 'أمر شراء وتوريد أكواب ومستلزمات الكيتل والغرف', '2026-08-12', '9,100 جـ', 'نقداً عند الاستلام', 'تم الاعتماد والتوريد 🟢'],
    ['NR_1', 'مورد النور للتجهيزات ومستلزمات الكهرباء', 'أمر شراء وتوريد لمبات ليد ومستلزمات إضاءة الغرف', '2026-08-05', '11,350 جـ', 'نقداً كاش', 'تم الاعتماد والتوريد 🟢'],
    ['NR_2', 'مورد النور للتجهيزات ومستلزمات الكهرباء', 'أمر شراء وتوريد بطاريات ريموت ووصلات شاشات', '2026-08-14', '2,775 جـ', 'نقداً كاش', 'تم الاعتماد والتوريد 🟢'],
    ['CF_1', 'شركة كير فرش لمواد ومساحيق النظافة', 'أمر شراء وتوريد المنظفات ومطهرات الأرضيات والحمامات', '2026-08-08', '7,860 جـ', 'نقداً كاش', 'تم الاعتماد والتوريد 🟢'],
    ['FR_1', 'مورد الفرسان لقطع غيار السباكة والتكييف', 'أمر شراء وتوريد قطع غيار السباكة والتكييفات', '2026-08-11', '6,040 جـ', 'نقداً عند التسليم', 'تم الاعتماد والتوريد 🟢']
  ];

  allOrders.forEach(vals => {
    const row = sheet.addRow(vals);
    row.height = 22;
    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.alignment = { horizontal: colNum === 1 || colNum === 4 || colNum === 5 || colNum === 7 ? 'center' : 'right', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };
    });
  });

  const w = [18, 30, 34, 14, 18, 24, 20];
  sheet.columns.forEach((col, i) => col.width = w[i]);

  const excelPath = path.join(procDir, 'سجل_أوامر_الشراء_حسب_الموردين.xlsx');
  await workbook.xlsx.writeFile(excelPath);
  console.log(`✅ Master Excel Log Updated: سجل_أوامر_الشراء_حسب_الموردين.xlsx`);
}

function updateSitemap() {
  const sitemapHtmlPath = path.join(rootDir, 'خريطة_توزيع_الملفات_والمستندات.html');
  const sitemapPdfPath = path.join(rootDir, 'خريطة_توزيع_الملفات_والمستندات.pdf');

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
    <div style="font-size: 9pt; color: #4a5568;">النسخة الشاملة المزودة بأوامر توريد شركة كوين المسلسلة QN_1, QN_2, QN_3, QN_4 — 2026م</div>
  </div>

  <div class="folder-card" style="border-right-color: #D97706;">
    <div class="folder-name">📁 01_Accounting_System / مستندات_المشتريات_والموردين</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_أوامر_الشراء_حسب_الموردين.xlsx:</strong> سجل أوامر الشراء المسلسلة المحدث.</li>
      <li>📁 <strong>مورد_شركة_كوين_للكتانيات_QN:</strong> (QN_1, QN_2, QN_3, QN_4).</li>
      <li>📁 <strong>مورد_شركة_الأهرام_للضيافة_AH:</strong> (AH_1, AH_2).</li>
      <li>📁 <strong>مورد_النور_للكهرباء_NR:</strong> (NR_1, NR_2).</li>
      <li>📁 <strong>مورد_شركة_كير_فرش_للمنظفات_CF:</strong> (CF_1).</li>
      <li>📁 <strong>مورد_الفرسان_للصيانة_والقطع_FR:</strong> (FR_1).</li>
    </ul>
  </div>

  <div class="folder-card" style="border-right-color: #D9822B;">
    <div class="folder-name">📁 02_Contracts_and_Legal (العقود واللوائح القانونية)</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <span class="badge-word">WORD</span> <strong>عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_27غرفة.pdf / docx</strong></li>
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
}

organizeQueenOrders().then(() => {
  console.log('\n✨ QUEEN LINEN ORDERS ORGANIZED AND SERIALIZED SUCCESSFULLY!');
}).catch(err => console.error(err));
