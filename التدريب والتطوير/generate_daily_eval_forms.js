const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = path.join(__dirname);
const folderChecklists = path.join(baseDir, '06_استمارات_التعريف_والفحص');

if (!fs.existsSync(folderChecklists)) fs.mkdirSync(folderChecklists, { recursive: true });

// قراءة شعار الفندق الرسمي وتحويله لـ Base64
const logoPath = path.join('d:', 'Henu', '02_Contracts_and_Legal', 'شعار_الفندق_عقود.jpg');
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

// قائمة الـ 30 موظفاً الموزعين على أقسام الفندق
const employees = [
  // الاستقبال (6)
  { id: 'EMP-101', name: 'أحمد محمود علي', role: 'مشرف استقبال', dept: 'قسم الاستقبال والمكاتب الأمامية' },
  { id: 'EMP-102', name: 'محمد حسن إبراهيم', role: 'موظف استقبال نهار', dept: 'قسم الاستقبال والمكاتب الأمامية' },
  { id: 'EMP-103', name: 'عمر خالد فوزي', role: 'موظف استقبال ليل', dept: 'قسم الاستقبال والمكاتب الأمامية' },
  { id: 'EMP-104', name: 'نور الدين طارق', role: 'موظف استقبال', dept: 'قسم الاستقبال والمكاتب الأمامية' },
  { id: 'EMP-105', name: 'مريم عادل القاضي', role: 'مأمور علاقات نزلاء', dept: 'قسم الاستقبال والمكاتب الأمامية' },
  { id: 'EMP-106', name: 'مصطفى كمال الدين', role: 'مساعد استقبال', dept: 'قسم الاستقبال والمكاتب الأمامية' },

  // الإشراف الداخلي والغرف (12)
  { id: 'EMP-107', name: 'أميرة عبد العزيز', role: 'مشرفة الإشراف الداخلي', dept: 'قسم الإشراف الداخلي والغرف' },
  { id: 'EMP-108', name: 'سيد مصطفى طه', role: 'عامل غرف أول', dept: 'قسم الإشراف الداخلي والغرف' },
  { id: 'EMP-109', name: 'حسين علي كمال', role: 'عامل تنظيف غرف', dept: 'قسم الإشراف الداخلي والغرف' },
  { id: 'EMP-110', name: 'إبراهيم خليفة', role: 'عامل تنظيف غرف', dept: 'قسم الإشراف الداخلي والغرف' },
  { id: 'EMP-111', name: 'رمضان فتحي', role: 'عامل تنظيف غرف', dept: 'قسم الإشراف الداخلي والغرف' },
  { id: 'EMP-112', name: 'عاطف منصور', role: 'عامل تنظيف غرف', dept: 'قسم الإشراف الداخلي والغرف' },
  { id: 'EMP-113', name: 'حسن شحاتة', role: 'عامل غسيل وكتانيات', dept: 'قسم الإشراف الداخلي والغرف' },
  { id: 'EMP-114', name: 'زينب أحمد السيد', role: 'عامله نظافة أماكن عامة', dept: 'قسم الإشراف الداخلي والغرف' },
  { id: 'EMP-115', name: 'فاطمة محمود', role: 'عامله نظافة أماكن عامة', dept: 'قسم الإشراف الداخلي والغرف' },
  { id: 'EMP-116', name: 'محمود جابر', role: 'عامل نظافة ممرات', dept: 'قسم الإشراف الداخلي والغرف' },
  { id: 'EMP-117', name: 'علي عبد السميع', role: 'مساعد إشراف داخلي', dept: 'قسم الإشراف الداخلي والغرف' },
  { id: 'EMP-118', name: 'فتحي رجب', role: 'عامل نظافة وأماكن عامة', dept: 'قسم الإشراف الداخلي والغرف' },

  // المطعم والكافيه (8)
  { id: 'EMP-119', name: 'خالد رجب سلامة', role: 'مدير مطعم وكافيه', dept: 'قسم المطعم والكافيه والخدمة' },
  { id: 'EMP-120', name: 'طارق صلاح الدين', role: 'مشرف أغذية ومشروبات', dept: 'قسم المطعم والكافيه والخدمة' },
  { id: 'EMP-121', name: 'إسلام يوسف أحمد', role: 'ويتر كافيه رئيسي', dept: 'قسم المطعم والكافيه والخدمة' },
  { id: 'EMP-122', name: 'مصطفى ربيع جابر', role: 'ويتر كافيه', dept: 'قسم المطعم والكافيه والخدمة' },
  { id: 'EMP-123', name: 'وليد صبري', role: 'ويتر مطعم إفطار', dept: 'قسم المطعم والكافيه والخدمة' },
  { id: 'EMP-124', name: 'كريم شعبان', role: 'باريستا بائع كافيه', dept: 'قسم المطعم والكافيه والخدمة' },
  { id: 'EMP-125', name: 'سامح فاروق', role: 'مساعد ويتر تجهيز', dept: 'قسم المطعم والكافيه والخدمة' },
  { id: 'EMP-126', name: 'أحمد بدوي', role: 'عامل غسيل أطباق وتجهيز', dept: 'قسم المطعم والكافيه والخدمة' },

  // الصيانة والخدمات المعاونة (4)
  { id: 'EMP-127', name: 'المهندس تامر فؤاد', role: 'مشرف صيانة الفندق', dept: 'قسم الصيانة والخدمات المعاونة' },
  { id: 'EMP-128', name: 'جمال عبد المعطي', role: 'فني كهرباء وسباكة', dept: 'قسم الصيانة والخدمات المعاونة' },
  { id: 'EMP-129', name: 'رفعت عبد الصمد', role: 'سائق ومسؤول خدمات', dept: 'قسم الصيانة والخدمات المعاونة' },
  { id: 'EMP-130', name: 'صبحي عبد العال', role: 'مسؤول أمن وحراسة', dept: 'قسم الصيانة والخدمات المعاونة' }
];

