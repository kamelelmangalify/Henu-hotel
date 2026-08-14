const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('Starting Tripartite Contract HTML & PDF Generation...');

const logoPath = path.join('d:', 'Henu', '02_Contracts_and_Legal', 'شعار_الفندق_عقود.jpg');
let logoDataUrl = '';

if (fs.existsSync(logoPath)) {
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  logoDataUrl = `data:image/jpeg;base64,${logoBase64}`;
  console.log('Logo image read and converted to Base64.');
} else {
  console.log('Logo image not found at:', logoPath);
}

// HTML template with CSS print rules
const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>اتفاقية تدريب ثلاثية مشتركة - فندق هينو ومدرسة ستارز</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    
    @page {
      size: A4;
      margin: 12mm 15mm 12mm 15mm;
    }

    body {
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
      color: #1f2937;
      line-height: 1.6;
      margin: 0;
      padding: 5px;
      background-color: #ffffff;
      direction: rtl;
    }

    .contract-container {
      border: 3px double #b45309;
      padding: 25px 30px;
      border-radius: 6px;
      background-color: #fff;
    }

    .brand-header {
      text-align: center;
      border-bottom: 2px double #b45309;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }

    .brand-logo {
      max-width: 110px;
      height: auto;
      border-radius: 4px;
      margin-bottom: 4px;
    }

    .hotel-name-en {
      font-size: 15pt;
      font-weight: 800;
      letter-spacing: 2px;
      color: #78350f;
      text-transform: uppercase;
      margin: 2px 0 0 0;
    }

    .hotel-name-ar {
      font-size: 13pt;
      font-weight: 700;
      color: #92400e;
      margin: 0 0 6px 0;
    }

    .doc-title {
      font-size: 18pt;
      color: #1e3a8a;
      margin: 10px 0 4px 0;
      font-weight: 800;
    }

    .doc-subtitle {
      font-size: 12pt;
      color: #4b5563;
      margin: 0;
      font-weight: 600;
    }

    .meta-line {
      font-size: 10pt;
      color: #6b7280;
      margin-top: 6px;
    }

    .parties-section {
      margin-bottom: 18px;
    }

    .party-card {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-right: 4px solid #b45309;
      padding: 10px 14px;
      margin-bottom: 10px;
      border-radius: 4px;
    }

    .party-title {
      font-size: 11pt;
      font-weight: 700;
      color: #78350f;
      margin: 0 0 6px 0;
    }

    .party-details {
      font-size: 9.5pt;
      margin: 3px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }

    .party-details span {
      display: inline-block;
    }

    .preamble {
      background-color: #fffbeb;
      border: 1px solid #fef3c7;
      padding: 12px 15px;
      border-radius: 4px;
      font-size: 9.5pt;
      text-align: justify;
      margin-bottom: 20px;
    }

    .preamble-title {
      font-weight: 700;
      color: #78350f;
      margin-bottom: 4px;
    }

    .article {
      margin-bottom: 16px;
    }

    .article-title {
      font-size: 11pt;
      font-weight: 700;
      color: #1e3a8a;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 3px;
      margin-bottom: 8px;
    }

    .article-text {
      font-size: 9.5pt;
      text-align: justify;
      margin: 0 0 8px 0;
    }

    .article-list {
      margin: 0 0 8px 0;
      padding-right: 20px;
      font-size: 9.5pt;
    }

    .article-list li {
      margin-bottom: 4px;
    }

    .important-alert {
      background-color: #eff6ff;
      border-right: 4px solid #2563eb;
      padding: 8px 12px;
      font-size: 9pt;
      border-radius: 4px;
      margin: 8px 0;
      color: #1e40af;
    }

    .signatures-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 25px;
      page-break-inside: avoid;
    }

    .signatures-table td {
      width: 50%;
      border: 1px solid #e5e7eb;
      padding: 12px 15px;
      vertical-align: top;
      background-color: #fff;
    }

    .sig-header {
      font-weight: 700;
      color: #78350f;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 6px;
      margin-bottom: 10px;
      font-size: 10.5pt;
    }

    .sig-line {
      font-size: 9.5pt;
      margin: 8px 0;
    }

    .thumbprint-box {
      border: 1px dashed #9ca3af;
      width: 120px;
      height: 70px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      font-size: 8.5pt;
      border-radius: 4px;
    }
  </style>
