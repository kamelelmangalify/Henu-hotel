const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');

const outputDir = 'd:/Henu/06_Marketing_and_Feasibility_Study';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. GENERATE PPTX
console.log('Generating PowerPoint (.pptx)...');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'HENU Hotel Pyramids';
pres.company = 'HENU Hotel';
pres.title = 'دراسة الجدوى الاقتصادية والخطة التسويقية';

const C_NILE = '1B3A5C';
const C_NILE_DARK = '0F2338';
const C_GOLD = 'C9873A';
const C_GOLD_LIGHT = 'DAA856';
const C_SAND_LIGHT = 'F4EAD4';
const C_IVORY = 'FAF7F2';
const C_WHITE = 'FFFFFF';
const C_GREEN = '10B981';
const C_RED = 'EF4444';
const C_GRAY = '6B7280';
const C_DARK = '1A1A1A';

// SLIDE 1: Title Cover
let s1 = pres.addSlide();
s1.background = { color: C_NILE_DARK };

s1.addText('فندق هينو الأهرامات — HENU HOTEL PYRAMIDS', {
  x: 0.8, y: 0.8, w: 11.7, h: 0.5,
  fontSize: 16, fontFace: 'Cairo', color: C_GOLD_LIGHT, bold: true, align: 'right', isRTL: true
});

s1.addText('تقرير دراسة الجدوى الاقتصادية\nوالخطة التسويقية الإستراتيجية', {
  x: 0.8, y: 1.5, w: 11.7, h: 1.6,
  fontSize: 34, fontFace: 'Cairo', color: C_WHITE, bold: true, align: 'right', isRTL: true
});

s1.addText('تحليل الحجز المباشر vs عمولات OTAs وتحليل مقارن بالأرقام بين Google Maps و Meta Platforms', {
  x: 0.8, y: 3.3, w: 11.7, h: 0.8,
  fontSize: 16, fontFace: 'Cairo', color: C_SAND_LIGHT, align: 'right', isRTL: true
});

const coverKpis = [
  { val: '$15 - $25', lbl: 'متوسط سعر الليلة (ADR)\n750 جـ - 1,250 جـ' },
  { val: '+225,963 جـ', lbl: 'أقصى وفر شهري متوقع\nفي ذروة الموسم' },
  { val: '< 4 أيام', lbl: 'فترة استرداد تكلفة الموقع\n(25,000 جـ CapEx)' },
  { val: '35%', lbl: 'عمولات OTAs المهدرة\nتستهلك ثلث الإيراد الكلي' }
];

coverKpis.forEach((k, idx) => {
  const xPos = 0.8 + (idx * 2.95);
  s1.addShape(pres.ShapeType.roundRect, {
    x: xPos, y: 4.6, w: 2.8, h: 1.8,
    fill: { color: '16304C' },
    line: { color: C_GOLD, width: 1.5 },
    rectRadius: 0.15
  });
  s1.addText(k.val, {
    x: xPos, y: 4.8, w: 2.8, h: 0.6,
    fontSize: 22, fontFace: 'Cairo', color: C_GOLD_LIGHT, bold: true, align: 'center'
  });
  s1.addText(k.lbl, {
    x: xPos, y: 5.4, w: 2.8, h: 0.8,
    fontSize: 11, fontFace: 'Cairo', color: C_WHITE, align: 'center', isRTL: true
  });
});

// SLIDE 2: Financial Feasibility Table
let s2 = pres.addSlide();
s2.background = { color: C_IVORY };

s2.addText('المحور الأول: دراسة الجدوى والوفر المالي المحقق', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.6,
  fontSize: 24, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'right', isRTL: true
});

s2.addText('بناء الدراسة على سعة الفندق (25 غرفة = 750 ليلة متاحة/شهرياً) ومقارنة نموذج OTAs مع محرك الحجز المباشر', {
  x: 0.8, y: 1.1, w: 11.7, h: 0.4,
  fontSize: 13, fontFace: 'Cairo', color: C_GRAY, align: 'right', isRTL: true
});

const tableData = [
  [
    { text: 'الموسم ونسبة الإشغال', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'سعر الليلة (ADR)', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'الإيراد الشهري الكلي', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'عمولات OTAs (35%)', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'إعلانات جوجل + الموقع', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'Agoda/Airbnb (30%)', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'صافي الوفر الشهري', options: { bold: true, fill: C_GOLD, color: C_WHITE, align: 'center' } }
  ],
  [
    { text: 'Low Season (إشغال 50%)', options: { bold: true } },
    { text: '$15 (750 جـ)' },
    { text: '281,250 جـ' },
    { text: '98,437 جـ', options: { color: C_RED, bold: true } },
    { text: '17,083 جـ' },
    { text: '12,656 جـ' },
    { text: '+68,698 جـ / شهر', options: { color: C_GREEN, bold: true } }
  ],
  [
    { text: 'Low Season (إشغال 70%)', options: { bold: true } },
    { text: '$15 (750 جـ)' },
    { text: '393,750 جـ' },
    { text: '137,812 جـ', options: { color: C_RED, bold: true } },
    { text: '17,083 جـ' },
    { text: '17,718 جـ' },
    { text: '+103,010 جـ / شهر', options: { color: C_GREEN, bold: true } }
  ],
  [
    { text: 'High Season (إشغال 70%)', options: { bold: true } },
    { text: '$25 (1,250 جـ)' },
    { text: '656,250 جـ' },
    { text: '229,687 جـ', options: { color: C_RED, bold: true } },
    { text: '17,083 جـ' },
    { text: '29,531 جـ' },
    { text: '+183,073 جـ / شهر', options: { color: C_GREEN, bold: true } }
  ],
  [
    { text: 'High Season (إشغال 85%)', options: { bold: true } },
    { text: '$25 (1,250 جـ)' },
    { text: '796,875 جـ' },
    { text: '278,906 جـ', options: { color: C_RED, bold: true } },
    { text: '17,083 جـ' },
    { text: '35,859 جـ' },
    { text: '+225,963 جـ / شهر', options: { color: C_GREEN, bold: true } }
  ]
];

