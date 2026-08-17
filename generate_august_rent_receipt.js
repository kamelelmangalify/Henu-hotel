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
  lesseeCompany: 'شركة المطعم الأرجنتيني المتطور لإدارة الفنادق والمطاعم',
  lesseeRep: 'السيد / محمد ممدوح عبد الحميد مرسي',
  lesseeNationalId: MOHAMED_ID,
  propertyAddress: 'البنسيون الفندقي الكائن في 21 شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة (27 غرفة)',
  forPeriod: 'القيمة الإيجارية الشهريّة عن شهر أغسطس 2026م'
};

// 1. توليد مستند Word (.docx) في صفحة واحدة دقيقة
async function createReceiptWordDoc() {
  const fontName = 'Traditional Arabic';

  const createRtlParagraph = (text, options = {}) => {
    return new Paragraph({
      rightToLeft: true,
      alignment: options.alignment || AlignmentType.RIGHT,
      spacing: { before: options.before || 40, after: options.after || 40, line: 300 },
      children: [
        new TextRun({
          text: text,
          rightToLeft: true,
          font: fontName,
          size: options.size || 26,
          bold: options.bold || false,
          color: options.color || "000000"
        })
      ]
    });
  };

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 600, bottom: 600, left: 800, right: 800 } } },
      children: [
        createRtlParagraph("بسم الله الرحمن الرحيم", { bold: true, size: 24, color: "78350F", alignment: AlignmentType.CENTER }),
        createRtlParagraph("إيــصــال اســتــلام نــقــديــة — إيـجــار شـهــري", { bold: true, size: 34, color: "1F4E78", alignment: AlignmentType.CENTER }),
        createRtlParagraph(`رقم الإيصال: [ ${receiptData.receiptNo} ]   |   التاريخ: 01 / 08 / 2026م`, { bold: true, size: 24, color: "D97706", alignment: AlignmentType.CENTER, after: 120 }),

        createRtlParagraph(`المبلغ المستلم: [ ${receiptData.amountNum} ] (${receiptData.amountText})`, { bold: true, size: 28, color: "1F4E78", before: 80 }),

        createRtlParagraph(`أقر أنا المؤجر: السيد / ${receiptData.lessorName}`, { bold: true, size: 26 }),
        createRtlParagraph(`المقيم في: ${receiptData.lessorAddress}   |   رقم قومي: ( ${receiptData.lessorNationalId} )`, { size: 24 }),

        createRtlParagraph(`بانني استلمت نقداً وحررت إيصالاً من السادة: ${receiptData.lesseeCompany}`, { bold: true, size: 26, before: 80 }),
        createRtlParagraph(`ويمثلها السيد / ${receiptData.lesseeRep} (رقم قومي: ${receiptData.lesseeNationalId})`, { size: 24 }),

        createRtlParagraph(`مبلغاً وقدره: ${receiptData.amountText} فقط لا غير.`, { bold: true, size: 26, color: "1F4E78", before: 80 }),
        createRtlParagraph(`وذلك قيمة: ${receiptData.forPeriod} الخاص بالعين المؤجرة وهي: ${receiptData.propertyAddress}.`, { size: 24 }),

        createRtlParagraph("وهذا إيصال مني بسداد كافة المستحقات الإيجارية عن هذا الشهر وبراءة ذمة المستأجر عنه.", { bold: true, size: 24, before: 80 }),

        createRtlParagraph("\nالمستلم (المؤجر)                                                        المسدد (المستأجر)", { bold: true, size: 26, color: "78350F", before: 180, alignment: AlignmentType.CENTER }),
        createRtlParagraph("نصر دسوقي عبد الحميد عبد الصمد                                        شركة المطعم الأرجنتيني المتطور لإدارة الفنادق والمطاعم", { bold: true, size: 22, alignment: AlignmentType.CENTER }),
        createRtlParagraph(`الرقم القومي: ${receiptData.lessorNationalId}                                                (عنها/ محمد ممدوح مرسي)`, { size: 24, alignment: AlignmentType.CENTER }),
        createRtlParagraph("التوقيع: .......................................                                        التوقيع: .......................................", { bold: true, alignment: AlignmentType.CENTER, before: 100 }),
        createRtlParagraph("البصمة: .......................................                                        الختم: .......................................", { bold: true, alignment: AlignmentType.CENTER, before: 60 })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.join(receiptsDir, 'إيصال_استلام_إيجار_شهر_أغسطس_2026_نصر_دسوقي.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Single-Page Word Updated: إيصال_استلام_إيجار_شهر_أغسطس_2026_نصر_دسوقي.docx`);
}

// 2. توليد مستند PDF في صفحة واحدة 100%
function createReceiptPdfDoc() {
  const htmlPath = path.join(receiptsDir, 'إيصال_استلام_إيجار_شهر_أغسطس_2026_نصر_دسوقي.html');
  const pdfPath = path.join(receiptsDir, 'إيصال_استلام_إيجار_شهر_أغسطس_2026_نصر_دسوقي.pdf');

  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>إيصال استلام إيجار شهر أغسطس 2026 — صفحة واحدة</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 8mm 12mm; }
    html, body { height: 100%; margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Amiri', 'Tajawal', Arial, serif; color: #0f172a; line-height: 1.5; padding: 10px; direction: rtl; }
    
    .receipt-card { border: 2px solid #1F4E78; border-radius: 10px; padding: 18px 22px; background: #FFFFFF; height: calc(100% - 20px); box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
    
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 8px; margin-bottom: 12px; }
    .basmala { font-size: 12pt; font-weight: bold; color: #78350F; margin-bottom: 2px; }
    .doc-title { font-size: 19pt; font-weight: bold; color: #1F4E78; margin: 0; }
    
    .meta-bar { display: flex; justify-content: space-between; background: #F8FAFC; border: 1px solid #CBD5E1; border-right: 5px solid #D97706; padding: 8px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 11pt; font-family: 'Tajawal', sans-serif; }
    
    .amount-box { background: #FEF3C7; border: 2px dashed #F59E0B; border-radius: 8px; padding: 10px; text-align: center; font-size: 14pt; font-weight: bold; color: #78350F; margin-bottom: 14px; font-family: 'Tajawal', sans-serif; }
    
    .field-row { font-size: 12pt; margin-bottom: 8px; text-align: justify; }
    .field-label { font-weight: bold; color: #1F4E78; }
    
    .notice-box { font-size: 10pt; color: #475569; font-style: italic; margin-top: 10px; background: #F1F5F9; padding: 8px 12px; border-radius: 6px; border-right: 4px solid #1F4E78; }
    
    .sig-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .sig-box { width: 48%; border: 1px solid #CBD5E1; border-radius: 6px; padding: 10px; text-align: center; background: #FAFAFA; vertical-align: top; font-size: 10pt; }
  </style>
</head>
<body>

  <div class="receipt-card">
    <div>
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
        <span style="font-size:11pt; font-weight:normal; color:#451a03;">(${receiptData.amountText})</span>
      </div>

      <div class="field-row">
        <span class="field-label">أقر أنا المؤجر:</span> السيد / <strong>${receiptData.lessorName}</strong> — المقيم في: ${receiptData.lessorAddress} (رقم قومي: <strong>${receiptData.lessorNationalId}</strong>).
      </div>

      <div class="field-row">
        <span class="field-label">بأنني استلمت نقداً من السادة:</span> <strong>${receiptData.lesseeCompany}</strong> (عنها/ <strong>${receiptData.lesseeRep}</strong> - رقم قومي: <strong>${receiptData.lesseeNationalId}</strong>).
      </div>

      <div class="field-row">
        <span class="field-label">مبلغاً وقدره:</span> <strong>${receiptData.amountText}</strong>.
      </div>

      <div class="field-row">
        <span class="field-label">وذلك قيمة:</span> <strong>${receiptData.forPeriod}</strong> عن العين المؤجرة وهي: ${receiptData.propertyAddress}.
      </div>

      <div class="notice-box">
        📌 وهذا إيصال رسمـي صادر مني بسـداد كامل القيمة الإيجاريـة المستحقة عن شـهر أغسـطس 2026م وبراءة ذمة المسـتأجر منها تماماً.
      </div>
    </div>

    <div>
      <table class="sig-table">
        <tr>
          <td class="sig-box">
            <strong style="color:#78350F; font-size:11pt;">المستلم (المؤجر)</strong><br><br>
            نصر دسوقي عبد الحميد عبد الصمد<br>
            الرقم القومي: ${receiptData.lessorNationalId}<br><br>
            التوقيع: .......................................<br>
            البصمة: .......................................
          </td>
          <td style="width:4%;"></td>
          <td class="sig-box">
            <strong style="color:#1F4E78; font-size:11pt;">المسدد (المستأجر)</strong><br><br>
            شركة المطعم الأرجنتيني المتطور لإدارة الفنادق والمطاعم<br>
            (عنها/ محمد ممدوح مرسي)<br><br>
            التوقيع: .......................................<br>
            الختم: .......................................
          </td>
        </tr>
      </table>
    </div>
  </div>

</body>
</html>`;

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  convertHtmlToPdf(htmlPath, pdfPath);
}

async function main() {
  await createReceiptWordDoc();
  createReceiptPdfDoc();
  console.log('\n✨ RECEIPT UPDATED WITH FULL COMPANY NAME SUCCESSFULLY!');
}

main().catch(err => console.error(err));