</head>
<body>

  <div class="contract-container">
    
    <!-- Brand Header -->
    <div class="brand-header">
      ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
      <h3 class="hotel-name-en">H E N U  H O T E L</h3>
      <h4 class="hotel-name-ar">فندق هينو الأهرامات</h4>
      <h1 class="doc-title">اتفاقية تدريب ثلاثية مشتركة</h1>
      <h2 class="doc-subtitle">(إطار الشراكة الميدانية والتطوير المهني)</h2>
      <div class="meta-line">حرر هذا العقد بتاريخ: **.......................** الموافق: **..... / ..... / 2026م**</div>
    </div>

    <!-- Parties -->
    <div class="parties-section">
      <div class="party-card">
        <h3 class="party-title">الطرف الأول: الجهة التدريبية (الفندق)</h3>
        <div class="party-details">
          <span><strong>اسم المنشأة:</strong> فندق هينو (H E N U)</span>
          <span><strong>يمثله في التوقيع:</strong> السيد / .................................................</span>
          <span><strong>الصفة:</strong> مدير عام الفندق / الممثل المفوض</span>
        </div>
      </div>

      <div class="party-card">
        <h3 class="party-title">الطرف الثاني: الجهة التعليمية (المدرسة)</h3>
        <div class="party-details">
          <span><strong>اسم المؤسسة:</strong> مدرسة ستارز الفندقية</span>
          <span><strong>يمثلها في التوقيع:</strong> السيد / ................................................</span>
          <span><strong>الصفة:</strong> مدير المدرسة / الممثل القانوني</span>
        </div>
      </div>

      <div class="party-card">
        <h3 class="party-title">الطرف الثالث: الطالب المتدرب (وضامنه ولي أمره بالتضامن)</h3>
        <div class="party-details">
          <span><strong>اسم الطالب:</strong> ................................................................</span>
          <span><strong>الرقم القومي:</strong> ..........................................................</span>
          <span><strong>تاريخ الميلاد:</strong> ..... / ..... / .........م</span>
        </div>
        <div class="party-details" style="margin-top: 5px; border-top: 1px dashed #e5e7eb; padding-top: 5px;">
          <span><strong>اسم ولي الأمر للضمان:</strong> ........................................................</span>
          <span><strong>الرقم القومي لولي الأمر:</strong> ...................................................</span>
          <span><strong>العلاقة والصفة:</strong> ولي الأمر الشرعي</span>
        </div>
      </div>
    </div>

    <!-- Preamble -->
    <div class="preamble">
      <div class="preamble-title">تمهيد وتفسير:</div>
      حيث إن الطرف الأول يمتلك ويدير منشأة سياحية فندقية مرخصة (فندق هينو الأهرامات) ويهدف لرفع كفاءة الطلاب السياحية وتأمين متطلبات التشغيل بعمالة فنية نشيطة ومجربة، وحيث إن الطرف الثاني مؤسسة تعليمية فنية مرخصة لتخريج وتدريب كوادر الضيافة وتطوير مخرجات التعليم فندقية، وحيث إن الطرف الثالث يرغب بالالتحاق بالتدريب العملي؛ فقد توافقت إرادة الأطراف الثلاثة على ما يلي:
    </div>

    <!-- Articles -->
    <div class="article">
      <div class="article-title">المادة الأولى: التمهيد وتفسير الأهداف</div>
      <p class="article-text">يُعتبر التمهيد السابق جزءاً أساسياً لا يتجزأ من هذه الاتفاقية ومرجعاً لتفسير بنودها وتطبيق أحكامها.</p>
    </div>

    <div class="article">
      <div class="article-title">المادة الثانية: مدة التدريب والبرنامج التشغيلي</div>
      <p class="article-text">1. تبدأ فترة التدريب الفعلي من تاريخ استلام العمل في: **..... / ..... / 2026م** وتنتهي تلقائياً في: **..... / ..... / 2026م** (المدة الإجمالية للتدريب: 3 أشهر).</p>
      <p class="article-text">2. **خطة التدريب الدوارة:** يلتزم الطالب بالدوران على الأقسام الثلاثة بمعدل (3 أيام) لكل قسم:</p>
      <ul class="article-list">
        <li>**قسم الاستقبال (Front Office):** مبادئ الترحيب بالنزلاء، استخدام الهواتف، وبروتوكول خدمة العملاء.</li>
        <li>**قسم الإشراف الداخلي (Housekeeping):** نظافة الغرف، الترتيب الفندقي، فحص الجودة والمغسلة.</li>
        <li>**قسم الخدمة والصالة (Service):** قواعد الإتيكيت والتقديم وخدمة الغرف (Room Service).</li>
      </ul>
      <p class="article-text">3. **مرحلة التخصص:** بعد انتهاء 9 أيام التدوير، يتم اختيار قسم واحد لتثبيت الطالب لبقية فترة التدريب بناءً على رغبته وأدائه بالفندق.</p>
      <p class="article-text">4. **ساعات العمل:** يلتزم الطالب بجدول الشفتات المحدد من الفندق بما لا يتجاوز 8 ساعات يومياً مع توفير الراحات المناسبة.</p>
    </div>

    <div class="article">
      <div class="article-title">المادة الثالثة: التزامات ومزايا فندق هينو (الطرف الأول)</div>
      <p class="article-text">1. يلتزم الفندق بتوفير مشرف تدريب مؤهل لمتابعة أداء الطالب وصقل مهاراته العملية وتوجيهه مهنياً.</p>
      <p class="article-text">2. يمنح الفندق الطالب مكافأة تشجيعية شهرية قدرها **( ........................ جنيه مصري )** تدفع بنهاية كل شهر ميلادي.</p>
      <p class="article-text">3. يلتزم الفندق بتقديم **وجبة غذائية واحدة مجانية** يومياً خلال ساعات التدريب، وتوفير **الزي الرسمي (Uniform)** الخاص بالقسم مجاناً.</p>
      <p class="article-text">4. عند انتهاء التدريب بنجاح، يُمنح الطالب شهادة تدريب وخبرة معتمدة من الفندق والمدرسة لتعزيز ملف توظيفه.</p>
    </div>

    <div class="article">
      <div class="article-title">المادة الرابعة: التزامات مدرسة ستارز الفندقية (الطرف الثاني)</div>
      <p class="article-text">1. تلتزم المدرسة بترشيح صفوة طلابها الملتزمين سلوكياً وأكاديمياً لخوض البرنامج التدريبي.</p>
      <p class="article-text">2. توفير مشرف دراسي يقوم بزيارات تفقدية دورية للفندق لمتابعة سجل الحضور والسلوك المهني للطلاب بالتنسيق مع الفندق.</p>
      <p class="article-text">3. تلتزم المدرسة باعتماد أي عقوبة تأديبية أو استبعاد للطلاب الصادرة من إدارة الفندق وتثبيتها في ملف الطالب الدراسي لدعم انضباط العمل.</p>
    </div>

    <div class="article">
      <div class="article-title">المادة الخامسة: التزامات المتدرب وولي أمره (الطرف الثالث بالتضامن)</div>
      <p class="article-text">1. الالتزام بالتعليمات الفندقية وقواعد الانضباط والمظهر الفندقي وحلاقة اللحية والشعر والحضور في الموعد المحدد للشفت.</p>
      <p class="article-text">2. يلتزم المتدرب بالمحافظة التامة على عهده وممتلكات الفندق وخصوصية النزلاء. **ويقر ولي الأمر بالمسؤولية التضامنية والمدنية الكاملة عن تعويض الفندق مادياً عن أي تلفيات أو ضياع للعهدة بسبب إهمال أو تعمد المتدرب**.</p>
      <div class="important-alert">
        <strong>⚠️ تنبيه هام حول السرية الفندقية:</strong> يتعهد المتدرب بالمحافظة المطلقة على أسرار الفندق وبيانات النزلاء والأسعار. ويحظر تماماً التقاط صور داخل الفندق للنزلاء أو مرافق العمل أو تسريبها أو نشرها على منصات التواصل الاجتماعي. تعتبر المخالفة خرقاً جسيماً يوجب الاستبعاد الفوري والملاحقة القانونية.
      </div>
    </div>

    <div class="article">
      <div class="article-title">المادة السادسة: آلية التقييم والتصفية والاستبقاء</div>
      <p class="article-text">1. يتم تقييم المتدرب أسبوعياً بواسطة مشرف القسم بالفندق في نموذج التقييم المعتمد.</p>
      <p class="article-text">2. **الاستبعاد التلقائي:** للفندق الحق في إنهاء تدريب المتدرب واستبعاده فوراً في حالات: الغياب غير المبرر، عدم الجدية، خرق السرية، أو السلوك غير اللائق، ويُخطر الطرف الثاني بذلك كتابياً.</p>
      <p class="article-text">3. **الاستبقاء والتوظيف:** يمنح الفندق الطلاب الحاصلين على تقييم ممتاز بنهاية التدريب أولوية التعيين بعقود عمل مؤقتة أو دائمة فور تخرجهم.</p>
    </div>

    <div class="article">
      <div class="article-title">المادة السابعة: طبيعة الاتفاقية والنسخ</div>
      <p class="article-text">يقر المتدرب وولي أمره بأن هذا العقد هو عقد تدريب ميداني تعليمي مؤقت ولا يرتب على الفندق أي التزام بتشغيل دائم إلا بموجب عقد عمل منفصل لاحق للتخرج. وحررت هذه الاتفاقية من ثلاث نسخ أصلية للعمل بموجبها والالتزام.</p>
    </div>

    <!-- Signatures Table -->
    <table class="signatures-table">
      <tr>
        <td>
          <div class="sig-header">✍️ الطرف الأول (إدارة فندق هينو)</div>
          <div class="sig-line">الاسم: .....................................................</div>
          <div class="sig-line">التوقيع: ...................................................</div>
          <div class="sig-line">الصفة: مدير عام الفندق / صاحب العمل</div>
          <div style="height: 35px;">الختم:</div>
        </td>
        <td>
          <div class="sig-header">✍️ الطرف الثاني (إدارة مدرسة ستارز)</div>
          <div class="sig-line">الاسم: .....................................................</div>
          <div class="sig-line">التوقيع: ...................................................</div>
          <div class="sig-line">الصفة: مدير مدرسة ستارز الفندقية</div>
          <div style="height: 35px;">الختم:</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="sig-header">✍️ الطرف الثالث (الطالب المتدرب)</div>
          <div class="sig-line">الاسم: .....................................................</div>
          <div class="sig-line">التوقيع: ...................................................</div>
          <div class="sig-line">التاريخ: ..... / ..... / 2026م</div>
          <div class="thumbprint-box">بصمة الإبهام الأيمن للطالب</div>
        </td>
        <td>
          <div class="sig-header">✍️ إقرار وموافقة ولي الأمر (ضامن بالتضامن)</div>
          <div class="sig-line">الاسم: .....................................................</div>
          <div class="sig-line">التوقيع بصفتي ولي الأمر: ..............................</div>
          <div class="sig-line">الرقم القومي لولي الأمر: ..............................</div>
          <div class="thumbprint-box">بصمة إبهام ولي الأمر الضامن</div>
        </td>
      </tr>
    </table>

  </div>

