const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, HeadingLevel } = require('docx');
const { execSync } = require('child_process');
const ExcelJS = require('exceljs');

const rootDir = path.join('d:', 'Henu');
const maintDir = path.join(rootDir, '01_Accounting_System', 'مستندات_الصيانة_والدعم_الفني');
const procDir = path.join(rootDir, '01_Accounting_System', 'مستندات_المشتريات_والموردين');

[maintDir, procDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

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
  } catch (err) {}
}

// =========================================================
// 1. قسم الصيانة والدعم الفني (Engineering & Maintenance)
// =========================================================

// أ) شيت إكسيل الصيانة الوقائية الدورية PPM للـ 25 غرفة
async function createMaintenanceExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Henu Hotel Maintenance';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('الصيانة الوقائية للـ 25 غرفة (PPM)', {
    views: [{ rightToLeft: true }]
  });

  sheet.mergeCells('A1:J1');
  const t = sheet.getCell('A1');
  t.value = '🔧 فندق هينو الأهرامات — جدول خطة الصيانة الوقائية الدورية للـ 25 غرفة والمعدات (Preventative Maintenance Schedule - PPM)';
  t.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  t.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  t.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 30;

  sheet.addRow([]);

  const headers = [
    'رقم الغرفة',
    'فحص التكييف والتبريد',
    'فحص السباكة والخلاطات',
    'فحص الكهرباء والإضاءة',
    'فحص التلفزيون والرسيفر',
    'فحص الثلاجة والميني بار',
    'فحص الأبواب والكوالين',
    'تاريخ آخر صيانة وقائية',
    'حالة الجاهزية الفنية',
    'توقيع الفني المسئول'
  ];

  const hRow = sheet.addRow(headers);
  hRow.height = 26;
  hRow.eachCell(cell => {
    cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  const rooms = ['101', '102', '103', '104', '105', '106', '201', '202', '203', '204', '205', '206', '207', '301', '302', '303', '304', '305', '306', '401', '402', '403', '404', '405', '406'];

  rooms.forEach((rNo, idx) => {
    const row = sheet.addRow([
      `غرفة ${rNo}`,
      'سليم 🟢',
      'سليم 🟢',
      'سليم 🟢',
      'سليم 🟢',
      'سليم 🟢',
      'سليم 🟢',
      '2026-08-01',
      'جاهزة للتسكين 100%',
      'م. تامر فؤاد'
    ]);
    row.height = 20;
    const bg = idx % 2 === 0 ? 'F9FAFB' : 'FFFFFF';
    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };
    });
  });

  const w = [14, 18, 18, 18, 18, 18, 18, 18, 20, 18];
  sheet.columns.forEach((col, i) => col.width = w[i]);

  const excelPath = path.join(maintDir, 'جدول_الصيانة_الوقائية_الدورية_للغرف_والأجهزة.xlsx');
  await workbook.xlsx.writeFile(excelPath);
  console.log(`✅ Excel Created: جدول_الصيانة_الوقائية_الدورية_للغرف_والأجهزة.xlsx`);
}

