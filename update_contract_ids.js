const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType } = require('docx');
const { execSync } = require('child_process');

const rootDir = path.join('d:', 'Henu');
const legalDir = path.join(rootDir, '02_Contracts_and_Legal');

if (!fs.existsSync(legalDir)) {
  fs.mkdirSync(legalDir, { recursive: true });
}

// الأرقام القومية الصحيحة المحدثة
const NASR_ID = '29802012101278';
const MOHAMED_ID = '26407212101657';

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

// 1. تحديث عقد الـ 27 غرفة الـ 20 بنداً (Word + PDF)
async function generateUpdated27RoomContract() {
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
          color: options.color || "000000",
          italic: options.italic || false
        })
      ]
    });
  };

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 } } },
      children: [
        createRtlParagraph("بسم الله الرحمن الرحيم", { bold: true, size: 32, color: "78350F", alignment: AlignmentType.CENTER }),
        createRtlParagraph("عــقــد إيــجــار عـقــار ومــنــشـأة فــنــدقــيــة", { bold: true, size: 40, color: "1F4E78", alignment: AlignmentType.CENTER }),
        createRtlParagraph("(بنسيون فندقي 27 غرفة مجهز بالكامل — مدة 10 سنوات)", { bold: true, size: 28, color: "D97706", alignment: AlignmentType.CENTER }),

        createRtlParagraph("إنه في يوم الأحد الموافق 10/5/2026م، تحرر هذا العقد بين كل من:", { bold: true, size: 30, color: "1F4E78" }),

        createRtlParagraph(`الطرف الأول (مؤجر): السيد / نصر دسوقي عبد الحميد عبد الصمد، المقيم في: شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، ويحمل بطاقة رقم قومي: ${NASR_ID}.`, { size: 28 }),
        createRtlParagraph(`الطرف الثاني (مستأجر): شركة / المطعم الأرجنتيني 2، ويمثلها رئيس مجلس الإدارة السيد / محمد ممدوح عبد الحميد مرسي، ويحمل بطاقة رقم قومي: ${MOHAMED_ID}، الكائنة في: محل 2 الدور الأرضي، 159 شارع 26 يوليو، الزمالك، قصر النيل.`, { size: 28 }),

        createRtlParagraph("أقر الطرفان بأهليتهما القانونية للتعاقد واتفقا على ما يلي:", { italic: true, size: 26 }),

        createRtlParagraph("البند التمهيدي", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("يمتلك الطرف الأول البنسيون الكائن في 21 شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، والذي يتكون من (مدخل للفندق + أربعة أدوار علوي + روف)، وهو بنسيون فندقي مكون من 27 غرفة مجهزة ومفروشة بالكامل ومستوفية للتشغيل. ولا يوجد على العين أي نزاع قضائي أو قانوني، كما يضمن أنه لا يوجد أي حقوق عينية للغير على العين أو أي عارض قانوني يمنع أو يعرقل أو يعطل التشغيل لأي سبب يكون ناتجاً عن تصرفات أو إدارة الطرف الأول أو أي مشغل أو مستأجر آخر. وفي حال طرأت أي معوقات أو قيود من أي جهة كانت (مهما كان نوعها أو مصدرها) أدت إلى توقف أو عرقلة ممارسة النشاط أو الحيلولة دون وصول الخدمة للعملاء بالشكل المتعارف عليه، يُعتبر ذلك إخلالاً جوهرياً بالالتزام بالتمكين من الانتفاع بالعين، ويحق للمستأجر في هذه الحالة فسخ العقد فوراً، واسترداد كافة المبالغ المدفوعة (تأمين وإيجار)، مع احتفاظه بكامل حقه في الرجوع على الطرف الأول بالتعويض الجابر لكافة الأضرار المادية والأدبية الناتجة عن توقف النشاط.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الأول", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("يُعتبر البند التمهيدي جزءاً لا يتجزأ من بنود هذا العقد ومكملاً ومتمماً لكافة أحكامه.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الثاني", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("بموجب هذا العقد، أجّر الطرف الأول إلى الطرف الثاني البنسيون المذكور والمكون من (ريسبشن البنسيون بالدور الأرضي + أربعة أدوار علوية؛ حيث يتكون الدور الأول من 6 غرف كاملة المرافق بالفرش للاستخدام الفندقي، والدور الثاني 7 غرف كاملة المرافق بالفرش للاستخدام الفندقي، والدور الثالث 7 غرف كاملة المرافق بالفرش للاستخدام الفندقي، والدور الرابع 7 غرف كاملة المرافق بالفرش للاستخدام الفندقي + الروف)، والفندق مفروش بالكامل وبحالة جيدة للاستخدام بنشاط بنسيون فندقي.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الثالث", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("مدة هذا العقد هي 10 سنوات (عشر سنوات فقط لا غير)، تبدأ من 15/9/2024 وتنتهي في 14/9/2034. وتُعتبر المدة من تاريخ تحرير العقد وحتى بداية الإيجار الفعلي فترة سماح وتجهيز غير محسوبة في القيمة الإيجارية ولا يُدفع عنها إيجار. والمدّة غير قابلة للتجديد إلا باتفاق وعقد جديدين، ويلتزم الطرف الثاني بتسليم العين بانتهاء المدة دون حاجة لتنبيه أو إنذار.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الرابع", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("القيمة الإيجارية الشهرية المتفق عليها هي 220,000 جنيه (مائتان وعشرون ألف جنيه مصري فقط لا غير) تدفع مقدماً في اليوم الأول من كل شهر بإيصال استلام، وتزاد القيمة الإيجارية بنسبة 10% سنوياً.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الخامس", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("لا يجوز للطرف الثاني التأجير من الباطن أو التنازل عن العقد للغير بأي وجه دون موافقة كتابية، وإلا اعتُبر العقد مفسوخاً من تلقاء نفسه.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند السادس", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("في حال تأخر الطرف الثاني عن سداد الإيجار لمدة شهر من ميعاد استحقاقه، يُعتبر العقد مفسوخاً من تلقاء نفسه دون حاجة لإنذار أو حكم قضائي، مع احتفاظ الطرف الأول بحقه في المطالبة بالمستحقات.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند السابع", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("تؤول كافة التشطيبات والديكورات والتحسينات التي يجريها المستأجر إلى المؤجر عند انتهاء الإيجار دون مطالبة بقيمتها، مع التزام المستأجر بإصلاح أي تلفيات إنشائية أو في المرافق الأساسية قد تنشأ بسبب استخدامه.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الثامن", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("لا يجوز تغيير النشاط الفندقي إلا بموافقة كتابية صريحة من الطرف الأول.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند التاسع", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("يتحمل المستأجر منفرداً أي ديون أو التزامات تنشأ عن إدارته وتشغيله للعين خلال مدة الإيجار.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند العاشر", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("يكون الطرف الثاني مسؤولاً مسؤولية مدنية وجنائية عن تشغيله للمكان، بينما يلتزم الطرف الأول بصحة التراخيص الإنشائية وسلامة العقار.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الحادي عشر", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("لا يجوز للطرف الثاني إجراء تعديلات هيكلية أو هدم وبناء حوائط رئيسية إلا بموافقة كتابية مسبقة من المؤجر.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الثاني عشر", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("إذا رغب الطرف الثاني في ترك العين وإنهاء العقد قبل انتهاء مدته، يلتزم بإخطار المؤجر رسمياً قبلها بشهرين على الأقل، ويُخصم نصف مبلغ التأمين في هذه الحالة.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الثالث عشر", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("اتفق الطرفان على إنشاء مصعد (أسانسير) للبنسيون مناصفة (50% لكل طرف)، على أن يقوم المستأجر بسداد التكلفة كاملة للمقاول، ويقوم المؤجر بسداد حصته للمستأجر على أقساط شهرية بواقع 20,000 جنيه تُخصم من القيمة الإيجارية الشهرية بدءاً من 1/9/2025.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الرابع عشر", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("مبلغ التأمين المتفق عليه هو 1,000,000 جنيه (مليون جنيه مصري). أقر الطرف الأول باستلام 850,000 جنيه عند التوقيع، على أن يُسدد باقي التأمين وقدره 150,000 جنيه على شهرين (75,000 جنيه في 1/7/2024 و75,000 جنيه في 1/8/2024)، ويُرد التأمين بنهاية العقد بعد تسليم العين والوفاء بكافة الالتزامات.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الخامس عشر", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("يلتزم الطرف الأول بتقديم ملف التصالح على مخالفات البناء الخاصة بالعين محل التعاقد فور فتح باب التصالح بحي الهرم، على أن يسدد المستأجر رسوم التصالح وتُخصم من القيمة الإيجارية بواقع 20,000 جنيه شهرياً. وإذا تخلّف المؤجر عن التقديم بعد فتح الباب، يلتزم بسداد شرط جزائي قدره 150,000 جنيه للمستأجر.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند السادس عشر", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("اتفق الطرفان على توثيق وتسجيل هذا العقد بالشهر العقاري وتذييله بالصيغة التنفيذية.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند السابع عشر", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("يُعتبر العقد مفسوخاً من تلقاء نفسه دون حاجة لإنذار أو حكم قضائي في حال إخلال أي طرف بالتزاماته الجوهرية.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند الثامن عشر", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("تختص محكمة الجيزة الابتدائية وجزئياتها بالفصل في أي نزاع ينشأ عن تفسير أو تنفيذ هذا العقد.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("البند التاسع عشر", { bold: true, size: 32, color: "1F4E78", before: 180 }),
        createRtlParagraph("يتكون هذا العقد من عشرين بنداً ومحرر من نسختين بيد كل طرف نسخة للعمل بموجبها.", { alignment: AlignmentType.JUSTIFY }),

        createRtlParagraph("التوقيعات والاعتماد الرسمي للطرفين والشهود:", { bold: true, size: 32, color: "78350F", before: 250, after: 150 }),

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
                    createRtlParagraph("الاسم: نصر دسوقي عبد الحميد عبد الصمد", { alignment: AlignmentType.CENTER }),
                    createRtlParagraph(`الرقم القومي: ${NASR_ID}`, { alignment: AlignmentType.CENTER }),
                    createRtlParagraph("التوقيع: ...........................................", { alignment: AlignmentType.CENTER })
                  ]
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    createRtlParagraph("الطرف الثاني (المستأجر):", { bold: true, alignment: AlignmentType.CENTER, color: "D97706" }),
                    createRtlParagraph("الاسم: شركة المطعم الأرجنتيني 2 (عنها/ محمد ممدوح مرسي)", { alignment: AlignmentType.CENTER }),
                    createRtlParagraph(`الرقم القومي: ${MOHAMED_ID}`, { alignment: AlignmentType.CENTER }),
                    createRtlParagraph("التوقيع: ...........................................", { alignment: AlignmentType.CENTER })
                  ]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    createRtlParagraph("الشاهد الأول:", { bold: true, alignment: AlignmentType.CENTER, color: "475569" }),
                    createRtlParagraph("الاسم: ...........................................", { alignment: AlignmentType.CENTER }),
                    createRtlParagraph("التوقيع: ...........................................", { alignment: AlignmentType.CENTER })
                  ]
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    createRtlParagraph("الشاهد الثاني:", { bold: true, alignment: AlignmentType.CENTER, color: "475569" }),
                    createRtlParagraph("الاسم: ...........................................", { alignment: AlignmentType.CENTER }),
                    createRtlParagraph("التوقيع: ...........................................", { alignment: AlignmentType.CENTER })
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
  const docxPath = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_27غرفة.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Updated Word: ${path.basename(docxPath)}`);

  // HTML PDF
  const htmlPath = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_27غرفة.html');
  const pdfPath = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_27غرفة.pdf');

  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>عقد إيجار بنسيون فندقي (27 غرفة)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 15mm 18mm; }
    body { font-family: 'Amiri', 'Tajawal', Arial, serif; color: #0f172a; line-height: 1.8; margin: 0; padding: 10px; direction: rtl; text-align: justify; }
    .header-table { width: 100%; margin-bottom: 15px; border-bottom: 2px double #b45309; padding-bottom: 10px; }
    .basmala { font-size: 14pt; font-weight: bold; color: #78350F; text-align: center; margin-bottom: 4px; }
    .doc-title { font-size: 20pt; font-weight: bold; color: #1F4E78; text-align: center; margin: 0; }
    .subtitle { font-size: 12pt; font-weight: bold; color: #D97706; text-align: center; margin-top: 4px; }
    .party-box { background: #F8FAFC; border: 1px solid #CBD5E1; border-right: 6px solid #1F4E78; padding: 12px 15px; border-radius: 8px; margin-bottom: 12px; font-size: 11.5pt; text-align: right; }
    .party-box.tenant { border-right-color: #D97706; }
    .clause-header { font-size: 13pt; font-weight: bold; color: #1F4E78; margin-top: 16px; margin-bottom: 5px; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 3px; text-align: right; }
    p { font-size: 11.5pt; margin-top: 4px; margin-bottom: 8px; text-align: justify; text-justify: inter-word; }
    .signatures-section { margin-top: 30px; page-break-inside: avoid; }
    .sig-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .sig-box { width: 48%; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 12px; text-align: center; font-size: 11pt; background: #FFFFFF; vertical-align: top; }
  </style>
</head>
<body>

  <div class="header-table">
    <div class="basmala">بسم الله الرحمن الرحيم</div>
    <div class="doc-title">عــقــد إيــجــار عـقــار ومــنــشـأة فــنــدقــيــة</div>
    <div class="subtitle">(بنسيون فندقي 27 غرفة مجهز بالكامل — مدة 10 سنوات)</div>
  </div>

  <p><strong>إنه في يوم الأحد الموافق 10/5/2026م، تحرر هذا العقد بين كل من:</strong></p>

  <div class="party-box">
    <strong style="color: #78350F; font-size: 12.5pt;">الطرف الأول (مؤجر): السيد / نصر دسوقي عبد الحميد عبد الصمد</strong><br>
    المقيم في: شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، ويحمل بطاقة رقم قومي: <strong>${NASR_ID}</strong>.
  </div>

  <div class="party-box tenant">
    <strong style="color: #78350F; font-size: 12.5pt;">الطرف الثاني (مستأجر): شركة / المطعم الأرجنتيني 2</strong><br>
    ويمثلها رئيس مجلس الإدارة <strong>السيد / محمد ممدوح عبد الحميد مرسي</strong>، ويحمل بطاقة رقم قومي: <strong>${MOHAMED_ID}</strong>، الكائنة في: محل 2 الدور الأرضي، 159 شارع 26 يوليو، الزمالك، قصر النيل.
  </div>

  <p style="font-style: italic; color: #475569;">أقر الطرفان بأهليتهما القانونية للتعاقد واتفقا على ما يلي:</p>

  <div class="clause-header">البند التمهيدي</div>
  <p>يمتلك الطرف الأول البنسيون الكائن في 21 شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، والذي يتكون من (مدخل للفندق + أربعة أدوار علوي + روف)، وهو بنسيون فندقي مكون من 27 غرفة مجهزة ومفروشة بالكامل ومستوفية للتشغيل. ولا يوجد على العين أي نزاع قضائي أو قانوني، كما يضمن أنه لا يوجد أي حقوق عينية للغير على العين أو أي عارض قانوني يمنع أو يعرقل أو يعطل التشغيل لأي سبب يكون ناتجاً عن تصرفات أو إدارة الطرف الأول أو أي مشغل أو مستأجر آخر. وفي حال طرأت أي معوقات أو قيود من أي جهة كانت (مهما كان نوعها أو مصدرها) أدت إلى توقف أو عرقلة ممارسة النشاط أو الحيلولة دون وصول الخدمة للعملاء بالشكل المتعارف عليه، يُعتبر ذلك إخلالاً جوهرياً بالالتزام بالتمكين من الانتفاع بالعين، ويحق للمستأجر في هذه الحالة فسخ العقد فوراً، واسترداد كافة المبالغ المدفوعة (تأمين وإيجار)، مع احتفاظه بكامل حقه في الرجوع على الطرف الأول بالتعويض الجابر لكافة الأضرار المادية والأدبية الناتجة عن توقف النشاط.</p>

  <div class="clause-header">البند الأول</div>
  <p>يُعتبر البند التمهيدي جزءاً لا يتجزأ من بنود هذا العقد ومكملاً ومتمماً لكافة أحكامه.</p>

  <div class="clause-header">البند الثاني</div>
  <p>بموجب هذا العقد، أجّر الطرف الأول إلى الطرف الثاني البنسيون المذكور والمكون من (ريسبشن البنسيون بالدور الأرضي + أربعة أدوار علوية؛ حيث يتكون الدور الأول من 6 غرف كاملة المرافق بالفرش للاستخدام الفندقي، والدور الثاني 7 غرف كاملة المرافق بالفرش للاستخدام الفندقي، والدور الثالث 7 غرف كاملة المرافق بالفرش للاستخدام الفندقي، والدور الرابع 7 غرف كاملة المرافق بالفرش للاستخدام الفندقي + الروف)، والفندق مفروش بالكامل وبحالة جيدة للاستخدام بنشاط بنسيون فندقي.</p>

  <div class="clause-header">البند الثالث</div>
  <p>مدة هذا العقد هي 10 سنوات (عشر سنوات فقط لا غير)، تبدأ من 15/9/2024 وتنتهي في 14/9/2034. وتُعتبر المدة من تاريخ تحرير العقد وحتى بداية الإيجار الفعلي فترة سماح وتجهيز غير محسوبة في القيمة الإيجارية ولا يُدفع عنها إيجار. والمدّة غير قابلة للتجديد إلا باتفاق وعقد جديدين، ويلتزم الطرف الثاني بتسليم العين بانتهاء المدة دون حاجة لتنبيه أو إنذار.</p>

  <div class="clause-header">البند الرابع</div>
  <p>القيمة الإيجارية الشهرية المتفق عليها هي 220,000 جنيه (مائتان وعشرون ألف جنيه مصري فقط لا غير) تدفع مقدماً في اليوم الأول من كل شهر بإيصال استلام، وتزاد القيمة الإيجارية بنسبة 10% سنوياً.</p>

  <div class="clause-header">البند الخامس</div>
  <p>لا يجوز للطرف الثاني التأجير من الباطن أو التنازل عن العقد للغير بأي وجه دون موافقة كتابية، وإلا اعتُبر العقد مفسوخاً من تلقاء نفسه.</p>

  <div class="clause-header">البند السادس</div>
  <p>في حال تأخر الطرف الثاني عن سداد الإيجار لمدة شهر من ميعاد استحقاقه، يُعتبر العقد مفسوخاً من تلقاء نفسه دون حاجة لإنذار أو حكم قضائي، مع احتفاظ الطرف الأول بحقه في المطالبة بالمستحقات.</p>

  <div class="clause-header">البند السابع</div>
  <p>تؤول كافة التشطيبات والديكورات والتحسينات التي يجريها المستأجر إلى المؤجر عند انتهاء الإيجار دون مطالبة بقيمتها، مع التزام المستأجر بإصلاح أي تلفيات إنشائية أو في المرافق الأساسية قد تنشأ بسبب استخدامه.</p>

  <div class="clause-header">البند الثامن</div>
  <p>لا يجوز تغيير النشاط الفندقي إلا بموافقة كتابية صريحة من الطرف الأول.</p>

  <div class="clause-header">البند التاسع</div>
  <p>يتحمل المستأجر منفرداً أي ديون أو التزامات تنشأ عن إدارته وتشغيله للعين خلال مدة الإيجار.</p>

  <div class="clause-header">البند العاشر</div>
  <p>يكون الطرف الثاني مسؤولاً مسؤولية مدنية وجنائية عن تشغيله للمكان، بينما يلتزم الطرف الأول بصحة التراخيص الإنشائية وسلامة العقار.</p>

  <div class="clause-header">البند الحادي عشر</div>
  <p>لا يجوز للطرف الثاني إجراء تعديلات هيكلية أو هدم وبناء حوائط رئيسية إلا بموافقة كتابية مسبقة من المؤجر.</p>

  <div class="clause-header">البند الثاني عشر</div>
  <p>إذا رغب الطرف الثاني في ترك العين وإنهاء العقد قبل انتهاء مدته، يلتزم بإخطار المؤجر رسمياً قبلها بشهرين على الأقل، ويُخصم نصف مبلغ التأمين في هذه الحالة.</p>

  <div class="clause-header">البند الثالث عشر</div>
  <p>اتفق الطرفان على إنشاء مصعد (أسانسير) للبنسيون مناصفة (50% لكل طرف)، على أن يقوم المستأجر بسداد التكلفة كاملة للمقاول، ويقوم المؤجر بسداد حصته للمستأجر على أقساط شهرية بواقع 20,000 جنيه تُخصم من القيمة الإيجارية الشهرية بدءاً من 1/9/2025.</p>

  <div class="clause-header">البند الرابع عشر</div>
  <p>مبلغ التأمين المتفق عليه هو 1,000,000 جنيه (مليون جنيه مصري). أقر الطرف الأول باستلام 850,000 جنيه عند التوقيع، على أن يُسدد باقي التأمين وقدره 150,000 جنيه على شهرين (75,000 جنيه في 1/7/2024 و75,000 جنيه في 1/8/2024)، ويُرد التأمين بنهاية العقد بعد تسليم العين والوفاء بكافة الالتزامات.</p>

  <div class="clause-header">البند الخامس عشر</div>
  <p>يلتزم الطرف الأول بتقديم ملف التصالح على مخالفات البناء الخاصة بالعين محل التعاقد فور فتح باب التصالح بحي الهرم، على أن يسدد المستأجر رسوم التصالح وتُخصم من القيمة الإيجارية بواقع 20,000 جنيه شهرياً. وإذا تخلّف المؤجر عن التقديم بعد فتح الباب، يلتزم بسداد شرط جزائي قدره 150,000 جنيه للمستأجر.</p>

  <div class="clause-header">البند السادس عشر</div>
  <p>اتفق الطرفان على توثيق وتسجيل هذا العقد بالشهر العقاري وتذييله بالصيغة التنفيذية.</p>

  <div class="clause-header">البند السابع عشر</div>
  <p>يُعتبر العقد مفسوخاً من تلقاء نفسه دون حاجة لإنذار أو حكم قضائي في حال إخلال أي طرف بالتزاماته الجوهرية.</p>

  <div class="clause-header">البند الثامن عشر</div>
  <p>تختص محكمة الجيزة الابتدائية وجزئياتها بالفصل في أي نزاع ينشأ عن تفسير أو تنفيذ هذا العقد.</p>

  <div class="clause-header">البند التاسع عشر</div>
  <p>يتكون هذا العقد من عشرين بنداً ومحرر من نسختين بيد كل طرف نسخة للعمل بموجبها.</p>

  <div class="signatures-section">
    <table class="sig-table">
      <tr>
        <td class="sig-box">
          <strong style="color: #1F4E78; font-size: 12pt;">الطرف الأول (المؤجر)</strong><br><br>
          الاسم: نصر دسوقي عبد الحميد عبد الصمد<br>
          الرقم القومي: ${NASR_ID}<br><br>
          التوقيع: .......................................
        </td>
        <td style="width: 4%;"></td>
        <td class="sig-box">
          <strong style="color: #D97706; font-size: 12pt;">الطرف الثاني (المستأجر)</strong><br><br>
          الاسم: شركة المطعم الأرجنتيني 2 (عنها/ محمد ممدوح مرسي)<br>
          الرقم القومي: ${MOHAMED_ID}<br><br>
          التوقيع: .......................................
        </td>
      </tr>
      <tr><td colspan="3" style="height: 15px;"></td></tr>
      <tr>
        <td class="sig-box">
          <strong style="color: #475569; font-size: 11pt;">الشاهد الأول</strong><br><br>
          الاسم: .......................................<br><br>
          التوقيع: .......................................
        </td>
        <td style="width: 4%;"></td>
        <td class="sig-box">
          <strong style="color: #475569; font-size: 11pt;">الشاهد الثاني</strong><br><br>
          الاسم: .......................................<br><br>
          التوقيع: .......................................
        </td>
      </tr>
    </table>
  </div>

</body>
</html>`;

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  convertHtmlToPdf(htmlPath, pdfPath);
}

// 2. تحديث باقي نسخ العقود المدمجة
async function updateMergedContracts() {
  const mergedHtml = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_for_merge.html');
  const mergedPdf = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_for_merge.pdf');
  
  if (fs.existsSync(mergedHtml)) {
    let content = fs.readFileSync(mergedHtml, 'utf8');
    content = content.replace(/27210100010092/g, NASR_ID);
    content = content.replace(/2619000010259/g, MOHAMED_ID);
    fs.writeFileSync(mergedHtml, content, 'utf8');
    convertHtmlToPdf(mergedHtml, mergedPdf);
  }
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
    <div style="font-size: 9pt; color: #4a5568;">النسخة الشاملة المزودة بالأرقام القومية المحدثة لأطراف عقد الإيجار — 2026م</div>
  </div>

  <div class="folder-card" style="border-right-color: #D9822B;">
    <div class="folder-name">📁 02_Contracts_and_Legal (العقود واللوائح القانونية)</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <span class="badge-word">WORD</span> <strong>عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_27غرفة.pdf / docx:</strong> عقد الإيجار الرسمي بالرقم القومي لنصر (29802012101278) ومحمد ممدوح (26407212101657).</li>
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
  await generateUpdated27RoomContract();
  await updateMergedContracts();
  updateSitemap();
  console.log('\n✨ CONTRACTS UPDATED WITH NEW NATIONAL IDs SUCCESSFULLY!');
}

main().catch(err => console.error(err));
