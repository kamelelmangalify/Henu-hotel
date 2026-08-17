const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, HeadingLevel } = require('docx');
const { execSync } = require('child_process');
const ExcelJS = require('exceljs');

const rootDir = path.join('d:', 'Henu');
const baseProcDir = path.join(rootDir, '01_Accounting_System', 'مستندات_المشتريات_والموردين');

if (!fs.existsSync(baseProcDir)) {
  fs.mkdirSync(baseProcDir, { recursive: true });
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

// قائمة الموردين وأوامر الشراء المسلسلة
const vendorOrdersData = [
  {
    vendorFolder: 'مورد_شركة_كوين_للكتانيات_QN',
    vendorName: 'شركة كوين للكتانيات والبياضات الفندقية',
    prefix: 'QN',
    orders: [
      {
        code: 'QN_1',
        title: 'أمر شراء وتوريد ملايات وأكياس مخدات فندقية',
        date: '2026-08-01',
        items: [
          { name: 'ملاية فندقية كينج 300 غرزة (قطن 100%)', qty: '40 طقم', price: '320 جـ', total: '12,800 جـ' },
          { name: 'كيس مخدة فندقي أبيض قطن', qty: '80 قطعة', price: '45 جـ', total: '3,600 جـ' },
          { name: 'واقي مرتبة ضد الماء مقاس 180×200', qty: '15 قطعة', price: '280 جـ', total: '4,200 جـ' }
        ],
        grandTotal: '20,600 جـ',
        paymentTerms: 'نقداً عند التسليم بالعين'
      },
      {
        code: 'QN_2',
        title: 'أمر شراء وتوريد بشاكير وفوط حمامات فندقية',
        date: '2026-08-10',
        items: [
          { name: 'بشكير حمام فندقي ثقيل 700 جرام', qty: '50 قطعة', price: '190 جـ', total: '9,500 جـ' },
          { name: 'فوطة وجه قطن فندقية 50×90', qty: '60 قطعة', price: '75 جـ', total: '4,500 جـ' },
          { name: 'مشاية حمام قطن فندقية', qty: '25 قطعة', price: '85 جـ', total: '2,125 جـ' }
        ],
        grandTotal: '16,125 جـ',
        paymentTerms: 'نقداً عند التسليم'
      }
    ]
  },
  {
    vendorFolder: 'مورد_شركة_الأهرام_للضيافة_AH',
    vendorName: 'شركة الأهرام لخدمات ومستلزمات الضيافة',
    prefix: 'AH',
    orders: [
      {
        code: 'AH_1',
        title: 'أمر شراء وتوريد مستلزمات ضيافة النزلاء (Amenities)',
        date: '2026-08-03',
        items: [
          { name: 'عبوة شامبو ضيافة فندقي 30 مل', qty: '15 كرتونة (1500 عبوة)', price: '600 جـ', total: '9,000 جـ' },
          { name: 'عبوة شاور جل ضيافة فندقي 30 مل', qty: '15 كرتونة (1500 عبوة)', price: '600 جـ', total: '9,000 جـ' },
          { name: 'صابون ضيافة معطر 20 جرام', qty: '10 كرتونة (2000 قطعة)', price: '450 جـ', total: '4,500 جـ' }
        ],
        grandTotal: '22,500 جـ',
        paymentTerms: 'آجل 15 يوماً'
      },
      {
        code: 'AH_2',
        title: 'أمر شراء وتوريد أكواب ومستلزمات الكيتل والغرف',
        date: '2026-08-12',
        items: [
          { name: 'طقم أكواب زجاج فندقي للشاي والماء', qty: '30 طقم', price: '120 جـ', total: '3,600 جـ' },
          { name: 'غلاية مياه ستانلس كيتل 1.5 لتر', qty: '8 قطع', price: '350 جـ', total: '2,800 جـ' },
          { name: 'شماعات خشبية للدولاب', qty: '150 قطعة', price: '18 جـ', total: '2,700 جـ' }
        ],
        grandTotal: '9,100 جـ',
        paymentTerms: 'نقداً عند الاستلام'
      }
    ]
  },
  {
    vendorFolder: 'مورد_النور_للكهرباء_NR',
    vendorName: 'مورد النور للتجهيزات ومستلزمات الكهرباء',
    prefix: 'NR',
    orders: [
      {
        code: 'NR_1',
        title: 'أمر شراء وتوريد لمبات ليد ومستلزمات إضاءة الغرف',
        date: '2026-08-05',
        items: [
          { name: 'لمبة ليد 9 واط إضاءة دافئة Warm', qty: '30 علبة (300 لمبة)', price: '240 جـ', total: '7,200 جـ' },
          { name: 'شريط ليد مخفي للروف والغرف', qty: '5 لفة (250 متر)', price: '450 جـ', total: '2,250 جـ' },
          { name: 'مفتاح كارت كهرباء فندقي للغرفة', qty: '5 قطع', price: '380 جـ', total: '1,900 جـ' }
        ],
        grandTotal: '11,350 جـ',
        paymentTerms: 'نقداً كاش'
      },
      {
        code: 'NR_2',
        title: 'أمر شراء وتوريد بطاريات ريموت ووصلات شاشات',
        date: '2026-08-14',
        items: [
          { name: 'علبة بطاريات AAA لريموت الشاشات والتكييف', qty: '10 علب', price: '180 جـ', total: '1,800 جـ' },
          { name: 'كابل HDMI 1.5 متر للشاشات', qty: '15 قطعة', price: '65 جـ', total: '975 جـ' }
        ],
        grandTotal: '2,775 جـ',
        paymentTerms: 'نقداً كاش'
      }
    ]
  },
  {
    vendorFolder: 'مورد_شركة_كير_فرش_للمنظفات_CF',
    vendorName: 'شركة كير فرش لمواد ومساحيق النظافة والتطوير',
    prefix: 'CF',
    orders: [
      {
        code: 'CF_1',
        title: 'أمر شراء وتوريد المنظفات ومطهرات الأرضيات والحمامات',
        date: '2026-08-08',
        items: [
          { name: 'مطهر ومطهر أرضيات حمامات فندقي 20 لتر', qty: '8 جركن', price: '420 جـ', total: '3,360 جـ' },
          { name: 'منظف وملمع زجاج واستشوار 4 لتر', qty: '10 عبوة', price: '110 جـ', total: '1,100 جـ' },
          { name: 'مسحوق غسيل بياضات للمغسلة 25 كجم', qty: '4 شكائر', price: '850 جـ', total: '3,400 جـ' }
        ],
        grandTotal: '7,860 جـ',
        paymentTerms: 'نقداً كاش'
      }
    ]
  },
  {
    vendorFolder: 'مورد_الفرسان_للصيانة_والقطع_FR',
    vendorName: 'مورد الفرسان لقطع غيار السباكة والتكييف والصيانة',
    prefix: 'FR',
    orders: [
      {
        code: 'FR_1',
        title: 'أمر شراء وتوريد قطع غيار السباكة والتكييفات',
        date: '2026-08-11',
        items: [
          { name: 'قلب خلاط مياه حمام سيراميك 40 مم', qty: '20 قطعة', price: '85 جـ', total: '1,700 جـ' },
          { name: 'خرطوم دش استانلس 1.5 متر', qty: '12 قطعة', price: '95 جـ', total: '1,140 جـ' },
          { name: 'أسطوانة فريون R410a للتكييفات', qty: '1 أسطوانة', price: '3,200 جـ', total: '3,200 جـ' }
        ],
        grandTotal: '6,040 جـ',
        paymentTerms: 'نقداً عند التسليم'
      }
    ]
  }
];

// دالة إنشاء مستند Word لكل أمر شراء
async function createPoWordDoc(vendorInfo, order, targetFolder) {
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
          size: options.size || 28,
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
        new TableCell({ children: [createRtlParagraph("اسم الصنف والمواصفات", { bold: true, alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [createRtlParagraph("الكمية", { bold: true, alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [createRtlParagraph("سعر الوحدة", { bold: true, alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [createRtlParagraph("الإجمالي", { bold: true, alignment: AlignmentType.CENTER })] })
      ]
    })
  ];

  order.items.forEach((item, idx) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [createRtlParagraph(`${order.code}-ITM${idx+1}`, { alignment: AlignmentType.CENTER })] }),
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
        createRtlParagraph(`أمر شراء وتوريد فندقي معتمد — كود مسلسل: [ ${order.code} ]`, { bold: true, size: 36, color: "1F4E78", alignment: AlignmentType.CENTER }),
        createRtlParagraph(`تاريخ الإصدار: ${order.date}م   |   المورد: ${vendorInfo.vendorName}`, { bold: true, size: 26, color: "D97706", alignment: AlignmentType.CENTER, after: 200 }),

        createRtlParagraph(`الموضوع: ${order.title}`, { bold: true, size: 28, color: "1F4E78" }),
        createRtlParagraph(`إلى السادة / ${vendorInfo.vendorName}`, { bold: true, size: 26 }),
        createRtlParagraph("يرجى التكرم بتوريد الأصناف الموضحة بالجدول أدناه طبقاً للمواصفات والأسعار المعتمدة:", { size: 26, after: 150 }),

        new Table({
          visualRightToLeft: true,
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        }),

        createRtlParagraph(`\nإجمالي أمر الشراء: [ ${order.grandTotal} ]`, { bold: true, size: 32, color: "1F4E78" }),
        createRtlParagraph(`شروط الدفع والتسليم: ${order.paymentTerms} — التسليم بالفندق (نزلة السمان - الجيزة).`, { size: 26 }),

        createRtlParagraph("\nالتوقيعات والاعتماد الرسمي:", { bold: true, size: 28, color: "78350F", before: 200 }),
        createRtlParagraph("مسئول المشتريات: ...........................................               اعتماد مدير الفندق: ...........................................", { bold: true, alignment: AlignmentType.CENTER })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const fileName = `${order.code}_أمر_شراء_${order.title.replace(/\s+/g, '_')}.docx`;
  const docxPath = path.join(targetFolder, fileName);
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Word Created: ${fileName}`);
  return { docxPath, fileName };
}

// دالة إنشاء ملف HTML و PDF لكل أمر شراء
function createPoPdfDoc(vendorInfo, order, targetFolder, fileNameBase) {
  const htmlFileName = fileNameBase.replace('.docx', '.html');
  const pdfFileName = fileNameBase.replace('.docx', '.pdf');
  const htmlPath = path.join(targetFolder, htmlFileName);
  const pdfPath = path.join(targetFolder, pdfFileName);

  let rowsHtml = '';
  order.items.forEach((item, idx) => {
    rowsHtml += `
      <tr>
        <td style="text-align:center;">${order.code}-ITM${idx+1}</td>
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
  <title>أمر شراء ${order.code}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 15mm 18mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; line-height: 1.6; margin: 0; padding: 10px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 10px; margin-bottom: 15px; }
    .hotel-name { font-size: 12pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 18pt; font-weight: 800; color: #1F4E78; margin-top: 4px; }
    .meta-bar { background: #F8FAFC; border: 1px solid #CBD5E1; border-right: 5px solid #D97706; padding: 10px 14px; border-radius: 6px; margin-bottom: 15px; font-size: 10pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 10pt; }
    th { background: #1F4E78; color: white; padding: 8px 10px; border: 1px solid #1F4E78; text-align: center; }
    td { padding: 8px 10px; border: 1px solid #CBD5E1; text-align: right; }
    tr:nth-child(even) { background: #F8FAFC; }
    .total-box { background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 6px; padding: 10px; margin-top: 15px; text-align: center; font-size: 12pt; font-weight: bold; color: #78350F; }
    .signatures { display: flex; justify-content: space-between; margin-top: 35px; text-align: center; font-size: 10pt; font-weight: bold; }
  </style>
</head>
<body>

  <div class="header">
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">أمر شراء وتوريد فندقي معتمد — [ ${order.code} ]</div>
  </div>

  <div class="meta-bar">
    <strong>كود أمر الشراء المسلسل:</strong> <span style="color:#1F4E78; font-weight:bold;">${order.code}</span> &nbsp;|&nbsp;
    <strong>تاريخ الإصدار:</strong> ${order.date}م &nbsp;|&nbsp;
    <strong>المورد:</strong> ${vendorInfo.vendorName}
  </div>

  <div style="font-size: 10.5pt; font-weight: bold; color: #1F4E78; margin-bottom: 8px;">
    الموضوع: ${order.title}
  </div>

  <table>
    <thead>
      <tr>
        <th>كود الصنف</th>
        <th>اسم الصنف والمواصفات</th>
        <th>الكمية</th>
        <th>سعر الوحدة</th>
        <th>الإجمالي</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="total-box">
    إجمالي القيمة الإيجارية / الشراء لأمر التوريد: [ ${order.grandTotal} ]
  </div>

  <div style="font-size: 9.5pt; margin-top: 10px; color: #475569;">
    📌 <strong>شروط الدفع والتسليم:</strong> ${order.paymentTerms} — التسليم بمقر فندق هينو (نزلة السمان - الجيزة).
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

// دالة إنشاء كشف وسجل الإكسيل الموحد لأوامر الشراء الموزعة
async function createMasterOrdersExcel() {
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

  vendorOrdersData.forEach(v => {
    v.orders.forEach((o, idx) => {
      const row = sheet.addRow([
        o.code,
        v.vendorName,
        o.title,
        o.date,
        o.grandTotal,
        o.paymentTerms,
        'تم الاعتماد والتوريد 🟢'
      ]);
      row.height = 22;
      row.eachCell((cell, colNum) => {
        cell.font = { name: 'Arial', size: 9 };
        cell.alignment = { horizontal: colNum === 1 || colNum === 4 || colNum === 5 || colNum === 7 ? 'center' : 'right', vertical: 'middle' };
        cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };
      });
    });
  });

  const w = [18, 30, 32, 14, 18, 24, 20];
  sheet.columns.forEach((col, i) => col.width = w[i]);

  const excelPath = path.join(baseProcDir, 'سجل_أوامر_الشراء_حسب_الموردين.xlsx');
  await workbook.xlsx.writeFile(excelPath);
  console.log(`✅ Master Excel Log Created: سجل_أوامر_الشراء_حسب_الموردين.xlsx`);
}

// ---------------------------------------------------------
// تحديث خريطة توزيع المستندات (Update Sitemap)
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
    <div style="font-size: 9pt; color: #4a5568;">النسخة الشاملة المزودة بمجلدات الموردين وأوامر الشراء المسلسلة (QN / AH / NR / CF / FR) — 2026م</div>
  </div>

  <div class="folder-card" style="border-right-color: #D97706;">
    <div class="folder-name">📁 01_Accounting_System / مستندات_المشتريات_والموردين</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_أوامر_الشراء_حسب_الموردين.xlsx:</strong> دليل الإكسيل الشامل لأوامر الشراء الأكواد المسلسلة.</li>
      <li>📁 <strong>مورد_شركة_كوين_للكتانيات_QN:</strong> أمر شراء QN_1، أمر شراء QN_2 (Word + PDF).</li>
      <li>📁 <strong>مورد_شركة_الأهرام_للضيافة_AH:</strong> أمر شراء AH_1، أمر شراء AH_2 (Word + PDF).</li>
      <li>📁 <strong>مورد_النور_للكهرباء_NR:</strong> أمر شراء NR_1، أمر شراء NR_2 (Word + PDF).</li>
      <li>📁 <strong>مورد_شركة_كير_فرش_للمنظفات_CF:</strong> أمر شراء CF_1 (Word + PDF).</li>
      <li>📁 <strong>مورد_الفرسان_للصيانة_والقطع_FR:</strong> أمر شراء FR_1 (Word + PDF).</li>
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
  for (const v of vendorOrdersData) {
    const targetFolder = path.join(baseProcDir, v.vendorFolder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    for (const o of v.orders) {
      const { docxPath, fileName } = await createPoWordDoc(v, o, targetFolder);
      createPoPdfDoc(v, o, targetFolder, fileName);
    }
  }

  await createMasterOrdersExcel();
  updateSitemap();
  console.log('\n✨ VENDOR-WISE PURCHASE ORDERS & SITEMAP GENERATED SUCCESSFULLY!');
}

main().catch(err => console.error(err));
