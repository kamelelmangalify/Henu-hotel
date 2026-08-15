const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, HeadingLevel } = require('docx');
const { execSync } = require('child_process');

const rootDir = path.join('d:', 'Henu');
const foDocsDir = path.join(rootDir, '01_Accounting_System', 'مستندات_ورقيات_الاستقبال');
const hkDocsDir = path.join(rootDir, '01_Accounting_System', 'مستندات_الإشراف_الداخلي_والغرف');
const invDocsDir = path.join(rootDir, '01_Accounting_System', 'نماذج_جرد_الغرف_والمخازن');
const legalDir = path.join(rootDir, '02_Contracts_and_Legal');

[foDocsDir, hkDocsDir, invDocsDir, legalDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

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
  } catch (err) {}
}

// ---------------------------------------------------------
// 1. توليد وثائق وورد الاستقبال (Front Office DOCX)
// ---------------------------------------------------------
async function generateFrontOfficeWordDocs() {
  // 1. بطاقة تسجيل النزيل DOCX
  const regDoc = new Document({
    sections: [{
      properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات\n", bold: true, size: 28, color: "78350F" }),
            new TextRun({ text: "بطاقة تسجيل النزيل — GUEST REGISTRATION CARD\n", bold: true, size: 32, color: "1F4E78" })
          ]
        }),
        new Paragraph({ text: "\n👤 البيانات الشخصية للنزيل (Guest Personal Information):", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "الاسم بالكامل:" })] }),
                new TableCell({ children: [new Paragraph({ text: "...................................................................................." })] }),
                new TableCell({ children: [new Paragraph({ text: "الجنسية:" })] }),
                new TableCell({ children: [new Paragraph({ text: "............................" })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "نوع ونمبر الهوية:" })] }),
                new TableCell({ children: [new Paragraph({ text: "[ ] بطاقة رقم قومي    [ ] جواز سفر" })] }),
                new TableCell({ children: [new Paragraph({ text: "رقم الهوية/الجواز:" })] }),
                new TableCell({ children: [new Paragraph({ text: "............................" })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "رقم الهاتف/الواتساب:" })] }),
                new TableCell({ children: [new Paragraph({ text: "..................................................." })] }),
                new TableCell({ children: [new Paragraph({ text: "البريد الإلكتروني:" })] }),
                new TableCell({ children: [new Paragraph({ text: "............................" })] })
              ]
            })
          ]
        }),
        new Paragraph({ text: "\n🏨 تفاصيل الإقامة والتسكين (Stay Details):", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "رقم الغرفة:" })] }),
                new TableCell({ children: [new Paragraph({ text: "( ......... )" })] }),
                new TableCell({ children: [new Paragraph({ text: "تاريخ الوصول:" })] }),
                new TableCell({ children: [new Paragraph({ text: "....../....../2026م" })] }),
                new TableCell({ children: [new Paragraph({ text: "تاريخ المغادرة:" })] }),
                new TableCell({ children: [new Paragraph({ text: "....../....../2026م" })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "سعر الليلة:" })] }),
                new TableCell({ children: [new Paragraph({ text: "..................... جـ" })] }),
                new TableCell({ children: [new Paragraph({ text: "الدفعة المقدمة:" })] }),
                new TableCell({ children: [new Paragraph({ text: "..................... جـ" })] }),
                new TableCell({ children: [new Paragraph({ text: "المتبقي:" })] }),
                new TableCell({ children: [new Paragraph({ text: "..................... جـ" })] })
              ]
            })
          ]
        }),
        new Paragraph({ text: "\n📜 الشروط والتعهدات:\n1. مغادرة الفندق الساعة 12:00 ظهراً.\n2. الفندق غير مسؤول عن الممتلكات الثمينة ما لم تودع بخزينة الاستقبال.\n3. أقر بصحة البيانات المدونة أعلاه.", size: 20 }),
        new Paragraph({ text: "\n\nتوقيع النزيل: ...........................................               توقيع الاستقبال: ...........................................", bold: true, alignment: AlignmentType.CENTER })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(regDoc);
  fs.writeFileSync(path.join(foDocsDir, '01_بطاقة_تسجيل_النزيل_Registration_Card.docx'), buffer);
  console.log(`✅ Word Created: 01_بطاقة_تسجيل_النزيل_Registration_Card.docx`);

  // 2. إيصال سداد وتحصيل نقدية DOCX
  const recDoc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات\n", bold: true, size: 28, color: "78350F" }),
            new TextRun({ text: "إيصال سداد واستلام نقدية — RECEIPT VOUCHER\n", bold: true, size: 32, color: "1F4E78" })
          ]
        }),
        new Paragraph({ text: "\nاستلمنا من السيد/السيدة: .............................................................................................................", size: 24 }),
        new Paragraph({ text: "مبلغ وقدره: ............................................................................................................................ جنيه مصري.", size: 24 }),
        new Paragraph({ text: "وذلك مقابل: [ ] دفعة مقدمة حجز     [ ] سداد إقامة غرفة ( ...... )     [ ] خدمات كافيه ومأكولات", size: 24 }),
        new Paragraph({ text: "طريقة الدفع: [ ] نقداً كاش     [ ] بطاقة فيزا POS     [ ] تحويل بنكي", size: 24 }),
        new Paragraph({ text: "\nالمبلغ المقبوض: [                                               ] جنيه مصري", bold: true, size: 28, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: "\n\nتوقيع الاستقبال: ...........................................               ختم الفندق: ...........................................", bold: true, alignment: AlignmentType.CENTER })
      ]
    }]
  });

  const recBuffer = await Packer.toBuffer(recDoc);
  fs.writeFileSync(path.join(foDocsDir, '02_إيصال_سداد_وتحصيل_نقدية_Guest_Receipt.docx'), recBuffer);
  console.log(`✅ Word Created: 02_إيصال_سداد_وتحصيل_نقدية_Guest_Receipt.docx`);

  // 3. فاتورة وكشف حساب النزيل DOCX
  const folioDoc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات\n", bold: true, size: 28, color: "78350F" }),
            new TextRun({ text: "فاتورة وكشف حساب النزيل — GUEST FOLIO & BILL\n", bold: true, size: 32, color: "1F4E78" })
          ]
        }),
        new Paragraph({ text: "اسم النزيل: ....................................................   رقم الغرفة: ( ...... )   رقم الفاتورة: FOL-2026-.......", size: 22 }),
        new Paragraph({ text: "تاريخ الوصول: ...../...../2026م   تاريخ المغادرة: ...../...../2026م   عدد الليالي: [     ]", size: 22 }),
        new Paragraph({ text: "\nبيان الخدمات والرسوم المفصلة:", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "الخدمة / البيان", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "مدين (رسوم)", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "دائن (مسدد)", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "المتبقي", bold: true })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "إقامة الغرفة الفندقية" })] }),
                new TableCell({ children: [new Paragraph({ text: "...................." })] }),
                new TableCell({ children: [new Paragraph({ text: "...................." })] }),
                new TableCell({ children: [new Paragraph({ text: "...................." })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "مأكولات ومشروبات الكافيه" })] }),
                new TableCell({ children: [new Paragraph({ text: "...................." })] }),
                new TableCell({ children: [new Paragraph({ text: "...................." })] }),
                new TableCell({ children: [new Paragraph({ text: "...................." })] })
              ]
            })
          ]
        }),
        new Paragraph({ text: "\nصافي المبلغ المستحق عند المغادرة: [                                    ] جنيه مصري.", bold: true, size: 24 }),
        new Paragraph({ text: "\n\nتوقيع النزيل: ...........................................               توقيع المحاسب: ...........................................", bold: true, alignment: AlignmentType.CENTER })
      ]
    }]
  });

  const folioBuffer = await Packer.toBuffer(folioDoc);
  fs.writeFileSync(path.join(foDocsDir, '03_فاتورة_وكشف_حساب_النزيل_Guest_Folio.docx'), folioBuffer);
  console.log(`✅ Word Created: 03_فاتورة_وكشف_حساب_النزيل_Guest_Folio.docx`);

  // 4. سياسة النقدية والخزينة DOCX
  const cashDoc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات\n", bold: true, size: 28, color: "78350F" }),
            new TextRun({ text: "سياسة وإجراءات إدارة النقدية والخزينة (Cash Policy)\n", bold: true, size: 32, color: "1F4E78" })
          ]
        }),
        new Paragraph({ text: "\n1. مقبوضات النزلاء: إصدار إيصال نقدية فوري معتمد لكل تحصيل كاش أو فيزا.", size: 22 }),
        new Paragraph({ text: "2. العهدة النثرية: سقف العهدة النثرية 3,000 جـ وإذن الصرف بموجب فاتورة ضريبية.", size: 22 }),
        new Paragraph({ text: "3. العجز والزيادة: يلتزم الموظف بسداد أي عجز مالي فوراً، والزيادة تقيد لحساب الفندق.", size: 22 }),
        new Paragraph({ text: "4. تقفيل الكافيه: جرد وتوريد نقدية مبيعات الكافيه يومياً الساعة 11:00 مساءً.", size: 22 })
      ]
    }]
  });

  const cashBuffer = await Packer.toBuffer(cashDoc);
  fs.writeFileSync(path.join(rootDir, '01_Accounting_System', 'سياسة_النقدية_والتعامل_مع_الخزينة_Cash_Policy.docx'), cashBuffer);
  console.log(`✅ Word Created: سياسة_النقدية_والتعامل_مع_الخزينة_Cash_Policy.docx`);
}

