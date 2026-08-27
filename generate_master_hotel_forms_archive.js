const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } = require('docx');
const ExcelJS = require('exceljs');

const rootDir = path.join('d:', 'Henu');
const masterDir = path.join(rootDir, '07_Hotel_Master_Forms_Archive');

// إنشاء مجلد الأرشيف الرئيسي والمجلدات الفرعية
const subDirs = {
  legal: path.join(masterDir, '01_العقود_والالتزامات_القانونية'),
  jobDesc: path.join(masterDir, '02_الوصف_الوظيفي_والهيكل_التنظيمي'),
  training: path.join(masterDir, '03_خطط_التدريب_ومعايير_الخدمة'),
  finance: path.join(masterDir, '04_نماذج_العهدة_والخزينة_والمالية')
};

Object.values(subDirs).forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

function convertHtmlToPdf(htmlPath, pdfPath) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edgeAlt = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
  let exe = fs.existsSync(edgePath) ? edgePath : (fs.existsSync(edgeAlt) ? edgeAlt : 'msedge.exe');

  const cmd = `powershell -Command "& \\"${exe}\\" --headless --disable-gpu --no-sandbox --no-pdf-header-footer --print-to-pdf=\\"${pdfPath}\\" \\"${htmlPath}\\""`;
  try {
    execSync(cmd, { encoding: 'utf8' });
    console.log(`✅ PDF Created: ${path.basename(pdfPath)}`);
  } catch (err) {
    console.error(`❌ PDF Error for ${path.basename(pdfPath)}:`, err.message);
  }
}

// دالة مساعدة لإنشاء فقرات وورد من اليمين لليسار
function createRtlParagraph(text, options = {}) {
  return new Paragraph({
    rightToLeft: true,
    alignment: options.alignment || AlignmentType.RIGHT,
    spacing: { before: options.before || 100, after: options.after || 100, line: 360 },
    children: [
      new TextRun({
        text: text,
        rightToLeft: true,
        font: 'Traditional Arabic',
        size: options.size || 26,
        bold: options.bold || false,
        color: options.color || "000000"
      })
    ]
  });
}

