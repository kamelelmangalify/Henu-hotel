const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join('d:', 'Henu');

// قراءة الشعار
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
  console.log(`Generating PDF: ${path.basename(pdfPath)}...`);
  try {
    execSync(cmd, { encoding: 'utf8' });
    console.log(`✅ PDF Created: ${pdfPath}`);
  } catch (err) {
    console.error(`❌ PDF failed for ${pdfPath}:`, err.message);
  }
}

// ----------------------------------------------------
// 1. توليد وثيقة سياسة وإجراءات إدارة النقدية الخزينة (Cash Policy PDF)
// ----------------------------------------------------
const cashPolicyHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>سياسة وإجراءات إدارة النقدية والخزينة — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 12mm 15mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; line-height: 1.6; margin: 0; padding: 5px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 10px; margin-bottom: 15px; }
    .brand-logo { max-width: 90px; height: auto; border-radius: 6px; margin-bottom: 4px; }
    .hotel-name { font-size: 14pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 18pt; font-weight: 800; color: #1F4E78; margin-top: 4px; }
    .subtitle { font-size: 10.5pt; color: #4a5568; margin-top: 2px; }
    .section-title { font-size: 12pt; font-weight: 700; color: #1F4E78; background: #EDF2F7; border-right: 5px solid #b45309; padding: 5px 10px; margin-top: 15px; margin-bottom: 8px; }
    .card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px; margin-bottom: 10px; font-size: 9.5pt; }
    ul, ol { padding-right: 20px; margin: 4px 0; }
    li { margin-bottom: 5px; }
    .alert-box { background-color: #FEF3C7; border-right: 4px solid #b45309; padding: 8px 12px; font-size: 9pt; margin: 10px 0; border-radius: 4px; color: #78350f; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 9pt; }
    th, td { border: 1px solid #CBD5E0; padding: 6px; text-align: right; }
    th { background: #1F4E78; color: white; text-align: center; }
  </style>
</head>
<body>

  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">الدورة المستندية وسياسة إدارة النقدية والخزينة (Cash Policy & Procedures)</div>
    <div class="subtitle">الضوابط والتعليمات المالية المعتمدة لإدارة المقبوضات والنثريات وحوكمة الخزينة (25 غرفة)</div>
  </div>

  <div class="alert-box">
    <strong>📌 أهداف السياسة المالية:</strong> حماية الأصول النقدية للفندق، ضبط حركة التوريد والصرف، إحكام الرقابة على خزينة الاستقبال والكافيه، ومنع أي فروقات أو عجز مالي.
  </div>

  <div class="section-title">1️⃣ سياسة مقبوضات النزلاء وإيراد التسكين (Cash Inflow & Guest Receipts)</div>
  <div class="card">
    <ol>
      <li><strong>إصدار إيصال النقدية الفوري:</strong> يُحظر حظراً قاطعاً استلام أي مبالغ نقدية أو تحويلات بالفيزا من أي نزيل دون إصدار إيصال سداد رسمي معتمد فوراً من برنامج الفندق أو دفتر الإيصالات المعتمد.</li>
      <li><strong>توقيع وختم الإيصال:</strong> يُسلم أصل الإيصال المعتمد للنزيل وتُحفظ النسخة الثانية بالخزينة لإرفاقها بكشف تقفيل الوردية.</li>
      <li><strong>مراجعة التحصيل بالفيزا والشبكة:</strong> يُطابق موظف الاستقبال إجمالي شريط ماكينة الـ POS (الفيزا) مع القيمة المسجلة على النظام قبل إنهاء الوردية.</li>
    </ol>
  </div>

  <div class="section-title">2️⃣ سياسة وسقف العهدة المستديمة والنثريات (Petty Cash Policy)</div>
  <div class="card">
    <ul>
      <li><strong>حد العهدة النثرية (Petty Cash Limit):</strong> تُرصد عهدة نثرية للطوارئ والمشتريات السريعة بمبلغ أقصاه <strong>( 3,000 جنيه مصري )</strong> تحت مسؤولية مدير الفندق أو الموظف المفوض.</li>
      <li><strong>شروط إذن الصرف:</strong> لا يُصرف أي مبلغ من النثريات إلا بموجب <strong>(إذن صرف نقدية معتمد)</strong> مرفق به الفاتورة الضريبية الأصلية أو إيصال الشراء المعتمد.</li>
      <li><strong>سقف الصرف النقدي المفرد:</strong> لا يتعدى قيمة إذن الصرف الواحد من النثريات مبلغ <strong>( 500 جنيه مصري )</strong>، وما زاد عن ذلك يتطلب موافقة كتابية صريحة مسبقة من الإدارة.</li>
    </ul>
  </div>

  <div class="section-title">3️⃣ ضوابط تقفيل الخزينة والجرد اليومي والفروقات المالية (Daily Cash Audit & Shortages)</div>
  <div class="card">
    <table>
      <thead>
        <tr>
          <th>الحالة المالية</th>
          <th>الإجراء الإداري والمعالجة المحاسبية القياسية</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>مطابقة الخزينة (Zero Variance)</strong></td>
          <td>اعتماد كشف تقفيل الوردية (Shift Closure Sheet) وتوريد النقدية للمحاسب أو الخزينة الرئيسية.</td>
        </tr>
        <tr>
          <td><strong>وجود عجز مالي (Cash Shortage)</strong></td>
          <td>يلتزم الموظف المستلم للوردية بسداد قيمة العجز فوراً كاش أو خصماً من راتبه الشهري، مع تدوين محضر عجز. وفي حال التكرار يُحال للتحقيق الإداري.</td>
        </tr>
        <tr>
          <td><strong>وجود زيادة مالية (Cash Surplus)</strong></td>
          <td>تُقيد الزيادة فوراً لحساب إيرادات متنوعة لصالح الفندق ولا يجوز للموظف الاحتفاظ بها أو ترحيلها.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section-title">4️⃣ توريد مبيعات المطعم والكافيه والتسليم اليومي</div>
  <div class="card">
    <ul>
      <li><strong>ميعاد التوريد اليومي:</strong> تُقفل حسابات المطعم والكافيه يومياً في تمام الساعة 11:00 مساءً.</li>
      <li><strong>محضر تسليم المبيعات:</strong> يسلم مشرف الكافيه النقدية وشريط المبيعات لموظف الاستقبال بموجب (محضر توريد مبيعات كافيه) متبادل التوقيع.</li>
    </ul>
  </div>

  <div class="section-title">5️⃣ أمان وحراسة الخزينة الحديدية وضوابط المفاتيح (Cash Safety Rules)</div>
  <div class="card">
    <ul>
      <li>تُحفظ النقدية داخل الخزينة الحديدية المشفرة والمصفحة بالفندق طوال 24 ساعة.</li>
      <li>يُحظر تماماً ترك مفتاح الخزينة أو الرقم السري مع أي شخص غير مفوض رسمياً.</li>
      <li>يتم تغيير الرقم السري للخزينة دورياً كل 3 أشهر أو فور تغيير الموظفين المسؤولين.</li>
    </ul>
  </div>

  <div style="margin-top: 15px; font-size: 8.5pt; text-align: center; color: #718096;">
    تعتبر هذه السياسة نافذة ومكفولة التطبيق فور اعتمادها من إدارة فندق هينو الأهرامات.
  </div>

</body>
</html>`;

// ----------------------------------------------------
// 2. توليد دليل وخريطة توزيع الملفات والمستندات (Folder Map PDF)
// ----------------------------------------------------
const sitemapHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>خريطة توزيع الملفات والمستندات — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 12mm 15mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; line-height: 1.5; margin: 0; padding: 5px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 10px; margin-bottom: 15px; }
    .brand-logo { max-width: 85px; height: auto; border-radius: 4px; }
    .hotel-name { font-size: 13pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 17pt; font-weight: 800; color: #1F4E78; margin-top: 3px; }
    .folder-card { background: #FFFFFF; border: 1px solid #CBD5E0; border-right: 5px solid #1F4E78; border-radius: 6px; padding: 12px; margin-bottom: 12px; font-size: 9.5pt; }
    .folder-name { font-size: 11pt; font-weight: 800; color: #1F4E78; margin-bottom: 6px; }
    ul { padding-right: 20px; margin: 4px 0; }
    li { margin-bottom: 4px; }
    .badge-pdf { background: #E53E3E; color: white; padding: 2px 6px; border-radius: 4px; font-size: 8pt; font-weight: bold; }
    .badge-excel { background: #38A169; color: white; padding: 2px 6px; border-radius: 4px; font-size: 8pt; font-weight: bold; }
  </style>
</head>
<body>

  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">دليل وخريطة توزيع الملفات والمستندات الرسمية (Directory Sitemap)</div>
    <div style="font-size: 9.5pt; color: #4a5568;">هيكلة الملفات المعتمدة داخل المجلد الرئيسي D:\\Henu للوصول السريع والمنظم</div>
  </div>

  <!-- 01 النظام المحاسبي -->
  <div class="folder-card">
    <div class="folder-name">📁 01_Accounting_System (النظام المحاسبي والماليات)</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>جدول_رواتب_وتقييم_الموظفين_الشهري.xlsx:</strong> كشف رواتب الـ 30 موظفاً وشيتات الـ KPIs اليومية المربوطة وكشف الحضور العرضي المطبوع.</li>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل الايرادات والمصروفات.xlsx:</strong> سجل حركة الإيرادات اليومية ومصروفات الكافيه والفندق.</li>
      <li><span class="badge-excel">EXCEL</span> <strong>كشف_حضور_وانصراف_أسبوعي_بالتوقيعات.xlsx:</strong> كشف توقيعات الحضور والانصراف الأسبوعي A4 Landscape.</li>
      <li><span class="badge-excel">EXCEL</span> <strong>مصاريف_الأستاذ_خالد.xlsx:</strong> عهدة ومصروفات الكافيه والمأكولات.</li>
      <li><span class="badge-pdf">PDF</span> <strong>سياسة_النقدية_والتعامل_مع_الخزينة_Cash_Policy.pdf:</strong> الدورة المستندية والسياسة المالية لإدارة النقدية والخزينة.</li>
      <li><span class="badge-pdf">PDF</span> <strong>تقرير_مصروفات_الأستاذ_خالد.pdf:</strong> التقرير المالي المعتمد لمصروفات الكافيه.</li>
    </ul>
  </div>

  <!-- 02 العقود والقانونية -->
  <div class="folder-card" style="border-right-color: #D9822B;">
    <div class="folder-name">📁 02_Contracts_and_Legal (العقود والشؤون القانونية)</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <strong>عقد_عمل_مؤقت_وتعهد_فندقي.pdf:</strong> عقد العمل الموحد المحدث ببند الـ (75% أساسي + 25% حافز أداء).</li>
      <li><span class="badge-pdf">PDF</span> <strong>عقد_تشغيل_أطفال_وموافقة_ولي_الأمر.pdf:</strong> عقد تشغيل القصر المعتمد من مكتب العمل وضوابطه.</li>
      <li><span class="badge-pdf">PDF</span> <strong>اتفاقية_تدريب_ثلاثية_مدرسة_ستارز_وهينو.pdf:</strong> اتفاقية الشراكة والتدريب الفندقي مع مدرسة ستارز.</li>
      <li><span class="badge-pdf">PDF</span> <strong>عقد ايجارالفندق.pdf:</strong> عقد الإيجار الرسمي لمنشأة الفندق.</li>
    </ul>
  </div>

  <!-- 04 الحجوزات والمفروشات -->
  <div class="folder-card" style="border-right-color: #38A169;">
    <div class="folder-name">📁 04_Hotel_Booking_System (نظام الحجوزات وحصر الغرف)</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>حصر_غرف_ومفروشات_الفندق.xlsx:</strong> شيت حصر الـ 25 غرفة والـ 28 سريراً وكميات الكتانيات والفوط بالظبط (Par Level).</li>
    </ul>
  </div>

  <!-- 05 التدريب والتطوير -->
  <div class="folder-card" style="border-right-color: #805AD5;">
    <div class="folder-name">📁 التدريب والتطوير (حقيبة التدريب والـ SOPs)</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <strong>الوصف_الوظيفي_والتقييم_والإجراءات_الاستقبال.pdf:</strong> حقيبة الاستقبال.</li>
      <li><span class="badge-pdf">PDF</span> <strong>عامل_النظافة_الوصف_والتقييم_والإجراءات.pdf & مشرفة_الغرف.pdf:</strong> حقيبة الغرف والإشراف.</li>
      <li><span class="badge-pdf">PDF</span> <strong>مقدم_الخدمة_الويتر_الوصف.pdf & مشرف_ومدير_المطعم.pdf:</strong> حقيبة المطعم والكافيه.</li>
      <li><span class="badge-pdf">PDF</span> <strong>الدليل_التشغيلي_والإداري_الشامل_للفندق.pdf:</strong> الدليل التشغيلي الموحد للفندق.</li>
      <li><span class="badge-pdf">PDF</span> <strong>خطة_التدريب_الـ3_أيام_لجميع_المحطات.pdf:</strong> برامج التدريب الميداني السريعة.</li>
      <li><span class="badge-pdf">PDF</span> <strong>استمارة_التقييم_اليومي_الميداني_للاستطاف.pdf:</strong> استمارة رصد التقييم اليومي المطبوعة للمشرفين.</li>
    </ul>
  </div>

</body>
</html>`;

// ----------------------------------------------------
// حفظ وتحويل الوثائق إلى PDF
// ----------------------------------------------------
const cashPolicyHtmlPath = path.join(rootDir, '01_Accounting_System', 'سياسة_النقدية_والتعامل_مع_الخزينة_Cash_Policy.html');
const cashPolicyPdfPath = path.join(rootDir, '01_Accounting_System', 'سياسة_النقدية_والتعامل_مع_الخزينة_Cash_Policy.pdf');

const sitemapHtmlPath = path.join(rootDir, 'خريطة_توزيع_الملفات_والمستندات.html');
const sitemapPdfPath = path.join(rootDir, 'خريطة_توزيع_الملفات_والمستندات.pdf');

fs.writeFileSync(cashPolicyHtmlPath, cashPolicyHtml, 'utf8');
fs.writeFileSync(sitemapHtmlPath, sitemapHtml, 'utf8');

convertHtmlToPdf(cashPolicyHtmlPath, cashPolicyPdfPath);
convertHtmlToPdf(sitemapHtmlPath, sitemapPdfPath);

// ----------------------------------------------------
// 3. تنظيف وترتيب مجلدات العمل لتصبح محتوية فقط على PDF و EXCEL و WORD
// ----------------------------------------------------
const sourceArchiveDir = path.join(rootDir, '_sources_and_html');
if (!fs.existsSync(sourceArchiveDir)) fs.mkdirSync(sourceArchiveDir, { recursive: true });

function archiveLooseSourceFiles(dirPath) {
  const items = fs.readdirSync(dirPath);
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '.git' && item !== '_sources_and_html') {
        archiveLooseSourceFiles(fullPath);
      }
    } else {
      const ext = path.extname(item).toLowerCase();
      // إذا كان الملف html أو md في مجلدات العمل المستندات، ننقله للأرشيف لتكون المجلدات تحتوي على PDF و EXCEL و WORD فقط
      if ((ext === '.html' || ext === '.md') && !item.startsWith('README') && !item.includes('خريطة_توزيع')) {
        const relativePath = path.relative(rootDir, fullPath);
        const destPath = path.join(sourceArchiveDir, relativePath);
        const destFolder = path.dirname(destPath);
        if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
        try {
          fs.renameSync(fullPath, destPath);
          console.log(`Archived loose source file: ${relativePath} -> _sources_and_html`);
        } catch (e) {
          // ignore lock
        }
      }
    }
  });
}

archiveLooseSourceFiles(rootDir);

console.log('\n✨ CASH POLICY & SITEMAP GENERATED AND DIRECTORIES ORGANIZED CLEANLY!');
