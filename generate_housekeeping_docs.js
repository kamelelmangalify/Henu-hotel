const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ExcelJS = require('exceljs');

const rootDir = path.join('d:', 'Henu');
const hkDocsDir = path.join(rootDir, '01_Accounting_System', 'مستندات_الإشراف_الداخلي_والغرف');
if (!fs.existsSync(hkDocsDir)) fs.mkdirSync(hkDocsDir, { recursive: true });

// قراءة الشعار
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
  } catch (err) {
    console.error(`❌ PDF failed for ${pdfPath}:`, err.message);
  }
}

// ---------------------------------------------------------
// 1. توليد شيت حصر وتتبع حركة الكتانيات والفوط والغسيل اليومي (Excel)
// ---------------------------------------------------------
async function createLinenExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Henu Hotel HK';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('تتبع المغسلة والكتانيات اليومي', {
    views: [{ rightToLeft: true }]
  });

  sheet.mergeCells('A1:J1');
  const t = sheet.getCell('A1');
  t.value = '🧺 فندق هينو الأهرامات — سجل وتتبع حركة المغسلة والكتانيات والفوط اليومية (Linen & Laundry Control Log)';
  t.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  t.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  t.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 30;

  sheet.addRow([]);

  const headers = [
    'التاريخ',
    'نوع البند / الصنف',
    'الرصيد الافتتاحي المخزني',
    'المستلم من الغرف (متسخ)',
    'المنصرف للمغسلة',
    'المستلم مغسول وجاهز',
    'المصروف للغرف اليوم',
    'التالف / التالف المغسلة',
    'الرصيد المتبقي النظيف',
    'ملاحظات مشرف الإشراف'
  ];

  const hRow = sheet.addRow(headers);
  hRow.height = 26;
  hRow.eachCell(cell => {
    cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  const linenItems = [
    'ملاية سرير كبير (King Sheet)',
    'ملاية سرير صغير (Single Sheet)',
    'كيس مخدة (Pillow Case)',
    'بشاكير حمام كبيرة (Bath Towel)',
    'فوط وجه يدين (Hand Towel)',
    'مشاية حمام (Bath Mat)',
    'كوفرتات / لحاف فندقي (Duvet)',
    'واقي مرتبة ضد الماء (Mattress Protector)'
  ];

  linenItems.forEach((item, idx) => {
    const row = sheet.addRow([
      '2026-08-15',
      item,
      84,
      28,
      28,
      28,
      28,
      0,
      { formula: `C${4 + idx}-G${4 + idx}` },
      'جاهز للاستخدام'
    ]);

    row.height = 22;
    const isEven = idx % 2 === 0;
    const bg = isEven ? 'F9FAFB' : 'FFFFFF';

    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { horizontal: colNum <= 2 ? 'right' : 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };
    });
  });

  const w = [14, 30, 18, 18, 18, 18, 18, 16, 18, 22];
  sheet.columns.forEach((col, i) => col.width = w[i]);

  const excelPath = path.join(hkDocsDir, 'سجل_تتبع_حركة_الكتانيات_والمغسلة_اليومي.xlsx');
  await workbook.xlsx.writeFile(excelPath);
  console.log(`✅ Excel Created: سجل_تتبع_حركة_الكتانيات_والمغسلة_اليومي.xlsx`);
}