// ---------------------------------------------------------
// 1. إنشاء مستندات 01_العقود_والالتزامات_القانونية
// ---------------------------------------------------------
async function generateLegalDocs() {
  console.log('📄 Generating 01_العقود_والالتزامات_القانونية...');

  // A. عقد عمل موظف فندقي
  const empContractHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>عقد عمل فردي موحد - فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 15mm 20mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #0f172a; line-height: 1.7; margin: 0; padding: 10px; direction: rtl; text-align: justify; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 10px; margin-bottom: 15px; }
    .title { font-size: 18pt; font-weight: 800; color: #1F4E78; }
    .subtitle { font-size: 11pt; color: #D97706; font-weight: bold; }
    .clause { margin-bottom: 12px; }
    .clause-title { font-weight: bold; color: #1F4E78; font-size: 12pt; }
    .signatures { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 15px; border-top: 1px solid #cbd5e1; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">عقــد عمــل فردي موحــد (فندقي)</div>
    <div class="subtitle">شركة المطعم الأرجنتيني المتطور لإدارة الفنادق والمطاعم — فندق هينو الأهرامات</div>
  </div>

  <p>إنه في يوم: .................... الموافق: ..... / ..... / 2026م، تحرر هذا العقد بين كل من:</p>
  <p><strong>أولاً: شركة المطعم الأرجنتيني المتطور لإدارة الفنادق والمطاعم (فندق هينو الأهرامات)</strong> ومقرها: الزمالك / شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة. ويمثلها في هذا العقد السيد / مدير عام الفندق (ويشار إليها بـ <strong>"الطرف الأول / إداريا"</strong>).</p>
  <p><strong>ثانياً: السيد / </strong> .......................................................... الجنسية: .................... بطاقة رقم قومي: (........................................) ومقيم في: .......................................................... (ويشار إليه بـ <strong>"الطرف الثاني / الموظف"</strong>).</p>

  <div class="clause">
    <div class="clause-title">البند الأول: موضوع العقد والمسمى الوظيفي</div>
    <p>يعمل الطرف الثاني لدى الطرف الأول بمهنة: <strong>(........................................)</strong> بقسم: <strong>(....................)</strong> بفندق هينو الأهرامات، ويلتزم بأداء كافة المهام الموكلة إليه وفقاً للتعليمات ولائحة العمل الفندقية.</p>
  </div>

  <div class="clause">
    <div class="clause-title">البند الثاني: فترة الاختبار والمدة</div>
    <p>مدة هذا العقد (سنة واحدة) تبدأ من تاريخ استلام العمل، وتعتبر الثلاثة أشهر الأولى فترة اختبار يجوز خلالها للطرف الأول إنهاء العقد إذا ثبت عدم كفاءة الطرف الثاني مهنياً أو سلوكياً.</p>
  </div>

  <div class="clause">
    <div class="clause-title">البند الثالث: الراتب والأجر</div>
    <p>يتقاضى الطرف الثاني راتباً شهرياً شاملاً قدره: (.................... جنيه مصري) يُصرف في نهاية كل شهر ميلادي، خاضعاً للاستقطاعات القانونية والجزاءات إن وجدت.</p>
  </div>

  <div class="clause">
    <div class="clause-title">البند الرابع: السرية وحفظ العهدة والالتزام</div>
    <p>يتعهد الطرف الثاني بالحفاظ على سرية بيانات النزلاء والفندق والماليات، ورعاية العهدة المسلمة إليه (سواء مالية أو عينية)، وتعتبر أي مخالفة في هذا البند موجبة للإنهاء الفوري والملاحقة القانونية.</p>
  </div>

  <div class="signatures">
    <div>توقيع الطرف الأول (الإدارة):<br><br>.............................................</div>
    <div>توقيع الطرف الثاني (الموظف):<br><br>.............................................</div>
  </div>
</body>
</html>`;

  const htmlPath1 = path.join(subDirs.legal, 'عقد_عمل_موظف_فندقي_رسمي.html');
  const pdfPath1 = path.join(subDirs.legal, 'عقد_عمل_موظف_فندقي_رسمي.pdf');
  fs.writeFileSync(htmlPath1, empContractHtml, 'utf8');
  convertHtmlToPdf(htmlPath1, pdfPath1);

  // B. نموذج إقرار استلام عمل وتعهد سرية
  const ndaHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>إقرار استلام عمل وتعهد سرية عهدة</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 20mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #0f172a; line-height: 1.8; padding: 10px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px solid #D97706; padding-bottom: 10px; margin-bottom: 20px; }
    .title { font-size: 16pt; font-weight: 800; color: #1F4E78; }
    .box { border: 1px solid #cbd5e1; background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">إقرار استلام عمل وتعهد سرية وحفظ عهدة</div>
    <div>فندق هينو الأهرامات — إدارة الفنادق والمطاعم</div>
  </div>

  <p>أقر أنا الموضح بياناتي أدناه:</p>
  <div class="box">
    <strong>الاسم ثلاثي:</strong> ....................................................................................................<br>
    <strong>الرقم القومي:</strong> (.......................................................) <strong>الوظيفة:</strong> ....................................<br>
    <strong>تاريخ استلام العمل:</strong> ..... / ..... / 2026م <strong>القسم:</strong> .....................................................
  </div>

  <p>أنني قد استلمت عملي رسمياً بفندق هينو الأهرامات، وأتعهد بالآتي:</p>
  <ol>
    <li>الحفاظ التام والكامل على جميع العهد المالية والعينية (أجهزة، مفاتيح، أثاث، عهدة كاش) المسلمة إليّ بحكم وظيفتي.</li>
    <li>عدم إفشاء أي أسرار خاصة بالفندق، أو النزلاء، أو القوائم المالية، أو السياسات التشغيلية لأي طرف خارجي.</li>
    <li>الالتزام التام بالزي الرسمي ومواعيد العمل والسلوك المهني الراقي مع كافة النزلاء والزملاء.</li>
    <li>تحمل المسؤولية القانونية والمالية الكاملة في حالة حدوث أي تقصير أو إهمال مثبت بحقي.</li>
  </ol>

  <br><br>
  <div style="display:flex; justify-content:space-between; font-weight:bold;">
    <div>المقر بما فيه (الموظف): ....................................</div>
    <div>التوقيع: ....................................</div>
    <div>البصمة: ....................</div>
  </div>
</body>
</html>`;

  const htmlPath2 = path.join(subDirs.legal, 'نموذج_إقرار_استلام_عمل_وتعهد_سرية.html');
  const pdfPath2 = path.join(subDirs.legal, 'نموذج_إقرار_استلام_عمل_وتعهد_سرية.pdf');
  fs.writeFileSync(htmlPath2, ndaHtml, 'utf8');
  convertHtmlToPdf(htmlPath2, pdfPath2);
}

// ---------------------------------------------------------
// 2. إنشاء مستندات 02_الوصف_الوظيفي_والهيكل_التنظيمي
// ---------------------------------------------------------
async function generateJobDescDocs() {
  console.log('📄 Generating 02_الوصف_الوظيفي_والهيكل_التنظيمي...');

  const jobDescHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>بطاقات الوصف الوظيفي لجميع أقسام الفندق</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #0f172a; line-height: 1.6; padding: 10px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 8px; margin-bottom: 15px; }
    .job-title { font-size: 14pt; font-weight: 800; color: #1F4E78; background: #F1F5F9; padding: 6px 12px; border-right: 5px solid #D97706; margin-top: 15px; border-radius: 0 4px 4px 0; }
    ul { padding-right: 20px; margin-top: 5px; font-size: 10pt; }
    li { margin-bottom: 4px; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size:16pt; font-weight:800; color:#1F4E78;">دليل بطاقات الوصف الوظيفي الرسمي</div>
    <div style="font-size:10pt; color:#D97706; font-weight:bold;">فندق هينو الأهرامات — الهيكل التنظيمي المعتمد</div>
  </div>

  <div class="job-title">1. مدير عام الفندق (General Manager)</div>
  <ul>
    <li>الإشراف الكامل على العمليات التشغيلية والمالية بالفندق (25-27 غرفة والمطعم).</li>
    <li>متابعة تطبيق سياسة الخزينة (Cash Policy) ومطابقة الإيرادات والشيفتات.</li>
    <li>متابعة نسب الإشغال اليومية وتحسين معدلات الأرباح الصافية بدون عمولات.</li>
    <li>تقييم أداء رؤساء الأقسام والموظفين شهرياً وضمان تطبيق معايير الخدمة الأمريكية.</li>
  </ul>

  <div class="job-title">2. موظف الاستقبال والضيافة (Front Desk Agent)</div>
  <ul>
    <li>الاستقبال الترحيبي الاحترافي للنزلاء وإتمام إجراءات التسكين (Check-in / Check-out).</li>
    <li>تسجيل بيانات النزلاء وتأكيد الحجوزات المباشرة بالبرنامج وسداد الحسابات.</li>
    <li>إعداد استمارة تقفيل الشيفت (Shift Clearance) ومطابقة الكاش والفيزا في نهاية الوردية.</li>
    <li>التعامل اللبق مع كافة استفسارات وشكاوى النزلاء وفقاً لدليل الخدمة.</li>
  </ul>

  <div class="job-title">3. مشرف / مشرفة الإشراف الداخلي (Housekeeping Supervisor)</div>
  <ul>
    <li>التفتيش اليومي الدقيق على الغرف وملاءمة مستوى التطهير والنظافة والفرش.</li>
    <li>متابعة رصيد مخزن المفروشات، والمناديل، والمشروبات، وصابون الضيافة.</li>
    <li>تدريب عمال النظافة على خطة تجهيز الغرفة في 15 دقيقة والتأكد من قائمة الفحص (15 Points Checklist).</li>
  </ul>

  <div class="job-title">4. عامل / عاملة نظافة وتجهيز الغرف (Housekeeping Attendant)</div>
  <ul>
    <li>تنظيف وتطهير الغرف والممرات والروف طبقاً لجدول المواعيد اليومي.</li>
    <li>ترتيب السرير (Bed Making) وتغيير أطقم الأغطية والفوّط وتوفير مستلزمات الضيافة.</li>
    <li>الإبلاغ الفوري عن أي تلفيات أو مفقودات بالغرف لمشرف القسم والاستقبال.</li>
  </ul>

  <div class="job-title">5. محاسب الفندق والخزينة (Hotel Accountant)</div>
  <ul>
    <li>مراجعة ومطابقة القيود اليومية وشيتات Petty Cash والخزينة الرئيسية.</li>
    <li>مراجعة فواتير المشتريات والموردين (كوين، الأهرام، كير فرش) وإصدار أوامر الشراء.</li>
    <li>إعداد القوائم المالية وإشغالات الغرف والتقارير الشهرية للإدارة.</li>
  </ul>
</body>
</html>`;

  const htmlPath = path.join(subDirs.jobDesc, 'بطاقات_الوصف_الوظيفي_لكافة_الأقسام.html');
  const pdfPath = path.join(subDirs.jobDesc, 'بطاقات_الوصف_الوظيفي_لكافة_الأقسام.pdf');
  fs.writeFileSync(htmlPath, jobDescHtml, 'utf8');
  convertHtmlToPdf(htmlPath, pdfPath);
}

// ---------------------------------------------------------
// 3. إنشاء مستندات 03_خطط_التدريب_ومعايير_الخدمة
// ---------------------------------------------------------
async function generateTrainingDocs() {
  console.log('📄 Generating 03_خطط_التدريب_ومعايير_الخدمة...');

  const trainingHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>خطة التدريب الفندقي ومعايير الخدمة الأمريكية</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #0f172a; line-height: 1.7; padding: 10px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 8px; margin-bottom: 15px; }
    .module { background: #f8fafc; border: 1px solid #cbd5e1; border-right: 5px solid #10B981; padding: 12px; border-radius: 6px; margin-bottom: 12px; }
    .mod-title { font-weight: bold; color: #1F4E78; font-size: 11.5pt; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size:16pt; font-weight:800; color:#1F4E78;">دليل خطط التدريب ومعايير الخدمة الفندقية (US Standards)</div>
    <div style="font-size:10pt; color:#D97706; font-weight:bold;">فندق هينو الأهرامات — برنامج التطوير الفندقي الشامل</div>
  </div>

  <div class="module">
    <div class="mod-title">الوحدة الأولى: معايير الترحيب والتسكين بالاستقبال (Front Office SOP)</div>
    <p style="font-size:9.5pt; margin:0;">التواصل البصري والابتسامة خلال 5 ثوانٍ من دخول النزيل، استخدام اسم النزيل، سرعة إجراءات التسكين في أقل من 3 دقائق، وتوضيح خدمات ومواعيد الإفطار والروف.</p>
  </div>

  <div class="module">
    <div class="mod-title">الوحدة الثانية: المعايير القياسية لنظافة الغرفة الفندقية (Housekeeping SOP)</div>
    <p style="font-size:9.5pt; margin:0;">فتح النوافذ للتهوية، ترتيب السرير الفندقي باللحاف والكفرات، تطهير الأسطح ومقابض الأبواب بالكلور والمنظفات المعتمدة، وتوفير الشامبو والصابون والمناديل والمياه الفندقية.</p>
  </div>

  <div class="module">
    <div class="mod-title">الوحدة الثالثة: طريقة LAST لإدارة معالجة شكاوى النزلاء (Crisis Management)</div>
    <p style="font-size:9.5pt; margin:0;">
      <strong>L - Listen:</strong> الاستماع الفعّال للنزيل دون مقاطعة.<br>
      <strong>A - Apologize:</strong> الاعتذار المهني الراقي عن الضرر أو الإزعاج.<br>
      <strong>S - Solve:</strong> حل المشكلة فوراً (تغيير الغرفة / إصلاح الصيانة / تقديم ميزة إضافية).<br>
      <strong>T - Thank:</strong> شكر النزيل على ملاحظته لتطوير الخدمة.
    </p>
  </div>
</body>
</html>`;

  const htmlPath = path.join(subDirs.training, 'خطة_تدريب_استاف_الاستقبال_والنظافة_ومعايير_الخدمة.html');
  const pdfPath = path.join(subDirs.training, 'خطة_تدريب_استاف_الاستقبال_والنظافة_ومعايير_الخدمة.pdf');
  fs.writeFileSync(htmlPath, trainingHtml, 'utf8');
  convertHtmlToPdf(htmlPath, pdfPath);
}

// ---------------------------------------------------------
// 4. إنشاء مستندات 04_نماذج_العهدة_والخزينة_والمالية
// ---------------------------------------------------------
async function generateFinanceDocs() {
  console.log('📄 Generating 04_نماذج_العهدة_والخزينة_والمالية...');

  // A. نموذج إقرار استلام عهدة مالية أو عينية
  const custodyHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>إقرار استلام عهدة مالية / عينية</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 18mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #0f172a; line-height: 1.7; padding: 10px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 10px; margin-bottom: 15px; }
    .title { font-size: 16pt; font-weight: 800; color: #1F4E78; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 10pt; }
    th { background: #1F4E78; color: white; padding: 8px; border: 1px solid #1F4E78; }
    td { padding: 8px; border: 1px solid #cbd5e1; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">نموذج إقرار استلام عهدة (مالية / عينية)</div>
    <div style="font-size:10pt; color:#D97706; font-weight:bold;">فندق هينو الأهرامات — القسم المالي والخزينة</div>
  </div>

  <p>أقر أنا الموظف: .......................................................... الوظيفة: .................................... القسم: ....................</p>
  <p>أنني قد استلمت العهدة المبينة تفاصيلها أدناه بحالة جيدة وسليمة، وتحت مسؤوليتي الشخصية والمالية:</p>

  <table>
    <thead>
      <tr>
        <th>م</th>
        <th>بيان العهدة (مالية / أجهزة / مفاتيح / أثاث)</th>
        <th>العدد / المبلغ</th>
        <th>الحالة عند الاستلام</th>
        <th>ملاحظات</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>عهدة كاش نقدية للاستقبال (Petty Cash Float)</td>
        <td>5,000 جنيه</td>
        <td>مكتملة بالحالة الممتازة</td>
        <td>تُسلّم عند نهاية الخدمة</td>
      </tr>
      <tr>
        <td>2</td>
        <td>جهاز POS ماكينة سداد كروت الفيزا</td>
        <td>1 جهاز</td>
        <td>شغالة وجاهزة</td>
        <td>رقم المسلسل: ....................</td>
      </tr>
      <tr>
        <td>3</td>
        <td>مفاتيح ماستر الغرف والدواليب</td>
        <td>....................</td>
        <td>سليمة</td>
        <td>........................................</td>
      </tr>
    </tbody>
  </table>

  <p style="margin-top:20px;">وأتعهد بالمحافظة عليها ورردها فور طلب الإدارة أو عند إنهاء الخدمة.</p>

  <div style="display:flex; justify-content:space-between; margin-top:30px; font-weight:bold;">
    <div>المستلم (الموظف): ....................................</div>
    <div>المسلم (المحاسب/المدير): ....................................</div>
  </div>
</body>
</html>`;

  const htmlPath1 = path.join(subDirs.finance, 'نموذج_إقرار_استلام_عهدة_مالية_أو_عينية.html');
  const pdfPath1 = path.join(subDirs.finance, 'نموذج_إقرار_استلام_عهدة_مالية_أو_عينية.pdf');
  fs.writeFileSync(htmlPath1, custodyHtml, 'utf8');
  convertHtmlToPdf(htmlPath1, pdfPath1);

  // B. إذن صرف ونقود وتقفيل الشيفت
  const voucherHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>نماذج الصرف والتوريد وتقفيل الوردية Shift Clearance</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #0f172a; line-height: 1.6; padding: 10px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 8px; margin-bottom: 12px; }
    .v-box { border: 1.5px solid #1F4E78; padding: 12px; border-radius: 8px; margin-bottom: 15px; background: #fff; }
    .v-title { font-weight: 800; color: #1F4E78; font-size: 12pt; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 9.5pt; }
    th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: center; }
    th { background: #f1f5f9; }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size:16pt; font-weight:800; color:#1F4E78;">نماذج الحركة المالية وتقفيل الوردية المعتمدة</div>
    <div style="font-size:10pt; color:#D97706; font-weight:bold;">فندق هينو الأهرامات — الشؤون المالية والحسابات</div>
  </div>

  <!-- نموذج إذن صرف نقدية -->
  <div class="v-box">
    <div class="v-title">1. إذن صرف نقدية من الخزينة (Cash Disbursement Voucher)</div>
    <p style="margin:4px 0;">التاريخ: ..... / ..... / 2026م | رقم الإذن: (....................)</p>
    <p style="margin:4px 0;">اصرفوا للسيد / .................................................................... مبلغ وقدره: (........................................ جنيه مصري).</p>
    <p style="margin:4px 0;">وذلك مقابل / البيان: ...........................................................................................................................................</p>
    <div style="display:flex; justify-content:space-between; margin-top:10px; font-weight:bold; font-size:9pt;">
      <div>توقيع الطالب: ..................</div>
      <div>توقيع المحاسب: ..................</div>
      <div>اعتماد المدير: ..................</div>
      <div>المستلم: ..................</div>
    </div>
  </div>

  <!-- نموذج استمارة تقفيل الشيفت Shift Clearance -->
  <div class="v-box">
    <div class="v-title">2. استمارة تقفيل الوردية ومطابقة الكاش والفيزا (Shift Cash Clearance)</div>
    <p style="margin:4px 0;">الوردية: (صباحية / مسائية / ليلي) | التاريخ: ..... / ..... / 2026م | اسم موظف الاستقبال: ....................................</p>
    <table>
      <thead>
        <tr>
          <th>بيان الحركة</th>
          <th>المبلغ النظري (بالبرنامج)</th>
          <th>المبلغ الفعلي (بالعد)</th>
          <th>الفارق (+/-)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>إجمالي مقبوضات الكاش</td>
          <td>.................... جـ</td>
          <td>.................... جـ</td>
          <td>.................... جـ</td>
        </tr>
        <tr>
          <td>إجمالي مقبوضات الفيزا (POS)</td>
          <td>.................... جـ</td>
          <td>.................... جـ</td>
          <td>.................... جـ</td>
        </tr>
        <tr>
          <td>المصروفات النثرية بالشيفت</td>
          <td>.................... جـ</td>
          <td>.................... جـ</td>
          <td>.................... جـ</td>
        </tr>
        <tr>
          <td>صافي النقدية المسلمة بالخزينة</td>
          <td colspan="3" style="font-weight:bold; color:#1F4E78;">........................................ جنيه مصري</td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>`;

  const htmlPath2 = path.join(subDirs.finance, 'نماذج_إذن_الصرف_وتقفيل_الوردية_Shift_Clearance.html');
  const pdfPath2 = path.join(subDirs.finance, 'نماذج_إذن_الصرف_وتقفيل_الوردية_Shift_Clearance.pdf');
  fs.writeFileSync(htmlPath2, voucherHtml, 'utf8');
  convertHtmlToPdf(htmlPath2, pdfPath2);

  // C. إنشاء شيت إكسيل حركة الخزينة والعهد النثرية
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('سجل حركة الخزينة والعهد', { views: [{ rightToLeft: true }] });

  sheet.mergeCells('A1:G1');
  const t = sheet.getCell('A1');
  t.value = '📊 سجل حركة الخزينة والعهد النثرية المعتمد — فندق هينو الأهرامات';
  t.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  t.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  t.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.addRow([]);
  const headers = ['م', 'التاريخ', 'اسم الموظف / المستلم', 'البيان / السبب', 'الوارد (إيراد)', 'المنصرف (مصروف)', 'الرصيد المتبقي'];
  const hRow = sheet.addRow(headers);
  hRow.eachCell(c => {
    c.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD97706' } };
    c.alignment = { horizontal: 'center' };
  });

  for (let i = 1; i <= 20; i++) {
    const row = sheet.addRow([i, '', '', '', '', '', { formula: `E${i+2}-F${i+2}` }]);
    row.eachCell((c, col) => {
      c.font = { name: 'Arial', size: 9 };
      c.alignment = { horizontal: col === 4 ? 'right' : 'center' };
    });
  }

  const excelPath = path.join(subDirs.finance, 'سجل_حركة_الخزينة_والعهد_النثرية_Petty_Cash.xlsx');
  await workbook.xlsx.writeFile(excelPath);
  console.log(`✅ Excel Created: سجل_حركة_الخزينة_والعهد_النثرية_Petty_Cash.xlsx`);
}

// ---------------------------------------------------------
// 5. تحديث خريطة توزيع الملفات والمستندات PDF & HTML
// ---------------------------------------------------------
function updateSitemapMaster() {
  const sitemapHtmlPath = path.join(rootDir, 'خريطة_توزيع_الملفات_والمستندات.html');
  const sitemapPdfPath = path.join(rootDir, 'خريطة_توزيع_الملفات_والمستندات.pdf');

  const logoPath = path.join(rootDir, '02_Contracts_and_Legal', 'شعار_الفندق_عقود.jpg');
  let logoDataUrl = '';
  if (fs.existsSync(logoPath)) {
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    logoDataUrl = `data:image/jpeg;base64,${logoBase64}`;
  }

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
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" style="max-width:75px;">` : ''}
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">دليل وخريطة توزيع المستندات والأرشيف الرسمي (Directory Sitemap)</div>
    <div style="font-size: 9pt; color: #4a5568;">المستندات والنماذج الشاملة للأقسام، المالية، العقود، والتدريب — 2026م</div>
  </div>

  <div class="folder-card" style="border-right-color: #D97706;">
    <div class="folder-name">📁 07_Hotel_Master_Forms_Archive (أرشيف النماذج والمستندات الفندقية الرسمية)</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <strong>01_العقود_والالتزامات_القانونية:</strong> (عقد عمل فردي موحد، إقرار استلام عمل وتعهد سرية، عقد إيجار البنسيون 27 غرفة).</li>
      <li><span class="badge-pdf">PDF</span> <strong>02_الوصف_الوظيفي_والهيكل_التنظيمي:</strong> (بطاقات الوصف الوظيفي لمدير الفندق، الاستقبال، Housekeeping، المحاسب، الصيانة).</li>
      <li><span class="badge-pdf">PDF</span> <strong>03_خطط_التدريب_ومعايير_الخدمة:</strong> (دليل التدريب الفندقي US Standards، معايير تجهيز الغرف، ودليل إدارة الأزمات والشكاوى LAST Method).</li>
      <li><span class="badge-pdf">PDF</span> <span class="badge-excel">EXCEL</span> <strong>04_نماذج_العهدة_والخزينة_والمالية:</strong> (إقرار استلام عهدة مالية/عينية، إذن صرف نقدية، تقفيل الشيفت Shift Clearance، وسجل الخزينة Petty Cash).</li>
    </ul>
  </div>

  <div class="folder-card" style="border-right-color: #1F4E78;">
    <div class="folder-name">📁 06_Marketing_and_Feasibility_Study (الدراسات التسويقية ولاندنج بيدج)</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <strong>دراسة_الجدوى_والخطة_التسويقية_الانفوجرافيك_الكاملة.pdf</strong></li>
      <li><span class="badge-pdf">PDF</span> <strong>برشور_الإدارة_الفندقية_والحجز_المباشر_بدون_عمولات.pdf</strong></li>
    </ul>
  </div>

  <div class="folder-card" style="border-right-color: #38A169;">
    <div class="folder-name">📁 01_Accounting_System (الأنظمة الحسابية والجرد)</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل الايرادات والمصروفات.xlsx (6 شيتات Petty Cash)</strong></li>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_استهلاك_المياه_والمشروبات_ومستلزمات_الضيافة.xlsx</strong></li>
    </ul>
  </div>

</body>
</html>`;

  fs.writeFileSync(sitemapHtmlPath, sitemapContent, 'utf8');
  convertHtmlToPdf(sitemapHtmlPath, sitemapPdfPath);
}

async function main() {
  await generateLegalDocs();
  await generateJobDescDocs();
  await generateTrainingDocs();
  await generateFinanceDocs();
  updateSitemapMaster();
  console.log('\n✨ MASTER HOTEL FORMS ARCHIVE GENERATED SUCCESSFULLY!');
}

main().catch(err => console.error(err));
