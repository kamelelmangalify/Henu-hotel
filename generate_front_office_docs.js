const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join('d:', 'Henu');
const foDocsDir = path.join(rootDir, '01_Accounting_System', 'مستندات_ورقيات_الاستقبال');
if (!fs.existsSync(foDocsDir)) fs.mkdirSync(foDocsDir, { recursive: true });

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
  try {
    execSync(cmd, { encoding: 'utf8' });
    console.log(`✅ PDF Created: ${path.basename(pdfPath)}`);
  } catch (err) {
    console.error(`❌ PDF failed for ${pdfPath}:`, err.message);
  }
}

// ---------------------------------------------------------
// 1. بطاقة تسجيل النزيل (Guest Registration Card)
// ---------------------------------------------------------
const regCardHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>بطاقة تسجيل النزيل — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; margin: 0; padding: 5px; direction: rtl; font-size: 9pt; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 6px; margin-bottom: 10px; }
    .brand-logo { max-width: 80px; height: auto; border-radius: 4px; }
    .hotel-name { font-size: 13pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 15pt; font-weight: 800; color: #1F4E78; }
    .box { border: 1px solid #CBD5E0; border-radius: 4px; padding: 8px; margin-bottom: 8px; background: #FFF; }
    .box-title { font-weight: 700; color: #1F4E78; background: #EDF2F7; padding: 4px 8px; margin: -8px -8px 6px -8px; border-bottom: 1px solid #CBD5E0; border-radius: 4px 4px 0 0; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 4px 6px; vertical-align: middle; border: 1px solid #E2E8F0; }
    .label { font-weight: bold; color: #2D3748; background: #F7FAFC; width: 18%; }
    .value-line { border-bottom: 1px dotted #718096; min-height: 16px; display: inline-block; width: 95%; }
    .terms { font-size: 7.5pt; color: #4A5568; line-height: 1.3; }
  </style>
</head>
<body>
  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">بطاقة تسجيل النزيل — GUEST REGISTRATION CARD</div>
  </div>

  <div class="box">
    <div class="box-title">👤 البيانات الشخصية للنزيل (Guest Personal Information)</div>
    <table>
      <tr>
        <td class="label">الاسم بالكامل:</td>
        <td colspan="3"><span class="value-line"></span></td>
        <td class="label">الجنسية:</td>
        <td><span class="value-line"></span></td>
      </tr>
      <tr>
        <td class="label">نوع وقود الهوية:</td>
        <td>[ ] بطاقة رقم قومي &nbsp;&nbsp; [ ] جواز سفر</td>
        <td class="label">رقم الهوية / الجواز:</td>
        <td><span class="value-line"></span></td>
        <td class="label">تاريخ الميلاد:</td>
        <td><span class="value-line"></span></td>
      </tr>
      <tr>
        <td class="label">رقم الهاتف / الواتساب:</td>
        <td colspan="2"><span class="value-line"></span></td>
        <td class="label">البريد الإلكتروني:</td>
        <td colspan="2"><span class="value-line"></span></td>
      </tr>
      <tr>
        <td class="label">العنوان الأصلي:</td>
        <td colspan="5"><span class="value-line"></span></td>
      </tr>
    </table>
  </div>

  <div class="box">
    <div class="box-title">🏨 تفاصيل الإقامة والتسكين (Stay Details)</div>
    <table>
      <tr>
        <td class="label">رقم الغرفة:</td>
        <td><span class="value-line"></span></td>
        <td class="label">تاريخ الوصول (Check-in):</td>
        <td><span class="value-line"></span></td>
        <td class="label">تاريخ المغادرة (Check-out):</td>
        <td><span class="value-line"></span></td>
      </tr>
      <tr>
        <td class="label">عدد النزلاء:</td>
        <td>بالغين: [ &nbsp; ] أطفال: [ &nbsp; ]</td>
        <td class="label">سعر الليلة:</td>
        <td><span class="value-line"></span></td>
        <td class="label">مصدر الحجز:</td>
        <td>[ ] Booking &nbsp; [ ] مباشر &nbsp; [ ] شركة</td>
      </tr>
    </table>
  </div>

  <div class="box">
    <div class="box-title">💳 تفاصيل المبالغ والسداد (Payment Details)</div>
    <table>
      <tr>
        <td class="label">طريقة الدفع:</td>
        <td>[ ] نقداً (Cash) &nbsp;&nbsp;&nbsp; [ ] فيزا (POS/Visa) &nbsp;&nbsp;&nbsp; [ ] تحويل بنكي</td>
        <td class="label">الدفعة المقدمة:</td>
        <td><span class="value-line"></span></td>
        <td class="label">المتبقي عند المغادرة:</td>
        <td><span class="value-line"></span></td>
      </tr>
    </table>
  </div>

  <div class="box terms">
    <div class="box-title">📜 الشروط العامة والتعهد الفندقي (Hotel Terms & Conditions)</div>
    1. موعد المغادرة الرسمي (Check-out) الساعة 12:00 ظهراً، وفي حال التأخير يُحسب أجر نصف ليلة.<br>
    2. الفندق غير مسؤول عن المفقودات أو الأموال الثمينة ما لم تُودَع رسمياً بخزينة الاستقبال بموجب إيصال أمانات معتمد.<br>
    3. يُحظر التدخين داخل الغرف وتُفرض غرامة تنظيف عميق 500 جـ في حال المخالفة.<br>
    4. أقر بصحة البيانات المدونة أعلاه وألتزم بقوانين الإقامة والتعليمات الفندقية.
  </div>

  <table style="margin-top: 15px; border: none;">
    <tr style="border: none;">
      <td style="border: none; width: 50%; text-align: center;">
        <strong>توقيع النزيل (Guest Signature):</strong><br><br>
        ...................................................
      </td>
      <td style="border: none; width: 50%; text-align: center;">
        <strong>توقيع وختم موظف الاستقبال (Receptionist Signature):</strong><br><br>
        ...................................................
      </td>
    </tr>
  </table>
</body>
</html>`;

// ---------------------------------------------------------
// 2. إيصال سداد وتحصيل نقدية للنزيل (Guest Payment Receipt)
// ---------------------------------------------------------
const receiptHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>إيصال سداد وتحصيل نقدية — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 15mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; margin: 0; padding: 5px; direction: rtl; font-size: 9.5pt; }
    .receipt-container { border: 2px solid #1F4E78; border-radius: 8px; padding: 12px; margin-bottom: 20px; background: #FFF; }
    .header { text-align: center; border-bottom: 1.5px solid #1F4E78; padding-bottom: 6px; margin-bottom: 10px; }
    .brand-logo { max-width: 75px; height: auto; }
    .hotel-name { font-size: 12pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 14pt; font-weight: 800; color: #1F4E78; }
    .rec-no { font-size: 10pt; font-weight: bold; color: #C53030; float: left; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    td { padding: 6px; border: 1px solid #CBD5E0; }
    .lbl { font-weight: bold; background: #EDF2F7; width: 22%; }
    .amount-box { background: #FEF3C7; border: 2px solid #D97706; padding: 8px; text-align: center; font-size: 13pt; font-weight: bold; color: #78350f; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>

  <!-- النسخة الأولى: أصل للنزيل -->
  <div class="receipt-container">
    <div class="rec-no">إيصال رقم: REC-2026-....... [ أصل للنزيل ]</div>
    <div class="header">
      ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
      <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
      <div class="doc-title">إيصال سداد واستلام نقدية — RECEIPT VOUCHER</div>
    </div>

    <table>
      <tr>
        <td class="lbl">استلمنا من السيد / السيدة:</td>
        <td colspan="3">...........................................................................................................</td>
      </tr>
      <tr>
        <td class="lbl">مبلغ وقدره:</td>
        <td colspan="3">........................................................................................................... جنيه مصري لا غير.</td>
      </tr>
      <tr>
        <td class="lbl">وذلك مقابل:</td>
        <td colspan="3">[ ] دفعة مقدمة حجز &nbsp;&nbsp; [ ] سداد إقامة غرفة رقم ( ..... ) &nbsp;&nbsp; [ ] خدمات إضافية / كافيه</td>
      </tr>
      <tr>
        <td class="lbl">طريقة الدفع:</td>
        <td>[ ] نقداً (Cash) &nbsp;&nbsp;&nbsp; [ ] بطاقة فيزا (POS) &nbsp;&nbsp;&nbsp; [ ] تحويل بنكي</td>
        <td class="lbl">التاريخ:</td>
        <td>..... / ..... / 2026م</td>
      </tr>
    </table>

    <div class="amount-box">المبلغ المقبوض: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] جنيه مصري</div>

    <table style="border: none; margin-top: 10px;">
      <tr style="border: none;">
        <td style="border: none; text-align: center; width: 50%;"><strong>توقيع المستلم (الاستقبال):</strong> ...........................</td>
        <td style="border: none; text-align: center; width: 50%;"><strong>ختم الفندق الرسمي:</strong> ...........................</td>
      </tr>
    </table>
  </div>

  <hr style="border: 1px dashed #A0AEC0; margin: 15px 0;">

  <!-- النسخة الثانية: صورة للخزينة -->
  <div class="receipt-container" style="background: #FAFAFA;">
    <div class="rec-no">إيصال رقم: REC-2026-....... [ صورة الخزينة ]</div>
    <div class="header">
      <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
      <div class="doc-title">إيصال سداد واستلام نقدية (نسخة الحسابات والخزينة)</div>
    </div>

    <table>
      <tr>
        <td class="lbl">اسم النزيل:</td>
        <td>...................................................</td>
        <td class="lbl">رقم الغرفة:</td>
        <td>( ..... )</td>
      </tr>
      <tr>
        <td class="lbl">المبلغ المقبوض:</td>
        <td colspan="3">........................................................................................................... جنيه.</td>
      </tr>
      <tr>
        <td class="lbl">طريقة التحصيل:</td>
        <td>[ ] كاش &nbsp;&nbsp; [ ] فيزا &nbsp;&nbsp; [ ] تحويل</td>
        <td class="lbl">توقيع الموظف:</td>
        <td>...........................</td>
      </tr>
    </table>
  </div>

</body>
</html>`;

// ---------------------------------------------------------
// 3. فاتورة وكشف حساب النزيل (Guest Folio)
// ---------------------------------------------------------
const folioHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>فاتورة وكشف حساب النزيل — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; margin: 0; padding: 5px; direction: rtl; font-size: 9pt; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 6px; margin-bottom: 10px; }
    .brand-logo { max-width: 80px; height: auto; }
    .hotel-name { font-size: 13pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 15pt; font-weight: 800; color: #1F4E78; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
    th, td { border: 1px solid #CBD5E0; padding: 5px 8px; text-align: center; }
    th { background: #1F4E78; color: white; }
    .info-table td { text-align: right; }
    .lbl { font-weight: bold; background: #F7FAFC; width: 18%; }
    .total-row td { font-weight: bold; background: #EDF2F7; font-size: 10pt; }
  </style>
</head>
<body>
  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">فاتورة وكشف حساب النزيل — GUEST FOLIO & BILL</div>
  </div>

  <table class="info-table">
    <tr>
      <td class="lbl">اسم النزيل:</td>
      <td>...................................................</td>
      <td class="lbl">رقم الغرفة:</td>
      <td>( ..... )</td>
      <td class="lbl">رقم الفاتورة:</td>
      <td>FOL-2026-.......</td>
    </tr>
    <tr>
      <td class="lbl">تاريخ الوصول:</td>
      <td>..... / ..... / 2026م</td>
      <td class="lbl">تاريخ المغادرة:</td>
      <td>..... / ..... / 2026م</td>
      <td class="lbl">عدد الليالي:</td>
      <td>[ &nbsp;&nbsp;&nbsp; ] ليلة</td>
    </tr>
  </table>

  <table>
    <thead>
      <tr>
        <th>التاريخ</th>
        <th>البيان / الخدمة (Description)</th>
        <th>رقم الإيصال</th>
        <th>مدين (رسوم الخدمة)</th>
        <th>دائن (المسدد)</th>
        <th>الرصيد المتبقي</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>...../.....</td>
        <td>أجر إقامة الغرفة (Room Charge)</td>
        <td>-</td>
        <td>..................</td>
        <td>-</td>
        <td>..................</td>
      </tr>
      <tr>
        <td>...../.....</td>
        <td>دفعة مقدمة عند التسكين (Advance Deposit)</td>
        <td>REC-......</td>
        <td>-</td>
        <td>..................</td>
        <td>..................</td>
      </tr>
      <tr>
        <td>...../.....</td>
        <td>خدمات الكافيه والمأكولات بالروف</td>
        <td>POS-......</td>
        <td>..................</td>
        <td>-</td>
        <td>..................</td>
      </tr>
      <tr>
        <td>...../.....</td>
        <td>خدمة المغسلة والكتانيات (Laundry)</td>
        <td>LND-......</td>
        <td>..................</td>
        <td>-</td>
        <td>..................</td>
      </tr>
      <tr>
        <td>...../.....</td>
        <td>رحلات / توصيلات مطار (Transportation)</td>
        <td>TRP-......</td>
        <td>..................</td>
        <td>-</td>
        <td>..................</td>
      </tr>
      <tr class="total-row">
        <td colspan="3">الإجمالي الكلي (GRAND TOTAL):</td>
        <td>..................</td>
        <td>..................</td>
        <td style="color: #C53030; font-size: 11pt;">.................. جـ</td>
      </tr>
    </tbody>
  </table>

  <div style="background: #EDF2F7; padding: 8px; border-radius: 4px; font-size: 8.5pt; margin-top: 10px;">
    <strong>صافي المبلغ المطلوب سداده عند المغادرة:</strong> [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] جنيه مصري فقط لا غير.
  </div>

  <table style="margin-top: 20px; border: none;">
    <tr style="border: none;">
      <td style="border: none; width: 50%; text-align: center;"><strong>توقيع النزيل بالموافقة:</strong><br><br>...................................................</td>
      <td style="border: none; width: 50%; text-align: center;"><strong>توقيع المحاسب / الاستقبال:</strong><br><br>...................................................</td>
    </tr>
  </table>
</body>
</html>`;

// ---------------------------------------------------------
// 4. تقرير تسليم وتسلم وردية الاستقبال (Shift Handover Log)
// ---------------------------------------------------------
const handoverHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تقرير تسليم وتسلم وردية الاستقبال — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; margin: 0; padding: 5px; direction: rtl; font-size: 9pt; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 6px; margin-bottom: 10px; }
    .hotel-name { font-size: 12pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 15pt; font-weight: 800; color: #1F4E78; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    td, th { border: 1px solid #CBD5E0; padding: 5px; text-align: center; }
    th { background: #1F4E78; color: white; }
    .lbl { font-weight: bold; background: #F7FAFC; text-align: right; width: 20%; }
  </style>
</head>
<body>
  <div class="header">
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">شيت تسليم وتسلم وردية الاستقبال — SHIFT HANDOVER SHEET</div>
  </div>

  <table>
    <tr>
      <td class="lbl">التاريخ:</td>
      <td>..... / ..... / 2026م</td>
      <td class="lbl">الوردية المنسحبة:</td>
      <td>[ ] صباحية &nbsp; [ ] مسائية &nbsp; [ ] ليلية</td>
      <td class="lbl">الوردية المستلمة:</td>
      <td>[ ] صباحية &nbsp; [ ] مسائية &nbsp; [ ] ليلية</td>
    </tr>
    <tr>
      <td class="lbl">اسم الموظف المسلّم:</td>
      <td>..........................................</td>
      <td class="lbl">اسم الموظف المستلم:</td>
      <td colspan="3">..........................................</td>
    </tr>
  </table>

  <div style="font-weight: bold; color: #1F4E78; background: #EDF2F7; padding: 4px; margin: 6px 0;">💰 1. جرد وتطابق الخزينة والتحصيلات النقدي (Cash & POS Clearance)</div>
  <table>
    <thead>
      <tr>
        <th>رصيد أول الوردية</th>
        <th>المقبوضات الكاش</th>
        <th>المقبوضات الفيزا (POS)</th>
        <th>المصروفات بالنثريات</th>
        <th>الرصيد النقدي الفعلي بالخزينة</th>
        <th>حالة الخزينة</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>...................</td>
        <td>...................</td>
        <td>...................</td>
        <td>...................</td>
        <td>...................</td>
        <td>[ ] متطابقة &nbsp; [ ] عجز &nbsp; [ ] زيادة</td>
      </tr>
    </tbody>
  </table>

  <div style="font-weight: bold; color: #1F4E78; background: #EDF2F7; padding: 4px; margin: 6px 0;">🏨 2. إحصائية الغرف والنزلاء (Room & Guest Occupancy)</div>
  <table>
    <tr>
      <td class="lbl">إجمالي الغرف المشغولة:</td>
      <td>[ &nbsp;&nbsp;&nbsp;&nbsp; ] غرفة</td>
      <td class="lbl">غرف الوصول اليوم (Arrivals):</td>
      <td>[ &nbsp;&nbsp;&nbsp;&nbsp; ] غرفة</td>
      <td class="lbl">غرف المغادرة اليوم (Departures):</td>
      <td>[ &nbsp;&nbsp;&nbsp;&nbsp; ] غرفة</td>
    </tr>
  </table>

  <div style="font-weight: bold; color: #1F4E78; background: #EDF2F7; padding: 4px; margin: 6px 0;">📌 3. الملاحظات الهامة والتعليمات للوردية التالية</div>
  <table style="height: 120px;">
    <tr>
      <td style="text-align: right; vertical-align: top; padding: 8px;">
        1. .........................................................................................................................................................................<br>
        2. .........................................................................................................................................................................<br>
        3. .........................................................................................................................................................................
      </td>
    </tr>
  </table>

  <table style="margin-top: 15px; border: none;">
    <tr style="border: none;">
      <td style="border: none; width: 50%; text-align: center;"><strong>توقيع الموظف المسلّم:</strong> ...........................</td>
      <td style="border: none; width: 50%; text-align: center;"><strong>توقيع الموظف المستلم:</strong> ...........................</td>
    </tr>
  </table>
</body>
</html>`;

// ---------------------------------------------------------
// 5. سجل الأمانات والمفقودات الخاصة بالنزلاء (Safe Deposit & Lost Found)
// ---------------------------------------------------------
const safeLostHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>سجل الأمانات والمفقودات — فندق هينو الأهرامات</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    @page { size: A4; margin: 10mm 12mm; }
    body { font-family: 'Tajawal', Arial, sans-serif; color: #1a202c; margin: 0; padding: 5px; direction: rtl; font-size: 9pt; }
    .header { text-align: center; border-bottom: 2px solid #1F4E78; padding-bottom: 6px; margin-bottom: 10px; }
    .hotel-name { font-size: 12pt; font-weight: 800; color: #78350f; }
    .doc-title { font-size: 15pt; font-weight: 800; color: #1F4E78; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    th, td { border: 1px solid #CBD5E0; padding: 6px; text-align: center; }
    th { background: #1F4E78; color: white; }
  </style>
</head>
<body>
  <div class="header">
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">سجل مودعات الأمانات والمفقودات — SAFE DEPOSIT & LOST AND FOUND LOG</div>
  </div>

  <div style="font-weight: bold; color: #1F4E78; background: #EDF2F7; padding: 5px; margin-bottom: 6px;">🔐 أولاً: سجل أمانات ومودعات النزلاء بالخزينة الرئيسية (Guest Safe Deposit Box Log)</div>
  <table>
    <thead>
      <tr>
        <th>رقم الإيداع</th>
        <th>اسم النزيل</th>
        <th>رقم الغرفة</th>
        <th>وصف الأمانة المودعة</th>
        <th>تاريخ الإيداع</th>
        <th>توقيع النزيل بالإيداع</th>
        <th>تاريخ الاسترداد</th>
        <th>توقيع النزيل بالاستلام</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>SAF-01</td><td>..................</td><td>.....</td><td>....................................</td><td>...../.....</td><td>..................</td><td>...../.....</td><td>..................</td></tr>
      <tr><td>SAF-02</td><td>..................</td><td>.....</td><td>....................................</td><td>...../.....</td><td>..................</td><td>...../.....</td><td>..................</td></tr>
      <tr><td>SAF-03</td><td>..................</td><td>.....</td><td>....................................</td><td>...../.....</td><td>..................</td><td>...../.....</td><td>..................</td></tr>
    </tbody>
  </table>

  <div style="font-weight: bold; color: #1F4E78; background: #EDF2F7; padding: 5px; margin-bottom: 6px;">🔍 ثانياً: سجل مفقودات ومتروكات النزلاء (Lost & Found Log)</div>
  <table>
    <thead>
      <tr>
        <th>رقم البلاغ</th>
        <th>تاريخ العثور</th>
        <th>رقم الغرفة / المكان</th>
        <th>وصف الشيء المفقود</th>
        <th>اسم عائم/مشرف الغرفة</th>
        <th>حالة الشيء</th>
        <th>توقيع التسليم للنزيل</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>LST-01</td><td>...../.....</td><td>غرفة .....</td><td>....................................</td><td>..................</td><td>مربوط بالخزينة</td><td>..................</td></tr>
      <tr><td>LST-02</td><td>...../.....</td><td>غرفة .....</td><td>....................................</td><td>..................</td><td>مربوط بالخزينة</td><td>..................</td></tr>
      <tr><td>LST-03</td><td>...../.....</td><td>غرفة .....</td><td>....................................</td><td>..................</td><td>مربوط بالخزينة</td><td>..................</td></tr>
    </tbody>
  </table>
</body>
</html>`;

// ---------------------------------------------------------
// كتابة وتحويل المستندات الـ 5 إلى PDF
// ---------------------------------------------------------
const filesToBuild = [
  { name: '01_بطاقة_تسجيل_النزيل_Registration_Card', html: regCardHtml },
  { name: '02_إيصال_سداد_وتحصيل_نقدية_Guest_Receipt', html: receiptHtml },
  { name: '03_فاتورة_وكشف_حساب_النزيل_Guest_Folio', html: folioHtml },
  { name: '04_تقرير_تسليم_وتسلم_وردية_الاستقبال_Shift_Handover', html: handoverHtml },
  { name: '05_سجل_الأمانات_والمفقودات_Safe_Deposit_Lost_Found', html: safeLostHtml }
];

filesToBuild.forEach(item => {
  const htmlPath = path.join(foDocsDir, `${item.name}.html`);
  const pdfPath = path.join(foDocsDir, `${item.name}.pdf`);
  fs.writeFileSync(htmlPath, item.html, 'utf8');
  convertHtmlToPdf(htmlPath, pdfPath);
});

// ---------------------------------------------------------
// 2. تحديث ملف خريطة توزيع الملفات والمستندات (Update Sitemap HTML & PDF)
// ---------------------------------------------------------
const sitemapHtmlPath = path.join(rootDir, 'خريطة_توزيع_الملفات_والمستندات.html');
const sitemapPdfPath = path.join(rootDir, 'خريطة_توزيع_الملفات_والمستندات.pdf');

const updatedSitemapHtml = `<!DOCTYPE html>
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
  </style>
</head>
<body>

  <div class="header">
    ${logoDataUrl ? `<img src="${logoDataUrl}" alt="HENU Hotel Logo" class="brand-logo">` : ''}
    <div class="hotel-name">H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات</div>
    <div class="doc-title">دليل وخريطة توزيع الملفات والمستندات الرسمية (Directory Sitemap)</div>
    <div style="font-size: 9pt; color: #4a5568;">النسخة المحدثة والمطورة — 2026م</div>
  </div>

  <!-- 01 النظام المحاسبي وورقيات الاستقبال -->
  <div class="folder-card">
    <div class="folder-name">📁 01_Accounting_System (النظام المحاسبي وورقيات الاستقبال)</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>نظام_حجوزات_وتسكين_الغرف_الفندقي.xlsx:</strong> شاشة حالة الغرف الـ 25 التفاعلية (Room Rack) وسجل الحجوزات الشامل.</li>
      <li><span class="badge-excel">EXCEL</span> <strong>جدول_رواتب_وتقييم_الموظفين_الشهري.xlsx:</strong> كشف رواتب الـ 30 موظفاً وشيتات الـ KPIs اليومية المربوطة وكشف الحضور العرضي.</li>
      <li><span class="badge-excel">EXCEL</span> <strong>كشف_حضور_وانصراف_أسبوعي_بالتوقيعات.xlsx:</strong> كشف توقيعات الحضور والانصراف الأسبوعي A4 Landscape.</li>
      <li><span class="badge-pdf">PDF</span> <strong>سياسة_النقدية_والتعامل_مع_الخزينة_Cash_Policy.pdf:</strong> الدورة المستندية والسياسة المالية لإدارة النقدية والخزينة.</li>
    </ul>

    <div style="font-weight: bold; color: #78350f; margin-top: 6px;">📂 01_Accounting_System / مستندات_ورقيات_الاستقبال (نماذج الكونتر المطبوعة):</div>
    <ul>
      <li><span class="badge-pdf">PDF</span> <strong>01_بطاقة_تسجيل_النزيل_Registration_Card.pdf:</strong> كارت تسكين النزيل الرسمي لشرطة السياحة والتعهد.</li>
      <li><span class="badge-pdf">PDF</span> <strong>02_إيصال_سداد_وتحصيل_نقدية_Guest_Receipt.pdf:</strong> إيصال النقدية والتحصيل المعتمد للنزلاء.</li>
      <li><span class="badge-pdf">PDF</span> <strong>03_فاتورة_وكشف_حساب_النزيل_Guest_Folio.pdf:</strong> فاتورة النزيل النهائية عند الـ Check-out.</li>
      <li><span class="badge-pdf">PDF</span> <strong>04_تقرير_تسليم_وتسلم_وردية_الاستقبال_Shift_Handover.pdf:</strong> شيت تسليم النقدية والغرف بين الشيفتات.</li>
      <li><span class="badge-pdf">PDF</span> <strong>05_سجل_الأمانات_والمفقودات_Safe_Deposit_Lost_Found.pdf:</strong> دفتر مودعات الخزينة والمفقودات.</li>
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
      <li><span class="badge-pdf">PDF</span> <strong>عامل_النظافة.pdf & مشرفة_الغرف.pdf:</strong> حقيبة الإشراف الداخلي والغرف.</li>
      <li><span class="badge-pdf">PDF</span> <strong>مقدم_الخدمة_الويتر.pdf & مشرف_ومدير_المطعم.pdf:</strong> حقيبة المطعم والكافيه.</li>
      <li><span class="badge-pdf">PDF</span> <strong>الدليل_التشغيلي_والإداري_الشامل_للفندق.pdf:</strong> الدليل التشغيلي الموحد للفندق.</li>
      <li><span class="badge-pdf">PDF</span> <strong>استمارة_التقييم_اليومي_الميداني_للاستطاف.pdf:</strong> استمارة رصد التقييم اليومي المطبوعة للمشرفين.</li>
    </ul>
  </div>

</body>
</html>`;

fs.writeFileSync(sitemapHtmlPath, updatedSitemapHtml, 'utf8');
convertHtmlToPdf(sitemapHtmlPath, sitemapPdfPath);

// تنظيف ملفات الـ HTML المؤقتة من المجلدات ليبقى PDF فقط
const looseHtmls = [
  path.join(foDocsDir, '01_بطاقة_تسجيل_النزيل_Registration_Card.html'),
  path.join(foDocsDir, '02_إيصال_سداد_وتحصيل_نقدية_Guest_Receipt.html'),
  path.join(foDocsDir, '03_فاتورة_وكشف_حساب_النزيل_Guest_Folio.html'),
  path.join(foDocsDir, '04_تقرير_تسليم_وتسلم_وردية_الاستقبال_Shift_Handover.html'),
  path.join(foDocsDir, '05_سجل_الأمانات_والمفقودات_Safe_Deposit_Lost_Found.html')
];

const sourceArchiveDir = path.join(rootDir, '_sources_and_html');
looseHtmls.forEach(htmlFile => {
  if (fs.existsSync(htmlFile)) {
    const rel = path.relative(rootDir, htmlFile);
    const dest = path.join(sourceArchiveDir, rel);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    try { fs.renameSync(htmlFile, dest); } catch (e) {}
  }
});

console.log('\n✨ FRONT OFFICE DOCS GENERATED & SITEMAP UPDATED SUCCESSFULLY!');