// ب) مستندات وورد الصيانة
async function generateMaintenanceWordDocs() {
  const ppmDoc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات\n", bold: true, size: 28, color: "78350F" }),
            new TextRun({ text: "قائمة الفحص والتفتيش الدوري للصيانة الوقائية (PPM Checklist)\n", bold: true, size: 32, color: "1F4E78" })
          ]
        }),
        new Paragraph({ text: "رقم الغرفة: ( ...... )   تاريخ التفتيش: ...../...../2026م   اسم المهندس/الفني: ..........................................", size: 22 }),
        new Paragraph({ text: "\nبنود الفحص والتفتيش الفني الدوري:", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "بند الصيانة الفنية", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "الحالة الفنية", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "الإجراء المنفذ والتوصية", bold: true })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "تكييف الغرفة (غسيل الفلاتر وضغط الفريون)" })] }),
                new TableCell({ children: [new Paragraph({ text: "[  ] ممتاز    [  ] صيانة" })] }),
                new TableCell({ children: [new Paragraph({ text: "..................................................." })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "السباكة والخلاطات والدش وضغط المياه" })] }),
                new TableCell({ children: [new Paragraph({ text: "[  ] ممتاز    [  ] صيانة" })] }),
                new TableCell({ children: [new Paragraph({ text: "..................................................." })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "الكهرباء والفيش والإضاءة ومفتاح الكارت" })] }),
                new TableCell({ children: [new Paragraph({ text: "[  ] ممتاز    [  ] صيانة" })] }),
                new TableCell({ children: [new Paragraph({ text: "..................................................." })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "كوالين الأبواب والكارت الإلكتروني" })] }),
                new TableCell({ children: [new Paragraph({ text: "[  ] ممتاز    [  ] صيانة" })] }),
                new TableCell({ children: [new Paragraph({ text: "..................................................." })] })
              ]
            })
          ]
        }),
        new Paragraph({ text: "\n\nتوقيع الفني المسؤول: ...........................................               اعتماد المشرف: ...........................................", bold: true, alignment: AlignmentType.CENTER })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(ppmDoc);
  fs.writeFileSync(path.join(maintDir, '01_قائمة_فحص_والتفتيش_الدوري_للصيانة_PPM_Checklist.docx'), buffer);
  console.log(`✅ Word Created: 01_قائمة_فحص_والتفتيش_الدوري_للصيانة_PPM_Checklist.docx`);
}

// =========================================================
// 2. قسم المشتريات والموردين (Procurement & Purchasing)
// =========================================================

// أ) شيت إكسيل مقارنة عروض الأسعار وسجل الموردين
async function createProcurementExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Henu Hotel Procurement';
  workbook.created = new Date();

  // الشيت الأول: مقارنة عروض الأسعار (Price Comparison Sheet)
  const sheet = workbook.addWorksheet('مقارنة عروض الأسعار (Comparison Sheet)', {
    views: [{ rightToLeft: true }]
  });

  sheet.mergeCells('A1:I1');
  const t = sheet.getCell('A1');
  t.value = '🛒 فندق هينو الأهرامات — جدول مقارنة عروض الأسعار واختيار المورد المناسب (Price Comparison Sheet)';
  t.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  t.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  t.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 30;

  sheet.addRow([]);

  const headers = [
    'الصنف المطلوب',
    'الكمية',
    'وحدة القياس',
    'عرض المورد الأول (سعر/إجمالي)',
    'عرض المورد الثاني (سعر/إجمالي)',
    'عرض المورد الثالث (سعر/إجمالي)',
    'المورد المختار والأقل سعراً',
    'فترة التوريد وشروط الدفع',
    'قرار لجنة المشتريات'
  ];

  const hRow = sheet.addRow(headers);
  hRow.height = 26;
  hRow.eachCell(cell => {
    cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  const pItems = [
    ['ملايات فندقية 300 غرزة', 50, 'طقم', '320 جـ / 16,000 جـ', '300 جـ / 15,000 جـ', '350 جـ / 17,500 جـ', 'شركة كوين للكتانيات', 'خلال 3 أيام / نقداً', 'تم الاعتماد 🟢'],
    ['شامبو وشاور صابون ضيافة', 10, 'كرتونة', '650 جـ / 6,500 جـ', '600 جـ / 6,000 جـ', '620 جـ / 6,200 جـ', 'شركة الأهرام للضيافة', 'خلال يومين / نقداً', 'تم الاعتماد 🟢'],
    ['لمبات ليد 9 واط أبيض', 20, 'علبة', '250 جـ / 5,000 جـ', '240 جـ / 4,800 جـ', '260 جـ / 5,200 جـ', 'مورد النور للكهرباء', 'فوراً كاش', 'تم الاعتماد 🟢']
  ];

  pItems.forEach((rowVals, idx) => {
    const row = sheet.addRow(rowVals);
    row.height = 22;
    const bg = idx % 2 === 0 ? 'F9FAFB' : 'FFFFFF';
    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { horizontal: colNum <= 3 ? 'right' : 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };
    });
  });

  const w = [24, 10, 12, 22, 22, 22, 22, 22, 18];
  sheet.columns.forEach((col, i) => col.width = w[i]);

  const excelPath = path.join(procDir, 'شيت_مقارنة_عروض_الأسعار_وسجل_الموردين.xlsx');
  await workbook.xlsx.writeFile(excelPath);
  console.log(`✅ Excel Created: شيت_مقارنة_عروض_الأسعار_وسجل_الموردين.xlsx`);
}

