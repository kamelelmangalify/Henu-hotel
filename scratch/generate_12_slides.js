const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');

const outputDir = 'd:/Henu/06_Marketing_and_Feasibility_Study';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// =========================================================================
// 1. GENERATE 12-SLIDE POWERPOINT (.PPTX) WITH SPACIOUS LUXURY DESIGN
// =========================================================================
console.log('Generating 12-Slide PowerPoint (.pptx)...');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'HENU Hotel Pyramids';
pres.company = 'HENU Hotel';
pres.title = 'دراسة الجدوى والخطة التسويقية الإستراتيجية — فندق هينو الأهرامات';

// Color Palette
const C_NILE_DARK = '0B1B2B'; // Deep Egyptian Navy
const C_NILE = '1B3A5C';
const C_GOLD = 'C9873A';     // Pharaonic Gold
const C_GOLD_LIGHT = 'DAA856';
const C_SAND_LIGHT = 'F7F2E8'; // Warm Desert Sand
const C_IVORY = 'FDFBF7';
const C_WHITE = 'FFFFFF';
const C_GREEN = '10B981';
const C_GREEN_BG = 'E6F7F0';
const C_RED = 'E11D48';
const C_RED_BG = 'FEE2E2';
const C_GRAY = '64748B';
const C_DARK = '1E293B';
const C_BORDER = 'E2E8F0';

// Helper: Slide Header Template
function addSlideHeader(slide, tag, title, subtitle) {
  // Top Tag
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 0.4, w: 2.2, h: 0.35,
    fill: { color: C_NILE },
    rectRadius: 0.1
  });
  slide.addText(tag, {
    x: 0.8, y: 0.4, w: 2.2, h: 0.35,
    fontSize: 10, fontFace: 'Cairo', color: C_GOLD_LIGHT, bold: true, align: 'center', isRTL: true
  });

  // Title
  slide.addText(title, {
    x: 0.8, y: 0.8, w: 11.7, h: 0.55,
    fontSize: 22, fontFace: 'Cairo', color: C_NILE_DARK, bold: true, align: 'right', isRTL: true
  });

  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8, y: 1.35, w: 11.7, h: 0.35,
      fontSize: 11, fontFace: 'Cairo', color: C_GRAY, align: 'right', isRTL: true
    });
  }

  // Header separator line
  slide.addShape(pres.ShapeType.line, {
    x: 0.8, y: 1.75, w: 11.7, h: 0,
    line: { color: 'E2E8F0', width: 1 }
  });
}

// ----------------------------------------------------
// SLIDE 1: Title Cover
// ----------------------------------------------------
let s1 = pres.addSlide();
s1.background = { color: C_NILE_DARK };

s1.addText('فندق هينو الأهرامات — HENU HOTEL PYRAMIDS', {
  x: 1.0, y: 0.9, w: 11.3, h: 0.5,
  fontSize: 15, fontFace: 'Cairo', color: C_GOLD_LIGHT, bold: true, align: 'right', isRTL: true
});

s1.addText('دراسة الجدوى الاقتصادية\nوالخطة التسويقية الإستراتيجية', {
  x: 1.0, y: 1.5, w: 11.3, h: 1.8,
  fontSize: 34, fontFace: 'Cairo', color: C_WHITE, bold: true, align: 'right', isRTL: true
});

s1.addText('نموذج الحجز المباشر vs عمولات OTAs ومقارنة إعلانات Google Maps مع منصات التواصل Meta', {
  x: 1.0, y: 3.4, w: 11.3, h: 0.6,
  fontSize: 15, fontFace: 'Cairo', color: C_SAND_LIGHT, align: 'right', isRTL: true
});

const coverKpis = [
  { val: '$15 - $25', lbl: 'متوسط سعر الليلة (ADR)\n(750 جـ - 1,250 جـ)' },
  { val: '+225,963 جـ', lbl: 'أقصى وفر شهري متوقع\nفي ذروة الموسم المرتفع' },
  { val: '< 4 أيام', lbl: 'فترة استرداد تكلفة الموقع\n(استثمار 25k جـ)' },
  { val: '35%', lbl: 'عمولات OTAs المهدرة\nتستنزف ثلث الإيرادات' }
];

coverKpis.forEach((k, idx) => {
  const xPos = 1.0 + (idx * 2.88);
  s1.addShape(pres.ShapeType.roundRect, {
    x: xPos, y: 4.5, w: 2.7, h: 1.9,
    fill: { color: '14263B' },
    line: { color: C_GOLD, width: 1.5 },
    rectRadius: 0.15
  });
  s1.addText(k.val, {
    x: xPos, y: 4.7, w: 2.7, h: 0.6,
    fontSize: 22, fontFace: 'Cairo', color: C_GOLD_LIGHT, bold: true, align: 'center'
  });
  s1.addText(k.lbl, {
    x: xPos + 0.1, y: 5.3, w: 2.5, h: 0.9,
    fontSize: 10.5, fontFace: 'Cairo', color: C_WHITE, align: 'center', isRTL: true
  });
});

// ----------------------------------------------------
// SLIDE 2: Executive Summary (الملخص التنفيذي)
// ----------------------------------------------------
let s2 = pres.addSlide();
s2.background = { color: C_IVORY };
addSlideHeader(s2, 'نظرة عامة', 'الملخص التنفيذي: أهداف الدراسة والفرصة الاستثمارية', 'تحويل فندق هينو الأهرامات من الاعتماد الكلي على الوسطاء إلى نموذج الحجز المباشر المربح');

const s2Cards = [
  {
    icon: '📉',
    title: 'تحدي العمولات المرتفعة',
    desc: 'منصات Booking و Agoda تقتطع عمولات تصل إلى 35% من قيمة كل حجز، مما يقلص الأرباح التشغيلية بشكل حاد ويحرم الفندق من بناء قاعدة نزلاء مباشرة.',
    color: C_RED
  },
  {
    icon: '🌐',
    title: 'حل الحجز المباشر',
    desc: 'امتلاك محرك حجز مباشر وموقع متعدد اللغات والعملات يتيح للنزيل الحجز فوراً بدون وسيط، مما يوفر حتى 225,963 جـ شهرياً من العمولات.',
    color: C_GOLD
  },
  {
    icon: '📍',
    title: 'التسويق الذكي عبر خرائط جوجل',
    desc: 'تركيز الإنفاق الإعلاني على Google Maps Local Ads لاستهداف السياح المتواجدين بالفعل عند الأهرامات، لتحقيق عائد إعلاني يصل إلى 1 : 60.',
    color: C_GREEN
  }
];

s2Cards.forEach((c, idx) => {
  const xPos = 0.8 + (idx * 3.95);
  s2.addShape(pres.ShapeType.roundRect, {
    x: xPos, y: 2.0, w: 3.8, h: 4.8,
    fill: { color: C_WHITE },
    line: { color: c.color, width: 2 },
    rectRadius: 0.15
  });
  s2.addText(c.icon, {
    x: xPos, y: 2.3, w: 3.8, h: 0.6,
    fontSize: 32, align: 'center'
  });
  s2.addText(c.title, {
    x: xPos + 0.2, y: 3.0, w: 3.4, h: 0.5,
    fontSize: 16, fontFace: 'Cairo', color: C_NILE_DARK, bold: true, align: 'center', isRTL: true
  });
  s2.addText(c.desc, {
    x: xPos + 0.3, y: 3.6, w: 3.2, h: 2.8,
    fontSize: 11.5, fontFace: 'Cairo', color: C_GRAY, align: 'right', isRTL: true
  });
});

// ----------------------------------------------------
// SLIDE 3: The Problem (نزيف العمولات)
// ----------------------------------------------------
let s3 = pres.addSlide();
s3.background = { color: C_IVORY };
addSlideHeader(s3, 'تحليل التحدي', 'أين تذهب أموال الفندق؟ تحليل نزيف عمولات الـ OTAs', 'كيف تلتهم منصات الحجز ثلث الإيراد الكلي لفندق هينو');

// Left Box: Impact Breakdown
s3.addShape(pres.ShapeType.roundRect, {
  x: 6.8, y: 2.0, w: 5.7, h: 4.8,
  fill: { color: C_WHITE },
  line: { color: C_RED, width: 2 },
  rectRadius: 0.15
});
s3.addText('⚠️ التكلفة الخفية للوسطاء (OTAs)', {
  x: 7.0, y: 2.2, w: 5.3, h: 0.4,
  fontSize: 15, fontFace: 'Cairo', color: C_RED, bold: true, align: 'right', isRTL: true
});

const losses = [
  '• عمولة تصل إلى 35% تقتطع فورياً من كل غرفة يتم بيعها.',
  '• في الموسم المرتفع، يخسر الفندق أكثر من 278,000 جـ شهرياً كعمولات.',
  '• حجب بيانات النزيل الحقيقية وعدم إمكانية إعادة استهدافه مستقبلاً.',
  '• تحكم المنصات الخارجية في شروط الإلغاء وسياسات التسعير.'
];

losses.forEach((l, idx) => {
  s3.addText(l, {
    x: 7.1, y: 2.8 + (idx * 0.95), w: 5.1, h: 0.8,
    fontSize: 11.5, fontFace: 'Cairo', color: C_DARK, align: 'right', isRTL: true
  });
});

// Right Box: Visual Proportion
s3.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 2.0, w: 5.7, h: 4.8,
  fill: { color: C_WHITE },
  line: { color: C_BORDER, width: 1 },
  rectRadius: 0.15
});

s3.addText('📊 توزيع الإيراد التقليدي عبر OTAs', {
  x: 1.0, y: 2.2, w: 5.3, h: 0.4,
  fontSize: 15, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'right', isRTL: true
});