// ---------------------------------------------------------
// 2. توليد وثائق وورد الإشراف الداخلي والغرف والجرد (Housekeeping & Inventory DOCX)
// ---------------------------------------------------------
async function generateHousekeepingAndInventoryWordDocs() {
  // 1. استمارة جرد مشتملات الغرفة DOCX
  const roomInvDoc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات\n", bold: true, size: 28, color: "78350F" }),
            new TextRun({ text: "نموج وجدول جرد مشتملات وأثاث الغرفة (Room Inventory Sheet)\n", bold: true, size: 32, color: "1F4E78" })
          ]
        }),
        new Paragraph({ text: "رقم الغرفة: ( ...... )   نوع الغرفة: ..........................   التاريخ: ...../...../2026م", size: 22 }),
        new Paragraph({ text: "\nجدول رصد المشتملات والأثاث:", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "الصنف / البيان", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "العدد", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "الحالة (سليم / صيانة)", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "ملاحظات وتوجيهات", bold: true })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "سرير فندقي كينج / سينجل" })] }),
                new TableCell({ children: [new Paragraph({ text: "[    ]" })] }),
                new TableCell({ children: [new Paragraph({ text: "[  ] سليم    [  ] صيانة" })] }),
                new TableCell({ children: [new Paragraph({ text: "............................" })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "مرتبة فندقية + واقي مرتبة" })] }),
                new TableCell({ children: [new Paragraph({ text: "[    ]" })] }),
                new TableCell({ children: [new Paragraph({ text: "[  ] سليم    [  ] صيانة" })] }),
                new TableCell({ children: [new Paragraph({ text: "............................" })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "شاشة سمارت 32 بوصة + ريموت" })] }),
                new TableCell({ children: [new Paragraph({ text: "[    ]" })] }),
                new TableCell({ children: [new Paragraph({ text: "[  ] سليم    [  ] صيانة" })] }),
                new TableCell({ children: [new Paragraph({ text: "............................" })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "تكييف فندقي + ريموت كنترول" })] }),
                new TableCell({ children: [new Paragraph({ text: "[    ]" })] }),
                new TableCell({ children: [new Paragraph({ text: "[  ] سليم    [  ] صيانة" })] }),
                new TableCell({ children: [new Paragraph({ text: "............................" })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "طقم البشاكير والفوط والمشاية" })] }),
                new TableCell({ children: [new Paragraph({ text: "[    ]" })] }),
                new TableCell({ children: [new Paragraph({ text: "[  ] سليم    [  ] صيانة" })] }),
                new TableCell({ children: [new Paragraph({ text: "............................" })] })
              ]
            })
          ]
        }),
        new Paragraph({ text: "\n\nتوقيع عامل الغرف: ...........................................               توقيع المشرفة: ...........................................", bold: true, alignment: AlignmentType.CENTER })
      ]
    }]
  });

  const roomInvBuffer = await Packer.toBuffer(roomInvDoc);
  fs.writeFileSync(path.join(invDocsDir, '01_استمارة_جرد_مشتملات_الغرفة_الفندقية_Room_Inventory.docx'), roomInvBuffer);
  console.log(`✅ Word Created: 01_استمارة_جرد_مشتملات_الغرفة_الفندقية_Room_Inventory.docx`);

  // 2. طلب وإذن صيانة الغرف DOCX
  const maintDoc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات\n", bold: true, size: 28, color: "78350F" }),
            new TextRun({ text: "أمر وتكليف صيانة غرفة / أعطال عاجلة (Work Order Log)\n", bold: true, size: 32, color: "1F4E78" })
          ]
        }),
        new Paragraph({ text: "رقم أمر الصيانة: MNT-2026-.......   رقم الغرفة: ( ...... )   التاريخ: ...../...../2026م", size: 22 }),
        new Paragraph({ text: "تفاصيل العطل والشكوى: ................................................................................................................................", size: 22 }),
        new Paragraph({ text: "نوع الصيانة: [ ] سباكة    [ ] كهرباء وإضاءة    [ ] تكييف وتبريد    [ ] نجارة وأقفال", size: 22 }),
        new Paragraph({ text: "إجراء الفني والإصلاح: ................................................................................................................................", size: 22 }),
        new Paragraph({ text: "\n\nتوقيع الفني المنفذ: ...........................................               اعتماد المشرف: ...........................................", bold: true, alignment: AlignmentType.CENTER })
      ]
    }]
  });

  const maintBuffer = await Packer.toBuffer(maintDoc);
  fs.writeFileSync(path.join(hkDocsDir, '03_طلب_وإذن_صيانة_الغرف_والأعطال_Maintenance_Order.docx'), maintBuffer);
  console.log(`✅ Word Created: 03_طلب_وإذن_صيانة_الغرف_والأعطال_Maintenance_Order.docx`);
}

