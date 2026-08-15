const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ExcelJS = require('exceljs');

const rootDir = path.join('d:', 'Henu');
const invDocsDir = path.join(rootDir, '01_Accounting_System', 'نماذج_جرد_الغرف_والمخازن');
if (!fs.existsSync(invDocsDir)) fs.mkdirSync(invDocsDir, { recursive: true });

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
// 1. شيت الإكسيل التفاعلي لجرد الـ 25 غرفة والمخازن الرئيسية
// ---------------------------------------------------------
async function createInventoryExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Henu Hotel Inventory System';
  workbook.created = new Date();

  // الشيت الأول: جرد الغرف الـ 25 (Room FF&E Inventory)
  const roomSheet = workbook.addWorksheet('جرد مشتملات الغرف الـ 25', {
    views: [{ rightToLeft: true }]
  });

  roomSheet.mergeCells('A1:I1');
  const t1 = roomSheet.getCell('A1');
  t1.value = '🏨 فندق هينو الأهرامات — سجل جرد مشتملات وأثاث الغرف الـ 25 (Room FF&E Inventory)';
  t1.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  t1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  t1.alignment = { horizontal: 'center', vertical: 'middle' };
  roomSheet.getRow(1).height = 30;

  roomSheet.addRow([]);

  const rHeaders = ['رقم الغرفة', 'فئة الصنف (Category)', 'اسم الصنف والمشتملات', 'العدد الافتراضي بالغرفة', 'الحالة السليمة', 'يحتاج صيانة', 'تالف / مفقود', 'حالة الصيانة والتوجيه', 'ملاحظات المشرف'];
  const rHRow = roomSheet.addRow(rHeaders);
  rHRow.height = 26;
  rHRow.eachCell(cell => {
    cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  const roomFFnE = [
    { cat: 'الأثاث والفرش', item: 'سرير فندقي كبير / صغير', qty: 2 },
    { cat: 'الأثاث والفرش', item: 'مرتبة فندقية + واقي مرتبة', qty: 2 },
    { cat: 'الأثاث والفرش', item: 'دولاب ملابس + 10 شماعات', qty: 1 },
    { cat: 'الأثاث والفرش', item: 'تسريحة / مكتب + كرسي فندقي', qty: 1 },
    { cat: 'الأثاث والفرش', item: 'كمودينو + أبجورة إضاءة', qty: 2 },
    { cat: 'الأثاث والفرش', item: 'ستائر بلاك آوت (Blackout)', qty: 2 },
    { cat: 'الأجهزة الكهربائية', item: 'تكييف فندقي + ريموت كنترول', qty: 1 },
    { cat: 'الأجهزة الكهربائية', item: 'شاشة تلفزيون سمارت + ريموت', qty: 1 },
    { cat: 'الأجهزة الكهربائية', item: 'ثلاجة ميني بار (Mini Bar)', qty: 1 },
    { cat: 'الأجهزة الكهربائية', item: 'غلاية مياه كهربائية (Kettle)', qty: 1 },
    { cat: 'مشتملات الحمام', item: 'بشكير حمام كبير (Bath Towel)', qty: 2 },
    { cat: 'مشتملات الحمام', item: 'فوطة وجه يدين (Hand Towel)', qty: 2 },
    { cat: 'مشتملات الحمام', item: 'مشاية حمام (Bath Mat)', qty: 1 },
    { cat: 'مشتملات الحمام', item: 'استشوار شعر فندقي (Hair Dryer)', qty: 1 }
  ];

  // تكرار النموذج على الغرفة 101 لـ 406 كنموذج
  let rCount = 4;
  for (let rNo of ['101', '102', '201', '301', '401']) {
    roomFFnE.forEach(item => {
      const row = roomSheet.addRow([
        `غرفة ${rNo}`,
        item.cat,
        item.item,
        item.qty,
        item.qty,
        0,
        0,
        'سليم 100%',
        'معتمد'
      ]);
      row.height = 20;
      row.eachCell((cell, colNum) => {
        cell.font = { name: 'Arial', size: 9 };
        cell.alignment = { horizontal: colNum <= 3 ? 'right' : 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };
      });
      rCount++;
    });
  }

  const rw = [12, 18, 32, 16, 14, 14, 14, 18, 20];
  roomSheet.columns.forEach((col, i) => col.width = rw[i]);

  // الشيت الثاني: جرد وتقفيل المخازن (Hotel Stores Master Inventory)
  const storeSheet = workbook.addWorksheet('سجل جرد وتقفيل المخازن', {
    views: [{ rightToLeft: true }]
  });

  storeSheet.mergeCells('A1:J1');
  const t2 = storeSheet.getCell('A1');
  t2.value = '📦 فندق هينو الأهرامات — سجل جرد ورصيد المخازن الرئيسية ومخزن الإشراف (Hotel Central Stores Inventory)';
  t2.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  t2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  t2.alignment = { horizontal: 'center', vertical: 'middle' };
  storeSheet.getRow(1).height = 30;

  storeSheet.addRow([]);

  const sHeaders = ['كود الصنف', 'اسم الصنف والمستلزمات', 'المخزن التابع له', 'وحدة القياس', 'الرصيد الفعلي الحالي', 'حد الأمان (Par Level)', 'حالة التوريد', 'سعر الوحدة التقديري', 'إجمالي قيمة المخزون', 'ملاحظات وتوجيهات الشراء'];
  const sHRow = storeSheet.addRow(sHeaders);
  sHRow.height = 26;
  sHRow.eachCell(cell => {
    cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  const storeItems = [
    { code: 'LIN-01', name: 'ملاية سرير كبير (King Sheet)', store: 'مخزن المفروشات', unit: 'قطعة', qty: 84, par: 84, price: 350 },
    { code: 'LIN-02', name: 'ملاية سرير صغير (Single Sheet)', store: 'مخزن المفروشات', unit: 'قطعة', qty: 84, par: 84, price: 250 },
    { code: 'LIN-03', name: 'بشكير حمام كبير (Bath Towel)', store: 'مخزن المفروشات', unit: 'قطعة', qty: 84, par: 84, price: 200 },
    { code: 'AMN-01', name: 'شامبو فندقي 30 مل (هينو)', store: 'مخزن الضيافة', unit: 'كرتونة (200 عبوة)', qty: 5, par: 3, price: 600 },
    { code: 'AMN-02', name: 'شاور جيل فندقي 30 مل (هينو)', store: 'مخزن الضيافة', unit: 'كرتونة (200 عبوة)', qty: 4, par: 3, price: 600 },
    { code: 'AMN-03', name: 'صابون فندقي معطر 20 جم', store: 'مخزن الضيافة', unit: 'كرتونة (500 قطعة)', qty: 3, par: 2, price: 750 },
    { code: 'MNT-01', name: 'لمبات إضاءة ليد 9 واط', store: 'مخزن الصيانة', unit: 'علبة (10 لمبات)', qty: 10, par: 5, price: 250 },
    { code: 'MNT-02', name: 'بطاريات ريموت تكييف وتلفزيون', store: 'مخزن الصيانة', unit: 'علبة (60 بطارية)', qty: 4, par: 2, price: 300 }
  ];

  storeItems.forEach((item, idx) => {
    const rIdx = 4 + idx;
    const row = storeSheet.addRow([
      item.code,
      item.name,
      item.store,
      item.unit,
      item.qty,
      item.par,
      { formula: `IF(E${rIdx}>=F${rIdx},"آمن 🟢","طلب شراء عاجل 🔴")` },
      item.price,
      { formula: `E${rIdx}*H${rIdx}` },
      'مباشر'
    ]);

    row.height = 22;
    const isEven = idx % 2 === 0;
    const bg = isEven ? 'F9FAFB' : 'FFFFFF';

    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { horizontal: colNum <= 4 ? 'right' : 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };

      if ([8, 9].includes(colNum)) cell.numFmt = '#,##0" جـ"';
      if (colNum === 7) cell.font = { name: 'Arial', size: 9, bold: true };
    });
  });

  const sw = [12, 32, 18, 16, 16, 16, 18, 16, 18, 20];
  storeSheet.columns.forEach((col, i) => col.width = sw[i]);

  const excelPath = path.join(invDocsDir, 'سجل_جرد_الغرف_والمخازن_الفندقية_الشامل.xlsx');
  await workbook.xlsx.writeFile(excelPath);
  console.log(`✅ Excel Created: سجل_جرد_الغرف_والمخازن_الفندقية_الشامل.xlsx`);
}

// ---------------------------------------------------------
// 2. نموذج جرد الغرفة المطبوع لـ Housekeeping (PDF)
// ---------------------------------------------------------
const roomInvHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>نموذج جرد مشتملات الغرفة الفندقية — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; margin: 0; padding: 5px; direction: rtl; font-size: 8.5pt; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 6px; margin-bottom: 8px; }
    .hotel-name { font-size: 11pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 14pt; font-weight: 800; color: #1F4E78; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
    td, th { border: 1px solid #CBD5E0; padding: 4px 6px; text-align: center; }
    th { background: #1F4E78; color: white; }
    .lbl { font-weight: bold; background: #F7FAFC; width: 18%; }
    .sec-head { font-weight: bold; background: #EDF2F7; color: #1F4E78; text-align: right; }
  </style>
</head>
<body>
  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" style="max-width:70px;">` : ''}
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">نموذج وجدول جرد مشتملات وأثاث الغرفة (Room Inventory Sheet)</div>
  </div>

  <table>
    <tr>
      <td class="lbl">رقم الغرفة:</td>
      <td>( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</td>
      <td class="lbl">نوع الغرفة:</td>
      <td>..........................................</td>
      <td class="lbl">التاريخ:</td>
      <td>..... / ..... / 2026م</td>
    </tr>
    <tr>
      <td class="lbl">اسم عامل الغرفة:</td>
      <td colspan="2">..........................................</td>
      <td class="lbl">اسم مشرفة الجرد:</td>
      <td colspan="2">..........................................</td>
    </tr>
  </table>

  <table>
    <thead>
      <tr>
        <th style="width: 35%;">الصنف والمشتملات (Item Description)</th>
        <th style="width: 12%;">العدد المكتمل</th>
        <th style="width: 15%;">الحالة السليمة</th>
        <th style="width: 15%;">تحتاج صيانة</th>
        <th style="width: 23%;">ملاحظات وتوجيهات</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="sec-head" colspan="5">🛏️ 1. الأثاث والفرش (Furniture & Bedding)</td></tr>
      <tr><td>سرير فندقي كبير / صغير</td><td>[ &nbsp;&nbsp; ]</td><td>[ ] سليم</td><td>[ ] صيانة</td><td>....................................</td></tr>
      <tr><td>مرتبة فندقية + واقي مرتبة ضد الماء</td><td>[ &nbsp;&nbsp; ]</td><td>[ ] سليم</td><td>[ ] صيانة</td><td>....................................</td></tr>
      <tr><td>ملاية سرير + أكياس مخدات + مخدات</td><td>[ &nbsp;&nbsp; ]</td><td>[ ] سليم</td><td>[ ] صيانة</td><td>....................................</td></tr>
      <tr><td>دولاب ملابس + 10 شماعات فندقية</td><td>[ &nbsp;&nbsp; ]</td><td>[ ] سليم</td><td>[ ] صيانة</td><td>....................................</td></tr>
      <tr><td>تسريحة / مكتب + كرسي فندقي</td><td>[ &nbsp;&nbsp; ]</td><td>[ ] سليم</td><td>[ ] صيانة</td><td>....................................</td></tr>

      <tr><td class="sec-head" colspan="5">❄️ 2. الأجهزة الكهربائية (Electrical Equipment)</td></tr>
      <tr><td>تكييف فندقي + ريموت كنترول شغال</td><td>[ &nbsp;&nbsp; ]</td><td>[ ] سليم</td><td>[ ] صيانة</td><td>....................................</td></tr>
      <tr><td>شاشة تلفزيون سمارت + ريموت كنترول</td><td>[ &nbsp;&nbsp; ]</td><td>[ ] سليم</td><td>[ ] صيانة</td><td>....................................</td></tr>
      <tr><td>ثلاجة ميني بار (Mini Bar) نظيفة وطازجة</td><td>[ &nbsp;&nbsp; ]</td><td>[ ] سليم</td><td>[ ] صيانة</td><td>....................................</td></tr>
      <tr><td>غلاية مياه كهربائية (Kettle) + أطقم أكواب</td><td>[ &nbsp;&nbsp; ]</td><td>[ ] سليم</td><td>[ ] صيانة</td><td>....................................</td></tr>

      <tr><td class="sec-head" colspan="5">🚿 3. مشتملات ومستلزمات الحمام (Bathroom Items)</td></tr>
      <tr><td>بشكير حمام كبير + فوطة وجه + مشاية</td><td>[ &nbsp;&nbsp; ]</td><td>[ ] سليم</td><td>[ ] صيانة</td><td>....................................</td></tr>
      <tr><td>استشوار شعر فندقي (Hair Dryer) مثبت</td><td>[ &nbsp;&nbsp; ]</td><td>[ ] سليم</td><td>[ ] صيانة</td><td>....................................</td></tr>
    </tbody>
  </table>

  <table style="margin-top: 10px; border: none;">
    <tr style="border: none;">
      <td style="border: none; text-align: center; width: 50%;"><strong>توقيع عامل الغرف:</strong> ...........................</td>
      <td style="border: none; text-align: center; width: 50%;"><strong>توقيع واعتماد مشرفة الجرد:</strong> ...........................</td>
    </tr>
  </table>
</body>
</html>`;

// ---------------------------------------------------------
// 3. نموذج جرد ورصيد المخازن المطبوع (PDF)
// ---------------------------------------------------------
const storeInvHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>نموذج جرد وتقفيل المخازن الفندقية — فندق هينو الأهرامات</title>
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
    <div class="doc-title">كشف وتقفيل جرد المخازن الفندقية (Hotel Stores Inventory Audit)</div>
  </div>

  <table>
    <tr>
      <td class="lbl">اسم المخزن:</td>
      <td>[ ] مخزن الكتانيات والمفروشات &nbsp; [ ] مخزن الضيافة والـ Amenities &nbsp; [ ] مخزن الصيانة</td>
      <td class="lbl">التاريخ:</td>
      <td>..... / ..... / 2026م</td>
    </tr>
    <tr>
      <td class="lbl">أمين المخزن المسؤول:</td>
      <td>..........................................</td>
      <td class="lbl">لجنة الجرد المفتشة:</td>
      <td>..........................................</td>
    </tr>
  </table>

  <table>
    <thead>
      <tr>
        <th>كود الصنف</th>
        <th>اسم الصنف والمستلزمات</th>
        <th>وحدة القياس</th>
        <th>الرصيد الدفتري</th>
        <th>الرصيد الفعلي بالمخزن</th>
        <th>عجز / زيادة</th>
        <th>حد الأمان (Par Level)</th>
        <th>توصية الشراء والتوريد</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>LIN-01</td><td>ملاية سرير كبير (King Sheet)</td><td>قطعة</td><td>84</td><td>..........</td><td>..........</td><td>84</td><td>..............................</td></tr>
      <tr><td>LIN-02</td><td>ملاية سرير صغير (Single Sheet)</td><td>قطعة</td><td>84</td><td>..........</td><td>..........</td><td>84</td><td>..............................</td></tr>
      <tr><td>LIN-03</td><td>بشكير حمام كبير (Bath Towel)</td><td>قطعة</td><td>84</td><td>..........</td><td>..........</td><td>84</td><td>..............................</td></tr>
      <tr><td>AMN-01</td><td>شامبو فندقي 30 مل (هينو)</td><td>كرتونة</td><td>5</td><td>..........</td><td>..........</td><td>3</td><td>..............................</td></tr>
      <tr><td>AMN-02</td><td>شاور جيل فندقي 30 مل (هينو)</td><td>كرتونة</td><td>4</td><td>..........</td><td>..........</td><td>3</td><td>..............................</td></tr>
      <tr><td>AMN-03</td><td>صابون فندقي معطر 20 جم</td><td>كرتونة</td><td>3</td><td>..........</td><td>..........</td><td>2</td><td>..............................</td></tr>
      <tr><td>MNT-01</td><td>لمبات إضاءة ليد 9 واط</td><td>علبة</td><td>10</td><td>..........</td><td>..........</td><td>5</td><td>..............................</td></tr>
      <tr><td>MNT-02</td><td>بطاريات ريموت تكييف وتلفزيون</td><td>علبة</td><td>4</td><td>..........</td><td>..........</td><td>2</td><td>..............................</td></tr>
    </tbody>
  </table>

  <table style="margin-top: 15px; border: none;">
    <tr style="border: none;">
      <td style="border: none; width: 50%; text-align: center;"><strong>توقيع أمين المخزن:</strong> ...........................</td>
      <td style="border: none; width: 50%; text-align: center;"><strong>اعتماد مدير الفندق:</strong> ...........................</td>
    </tr>
  </table>
</body>
</html>`;

// ---------------------------------------------------------
// تنفيذ وتوليد المستندات وتحديث الخريطة
// ---------------------------------------------------------
async function run() {
  await createInventoryExcel();

  const pdfItems = [
    { name: '01_استمارة_جرد_مشتملات_الغرفة_الفندقية_Room_Inventory', html: roomInvHtml },
    { name: '02_استمارة_جرد_وتقفيل_المخازن_Store_Audit_Sheet', html: storeInvHtml }
  ];

  pdfItems.forEach(item => {
    const htmlPath = path.join(invDocsDir, `${item.name}.html`);
    const pdfPath = path.join(invDocsDir, `${item.name}.pdf`);
    fs.writeFileSync(htmlPath, item.html, 'utf8');
    convertHtmlToPdf(htmlPath, pdfPath);
  });

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
    <div style="font-size: 9pt; color: #4a5568;">النسخة المحدثة والمطورة مع جرد الغرف والمخازن — 2026م</div>
  </div>

  <div class="folder-card">
    <div class="folder-name">📁 01_Accounting_System (النظام المحاسبي والماليات والجرد)</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>نظام_حجوزات_وتسكين_الغرف_الفندقي.xlsx:</strong> شاشة حالة الغرف الـ 25 التفاعلية (Room Rack).</li>
      <li><span class="badge-excel">EXCEL</span> <strong>جدول_رواتب_وتقييم_الموظفين_الشهري.xlsx:</strong> كشف الرواتب والـ KPIs وحضور وانصراف الموظفين.</li>
      <li><span class="badge-pdf">PDF</span> <strong>سياسة_النقدية_والتعامل_مع_الخزينة_Cash_Policy.pdf:</strong> السياسة المالية والخزينة.</li>
    </ul>

    <div style="font-weight: bold; color: #2B6CB0; margin-top: 6px;">📂 نماذج_جرد_الغرف_والمخازن (Room & Warehouse Inventory):</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_جرد_الغرف_والمخازن_الفندقية_الشامل.xlsx:</strong> جرد تفاعلي لأثاث ومشتملات الـ 25 غرفة ورصيد المخازن الثلاثة.</li>
      <li><span class="badge-pdf">PDF</span> <strong>01_استمارة_جرد_مشتملات_الغرفة_الفندقية_Room_Inventory.pdf:</strong> نموذج جرد ورقي مطبوع لمشتملات الغرفة.</li>
      <li><span class="badge-pdf">PDF</span> <strong>02_استمارة_جرد_وتقفيل_المخازن_Store_Audit_Sheet.pdf:</strong> نموذج جرد وتقفيل رصيد المخازن الفندقية.</li>
    </ul>

    <div style="font-weight: bold; color: #78350f; margin-top: 6px;">📂 مستندات_ورقيات_الاستقبال (نماذج كونتر الاستقبال):</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <strong>بطاقة_تسجيل_النزيل / إيصال_سداد / فاتورة_وكشف_حساب_النزيل / تقرير_تسليم_وردية / سجل_الأمانات.</strong></li>
    </ul>

    <div style="font-weight: bold; color: #2C5282; margin-top: 6px;">📂 مستندات_الإشراف_الداخلي_والغرف (Housekeeping Files):</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_تتبع_حركة_الكتانيات_والمغسلة_اليومي.xlsx</strong></li>
      <li><span class="badge-pdf">PDF</span> <strong>كشف_توزيع_ونظافة_الغرف / قائمة_فحص_جاهزية_الغرفة / طلب_وإذن_صيانة_الغرف.</strong></li>
    </ul>
  </div>

  <div class="folder-card" style="border-right-color: #D9822B;">
    <div class="folder-name">📁 02_Contracts_and_Legal (العقود والشؤون القانونية)</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <strong>عقد_عمل_مؤقت_وتعهد_فندقي.pdf & باقي العقود الرسمية.</strong></li>
    </ul>
  </div>

</body>
</html>`;

  fs.writeFileSync(sitemapHtmlPath, sitemapContent, 'utf8');
  convertHtmlToPdf(sitemapHtmlPath, sitemapPdfPath);
}

run().catch(err => console.error(err));