s3.addShape(pres.ShapeType.roundRect, {
  x: 1.1, y: 2.8, w: 5.1, h: 1.6,
  fill: { color: C_RED_BG },
  line: { color: C_RED, width: 1 },
  rectRadius: 0.1
});
s3.addText('35% عمولات مهدرة للمنصات', {
  x: 1.2, y: 3.0, w: 4.9, h: 0.4,
  fontSize: 16, fontFace: 'Cairo', color: C_RED, bold: true, align: 'center', isRTL: true
});
s3.addText('تصل إلى 278,906 جـ شهرياً تخرج خارج حسابات الفندق', {
  x: 1.2, y: 3.5, w: 4.9, h: 0.6,
  fontSize: 11, fontFace: 'Cairo', color: C_DARK, align: 'center', isRTL: true
});

s3.addShape(pres.ShapeType.roundRect, {
  x: 1.1, y: 4.6, w: 5.1, h: 1.9,
  fill: { color: C_SAND_LIGHT },
  line: { color: C_GOLD, width: 1 },
  rectRadius: 0.1
});
s3.addText('65% المتبقي لتغطية المصاريف والأرباح', {
  x: 1.2, y: 4.8, w: 4.9, h: 0.4,
  fontSize: 15, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'center', isRTL: true
});
s3.addText('يتحمل منها الفندق: التشغيل، الصيانة، الرواتب، والكهرباء', {
  x: 1.2, y: 5.3, w: 4.9, h: 0.6,
  fontSize: 11, fontFace: 'Cairo', color: C_GRAY, align: 'center', isRTL: true
});

// ----------------------------------------------------
// SLIDE 4: Capacity & Pricing Baseline (سعة الفندق والتسعير)
// ----------------------------------------------------
let s4 = pres.addSlide();
s4.background = { color: C_IVORY };
addSlideHeader(s4, 'البيانات الأساسية', 'السعة التشغيلية وهيكل أسعار الغرف المعتمد', 'حساب الطاقة الاستيعابية الشهرية للفندق وتصنيفات الغرف المعتمدة للدراسة');

// 3 Metric Cards
const s4Metrics = [
  { val: '25 غرفة', lbl: 'إجمالي طاقة الفندق الاستيعابية', sub: '4 أدوار + روف بإطلالة الأهرامات' },
  { val: '750 ليلة', lbl: 'السعة المتاحة شهرياً', sub: '25 غرفة × 30 يوم تشغيلي' },
  { val: '$15 - $25', lbl: 'متوسط سعر الليلة (ADR)', sub: '750 جـ (منخفض) / 1,250 جـ (مرتفع)' }
];

s4Metrics.forEach((m, idx) => {
  const xPos = 0.8 + (idx * 3.95);
  s4.addShape(pres.ShapeType.roundRect, {
    x: xPos, y: 2.0, w: 3.8, h: 1.5,
    fill: { color: C_WHITE },
    line: { color: C_GOLD, width: 1.5 },
    rectRadius: 0.12
  });
  s4.addText(m.val, {
    x: xPos, y: 2.1, w: 3.8, h: 0.5,
    fontSize: 20, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'center'
  });
  s4.addText(m.lbl, {
    x: xPos, y: 2.6, w: 3.8, h: 0.35,
    fontSize: 11, fontFace: 'Cairo', color: C_DARK, bold: true, align: 'center', isRTL: true
  });
  s4.addText(m.sub, {
    x: xPos, y: 2.95, w: 3.8, h: 0.35,
    fontSize: 9.5, fontFace: 'Cairo', color: C_GRAY, align: 'center', isRTL: true
  });
});

// Pricing Structure Table
const priceRows = [
  [
    { text: 'فئة الغرفة', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'Standard (عادية)', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'With Window (بنافذة)', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'With Balcony (ببلكونة)', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'King Suite (سويت أهرامات)', options: { bold: true, fill: C_GOLD, color: C_WHITE, align: 'center' } }
  ],
  [
    { text: 'Single Room (مفردة)', options: { bold: true } },
    { text: '$12 (600 جـ)' },
    { text: '$15 (750 جـ)' },
    { text: '$20 (1,000 جـ)' },
    { text: '—' }
  ],
  [
    { text: 'Double Room (مزدوجة)', options: { bold: true } },
    { text: '$18 (900 جـ)' },
    { text: '$22 (1,100 جـ)' },
    { text: '$25 (1,250 جـ)' },
    { text: '—' }
  ],
  [
    { text: 'Triple / Family (ثلاثية)', options: { bold: true } },
    { text: '$25 (1,250 جـ)' },
    { text: '$30 (1,500 جـ)' },
    { text: '$35 (1,750 جـ)' },
    { text: '—' }
  ],
  [
    { text: 'Suite Pyramids View', options: { bold: true } },
    { text: '—' },
    { text: '—' },
    { text: '—' },
    { text: '$45 (2,250 جـ)', options: { bold: true, color: C_GOLD } }
  ]
];

s4.addTable(priceRows, {
  x: 0.8, y: 3.8, w: 11.7, h: 2.8,
  fontFace: 'Cairo', fontSize: 10,
  align: 'center', valign: 'middle',
  border: { type: 'solid', pt: 1, color: C_BORDER }
});

// ----------------------------------------------------
// SLIDE 5: Low Season Feasibility (الموسم المنخفض)
// ----------------------------------------------------
let s5 = pres.addSlide();
s5.background = { color: C_IVORY };
addSlideHeader(s5, 'الجدوى المالية (1/2)', 'الموسم المنخفض (Low Season): تحليل الإيرادات والوفر', 'متوسط سعر الليلة ADR = 15$ (750 جـ) — مقارنة سيناريو إشغال 50% وإشغال 70%');

const lowSeasonTable = [
  [
    { text: 'المؤشر المالي', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'سيناريو إشغال 50% (375 ليلة)', options: { bold: true, fill: C_NILE_DARK, color: C_WHITE, align: 'center' } },
    { text: 'سيناريو إشغال 70% (525 ليلة)', options: { bold: true, fill: C_NILE_DARK, color: C_WHITE, align: 'center' } }
  ],
  [
    { text: 'إجمالي الإيراد الشهري', options: { bold: true } },
    { text: '281,250 جنيه' },
    { text: '393,750 جنيه' }
  ],
  [
    { text: 'عمولات OTAs المهدرة (35%)', options: { bold: true, color: C_RED } },
    { text: '98,437 جنيه', options: { color: C_RED, bold: true } },
    { text: '137,812 جنيه', options: { color: C_RED, bold: true } }
  ],
  [
    { text: 'تكلفة إعلانات جوجل + موقع الحجز', options: { bold: true } },
    { text: '17,083 جنيه' },
    { text: '17,083 جنيه' }
  ],
  [
    { text: 'عمولة القنوات المساندة Agoda (30%)', options: { bold: true } },
    { text: '12,656 جنيه' },
    { text: '17,718 جنيه' }
  ],
  [
    { text: 'صافي الوفر الشهري المحقق للفندق', options: { bold: true, fill: C_GREEN_BG, color: C_GREEN } },
    { text: '+ 68,698 جنيه / شهرياً', options: { bold: true, fill: C_GREEN_BG, color: C_GREEN, fontSize: 13 } },
    { text: '+ 103,010 جنيه / شهرياً', options: { bold: true, fill: C_GREEN_BG, color: C_GREEN, fontSize: 13 } }
  ]
];

s5.addTable(lowSeasonTable, {
  x: 0.8, y: 2.0, w: 11.7, h: 4.2,
  fontFace: 'Cairo', fontSize: 11,
  align: 'center', valign: 'middle',
  border: { type: 'solid', pt: 1, color: C_BORDER }
});

s5.addText('💡 حتى في أسوأ فترات الموسم المنخفض (إشغال 50%)، يحقق الفندق وفراً صافياً يتجاوز 68 ألف جنيه شهرياً في حسابه!', {
  x: 0.8, y: 6.4, w: 11.7, h: 0.4,
  fontSize: 11.5, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'right', isRTL: true
});

// ----------------------------------------------------
// SLIDE 6: High Season Feasibility (الموسم المرتفع)
// ----------------------------------------------------
let s6 = pres.addSlide();
s6.background = { color: C_IVORY };
addSlideHeader(s6, 'الجدوى المالية (2/2)', 'الموسم المرتفع (High Season): أقصى عائد مالي وربحية', 'متوسط سعر الليلة ADR = 25$ (1,250 جـ) — مقارنة سيناريو إشغال 70% وذروة الإشغال 85%');

const highSeasonTable = [
  [
    { text: 'المؤشر المالي', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'سيناريو إشغال 70% (525 ليلة)', options: { bold: true, fill: C_NILE_DARK, color: C_WHITE, align: 'center' } },
    { text: 'ذروة الموسم 85% (637 ليلة)', options: { bold: true, fill: C_GOLD, color: C_WHITE, align: 'center' } }
  ],
  [
    { text: 'إجمالي الإيراد الشهري', options: { bold: true } },
    { text: '656,250 جنيه' },
    { text: '796,875 جنيه' }
  ],
  [
    { text: 'عمولات OTAs المهدرة (35%)', options: { bold: true, color: C_RED } },
    { text: '229,687 جنيه', options: { color: C_RED, bold: true } },
    { text: '278,906 جنيه', options: { color: C_RED, bold: true } }
  ],
  [
    { text: 'تكلفة إعلانات جوجل + موقع الحجز', options: { bold: true } },
    { text: '17,083 جنيه' },
    { text: '17,083 جنيه' }
  ],
  [
    { text: 'عمولة القنوات المساندة Agoda (30%)', options: { bold: true } },
    { text: '29,531 جنيه' },
    { text: '35,859 جنيه' }
  ],
  [
    { text: 'صافي الوفر الشهري المحقق للفندق', options: { bold: true, fill: C_GREEN_BG, color: C_GREEN } },
    { text: '+ 183,073 جنيه / شهرياً', options: { bold: true, fill: C_GREEN_BG, color: C_GREEN, fontSize: 13 } },
    { text: '+ 225,963 جنيه / شهرياً', options: { bold: true, fill: C_GREEN_BG, color: C_GREEN, fontSize: 14 } }
  ]
];

