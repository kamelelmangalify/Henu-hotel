const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = path.join(__dirname);

// قراءة شعار الفندق الرسمي وتحويله لـ Base64
const logoPath = path.join('d:', 'Henu', '02_Contracts_and_Legal', 'شعار_الفندق_عقود.jpg');
let logoDataUrl = '';
if (fs.existsSync(logoPath)) {
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  logoDataUrl = `data:image/jpeg;base64,${logoBase64}`;
}

const folderTraining = path.join(baseDir, '05_برامج_التدريب_السهلة');
const folderChecklists = path.join(baseDir, '06_استمارات_التعريف_والفحص');

[folderTraining, folderChecklists].forEach(f => {
  if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});

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

// 1. خطة التدريب 3 أيام
const trainingHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>خطة التدريب الميداني (3 أيام لكل محطة عمل) — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 15mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; line-height: 1.5; margin: 0; padding: 5px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 10px; margin-bottom: 15px; }
    .brand-logo { max-width: 90px; height: auto; border-radius: 6px; margin-bottom: 4px; }
    .hotel-title-en { font-size: 13pt; font-weight: 800; color: #78350f; letter-spacing: 2px; }
    .hotel-title-ar { font-size: 12pt; font-weight: 700; color: #92400e; }
    .doc-title { font-size: 18pt; font-weight: 800; color: #1F4E78; margin-top: 4px; }
    .station-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-right: 5px solid #1F4E78; border-radius: 6px; padding: 12px; margin-bottom: 15px; }
    .day-title { font-size: 11pt; font-weight: 700; color: #D9822B; margin-top: 8px; margin-bottom: 3px; }
    ul { padding-right: 20px; margin: 3px 0; }
    li { margin-bottom: 3px; font-size: 9.5pt; }
    .badge { display: inline-block; background: #1F4E78; color: #fff; padding: 3px 10px; border-radius: 12px; font-size: 9.5pt; font-weight: bold; }
  </style>
</head>
<body>

  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
    <div class="hotel-title-en">H E N U  H O T E L  P Y R A M I D S</div>
    <div class="hotel-title-ar">فندق هينو الأهرامات — نزلة السمان (25 غرفة)</div>
    <div class="doc-title">برنامج التدريب الميداني السريع (3 أيام لكل محطة عمل)</div>
  </div>

  <div class="station-card">
    <span class="badge">المحطة الأولى: قسم الاستقبال والمكاتب الأمامية (Reception Station)</span>
    <div class="day-title">🗓️ اليوم الأول: الترحيب، النظام، والتسكين الأساسي (Check-in Basics)</div>
    <ul>
      <li>التعرف على بروتوكول الترحيب الفندقي والابتسامة (Welcome Greeting).</li>
      <li>شرح استخدام برنامج الفندق وتحديد حالة الغرف (Clean, Dirty, Occupied).</li>
      <li>تدريب عملي على خطوات التسكين: طلب الجوازات/الهوية، ملء الكارت، وتسليم المفاتيح وال واي فاي.</li>
    </ul>

    <div class="day-title">🗓️ اليوم الثاني: الماليات، تقفيل الخزينة، والتواصل مع الأقسام</div>
    <ul>
      <li>تدريب عملي على تحصيل المبالغ (نقدياً وبالفيزا) وإصدار الفواتير الرسمية.</li>
      <li>طريقة التنسيق اللحظي مع الـ Housekeeping والصيانة لتحديث حالة الغرف.</li>
      <li>خطوات تقفيل الوردية المالية (Shift Closure) وتسليم الخزينة بدون أخطاء.</li>
    </ul>

    <div class="day-title">🗓️ اليوم الثالث: التعامل مع السائحين، الشكاوى، والاختبار الميداني</div>
    <ul>
      <li>مساعدة النزلاء والأجانب في معلومات الرحلات والتوصيل وتلبية الاحتياجات.</li>
      <li>إتيكيت التعامل مع شكاوى النزلاء وامتصاص الغضب والتصرف السريع.</li>
      <li>اختبار ميداني شامل: تسكين نزيل وهمي + مغادرة نزيل + تقفيل وردية تحت إشراف المشرف.</li>
    </ul>
  </div>

  <div class="station-card" style="border-right-color: #38A169;">
    <span class="badge" style="background: #38A169;">المحطة الثانية: قسم الإشراف الداخلي والغرف (Housekeeping Station)</span>
    <div class="day-title">🗓️ اليوم الأول: السلامة، استخدام المواد، وسحب المفروشات</div>
    <ul>
      <li>التعرف على المواد المنظفة وأدوات التعقيم وتجهيز عربة النظافة (Housekeeping Trolley).</li>
      <li>قواعد دخول الغرف وطرق الباب القياسي (3 مرات مع التنبيه بصوت واضح).</li>
      <li>طريقة سحب الكتانيات والمفروشات المتسخة وتفريغ القمامة وتهوية الغرفة.</li>
    </ul>

    <div class="day-title">🗓️ اليوم الثاني: خطة الـ 15 دقيقة لتنظيف الغرفة والحمام</div>
    <ul>
      <li>تدريب عملي على تركيب وطوي الملاءات والألحفة الفندقية بأسلوب مشدود ومضبوط.</li>
      <li>خطوات غسيل وتعقيم الحمام (المرحاض، الدش، الأحواض، والمرايا) وتزويد الفوط والصابون.</li>
      <li>مسح الغبار من التلفزيون والأرضيات، والتفتيش الشخصي ورش معطر الجو.</li>
    </ul>

    <div class="day-title">🗓️ اليوم الثالث: الأماكن العامة، المفقودات، والاختبار الميداني</div>
    <ul>
      <li>تنظيف الأماكن العامة والاستقبال والممرات والسلالم.</li>
      <li>إجراءات التعامل مع مفقودات النزلاء (Lost & Found) والبلاغ عن الصيانة.</li>
      <li>اختبار ميداني شامل: تنظيف وتجهيز غرفة كاملة خلال 15-20 دقيقة والتفتيش عليها.</li>
    </ul>
  </div>

  <div class="station-card" style="border-right-color: #D9822B;">
    <span class="badge" style="background: #D9822B;">المحطة الثالثة: قسم الخدمة والمطعم والكافيه (F&B Service Station)</span>
    <div class="day-title">🗓️ اليوم الأول: النظافة الشخصية، الترحيب، وتجهيز الصالة</div>
    <ul>
      <li>قواعد المظهر الفندقي، حلاقة الذقن، نظافة اليدين، والزي الرسمي.</li>
      <li>طريقة مسح وتطهير الطاولات والكراسي وتجهيز أدوات التقديم (Cutlery Setup).</li>
      <li>إتيكيت الترحيب بالنزلاء عند دخول المطعم وإجلاسهم.</li>
    </ul>

    <div class="day-title">🗓️ اليوم الثاني: أخذ الطلبات، الخدمة الفندقية، وتجهيز الإفطار</div>
    <ul>
      <li>طريقة تدوين وأخذ الأوردر بدقة وتأكيده مع النزيل.</li>
      <li>حمل الأطباق والمشروبات وتقديمها للنزيل من الجهة اليمنى بابتسامة.</li>
      <li>تجهيز ومتابعة سخونة ونظافة بوفيه الإفطار الصباحي.</li>
    </ul>

    <div class="day-title">🗓️ اليوم الثالث: التطهير، المتابعة، والاختبار الميداني</div>
    <ul>
      <li>متابعة النزيل أثناء تناول الوجبة ورفع الأطباق الفارغة (Clearing).</li>
      <li>سرعة تطهير الطاولة بعد مغادرة النزيل لتكون جاهزة للنزيل التالي.</li>
      <li>اختبار ميداني شامل: خدمة طاولة كاملة من الاستقبال حتى التطهير والمغادرة.</li>
    </ul>
  </div>

</body>
</html>`;

// 2. نموذج التعريف
const orientationHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>نموذج التعريف والتهيئة للموظف الجديد — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; line-height: 1.4; margin: 0; padding: 5px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 8px; margin-bottom: 12px; }
    .brand-logo { max-width: 85px; height: auto; border-radius: 4px; margin-bottom: 2px; }
    .title { font-size: 16pt; font-weight: 800; color: #1F4E78; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt; }
    th, td { border: 1px solid #CBD5E0; padding: 6px; text-align: right; }
    th { background-color: #1F4E78; color: white; text-align: center; }
    .check-box { width: 20px; text-align: center; font-weight: bold; }
    .sig-table { margin-top: 15px; width: 100%; }
    .sig-table td { width: 50%; vertical-align: top; background: #F8FAFC; padding: 8px; }
  </style>
</head>
<body>

  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
    <div style="font-size: 11pt; font-weight: bold; color: #78350f;">H E N U  H O T E L  P Y R A M I D S</div>
    <div class="title">استمارة تعريف وتهيئة الموظف الجديد (Employee Orientation Sheet)</div>
  </div>

  <table>
    <tr>
      <td><strong>اسم الموظف:</strong> .....................................................</td>
      <td><strong>الوظيفة / القسم:</strong> .....................................................</td>
    </tr>
    <tr>
      <td><strong>تاريخ استلام العمل:</strong> ..... / ..... / 2026م</td>
      <td><strong>اسم المشرف المباشر:</strong> .....................................................</td>
    </tr>
  </table>

  <h3 style="color: #1F4E78; font-size: 10.5pt; margin-top: 10px; margin-bottom: 5px;">📋 قائمة مراجعة التعريف اليوم الأول:</h3>

  <table>
    <thead>
      <tr>
        <th style="width: 8%;">تم</th>
        <th style="width: 42%;">عنصر التهيئة والتعريف</th>
        <th style="width: 50%;">ملاحظات وتفاصيل التوضيح</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="check-box">☐</td>
        <td><strong>الجولة التعريفية بالمشروع:</strong></td>
        <td>التعرف على الأدوار، الاستقبال، الغرف، المطعم، والمخازن.</td>
      </tr>
      <tr>
        <td class="check-box">☐</td>
        <td><strong>التعريف بفريق العمل:</strong></td>
        <td>التقديم لزملاء القسم والمدير المسؤول.</td>
      </tr>
      <tr>
        <td class="check-box">☐</td>
        <td><strong>تسليم الزي الرسمي (Uniform):</strong></td>
        <td>تسليم طقم الزي والعهد الخاصة بالوظيفة.</td>
      </tr>
      <tr>
        <td class="check-box">☐</td>
        <td><strong>شرح مواعيد الشفتات والراحة:</strong></td>
        <td>شرح مواعيد الوردية، مواعيد وجبة الإفطار، وأيام الراحة.</td>
      </tr>
      <tr>
        <td class="check-box">☐</td>
        <td><strong>شرح اللائحة وقواعد الانضباط:</strong></td>
        <td>قواعد المظهر، النظافة الشخصية، وحظر التدخين أمام النزلاء.</td>
      </tr>
      <tr>
        <td class="check-box">☐</td>
        <td><strong>شرح نظام التقييم والـ KPIs (25%):</strong></td>
        <td>شرح معايير التقييم الشهري ونسبة استحقاق الحافز.</td>
      </tr>
      <tr>
        <td class="check-box">☐</td>
        <td><strong>تسليم الدليل التشغيلي و الـ SOPs:</strong></td>
        <td>تسليم نسخة الوصف الوظيفي وإجراءات العمل الخاصة به.</td>
      </tr>
      <tr>
        <td class="check-box">☐</td>
        <td><strong>قواعد السلامة والأمان:</strong></td>
        <td>شرح أماكن طفايات الحريق، الخروج في الطوارئ، والإسعافات.</td>
      </tr>
    </tbody>
  </table>

  <table class="sig-table">
    <tr>
      <td>
        <strong>إقرار الموظف الجديد:</strong><br>
        أقر أنا الموظف المذكور أعلاه بأنني استلمت كافة أدوات العمل ودليل الوظيفة وقمت بالجولة التعريفية وفهمت كافة التعليمات واللوائح.<br><br>
        <strong>التوقيع:</strong> ...................................................<br>
        <strong>التاريخ:</strong> ..... / ..... / 2026م
      </td>
      <td>
        <strong>اعتماد المسؤول / المدير:</strong><br>
        تم تنفيذ برنامج التعريف والتهيئة للموظف بنجاح وتم تسليمه لمقره العملي وبدء برنامج التدريب الـ 3 أيام.<br><br>
        <strong>توقيع المشرف:</strong> ...................................................<br>
        <strong>اعتماد مدير الفندق:</strong> ...................................................
      </td>
    </tr>
  </table>

</body>
</html>`;

// 3. قوائم الفحص Checklists
const checklistsHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>قوائم الفحص والتفتيش اليومي — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; line-height: 1.4; margin: 0; padding: 5px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 6px; margin-bottom: 10px; }
    .brand-logo { max-width: 80px; height: auto; border-radius: 4px; }
    .title { font-size: 16pt; font-weight: 800; color: #1F4E78; }
    .section-box { border: 1px solid #CBD5E0; border-radius: 6px; padding: 8px; margin-bottom: 10px; background: #FFFFFF; }
    .box-title { font-size: 10.5pt; font-weight: 700; color: #FFFFFF; background: #1F4E78; padding: 4px 10px; border-radius: 4px; margin-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
    th, td { border: 1px solid #E2E8F0; padding: 4px 6px; text-align: right; }
    th { background: #EDF2F7; text-align: center; color: #2D3748; }
    .chk { text-align: center; width: 25px; font-weight: bold; }
  </style>
</head>
<body>

  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
    <div style="font-size: 10pt; font-weight: bold; color: #78350f;">H E N U  H O T E L  P Y R A M I D S</div>
    <div class="title">قوائم الفحص والتفتيش اليومي (Daily Operational Checklists)</div>
  </div>

  <div class="section-box">
    <div class="box-title">1️⃣ قائمة فحص وتسليم وردية الاستقبال (Front Office Shift Handover Checklist)</div>
    <table>
      <thead>
        <tr><th class="chk">حالة</th><th>بند التفتيش والمراجعة</th><th>التفاصيل والملاحظات</th></tr>
      </thead>
      <tbody>
        <tr><td class="chk">☐</td><td>مراجعة كشف الحجوزات اليومية والتسكين المتوقع</td><td>التأكد من جاهزية الغرف المطلوبة.</td></tr>
        <tr><td class="chk">☐</td><td>تطابق حالة الخزينة والتحصيل النقدي والفيزا</td><td>مراجعة الفواتير بدون أي عجز مالي.</td></tr>
        <tr><td class="chk">☐</td><td>مراجعة وتسجيل بيانات الجوازات والبطاقات</td><td>رفع البيانات للجهات المعنية وتحديث النظام.</td></tr>
        <tr><td class="chk">☐</td><td>التأكد من نظافة منطقة الاستقبال والمدخل</td><td>مظهر لائق وترحاب دائم بالنزلاء.</td></tr>
        <tr><td class="chk">☐</td><td>تسليم الملاحظات والطلبات الخاصة لوردية التالية</td><td>تدوين أي طلبات معلقة للنزلاء وتأكيدها.</td></tr>
      </tbody>
    </table>
  </div>

  <div class="section-box">
    <div class="box-title" style="background: #38A169;">2️⃣ قائمة فحص وتفتيش نظافة الغرفة والحمام (Housekeeping Room Checklist)</div>
    <table>
      <thead>
        <tr><th class="chk">حالة</th><th>بند التفتيش (الغرفة رقم: ......)</th><th>المعيار القياسي الفندقي</th></tr>
      </thead>
      <tbody>
        <tr><td class="chk">☐</td><td>السرير والمفروشات</td><td>ملاءات ناصعة النظافة ومشدودة تماماً وبدون أي تجاعيد.</td></tr>
        <tr><td class="chk">☐</td><td>الحمام والدش والتواليت</td><td>معقم، جاف بالكامل، والمرايا تلمع خالية من البقع.</td></tr>
        <tr><td class="chk">☐</td><td>الفوط والمستلزمات</td><td>طقم فوط نظيف ومطوي + صابون وشامبو جديد.</td></tr>
        <tr><td class="chk">☐</td><td>الأرضيات والغبار</td><td>خالية تماماً من الأتربة والشعر تحت السرير وفي الأركان.</td></tr>
        <tr><td class="chk">☐</td><td>الأجهزة والتكييف والريموت</td><td>التكييف يعمل بكفاءة والريموت والإضاءة شغالين.</td></tr>
        <tr><td class="chk">☐</td><td>الرائحة والإنهاء</td><td>رائحة جو زكية، رش المعطر، وإغلاق الباب بإحكام.</td></tr>
      </tbody>
    </table>
  </div>

  <div class="section-box">
    <div class="box-title" style="background: #D9822B;">3️⃣ قائمة فحص افتتاح واغلاق المطعم والكافيه (F&B Service Checklist)</div>
    <table>
      <thead>
        <tr><th class="chk">حالة</th><th>بند التفتيش والمراجعة</th><th>التفاصيل والملاحظات</th></tr>
      </thead>
      <tbody>
        <tr><td class="chk">☐</td><td>نظافة وتطهير الصالة والطاولات والأسطح</td><td>تأكيد مسح الطاولات والكراسي وتجهيز المفرش.</td></tr>
        <tr><td class="chk">☐</td><td>جاهزية وسخونة بوفيه الإفطار المكونات</td><td>التأكد من سخونة الوجبات ونظافة أواني التقديم.</td></tr>
        <tr><td class="chk">☐</td><td>المظهر ونظافة فريق الخدمة (الويترية)</td><td>الزي الرسمي النظيف وحلاقة الذقن والابتسامة.</td></tr>
        <tr><td class="chk">☐</td><td>سرعة رفع الأطباق الفارغة وتطهير الطاولات</td><td>إخلاء الطاولات فور المغادرة لتجهيزها مجدداً.</td></tr>
        <tr><td class="chk">☐</td><td>تقفيل الحسابات والمبيعات ومراجعة الجرد</td><td>تسليم إيراد الوردية ومراجعة المخزون.</td></tr>
      </tbody>
    </table>
  </div>

</body>
</html>`;

const docs = [
  {
    htmlPath: path.join(folderTraining, 'خطة_التدريب_الـ3_أيام_لجميع_المحطات.html'),
    pdfPath: path.join(folderTraining, 'خطة_التدريب_الـ3_أيام_لجميع_المحطات.pdf'),
    content: trainingHtml
  },
  {
    htmlPath: path.join(folderChecklists, 'نموذج_التعريف_والتهيئة_Orientation_Sheet.html'),
    pdfPath: path.join(folderChecklists, 'نموذج_التعريف_والتهيئة_Orientation_Sheet.pdf'),
    content: orientationHtml
  },
  {
    htmlPath: path.join(folderChecklists, 'قوائم_الفحص_والتفتيش_Checklists_جميع_الأقسام.html'),
    pdfPath: path.join(folderChecklists, 'قوائم_الفحص_والتفتيش_Checklists_جميع_الأقسام.pdf'),
    content: checklistsHtml
  }
];

docs.forEach(doc => {
  fs.writeFileSync(doc.htmlPath, doc.content, 'utf8');
  console.log(`Saved HTML: ${doc.htmlPath}`);
  convertHtmlToPdf(doc.htmlPath, doc.pdfPath);
});

console.log('\n✨ ALL TRAINING PLANS, ORIENTATION SHEETS & CHECKLISTS UPDATED WITH BRAND LOGO SUCCESSFULLY!');
