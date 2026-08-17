const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType } = require('docx');
const { execSync } = require('child_process');
const ExcelJS = require('exceljs');

const rootDir = path.join('d:', 'Henu');
const queenTargetFolder = path.join(rootDir, '01_Accounting_System', 'مستندات_المشتريات_والموردين', 'مورد_شركة_كوين_للكتانيات_QN');
const procDir = path.join(rootDir, '01_Accounting_System', 'مستندات_المشتريات_والموردين');

if (!fs.existsSync(queenTargetFolder)) {
  fs.mkdirSync(queenTargetFolder, { recursive: true });
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

const vendorInfo = {
  vendorName: 'شركة كوين للكتانيات والبياضات الفندقية',
  prefix: 'QN'
};

const qn3Order = {
  code: 'QN_3',
  title: 'أمر شراء وتوريد لحف فندقية وكفرات لحاف فردي وكبير',
  date: '2026-08-17',
  items: [
    { name: 'لحاف فندقي فردي (Single Duvet)', qty: '15 قطعة', price: '720 جـ', total: '10,800 جـ' },
    { name: 'كفر لحاف فندقي فردي (Single Duvet Cover)', qty: '25 قطعة', price: '550 جـ', total: '13,750 جـ' },
    { name: 'لحاف فندقي كبير كينج (King Duvet)', qty: '5 قطع', price: '990 جـ', total: '4,950 جـ' },
    { name: 'كفر لحاف فندقي كبير كينج (King Duvet Cover)', qty: '10 قطع', price: '690 جـ', total: '6,900 جـ' }
  ],
  grandTotal: '36,400 جـ',
  grandTotalSpelled: 'ستة وثلاثون ألف وأربعمائة جنيه مصري لا غير',
  paymentTerms: 'نقداً عند التسليم بالعين — التسليم بمقر فندق هينو الأهرامات (نزلة السمان - الجيزة)'
};

// 1. توليد مستند Word (.docx)
async function createQn3WordDoc() {
  const fontName = 'Traditional Arabic';

  const createRtlParagraph = (text, options = {}) => {
    return new Paragraph({
      rightToLeft: true,
      alignment: options.alignment || AlignmentType.RIGHT,
      spacing: { before: options.before || 100, after: options.after || 100, line: 360 },
      children: [
        new TextRun({
          text: text,
          rightToLeft: true,
          font: fontName,
          size: options.size || 28, // 14pt
          bold: options.bold || false,
          color: options.color || "000000"
        })
      ]
    });
  };

  const tableRows = [
    new TableRow({
      children: [
        new TableCell({ children: [createRtlParagraph("كود الصنف", { bold: true, alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [createRtlParagraph("اسم الصنف والمواصفات الفندقية", { bold: true, alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [createRtlParagraph("الكمية", { bold: true, alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [createRtlParagraph("سعر الوحدة", { bold: true, alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [createRtlParagraph("إجمالي المبلغ", { bold: true, alignment: AlignmentType.CENTER })] })
      ]
    })
  ];

  qn3Order.items.forEach((item, idx) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [createRtlParagraph(`${qn3Order.code}-ITM${idx+1}`, { alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [createRtlParagraph(item.name)] }),
          new TableCell({ children: [createRtlParagraph(item.qty, { alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [createRtlParagraph(item.price, { alignment: AlignmentType.CENTER })] }),
          new TableCell({ children: [createRtlParagraph(item.total, { alignment: AlignmentType.CENTER })] })
        ]
      })
    );
  });

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
      children: [
        createRtlParagraph("H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات", { bold: true, size: 28, color: "78350F", alignment: AlignmentType.CENTER }),
        createRtlParagraph(`أمر شراء وتوريد فندقي معتمد — كود مسلسل: [ ${qn3Order.code} ]`, { bold: true, size: 36, color: "1F4E78", alignment: AlignmentType.CENTER }),
        createRtlParagraph(`تاريخ الإصدار: ${qn3Order.date}م   |   المورد: ${vendorInfo.vendorName}`, { bold: true, size: 26, color: "D97706", alignment: AlignmentType.CENTER, after: 200 }),

        createRtlParagraph(`الموضوع: ${qn3Order.title}`, { bold: true, size: 28, color: "1F4E78" }),
        createRtlParagraph(`إلى السادة / ${vendorInfo.vendorName}`, { bold: true, size: 26 }),
        createRtlParagraph("يرجى التكرم بتوريد اللحف وكفرات اللحاف الفندقية الموضحة بالجدول أدناه طبقاً للشروط والمواصفات السابقة:", { size: 26, after: 150 }),

        new Table({
          visualRightToLeft: true,
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        }),

        createRtlParagraph(`\nإجمالي أمر الشراء: [ ${qn3Order.grandTotal} ] (${qn3Order.grandTotalSpelled})`, { bold: true, size: 30, color: "1F4E78" }),
        createRtlParagraph(`شروط الدفع والتسليم: ${qn3Order.paymentTerms}.`, { size: 26 }),

        createRtlParagraph("\nالتوقيعات والاعتماد الرسمي:", { bold: true, size: 28, color: "78350F", before: 200 }),
        createRtlParagraph("مسئول المشتريات: ...........................................               اعتماد مدير الفندق: ...........................................", { bold: true, alignment: AlignmentType.CENTER })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.join(queenTargetFolder, 'QN_3_أمر_شراء_وتوريد_لحف_وكفرات_لحاف_فندقية.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Word Created: QN_3_أمر_شراء_وتوريد_لحف_وكفرات_لحاف_فندقية.docx`);
}

// 2. توليد مستند PDF فاخر
function createQn3PdfDoc() {
  const htmlPath = path.join(queenTargetFolder, 'QN_3_أمر_شراء_وتوريد_لحف_وكفرات_لحاف_فندقية.html');
  const pdfPath = path.join(queenTargetFolder, 'QN_3_أمر_شراء_وتوريد_لحف_وكفرات_لحاف_فندقية.pdf');

  let rowsHtml = '';
  qn3Order.items.forEach((item, idx) => {
    rowsHtml += `
      <tr>
        <td style="text-align:center;">${qn3Order.code}-ITM${idx+1}</td>
        <td>${item.name}</td>
        <td style="text-align:center;">${item.qty}</td>
        <td style="text-align:center;">${item.price}</td>
        <td style="text-align:center; font-weight:bold; color:#1F4E78;">${item.total}</td>
      </tr>
    `;
  });

  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>أمر شراء QN_3</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 15mm 18mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; line-height: 1.6; margin: 0; padding: 10px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 10px; margin-bottom: 15px; }
    .hotel-name { font-size: 12pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 18pt; font-weight: 800; color: #1F4E78; margin-top: 4px; }
    .meta-bar { background: #F8FAFC; border: 1px solid #CBD5E1; border-right: 5px solid #D97706; padding: 10px 14px; border-radius: 6px; margin-bottom: 15px; font-size: 10pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 10.5pt; }
    th { background: #1F4E78; color: white; padding: 9px 10px; border: 1px solid #1F4E78; text-align: center; }
    td { padding: 9px 10px; border: 1px solid #CBD5E1; text-align: right; }
    tr:nth-child(even) { background: #F8FAFC; }
    .total-box { background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 6px; padding: 12px; margin-top: 18px; text-align: center; font-size: 12pt; font-weight: bold; color: #78350F; }
    .signatures { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; font-size: 10pt; font-weight: bold; }
  </style>
</head>
<body>

  <div class="header">
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">أمر شراء وتوريد فندقي معتمد — [ ${qn3Order.code} ]</div>
  </div>

  <div class="meta-bar">
    <strong>كود أمر الشراء المسلسل:</strong> <span style="color:#1F4E78; font-weight:bold;">${qn3Order.code}</span> &nbsp;|&nbsp;
    <strong>تاريخ الإصدار:</strong> ${qn3Order.date}م &nbsp;|&nbsp;
    <strong>المورد:</strong> ${vendorInfo.vendorName}
  </div>

  <div style="font-size: 11pt; font-weight: bold; color: #1F4E78; margin-bottom: 8px;">
    الموضوع: ${qn3Order.title}
  </div>

  <table>
    <thead>
      <tr>
        <th>كود الصنف</th>
        <th>اسم الصنف والمواصفات الفندقية</th>
        <th>الكمية المطلوبة</th>
        <th>سعر الوحدة</th>
        <th>إجمالي المبلغ</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="total-box">
    إجمالي القيمة الكلية لأمر التوريد QN_3: [ ${qn3Order.grandTotal} ]<br>
    <span style="font-size:10pt; font-weight:normal; color:#451a03;">(${qn3Order.grandTotalSpelled})</span>
  </div>

  <div style="font-size: 9.5pt; margin-top: 12px; color: #475569;">
    📌 <strong>شروط الدفع والتسليم:</strong> ${qn3Order.paymentTerms}.
  </div>

  <div class="signatures">
    <div>مسئول المشتريات: .......................................</div>
    <div>اعتماد مدير الفندق: .......................................</div>
  </div>

</body>
</html>`;

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  convertHtmlToPdf(htmlPath, pdfPath);
}

// 3. تحديث سجل الإكسيل الموحد
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
    ['QN_3', 'شركة كوين للكتانيات والبياضات الفندقية', 'أمر شراء وتوريد لحف فندقية وكفرات لحاف فردي وكبير', '2026-08-17', '36,400 جـ', 'نقداً عند التسليم بالعين', 'تم الاعتماد جاري التوريد 🟢'],
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

  const w = [18, 30, 38, 14, 18, 24, 20];
  sheet.columns.forEach((col, i) => col.width = w[i]);

  const excelPath = path.join(procDir, 'سجل_أوامر_الشراء_حسب_الموردين.xlsx');
  await workbook.xlsx.writeFile(excelPath);
  console.log(`✅ Master Excel Log Updated with QN_3: سجل_أوامر_الشراء_حسب_الموردين.xlsx`);
}

// 4. تحديث خريطة المستندات
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
    <div style="font-size: 9pt; color: #4a5568;">النسخة الشاملة المزودة بأمر التوريد الجديد QN_3 لشركة كوين (لحف وكفرات لحاف) — 2026م</div>
  </div>

  <div class="folder-card" style="border-right-color: #D97706;">
    <div class="folder-name">📁 01_Accounting_System / مستندات_المشتريات_والموردين</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_أوامر_الشراء_حسب_الموردين.xlsx:</strong> سجل أوامر الشراء المسلسلة المحدث (QN_1, QN_2, QN_3, AH, NR, CF, FR).</li>
      <li>📁 <strong>مورد_شركة_كوين_للكتانيات_QN:</strong> (QN_1, QN_2, <strong>QN_3: أمر توريد اللحف وكفرات اللحاف</strong>).</li>
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

async function main() {
  await createQn3WordDoc();
  createQn3PdfDoc();
  await updateMasterOrdersExcel();
  updateSitemap();
  console.log('\n✨ PURCHASE ORDER QN_3 GENERATED AND SITEMAP UPDATED SUCCESSFULLY!');
}

main().catch(err => console.error(err));