s6.addTable(highSeasonTable, {
  x: 0.8, y: 2.0, w: 11.7, h: 4.2,
  fontFace: 'Cairo', fontSize: 11,
  align: 'center', valign: 'middle',
  border: { type: 'solid', pt: 1, color: C_BORDER }
});

s6.addText('🚀 في ذروة الموسم السياحي (إشغال 85%)، يسترد الفندق أكثر من 225,000 جنيه شهرياً كانت تذهب كعمولات لـ Booking!', {
  x: 0.8, y: 6.4, w: 11.7, h: 0.4,
  fontSize: 11.5, fontFace: 'Cairo', color: C_GREEN, bold: true, align: 'right', isRTL: true
});

// ----------------------------------------------------
// SLIDE 7: CapEx Payback (استرداد رأس المال)
// ----------------------------------------------------
let s7 = pres.addSlide();
s7.background = { color: C_IVORY };
addSlideHeader(s7, 'استرداد الاستثمار', 'تحليل فترة استرداد تكلفة موقع الحجز (CapEx Payback)', 'كيف يسترد الفندق تكلفة تطوير النظام البالغة 25,000 جنيه في أيام معدودة');

// 3 Step Timeline
const paybackCards = [
  {
    day: 'اليوم 1 - 3',
    title: 'إطلاق وتشغيل الموقع',
    val: '25,000 جـ',
    desc: 'تكلفة استثمارية رأسمالية تدفع لمرة واحدة لإنشاء وتدشين الموقع متعدد اللغات ومحرك الحجز المباشر.'
  },
  {
    day: 'اليوم 4',
    title: 'نقطة التعادل (Break-even)',
    val: '100% استرداد',
    desc: 'من خلال حجز أول 15-20 ليلة مباشرة عبر الموقع وتوفير عمولة الـ 35%، يتم تغطية كامل تكلفة الموقع.'
  },
  {
    day: 'ما بعد اليوم 4',
    title: 'أرباح صافية مستمرة',
    val: '+68k إلى +225k',
    desc: 'كل ليلة إضافية يتم حجزها تمثل وفراً مالياً وأرباحاً صافية تتدفق مباشرة لخزينة الفندق شهرياً.'
  }
];

paybackCards.forEach((c, idx) => {
  const xPos = 0.8 + (idx * 3.95);
  s7.addShape(pres.ShapeType.roundRect, {
    x: xPos, y: 2.0, w: 3.8, h: 4.8,
    fill: { color: C_WHITE },
    line: { color: idx === 1 ? C_GOLD : (idx === 2 ? C_GREEN : C_NILE), width: 2 },
    rectRadius: 0.15
  });

  s7.addShape(pres.ShapeType.roundRect, {
    x: xPos + 0.3, y: 2.3, w: 3.2, h: 0.4,
    fill: { color: idx === 1 ? C_GOLD : (idx === 2 ? C_GREEN : C_NILE) },
    rectRadius: 0.08
  });
  s7.addText(c.day, {
    x: xPos + 0.3, y: 2.3, w: 3.2, h: 0.4,
    fontSize: 12, fontFace: 'Cairo', color: C_WHITE, bold: true, align: 'center', isRTL: true
  });

  s7.addText(c.title, {
    x: xPos + 0.2, y: 3.0, w: 3.4, h: 0.5,
    fontSize: 16, fontFace: 'Cairo', color: C_NILE_DARK, bold: true, align: 'center', isRTL: true
  });

  s7.addText(c.val, {
    x: xPos + 0.2, y: 3.6, w: 3.4, h: 0.6,
    fontSize: 22, fontFace: 'Cairo', color: idx === 2 ? C_GREEN : C_GOLD, bold: true, align: 'center'
  });

  s7.addText(c.desc, {
    x: xPos + 0.3, y: 4.4, w: 3.2, h: 2.1,
    fontSize: 11, fontFace: 'Cairo', color: C_GRAY, align: 'right', isRTL: true
  });
});

// ----------------------------------------------------
// SLIDE 8: Marketing Channels (1/2): Intent & Conversion
// ----------------------------------------------------
let s8 = pres.addSlide();
s8.background = { color: C_IVORY };
addSlideHeader(s8, 'المقارنة التسويقية (1/2)', 'نية الحجز ومعدل التحويل: Google Maps vs Meta', 'لماذا تتفوق خرائط جوجل باكتساح على فيسبوك وإنستجرام كقناة حجز فندقي');

// Google Side
s8.addShape(pres.ShapeType.roundRect, {
  x: 6.8, y: 2.0, w: 5.7, h: 4.8,
  fill: { color: C_WHITE },
  line: { color: C_GREEN, width: 2 },
  rectRadius: 0.15
});
s8.addText('📍 إعلانات خرائط جوجل (Google Maps Ads)', {
  x: 7.0, y: 2.2, w: 5.3, h: 0.4,
  fontSize: 15, fontFace: 'Cairo', color: C_GREEN, bold: true, align: 'right', isRTL: true
});

s8.addShape(pres.ShapeType.roundRect, {
  x: 7.1, y: 2.8, w: 5.1, h: 1.6,
  fill: { color: C_GREEN_BG },
  rectRadius: 0.1
});
s8.addText('95% نية حجز فورية (Active Search)', {
  x: 7.2, y: 2.9, w: 4.9, h: 0.4,
  fontSize: 14, fontFace: 'Cairo', color: C_GREEN, bold: true, align: 'right', isRTL: true
});
s8.addText('السائح يقف بالفعل عند الأهرامات ويبحث في هاتفه عن غرفة للمبيت الليلة.', {
  x: 7.2, y: 3.4, w: 4.9, h: 0.8,
  fontSize: 10.5, fontFace: 'Cairo', color: C_DARK, align: 'right', isRTL: true
});

s8.addShape(pres.ShapeType.roundRect, {
  x: 7.1, y: 4.6, w: 5.1, h: 1.9,
  fill: { color: C_GREEN_BG },
  rectRadius: 0.1
});
s8.addText('12.5% معدل تحويل النقرة لحجز (CVR)', {
  x: 7.2, y: 4.7, w: 4.9, h: 0.4,
  fontSize: 14, fontFace: 'Cairo', color: C_GREEN, bold: true, align: 'right', isRTL: true
});
s8.addText('كل 100 نقرة إعلانية على خريطة جوجل تترجم إلى 12 حجز مؤكد ومباشر.\nمعدل تحويل أعلى بـ 31 ضعفاً من Meta!', {
  x: 7.2, y: 5.2, w: 4.9, h: 1.1,
  fontSize: 10.5, fontFace: 'Cairo', color: C_DARK, align: 'right', isRTL: true
});

// Meta Side
s8.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 2.0, w: 5.7, h: 4.8,
  fill: { color: C_WHITE },
  line: { color: C_RED, width: 1.5 },
  rectRadius: 0.15
});
s8.addText('📱 فيسبوك وإنستجرام (Meta Platforms)', {
  x: 1.0, y: 2.2, w: 5.3, h: 0.4,
  fontSize: 15, fontFace: 'Cairo', color: C_RED, bold: true, align: 'right', isRTL: true
});

s8.addShape(pres.ShapeType.roundRect, {
  x: 1.1, y: 2.8, w: 5.1, h: 1.6,
  fill: { color: C_RED_BG },
  rectRadius: 0.1
});
s8.addText('10% نية حجز ضعيفة (Passive Browsing)', {
  x: 1.2, y: 2.9, w: 4.9, h: 0.4,
  fontSize: 14, fontFace: 'Cairo', color: C_RED, bold: true, align: 'right', isRTL: true
});
s8.addText('مستخدم يتصفح للتسلية وتضييع الوقت بدون أي نية سفر أو حجز حقيقي.', {
  x: 1.2, y: 3.4, w: 4.9, h: 0.8,
  fontSize: 10.5, fontFace: 'Cairo', color: C_DARK, align: 'right', isRTL: true
});

s8.addShape(pres.ShapeType.roundRect, {
  x: 1.1, y: 4.6, w: 5.1, h: 1.9,
  fill: { color: C_RED_BG },
  rectRadius: 0.1
});
s8.addText('0.4% معدل تحويل ضعيف جداً (CVR)', {
  x: 1.2, y: 4.7, w: 4.9, h: 0.4,
  fontSize: 14, fontFace: 'Cairo', color: C_RED, bold: true, align: 'right', isRTL: true
});
s8.addText('تحتاج إلى 1000 نقرة إعلانية لتحصل على 4 حجوزات فقط بسبب كثرة الرسائل غير الجادة.\nهدر إعلاني كبير في الميزانية!', {
  x: 1.2, y: 5.2, w: 4.9, h: 1.1,
  fontSize: 10.5, fontFace: 'Cairo', color: C_DARK, align: 'right', isRTL: true
});

// ----------------------------------------------------
// SLIDE 9: Marketing Channels (2/2): CAC & ROAS
// ----------------------------------------------------
let s9 = pres.addSlide();
s9.background = { color: C_IVORY };
addSlideHeader(s9, 'المقارنة التسويقية (2/2)', 'تكلفة الاستحواذ والعائد الإعلاني: CAC & ROAS', 'المقارنة المالية الدقيقة بين كفاءة إنفاق إعلانات جوجل مقابل السوشيال ميديا');

