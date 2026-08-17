const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType } = require('docx');
const { execSync } = require('child_process');

const rootDir = path.join('d:', 'Henu');
const receiptsDir = path.join(rootDir, '02_Contracts_and_Legal', 'إيصالات_سداد_الإيجار_الشهرية');

if (!fs.existsSync(receiptsDir)) {
  fs.mkdirSync(receiptsDir, { recursive: true });
}

const NASR_ID = '29802012101278';
const MOHAMED_ID = '26407212101657';

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

const receiptData = {
  receiptNo: 'REC-RENT-2026-08',
  date: '2026-08-01',
  amountNum: '220,000 جـ',
  amountText: 'مائتان وعشرون ألف جنيه مصري لا غير',
  lessorName: 'نصر دسوقي عبد الحميد عبد الصمد',
  lessorAddress: 'شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة',
  lessorNationalId: NASR_ID,
  lesseeCompany: 'شركة المطعم الأرجنتيني 2 لإدارة الفنادق والمطاعم',
  lesseeRep: 'السيد / محمد ممدوح عبد الحميد مرسي',
  lesseeNationalId: MOHAMED_ID,
  propertyAddress: 'البنسيون الفندقي الكائن في 21 شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة (27 غرفة)',
  forPeriod: 'القيمة الإيجارية الشهريّة عن شهر أغسطس 2026م'
};