// إنشاء HTML الاستمارة اليومية القابلة للطباعة
const dailyEvalHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>استمارة التقييم الميداني اليومي المطبوعة — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4 portrait; margin: 8mm 10mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; line-height: 1.3; margin: 0; padding: 2px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px double #b45309; padding-bottom: 4px; margin-bottom: 8px; }
    .brand-logo { max-width: 75px; height: auto; border-radius: 4px; }
    .hotel-name { font-size: 11pt; font-weight: 800; color: #78350f; letter-spacing: 1px; }
    .doc-title { font-size: 14pt; font-weight: 800; color: #1F4E78; margin-top: 2px; }
    .info-bar { display: flex; justify-content: space-between; background: #F8FAFC; border: 1px solid #CBD5E0; padding: 6px 10px; font-size: 8.5pt; font-weight: bold; margin-bottom: 8px; border-radius: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 8pt; margin-bottom: 10px; }
    th, td { border: 1px solid #A0AEC0; padding: 4px 5px; text-align: center; }
    th { background-color: #1F4E78; color: white; font-weight: bold; font-size: 8pt; }
    .dept-header { background-color: #EDF2F7; font-weight: bold; font-size: 9pt; color: #78350f; text-align: right; padding-right: 10px; }
    .kpi-col { width: 45px; }
    .score-cell { font-weight: bold; color: #2D3748; }
    .footer-note { font-size: 8pt; background: #FFFBEB; border: 1px solid #FCD34D; padding: 6px; border-radius: 4px; color: #78350f; margin-top: 6px; }
    .sig-area { margin-top: 10px; display: flex; justify-content: space-between; font-size: 8.5pt; font-weight: bold; }
  </style>
</head>
<body>

  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">استمارة التقييم الميداني ورصد درجات الـ KPIs اليومية (للطباعة والتفريغ)</div>
  </div>

  <div class="info-bar">
    <div><strong>التاريخ:</strong> ..... / ..... / 2026م</div>
    <div><strong>الوردية:</strong> [ &nbsp; ] صباحية &nbsp;&nbsp; [ &nbsp; ] مسائية &nbsp;&nbsp; [ &nbsp; ] ليلية</div>
    <div><strong>اسم المشرف المقيم:</strong> .....................................................</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 8%;">الكود</th>
        <th style="width: 22%;">اسم الموظف</th>
        <th style="width: 20%;">الوظيفة</th>
        <th class="kpi-col">⏱️ الحضور بالميعاد (1)</th>
        <th class="kpi-col">🧼 النظافة والمظهر (1)</th>
        <th class="kpi-col">👔 الزي الرسمي (1)</th>
        <th class="kpi-col">😊 الابتسامة واللباقة (1)</th>
        <th class="kpi-col">🎯 إتقان المهام (1)</th>
        <th style="width: 9%;">المجموع (من 5)</th>
        <th style="width: 15%;">ملاحظات المشرف والتفريغ</th>
      </tr>
    </thead>
    <tbody>
`;

let currentDept = '';
let bodyRows = '';

employees.forEach((emp, idx) => {
  if (emp.dept !== currentDept) {
    currentDept = emp.dept;
    bodyRows += `
      <tr>
        <td colspan="10" class="dept-header">📌 ${currentDept}</td>
      </tr>
    `;
  }

  bodyRows += `
    <tr>
      <td><strong>${emp.id}</strong></td>
      <td style="text-align: right; padding-right: 6px;"><strong>${emp.name}</strong></td>
      <td style="text-align: right; padding-right: 6px;">${emp.role}</td>
      <td class="score-cell">[ &nbsp; ]</td>
      <td class="score-cell">[ &nbsp; ]</td>
      <td class="score-cell">[ &nbsp; ]</td>
      <td class="score-cell">[ &nbsp; ]</td>
      <td class="score-cell">[ &nbsp; ]</td>
      <td style="font-weight: bold; background: #F7FAFC;">/ 5</td>
      <td></td>
    </tr>
  `;
});

const fullHtml = dailyEvalHtml + bodyRows + `
    </tbody>
  </table>

  <div class="footer-note">
    <strong>💡 تعليمات المشرف لتفريغ الدرجات في ملف الإكسيل:</strong><br>
    • ضع علامة (1 أو 0) في كل خانة من الـ KPIs الخمسة للحصول على مجموع اليوم من (5 درجات).<br>
    • في نهاية الشفت، يرجى فتح ملف الإكسيل الرئيسي <code>جدول_رواتب_وتقييم_30_موظف_الشهري.xlsx</code> وتفريغ درجات اليوم في شيت التقييم اليومي الخاص بكل قسم ليتم حساب التقييم الشهري والمرتب تلقائياً.
  </div>

  <div class="sig-area">
    <div><strong>توقيع المشرف المقيم:</strong> ...................................................</div>
    <div><strong>اعتماد مدير الفندق:</strong> ...................................................</div>
  </div>

</body>
</html>`;

const htmlPath = path.join(folderChecklists, 'استمارة_التقييم_اليومي_الميداني_للاستطاف.html');
const pdfPath = path.join(folderChecklists, 'استمارة_التقييم_اليومي_الميداني_للاستطاف.pdf');

fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log(`Saved Daily Evaluation HTML: ${htmlPath}`);

convertHtmlToPdf(htmlPath, pdfPath);

console.log('\n✨ PRINTABLE DAILY EVALUATION FORM PDF CREATED SUCCESSFULLY!');