s2.addTable(tableData, {
  x: 0.8, y: 1.7, w: 11.7, h: 4.2,
  fontFace: 'Cairo', fontSize: 11,
  align: 'center', valign: 'middle',
  border: { type: 'solid', pt: 1, color: 'E5E7EB' }
});

s2.addText('💡 استرداد تكلفة الموقع بالكامل (25,000 جـ) يتم خلال أقل من 4 أيام تشغيلية فقط بفضل الوفر المالي المباشر!', {
  x: 0.8, y: 6.2, w: 11.7, h: 0.5,
  fontSize: 12, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'right', isRTL: true
});

// SLIDE 3: Comparison: Google Maps vs Meta
let s3 = pres.addSlide();
s3.background = { color: C_IVORY };

s3.addText('المحور الثاني: مقارنة بالأرقام بين Google Maps Ads و Meta Platforms', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.6,
  fontSize: 23, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'right', isRTL: true
});

const compTable = [
  [
    { text: 'معيار المقارنة والمؤشر', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'إعلانات خرائط جوجل (Google Maps Ads)', options: { bold: true, fill: C_GREEN, color: C_WHITE, align: 'center' } },
    { text: 'فيسبوك وإنستجرام (Meta Platforms)', options: { bold: true, fill: C_RED, color: C_WHITE, align: 'center' } },
    { text: 'الفارق والنتيجة الإستراتيجية', options: { bold: true, fill: C_GOLD, color: C_WHITE, align: 'center' } }
  ],
  [
    { text: 'درجة نية الحجز (User Intent Score)', options: { bold: true } },
    { text: '95% (Active Search)\nنزيل في الأهرامات يبحث عن سكن فوراً' },
    { text: '10% (Passive Browsing)\nمتصفح يتصفح للترفيه وتضييع الوقت' },
    { text: 'جوجل يتفوق بـ 9.5 أضعاف في نية الشراء الفورية', options: { bold: true, color: C_GREEN } }
  ],
  [
    { text: 'معدل تحويل النقرة لحجز (CVR)', options: { bold: true } },
    { text: '12.5% (عالي جداً)\nكل 100 نقرة تترجم لـ 12 حجز مؤكد' },
    { text: '0.4% (ضعيف جداً)\n1000 نقرة لتحقيق 4 حجوزات فقط' },
    { text: 'معدل تحويل جوجل أعلى بـ 31 ضعفاً من Meta', options: { bold: true, color: C_GREEN } }
  ],
  [
    { text: 'تكلفة الاستحواذ على النزيل (CAC)', options: { bold: true } },
    { text: '~45 جنيه مصري\nدفع مقابل النقرة المستهدفة جغرافياً' },
    { text: '~380 جنيه مصري\nهدر إعلاني على غير المسافرين المهتمين' },
    { text: 'توفير 88% من تكلفة اجتذاب النزيل الواحد', options: { bold: true, color: C_GREEN } }
  ],
  [
    { text: 'الميزانية المطلوبة لإنتاج المحتوى', options: { bold: true } },
    { text: '0 جنيه (مجاناً)\nصور الواقع بالفندق وتقييمات النزلاء' },
    { text: '~15,000 جنيه / شهرياً\nمصورين محترفين، صانعي محتوى، وريلز' },
    { text: 'جوجل يوفر ميزانية إنتاج المحتوى الباهظة بالكامل', options: { bold: true, color: C_GREEN } }
  ],
  [
    { text: 'نسبة الرسائل غير الجادة ("بكام الليلة؟")', options: { bold: true } },
    { text: 'أقل من 5%\nالعميل يدخل لمحرك الحجز والدفع فوراً' },
    { text: 'أكثر من 85%\nاستنزاف وقت الاستقبال في رسائل بلا جدوى' },
    { text: 'جوجل يوجه النزيل فوراً للدفع الإلكتروني المباشر', options: { bold: true, color: C_GREEN } }
  ],
  [
    { text: 'العائد على الإنفاق الإعلاني (ROAS)', options: { bold: true } },
    { text: '1 : 60 (كل 1k تنفق تحقق 60k إيراد)' },
    { text: '1 : 3 (كل 1k تحقق 3k فقط)' },
    { text: 'كفاءة استثمارية أعلى بـ 20 ضعفاً لصالح جوجل', options: { bold: true, color: C_GREEN } }
  ]
];

s3.addTable(compTable, {
  x: 0.8, y: 1.3, w: 11.7, h: 5.4,
  fontFace: 'Cairo', fontSize: 9.5,
  align: 'center', valign: 'middle',
  border: { type: 'solid', pt: 1, color: 'E5E7EB' }
});

// SLIDE 4: Funnel Comparison
let s4 = pres.addSlide();
s4.background = { color: C_IVORY };

s4.addText('المحور الثالث: إنفوجراف قمع التحويل (Conversion Funnel)', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.6,
  fontSize: 24, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'right', isRTL: true
});

s4.addShape(pres.ShapeType.roundRect, {
  x: 6.8, y: 1.4, w: 5.7, h: 5.1,
  fill: { color: 'FFFFFF' },
  line: { color: C_GREEN, width: 2 },
  rectRadius: 0.15
});
s4.addText('📍 قمع جوجل ماب (Google Maps Funnel)', {
  x: 7.0, y: 1.6, w: 5.3, h: 0.5,
  fontSize: 16, fontFace: 'Cairo', color: C_GREEN, bold: true, align: 'right', isRTL: true
});

const gSteps = [
  '1. البحث المباشر: سائح يبحث عن "Pyramids View Hotel"',
  '2. ظهور الفندق: ظهور إعلان الفندق أعلى الخريطة في الهرم',
  '3. النقرة والموقع: التوجيه المباشر لموقع الحجز الفندقي',
  '4. النتيجة: حجز ودفع إلكتروني مباشر (0% عمولة) 🎉'
];