const s9CompTable = [
  [
    { text: 'معيار الكفاءة الإعلانية', options: { bold: true, fill: C_NILE, color: C_WHITE, align: 'center' } },
    { text: 'إعلانات خرائط جوجل (Google Maps)', options: { bold: true, fill: C_GREEN, color: C_WHITE, align: 'center' } },
    { text: 'فيسبوك وإنستجرام (Meta Platforms)', options: { bold: true, fill: C_RED, color: C_WHITE, align: 'center' } },
    { text: 'الفارق الإستراتيجي', options: { bold: true, fill: C_GOLD, color: C_WHITE, align: 'center' } }
  ],
  [
    { text: 'تكلفة الاستحواذ على النزيل (CAC)', options: { bold: true } },
    { text: '~45 جنيه مصري\n(دفع مقابل نقرة السائح الفعلي فقط)' },
    { text: '~380 جنيه مصري\n(هدر على غير المهتمين بالسفر)' },
    { text: 'توفير 88% من تكلفة اجتذاب النزيل', options: { bold: true, color: C_GREEN } }
  ],
  [
    { text: 'ميزانية إنتاج المحتوى والفيديوهات', options: { bold: true } },
    { text: '0 جنيه (مجاناً)\n(صور الفندق الواقعية وتقييمات النزلاء)' },
    { text: '~15,000 جنيه / شهرياً\n(مصورين، ريلز، وتعديل فيديوهات)' },
    { text: 'توفير 15 ألف جنيه شهرياً بالكامل', options: { bold: true, color: C_GREEN } }
  ],
  [
    { text: 'نسبة الرسائل غير الجادة ("بكام؟")', options: { bold: true } },
    { text: 'أقل من 5%\n(دخول مباشر لمحرك الحجز والدفع)' },
    { text: 'أكثر من 85%\n(استنزاف وقت الاستقبال بلا جدوى)' },
    { text: 'توجيه فوري للدفع الإلكتروني', options: { bold: true, color: C_GREEN } }
  ],
  [
    { text: 'العائد على الإنفاق الإعلاني (ROAS)', options: { bold: true } },
    { text: '1 : 60\n(كل 1k تنفق تحقق 60k إيراد)', options: { bold: true, color: C_GREEN } },
    { text: '1 : 3\n(كل 1k تحقق 3k فقط)', options: { bold: true, color: C_RED } },
    { text: 'كفاءة استثمارية أعلى بـ 20 ضعفاً', options: { bold: true, color: C_GREEN } }
  ]
];

s9.addTable(s9CompTable, {
  x: 0.8, y: 2.0, w: 11.7, h: 4.8,
  fontFace: 'Cairo', fontSize: 10,
  align: 'center', valign: 'middle',
  border: { type: 'solid', pt: 1, color: C_BORDER }
});

// ----------------------------------------------------
// SLIDE 10: Conversion Funnel (قمع التحويل)
// ----------------------------------------------------
let s10 = pres.addSlide();
s10.background = { color: C_IVORY };
addSlideHeader(s10, 'مسار العميل', 'إنفوجراف قمع التحويل: مقارنة رحلة النزيل (Funnel)', 'كيف يتحول السائح من مجرد باحث إلى حجز مؤكد ومسدد بالكامل');

// Left: Google Funnel
s10.addShape(pres.ShapeType.roundRect, {
  x: 6.8, y: 2.0, w: 5.7, h: 4.8,
  fill: { color: C_WHITE },
  line: { color: C_GREEN, width: 2 },
  rectRadius: 0.15
});
s10.addText('📍 قمع جوجل ماب (Google Maps Funnel) — مسار مباشر وسريع', {
  x: 7.0, y: 2.2, w: 5.3, h: 0.4,
  fontSize: 13, fontFace: 'Cairo', color: C_GREEN, bold: true, align: 'right', isRTL: true
});

const s10G = [
  '1. بحث مباشر: سائح يبحث عن "Pyramids View Hotel"',
  '2. ظهور الفندق: ظهور إعلان الفندق أعلى الخريطة في الهرم',
  '3. النقرة والموقع: التوجيه المباشر لموقع الحجز الفندقي',
  '4. النتيجة: حجز ودفع إلكتروني مباشر (0% عمولة) 🎉'
];

s10G.forEach((st, idx) => {
  s10.addShape(pres.ShapeType.roundRect, {
    x: 7.1, y: 2.75 + (idx * 0.95), w: 5.1, h: 0.75,
    fill: { color: idx === 3 ? '10B981' : 'ECFDF5' },
    line: { color: C_GREEN, width: 1 },
    rectRadius: 0.1
  });
  s10.addText(st, {
    x: 7.2, y: 2.85 + (idx * 0.95), w: 4.9, h: 0.55,
    fontSize: 11, fontFace: 'Cairo', color: idx === 3 ? C_WHITE : '065F46', bold: true, align: 'right', isRTL: true
  });
});

// Right: Meta Funnel
s10.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 2.0, w: 5.7, h: 4.8,
  fill: { color: C_WHITE },
  line: { color: C_RED, width: 1.5 },
  rectRadius: 0.15
});
s10.addText('📱 قمع السوشيال ميديا (Meta Funnel) — مسار معقد وفاقد عالي', {
  x: 1.0, y: 2.2, w: 5.3, h: 0.4,
  fontSize: 13, fontFace: 'Cairo', color: C_RED, bold: true, align: 'right', isRTL: true
});

const s10M = [
  '1. مشاهدة عابرة: مستخدم يشاهد فيديو Reel أثناء التصفح',
  '2. إرسال رسالة: إرسال سؤال تقليدي "بكام الليلة؟"',
  '3. المتابعة: انتظار رد الاستقبال وضياع وقت الموظفين',
  '4. النتيجة: تجاهل أو حجز غير مؤكد (تسرب النزلاء) ⚠️'
];

s10M.forEach((st, idx) => {
  s10.addShape(pres.ShapeType.roundRect, {
    x: 1.1, y: 2.75 + (idx * 0.95), w: 5.1, h: 0.75,
    fill: { color: idx === 3 ? 'FEE2E2' : 'F9FAFB' },
    line: { color: idx === 3 ? C_RED : 'D1D5DB', width: 1 },
    rectRadius: 0.1
  });
  s10.addText(st, {
    x: 1.2, y: 2.85 + (idx * 0.95), w: 4.9, h: 0.55,
    fontSize: 11, fontFace: 'Cairo', color: idx === 3 ? '991B1B' : C_DARK, bold: true, align: 'right', isRTL: true
  });
});

// ----------------------------------------------------
// SLIDE 11: Budget & Channel Mix (توزيع الميزانية ومزيج القنوات)
// ----------------------------------------------------
let s11 = pres.addSlide();
s11.background = { color: C_IVORY };
addSlideHeader(s11, 'الخطة التسويقية', 'توزيع الميزانية الإعلانية ومزيج القنوات المستهدف', 'التوزيع الأمثل لميزانية التسويق وقنوات البيع لتحقيق أعلى ربحية');

// 2 Boxes: Left (Ad Budget), Right (Channel Mix)
s11.addShape(pres.ShapeType.roundRect, {
  x: 6.8, y: 2.0, w: 5.7, h: 4.8,
  fill: { color: C_WHITE },
  line: { color: C_GOLD, width: 2 },
  rectRadius: 0.15
});
s11.addText('🎯 تخصيص الميزانية الإعلانية (15,000 جـ/شهر)', {
  x: 7.0, y: 2.2, w: 5.3, h: 0.4,
  fontSize: 14, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'right', isRTL: true
});

s11.addShape(pres.ShapeType.roundRect, {
  x: 7.1, y: 2.8, w: 5.1, h: 1.8,
  fill: { color: C_GREEN_BG },
  rectRadius: 0.1
});
s11.addText('100% إعلانات Google Maps Local Search Ads', {
  x: 7.2, y: 3.0, w: 4.9, h: 0.4,
  fontSize: 13.5, fontFace: 'Cairo', color: C_GREEN, bold: true, align: 'right', isRTL: true
});
s11.addText('الميزانية: 15,000 جـ شهرياً (500 جـ / يومياً)\nالهدف: ظهور الفندق كأول نتيجة على خريطة الهرم لجميع السياح الباحثين عن إقامة فورية.', {
  x: 7.2, y: 3.5, w: 4.9, h: 0.9,
  fontSize: 10.5, fontFace: 'Cairo', color: C_DARK, align: 'right', isRTL: true
});

s11.addShape(pres.ShapeType.roundRect, {
  x: 7.1, y: 4.8, w: 5.1, h: 1.7,
  fill: { color: C_RED_BG },
  rectRadius: 0.1
});
s11.addText('0% إعلانات فيسبوك وإنستجرام (Meta)', {
  x: 7.2, y: 5.0, w: 4.9, h: 0.4,
  fontSize: 13.5, fontFace: 'Cairo', color: C_RED, bold: true, align: 'right', isRTL: true
});
s11.addText('استبعاد تام لحملات السوشيال الممولة لتوفير تكلفة الإعلانات ومصاريف إنتاج المحتوى البالغة 15k شهرياً.', {
  x: 7.2, y: 5.5, w: 4.9, h: 0.8,
  fontSize: 10.5, fontFace: 'Cairo', color: C_DARK, align: 'right', isRTL: true
});

// Right Box: Target Channel Mix
s11.addShape(pres.ShapeType.roundRect, {
  x: 0.8, y: 2.0, w: 5.7, h: 4.8,
  fill: { color: C_WHITE },
  line: { color: C_NILE, width: 2 },
  rectRadius: 0.15
});
s11.addText('🔄 المزيج البيعي المستهدف (Channel Mix)', {
  x: 1.0, y: 2.2, w: 5.3, h: 0.4,
  fontSize: 14, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'right', isRTL: true
});