</body>
</html>
`;

// Path to save HTML
const htmlPath = path.join('d:', 'Henu', '02_Contracts_and_Legal', 'اتفاقية_تدريب_ثلاثية_مدرسة_ستارز_وهينو.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML contract created successfully at:', htmlPath);

// Convert HTML to PDF using Microsoft Edge headless print-to-pdf
const pdfPath = path.join('d:', 'Henu', '02_Contracts_and_Legal', 'اتفاقية_تدريب_ثلاثية_مدرسة_ستارز_وهينو.pdf');

// Find standard Microsoft Edge installation paths in Windows
const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'msedge.exe' // system path fallback
];

let edgeCmd = '';
for (const p of edgePaths) {
  if (p === 'msedge.exe' || fs.existsSync(p)) {
    edgeCmd = p;
    break;
  }
}

if (!edgeCmd) {
  edgeCmd = 'msedge.exe'; // fallback to shell lookup
}

console.log('Using Microsoft Edge executable:', edgeCmd);

// Execute command to generate PDF from HTML
const edgeArgs = `--headless --disable-gpu --no-sandbox --print-to-pdf="${pdfPath}" "${htmlPath}"`;
const command = `& "${edgeCmd}" ${edgeArgs}`; // using PowerShell syntax

console.log('Running Edge PDF generation command...');
exec(`powershell -Command "${command.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
  if (error) {
    console.error('Error generating PDF:', error);
    console.error('Stderr:', stderr);
    process.exit(1);
  } else {
    console.log('PDF generated successfully at:', pdfPath);
    process.exit(0);
  }
});