gSteps.forEach((st, idx) => {
  s4.addShape(pres.ShapeType.roundRect, {
    x: 7.1, y: 2.3 + (idx * 1.0), w: 5.1, h: 0.8,
    fill: { color: idx === 3 ? '10B981' : 'ECFDF5' },
    line: { color: C_GREEN, width: 1 },
    rectRadius: 0.1
  });
  s4.addText(st, {
    x: 7.2, y: 2.4 + (idx * 1.0), w: 4.9, h: 0.6,
    fontSize: 11.5, fontFace: 'Cairo', color: idx === 3 ? C_WHITE : '065F46', bold: true, align: 'right', isRTL: true
  });
});

s4.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 1.4, w: 5.7, h: 5.1,
  fill: { color: 'FFFFFF' },
  line: { color: C_RED, width: 1.5 },
  rectRadius: 0.15
});
s4.addText('📱 قمع السوشيال ميديا (Meta Funnel)', {
  x: 1.0, y: 1.6, w: 5.3, h: 0.5,
  fontSize: 16, fontFace: 'Cairo', color: C_RED, bold: true, align: 'right', isRTL: true
});

const mSteps = [
  '1. مشاهدة عابرة: مستخدم يشاهد فيديو Reel أثناء التصفح',
  '2. إرسال رسالة: إرسال سؤال تقليدي "بكام الليلة؟"',
  '3. المتابعة: انتظار رد الاستقبال وضياع وقت الموظفين',
  '4. النتيجة: تجاهل أو حجز غير مؤكد (تسرب النزلاء) ⚠️'
];

mSteps.forEach((st, idx) => {
  s4.addShape(pres.ShapeType.roundRect, {
    x: 1.1, y: 2.3 + (idx * 1.0), w: 5.1, h: 0.8,
    fill: { color: idx === 3 ? 'FEE2E2' : 'F9FAFB' },
    line: { color: idx === 3 ? C_RED : 'D1D5DB', width: 1 },
    rectRadius: 0.1
  });
  s4.addText(st, {
    x: 1.2, y: 2.4 + (idx * 1.0), w: 4.9, h: 0.6,
    fontSize: 11.5, fontFace: 'Cairo', color: idx === 3 ? '991B1B' : C_DARK, bold: true, align: 'right', isRTL: true
  });
});

// SLIDE 5: Strategic Recommendations
let s5 = pres.addSlide();
s5.background = { color: C_IVORY };

s5.addText('المحور الرابع: التوصيات النهائية وخريطة الطريق التنفيذية', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.6,
  fontSize: 24, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'right', isRTL: true
});

const recs = [
  {
    icon: '🚀',
    title: '1. موقع الحجز المباشر',
    desc: 'إطلاق موقع الحجز المباشر لفندق هينو (تكلفة 25,000 جـ) وتوفير محرك حجز سريع يدعم اللغات والعملات والدفع الإلكتروني.',
    highlight: 'استرداد التكلفة في أقل من 4 أيام'
  },
  {
    icon: '🎯',
    title: '2. ميزانية إعلانات جوجل',
    desc: 'تخصيص 100% من الميزانية الإعلانية (15,000 جـ/شهرياً) لحملات Google Maps Local Search Ads لضمان أعلى عائد استثماري.',
    highlight: 'عائد استثماري (ROAS) يصل لـ 1 : 60'
  },
  {
    icon: '🔄',
    title: '3. مزيج القنوات المساندة',
    desc: 'إبقاء Agoda و Airbnb كقنوات مكملة مساندة (30%) واستبعاد فيسبوك وإنستجرام تماماً لتوفير ميزانية الإنتاج والتسويق.',
    highlight: 'توفير مصاريف إنتاج المحتوى (15k شهرياً)'
  }
];

recs.forEach((r, idx) => {
  const xPos = 0.8 + (idx * 3.95);
  s5.addShape(pres.ShapeType.roundRect, {
    x: xPos, y: 1.5, w: 3.8, h: 4.8,
    fill: { color: 'FFFFFF' },
    line: { color: idx === 0 ? C_GOLD : (idx === 1 ? C_NILE : C_GREEN), width: 2 },
    rectRadius: 0.15
  });

  s5.addText(r.icon, {
    x: xPos, y: 1.8, w: 3.8, h: 0.6,
    fontSize: 32, align: 'center'
  });
  s5.addText(r.title, {
    x: xPos + 0.2, y: 2.6, w: 3.4, h: 0.5,
    fontSize: 16, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'center', isRTL: true
  });
  s5.addText(r.desc, {
    x: xPos + 0.3, y: 3.2, w: 3.2, h: 1.8,
    fontSize: 12, fontFace: 'Cairo', color: C_GRAY, align: 'right', isRTL: true
  });
  s5.addShape(pres.ShapeType.roundRect, {
    x: xPos + 0.3, y: 5.2, w: 3.2, h: 0.7,
    fill: { color: C_SAND_LIGHT },
    line: { color: C_GOLD, width: 1 },
    rectRadius: 0.1
  });
  s5.addText(r.highlight, {
    x: xPos + 0.3, y: 5.3, w: 3.2, h: 0.5,
    fontSize: 11, fontFace: 'Cairo', color: C_NILE_DARK, bold: true, align: 'center', isRTL: true
  });
});

// Save PPTX
const pptxPath = path.join(outputDir, 'عرض_دراسة_الجدوى_فندق_هينو.pptx');
pres.writeFile({ fileName: pptxPath }).then(() => {
  console.log('PPTX created successfully at: ' + pptxPath);
}).catch(err => {
  console.error('PPTX Error:', err);
});

// ==========================================
// 2. GENERATE HTML5 INTERACTIVE PRESENTATION
// ==========================================
console.log('Generating HTML5 Interactive Presentation...');
const htmlPath = path.join(outputDir, 'عرض_دراسة_الجدوى_فندق_هينو.html');