// ---------------------------------------------------------
// 2. كشف توزيع ورصد نظافة الغرف اليومي لعمال النظافة (PDF)
// ---------------------------------------------------------
const hkAssignmentHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>كشف توزيع ورصد نظافة الغرف اليومي — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; margin: 0; padding: 5px; direction: rtl; font-size: 9pt; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 6px; margin-bottom: 10px; }
    .hotel-name { font-size: 12pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 15pt; font-weight: 800; color: #1F4E78; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    td, th { border: 1px solid #CBD5E0; padding: 5px; text-align: center; }
    th { background: #1F4E78; color: white; }
    .lbl { font-weight: bold; background: #F7FAFC; width: 18%; }
  </style>
</head>
<body>
  <div class="header">
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">كشف تشغيل وتوزيع نظافة الغرف اليومي (Housekeeper Attendant Sheet)</div>
  </div>

  <table>
    <tr>
      <td class="lbl">التاريخ:</td>
      <td>..... / ..... / 2026م</td>
      <td class="lbl">اسم عامل الغرف:</td>
      <td>..........................................</td>
      <td class="lbl">الأدوار المكلف بها:</td>
      <td>[ ] الأول &nbsp; [ ] الثاني &nbsp; [ ] الثالث &nbsp; [ ] الروف</td>
    </tr>
  </table>

  <table>
    <thead>
      <tr>
        <th>رقم الغرفة</th>
        <th>نوع النظافة المطلوبة</th>
        <th>تغيير الكتانيات والفوط</th>
        <th>وقت البدء</th>
        <th>وقت الانتهاء</th>
        <th>توقيع العامل</th>
        <th>توقيع واعتماد المشرفة</th>
        <th>ملاحظات وأعطال الصيانة</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>101</td><td>[ ] مغادرة &nbsp; [ ] إقامة &nbsp; [ ] عميق</td><td>[ ] نعم &nbsp; [ ] لا</td><td>.....:.....</td><td>.....:.....</td><td>..........</td><td>..........</td><td>...................................</td></tr>
      <tr><td>102</td><td>[ ] مغادرة &nbsp; [ ] إقامة &nbsp; [ ] عميق</td><td>[ ] نعم &nbsp; [ ] لا</td><td>.....:.....</td><td>.....:.....</td><td>..........</td><td>..........</td><td>...................................</td></tr>
      <tr><td>103</td><td>[ ] مغادرة &nbsp; [ ] إقامة &nbsp; [ ] عميق</td><td>[ ] نعم &nbsp; [ ] لا</td><td>.....:.....</td><td>.....:.....</td><td>..........</td><td>..........</td><td>...................................</td></tr>
      <tr><td>104</td><td>[ ] مغادرة &nbsp; [ ] إقامة &nbsp; [ ] عميق</td><td>[ ] نعم &nbsp; [ ] لا</td><td>.....:.....</td><td>.....:.....</td><td>..........</td><td>..........</td><td>...................................</td></tr>
      <tr><td>105</td><td>[ ] مغادرة &nbsp; [ ] إقامة &nbsp; [ ] عميق</td><td>[ ] نعم &nbsp; [ ] لا</td><td>.....:.....</td><td>.....:.....</td><td>..........</td><td>..........</td><td>...................................</td></tr>
      <tr><td>201</td><td>[ ] مغادرة &nbsp; [ ] إقامة &nbsp; [ ] عميق</td><td>[ ] نعم &nbsp; [ ] لا</td><td>.....:.....</td><td>.....:.....</td><td>..........</td><td>..........</td><td>...................................</td></tr>
      <tr><td>202</td><td>[ ] مغادرة &nbsp; [ ] إقامة &nbsp; [ ] عميق</td><td>[ ] نعم &nbsp; [ ] لا</td><td>.....:.....</td><td>.....:.....</td><td>..........</td><td>..........</td><td>...................................</td></tr>
      <tr><td>203</td><td>[ ] مغادرة &nbsp; [ ] إقامة &nbsp; [ ] عميق</td><td>[ ] نعم &nbsp; [ ] لا</td><td>.....:.....</td><td>.....:.....</td><td>..........</td><td>..........</td><td>...................................</td></tr>
      <tr><td>301</td><td>[ ] مغادرة &nbsp; [ ] إقامة &nbsp; [ ] عميق</td><td>[ ] نعم &nbsp; [ ] لا</td><td>.....:.....</td><td>.....:.....</td><td>..........</td><td>..........</td><td>...................................</td></tr>
      <tr><td>401</td><td>[ ] مغادرة &nbsp; [ ] إقامة &nbsp; [ ] عميق</td><td>[ ] نعم &nbsp; [ ] لا</td><td>.....:.....</td><td>.....:.....</td><td>..........</td><td>..........</td><td>...................................</td></tr>
    </tbody>
  </table>
</body>
</html>`;

// ---------------------------------------------------------
// 3. قائمة فحص وتفتيش جاهزية الغرفة للنزيل (PDF)
// ---------------------------------------------------------
const roomInspectionHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>قائمة فحص وتفتيش جاهزية الغرفة — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; margin: 0; padding: 5px; direction: rtl; font-size: 9pt; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 6px; margin-bottom: 10px; }
    .hotel-name { font-size: 12pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 15pt; font-weight: 800; color: #1F4E78; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    td, th { border: 1px solid #CBD5E0; padding: 5px; text-align: center; }
    th { background: #1F4E78; color: white; }
    .lbl { font-weight: bold; background: #F7FAFC; width: 18%; }
    .section-head { font-weight: bold; background: #EDF2F7; color: #1F4E78; text-align: right; }
  </style>
</head>
<body>
  <div class="header">
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">قائمة فحص وتفتيش جاهزية الغرفة (Room Inspection Checklist)</div>
  </div>

  <table>
    <tr>
      <td class="lbl">رقم الغرفة:</td>
      <td>( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</td>
      <td class="lbl">التاريخ:</td>
      <td>..... / ..... / 2026م</td>
      <td class="lbl">اسم المشرفة المفتشة:</td>
      <td>..........................................</td>
    </tr>
  </table>

  <table>
    <thead>
      <tr>
        <th style="width: 35%;">عنصر الفحص والتفتيش</th>
        <th style="width: 15%;">الحالة</th>
        <th style="width: 50%;">التفاصيل والملاحظات</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="section-head" colspan="3">🛏️ 1. غرفة النوم والأسرة (Bedroom & Bed Making)</td></tr>
      <tr><td>نظافة الملايات وأكياس المخدات وترتيب السرير الفندقي</td><td>[ ] ممتاز &nbsp; [ ] ملاحظة</td><td>.................................................................................</td></tr>
      <tr><td>نظافة الأرضيات والسجاد وأسفل الأسرة والستائر</td><td>[ ] ممتاز &nbsp; [ ] ملاحظة</td><td>.................................................................................</td></tr>
      <tr><td>رائحة الغرفة والتهوية الخالية من الأتربة</td><td>[ ] ممتاز &nbsp; [ ] ملاحظة</td><td>.................................................................................</td></tr>

      <tr><td class="section-head" colspan="3">🚿 2. الحمام والمستلزمات (Bathroom & Amenities)</td></tr>
      <tr><td>نظافة الحوائط، المرحاض، الدش، والزجاج بدون بقع</td><td>[ ] ممتاز &nbsp; [ ] ملاحظة</td><td>.................................................................................</td></tr>
      <tr><td>وجود طقم الفوط الكامل (بشكير + فوطة وجه + مشاية)</td><td>[ ] ممتاز &nbsp; [ ] ملاحظة</td><td>.................................................................................</td></tr>
      <tr><td>توافر الشامبو، الصابون، والشاور جيل المطبوع باسم هينو</td><td>[ ] ممتاز &nbsp; [ ] ملاحظة</td><td>.................................................................................</td></tr>

      <tr><td class="section-head" colspan="3">❄️ 3. الأجهزة والتكييف والكهرباء (Electrical & Amenities)</td></tr>
      <tr><td>عمل التكييف والتبريد وكفاءته والريموت كنترول</td><td>[ ] ممتاز &nbsp; [ ] ملاحظة</td><td>.................................................................................</td></tr>
      <tr><td>تشغيل الإضاءة بالكامل والتلفزيون والغلاية الكهربائية</td><td>[ ] ممتاز &nbsp; [ ] ملاحظة</td><td>.................................................................................</td></tr>
    </tbody>
  </table>

  <div style="background: #C6F6D5; border: 1px solid #38A169; padding: 6px; text-align: center; font-weight: bold; color: #22543D; margin-top: 10px;">
    قرار المشرفة: [ ] الغرفة جاهزة للتسكين وتحويلها إلى Clean & Vacant على PMS &nbsp;&nbsp;&nbsp;&nbsp; [ ] مرفوضة لحين إعادة التنظيف
  </div>
</body>
</html>`;

// ---------------------------------------------------------
// 4. طلب وإذن صيانة الغرف والأعطال (PDF)
// ---------------------------------------------------------
const maintOrderHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>طلب وإذن صيانة الغرف — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; margin: 0; padding: 5px; direction: rtl; font-size: 9.5pt; }
    .container { border: 2px solid #1F4E78; border-radius: 6px; padding: 10px; margin-bottom: 15px; }
    .header { text-align: center; border-bottom: 1.5px solid #1F4E78; padding-bottom: 6px; margin-bottom: 8px; }
    .hotel-name { font-size: 11pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 13pt; font-weight: 800; color: #1F4E78; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    td { padding: 5px; border: 1px solid #CBD5E0; }
    .lbl { font-weight: bold; background: #EDF2F7; width: 20%; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
      <div class="doc-title">أمر وتكليف صيانة غرفة / صيانة عاجلة (Work Order Log)</div>
    </div>

    <table>
      <tr>
        <td class="lbl">رقم أمر الصيانة:</td>
        <td>MNT-2026-.......</td>
        <td class="lbl">التاريخ والوقت:</td>
        <td>...../...../2026م &nbsp;&nbsp; الساعة: .....:.....</td>
      </tr>
      <tr>
        <td class="lbl">رقم الغرفة / المكان:</td>
        <td>غرفة ( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</td>
        <td class="lbl">درجة الأهمية:</td>
        <td>[ ] عاجل جداً (نزيل بالغرفة) &nbsp; [ ] عادي</td>
      </tr>
      <tr>
        <td class="lbl">مُحرر البلاغ:</td>
        <td>[ ] الإشراف الداخلي &nbsp; [ ] الاستقبال</td>
        <td class="lbl">اسم المحرر:</td>
        <td>..........................................</td>
      </tr>
      <tr>
        <td class="lbl">تفاصيل العطل والشكوى:</td>
        <td colspan="3">........................................................................................................................................................................</td>
      </tr>
      <tr>
        <td class="lbl">نوع الصيانة:</td>
        <td colspan="3">[ ] سباكة &nbsp;&nbsp; [ ] كهرباء وإضاءة &nbsp;&nbsp; [ ] تكييف وتبريد &nbsp;&nbsp; [ ] نجارة وأقفال &nbsp;&nbsp; [ ] تلفزيون وشبكة</td>
      </tr>
      <tr>
        <td class="lbl">إجراء الفني والإصلاح:</td>
        <td colspan="3">........................................................................................................................................................................</td>
      </tr>
      <tr>
        <td class="lbl">تاريخ ووقت الإنجاز:</td>
        <td>...../...../2026م &nbsp;&nbsp; الساعة: .....:.....</td>
        <td class="lbl">توقيع الفني المنفذ:</td>
        <td>..........................................</td>
      </tr>
    </table>
  </div>
</body>
</html>`;

// ---------------------------------------------------------
// كتابة وتحويل المستندات
// ---------------------------------------------------------
async function run() {
  await createLinenExcel();

  const pdfItems = [
    { name: '01_كشف_توزيع_ونظافة_الغرف_اليومي_Attendant_Sheet', html: hkAssignmentHtml },
    { name: '02_قائمة_فحص_وتفتيش_جاهزية_الغرفة_Inspection_Checklist', html: roomInspectionHtml },
    { name: '03_طلب_وإذن_صيانة_الغرف_والأعطال_Maintenance_Order', html: maintOrderHtml }
  ];

  pdfItems.forEach(item => {
    const htmlPath = path.join(hkDocsDir, `${item.name}.html`);
    const pdfPath = path.join(hkDocsDir, `${item.name}.pdf`);
    fs.writeFileSync(htmlPath, item.html, 'utf8');
    convertHtmlToPdf(htmlPath, pdfPath);
  });

  // تحديث خريطة توزيع المستندات
  updateSitemap();
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
  </style>
</head>
<body>

  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">دليل وخريطة توزيع الملفات والمستندات الرسمية (Directory Sitemap)</div>
    <div style="font-size: 9pt; color: #4a5568;">النسخة الشاملة المحدثة للاستقبال والإشراف الداخلي — 2026م</div>
  </div>

  <!-- 01 النظام المحاسبي وورقيات الاستقبال والإشراف الداخلي -->
  <div class="folder-card">
    <div class="folder-name">📁 01_Accounting_System (النظام المحاسبي وورقيات التشغيل)</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>نظام_حجوزات_وتسكين_الغرف_الفندقي.xlsx:</strong> شاشة حالة الغرف الـ 25 التفاعلية (Room Rack) وسجل الحجوزات.</li>
      <li><span class="badge-excel">EXCEL</span> <strong>جدول_رواتب_وتقييم_الموظفين_الشهري.xlsx:</strong> كشف رواتب الـ 30 موظفاً وشيتات الـ KPIs ومستندات الحضور.</li>
      <li><span class="badge-pdf">PDF</span> <strong>سياسة_النقدية_والتعامل_مع_الخزينة_Cash_Policy.pdf:</strong> السياسة المالية والخزينة.</li>
    </ul>

    <div style="font-weight: bold; color: #78350f; margin-top: 6px;">📂 مستندات_ورقيات_الاستقبال (نماذج كونتر الاستقبال):</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <strong>بطاقة_تسجيل_النزيل / إيصال_سداد / فاتورة_وكشف_حساب_النزيل / تقرير_تسليم_وردية / سجل_الأمانات.</strong></li>
    </ul>

    <div style="font-weight: bold; color: #2B6CB0; margin-top: 6px;">📂 مستندات_الإشراف_الداخلي_والغرف (Housekeeping Operational Files):</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_تتبع_حركة_الكتانيات_والمغسلة_اليومي.xlsx:</strong> تتبع حركة الفوط والملايات والمغسولة يومياً.</li>
      <li><span class="badge-pdf">PDF</span> <strong>01_كشف_توزيع_ونظافة_الغرف_اليومي_Attendant_Sheet.pdf:</strong> كشف توزيع الغرف والنظافة لعمال الغرف.</li>
      <li><span class="badge-pdf">PDF</span> <strong>02_قائمة_فحص_وتفتيش_جاهزية_الغرفة_Inspection_Checklist.pdf:</strong> قائمة تفتيش المشرفة قبل التسكين.</li>
      <li><span class="badge-pdf">PDF</span> <strong>03_طلب_وإذن_صيانة_الغرف_والأعطال_Maintenance_Order.pdf:</strong> إذن وتكليف صيانة أعطال الغرف العاجلة.</li>
    </ul>
  </div>

  <!-- 02 العقود والقانونية -->
  <div class="folder-card" style="border-right-color: #D9822B;">
    <div class="folder-name">📁 02_Contracts_and_Legal (العقود والشؤون القانونية)</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <strong>عقد_عمل_مؤقت_وتعهد_فندقي.pdf:</strong> عقد العمل الموحد ببند الـ 75% والـ 25%.</li>
      <li><span class="badge-pdf">PDF</span> <strong>عقد_تشغيل_أطفال / اتفاقية_تدريب_ستارز / عقد_إيجار_الفندق.</strong></li>
    </ul>
  </div>

</body>
</html>`;

  fs.writeFileSync(sitemapHtmlPath, sitemapContent, 'utf8');
  convertHtmlToPdf(sitemapHtmlPath, sitemapPdfPath);
}

run().catch(err => console.error(err));
