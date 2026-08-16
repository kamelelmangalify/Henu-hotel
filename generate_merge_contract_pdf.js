const fs = require('fs');
const path = require('path');
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

function generateMergedContractPdf() {
  const htmlPath = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_for_merge.html');
  const pdfPath = path.join(legalDir, 'عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_for_merge.pdf');

  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>عقد إيجار بنسيون فندقي — المطعم الأرجنتيني المتطور ونصر دسوقي</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 18mm 20mm; }
    body { font-family: 'Amiri', 'Tajawal', Arial, serif; color: #0f172a; line-height: 1.8; margin: 0; padding: 10px; direction: rtl; text-align: justify; }
    
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 12px; margin-bottom: 20px; }
    .basmala { font-size: 14pt; font-weight: bold; color: #78350F; margin-bottom: 5px; text-align: center; }
    .doc-title { font-size: 22pt; font-weight: bold; color: #1F4E78; margin-top: 5px; text-align: center; }
    .subtitle { font-size: 13pt; font-weight: bold; color: #D97706; text-align: center; }
    
    .party-box { background: #F8FAFC; border: 1px solid #CBD5E1; border-right: 6px solid #1F4E78; padding: 14px 16px; border-radius: 8px; margin-bottom: 14px; font-size: 12pt; text-align: right; }
    .party-box.tenant { border-right-color: #D97706; }
    
    .clause-title { font-size: 14pt; font-weight: bold; color: #1F4E78; margin-top: 18px; margin-bottom: 6px; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px; text-align: right; }
    
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

  <p><strong>إنه في يوم الأحد الموافق 2026/05/10م، تم الاتفاق والتراضي بين كل من:</strong></p>

  <div class="party-box">
    <strong style="color: #78350F; font-size: 13pt;">أولاً: السيد / نصر دسوقي عبد الحميد عبد الصمد</strong><br>
    المقيم في: شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، ويحمل بطاقة رقم قومي رقم <strong>(27210100010092)</strong>.<br>
    <span style="color: #1F4E78; font-weight: bold;">(طرف أول — مؤجر)</span>
  </div>

  <div class="party-box tenant">
    <strong style="color: #78350F; font-size: 13pt;">ثانياً: الشركة: المطعم الأرجنتيني المتطور لإدارة الفنادق والمطاعم</strong><br>
    بصفتها رئيس مجلس الإدارة <strong>السيد / محمد ممدوح عبد الحميد مرسي</strong>، ويحمل بطاقة رقم قومي رقم <strong>(2619000010259)</strong>، الكائنة بالمحل رقم (1) الدور الأرضي، 59 شارع 22 يوليو، الزمالك، قصر النيل، القاهرة.<br>
    <span style="color: #D97706; font-weight: bold;">(طرف ثاني — مستأجر)</span>
  </div>

  <p style="font-style: italic; color: #475569;">وبعد أن أقر الطرفان بأهليتهما الكاملة للتصرف والتعاقد خالية من أي جهالة أو عيب، اتفقا على البنود الآتية:</p>

  <div class="clause-title">البند التمهيدي (وصف العين المؤجرة وضمانات التشغيل):</div>
  <p>يمتلك الطرف الأول البنسيون الكائن في 21 شارع جمال عبد الناصر، نزلة السمان، الهرم، الجيزة، والذي يتكون من (مدخل للفندق + أربعة أدوار علوي + روف)، وهو بنسيون فندقي مكون من 27 غرفة مجهزة ومفروشة بالكامل ومستوفية للتشغيل. ولا يوجد على العين أي نزاع قضائي أو قانوني، كما يضمن أنه لا يوجد أي حقوق عينية للغير على العين أو أي عارض قانوني يمنع أو يعرقل أو يعطل التشغيل لأي سبب يكون ناتجاً عن تصرفات أو إدارة الطرف الأول أو أي مشغل أو مستأجر آخر. وفي حال طرأت أي معوقات أو قيود من أي جهة كانت (مهما كان نوعها أو مصدرها) أدت إلى توقف أو عرقلة ممارسة النشاط أو الحيلولة دون وصول الخدمة للعملاء بالشكل المتعارف عليه، يُعتبر ذلك إخلالاً جوهرياً بالالتزام بالتمكين من الانتفاع بالعين، ويحق للمستأجر في هذه الحالة فسخ العقد فوراً، واسترداد كافة المبالغ المدفوعة (تأمين وإيجار)، مع احتفاظه بكامل حقه في الرجوع على الطرف الأول بالتعويض الجابر لكافة الأضرار المادية والأدبية الناتجة عن توقف النشاط.</p>

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
          شركة المطعم الأرجنتيني المتطور (عنها/ محمد ممدوح مرسي)<br>
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
    <div style="font-size: 9pt; color: #4a5568;">النسخة الشاملة المزودة بعقد الإيجار المدمج (for merge) — 2026م</div>
  </div>

  <div class="folder-card" style="border-right-color: #D9822B;">
    <div class="folder-name">📁 02_Contracts_and_Legal (العقود واللوائح القانونية)</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <span class="badge-word">WORD</span> <strong>عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_for_merge.pdf / docx:</strong> عقد الإيجار المدمج النهائي (10 سنوات - 220,000 جـ - 27 غرفة).</li>
      <li><span class="badge-word">WORD</span> <span class="badge-pdf">PDF</span> <strong>عقد_إيجار_البنسيون_الرسمي_المطعم_الأرجنتيني_27غرفة.pdf / docx:</strong> النسخة الإيجارية الـ 20 بنداً.</li>
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

function main() {
  generateMergedContractPdf();
  updateSitemap();
  console.log('\n✨ MERGED CONTRACT PDF & SITEMAP GENERATED SUCCESSFULLY!');
}

main();