// 1. توليد مستند Word (.docx)
async function createReceiptWordDoc() {
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

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
      children: [
        createRtlParagraph("بسم الله الرحمن الرحيم", { bold: true, size: 28, color: "78350F", alignment: AlignmentType.CENTER }),
        createRtlParagraph("إيــصــال اســتــلام نــقــديــة — إيـجــار شـهــري", { bold: true, size: 38, color: "1F4E78", alignment: AlignmentType.CENTER }),
        createRtlParagraph(`رقم الإيصال: [ ${receiptData.receiptNo} ]   |   التاريخ: 01 / 08 / 2026م`, { bold: true, size: 26, color: "D97706", alignment: AlignmentType.CENTER, after: 200 }),

        createRtlParagraph(`المبلغ المستلم: [ ${receiptData.amountNum} ] (${receiptData.amountText})`, { bold: true, size: 32, color: "1F4E78", before: 150 }),

        createRtlParagraph(`أقر أنا المؤجر: السيد / ${receiptData.lessorName}`, { bold: true, size: 28 }),
        createRtlParagraph(`المقيم في: ${receiptData.lessorAddress}   |   رقم قومي: ( ${receiptData.lessorNationalId} )`, { size: 26 }),

        createRtlParagraph(`بانني استلمت نقداً وحررت إيصالاً من السادة: ${receiptData.lesseeCompany}`, { bold: true, size: 28, before: 150 }),
        createRtlParagraph(`ويمثلها السيد / ${receiptData.lesseeRep} (رقم قومي: ${receiptData.lesseeNationalId})`, { size: 26 }),

        createRtlParagraph(`مبلغاً وقدره: ${receiptData.amountText} فقط لا غير.`, { bold: true, size: 28, color: "1F4E78", before: 150 }),
        createRtlParagraph(`وذلك قيمة: ${receiptData.forPeriod} الخاص بالعين المؤجرة وهي: ${receiptData.propertyAddress}.`, { size: 26 }),

        createRtlParagraph("وهذا إيصال مني بسداد كافة المستحقات الإيجارية عن هذا الشهر وبراءة ذمة المستأجر عنه.", { bold: true, size: 26, before: 150 }),

        createRtlParagraph("\nالمستلم (المؤجر):", { bold: true, size: 30, color: "78350F", before: 250 }),
        createRtlParagraph("الاسم: نصر دسوقي عبد الحميد عبد الصمد", { bold: true, size: 28 }),
        createRtlParagraph(`الرقم القومي: ${receiptData.lessorNationalId}`, { size: 26 }),
        createRtlParagraph("التوقيع: ...........................................               البصمة: ...........................................", { bold: true, alignment: AlignmentType.CENTER, before: 150 })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.join(receiptsDir, 'إيصال_استلام_إيجار_شهر_أغسطس_2026_نصر_دسوقي.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Word Created: إيصال_استلام_إيجار_شهر_أغسطس_2026_نصر_دسوقي.docx`);
}

// 2. توليد مستند PDF فاخر
function createReceiptPdfDoc() {
  const htmlPath = path.join(receiptsDir, 'إيصال_استلام_إيجار_شهر_أغسطس_2026_نصر_دسوقي.html');
  const pdfPath = path.join(receiptsDir, 'إيصال_استلام_إيجار_شهر_أغسطس_2026_نصر_دسوقي.pdf');

  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>إيصال استلام إيجار شهر أغسطس 2026 — نصر دسوقي</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 18mm 20mm; }
    body { font-family: 'Amiri', 'Tajawal', Arial, serif; color: #0f172a; line-height: 1.8; margin: 0; padding: 15px; direction: rtl; }
    
    .receipt-card { border: 2px solid #1F4E78; border-radius: 12px; padding: 25px; background: #FFFFFF; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); position: relative; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 12px; margin-bottom: 20px; }
    .basmala { font-size: 14pt; font-weight: bold; color: #78350F; margin-bottom: 4px; }
    .doc-title { font-size: 22pt; font-weight: bold; color: #1F4E78; margin: 0; }
    
    .meta-bar { display: flex; justify-content: space-between; background: #F8FAFC; border: 1px solid #CBD5E1; border-right: 6px solid #D97706; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-size: 12pt; font-family: 'Tajawal', sans-serif; }
    
    .amount-box { background: #FEF3C7; border: 2px dashed #F59E0B; border-radius: 8px; padding: 14px; text-align: center; font-size: 16pt; font-weight: bold; color: #78350F; margin-bottom: 20px; font-family: 'Tajawal', sans-serif; }
    
    .field-row { font-size: 13pt; margin-bottom: 12px; text-align: justify; }
    .field-label { font-weight: bold; color: #1F4E78; }
    
    .signatures { margin-top: 40px; border-top: 1.5px solid #E2E8F0; padding-top: 20px; display: flex; justify-content: space-between; text-align: center; }
    .sig-box { width: 45%; border: 1px solid #CBD5E1; border-radius: 8px; padding: 15px; background: #FAFAFA; vertical-align: top; }
  </style>
</head>
<body>

  <div class="receipt-card">
    <div class="header">
      <div class="basmala">بسم الله الرحمن الرحيم</div>
      <div class="doc-title">إيــصــال اســتــلام نــقــديــة (إيـجــار شـهــري)</div>
    </div>

    <div class="meta-bar">
      <div><strong>رقم الإيصال:</strong> <span style="color:#1F4E78; font-weight:bold;">${receiptData.receiptNo}</span></div>
      <div><strong>تاريخ الاستلام:</strong> 01 / 08 / 2026م</div>
    </div>

    <div class="amount-box">
      المبلغ المستلم: [ ${receiptData.amountNum} ]<br>
      <span style="font-size:12pt; font-weight:normal; color:#451a03;">(${receiptData.amountText})</span>
    </div>

    <div class="field-row">
      <span class="field-label">أقر أنا المؤجر:</span> السيد / <strong>${receiptData.lessorName}</strong><br>
      المقيم في: ${receiptData.lessorAddress} — ويحمل بطاقة رقم قومي رقم: (<strong>${receiptData.lessorNationalId}</strong>).
    </div>

    <div class="field-row">
      <span class="field-label">بأنني استلمت نقداً من السادة:</span> <strong>${receiptData.lesseeCompany}</strong><br>
      ويمثلها رئيس مجلس الإدارة السيد / <strong>${receiptData.lesseeRep}</strong> (بطاقة رقم قومي: <strong>${receiptData.lesseeNationalId}</strong>).
    </div>

    <div class="field-row">
      <span class="field-label">مبلغاً وقدره:</span> <strong>${receiptData.amountText}</strong>.
    </div>

    <div class="field-row">
      <span class="field-label">وذلك قيمة:</span> <strong>${receiptData.forPeriod}</strong> عن العين المؤجرة وهي: ${receiptData.propertyAddress}.
    </div>

    <div style="font-size: 11pt; color: #475569; font-style: italic; margin-top: 15px; background: #F1F5F9; padding: 10px; border-radius: 6px;">
      📌 وهذا إيصال رسمـي صادر مني بسـداد كامل القيمة الإيجاريـة المستحقة عن شـهر أغسـطس 2026م وبراءة ذمة المسـتأجر منها تماماً.
    </div>

    <table style="width:100%; margin-top:35px; border-collapse:collapse;">
      <tr>
        <td style="width:48%; border:1px solid #CBD5E1; border-radius:8px; padding:15px; text-align:center; background:#FAFAFA;">
          <strong style="color:#78350F; font-size:13pt;">المستلم (المؤجر)</strong><br><br>
          نصر دسوقي عبد الحميد عبد الصمد<br>
          الرقم القومي: ${receiptData.lessorNationalId}<br><br><br>
          التوقيع: .......................................<br><br>
          البصمة: .......................................
        </td>
        <td style="width:4%;"></td>
        <td style="width:48%; border:1px solid #CBD5E1; border-radius:8px; padding:15px; text-align:center; background:#FAFAFA;">
          <strong style="color:#1F4E78; font-size:13pt;">المسدد (المستأجر)</strong><br><br>
          شركة المطعم الأرجنتيني 2<br>
          (عنها/ محمد ممدوح مرسي)<br><br><br>
          التوقيع: .......................................<br><br>
          الختم: .......................................
        </td>
      </tr>
    </table>
  </div>

</body>
</html>`;

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  convertHtmlToPdf(htmlPath, pdfPath);
}

// 3. تحديث خريطة توزيع المستندات
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
    <div style="font-size: 9pt; color: #4a5568;">النسخة الشاملة المزودة بإيصال استلام إيجار شهر أغسطس 2026 (220,000 جـ) — 2026م</div>
  </div>

  <div class="folder-card" style="border-right-color: #D9822B;">
    <div class="folder-name">📁 02_Contracts_and_Legal (العقود واللوائح القانونية)</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <span class="badge-word">WORD</span> <strong>عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_27غرفة.pdf / docx</strong></li>
      <li>📁 <strong>إيصالات_سداد_الإيجار_الشهرية:</strong> <span class="badge-pdf">PDF</span> <span class="badge-word">WORD</span> <strong>إيصال_استلام_إيجار_شهر_أغسطس_2026_نصر_دسوقي.pdf / docx:</strong> إيصال استلام 220,000 جـ لحساب نصر دسوقي.</li>
    </ul>
  </div>

  <div class="folder-card">
    <div class="folder-name">📁 01_Accounting_System / مستندات_المشتريات_والموردين</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_أوامر_الشراء_حسب_الموردين.xlsx & QN_3 أمر توريد كوين</strong></li>
    </ul>
  </div>

</body>
</html>`;

  fs.writeFileSync(sitemapHtmlPath, sitemapContent, 'utf8');
  convertHtmlToPdf(sitemapHtmlPath, sitemapPdfPath);
}

async function main() {
  await createReceiptWordDoc();
  createReceiptPdfDoc();
  updateSitemap();
  console.log('\n✨ AUGUST RENT RECEIPT GENERATED SUCCESSFULLY!');
}

main().catch(err => console.error(err));