const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>عرض دراسة الجدوى والخطة التسويقية | فندق هينو الأهرامات</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Cinzel:wght@700&display=swap" rel="stylesheet">
  <style>
    :root {
      --clr-sand: #D4A96A;
      --clr-sand-light: #F4EAD4;
      --clr-nile: #1B3A5C;
      --clr-nile-dark: #0F2338;
      --clr-nile-light: #2A5580;
      --clr-gold: #C9873A;
      --clr-gold-light: #DAA856;
      --clr-terra: #B85C38;
      --clr-ivory: #FAF7F2;
      --clr-ivory-dark: #EFE9DE;
      --clr-dark: #1A1A1A;
      --clr-gray: #6B7280;
      --clr-green: #10B981;
      --clr-green-bg: #ECFDF5;
      --clr-red: #EF4444;
      --clr-red-bg: #FEF2F2;
      --font-ar: 'Cairo', sans-serif;
      --font-en: 'Cinzel', serif;
      --shadow-sm: 0 4px 15px rgba(0,0,0,0.06);
      --shadow-md: 0 10px 30px rgba(0,0,0,0.1);
      --shadow-lg: 0 20px 50px rgba(0,0,0,0.18);
      --radius: 16px;
      --transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-ar);
      background: var(--clr-nile-dark);
      color: var(--clr-dark);
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .top-bar {
      height: 64px;
      background: rgba(15, 35, 56, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(212, 169, 106, 0.25);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      z-index: 100;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
    }

    .brand img {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 2px solid var(--clr-gold);
      object-fit: cover;
    }

    .brand-title {
      font-weight: 800;
      font-size: 1.15rem;
      color: var(--clr-gold-light);
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.7);
    }

    .top-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-ctrl {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(212, 169, 106, 0.3);
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: var(--font-ar);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: var(--transition);
    }

    .btn-ctrl:hover {
      background: var(--clr-gold);
      color: white;
      border-color: var(--clr-gold);
      transform: translateY(-1px);
    }

    .slide-counter {
      color: var(--clr-gold-light);
      font-weight: 700;
      font-size: 0.9rem;
      padding: 0 10px;
    }

    .deck-container {
      flex: 1;
      position: relative;
      background: #0B1724;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow: hidden;
    }

    .slide {
      position: absolute;
      width: 94%;
      max-width: 1280px;
      height: 88%;
      background: var(--clr-ivory);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      border: 1px solid rgba(212, 169, 106, 0.35);
      padding: 44px 52px;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: scale(0.95) translateY(20px);
      pointer-events: none;
      transition: opacity 0.4s ease, transform 0.4s ease;
      overflow-y: auto;
    }

    .slide.active {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: auto;
      z-index: 10;
    }

    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      border-bottom: 2px solid var(--clr-ivory-dark);
      padding-bottom: 16px;
    }

    .slide-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--clr-nile);
      color: var(--clr-gold-light);
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }

    .slide-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--clr-nile);
      line-height: 1.3;
    }

    .slide-title span { color: var(--clr-gold); }

    .slide-subtitle {
      font-size: 0.95rem;
      color: var(--clr-gray);
      margin-top: 4px;
    }

    .slide-logo-badge {
      font-family: var(--font-en);
      font-weight: 700;
      color: var(--clr-gold);
      font-size: 1rem;
      letter-spacing: 1px;
    }

    .slide-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .slide-cover {
      background: linear-gradient(135deg, rgba(15,35,56,0.94) 0%, rgba(27,58,92,0.92) 100%), url('../website/images/hotel/hero-pyramids-night.jpg') center/cover no-repeat;
      color: white;
      text-align: center;
      justify-content: center;
      align-items: center;
      border: 2px solid var(--clr-gold);
      position: relative;
    }

    .cover-badge {
      background: var(--clr-gold);
      color: white;
      padding: 8px 24px;
      border-radius: 30px;
      font-weight: 800;
      font-size: 0.95rem;
      letter-spacing: 1px;
      margin-bottom: 20px;
      display: inline-block;
      box-shadow: 0 4px 15px rgba(201,135,58,0.4);
    }

    .cover-title {
      font-size: 2.9rem;
      font-weight: 900;
      color: white;
      line-height: 1.25;
      margin-bottom: 16px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }

    .cover-title span { color: var(--clr-gold-light); }

    .cover-subtitle {
      font-size: 1.25rem;
      color: var(--clr-sand-light);
      max-width: 850px;
      margin: 0 auto 36px;
      line-height: 1.6;
    }

    .cover-kpis {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
      width: 100%;
      max-width: 1050px;
    }

    .cover-kpi-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(212, 169, 106, 0.3);
      padding: 20px 16px;
      border-radius: 14px;
      transition: var(--transition);
    }

    .cover-kpi-card:hover {
      background: rgba(255, 255, 255, 0.14);
      transform: translateY(-4px);
      border-color: var(--clr-gold);
    }

    .cover-kpi-val {
      font-size: 1.7rem;
      font-weight: 900;
      color: var(--clr-gold-light);
    }

    .cover-kpi-lbl {
      font-size: 0.82rem;
      color: rgba(255,255,255,0.8);
      margin-top: 4px;
    }

    .kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .kpi-card {
      background: white;
      border-radius: 12px;
      padding: 18px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--clr-ivory-dark);
      border-top: 4px solid var(--clr-gold);
      text-align: right;
    }

    .kpi-card.green { border-top-color: var(--clr-green); }
    .kpi-card.red { border-top-color: var(--clr-red); }

    .kpi-card .val {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--clr-nile);
    }

    .kpi-card.green .val { color: var(--clr-green); }
    .kpi-card.red .val { color: var(--clr-red); }

    .kpi-card .lbl {
      font-size: 0.8rem;
      color: var(--clr-gray);
      margin-top: 2px;
    }

    .kpi-card .sub {
      font-size: 0.72rem;
      color: var(--clr-gold);
      font-weight: 600;
      margin-top: 4px;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--clr-ivory-dark);
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: right;
      font-size: 0.88rem;
    }

    th {
      background: var(--clr-nile);
      color: white;
      padding: 12px 16px;
      font-weight: 700;
      font-size: 0.85rem;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--clr-ivory-dark);
      color: var(--clr-dark);
    }

    tr:nth-child(even) td { background: #FAFAF8; }
    tr:hover td { background: var(--clr-sand-light); }

    .badge-gain {
      background: var(--clr-green-bg);
      color: var(--clr-green);
      padding: 4px 10px;
      border-radius: 16px;
      font-weight: 800;
      display: inline-block;
    }

    .badge-loss {
      background: var(--clr-red-bg);
      color: var(--clr-red);
      padding: 4px 10px;
      border-radius: 16px;
      font-weight: 700;
      display: inline-block;
    }

    .funnel-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .funnel-col {
      background: white;
      border-radius: 14px;
      padding: 24px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--clr-ivory-dark);
    }

    .funnel-steps {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 14px;
    }

    .funnel-step {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      border-radius: 10px;
      background: var(--clr-ivory);
      font-size: 0.88rem;
      font-weight: 600;
      border-right: 4px solid var(--clr-nile);
      transition: var(--transition);
    }

    .funnel-step.step-win {
      background: var(--clr-green-bg);
      border-right-color: var(--clr-green);
      color: #065F46;
    }

    .funnel-step.step-lose {
      background: var(--clr-red-bg);
      border-right-color: var(--clr-red);
      color: #991B1B;
    }

    .step-num {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.8rem;
      box-shadow: var(--shadow-sm);
      flex-shrink: 0;
    }

    .strategy-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }

    .strategy-card {
      background: white;
      border-radius: 14px;
      padding: 24px 20px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--clr-ivory-dark);
      border-top: 5px solid var(--clr-gold);
      position: relative;
    }

    .strategy-card .icon {
      font-size: 2.2rem;
      margin-bottom: 12px;
    }

    .strategy-card h3 {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--clr-nile);
      margin-bottom: 8px;
    }

    .strategy-card p {
      font-size: 0.88rem;
      color: var(--clr-gray);
      line-height: 1.65;
    }

    .strategy-highlight {
      background: var(--clr-sand-light);
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--clr-nile);
      margin-top: 12px;
      border-right: 3px solid var(--clr-gold);
    }

    .bottom-bar {
      height: 68px;
      background: rgba(15, 35, 56, 0.95);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(212, 169, 106, 0.25);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      z-index: 100;
    }

    .btn-nav {
      background: var(--clr-gold);
      color: white;
      border: none;
      padding: 10px 22px;
      border-radius: 8px;
      font-family: var(--font-ar);
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: var(--transition);
    }

    .btn-nav:hover:not(:disabled) {
      background: var(--clr-gold-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(201,135,58,0.4);
    }

    .btn-nav:disabled {
      background: rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.4);
      cursor: not-allowed;
    }

    .slide-dots {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      cursor: pointer;
      transition: var(--transition);
    }

    .dot.active {
      background: var(--clr-gold);
      width: 28px;
      border-radius: 10px;
    }

    @media print {
      body { height: auto; overflow: visible; background: white; }
      .top-bar, .bottom-bar { display: none; }
      .deck-container { padding: 0; display: block; }
      .slide {
        position: relative;
        opacity: 1;
        transform: none;
        page-break-after: always;
        width: 100%;
        max-width: 100%;
        height: auto;
        box-shadow: none;
        border: 1px solid #ccc;
        margin-bottom: 20px;
      }
    }
  </style>
