const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, HeadingLevel } = require('docx');
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
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 }
        }
      },
      children: [
        // Header / Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "بسم الله الرحمن الرحيم\n", bold: true, size: 24, color: "78350F" }),
            new TextRun({ text: "عــقــد إيــجــار عـقــار ومــنــشـأة فــنــدقــيــة\n", bold: true, size: 36, color: "1F4E78" }),
            new TextRun({ text: "(بنسيون فندقي مجهز بالكامل — 10 سنوات)\n\n", bold: true, size: 22, color: "D97706" })
          ]
        }),

        // Date and Introduction
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({ text: "إنه في يوم الأحد الموافق 2026/05/01م، تم الاتفاق والتراضي بين كل من:\n\n", bold: true, size: 24, color: "1F4E78" }),
            new TextRun({ text: "أولاً: السيد / ", bold: true, size: 24, color: "78350F" }),
            new TextRun({ text: "نصر دسوقي عبد الحميد عبد الصمد — المقيم في: شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، ويحمل بطاقة رقم قومي رقم (27210100010092).\n", size: 22 }),
            new TextRun({ text: "(طرف أول — مؤجر)\n\n", bold: true, size: 22, color: "1F4E78" }),
            
            new TextRun({ text: "ثانياً: الشركة: ", bold: true, size: 24, color: "78350F" }),
            new TextRun({ text: "المطعم الأرجنتيني — ويمثلها بصفتها رئيس مجلس الإدارة السيد / ", size: 22 }),
            new TextRun({ text: "محمد ممدوح عبد الحميد مرسي، ويحمل بطاقة رقم قومي رقم (2619000010259)، الكائنة بالمحل رقم (1) الدور الأرضي، 59 شارع 22 يوليو، الزمالك، قصر النيل، القاهرة.\n", size: 22 }),
            new TextRun({ text: "(طرف ثاني — مستأجر)\n\n", bold: true, size: 22, color: "1F4E78" }),

            new TextRun({ text: "وبعد أن أقر الطرفان بأهليتهما الكاملة للتصرف والتعاقد خالية من أي جهالة أو عيب، اتفقا على البنود الآتية:\n", size: 22, italic: true })
          ]
        }),

        // Preamble
        new Paragraph({ text: "\nالبند التمهيدي (وصف العين المؤجرة):", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({
              text: "يمتلك الطرف الأول البنسيون الكائن في 10 شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، والذي يتكون من (مدخل للفندق + أربعة أدوار علوي + روف)، وهو بنسيون فندقي مكون من 19 غرفة مجهزة ومفروشة بالكامل ومستوفية للتشغيل.\n",
              size: 22
            })
          ]
        }),

        // Digital Operation Warranty Clause
        new Paragraph({ text: "التزام المؤجر بضمان التشغيل الرقمي والمنصات العالمية:", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({
              text: "يقر الطرف الأول بأن العين مستوفاة لكافة الشروط القانونية والفنية والتقنية اللازمة لتفعيل واستخدام منصات الحجز والتسويق الإلكتروني العالمية، ويضمن خلو العين من أي حظر (Block) أو قيود تمنع تسجيلها أو تفعيلها على هذه المنصات. وفي حالة ثبوت وجود أي حظر أو مانع تقني أو قانوني يحول دون استخدام هذه المنصات للعين، أو في حال تم حظر العين من قبل هذه المنصات لأسباب تتعلق ببيانات أو تراخيص أو مخالفات سابقة تخص الطرف الأول، يُعتبر ذلك إخلالاً جوهرياً بالعقد، ويلتزم الطرف الأول بتعويض المستأجر، كما يحق للمستأجر تعليق سداد القيمة الإيجارية أو فسخ العقد واسترداد كافة المبالغ دون شرط أو قيد.\n",
              size: 22
            })
          ]
        }),

        // Clause 1
        new Paragraph({ text: "البند الأول: مدة العقد", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({
              text: "اتفق الطرفان على أن مدة الإيجار هي 10 سنوات كاملة، تبدأ من تاريخ 2026/09/01م وتنتهي في 2036/09/01م. لا ينتهي العقد إلا بانتهاء مدته، ولا يحق للمؤجر المطالبة بالإخلاء إلا بحكم قضائي نهائي واجب النفاذ في حالة ثبوت إخلال جوهري من المستأجر وبعد منحه إنذاراً رسمياً.\n",
              size: 22
            })
          ]
        }),

        // Clause 2
        new Paragraph({ text: "البند الثاني: القيمة الإيجارية والزيادة السنوية", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({
              text: "اتفق الطرفان على أن تكون القيمة الإيجارية الشهرية مبلغ وقدره 220,000 جـ (مائتان وعشرون ألف جنيه مصري لا غير) شهرياً، تسلم في اليوم الأول من كل شهر ميلادي. وتضاف زيادة سنوية دورية بنسبة 10% تُطبق في بداية كل سنة إيجارية جديدة.\n",
              size: 22
            })
          ]
        }),

        // Clause 3
        new Paragraph({ text: "البند الثالث: شروط وإجراءات الفسخ", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({
              text: "يُعد العقد مفسوخاً في حال تأخر المستأجر عن سداد الأجرة الإيجارية لمدة شهرين متتاليين، بشرط إخطار المستأجر بموجب إنذار رسمي على يد محضر، ومنحه مهلة 15 يوماً من تاريخ استلام الإنذار لسداد المتأخرات.\n",
              size: 22
            })
          ]
        }),

        // Clause 4
        new Paragraph({ text: "البند الرابع: التعديلات والترميمات وحالة العين", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({
              text: "للمستأجر الحق في إجراء التعديلات الديكورية والإنشائية اللازمة لممارسة النشاط الفندقي بموافقة كتابية من المؤجر. يلتزم المستأجر بتسليم العين بحالة جيدة عند انتهاء العقد مع مراعاة \"الاستهلاك الطبيعي\" للعين، دون إلزام المستأجر بإزالة التعديلات الجوهرية التي أضافت قيمة للمبنى والعين.\n",
              size: 22
            })
          ]
        }),

        // Clause 5
        new Paragraph({ text: "البند الخامس: حق الإنهاء المبكر والتأمين", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({
              text: "يحق للمستأجر إنهاء التعاقد قبل انتهاء المدة بشرط إخطار المؤجر قبلها بـ 3 أشهر بموجب إنذار رسمي، وفي هذه الحالة يتم استرداد مبلغ التأمين بالكامل ما لم توجد تلفيات جسيمة خارجة عن نطاق الاستهلاك الطبيعي للعين.\n",
              size: 22
            })
          ]
        }),

        // Clause 6
        new Paragraph({ text: "البند السادس: التصالح والمخالفات والتعويض", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({
              text: "يلتزم المؤجر بإنهاء كافة إجراءات التصالح والمخالفات الخاصة بالعقار. وفي حالة تقاعس المؤجر عن ذلك، يحق للمستأجر خصم التكلفة من القيمة الإيجارية، وتستحق الغرامة المتفق عليها وقدرها 150,000 جـ (مائة وخمسون ألف جنيه مصري) لصالح المستأجر كتعويض عن توقف النشاط، وتخصم تلقائياً من القيمة الإيجارية المستحقة.\n",
              size: 22
            })
          ]
        }),

        // Clause 7
        new Paragraph({ text: "البند السابع: المسؤولية القانونية والتحكيم", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({
              text: "يتحمل المستأجر المسؤولية الكاملة عن أي مخالفات تخص إدارة التشغيل والنشاط خلال فترة الإيجار، بينما يضمن المؤجر قانونية العقار وسلامة المستندات والتراخيص المعمارية. وفي حالة نشوء أي نزاع، يتم اللجوء للقضاء المختص، مع إمكانية اللجوء للتحكيم الودي بين الطرفين.\n\n",
              size: 22
            })
          ]
        }),

        // Signatures Table
        new Paragraph({ text: "التوقيعات والاعتماد الرسمية:", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({ text: "الطرف الأول (المؤجر):", bold: true, alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: "\nالاسم: نصر دسوقي عبد الحميد عبد الصمد", alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: "الرقم القومي: 27210100010092\n", alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: "التوقيع: .....................................................", alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: "البصمة: .....................................................", alignment: AlignmentType.CENTER })
                  ]
                }),
                new TableCell({
                  children: [
                    new Paragraph({ text: "الطرف الثاني (المستأجر):", bold: true, alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: "\nشركة المطعم الأرجنتيني (عنها/ محمد ممدوح مرسي)", alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: "الرقم القومي: 2619000010259\n", alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: "التوقيع: .....................................................", alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: "الختم: .....................................................", alignment: AlignmentType.CENTER })
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
  console.log(`✅ Word Document Created: ${path.basename(docxPath)}`);
}

// إنشاء ملف HTML لتحويله إلى PDF رسمياً أيضاً
function generateContractPdf() {
  const htmlPath = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني.html');
  const pdfPath = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني.pdf');

  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>عقد إيجار بنسيون فندقي — المطعم الأرجنتيني ونصر دسوقي</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 15mm 18mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; line-height: 1.7; margin: 0; padding: 10px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 10px; margin-bottom: 15px; }
    .doc-title { font-size: 18pt; font-weight: 800; color: #1F4E78; margin-top: 5px; }
    .subtitle { font-size: 11pt; font-weight: bold; color: #D97706; }
    .party-box { background: #F8FAFC; border: 1px solid #CBD5E1; border-right: 5px solid #1F4E78; padding: 12px; border-radius: 6px; margin-bottom: 12px; font-size: 10pt; }
    .clause-title { font-size: 11pt; font-weight: 800; color: #1F4E78; margin-top: 14px; margin-bottom: 5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 3px; }
    p { font-size: 10pt; margin-top: 4px; margin-bottom: 8px; text-align: justify; }
    .signatures { display: flex; justify-content: space-between; margin-top: 30px; }
    .sig-box { width: 48%; border: 1px solid #CBD5E1; border-radius: 6px; padding: 12px; text-align: center; font-size: 9.5pt; background: #FFF; }
  </style>
</head>
<body>

  <div class="header">
    <div style="font-size: 11pt; font-weight: bold; color: #78350F;">بسم الله الرحمن الرحيم</div>
    <div class="doc-title">عــقــد إيــجــار عـقــار ومــنــشـأة فــنــدقــيــة</div>
    <div class="subtitle">(بنسيون فندقي مجهز بالكامل — مدة 10 سنوات)</div>
  </div>

  <p><strong>إنه في يوم الأحد الموافق 2026/05/01م، تم الاتفاق والتراضي بين كل من:</strong></p>

  <div class="party-box">
    <strong>أولاً: السيد / نصر دسوقي عبد الحميد عبد الصمد</strong> — المقيم في: شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، ويحمل بطاقة رقم قومي رقم (27210100010092).<br>
    <span style="color: #1F4E78; font-weight: bold;">(طرف أول — مؤجر)</span>
  </div>

  <div class="party-box" style="border-right-color: #D97706;">
    <strong>ثانياً: الشركة: المطعم الأرجنتيني</strong> — بصفتها رئيس مجلس الإدارة <strong>السيد / محمد ممدوح عبد الحميد مرسي</strong>، ويحمل بطاقة رقم قومي رقم (2619000010259)، الكائنة بالمحل رقم (1) الدور الأرضي، 59 شارع 22 يوليو، الزمالك، قصر النيل، القاهرة.<br>
    <span style="color: #D97706; font-weight: bold;">(طرف ثاني — مستأجر)</span>
  </div>

  <p style="font-style: italic;">وبعد أن أقر الطرفان بأهليتهما الكاملة للتصرف والتعاقد خالية من أي جهالة أو عيب، اتفقا على البنود الآتية:</p>

  <div class="clause-title">البند التمهيدي (وصف العين المؤجرة):</div>
  <p>يمتلك الطرف الأول البنسيون الكائن في 10 شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، والذي يتكون من (مدخل للفندق + أربعة أدوار علوي + روف)، وهو بنسيون فندقي مكون من 19 غرفة مجهزة ومفروشة بالكامل ومستوفية للتشغيل.</p>

  <div class="clause-title">التزام المؤجر بضمان التشغيل الرقمي والمنصات العالمية:</div>
  <p>يقر الطرف الأول بأن العين مستوفاة لكافة الشروط القانونية والفنية والتقنية اللازمة لتفعيل واستخدام منصات الحجز والتسويق الإلكتروني العالمية، ويضمن خلو العين من أي حظر (Block) أو قيود تمنع تسجيلها أو تفعيلها على هذه المنصات. وفي حالة ثبوت وجود أي حظر أو مانع تقني أو قانوني يحول دون استخدام هذه المنصات للعين، أو في حال تم حظر العين من قبل هذه المنصات لأسباب تتعلق ببيانات أو تراخيص أو مخالفات سابقة تخص الطرف الأول، يُعتبر ذلك إخلالاً جوهرياً بالعقد، ويلتزم الطرف الأول بتعويض المستأجر، كما يحق للمستأجر تعليق سداد القيمة الإيجارية أو فسخ العقد واسترداد كافة المبالغ دون شرط أو قيد.</p>

  <div class="clause-title">البند الأول: مدة العقد</div>
  <p>اتفق الطرفان على أن مدة الإيجار هي 10 سنوات كاملة، تبدأ من تاريخ 2026/09/01م وتنتهي في 2036/09/01م. لا ينتهي العقد إلا بانتهاء مدته، ولا يحق للمؤجر المطالبة بالإخلاء إلا بحكم قضائي نهائي واجب النفاذ في حالة ثبوت إخلال جوهري من المستأجر وبعد منحه إنذاراً رسمياً.</p>

  <div class="clause-title">البند الثاني: القيمة الإيجارية والزيادة السنوية</div>
  <p>اتفق الطرفان على أن تكون القيمة الإيجارية الشهرية مبلغ وقدره 220,000 جـ (مائتان وعشرون ألف جنيه مصري لا غير) شهرياً، تسلم في اليوم الأول من كل شهر ميلادي. وتضاف زيادة سنوية دورية بنسبة 10% تُطبق في بداية كل سنة إيجارية جديدة.</p>

  <div class="clause-title">البند الثالث: شروط وإجراءات الفسخ</div>
  <p>يُعد العقد مفسوخاً في حال تأخر المستأجر عن سداد الأجرة الإيجارية لمدة شهرين متتاليين، بشرط إخطار المستأجر بموجب إنذار رسمي على يد محضر، ومنحه مهلة 15 يوماً من تاريخ استلام الإنذار لسداد المتأخرات.</p>

  <div class="clause-title">البند الرابع: التعديلات والترميمات وحالة العين</div>
  <p>للمستأجر الحق في إجراء التعديلات الديكورية والإنشائية اللازمة لممارسة النشاط الفندقي بموافقة كتابية من المؤجر. يلتزم المستأجر بتسليم العين بحالة جيدة عند انتهاء العقد مع مراعاة "الاستهلاك الطبيعي" للعين، دون إلزام المستأجر بإزالة التعديلات الجوهرية التي أضافت قيمة للمبنى والعين.</p>

  <div class="clause-title">البند الخامس: حق الإنهاء المبكر والتأمين</div>
  <p>يحق للمستأجر إنهاء التعاقد قبل انتهاء المدة بشرط إخطار المؤجر قبلها بـ 3 أشهر بموجب إنذار رسمي، وفي هذه الحالة يتم استرداد مبلغ التأمين بالكامل ما لم توجد تلفيات جسيمة خارجة عن نطاق الاستهلاك الطبيعي للعين.</p>

  <div class="clause-title">البند السادس: التصالح والمخالفات والتعويض</div>
  <p>يلتزم المؤجر بإنهاء كافة إجراءات التصالح والمخالفات الخاصة بالعقار. وفي حالة تقاعس المؤجر عن ذلك، يحق للمستأجر خصم التكلفة من القيمة الإيجارية، وتستحق الغرامة المتفق عليها وقدرها 150,000 جـ (مائة وخمسون ألف جنيه مصري) لصالح المستأجر كتعويض عن توقف النشاط، وتخصم تلقائياً من القيمة الإيجارية المستحقة.</p>

  <div class="clause-title">البند السابع: المسؤولية القانونية والتحكيم</div>
  <p>يتحمل المستأجر المسؤولية الكاملة عن أي مخالفات تخص إدارة التشغيل والنشاط خلال فترة الإيجار، بينما يضمن المؤجر قانونية العقار وسلامة المستندات والتراخيص المعمارية. وفي حالة نشوء أي نزاع، يتم اللجوء للقضاء المختص، مع إمكانية اللجوء للتحكيم الودي بين الطرفين.</p>

  <div class="signatures">
    <div class="sig-box">
      <strong>الطرف الأول (المؤجر)</strong><br>
      نصر دسوقي عبد الحميد عبد الصمد<br>
      الرقم القومي: 27210100010092<br><br>
      التوقيع: .......................................<br>
      البصمة: .......................................
    </div>
    <div class="sig-box">
      <strong>الطرف الثاني (المستأجر)</strong><br>
      شركة المطعم الأرجنتيني (عنها/ محمد ممدوح مرسي)<br>
      الرقم القومي: 2619000010259<br><br>
      التوقيع: .......................................<br>
      الختم: .......................................
    </div>
  </div>

</body>
</html>`;

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  convertHtmlToPdf(htmlPath, pdfPath);
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
    <div style="font-size: 9pt; color: #4a5568;">النسخة الشاملة المزودة بعقد إيجار البنسيون الفندقي الرسمي — 2026م</div>
  </div>

  <div class="folder-card" style="border-right-color: #D9822B;">
    <div class="folder-name">📁 02_Contracts_and_Legal (العقود واللوائح القانونية)</div>
    <ul>
      <li><span class="badge-word">WORD</span> <span class="badge-pdf">PDF</span> <strong>عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني.docx / pdf:</strong> عقد الإيجار الرسمي النهائي (10 سنوات - 220 ألف شهرياً - ضمان التشغيل الرقمي).</li>
      <li><span class="badge-word">WORD</span> <span class="badge-pdf">PDF</span> <strong>عقد_عمل_مؤقت_وتعهد_فندقي.docx / pdf:</strong> عقد العمل الموحد بالـ 75% والـ 25%.</li>
    </ul>
  </div>

  <div class="folder-card">
    <div class="folder-name">📁 01_Accounting_System & 04_Hotel_Booking_System</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>تطبيق الويب الفندقي PMS Web App (http://localhost:3000)</strong></li>
      <li><span class="badge-excel">EXCEL</span> <strong>جدول_رواتب_وتقييم_الموظفين_الشهري.xlsx & نظام_حجوزات_وتسكين_الغرف_الفندقي.xlsx</strong></li>
    </ul>
  </div>

</body>
</html>`;

  fs.writeFileSync(sitemapHtmlPath, sitemapContent, 'utf8');
  convertHtmlToPdf(sitemapHtmlPath, sitemapPdfPath);
}

async function main() {
  await generateLeaseContractWord();
  generateContractPdf();
  updateSitemap();
  console.log('\n✨ CONTRACT DOCX AND SITEMAP GENERATED SUCCESSFULLY!');
}

main().catch(err => console.error(err));
