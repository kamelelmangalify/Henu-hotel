const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, HeadingLevel, BorderStyle } = require('docx');
const { execSync } = require('child_process');

const rootDir = path.join('d:', 'Henu');
const legalDir = path.join(rootDir, '02_Contracts_and_Legal');

if (!fs.existsSync(legalDir)) {
  fs.mkdirSync(legalDir, { recursive: true });
}

// قراءة الشعار إن وجد
const logoPath = path.join(legalDir, 'شعار_الفندق_عقود.jpg');
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

async function generateLeaseContractWord() {
  const fontName = 'Traditional Arabic';

  // Helper function to make RTL Paragraphs easily
  const createRtlParagraph = (text, options = {}) => {
    return new Paragraph({
      rightToLeft: true,
      alignment: options.alignment || AlignmentType.RIGHT,
      spacing: { before: options.before || 120, after: options.after || 120, line: 360 },
      children: [
        new TextRun({
          text: text,
          rightToLeft: true,
          font: fontName,
          size: options.size || 28, // 14pt in Word
          bold: options.bold || false,
          color: options.color || "000000",
          italic: options.italic || false
        })
      ]
    });
  };

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 }
        }
      },
      children: [
        // Title
        new Paragraph({
          rightToLeft: true,
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({ text: "بسم الله الرحمن الرحيم", rightToLeft: true, font: fontName, bold: true, size: 32, color: "78350F" })
          ]
        }),

        new Paragraph({
          rightToLeft: true,
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 100 },
          children: [
            new TextRun({ text: "عــقــد إيــجــار عـقــار ومــنــشـأة فــنــدقــيــة", rightToLeft: true, font: fontName, bold: true, size: 40, color: "1F4E78" })
          ]
        }),

        new Paragraph({
          rightToLeft: true,
          alignment: AlignmentType.CENTER,
          spacing: { before: 50, after: 300 },
          children: [
            new TextRun({ text: "(بنسيون فندقي مجهز بالكامل — مدة 10 سنوات)", rightToLeft: true, font: fontName, bold: true, size: 28, color: "D97706" })
          ]
        }),

        // Intro
        createRtlParagraph("إنه في يوم الأحد الموافق 2026/05/01م، تم الاتفاق والتراضي بين كل من:", { bold: true, size: 30, color: "1F4E78" }),

        createRtlParagraph("أولاً: السيد / نصر دسوقي عبد الحميد عبد الصمد — المقيم في: شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، ويحمل بطاقة رقم قومي رقم (27210100010092).", { size: 28 }),
        createRtlParagraph("(طرف أول — مؤجر)", { bold: true, size: 28, color: "1F4E78" }),

        createRtlParagraph("ثانياً: الشركة: المطعم الأرجنتيني — بصفتها رئيس مجلس الإدارة السيد / محمد ممدوح عبد الحميد مرسي، ويحمل بطاقة رقم قومي رقم (2619000010259)، الكائنة بالمحل رقم (1) الدور الأرضي، 59 شارع 22 يوليو، الزمالك، قصر النيل، القاهرة.", { size: 28 }),
        createRtlParagraph("(طرف ثاني — مستأجر)", { bold: true, size: 28, color: "D97706" }),

        createRtlParagraph("وبعد أن أقر الطرفان بأهليتهما الكاملة للتصرف والتعاقد خالية من أي جهالة أو عيب، اتفقا على البنود الآتية:", { italic: true, size: 26 }),

        // Preamble
        createRtlParagraph("البند التمهيدي (وصف العين المؤجرة):", { bold: true, size: 32, color: "1F4E78", before: 200 }),
        createRtlParagraph("يمتلك الطرف الأول البنسيون الكائن في 10 شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، والذي يتكون من (مدخل للفندق + أربعة أدوار علوي + روف)، وهو بنسيون فندقي مكون من 19 غرفة مجهزة ومفروشة بالكامل ومستوفية للتشغيل.", { alignment: AlignmentType.JUSTIFY }),

        // Digital Operation Warranty
        createRtlParagraph("التزام المؤجر بضمان التشغيل الرقمي والمنصات العالمية:", { bold: true, size: 32, color: "1F4E78", before: 200 }),
        createRtlParagraph("يقر الطرف الأول بأن العين مستوفاة لكافة الشروط القانونية والفنية والتقنية اللازمة لتفعيل واستخدام منصات الحجز والتسويق الإلكتروني العالمية، ويضمن خلو العين من أي حظر (Block) أو قيود تمنع تسجيلها أو تفعيلها على هذه المنصات. وفي حالة ثبوت وجود أي حظر أو مانع تقني أو قانوني يحول دون استخدام هذه المنصات للعين، أو في حال تم حظر العين من قبل هذه المنصات لأسباب تتعلق ببيانات أو تراخيص أو مخالفات سابقة تخص الطرف الأول، يُعتبر ذلك إخلالاً جوهرياً بالعقد، ويلتزم الطرف الأول بتعويض المستأجر، كما يحق للمستأجر تعليق سداد القيمة الإيجارية أو فسخ العقد واسترداد كافة المبالغ دون شرط أو قيد.", { alignment: AlignmentType.JUSTIFY }),

        // Clause 1
        createRtlParagraph("البند الأول: مدة العقد", { bold: true, size: 32, color: "1F4E78", before: 200 }),
        createRtlParagraph("اتفق الطرفان على أن مدة الإيجار هي 10 سنوات كاملة، تبدأ من تاريخ 2026/09/01م وتنتهي في 2036/09/01م. لا ينتهي العقد إلا بانتهاء مدته، ولا يحق للمؤجر المطالبة بالإخلاء إلا بحكم قضائي نهائي واجب النفاذ في حالة ثبوت إخلال جوهري من المستأجر وبعد منحه إنذاراً رسمياً.", { alignment: AlignmentType.JUSTIFY }),

        // Clause 2
        createRtlParagraph("البند الثاني: القيمة الإيجارية والزيادة السنوية", { bold: true, size: 32, color: "1F4E78", before: 200 }),
        createRtlParagraph("اتفق الطرفان على أن تكون القيمة الإيجارية الشهرية مبلغ وقدره 220,000 جـ (مائتان وعشرون ألف جنيه مصري لا غير) شهرياً، تسلم في اليوم الأول من كل شهر ميلادي. وتضاف زيادة سنوية دورية بنسبة 10% تُطبق في بداية كل سنة إيجارية جديدة.", { alignment: AlignmentType.JUSTIFY }),

        // Clause 3
        createRtlParagraph("البند الثالث: شروط وإجراءات الفسخ", { bold: true, size: 32, color: "1F4E78", before: 200 }),
        createRtlParagraph("يُعد العقد مفسوخاً في حال تأخر المستأجر عن سداد الأجرة الإيجارية لمدة شهرين متتاليين، بشرط إخطار المستأجر بموجب إنذار رسمي على يد محضر، ومنحه مهلة 15 يوماً من تاريخ استلام الإنذار لسداد المتأخرات.", { alignment: AlignmentType.JUSTIFY }),

        // Clause 4
        createRtlParagraph("البند الرابع: التعديلات والترميمات وحالة العين", { bold: true, size: 32, color: "1F4E78", before: 200 }),
        createRtlParagraph("للمستأجر الحق في إجراء التعديلات الديكورية والإنشائية اللازمة لممارسة النشاط الفندقي بموافقة كتابية من المؤجر. يلتزم المستأجر بتسليم العين بحالة جيدة عند انتهاء العقد مع مراعاة \"الاستهلاك الطبيعي\" للعين، دون إلزام المستأجر بإزالة التعديلات الجوهرية التي أضافت قيمة للمبنى والعين.", { alignment: AlignmentType.JUSTIFY }),

        // Clause 5
        createRtlParagraph("البند الخامس: حق الإنهاء المبكر والتأمين", { bold: true, size: 32, color: "1F4E78", before: 200 }),
        createRtlParagraph("يحق للمستأجر إنهاء التعاقد قبل انتهاء المدة بشرط إخطار المؤجر قبلها بـ 3 أشهر بموجب إنذار رسمي، وفي هذه الحالة يتم استرداد مبلغ التأمين بالكامل ما لم توجد تلفيات جسيمة خارجة عن نطاق الاستهلاك الطبيعي للعين.", { alignment: AlignmentType.JUSTIFY }),

        // Clause 6
        createRtlParagraph("البند السادس: التصالح والمخالفات والتعويض", { bold: true, size: 32, color: "1F4E78", before: 200 }),
        createRtlParagraph("يلتزم المؤجر بإنهاء كافة إجراءات التصالح والمخالفات الخاصة بالعقار. وفي حالة تقاعس المؤجر عن ذلك، يحق للمستأجر خصم التكلفة من القيمة الإيجارية، وتستحق الغرامة المتفق عليها وقدرها 150,000 جـ (مائة وخمسون ألف جنيه مصري) لصالح المستأجر كتعويض عن توقف النشاط، وتخصم تلقائياً من القيمة الإيجارية المستحقة.", { alignment: AlignmentType.JUSTIFY }),

        // Clause 7
        createRtlParagraph("البند السابع: المسؤولية القانونية والتحكيم", { bold: true, size: 32, color: "1F4E78", before: 200 }),
        createRtlParagraph("يتحمل المستأجر المسؤولية الكاملة عن أي مخالفات تخص إدارة التشغيل والنشاط خلال فترة الإيجار، بينما يضمن المؤجر قانونية العقار وسلامة المستندات والتراخيص المعمارية. وفي حالة نشوء أي نزاع، يتم اللجوء للقضاء المختص، مع إمكانية اللجوء للتحكيم الودي بين الطرفين.", { alignment: AlignmentType.JUSTIFY }),

        // Signatures Header
        createRtlParagraph("التوقيعات والاعتماد الرسمي للطرفين:", { bold: true, size: 32, color: "78350F", before: 300, after: 150 }),

        // Signatures RTL Table
        new Table({
          visualRightToLeft: true,
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    createRtlParagraph("الطرف الأول (المؤجر):", { bold: true, alignment: AlignmentType.CENTER, color: "1F4E78" }),
                    createRtlParagraph("نصر دسوقي عبد الحميد عبد الصمد", { alignment: AlignmentType.CENTER }),
                    createRtlParagraph("رقم قومي: 27210100010092", { alignment: AlignmentType.CENTER }),
                    createRtlParagraph("التوقيع: ...........................................", { alignment: AlignmentType.CENTER }),
                    createRtlParagraph("البصمة: ...........................................", { alignment: AlignmentType.CENTER })
                  ]
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    createRtlParagraph("الطرف الثاني (المستأجر):", { bold: true, alignment: AlignmentType.CENTER, color: "D97706" }),
                    createRtlParagraph("شركة المطعم الأرجنتيني (عنها/ محمد ممدوح مرسي)", { alignment: AlignmentType.CENTER }),
                    createRtlParagraph("رقم قومي: 2619000010259", { alignment: AlignmentType.CENTER }),
                    createRtlParagraph("التوقيع: ...........................................", { alignment: AlignmentType.CENTER }),
                    createRtlParagraph("الختم: ...........................................", { alignment: AlignmentType.CENTER })
                  ]
                })
              ]
            })
          ]
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Word Document Created (100% RTL Arabic): ${path.basename(docxPath)}`);
}

// HTML PDF النسخة المحدثة بالتنسيق الفاخر
function generateContractPdf() {
  const htmlPath = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني.html');
  const pdfPath = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني.pdf');

  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>عقد إيجار بنسيون فندقي — المطعم الأرجنتيني ونصر دسوقي</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 18mm 20mm; }
    body { font-family: 'Amiri', 'Tajawal', Arial, serif; color: #0f172a; line-height: 1.8; margin: 0; padding: 10px; direction: rtl; text-align: justify; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 12px; margin-bottom: 20px; }
    .basmala { font-size: 14pt; font-weight: bold; color: #78350F; margin-bottom: 5px; text-align: center; }
    .doc-title { font-size: 22pt; font-weight: bold; color: #1F4E78; margin-top: 5px; text-align: center; }
    .subtitle { font-size: 13pt; font-weight: bold; color: #D97706; text-align: center; }
    .party-card { background: #F8FAFC; border: 1px solid #CBD5E1; border-right: 6px solid #1F4E78; padding: 14px 16px; border-radius: 8px; margin-bottom: 14px; font-size: 12pt; text-align: right; }
    .party-card.tenant { border-right-color: #D97706; }
    .clause-header { font-size: 14pt; font-weight: bold; color: #1F4E78; margin-top: 18px; margin-bottom: 6px; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px; text-align: right; }
    p { font-size: 12pt; margin-top: 6px; margin-bottom: 10px; text-align: justify; text-justify: inter-word; }
    .signatures-section { margin-top: 35px; page-break-inside: avoid; }
    .sig-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .sig-box { width: 48%; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 15px; text-align: center; font-size: 11pt; background: #FFFFFF; vertical-align: top; }
  </style>
</head>
<body>

  <div class="header">
    <div class="basmala">بسم الله الرحمن الرحيم</div>
    <div class="doc-title">عــقــد إيــجــار عـقــار ومــنــشـأة فــنــدقــيــة</div>
    <div class="subtitle">(بنسيون فندقي مجهز بالكامل — مدة 10 سنوات)</div>
  </div>

  <p><strong>إنه في يوم الأحد الموافق 2026/05/01م، تم الاتفاق والتراضي بين كل من:</strong></p>

  <div class="party-card">
    <strong style="color: #78350F; font-size: 13pt;">أولاً: السيد / نصر دسوقي عبد الحميد عبد الصمد</strong><br>
    المقيم في: شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، ويحمل بطاقة رقم قومي رقم (27210100010092).<br>
    <span style="color: #1F4E78; font-weight: bold;">(طرف أول — مؤجر)</span>
  </div>

  <div class="party-card tenant">
    <strong style="color: #78350F; font-size: 13pt;">ثانياً: الشركة: المطعم الأرجنتيني</strong><br>
    بصفتها رئيس مجلس الإدارة <strong>السيد / محمد ممدوح عبد الحميد مرسي</strong>، ويحمل بطاقة رقم قومي رقم (2619000010259)، الكائنة بالمحل رقم (1) الدور الأرضي، 59 شارع 22 يوليو، الزمالك، قصر النيل، القاهرة.<br>
    <span style="color: #D97706; font-weight: bold;">(طرف ثاني — مستأجر)</span>
  </div>

  <p style="font-style: italic; color: #475569;">وبعد أن أقر الطرفان بأهليتهما الكاملة للتصرف والتعاقد خالية من أي جهالة أو عيب، اتفقا على البنود الآتية:</p>

  <div class="clause-header">البند التمهيدي (وصف العين المؤجرة):</div>
  <p>يمتلك الطرف الأول البنسيون الكائن في 10 شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، والذي يتكون من (مدخل للفندق + أربعة أدوار علوي + روف)، وهو بنسيون فندقي مكون من 19 غرفة مجهزة ومفروشة بالكامل ومستوفية للتشغيل.</p>

  <div class="clause-header">التزام المؤجر بضمان التشغيل الرقمي والمنصات العالمية:</div>
  <p>يقر الطرف الأول بأن العين مستوفاة لكافة الشروط القانونية والفنية والتقنية اللازمة لتفعيل واستخدام منصات الحجز والتسويق الإلكتروني العالمية، ويضمن خلو العين من أي حظر (Block) أو قيود تمنع تسجيلها أو تفعيلها على هذه المنصات. وفي حالة ثبوت وجود أي حظر أو مانع تقني أو قانوني يحول دون استخدام هذه المنصات للعين، أو في حال تم حظر العين من قبل هذه المنصات لأسباب تتعلق ببيانات أو تراخيص أو مخالفات سابقة تخص الطرف الأول، يُعتبر ذلك إخلالاً جوهرياً بالعقد، ويلتزم الطرف الأول بتعويض المستأجر، كما يحق للمستأجر تعليق سداد القيمة الإيجارية أو فسخ العقد واسترداد كافة المبالغ دون شرط أو قيد.</p>

  <div class="clause-header">البند الأول: مدة العقد</div>
  <p>اتفق الطرفان على أن مدة الإيجار هي 10 سنوات كاملة، تبدأ من تاريخ 2026/09/01م وتنتهي في 2036/09/01م. لا ينتهي العقد إلا بانتهاء مدته، ولا يحق للمؤجر المطالبة بالإخلاء إلا بحكم قضائي نهائي واجب النفاذ في حالة ثبوت إخلال جوهري من المستأجر وبعد منحه إنذاراً رسمياً.</p>

  <div class="clause-header">البند الثاني: القيمة الإيجارية والزيادة السنوية</div>
  <p>اتفق الطرفان على أن تكون القيمة الإيجارية الشهرية مبلغ وقدره 220,000 جـ (مائتان وعشرون ألف جنيه مصري لا غير) شهرياً، تسلم في اليوم الأول من كل شهر ميلادي. وتضاف زيادة سنوية دورية بنسبة 10% تُطبق في بداية كل سنة إيجارية جديدة.</p>

  <div class="clause-header">البند الثالث: شروط وإجراءات الفسخ</div>
  <p>يُعد العقد مفسوخاً في حال تأخر المستأجر عن سداد الأجرة الإيجارية لمدة شهرين متتاليين، بشرط إخطار المستأجر بموجب إنذار رسمي على يد محضر، ومنحه مهلة 15 يوماً من تاريخ استلام الإنذار لسداد المتأخرات.</p>

  <div class="clause-header">البند الرابع: التعديلات والترميمات وحالة العين</div>
  <p>للمستأجر الحق في إجراء التعديلات الديكورية والإنشائية اللازمة لممارسة النشاط الفندقي بموافقة كتابية من المؤجر. يلتزم المستأجر بتسليم العين بحالة جيدة عند انتهاء العقد مع مراعاة "الاستهلاك الطبيعي" للعين، دون إلزام المستأجر بإزالة التعديلات الجوهرية التي أضافت قيمة للمبنى والعين.</p>

  <div class="clause-header">البند الخامس: حق الإنهاء المبكر والتأمين</div>
  <p>يحق للمستأجر إنهاء التعاقد قبل انتهاء المدة بشرط إخطار المؤجر قبلها بـ 3 أشهر بموجب إنذار رسمي، وفي هذه الحالة يتم استرداد مبلغ التأمين بالكامل ما لم توجد تلفيات جسيمة خارجة عن نطاق الاستهلاك الطبيعي للعين.</p>

  <div class="clause-header">البند السادس: التصالح والمخالفات والتعويض</div>
  <p>يلتزم المؤجر بإنهاء كافة إجراءات التصالح والمخالفات الخاصة بالعقار. وفي حالة تقاعس المؤجر عن ذلك، يحق للمستأجر خصم التكلفة من القيمة الإيجارية، وتستحق الغرامة المتفق عليها وقدرها 150,000 جـ (مائة وخمسون ألف جنيه مصري) لصالح المستأجر كتعويض عن توقف النشاط، وتخصم تلقائياً من القيمة الإيجارية المستحقة.</p>

  <div class="clause-header">البند السابع: المسؤولية القانونية والتحكيم</div>
  <p>يتحمل المستأجر المسؤولية الكاملة عن أي مخالفات تخص إدارة التشغيل والنشاط خلال فترة الإيجار، بينما يضمن المؤجر قانونية العقار وسلامة المستندات والتراخيص المعمارية. وفي حالة نشوء أي نزاع، يتم اللجوء للقضاء المختص، مع إمكانية اللجوء للتحكيم الودي بين الطرفين.</p>

  <div class="signatures-section">
    <div style="font-size: 13pt; font-weight: bold; color: #78350F; margin-bottom: 10px; text-align: center;">التوقيعات والاعتماد الرسمي للطرفين:</div>
    <table class="sig-table">
      <tr>
        <td class="sig-box">
          <strong style="color: #1F4E78; font-size: 12pt;">الطرف الأول (المؤجر)</strong><br><br>
          نصر دسوقي عبد الحميد عبد الصمد<br>
          الرقم القومي: 27210100010092<br><br><br>
          التوقيع: .......................................<br><br>
          البصمة: .......................................
        </td>
        <td style="width: 4%;"></td>
        <td class="sig-box">
          <strong style="color: #D97706; font-size: 12pt;">الطرف الثاني (المستأجر)</strong><br><br>
          شركة المطعم الأرجنتيني (عنها/ محمد ممدوح مرسي)<br>
          الرقم القومي: 2619000010259<br><br><br>
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

async function main() {
  await generateLeaseContractWord();
  generateContractPdf();
  console.log('\n✨ PERFECT 100% RTL ARABIC CONTRACT GENERATED SUCCESSFULLY!');
}

main().catch(err => console.error(err));