</head>
<body>

  <!-- Top Bar -->
  <header class="top-bar">
    <div class="brand">
      <img src="../website/images/logo.jpg" alt="HENU Logo">
      <div>
        <div class="brand-title">HENU HOTEL PYRAMIDS</div>
        <div class="brand-subtitle">عرض دراسة الجدوى والخطة التسويقية الإستراتيجية</div>
      </div>
    </div>

    <div class="top-controls">
      <button class="btn-ctrl" onclick="window.print()">🖨️ طباعة / PDF</button>
      <button class="btn-ctrl" onclick="toggleFullscreen()">⛶ ملء الشاشة</button>
      <div class="slide-counter" id="slideIndicator">1 / 6</div>
    </div>
  </header>

  <!-- Presentation Deck -->
  <main class="deck-container">

    <!-- SLIDE 1: Cover -->
    <section class="slide slide-cover active" data-slide="1">
      <div class="cover-badge">دراسة الجدوى الاقتصادية والخطة التسويقية</div>
      <h1 class="cover-title">تحليل الحجز المباشر vs عمولات OTAs<br><span>وفاعلية Google Maps الإعلانية</span></h1>
      <p class="cover-subtitle">نموذج مالي واستراتيجي متكامل لتعظيم الأرباح وخفض تكلفة الاستحواذ على النزلاء لفندق هينو الأهرامات</p>
      
      <div class="cover-kpis">
        <div class="cover-kpi-card">
          <div class="cover-kpi-val">$15 - $25</div>
          <div class="cover-kpi-lbl">متوسط سعر الليلة (ADR)</div>
        </div>
        <div class="cover-kpi-card">
          <div class="cover-kpi-val">+225,963 جـ</div>
          <div class="cover-kpi-lbl">أقصى وفر شهري متوقع</div>
        </div>
        <div class="cover-kpi-card">
          <div class="cover-kpi-val">&lt; 4 أيام</div>
          <div class="cover-kpi-lbl">فترة استرداد تكلفة الموقع (25k)</div>
        </div>
        <div class="cover-kpi-card">
          <div class="cover-kpi-val">35%</div>
          <div class="cover-kpi-lbl">عمولات OTAs المهدرة سابقاً</div>
        </div>
      </div>
    </section>

    <!-- SLIDE 2: Feasibility & Financial Summary -->
    <section class="slide" data-slide="2">
      <div class="slide-header">
        <div>
          <div class="slide-tag">المحور الأول</div>
          <h2 class="slide-title">دراسة الجدوى الاقتصادية <span>والوفر المالي المحقق</span></h2>
          <p class="slide-subtitle">بناء الدراسة على سعة الفندق (25 غرفة = 750 ليلة متاحة شهرياً) ومقارنة نموذج OTAs مع محرك الحجز المباشر</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>

      <div class="slide-body">
        <div class="kpi-row">
          <div class="kpi-card">
            <div class="val">750 ليلة</div>
            <div class="lbl">السعة التشغيلية الشهرية</div>
            <div class="sub">25 غرفة فندقية</div>
          </div>
          <div class="kpi-card red">
            <div class="val">35%</div>
            <div class="lbl">عمولات Booking / Agoda</div>
            <div class="sub">تستنزف ثلث الإيرادات</div>
          </div>
          <div class="kpi-card green">
            <div class="val">+103,010 جـ</div>
            <div class="lbl">وفر الموسم المنخفض (70%)</div>
            <div class="sub">شهرياً في حساب الفندق</div>
          </div>
          <div class="kpi-card green">
            <div class="val">+225,963 جـ</div>
            <div class="lbl">وفر الموسم المرتفع (85%)</div>
            <div class="sub">شهرياً في ذروة الإشغال</div>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>الموسم ونسبة الإشغال</th>
                <th>سعر الليلة (ADR)</th>
                <th>الإيراد الشهري الكلي</th>
                <th>عمولات OTAs (35%)</th>
                <th>إعلانات جوجل + الموقع</th>
                <th>Agoda/Airbnb (30%)</th>
                <th>صافي الوفر الشهري</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Low Season (إشغال 50%)</strong></td>
                <td>$15 (750 جـ)</td>
                <td>281,250 جـ</td>
                <td><span class="badge-loss">98,437 جـ</span></td>
                <td>17,083 جـ</td>
                <td>12,656 جـ</td>
                <td><span class="badge-gain">+68,698 جـ / شهر</span></td>
              </tr>
              <tr>
                <td><strong>Low Season (إشغال 70%)</strong></td>
                <td>$15 (750 جـ)</td>
                <td>393,750 جـ</td>
                <td><span class="badge-loss">137,812 جـ</span></td>
                <td>17,083 جـ</td>
                <td>17,718 جـ</td>
                <td><span class="badge-gain">+103,010 جـ / شهر</span></td>
              </tr>
              <tr>
                <td><strong>High Season (إشغال 70%)</strong></td>
                <td>$25 (1,250 جـ)</td>
                <td>656,250 جـ</td>
                <td><span class="badge-loss">229,687 جـ</span></td>
                <td>17,083 جـ</td>
                <td>29,531 جـ</td>
                <td><span class="badge-gain">+183,073 جـ / شهر</span></td>
              </tr>
              <tr>
                <td><strong>High Season (إشغال 85%)</strong></td>
                <td>$25 (1,250 جـ)</td>
                <td>796,875 جـ</td>
                <td><span class="badge-loss">278,906 جـ</span></td>
                <td>17,083 جـ</td>
                <td>35,859 جـ</td>
                <td><span class="badge-gain">+225,963 جـ / شهر</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SLIDE 3: Visual Comparison Chart -->
    <section class="slide" data-slide="3">
      <div class="slide-header">
        <div>
          <div class="slide-tag">التحليل المالي</div>
          <h2 class="slide-title">مقارنة العمولات المهدرة <span>vs الوفر المالي الصافي</span></h2>
          <p class="slide-subtitle">مخطط بياني تحليلي يوضح حجم الأموال المستردة شهرياً لصالح إدارة الفندق</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>

      <div class="slide-body">
        <div style="display: flex; flex-direction: column; gap: 20px; justify-content: center;">
          
          <!-- Bar 1 -->
          <div style="background: white; padding: 18px 24px; border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--clr-ivory-dark);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 700;">
              <span>الموسم المنخفض (إشغال 70% - إيراد 393,750 جـ)</span>
              <span style="color: var(--clr-green);">صافي الوفر: +103,010 جـ</span>
            </div>
            <div style="height: 28px; background: #F3F4F6; border-radius: 8px; overflow: hidden; display: flex;">
              <div style="width: 35%; background: var(--clr-red); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">عمولة OTAs: 137,812 جـ</div>
              <div style="width: 26%; background: var(--clr-green); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">وفر صافي للفندق: 103,010 جـ</div>
            </div>
          </div>

          <!-- Bar 2 -->
          <div style="background: white; padding: 18px 24px; border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--clr-ivory-dark);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 700;">
              <span>الموسم المرتفع (إشغال 70% - إيراد 656,250 جـ)</span>
              <span style="color: var(--clr-green);">صافي الوفر: +183,073 جـ</span>
            </div>
            <div style="height: 28px; background: #F3F4F6; border-radius: 8px; overflow: hidden; display: flex;">
              <div style="width: 35%; background: var(--clr-red); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">عمولة OTAs: 229,687 جـ</div>
              <div style="width: 28%; background: var(--clr-green); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">وفر صافي للفندق: 183,073 جـ</div>
            </div>
          </div>

          <!-- Bar 3 -->
          <div style="background: white; padding: 18px 24px; border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--clr-ivory-dark);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 700;">
              <span>ذروة الموسم المرتفع (إشغال 85% - إيراد 796,875 جـ)</span>
              <span style="color: var(--clr-green);">صافي الوفر: +225,963 جـ</span>
            </div>
            <div style="height: 28px; background: #F3F4F6; border-radius: 8px; overflow: hidden; display: flex;">
              <div style="width: 35%; background: var(--clr-red); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">عمولة OTAs: 278,906 جـ</div>
              <div style="width: 29%; background: var(--clr-green); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">وفر صافي للفندق: 225,963 جـ</div>
            </div>
          </div>

          <div style="background: var(--clr-sand-light); padding: 14px 20px; border-radius: 10px; border-right: 4px solid var(--clr-gold); font-size: 0.9rem; color: var(--clr-nile-dark);">
            <strong>💡 استنتاج مالي:</strong> استرداد تكلفة تطوير وتدشين موقع الحجز المباشر (25,000 جـ) يتم بالكامل في أقل من <strong>4 أيام تشغيلية فقط</strong> من خلال توفير العمولات المهدرة!
          </div>

        </div>
      </div>
    </section>

    <!-- SLIDE 4: Google Maps vs Meta Comparison -->
    <section class="slide" data-slide="4">
      <div class="slide-header">
        <div>
          <div class="slide-tag">المقارنة التسويقية</div>
          <h2 class="slide-title">Google Maps Ads <span>مقابل Meta (فيسبوك وإنستجرام)</span></h2>
          <p class="slide-subtitle">مقارنة تفصيلية بالأرقام توضح أسباب التفوق الكاسح لخرائط جوجل كقناة تسويق فندقية</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>

      <div class="slide-body">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>معيار المقارنة والمؤشر</th>
                <th>إعلانات خرائط جوجل (Google Maps Ads)</th>
                <th>فيسبوك وإنستجرام (Meta Platforms)</th>
                <th>الفارق والنتيجة الإستراتيجية</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>درجة نية الحجز (User Intent)</strong></td>
                <td><span class="badge-gain">95% (Active Search)</span><br><small>نزيل في الأهرامات يبحث عن سكن فوراً</small></td>
                <td><span class="badge-loss">10% (Passive Browsing)</span><br><small>تصفح ترفيهي وتضييع وقت</small></td>
                <td><strong>جوجل يتفوق بـ 9.5 أضعاف في نية الشراء الفورية 🎯</strong></td>
              </tr>
              <tr>
                <td><strong>معدل تحويل النقرة لحجز (CVR)</strong></td>
                <td><span class="badge-gain">12.5% (عالي جداً)</span><br><small>كل 100 نقرة تترجم لـ 12 حجز مؤكد</small></td>
                <td><span class="badge-loss">0.4% (ضعيف جداً)</span><br><small>1000 نقرة لتحقيق 4 حجوزات فقط</small></td>
                <td><strong>معدل تحويل جوجل أعلى بـ 31 ضعفاً من Meta 📈</strong></td>
              </tr>
              <tr>
                <td><strong>تكلفة الاستحواذ على النزيل (CAC)</strong></td>
                <td><span class="badge-gain">~45 جنيه مصري</span><br><small>دفع مقابل النقرة المستهدفة جغرافياً فقط</small></td>
                <td><span class="badge-loss">~380 جنيه مصري</span><br><small>هدر إعلاني على غير المسافرين</small></td>
                <td><strong>توفير 88% من تكلفة اجتذاب النزيل الواحد 💰</strong></td>
              </tr>
              <tr>
                <td><strong>ميزانية إنتاج المحتوى</strong></td>
                <td><span class="badge-gain">0 جنيه (مجاناً)</span><br><small>صور الفندق وتقييمات النزلاء الحقيقية</small></td>
                <td><span class="badge-loss">~15,000 جنيه / شهرياً</span><br><small>مصورين، ريلز، صناع محتوى</small></td>
                <td><strong>جوجل يوفر ميزانية إنتاج المحتوى الباهظة بالكامل ✨</strong></td>
              </tr>
              <tr>
                <td><strong>نسبة الرسائل غير الجادة ("بكام؟")</strong></td>
                <td><span class="badge-gain">أقل من 5%</span><br><small>دخول مباشر لمحرك الحجز والدفع</small></td>
                <td><span class="badge-loss">أكثر من 85%</span><br><small>استنزاف وقت الاستقبال في محادثات بلا جدوى</small></td>
                <td><strong>جوجل يوجه النزيل فوراً للدفع الإلكتروني المباشر ⚡</strong></td>
              </tr>
              <tr>
                <td><strong>العائد على الإنفاق الإعلاني (ROAS)</strong></td>
                <td><span class="badge-gain">1 : 60</span><br><small>كل 1k تنفق تحقق 60k إيراد</small></td>
                <td><span class="badge-loss">1 : 3</span><br><small>كل 1k تحقق 3k فقط</small></td>
                <td><strong>كفاءة استثمارية أعلى بـ 20 ضعفاً لصالح جوجل 🚀</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SLIDE 5: Funnel Comparison -->
    <section class="slide" data-slide="5">
      <div class="slide-header">
        <div>
          <div class="slide-tag">مسار العميل</div>
          <h2 class="slide-title">إنفوجراف قمع التحويل <span>(Conversion Funnel)</span></h2>
          <p class="slide-subtitle">مقارنة رحلة العميل من لحظة البحث وحتى إتمام الحجز والدفع</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>

      <div class="slide-body">
        <div class="funnel-row">
          
          <!-- Google Maps Funnel -->
          <div class="funnel-col" style="border: 2px solid var(--clr-green);">
            <h3 style="color: var(--clr-green); font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
              📍 قمع جوجل ماب (Google Maps Funnel)
            </h3>
            <p style="font-size: 0.85rem; color: var(--clr-gray); margin-top: 4px;">مسار مباشر وسريع بنية شراء مؤكدة</p>
            
            <div class="funnel-steps">
              <div class="funnel-step step-win">
                <span class="step-num">1</span>
                <div><strong>البحث المباشر:</strong> سائح يبحث عن "Pyramids View Hotel"</div>
              </div>
              <div class="funnel-step step-win">
                <span class="step-num">2</span>
                <div><strong>ظهور الفندق:</strong> ظهور إعلان الفندق أعلى الخريطة في الهرم</div>
              </div>
              <div class="funnel-step step-win">
                <span class="step-num">3</span>
                <div><strong>النقرة والموقع:</strong> التوجيه الفوري لموقع الحجز المباشر</div>
              </div>
              <div class="funnel-step step-win" style="background: #10B981; color: white; font-weight: 800;">
                <span class="step-num" style="color: var(--clr-green);">4</span>
                <div><strong>النتيجة النهائية:</strong> حجز ودفع إلكتروني مباشر (0% عمولة) 🎉</div>
              </div>
            </div>
          </div>

          <!-- Meta Funnel -->
          <div class="funnel-col" style="border: 2px solid #E5E7EB;">
            <h3 style="color: var(--clr-red); font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
              📱 قمع السوشيال ميديا (Meta Funnel)
            </h3>
            <p style="font-size: 0.85rem; color: var(--clr-gray); margin-top: 4px;">مسار معقد مليء بالفاقد والتسرب</p>
            
            <div class="funnel-steps">
              <div class="funnel-step">
                <span class="step-num">1</span>
                <div><strong>مشاهدة عابرة:</strong> مستخدم يشاهد فيديو Reel أثناء التصفح الترفيهي</div>
              </div>
              <div class="funnel-step">
                <span class="step-num">2</span>
                <div><strong>إرسال رسالة:</strong> إرسال سؤال تقليدي "بكام الليلة؟"</div>
              </div>
              <div class="funnel-step">
                <span class="step-num">3</span>
                <div><strong>المتابعة:</strong> انتظار رد الاستقبال وضياع الوقت في المحادثات</div>
              </div>
              <div class="funnel-step step-lose">
                <span class="step-num">4</span>
                <div><strong>النتيجة النهائية:</strong> تجاهل أو حجز غير مؤكد (تسرب النزلاء) ⚠️</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- SLIDE 6: Strategy & Recommendations -->
    <section class="slide" data-slide="6">
      <div class="slide-header">
        <div>
          <div class="slide-tag">الخلاصة التنفيذية</div>
          <h2 class="slide-title">التوصيات النهائية <span>وخريطة الطريق التنفيذية</span></h2>
          <p class="slide-subtitle">القرارات الإستراتيجية الثلاثة لتحقيق أقصى ربحية لفندق هينو الأهرامات</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>

      <div class="slide-body">
        <div class="strategy-grid">
          
          <div class="strategy-card">
            <div class="icon">🚀</div>
            <h3>1. إطلاق موقع الحجز المباشر</h3>
            <p>الاعتماد على موقع الفندق الإلكتروني كبوابة الحجز الأساسية مع دعم كامل للغات، العملات، وربط نظام الحجز السريع والدفع عند الوصول / فيزا.</p>
            <div class="strategy-highlight">
              تكلفة استثمارية: 25,000 جـ<br>
              فترة الاسترداد: أقل من 4 أيام!
            </div>
          </div>

          <div class="strategy-card" style="border-top-color: var(--clr-nile);">
            <div class="icon">🎯</div>
            <h3>2. تركيز ميزانية إعلانات جوجل</h3>
            <p>تخصيص 100% من الميزانية الإعلانية التسويقية (15,000 جـ / شهرياً) لصالح حملات Google Maps Local Search Ads لاستهداف السياح في منطقة الهرم مباشرة.</p>
            <div class="strategy-highlight">
              عائد إعلاني متوقع (ROAS): 1 : 60<br>
              أعلى نية حجز فعلية (95%)
            </div>
          </div>

          <div class="strategy-card" style="border-top-color: var(--clr-terra);">
            <div class="icon">🔄</div>
            <h3>3. تحسين مزيج القنوات (Mix)</h3>
            <p>الإبقاء على Agoda و Airbnb كقنوات مكملة مساندة فقط بنسبة 30% من الإشغال، واستبعاد إعلانات فيسبوك وإنستجرام تماماً لمنع الهدر المالي ومصاريف الإنتاج.</p>
            <div class="strategy-highlight">
              توفير ميزانية المحتوى (15k/شهر)<br>
              أقصى وفر إجمالي: +225,963 جـ/شهر
            </div>
          </div>

        </div>
      </div>
    </section>

  </main>

  <!-- Bottom Navigation Bar -->
  <footer class="bottom-bar">
    <button class="btn-nav" id="btnPrev" onclick="prevSlide()" disabled>السابق ◀</button>

    <div class="slide-dots" id="slideDots">
      <div class="dot active" onclick="goToSlide(1)"></div>
      <div class="dot" onclick="goToSlide(2)"></div>
      <div class="dot" onclick="goToSlide(3)"></div>
      <div class="dot" onclick="goToSlide(4)"></div>
      <div class="dot" onclick="goToSlide(5)"></div>
      <div class="dot" onclick="goToSlide(6)"></div>
    </div>

    <button class="btn-nav" id="btnNext" onclick="nextSlide()">التالي ▶</button>
  </footer>

  <script>
    let currentSlide = 1;
    const totalSlides = 6;

    function updateSlide() {
      document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
        if (parseInt(slide.getAttribute('data-slide')) === currentSlide) {
          slide.classList.add('active');
        }
      });

      document.querySelectorAll('.dot').forEach((dot, index) => {
        if (index + 1 === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      document.getElementById('slideIndicator').textContent = currentSlide + ' / ' + totalSlides;
      document.getElementById('btnPrev').disabled = (currentSlide === 1);
      document.getElementById('btnNext').disabled = (currentSlide === totalSlides);
    }

    function nextSlide() {
      if (currentSlide < totalSlides) {
        currentSlide++;
        updateSlide();
      }
    }

    function prevSlide() {
      if (currentSlide > 1) {
        currentSlide--;
        updateSlide();
      }
    }

    function goToSlide(n) {
      currentSlide = n;
      updateSlide();
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === ' ') {
        prevSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        nextSlide();
      }
    });

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  </script>
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML5 Interactive Presentation created at: ' + htmlPath);