// ---------------------------------------------------------
// 3. توليد وثائق وورد العقود واللوائح (Legal DOCX)
// ---------------------------------------------------------
async function generateLegalWordDocs() {
  const contractDoc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "H E N U  H O T E L  P Y R A M I D S — فندق هينو الأهرامات\n", bold: true, size: 28, color: "78350F" }),
            new TextRun({ text: "عقد عمل فردي مؤقت وتعهد فندقي موحد\n", bold: true, size: 32, color: "1F4E78" })
          ]
        }),
        new Paragraph({ text: "إنه في يوم ......... الموافق ...../...../2026م تحرر هذا العقد بين كل من:", size: 22 }),
        new Paragraph({ text: "طرف أول: فندق هينو الأهرامات (نزلة السمان - الجيزة) ويمثله إدارة الفندق.", size: 22 }),
        new Paragraph({ text: "طرف ثانٍ: السيد / ..................................................... بطاقة رقم قومي: ( .................................. ).", size: 22 }),
        new Paragraph({ text: "\nالمادة الثالثة — الأجر والراتب وهيكلة حافز الـ KPIs:", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "يتكون الراتب المالي الشامل للطرف الثاني من:\n1. 75% راتب أساسي ثابت مقابل ساعات العمل الرسمية.\n2. 25% حافز متغيّر مرتبط بتقييم معايير الأداء والـ KPIs اليومية (الالتزام، النظافة، Uniform، والابتسامة).", size: 22 }),
        new Paragraph({ text: "\n\nتوقيع الطرف الأول (الفندق): ...........................               توقيع الطرف الثاني (الموظف): ...........................", bold: true, alignment: AlignmentType.CENTER })
      ]
    }]
  });

  const contractBuffer = await Packer.toBuffer(contractDoc);
  fs.writeFileSync(path.join(legalDir, 'عقد_عمل_مؤقت_وتعهد_فندقي.docx'), contractBuffer);
  console.log(`✅ Word Created: عقد_عمل_مؤقت_وتعهد_فندقي.docx`);
}

