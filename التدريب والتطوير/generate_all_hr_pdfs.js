const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = path.join(__dirname);

// إنشاء المجلدات الفرعية
const folders = {
  reception: path.join(baseDir, '01_الاستقبال_والمكاتب_الأمامية'),
  housekeeping: path.join(baseDir, '02_الإشراف_الداخلي_والغرف'),
  restaurant: path.join(baseDir, '03_المطعم_والكافيه'),
  master: path.join(baseDir, '04_الدليل_التشغيلي_الشامل')
};

Object.values(folders).forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// قالب HTML مرن للتحويل إلى PDF
function getHtmlTemplate(title, roleName, jdHtml, kpiHtml, sopHtml) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page {
      size: A4;
      margin: 12mm 15mm 12mm 15mm;
    }
    body {
      font-family: 'Tajawal', Arial, sans-serif;
      color: #1a202c;
      line-height: 1.6;
      margin: 0;
      padding: 10px;
      direction: rtl;
    }
    .header {
      text-align: center;
      border-bottom: 3px double #1F4E78;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .hotel-title {
      font-size: 16pt;
      font-weight: 800;
      color: #1F4E78;
      margin: 0;
    }
    .doc-title {
      font-size: 20pt;
      font-weight: 800;
      color: #D9822B;
      margin: 5px 0 0 0;
    }
    .subtitle {
      font-size: 11pt;
      color: #4a5568;
      margin-top: 4px;
    }
    .section-title {
      font-size: 14pt;
      font-weight: 700;
      color: #1F4E78;
      background-color: #EDF2F7;
      border-right: 5px solid #D9822B;
      padding: 6px 12px;
      margin-top: 20px;
      margin-bottom: 12px;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 15px 18px;
      margin-bottom: 15px;
    }
    ul, ol {
      padding-right: 20px;
      margin: 5px 0;
    }
    li {
      margin-bottom: 6px;
      font-size: 10.5pt;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 10pt;
    }
    th, td {
      border: 1px solid #CBD5E0;
      padding: 8px 10px;
      text-align: center;
    }
    th {
      background-color: #1F4E78;
      color: #FFFFFF;
      font-weight: 700;
    }
    tr:nth-child(even) {
      background-color: #F7FAFC;
    }
    .alert-box {
      background-color: #EBF8FF;
      border-right: 4px solid #3182CE;
      padding: 10px 14px;
      font-size: 10pt;
      margin: 15px 0;
      border-radius: 4px;
    }
    .badge {
      display: inline-block;
      background: #D9822B;
      color: #fff;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 10pt;
      font-weight: bold;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="hotel-title">فندق نزلة السمان (25 غرفة بوتيك)</div>
    <div class="doc-title">${roleName}</div>
    <div class="subtitle">دليل الوصف الوظيفي، معايير التقييم والـ KPIs (25%)، وإجراءات العمل القياسية (SOPs)</div>
  </div>

  <div class="section-title">📋 أولاً: الوصف الوظيفي (Job Description)</div>
  <div class="card">
    ${jdHtml}
  </div>

  <div class="section-title">🎯 ثانياً: نظام تقييم الأداء الشهري ومكافأة الـ KPIs (25%)</div>
  <div class="card">
    <div class="alert-box">
      <strong>معادلة الراتب:</strong> الراتب الثابت (75%) + حافز الـ KPI المتغير (25%) بناءً على نتيجة التقييم من 100 درجة.
    </div>
    ${kpiHtml}
  </div>

  <div class="section-title">🛠️ ثالثاً: إجراءات العمل القياسية (SOPs) للتدريب والتفتيش</div>
  <div class="card">
    ${sopHtml}
  </div>

</body>
</html>`;
}

// دالة تحويل HTML إلى PDF باستخدام Edge Headless
function convertHtmlToPdf(htmlPath, pdfPath) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edgeAlt = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
  let exe = fs.existsSync(edgePath) ? edgePath : (fs.existsSync(edgeAlt) ? edgeAlt : 'msedge.exe');

  const cmd = `powershell -Command "& \\"${exe}\\" --headless --disable-gpu --no-sandbox --print-to-pdf=\\"${pdfPath}\\" \\"${htmlPath}\\""`;
  console.log(`Generating PDF: ${path.basename(pdfPath)}...`);
  try {
    execSync(cmd, { encoding: 'utf8' });
    console.log(`✅ PDF Created: ${pdfPath}`);
  } catch (err) {
    console.error(`❌ PDF failed for ${pdfPath}:`, err.message);
  }
}

// ----------------------------------------------------
// 1. وظيفة موظف استقبال ومشرف مكاتب أمامية
// ----------------------------------------------------
const receptionJd = `
<p><strong>المسمى الوظيفي:</strong> موظف استقبال بمسؤوليات إشرافية (Front Office Supervisor & Receptionist)</p>
<p><strong>الهدف العام:</strong> إتاحة تجربة ترحيب فندقية راقية للنزلاء (أجانب ومصريين)، وإدارة التسكين والمغادرة والتحصيل المالي وتقفيل الخزينة والرقابة الإشرافية على الوردية.</p>
<strong>المهام والمسؤوليات الرئيسية:</strong>
<ul>
  <li>إنجاز إجراءات التسكين (Check-in) والمغادرة (Check-out) بابتسامة وترحاب فندقي.</li>
  <li>تدوين وتسجيل هويات وجوازات النزلاء بدقة على النظام ووزارة السياحة والشرطة.</li>
  <li>تحصيل المستحقات وإصدار الفواتير وتقفيل الخزينة والوردية (Shift Closure) بدون أي فروقات مالية.</li>
  <li>التنسيق اللحظي مع الإشراف الداخلي والصيانة بشأن جاهزية الغرف.</li>
  <li>حل شكاوى واستفسارات النزلاء ومساعدتهم في تنظيم الرحلات والتوصيل.</li>
</ul>`;

const receptionKpi = `
<table>
  <thead>
    <tr><th>عنصر التقييم</th><th>الدرجة</th><th>معايير التقييم القياسية</th></tr>
  </thead>
  <tbody>
    <tr><td>الانضباط والمظهر والتوقيت</td><td>20</td><td>الالتزام التام بالزي الرسمي وحضور الشفت في الموعد.</td></tr>
    <tr><td>دقة التسكين وتقفيل الخزينة</td><td>25</td><td>خلو التسجيل من الأخطاء وعدم وجود فروق خزينة.</td></tr>
    <tr><td>معاملة النزلاء والحلول</td><td>25</td><td>الابتسامة واللباقة والسرعة في حل الشكاوى.</td></tr>
    <tr><td>التنسيق مع النظافة والصيانة</td><td>15</td><td>متابعة موقف الغرف وتحديث النظام لحظياً.</td></tr>
    <tr><td>أمانة وتطوير العمل</td><td>15</td><td>الحفاظ على سرية البيانات ومرونة التعلم.</td></tr>
  </tbody>
</table>`;

const receptionSop = `
<strong>إجراءات التسكين الفندقي (Check-in Sequence):</strong>
<ol>
  <li>الترحيب والتحية الفندقية الفورية (Welcome to the Hotel).</li>
  <li>طلب الجوازات/الهوية وتوثيقها فوراً.</li>
  <li>تحصيل المبلغ المطلوب نقدياً/فيزا وإصدار فاتورة الاستلام.</li>
  <li>تسليم المفتاح، وشرح مواعيد الإفطار والواي فاي وتوجيه النزيل للغرفة.</li>
  <li>المغادرة: تسلم المفتاح، مراجعة حساب الكافيه، والتأكد من الغرفة مع النظافة وتوديع النزيل.</li>
</ol>`;

// ----------------------------------------------------
// 2. وظيفة عامل نظافة وإشراف داخلي
// ----------------------------------------------------
const hkAttendantJd = `
<p><strong>المسمى الوظيفي:</strong> عامل نظافة غرف وأماكن عامة (Housekeeping Attendant)</p>
<p><strong>الهدف العام:</strong> تنظيف وتعقيم الغرف والأماكن العامة بالفندق وفق أعلى مستويات الجودة الفندقية.</p>
<strong>المهام والمسؤوليات الرئيسية:</strong>
<ul>
  <li>تنظيف وتجهيز الغرف (تغيير المفروشات، تعقيم الحمام، مسح الغبار والأرضيات).</li>
  <li>تنظيف وتطوير الأماكن العامة والاستقبال والممرات والسلالم.</li>
  <li>فرز وتسليم الغسيل والكتانيات للمغسلة واستلام النظيف وتستيفه بالدولاب.</li>
  <li>الإبلاغ الفوري عن المفقودات بغرف المغادرين وأعطال الصيانة.</li>
</ul>`;

const hkAttendantKpi = `
<table>
  <thead>
    <tr><th>عنصر التقييم</th><th>الدرجة</th><th>معايير التقييم القياسية</th></tr>
  </thead>
  <tbody>
    <tr><td>الانضباط والنظافة الشخصية</td><td>20</td><td>الزي النظيف والنظافة الشخصية والالتزام بالمواعيد.</td></tr>
    <tr><td>جودة نظافة الغرف والحمام</td><td>30</td><td>خلو الغرف والحمام تماماً من الأتربة والبقع والشعر.</td></tr>
    <tr><td>السرعة والإنجاز (15-20 دقيقة)</td><td>20</td><td>إنجاز الغرفة بالوقت القياسي الفندقي.</td></tr>
    <tr><td>الأمانة والبلاغ عن الصيانة</td><td>15</td><td>تسليم أي مفقودات فوراً والبلاغ عن الأعطال.</td></tr>
    <tr><td>ترشيد المنظفات والكتانيات</td><td>15</td><td>الاستخدام الأمثل للمواد والحفاظ على المفروشات.</td></tr>
  </tbody>
</table>`;

const hkAttendantSop = `
<strong>خطة الـ 15 دقيقة لتنظيف الغرفة:</strong>
<ol>
  <li>طرق الباب 3 مرات والتنبيه بصوت واضح (Housekeeping).</li>
  <li>تهوية الغرفة وتفريغ القمامة.</li>
  <li>سحب المفروشات القديمة وتركيب طقم الملاءة والألحفة النظيفة بأسلوب مشدود.</li>
  <li>غسيل وتعقيم الحمام وتزويد الفوط والصابون.</li>
  <li>مسح الأسطح والأرضية ورش معطر جو إغلاق الباب.</li>
</ol>`;

// ----------------------------------------------------
// 3. وظيفة مشرفة قسم الإشراف الداخلي
// ----------------------------------------------------
const hkSupJd = `
<p><strong>المسمى الوظيفي:</strong> مشرفة الإشراف الداخلي (Housekeeping Supervisor)</p>
<p><strong>الهدف العام:</strong> التفتيش الدقيق على نظافة الغرف، إدارة مخزون المنظفات والمفروشات، وتدريب فريق عمال النظافة.</p>
<strong>المهام والمسؤوليات الرئيسية:</strong>
<ul>
  <li>التفتيش اليومي الدقيق على الغرف وتأكيد حالتها لنظام الاستقبال إلى (Clean & Ready for Check-in).</li>
  <li>السيطرة على مخزون المنظفات والفوط والملاءات ومستلزمات النزلاء (Guest Amenities).</li>
  <li>توزيع خطط النظافة اليومية ونوبتجيات العمال ومتابعة تنفيذها.</li>
</ul>`;

const hkSupKpi = `
<table>
  <thead>
    <tr><th>عنصر التقييم</th><th>الدرجة</th><th>معايير التقييم القياسية</th></tr>
  </thead>
  <tbody>
    <tr><td>دقة التفتيش وجودة الغرف</td><td>30</td><td>عدم خروج أي غرفة غير مكتملة النظافة.</td></tr>
    <tr><td>إدارة العمال والجدولة</td><td>20</td><td>توزيع المهام بإنصاف وتحفيز الفريق.</td></tr>
    <tr><td>مخزون الفوط والمستلزمات</td><td>20</td><td>عدم حدوث عجز أو هدر في الفوط والمنظفات.</td></tr>
    <tr><td>التواصل مع الاستقبال والصيانة</td><td>15</td><td>التجاوب السريع لتجهيز الغرف وإصلاح الأعطال.</td></tr>
    <tr><td>القدوة والمظهر الانضباطي</td><td>15</td><td>الالتزام التام والسلوك المهني الراقي.</td></tr>
  </tbody>
</table>`;

const hkSupSop = `
<strong>قائمة التفتيش الـ 6 للغرفة الجاهزة:</strong>
<ol>
  <li>السرير: مشدود تماماً وبدون أي تجاعيد أو بقع.</li>
  <li>الحمام: جاف وتلمع المرايا والفوط مطوية بانتظام.</li>
  <li>الأرضية والأسطح: خالية تماماً من الغبار والشعر.</li>
  <li>الأجهزة: التكييف والتلفزيون والريموت شغالين بكفاءة.</li>
  <li>الرائحة: رائحة الغرفة زكية ونظيفة.</li>
</ol>`;

// ----------------------------------------------------
// 4. وظيفة ويتر ومقدم خدمة المطعم والكافيه
// ----------------------------------------------------
const waiterJd = `
<p><strong>المسمى الوظيفي:</strong> ويتر مطعم وكافيه (F&B Waiter)</p>
<p><strong>الهدف العام:</strong> تقديم الوجبات والمشروبات بأسلوب راقٍ وسريع، والنظافة التامة للمطعم والكافيه.</p>
<strong>المهام والمسؤوليات الرئيسية:</strong>
<ul>
  <li>الترحيب بالنزلاء، تقديم المنيو، وتدوين الأوردر بدقة.</li>
  <li>تقديم بوفيه الإفطار الوجبات والمشروبات بطريقة فندقية متميزة.</li>
  <li>تطهير الطاولات وتجهيز المفرش والأدوات وتصفية الطاولات فور انتهاء النزيل.</li>
</ul>`;

const waiterKpi = `
<table>
  <thead>
    <tr><th>عنصر التقييم</th><th>الدرجة</th><th>معايير التقييم القياسية</th></tr>
  </thead>
  <tbody>
    <tr><td>المظهر والنظافة الشخصية</td><td>20</td><td>حلاقة الذقن، الزي النظيف والمظهر الفندقي.</td></tr>
    <tr><td>سرعة ودقة تقديم الخدمة</td><td>25</td><td>تقديم الوجبات والمشروبات بسرعة وبدون أخطاء.</td></tr>
    <tr><td>نظافة وتطوير الطاولات</td><td>25</td><td>تطهير الطاولات والأدوات باستمرار.</td></tr>
    <tr><td>الابتسامة والتعامل مع النزيل</td><td>15</td><td>اللباقة الفندقية والترحيب الدائم.</td></tr>
    <tr><td>الدقة في الشيكات والهدر</td><td>15</td><td>منع تكسير الأدوات والدقة في الطلبات.</td></tr>
  </tbody>
</table>`;

const waiterSop = `
<strong>خطوات تقديم الخدمة بالمطعم والكافيه:</strong>
<ol>
  <li>الترحيب بالنزيل وإجلاسه فور دخوله.</li>
  <li>تقديم المنيو والإفطار مع المشروب الترحيبي.</li>
  <li>تدوين الطلب بدقة وتقديمه من جهة اليمين (Enjoy your meal).</li>
  <li>المتابعة بعد 5 دقائق والتطهير الفوري للطاولة بعد مغادرة النزيل.</li>
</ol>`;

// ----------------------------------------------------
// 5. وظيفة مشرف ومدير مطعم وكافيه
// ----------------------------------------------------
const fbManagerJd = `
<p><strong>المسمى الوظيفي:</strong> مشرف ومدير مطعم وكافيه (F&B Supervisor / Manager)</p>
<p><strong>الهدف العام:</strong> التخطيط والإدارة التشغيلية والمالية للمطعم والكافيه، وضبط التكلفة (Food Cost) ونظافة الصالة.</p>
<strong>المهام والمسؤوليات الرئيسية:</strong>
<ul>
  <li>تطوير المنيو، تحديد الأسعار، وضبط تكلفة المأكولات والمشروبات.</li>
  <li>متابعة الجرد المالي والمشتريات وإيرادات الوردية والتحصيل.</li>
  <li>تدريب الويترية وإدارة جودة وسخونة الوجبات ونظافة الأدوات.</li>
</ul>`;

const fbManagerKpi = `
<table>
  <thead>
    <tr><th>عنصر التقييم</th><th>الدرجة</th><th>معايير التقييم القياسية</th></tr>
  </thead>
  <tbody>
    <tr><td>تحقيق أهداف مبيعات الكافيه</td><td>30</td><td>زيادة مبيعات الكافيه والمأكولات.</td></tr>
    <tr><td>السيطرة على الهدر والتكلفة</td><td>20</td><td>ضبط Food Cost والحفاظ على أدوات التقديم.</td></tr>
    <tr><td>جودة الخدمة ورضا النزيل</td><td>25</td><td>انعدام الشكاوى والسرعة في الخدمة.</td></tr>
    <tr><td>إدارة وتدريب فريق الخدمة</td><td>15</td><td>مظهر وانضباط فريق الويترية.</td></tr>
    <tr><td>الدقة المالية وتقفيل الوردية</td><td>10</td><td>تسليم الإيراد دون أي عجز.</td></tr>
  </tbody>
</table>`;

const fbManagerSop = `
<strong>إجراءات إدارة الوردية بالمطعم والكافيه:</strong>
<ol>
  <li>فحص تجهيز البوفيه ونظافة الصالة قبل مواعيد الإفطار.</li>
  <li>متابعة سرعة خروج الطلبات من المطبخ والكافيه.</li>
  <li>معالجة أي ملاحظات للنزلاء فوراً.</li>
  <li>تقفيل إيراد الوردية وتسليم التحصيل المالي.</li>
</ol>`;

// ----------------------------------------------------
// توليد الملفات وتخزينها وتحويلها إلى PDF
// ----------------------------------------------------
const tasks = [
  {
    folder: folders.reception,
    fileBase: 'الوصف_الوظيفي_والتقييم_والإجراءات_الاستقبال',
    title: 'قسم المكاتب الأمامية — الاستقبال',
    role: 'موظف استقبال ومشرف مكاتب أمامية',
    jd: receptionJd,
    kpi: receptionKpi,
    sop: receptionSop
  },
  {
    folder: folders.housekeeping,
    fileBase: 'عامل_النظافة_الوصف_والتقييم_والإجراءات',
    title: 'قسم الإشراف الداخلي — عامل نظافة',
    role: 'عامل نظافة وتجهيز الغرف (Housekeeping Attendant)',
    jd: hkAttendantJd,
    kpi: hkAttendantKpi,
    sop: hkAttendantSop
  },
  {
    folder: folders.housekeeping,
    fileBase: 'مشرفة_الغرف_الوصف_والتقييم_والإجراءات',
    title: 'قسم الإشراف الداخلي — مشرفة غرف',
    role: 'مشرفة قسم الإشراف الداخلي (Housekeeping Supervisor)',
    jd: hkSupJd,
    kpi: hkSupKpi,
    sop: hkSupSop
  },
  {
    folder: folders.restaurant,
    fileBase: 'مقدم_الخدمة_الويتر_الوصف_والتقييم_والإجراءات',
    title: 'قسم الأغذية والمشروبات — ويتر',
    role: 'مقدم خدمة ويتر (F&B Waiter)',
    jd: waiterJd,
    kpi: waiterKpi,
    sop: waiterSop
  },
  {
    folder: folders.restaurant,
    fileBase: 'مشرف_ومدير_المطعم_الوصف_والتقييم_والإجراءات',
    title: 'قسم الأغذية والمشروبات — إشراف وإدارة',
    role: 'مشرف ومدير مطعم وكافيه (F&B Manager / Supervisor)',
    jd: fbManagerJd,
    kpi: fbManagerKpi,
    sop: fbManagerSop
  }
];

tasks.forEach(t => {
  const htmlPath = path.join(t.folder, `${t.fileBase}.html`);
  const pdfPath = path.join(t.folder, `${t.fileBase}.pdf`);
  const htmlContent = getHtmlTemplate(t.title, t.role, t.jd, t.kpi, t.sop);

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log(`Saved HTML: ${htmlPath}`);
  convertHtmlToPdf(htmlPath, pdfPath);
});

console.log('\n✨ ALL HR & SOP PDF DOCUMENTS GENERATED AND ORGANIZED SUCCESSFULLY!');