// ب) مستندات وورد المشتريات (Purchase Requisition & Purchase Order DOCX)
async function generateProcurementWordDocs() {
  // 1. طلب شراء داخلي معتمد DOCX
  const reqDoc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات\n", bold: true, size: 28, color: "78350F" }),
            new TextRun({ text: "طلب شراء داخلي معتمد (Purchase Requisition)\n", bold: true, size: 32, color: "1F4E78" })
          ]
        }),
        new Paragraph({ text: "رقم الطلب: PR-2026-.......   القسم الطالب: ..........................   التاريخ: ...../...../2026م", size: 22 }),
        new Paragraph({ text: "\nالأصناف والمستلزمات المطلوبة:", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "م", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "اسم الصنف والمواصفات", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "الكمية المطلوبة", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "سبب ومبرر الطلب", bold: true })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "1" })] }),
                new TableCell({ children: [new Paragraph({ text: "..................................................." })] }),
                new TableCell({ children: [new Paragraph({ text: "............" })] }),
                new TableCell({ children: [new Paragraph({ text: "وصول الرصيد لحد الأمان" })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "2" })] }),
                new TableCell({ children: [new Paragraph({ text: "..................................................." })] }),
                new TableCell({ children: [new Paragraph({ text: "............" })] }),
                new TableCell({ children: [new Paragraph({ text: "احتياج صيانة / تشغيل" })] })
              ]
            })
          ]
        }),
        new Paragraph({ text: "\n\nتوقيع رئيس القسم الطالب: ...........................               اعتماد المدير المالي: ...........................", bold: true, alignment: AlignmentType.CENTER })
      ]
    }]
  });

  const reqBuffer = await Packer.toBuffer(reqDoc);
  fs.writeFileSync(path.join(procDir, '01_طلب_شراء_داخلي_معتمد_Purchase_Requisition.docx'), reqBuffer);
  console.log(`✅ Word Created: 01_طلب_شراء_داخلي_معتمد_Purchase_Requisition.docx`);

  // 2. أمر شراء وتوريد فندقي معتمد PO DOCX
  const poDoc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات\n", bold: true, size: 28, color: "78350F" }),
            new TextRun({ text: "أمر شراء وتوريد فندقي معتمد (PURCHASE ORDER - PO)\n", bold: true, size: 32, color: "1F4E78" })
          ]
        }),
        new Paragraph({ text: "أمر شراء رقم: PO-2026-.......   إلى السادة / شركة .........................................   التاريخ: ...../...../2026م", size: 22 }),
        new Paragraph({ text: "يرجى التكرم بتوريد الأصناف التالية بموجب المواصفات والأسعار المتفق عليها:", size: 22 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "الصنف", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "الكمية", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "سعر الوحدة", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "الإجمالي", bold: true })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "..................................................." })] }),
                new TableCell({ children: [new Paragraph({ text: "............" })] }),
                new TableCell({ children: [new Paragraph({ text: "............ جـ" })] }),
                new TableCell({ children: [new Paragraph({ text: "............ جـ" })] })
              ]
            })
          ]
        }),
        new Paragraph({ text: "\nمكان التسليم: الفندق (نزلة السمان - الجيزة)   شروط الدفع: [ ] نقداً عند الاستلام   [ ] آجل", size: 22 }),
        new Paragraph({ text: "\n\nمسئول المشتريات: ...........................               اعتماد مدير الفندق: ...........................", bold: true, alignment: AlignmentType.CENTER })
      ]
    }]
  });

  const poBuffer = await Packer.toBuffer(poDoc);
  fs.writeFileSync(path.join(procDir, '02_أمر_شراء_وتوريد_فندقي_معتمد_Purchase_Order.docx'), poBuffer);
  console.log(`✅ Word Created: 02_أمر_شراء_وتوريد_فندقي_معتمد_Purchase_Order.docx`);
}