s11.addShape(pres.ShapeType.roundRect, {
  x: 1.1, y: 2.8, w: 5.1, h: 1.8,
  fill: { color: C_SAND_LIGHT },
  rectRadius: 0.1
});
s11.addText('70% حجز مباشر عبر موقع الفندق وجوجل ماب', {
  x: 1.2, y: 3.0, w: 4.9, h: 0.4,
  fontSize: 13.5, fontFace: 'Cairo', color: C_GOLD, bold: true, align: 'right', isRTL: true
});
s11.addText('القناة الرئيسية الأكثر ربحية — عمولة 0% وتواصل مباشر مع النزلاء لتقديم خدمات إضافية وجولات سياحية.', {
  x: 1.2, y: 3.5, w: 4.9, h: 0.9,
  fontSize: 10.5, fontFace: 'Cairo', color: C_DARK, align: 'right', isRTL: true
});

s11.addShape(pres.ShapeType.roundRect, {
  x: 1.1, y: 4.8, w: 5.1, h: 1.7,
  fill: { color: 'F1F5F9' },
  rectRadius: 0.1
});
s11.addText('30% قنوات مكملة مساندة (Agoda & Airbnb)', {
  x: 1.2, y: 5.0, w: 4.9, h: 0.4,
  fontSize: 13.5, fontFace: 'Cairo', color: C_NILE, bold: true, align: 'right', isRTL: true
});
s11.addText('الحفاظ على التواجد لسد أي فجوات إشغال في أيام منتصف الأسبوع وبناء تقييمات دولية إضافية.', {
  x: 1.2, y: 5.5, w: 4.9, h: 0.8,
  fontSize: 10.5, fontFace: 'Cairo', color: C_DARK, align: 'right', isRTL: true
});

// ----------------------------------------------------
// SLIDE 12: Final Recommendations & Roadmap (التوصيات)
// ----------------------------------------------------
let s12 = pres.addSlide();
s12.background = { color: C_IVORY };
addSlideHeader(s12, 'الخاتمة والقرارات', 'التوصيات النهائية وخريطة الطريق التنفيذية', 'القرارات الإستراتيجية الثلاثة لتحقيق أقصى ربحية تشغيلية لفندق هينو الأهرامات');

const s12Recs = [
  {
    icon: '🚀',
    title: '1. إطلاق موقع الحجز المباشر',
    desc: 'الاعتماد على موقع الفندق الإلكتروني كبوابة الحجز الأساسية مع دعم كامل للغات، العملات، وربط نظام الحجز السريع والدفع عند الوصول / فيزا.',
    highlight: 'استثمار 25,000 جـ — استرداد كامل في أقل من 4 أيام'
  },
  {
    icon: '🎯',
    title: '2. تركيز ميزانية إعلانات جوجل',
    desc: 'تخصيص 100% من الميزانية الإعلانية (15,000 جـ/شهرياً) لحملات Google Maps Local Search Ads لاستهداف السياح في منطقة الهرم مباشرة.',
    highlight: 'عائد إعلاني متوقع (ROAS) يصل لـ 1 : 60'
  },
  {
    icon: '🔄',
    title: '3. تحسين مزيج القنوات البيعية',
    desc: 'الإبقاء على Agoda و Airbnb كقنوات مكملة مساندة فقط بنسبة 30% من الإشغال، واستبعاد إعلانات فيسبوك وإنستجرام تماماً لتوفير ميزانية الإنتاج والتسويق.',
    highlight: 'توفير مصاريف إنتاج المحتوى (15k/شهر) + وفر حتى 225k/شهر'
  }
];

s12Recs.forEach((r, idx) => {
  const xPos = 0.8 + (idx * 3.95);
  s12.addShape(pres.ShapeType.roundRect, {
    x: xPos, y: 2.0, w: 3.8, h: 4.8,
    fill: { color: C_WHITE },
    line: { color: idx === 0 ? C_GOLD : (idx === 1 ? C_NILE : C_GREEN), width: 2 },
    rectRadius: 0.15
  });

  s12.addText(r.icon, {
    x: xPos, y: 2.3, w: 3.8, h: 0.6,
    fontSize: 32, align: 'center'
  });
  s12.addText(r.title, {
    x: xPos + 0.2, y: 3.0, w: 3.4, h: 0.5,
    fontSize: 16, fontFace: 'Cairo', color: C_NILE_DARK, bold: true, align: 'center', isRTL: true
  });
  s12.addText(r.desc, {
    x: xPos + 0.3, y: 3.6, w: 3.2, h: 2.0,
    fontSize: 11, fontFace: 'Cairo', color: C_GRAY, align: 'right', isRTL: true
  });
  s12.addShape(pres.ShapeType.roundRect, {
    x: xPos + 0.2, y: 5.6, w: 3.4, h: 0.9,
    fill: { color: C_SAND_LIGHT },
    line: { color: C_GOLD, width: 1 },
    rectRadius: 0.1
  });
  s12.addText(r.highlight, {
    x: xPos + 0.25, y: 5.7, w: 3.3, h: 0.7,
    fontSize: 10, fontFace: 'Cairo', color: C_NILE_DARK, bold: true, align: 'center', isRTL: true
  });
});

// Save PPTX
const pptxPath = path.join(outputDir, 'عرض_دراسة_الجدوى_فندق_هينو.pptx');
pres.writeFile({ fileName: pptxPath }).then(() => {
  console.log('12-Slide PPTX created successfully at: ' + pptxPath);
}).catch(err => {
  console.error('PPTX Error:', err);
});