// ---------------------------------------------------------
// 4. تحديث خريطة توزيع المستندات (Update Sitemap)
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
    <div style="font-size: 9pt; color: #4a5568;">النسخة الشاملة المزودة بملفات Word (.docx) و Excel (.xlsx) القابلة للتعديل والطباعة المباشرة — 2026م</div>
  </div>

  <div class="folder-card">
    <div class="folder-name">📁 01_Accounting_System (النظام المحاسبي والماليات والجرد)</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>نظام_حجوزات_وتسكين_الغرف_الفندقي.xlsx:</strong> PMS وشاشة حالة الغرف الـ 25 التفاعلية.</li>
      <li><span class="badge-excel">EXCEL</span> <strong>جدول_رواتب_وتقييم_الموظفين_الشهري.xlsx:</strong> كشف الرواتب والـ KPIs وحضور وانصراف الموظفين.</li>
      <li><span class="badge-word">WORD</span> <span class="badge-pdf">PDF</span> <strong>سياسة_النقدية_والتعامل_مع_الخزينة_Cash_Policy.docx / pdf:</strong> السياسة المالية والخزينة.</li>
    </ul>

    <div style="font-weight: bold; color: #78350f; margin-top: 6px;">📂 مستندات_ورقيات_الاستقبال (Word & PDF القابلة للتعبئة):</div>
    <ul>
      <li><span class="badge-word">WORD</span> <strong>بطاقة_تسجيل_النزيل_Registration_Card.docx</strong></li>
      <li><span class="badge-word">WORD</span> <strong>إيصال_سداد_وتحصيل_نقدية_Guest_Receipt.docx</strong></li>
      <li><span class="badge-word">WORD</span> <strong>فاتورة_وكشف_حساب_النزيل_Guest_Folio.docx</strong></li>
      <li><span class="badge-pdf">PDF</span> <strong>04_تقرير_تسليم_وتسلم_وردية_الاستقبال_Shift_Handover.pdf</strong></li>
      <li><span class="badge-pdf">PDF</span> <strong>05_سجل_الأمانات_والمفقودات_Safe_Deposit_Lost_Found.pdf</strong></li>
    </ul>

    <div style="font-weight: bold; color: #2B6CB0; margin-top: 6px;">📂 نماذج_جرد_الغرف_والمخازن (Word & Excel):</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_جرد_الغرف_والمخازن_الفندقية_المطور.xlsx:</strong> الجرد التفاعلي بالـ 40 عمود رأسي والخانات الفاضية.</li>
      <li><span class="badge-word">WORD</span> <strong>01_استمارة_جرد_مشتملات_الغرفة_الفندقية_Room_Inventory.docx</strong></li>
      <li><span class="badge-pdf">PDF</span> <strong>02_استمارة_جرد_وتقفيل_المخازن_Store_Audit_Sheet.pdf</strong></li>
    </ul>

    <div style="font-weight: bold; color: #2C5282; margin-top: 6px;">📂 مستندات_الإشراف_الداخلي_والغرف (Housekeeping Files):</div>
    <ul>
      <li><span class="badge-excel">EXCEL</span> <strong>سجل_تتبع_حركة_الكتانيات_والمغسلة_اليومي.xlsx</strong></li>
      <li><span class="badge-word">WORD</span> <strong>03_طلب_وإذن_صيانة_الغرف_والأعطال_Maintenance_Order.docx</strong></li>
    </ul>
  </div>

  <div class="folder-card" style="border-right-color: #D9822B;">
    <div class="folder-name">📁 02_Contracts_and_Legal (العقود واللوائح القانونية)</div>
    <ul>
      <li><span class="badge-word">WORD</span> <span class="badge-pdf">PDF</span> <strong>عقد_عمل_مؤقت_وتعهد_فندقي.docx / pdf:</strong> عقد العمل الموحد بالـ 75% والـ 25%.</li>
    </ul>
  </div>

</body>
</html>`;

  fs.writeFileSync(sitemapHtmlPath, sitemapContent, 'utf8');
  convertHtmlToPdf(sitemapHtmlPath, sitemapPdfPath);
}

async function main() {
  await generateFrontOfficeWordDocs();
  await generateHousekeepingAndInventoryWordDocs();
  await generateLegalWordDocs();
  updateSitemap();
  console.log('\n✨ ALL WORD DOCS GENERATED AND SITEMAP UPDATED SUCCESSFULLY!');
}

main().catch(err => console.error(err));