// ---------------------------------------------------------
// 3. تحديث خريطة توزيع المستندات (Update Sitemap)
// ---------------------------------------------------------
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
    <div style="font-size: 9pt; color: #4a5568;">نسخة أنظمة الصيانة والدعم الفني والمشتريات والموردين — 2026م</div>
  </div>

  <div class="folder-card">
    <div class="folder-name">📁 01_Accounting_System (النظام المحاسبي والتشغيل)</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>نظام_حجوزات_وتسكين_الغرف_الفندقي.xlsx & جدول_رواتب_وتقييم_الموظفين_الشهري.xlsx</strong></li>
    </ul>

    <div style="font-weight: bold; color: #C53030; margin-top: 6px;">📂 مستندات_الصيانة_والدعم_الفني (Engineering & PPM):</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>جدول_الصيانة_الوقائية_الدورية_للغرف_والأجهزة.xlsx:</strong> خطة الصيانة PPM للـ 25 غرفة.</li>
      <li><span class="badge-word">WORD</span> <strong>01_قائمة_فحص_والتفتيش_الدوري_للصيانة_PPM_Checklist.docx</strong></li>
    </ul>

    <div style="font-weight: bold; color: #D69E2E; margin-top: 6px;">📂 مستندات_المشتريات_والموردين (Procurement & Purchasing):</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>شيت_مقارنة_عروض_الأسعار_وسجل_الموردين.xlsx:</strong> مقارنة العروض اختيار الأقل سعراً.</li>
      <li><span class="badge-word">WORD</span> <strong>01_طلب_شراء_داخلي_معتمد_Purchase_Requisition.docx</strong></li>
      <li><span class="badge-word">WORD</span> <strong>02_أمر_شراء_وتوريد_فندقي_معتمد_Purchase_Order.docx</strong></li>
    </ul>

    <div style="font-weight: bold; color: #2B6CB0; margin-top: 6px;">📂 نماذج_جرد_الغرف_والمخازن ومستندات_ورقيات_الاستقبال:</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_جرد_الغرف_والمخازن_الفندقية_المطور.xlsx / بطاقة_تسجيل_النزيل.docx / إيصال_سداد.docx</strong></li>
    </ul>
  </div>

  <div class="folder-card" style="border-right-color: #D9822B;">
    <div class="folder-name">📁 02_Contracts_and_Legal (العقود واللوائح القانونية)</div>
    <ul>
      <li><span class="badge-word">WORD</span> <strong>عقد_عمل_مؤقت_وتعهد_فندقي.docx / pdf.</strong></li>
    </ul>
  </div>

</body>
</html>`;

  fs.writeFileSync(sitemapHtmlPath, sitemapContent, 'utf8');
  convertHtmlToPdf(sitemapHtmlPath, sitemapPdfPath);
}

async function main() {
  await createMaintenanceExcel();
  await generateMaintenanceWordDocs();
  await createProcurementExcel();
  await generateProcurementWordDocs();
  updateSitemap();
  console.log('\n✨ MAINTENANCE & PROCUREMENT SYSTEM GENERATED SUCCESSFULLY!');
}

main().catch(err => console.error(err));