// =========================================================================
// 2. GENERATE 12-SLIDE INTERACTIVE HTML5 PRESENTATION
// =========================================================================
console.log('Generating 12-Slide HTML5 Interactive Presentation...');
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
      --clr-sand-light: #F7F2E8;
      --clr-nile: #1B3A5C;
      --clr-nile-dark: #0B1B2B;
      --clr-gold: #C9873A;
      --clr-gold-light: #DAA856;
      --clr-ivory: #FDFBF7;
      --clr-ivory-dark: #EFE9DE;
      --clr-dark: #1E293B;
      --clr-gray: #64748B;
      --clr-green: #10B981;
      --clr-green-bg: #E6F7F0;
      --clr-red: #E11D48;
      --clr-red-bg: #FEE2E2;
      --font-ar: 'Cairo', sans-serif;
      --font-en: 'Cinzel', serif;
      --shadow-sm: 0 4px 15px rgba(0,0,0,0.05);
      --shadow-md: 0 10px 30px rgba(0,0,0,0.08);
      --shadow-lg: 0 20px 50px rgba(0,0,0,0.15);
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
      background: rgba(11, 27, 43, 0.95);
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
      background: #07121D;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow: hidden;
    }

    .slide {
      position: absolute;
      width: 95%;
      max-width: 1300px;
      height: 90%;
      background: var(--clr-ivory);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      border: 1px solid rgba(212, 169, 106, 0.35);
      padding: 36px 48px;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: scale(0.96) translateY(15px);
      pointer-events: none;
      transition: opacity 0.35s ease, transform 0.35s ease;
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
      margin-bottom: 20px;
      border-bottom: 2px solid var(--clr-ivory-dark);
      padding-bottom: 14px;
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
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--clr-nile-dark);
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
      background: linear-gradient(135deg, rgba(11,27,43,0.95) 0%, rgba(27,58,92,0.92) 100%), url('../website/images/hotel/hero-pyramids-night.jpg') center/cover no-repeat;
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
      margin-bottom: 18px;
      display: inline-block;
      box-shadow: 0 4px 15px rgba(201,135,58,0.4);
    }

    .cover-title {
      font-size: 2.8rem;
      font-weight: 900;
      color: white;
      line-height: 1.25;
      margin-bottom: 14px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }

    .cover-title span { color: var(--clr-gold-light); }

    .cover-subtitle {
      font-size: 1.2rem;
      color: var(--clr-sand-light);
      max-width: 850px;
      margin: 0 auto 32px;
      line-height: 1.6;
    }

    .cover-kpis {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      width: 100%;
      max-width: 1100px;
    }

    .cover-kpi-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(212, 169, 106, 0.35);
      padding: 18px 14px;
      border-radius: 14px;
      transition: var(--transition);
    }

    .cover-kpi-card:hover {
      background: rgba(255, 255, 255, 0.14);
      transform: translateY(-4px);
      border-color: var(--clr-gold);
    }

    .cover-kpi-val {
      font-size: 1.65rem;
      font-weight: 900;
      color: var(--clr-gold-light);
    }

    .cover-kpi-lbl {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.85);
      margin-top: 4px;
      line-height: 1.4;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .card-box {
      background: white;
      border-radius: 14px;
      padding: 24px 20px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--clr-ivory-dark);
      text-align: right;
    }

    .card-box.gold { border-top: 5px solid var(--clr-gold); }
    .card-box.nile { border-top: 5px solid var(--clr-nile); }
    .card-box.green { border-top: 5px solid var(--clr-green); }
    .card-box.red { border-top: 5px solid var(--clr-red); }

    .card-box .icon { font-size: 2.2rem; margin-bottom: 10px; }
    .card-box h3 { font-size: 1.2rem; font-weight: 800; color: var(--clr-nile-dark); margin-bottom: 8px; }
    .card-box p { font-size: 0.92rem; color: var(--clr-gray); line-height: 1.65; }

    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--clr-ivory-dark);
      margin-bottom: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: right;
      font-size: 0.92rem;
    }

    th {
      background: var(--clr-nile);
      color: white;
      padding: 13px 18px;
      font-weight: 700;
      font-size: 0.88rem;
    }

    td {
      padding: 13px 18px;
      border-bottom: 1px solid var(--clr-ivory-dark);
      color: var(--clr-dark);
    }

    tr:nth-child(even) td { background: #FAFAF8; }
    tr:hover td { background: var(--clr-sand-light); }

    .badge-gain {
      background: var(--clr-green-bg);
      color: var(--clr-green);
      padding: 5px 12px;
      border-radius: 16px;
      font-weight: 800;
      display: inline-block;
    }

    .badge-loss {
      background: var(--clr-red-bg);
      color: var(--clr-red);
      padding: 5px 12px;
      border-radius: 16px;
      font-weight: 700;
      display: inline-block;
    }

    .funnel-step {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      border-radius: 10px;
      background: var(--clr-ivory);
      font-size: 0.9rem;
      font-weight: 600;
      border-right: 4px solid var(--clr-nile);
      margin-bottom: 10px;
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
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.85rem;
      box-shadow: var(--shadow-sm);
      flex-shrink: 0;
    }

    .bottom-bar {
      height: 68px;
      background: rgba(11, 27, 43, 0.95);
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
      padding: 10px 24px;
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
      gap: 6px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      cursor: pointer;
      transition: var(--transition);
    }

    .dot.active {
      background: var(--clr-gold);
      width: 24px;
      border-radius: 8px;
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
      <div class="slide-counter" id="slideIndicator">1 / 12</div>
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
          <div class="cover-kpi-lbl">متوسط سعر الليلة (ADR)<br>(750 جـ - 1,250 جـ)</div>
        </div>
        <div class="cover-kpi-card">
          <div class="cover-kpi-val">+225,963 جـ</div>
          <div class="cover-kpi-lbl">أقصى وفر شهري متوقع<br>في ذروة الموسم المرتفع</div>
        </div>
        <div class="cover-kpi-card">
          <div class="cover-kpi-val">&lt; 4 أيام</div>
          <div class="cover-kpi-lbl">فترة استرداد تكلفة الموقع<br>(استثمار 25k جـ)</div>
        </div>
        <div class="cover-kpi-card">
          <div class="cover-kpi-val">35%</div>
          <div class="cover-kpi-lbl">عمولات OTAs المهدرة<br>تستنزف ثلث الإيرادات</div>
        </div>
      </div>
    </section>

    <!-- SLIDE 2: Executive Summary -->
    <section class="slide" data-slide="2">
      <div class="slide-header">
        <div>
          <div class="slide-tag">نظرة عامة</div>
          <h2 class="slide-title">الملخص التنفيذي: <span>أهداف الدراسة والفرصة الاستثمارية</span></h2>
          <p class="slide-subtitle">تحويل فندق هينو الأهرامات من الاعتماد الكلي على الوسطاء إلى نموذج الحجز المباشر المربح</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>
      <div class="slide-body">
        <div class="grid-3">
          <div class="card-box red">
            <div class="icon">📉</div>
            <h3>تحدي العمولات المرتفعة</h3>
            <p>منصات Booking و Agoda تقتطع عمولات تصل إلى 35% من قيمة كل حجز، مما يقلص الأرباح التشغيلية بشكل حاد ويحرم الفندق من بناء قاعدة نزلاء مباشرة.</p>
          </div>
          <div class="card-box gold">
            <div class="icon">🌐</div>
            <h3>حل الحجز المباشر</h3>
            <p>امتلاك محرك حجز مباشر وموقع متعدد اللغات والعملات يتيح للنزيل الحجز فوراً بدون وسيط، مما يوفر حتى 225,963 جـ شهرياً من العمولات المهدرة.</p>
          </div>
          <div class="card-box green">
            <div class="icon">📍</div>
            <h3>التسويق الذكي عبر خرائط جوجل</h3>
            <p>تركيز الإنفاق الإعلاني على Google Maps Local Ads لاستهداف السياح المتواجدين بالفعل عند الأهرامات، لتحقيق عائد إعلاني يصل إلى 1 : 60.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 3: The Problem -->
    <section class="slide" data-slide="3">
      <div class="slide-header">
        <div>
          <div class="slide-tag">تحليل التحدي</div>
          <h2 class="slide-title">أين تذهب أموال الفندق؟ <span>تحليل نزيف عمولات الـ OTAs</span></h2>
          <p class="slide-subtitle">كيف تلتهم منصات الحجز ثلث الإيراد الكلي لفندق هينو</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <div class="card-box red">
            <h3 style="color: var(--clr-red); margin-bottom: 14px;">⚠️ التكلفة الخفية للوسطاء (OTAs)</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 0.95rem; line-height: 1.6;">
              <li>• <strong>عمولة 35%</strong> تقتطع فورياً من كل غرفة يتم حجزها عبر المنصة.</li>
              <li>• في الموسم المرتفع، يخسر الفندق أكثر من <strong>278,000 جـ شهرياً</strong> كعمولات.</li>
              <li>• حجب بيانات النزيل الحقيقية وعدم إمكانية إعادة استهدافه مستقبلاً.</li>
              <li>• تحكم المنصات الخارجية في شروط الإلغاء وسياسات التسعير.</li>
            </ul>
          </div>
          <div class="card-box nile">
            <h3 style="color: var(--clr-nile); margin-bottom: 14px;">📊 توزيع الإيراد التقليدي عبر OTAs</h3>
            <div style="background: var(--clr-red-bg); border: 1px solid var(--clr-red); padding: 16px; border-radius: 10px; margin-bottom: 14px; text-align: center;">
              <strong style="color: var(--clr-red); font-size: 1.2rem;">35% عمولات مهدرة للمنصات</strong>
              <p style="font-size: 0.88rem; color: var(--clr-dark); margin-top: 4px;">تصل إلى 278,906 جـ شهرياً تخرج خارج حسابات الفندق</p>
            </div>
            <div style="background: var(--clr-sand-light); border: 1px solid var(--clr-gold); padding: 16px; border-radius: 10px; text-align: center;">
              <strong style="color: var(--clr-nile); font-size: 1.1rem;">65% المتبقي لتغطية المصاريف والأرباح</strong>
              <p style="font-size: 0.88rem; color: var(--clr-gray); margin-top: 4px;">يتحمل منها الفندق: التشغيل، الصيانة، الرواتب، والكهرباء</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 4: Capacity & Pricing Baseline -->
    <section class="slide" data-slide="4">
      <div class="slide-header">
        <div>
          <div class="slide-tag">البيانات الأساسية</div>
          <h2 class="slide-title">السعة التشغيلية <span>وهيكل أسعار الغرف المعتمد</span></h2>
          <p class="slide-subtitle">حساب الطاقة الاستيعابية الشهرية للفندق وتصنيفات الغرف المعتمدة للدراسة</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>
      <div class="slide-body">
        <div class="grid-3" style="margin-bottom: 18px;">
          <div class="card-box gold" style="text-align: center; padding: 16px;">
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--clr-nile);">25 غرفة</div>
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--clr-dark);">طاقة الفندق الاستيعابية</div>
            <div style="font-size: 0.8rem; color: var(--clr-gray);">4 أدوار + روف بإطلالة الأهرامات</div>
          </div>
          <div class="card-box gold" style="text-align: center; padding: 16px;">
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--clr-nile);">750 ليلة</div>
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--clr-dark);">السعة المتاحة شهرياً</div>
            <div style="font-size: 0.8rem; color: var(--clr-gray);">25 غرفة × 30 يوم تشغيلي</div>
          </div>
          <div class="card-box gold" style="text-align: center; padding: 16px;">
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--clr-nile);">$15 - $25</div>
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--clr-dark);">متوسط سعر الليلة (ADR)</div>
            <div style="font-size: 0.8rem; color: var(--clr-gray);">750 جـ (منخفض) / 1,250 جـ (مرتفع)</div>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>فئة الغرفة</th>
                <th>Standard (عادية)</th>
                <th>With Window (بنافذة)</th>
                <th>With Balcony (ببلكونة)</th>
                <th>King Suite (سويت أهرامات)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Single Room (مفردة)</strong></td>
                <td>$12 (600 جـ)</td>
                <td>$15 (750 جـ)</td>
                <td>$20 (1,000 جـ)</td>
                <td>—</td>
              </tr>
              <tr>
                <td><strong>Double Room (مزدوجة)</strong></td>
                <td>$18 (900 جـ)</td>
                <td>$22 (1,100 جـ)</td>
                <td>$25 (1,250 جـ)</td>
                <td>—</td>
              </tr>
              <tr>
                <td><strong>Triple / Family (ثلاثية)</strong></td>
                <td>$25 (1,250 جـ)</td>
                <td>$30 (1,500 جـ)</td>
                <td>$35 (1,750 جـ)</td>
                <td>—</td>
              </tr>
              <tr>
                <td><strong>Suite Pyramids View</strong></td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td><strong style="color: var(--clr-gold); font-size: 1.05rem;">$45 (2,250 جـ)</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SLIDE 5: Low Season Feasibility -->
    <section class="slide" data-slide="5">
      <div class="slide-header">
        <div>
          <div class="slide-tag">الجدوى المالية (1/2)</div>
          <h2 class="slide-title">الموسم المنخفض (Low Season): <span>تحليل الإيرادات والوفر</span></h2>
          <p class="slide-subtitle">متوسط سعر الليلة ADR = 15$ (750 جـ) — مقارنة سيناريو إشغال 50% وإشغال 70%</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>
      <div class="slide-body">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>المؤشر المالي</th>
                <th>سيناريو إشغال 50% (375 ليلة)</th>
                <th>سيناريو إشغال 70% (525 ليلة)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>إجمالي الإيراد الشهري الكلي</strong></td>
                <td>281,250 جنيه</td>
                <td>393,750 جنيه</td>
              </tr>
              <tr>
                <td><strong>عمولات OTAs المهدرة سابقاً (35%)</strong></td>
                <td><span class="badge-loss">98,437 جنيه</span></td>
                <td><span class="badge-loss">137,812 جنيه</span></td>
              </tr>
              <tr>
                <td><strong>تكلفة إعلانات جوجل + موقع الحجز المباشر</strong></td>
                <td>17,083 جنيه</td>
                <td>17,083 جنيه</td>
              </tr>
              <tr>
                <td><strong>عمولة القنوات المساندة Agoda (30%)</strong></td>
                <td>12,656 جنيه</td>
                <td>17,718 جنيه</td>
              </tr>
              <tr>
                <td><strong>صافي الوفر الشهري المحقق للفندق</strong></td>
                <td><span class="badge-gain" style="font-size: 1.15rem;">+ 68,698 جنيه / شهرياً</span></td>
                <td><span class="badge-gain" style="font-size: 1.15rem;">+ 103,010 جنيه / شهرياً</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background: var(--clr-sand-light); padding: 12px 18px; border-radius: 8px; border-right: 4px solid var(--clr-gold); font-size: 0.95rem; color: var(--clr-nile-dark);">
          💡 <strong>استنتاج:</strong> حتى في فترات الركود (إشغال 50%)، يوفر نموذج الحجز المباشر أكثر من <strong>68,000 جـ شهرياً</strong> كأرباح صافية مستردة!
        </div>
      </div>
    </section>

    <!-- SLIDE 6: High Season Feasibility -->
    <section class="slide" data-slide="6">
      <div class="slide-header">
        <div>
          <div class="slide-tag">الجدوى المالية (2/2)</div>
          <h2 class="slide-title">الموسم المرتفع (High Season): <span>أقصى عائد مالي وربحية</span></h2>
          <p class="slide-subtitle">متوسط سعر الليلة ADR = 25$ (1,250 جـ) — مقارنة سيناريو إشغال 70% وذروة الإشغال 85%</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>
      <div class="slide-body">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>المؤشر المالي</th>
                <th>سيناريو إشغال 70% (525 ليلة)</th>
                <th>ذروة الموسم 85% (637 ليلة)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>إجمالي الإيراد الشهري الكلي</strong></td>
                <td>656,250 جنيه</td>
                <td>796,875 جنيه</td>
              </tr>
              <tr>
                <td><strong>عمولات OTAs المهدرة سابقاً (35%)</strong></td>
                <td><span class="badge-loss">229,687 جنيه</span></td>
                <td><span class="badge-loss">278,906 جنيه</span></td>
              </tr>
              <tr>
                <td><strong>تكلفة إعلانات جوجل + موقع الحجز المباشر</strong></td>
                <td>17,083 جنيه</td>
                <td>17,083 جنيه</td>
              </tr>
              <tr>
                <td><strong>عمولة القنوات المساندة Agoda (30%)</strong></td>
                <td>29,531 جنيه</td>
                <td>35,859 جنيه</td>
              </tr>
              <tr>
                <td><strong>صافي الوفر الشهري المحقق للفندق</strong></td>
                <td><span class="badge-gain" style="font-size: 1.15rem;">+ 183,073 جنيه / شهرياً</span></td>
                <td><span class="badge-gain" style="font-size: 1.25rem;">+ 225,963 جنيه / شهرياً</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background: var(--clr-green-bg); padding: 12px 18px; border-radius: 8px; border-right: 4px solid var(--clr-green); font-size: 0.95rem; color: #065F46;">
          🚀 <strong>في ذروة الموسم (إشغال 85%):</strong> يسترد الفندق أكثر من <strong>225,000 جـ شهرياً</strong> كانت تذهب بالكامل لوسطاء الحجز الخارجيين!
        </div>
      </div>
    </section>

    <!-- SLIDE 7: CapEx Payback -->
    <section class="slide" data-slide="7">
      <div class="slide-header">
        <div>
          <div class="slide-tag">استرداد الاستثمار</div>
          <h2 class="slide-title">تحليل فترة استرداد تكلفة الموقع <span>(CapEx Payback)</span></h2>
          <p class="slide-subtitle">كيف يسترد الفندق تكلفة تطوير النظام البالغة 25,000 جنيه في أيام معدودة</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>
      <div class="slide-body">
        <div class="grid-3">
          <div class="card-box nile" style="text-align: center;">
            <div style="background: var(--clr-nile); color: white; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-block; margin-bottom: 12px;">اليوم 1 - 3</div>
            <h3>إطلاق وتشغيل الموقع</h3>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--clr-gold); margin: 8px 0;">25,000 جـ</div>
            <p>تكلفة استثمارية رأسمالية تدفع لمرة واحدة لإنشاء وتدشين الموقع متعدد اللغات ومحرك الحجز المباشر.</p>
          </div>
          <div class="card-box gold" style="text-align: center;">
            <div style="background: var(--clr-gold); color: white; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-block; margin-bottom: 12px;">اليوم 4</div>
            <h3>نقطة التعادل (Break-even)</h3>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--clr-green); margin: 8px 0;">100% استرداد</div>
            <p>من خلال حجز أول 15-20 ليلة مباشرة وتوفير عمولة الـ 35%، يتم استرداد كامل تكلفة الموقع في أقل من 4 أيام.</p>
          </div>
          <div class="card-box green" style="text-align: center;">
            <div style="background: var(--clr-green); color: white; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-block; margin-bottom: 12px;">ما بعد اليوم 4</div>
            <h3>أرباح صافية مستمرة</h3>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--clr-green); margin: 8px 0;">+68k إلى +225k</div>
            <p>كل ليلة إضافية يتم حجزها تمثل وفراً مالياً وأرباحاً صافية تتدفق مباشرة لخزينة الفندق شهرياً.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 8: Intent & CVR -->
    <section class="slide" data-slide="8">
      <div class="slide-header">
        <div>
          <div class="slide-tag">المقارنة التسويقية (1/2)</div>
          <h2 class="slide-title">نية الحجز ومعدل التحويل: <span>Google Maps vs Meta</span></h2>
          <p class="slide-subtitle">لماذا تتفوق خرائط جوجل باكتساح على فيسبوك وإنستجرام كقناة حجز فندقي</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- Google -->
          <div class="card-box green">
            <h3 style="color: var(--clr-green); margin-bottom: 12px;">📍 إعلانات خرائط جوجل (Google Maps Ads)</h3>
            <div style="background: var(--clr-green-bg); padding: 14px; border-radius: 10px; margin-bottom: 12px;">
              <strong style="color: var(--clr-green); font-size: 1.1rem;">95% نية حجز فورية (Active Search)</strong>
              <p style="font-size: 0.88rem; color: var(--clr-dark); margin-top: 4px;">السائح يقف بالفعل عند الأهرامات ويبحث في هاتفه عن غرفة للمبيت الليلة.</p>
            </div>
            <div style="background: var(--clr-green-bg); padding: 14px; border-radius: 10px;">
              <strong style="color: var(--clr-green); font-size: 1.1rem;">12.5% معدل تحويل النقرة لحجز (CVR)</strong>
              <p style="font-size: 0.88rem; color: var(--clr-dark); margin-top: 4px;">كل 100 نقرة تترجم إلى 12 حجز مؤكد ومباشر — أعلى بـ 31 ضعفاً من Meta!</p>
            </div>
          </div>
          <!-- Meta -->
          <div class="card-box red">
            <h3 style="color: var(--clr-red); margin-bottom: 12px;">📱 فيسبوك وإنستجرام (Meta Platforms)</h3>
            <div style="background: var(--clr-red-bg); padding: 14px; border-radius: 10px; margin-bottom: 12px;">
              <strong style="color: var(--clr-red); font-size: 1.1rem;">10% نية حجز ضعيفة (Passive Browsing)</strong>
              <p style="font-size: 0.88rem; color: var(--clr-dark); margin-top: 4px;">مستخدم يتصفح للتسلية وتضييع الوقت بدون أي نية سفر أو حجز حقيقي.</p>
            </div>
            <div style="background: var(--clr-red-bg); padding: 14px; border-radius: 10px;">
              <strong style="color: var(--clr-red); font-size: 1.1rem;">0.4% معدل تحويل ضعيف جداً (CVR)</strong>
              <p style="font-size: 0.88rem; color: var(--clr-dark); margin-top: 4px;">تحتاج إلى 1000 نقرة إعلانية لتحصل على 4 حجوزات فقط بسبب كثرة الرسائل غير الجادة.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 9: CAC & ROAS -->
    <section class="slide" data-slide="9">
      <div class="slide-header">
        <div>
          <div class="slide-tag">المقارنة التسويقية (2/2)</div>
          <h2 class="slide-title">تكلفة الاستحواذ والعائد الإعلاني: <span>CAC & ROAS</span></h2>
          <p class="slide-subtitle">المقارنة المالية الدقيقة بين كفاءة إنفاق إعلانات جوجل مقابل السوشيال ميديا</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>
      <div class="slide-body">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>معيار الكفاءة الإعلانية</th>
                <th>إعلانات خرائط جوجل (Google Maps)</th>
                <th>فيسبوك وإنستجرام (Meta Platforms)</th>
                <th>الفارق الإستراتيجي</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>تكلفة الاستحواذ على النزيل (CAC)</strong></td>
                <td><span class="badge-gain">~45 جنيه مصري</span><br><small>دفع مقابل نقرة السائح الفعلي فقط</small></td>
                <td><span class="badge-loss">~380 جنيه مصري</span><br><small>هدر على غير المهتمين بالسفر</small></td>
                <td><strong>توفير 88% من تكلفة اجتذاب النزيل 💰</strong></td>
              </tr>
              <tr>
                <td><strong>ميزانية إنتاج المحتوى والفيديوهات</strong></td>
                <td><span class="badge-gain">0 جنيه (مجاناً)</span><br><small>صور الفندق وتقييمات النزلاء الحقيقية</small></td>
                <td><span class="badge-loss">~15,000 جنيه / شهرياً</span><br><small>مصورين، ريلز، وتعديل فيديوهات</small></td>
                <td><strong>توفير 15 ألف جنيه شهرياً بالكامل ✨</strong></td>
              </tr>
              <tr>
                <td><strong>نسبة الرسائل غير الجادة ("بكام؟")</strong></td>
                <td><span class="badge-gain">أقل من 5%</span><br><small>دخول مباشر لمحرك الحجز والدفع</small></td>
                <td><span class="badge-loss">أكثر من 85%</span><br><small>استنزاف وقت الاستقبال بلا جدوى</small></td>
                <td><strong>توجيه فوري للدفع الإلكتروني ⚡</strong></td>
              </tr>
              <tr>
                <td><strong>العائد على الإنفاق الإعلاني (ROAS)</strong></td>
                <td><span class="badge-gain">1 : 60</span><br><small>كل 1k تنفق تحقق 60k إيراد</small></td>
                <td><span class="badge-loss">1 : 3</span><br><small>كل 1k تحقق 3k فقط</small></td>
                <td><strong>كفاءة استثمارية أعلى بـ 20 ضعفاً 🚀</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SLIDE 10: Conversion Funnels -->
    <section class="slide" data-slide="10">
      <div class="slide-header">
        <div>
          <div class="slide-tag">مسار العميل</div>
          <h2 class="slide-title">إنفوجراف قمع التحويل: <span>مقارنة رحلة النزيل (Funnel)</span></h2>
          <p class="slide-subtitle">كيف يتحول السائح من مجرد باحث إلى حجز مؤكد ومسدد بالكامل</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- Google Funnel -->
          <div class="card-box green">
            <h3 style="color: var(--clr-green); margin-bottom: 14px;">📍 قمع جوجل ماب (Google Maps Funnel)</h3>
            <div class="funnel-step step-win">
              <span class="step-num">1</span>
              <div><strong>بحث مباشر:</strong> سائح يبحث عن "Pyramids View Hotel"</div>
            </div>
            <div class="funnel-step step-win">
              <span class="step-num">2</span>
              <div><strong>ظهور الفندق:</strong> ظهور إعلان الفندق أعلى الخريطة في الهرم</div>
            </div>
            <div class="funnel-step step-win">
              <span class="step-num">3</span>
              <div><strong>النقرة والموقع:</strong> التوجيه المباشر لموقع الحجز الفندقي</div>
            </div>
            <div class="funnel-step step-win" style="background: #10B981; color: white; font-weight: 800;">
              <span class="step-num" style="color: var(--clr-green);">4</span>
              <div><strong>النتيجة:</strong> حجز ودفع إلكتروني مباشر (0% عمولة) 🎉</div>
            </div>
          </div>
          <!-- Meta Funnel -->
          <div class="card-box red">
            <h3 style="color: var(--clr-red); margin-bottom: 14px;">📱 قمع السوشيال ميديا (Meta Funnel)</h3>
            <div class="funnel-step">
              <span class="step-num">1</span>
              <div><strong>مشاهدة عابرة:</strong> مستخدم يشاهد فيديو Reel أثناء التصفح</div>
            </div>
            <div class="funnel-step">
              <span class="step-num">2</span>
              <div><strong>إرسال رسالة:</strong> إرسال سؤال تقليدي "بكام الليلة؟"</div>
            </div>
            <div class="funnel-step">
              <span class="step-num">3</span>
              <div><strong>المتابعة:</strong> انتظار رد الاستقبال وضياع وقت الموظفين</div>
            </div>
            <div class="funnel-step step-lose">
              <span class="step-num">4</span>
              <div><strong>النتيجة:</strong> تجاهل أو حجز غير مؤكد (تسرب النزلاء) ⚠️</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 11: Budget & Channel Mix -->
    <section class="slide" data-slide="11">
      <div class="slide-header">
        <div>
          <div class="slide-tag">الخطة التسويقية</div>
          <h2 class="slide-title">توزيع الميزانية الإعلانية <span>ومزيج القنوات المستهدف</span></h2>
          <p class="slide-subtitle">التوزيع الأمثل لميزانية التسويق وقنوات البيع لتحقيق أعلى ربحية</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- Budget -->
          <div class="card-box gold">
            <h3 style="color: var(--clr-nile); margin-bottom: 12px;">🎯 تخصيص الميزانية الإعلانية (15,000 جـ/شهر)</h3>
            <div style="background: var(--clr-green-bg); padding: 14px; border-radius: 10px; margin-bottom: 12px;">
              <strong style="color: var(--clr-green); font-size: 1.05rem;">100% إعلانات Google Maps Local Search Ads</strong>
              <p style="font-size: 0.88rem; color: var(--clr-dark); margin-top: 4px;">الميزانية: 15,000 جـ شهرياً (500 جـ / يومياً) لاستهداف السياح في منطقة الهرم.</p>
            </div>
            <div style="background: var(--clr-red-bg); padding: 14px; border-radius: 10px;">
              <strong style="color: var(--clr-red); font-size: 1.05rem;">0% إعلانات فيسبوك وإنستجرام (Meta)</strong>
              <p style="font-size: 0.88rem; color: var(--clr-dark); margin-top: 4px;">استبعاد تام لتوفير تكلفة الإعلانات ومصاريف إنتاج المحتوى البالغة 15k شهرياً.</p>
            </div>
          </div>
          <!-- Channel Mix -->
          <div class="card-box nile">
            <h3 style="color: var(--clr-nile); margin-bottom: 12px;">🔄 المزيج البيعي المستهدف (Channel Mix)</h3>
            <div style="background: var(--clr-sand-light); padding: 14px; border-radius: 10px; margin-bottom: 12px;">
              <strong style="color: var(--clr-gold); font-size: 1.05rem;">70% حجز مباشر عبر موقع الفندق وجوجل ماب</strong>
              <p style="font-size: 0.88rem; color: var(--clr-dark); margin-top: 4px;">القناة الرئيسية الأكثر ربحية — عمولة 0% وتواصل مباشر لبيع الجولات السياحية.</p>
            </div>
            <div style="background: #F1F5F9; padding: 14px; border-radius: 10px;">
              <strong style="color: var(--clr-nile); font-size: 1.05rem;">30% قنوات مكملة مساندة (Agoda & Airbnb)</strong>
              <p style="font-size: 0.88rem; color: var(--clr-dark); margin-top: 4px;">الحفاظ على التواجد لسد فجوات الإشغال في منتصف الأسبوع وبناء تقييمات دولية.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 12: Recommendations -->
    <section class="slide" data-slide="12">
      <div class="slide-header">
        <div>
          <div class="slide-tag">الخاتمة والقرارات</div>
          <h2 class="slide-title">التوصيات النهائية <span>وخريطة الطريق التنفيذية</span></h2>
          <p class="slide-subtitle">القرارات الإستراتيجية الثلاثة لتحقيق أقصى ربحية تشغيلية لفندق هينو الأهرامات</p>
        </div>
        <div class="slide-logo-badge">HENU PYRAMIDS</div>
      </div>
      <div class="slide-body">
        <div class="grid-3">
          <div class="card-box gold">
            <div class="icon">🚀</div>
            <h3>1. موقع الحجز المباشر</h3>
            <p>الاعتماد على موقع الفندق الإلكتروني كبوابة الحجز الأساسية مع دعم اللغات، العملات، والحجز السريع والدفع عند الوصول.</p>
            <div style="background: var(--clr-sand-light); padding: 10px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; color: var(--clr-nile); margin-top: 12px;">استثمار 25k — استرداد في أقل من 4 أيام</div>
          </div>
          <div class="card-box nile">
            <div class="icon">🎯</div>
            <h3>2. تركيز إعلانات جوجل</h3>
            <p>تخصيص 100% من الميزانية الإعلانية (15,000 جـ/شهرياً) لحملات Google Maps Local Search Ads لجذب السياح الفعليين.</p>
            <div style="background: var(--clr-sand-light); padding: 10px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; color: var(--clr-nile); margin-top: 12px;">عائد إعلاني (ROAS) يصل لـ 1 : 60</div>
          </div>
          <div class="card-box green">
            <div class="icon">🔄</div>
            <h3>3. تحسين مزيج القنوات</h3>
            <p>الإبقاء على Agoda و Airbnb كقنوات مكملة مساندة (30%) واستبعاد فيسبوك وإنستجرام تماماً لمنع الهدر المالي.</p>
            <div style="background: var(--clr-sand-light); padding: 10px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; color: var(--clr-nile); margin-top: 12px;">وفر إجمالي يصل إلى +225k جـ شهرياً</div>
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
      <div class="dot" onclick="goToSlide(7)"></div>
      <div class="dot" onclick="goToSlide(8)"></div>
      <div class="dot" onclick="goToSlide(9)"></div>
      <div class="dot" onclick="goToSlide(10)"></div>
      <div class="dot" onclick="goToSlide(11)"></div>
      <div class="dot" onclick="goToSlide(12)"></div>
    </div>

    <button class="btn-nav" id="btnNext" onclick="nextSlide()">التالي ▶</button>
  </footer>

  <script>
    let currentSlide = 1;
    const totalSlides = 12;

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
console.log('12-Slide HTML5 Interactive Presentation created at: ' + htmlPath);
