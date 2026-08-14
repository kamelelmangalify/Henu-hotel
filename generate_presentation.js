const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

console.log('Starting PowerPoint Generation Script...');

// Create a new presentation instance
let pptx = new pptxgen();

// Set properties
pptx.title = 'شراكة فندق هينو ومدرسة ستارز الفندقية';
pptx.subject = 'مقترح شراكة تدريبية';
pptx.author = 'فندق هينو';
pptx.company = 'HENU Hotel';

// Layout: 16x9 (width: 10 inches, height: 5.625 inches)
pptx.layout = 'LAYOUT_16x9';

// Color Palette Constants
const COLORS = {
  bg: '090D16',         // Dark slate background
  cardBg: '111827',     // Solid dark card background
  cardBorder: '1F2937', // Dark border
  primary: '2563EB',    // Accent Blue
  primaryLight: '60A5FA',
  secondary: '10B981',  // Accent Emerald Green
  secondaryLight: '34D399',
  accent: 'F59E0B',     // Accent Amber
  textWhite: 'F3F4F6',  // Main text
  textMuted: '9CA3AF',  // Muted description text
  black: '000000'
};

const FONT = 'Cairo';

// Helper function to create base slide with title and subtitle
function createBaseSlide(titleText, subtitleText = '') {
  let slide = pptx.addSlide();
  
  // Set slide background
  slide.background = { fill: COLORS.bg };
  
  // Add decorative background shapes (top-left & bottom-right radial glow effect using subtle circles)
  slide.addShape(pptx.shapes.OVAL, {
    x: -1, y: -1, w: 4, h: 4,
    fill: { type: 'solid', color: '1E3A8A', alpha: 80 } // Transparent deep blue
  });
  slide.addShape(pptx.shapes.OVAL, {
    x: 7, y: 3, w: 4, h: 4,
    fill: { type: 'solid', color: '065F46', alpha: 80 } // Transparent deep green
  });

  // Slide Title (RTL Arabic)
  slide.addText(titleText, {
    x: 0.5, y: 0.4, w: 9.0, h: 0.5,
    fontFace: FONT,
    fontSize: 22,
    color: COLORS.textWhite,
    bold: true,
    align: 'right',
    rtl: true
  });

  // Subtitle (RTL Arabic)
  if (subtitleText) {
    slide.addText(subtitleText, {
      x: 0.5, y: 0.9, w: 9.0, h: 0.4,
      fontFace: FONT,
      fontSize: 12,
      color: COLORS.textMuted,
      align: 'right',
      rtl: true
    });
  }

  // Footer Line
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 5.3, w: 9.0, h: 0.01,
    fill: { color: COLORS.cardBorder }
  });

  // Footer Text
  slide.addText('شراكة فندق هينو & مدرسة ستارز الفندقية', {
    x: 0.5, y: 5.35, w: 4.5, h: 0.25,
    fontFace: FONT,
    fontSize: 8,
    color: COLORS.textMuted,
    align: 'right',
    rtl: true
  });

  slide.addText('HENU Hotel | Stars School', {
    x: 5.0, y: 5.35, w: 4.5, h: 0.25,
    fontFace: FONT,
    fontSize: 8,
    color: COLORS.textMuted,
    align: 'left'
  });

  return slide;
}

// ----------------------------------------------------
// SLIDE 1: COVER SLIDE
// ----------------------------------------------------
console.log('Generating Slide 1: Cover...');
let slide1 = pptx.addSlide();
slide1.background = { fill: COLORS.bg };

// Decorative glow shapes
slide1.addShape(pptx.shapes.OVAL, { x: 3, y: 1, w: 4, h: 4, fill: { type: 'solid', color: '1E3A8A', alpha: 70 } });
slide1.addShape(pptx.shapes.OVAL, { x: -0.5, y: 2, w: 3, h: 3, fill: { type: 'solid', color: '065F46', alpha: 70 } });

// Academic Cap Icon representation (using characters or custom graphic shape)
// Let's create two cards representing the institutions
// Hotel Card
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 2.2, y: 0.8, w: 2.0, h: 1.0,
  fill: { color: COLORS.cardBg },
  line: { color: COLORS.primary, width: 2 }
});
slide1.addText('🏨\nفندق هينو HENU', {
  x: 2.2, y: 0.9, w: 2.0, h: 0.8,
  fontFace: FONT,
  fontSize: 12,
  color: COLORS.textWhite,
  bold: true,
  align: 'center',
  rtl: true
});

// Link Icon in middle
slide1.addText('🤝', {
  x: 4.6, y: 1.1, w: 0.8, h: 0.5,
  fontFace: FONT,
  fontSize: 24,
  align: 'center'
});

// School Card
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 5.8, y: 0.8, w: 2.0, h: 1.0,
  fill: { color: COLORS.cardBg },
  line: { color: COLORS.secondary, width: 2 }
});
slide1.addText('🏫\nمدرسة ستارز الفندقية', {
  x: 5.8, y: 0.9, w: 2.0, h: 0.8,
  fontFace: FONT,
  fontSize: 12,
  color: COLORS.textWhite,
  bold: true,
  align: 'center',
  rtl: true
});

// Main Title
slide1.addText('شراكة استراتيجية لبناء الكوادر الفندقية المستقبلية', {
  x: 0.5, y: 2.3, w: 9.0, h: 1.2,
  fontFace: FONT,
  fontSize: 28,
  color: COLORS.textWhite,
  bold: true,
  align: 'center',
  rtl: true
});

// Tagline
slide1.addText('مبادرة التدريب والتطوير المهني المشترك لتأهيل الطلاب ميدانياً', {
  x: 0.5, y: 3.6, w: 9.0, h: 0.4,
  fontFace: FONT,
  fontSize: 14,
  color: COLORS.secondaryLight,
  bold: true,
  align: 'center',
  rtl: true
});

// Date
slide1.addText('أغسطس 2026م', {
  x: 0.5, y: 4.4, w: 9.0, h: 0.3,
  fontFace: FONT,
  fontSize: 11,
  color: COLORS.textMuted,
  align: 'center'
});


// ----------------------------------------------------
// SLIDE 2: VISION & GOALS
// ----------------------------------------------------
console.log('Generating Slide 2: Vision & Goals...');
let slide2 = createBaseSlide(
  'رؤية وأهداف الشراكة الاستراتيجية',
  'تأسيس تعاون متكامل يربط بين التعليم الأكاديمي والخبرة المهنية لخلق مهارات فندقية استثنائية.'
);

// Left Column: Tajeer Al-Fajwa (Gaps)
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.6, w: 4.0, h: 3.2,
  fill: { color: COLORS.cardBg },
  line: { color: COLORS.cardBorder, width: 1 }
});
// Left slide indicator color bar
slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 4.75, y: 1.6, w: 0.05, h: 3.2,
  fill: { color: COLORS.primary }
});
slide2.addText('🎓 تجسير الفجوة التعليمية', {
  x: 1.0, y: 1.8, w: 3.6, h: 0.4,
  fontFace: FONT,
  fontSize: 16,
  color: COLORS.primaryLight,
  bold: true,
  align: 'right',
  rtl: true
});
slide2.addText('تمكين الطلاب من تطبيق المناهج الفندقية النظرية التي يدرسونها في المدرسة داخل بيئة تشغيل حقيقية وحيوية بفندق هينو (26-27 غرفة).\n\nهذا يسرع عملية اندماجهم العملي في سوق العمل ويكسر هيبة البدايات المهنية لديهم.', {
  x: 1.0, y: 2.3, w: 3.6, h: 2.3,
  fontFace: FONT,
  fontSize: 11,
  color: COLORS.textMuted,
  align: 'right',
  rtl: true
});

// Right Column: Mo'adlat Al-Quality
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 5.2, y: 1.6, w: 4.0, h: 3.2,
  fill: { color: COLORS.cardBg },
  line: { color: COLORS.cardBorder, width: 1 }
});
// Right slide indicator color bar
slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 9.15, y: 1.6, w: 0.05, h: 3.2,
  fill: { color: COLORS.secondary }
});
slide2.addText('🌟 تأصيل معايير الجودة والانضباط', {
  x: 5.4, y: 1.8, w: 3.6, h: 0.4,
  fontFace: FONT,
  fontSize: 16,
  color: COLORS.secondaryLight,
  bold: true,
  align: 'right',
  rtl: true
});
slide2.addText('غرس الروح الفندقية الراقية والانضباط الأخلاقي والمهني في سلوكيات الطلاب، مع التركيز التام على إرضاء النزيل وجودة الخدمة وخصوصية العمل الفندقي.\n\nتدريبهم على مهارات المظهر وحسن التحدث وسرعة التصرف الإيجابي مع شكاوى النزلاء.', {
  x: 5.4, y: 2.3, w: 3.6, h: 2.3,
  fontFace: FONT,
  fontSize: 11,
  color: COLORS.textMuted,
  align: 'right',
  rtl: true
});


// ----------------------------------------------------
// SLIDE 3: THREE-WAY BENEFIT (WIN-WIN-WIN)
// ----------------------------------------------------
console.log('Generating Slide 3: Win-Win-Win Model...');
let slide3 = createBaseSlide(
  'نموذج المنفعة الثلاثية المشتركة (Win-Win-Win)',
  'إستراتيجية تشغيلية مستدامة تحقق عوائد وفوائد ملموسة لجميع الأطراف المعنية بالشراكة.'
);

const winCards = [
  {
    title: '👨‍🎓 المتدرب (الطالب)',
    border: COLORS.primaryLight,
    tasks: [
      '• اكتساب خبرة حقيقية موثقة بسوق العمل الفندقي.',
      '• مكافأة مالية شهرية تغطي نفقات التشجيع والانتقال.',
      '• أولوية توظيف بعد التخرج وشهادة خبرة معتمدة.'
    ]
  },
  {
    title: '🏫 مدرسة ستارز الفندقية',
    border: COLORS.secondaryLight,
    tasks: [
      '• رفع تصنيف وكفاءة خريجي المدرسة الفنية عملياً.',
      '• دعاية تسويقية ممتازة للمدرسة وزيادة إقبال الطلاب.',
      '• بناء علاقة مستدامة مع منشأة سياحية رائدة.'
    ]
  },
  {
    title: '🏨 فندق هينو (HENU)',
    border: COLORS.accent,
    tasks: [
      '• قوة تشغيلية حيوية ونشيطة بتكاليف تشغيل معقولة.',
      '• مصفاة طبيعية لفرز واقتناص أفضل الكفاءات لتعيينها.',
      '• تأسيس مركز ريادي لتطوير وتوريد عمالة فندقية.'
    ]
  }
];

winCards.forEach((card, idx) => {
  let xOffset = 0.5 + (idx * 3.1); // Calculate x position dynamically
  
  // Card base
  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xOffset, y: 1.6, w: 2.9, h: 3.2,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.cardBorder, width: 1 }
  });
  
  // Top accent bar
  slide3.addShape(pptx.shapes.RECTANGLE, {
    x: xOffset + 0.1, y: 1.6, w: 2.7, h: 0.05,
    fill: { color: card.border }
  });

  // Title
  slide3.addText(card.title, {
    x: xOffset + 0.1, y: 1.8, w: 2.7, h: 0.35,
    fontFace: FONT,
    fontSize: 14,
    color: card.border,
    bold: true,
    align: 'center',
    rtl: true
  });

  // Content Bullet points
  let contentText = card.tasks.join('\n\n');
  slide3.addText(contentText, {
    x: xOffset + 0.15, y: 2.3, w: 2.6, h: 2.4,
    fontFace: FONT,
    fontSize: 10.5,
    color: COLORS.textMuted,
    align: 'right',
    rtl: true
  });
});


// ----------------------------------------------------
// SLIDE 4: TRAINING PLAN
// ----------------------------------------------------
console.log('Generating Slide 4: Rotational Training Plan...');
let slide4 = createBaseSlide(
  'برنامج التدريب الدوار (9 أيام)',
  'يبدأ الطالب بالدوران على أقسام الفندق الثلاثة الرئيسية بمعدل 3 أيام في كل قسم لاكتشاف مهاراته واهتماماته.'
);

const departments = [
  {
    title: '🛎️ قسم الاستقبال والترحيب',
    color: COLORS.primaryLight,
    days: [
      'اليوم 1: كود المظهر الفندقي، قواعد الترحيب بالنزلاء والهيكل الأمامي.',
      'اليوم 2: فهم دورة النزيل (Check-in/out)، الاتصال الداخلي والتنسيق.',
      'اليوم 3: مهارات الهاتف الفندقي والتعامل الأولي مع الطلبات والاستفسارات.'
    ]
  },
  {
    title: '🧹 الإشراف الداخلي والتدبير',
    color: COLORS.secondaryLight,
    days: [
      'اليوم 1: التعرف على أدوات ومواد النظافة الأمنة وتوزيع الغرف وقواعد السلامة.',
      'اليوم 2: التدريب العملي لترتيب الأسرّة وتنظيف الغرف وتوفير المستلزمات.',
      'اليوم 3: العمل بقسم المغسلة وفحص جودة الغرفة وجاهزيتها للنزلاء.'
    ]
  },
  {
    title: '🍽️ قسم الخدمة (F&B)',
    color: COLORS.accent,
    days: [
      'اليوم 1: قواعد النظافة الشخصية والتعرف على ترتيب طاولات المطعم (Setup).',
      'اليوم 2: بروتوكول التقديم (Service) وفهم قائمة الطعام وتدوين الطلبات.',
      'اليوم 3: مهارات تنظيف الطاولات (Busboy)، خدمة الغرف وإدارة الشكاوى.'
    ]
  }
];

departments.forEach((dept, idx) => {
  let xOffset = 0.5 + (idx * 3.1);
  
  // Card base
  slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xOffset, y: 1.5, w: 2.9, h: 3.4,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.cardBorder, width: 1 }
  });

  // Top color line
  slide4.addShape(pptx.shapes.RECTANGLE, {
    x: xOffset + 0.1, y: 1.5, w: 2.7, h: 0.05,
    fill: { color: dept.color }
  });

  // Title
  slide4.addText(dept.title, {
    x: xOffset + 0.1, y: 1.65, w: 2.7, h: 0.35,
    fontFace: FONT,
    fontSize: 13,
    color: dept.color,
    bold: true,
    align: 'center',
    rtl: true
  });

  // Days tasks text
  let daysText = dept.days.join('\n\n');
  slide4.addText(daysText, {
    x: xOffset + 0.15, y: 2.1, w: 2.6, h: 2.7,
    fontFace: FONT,
    fontSize: 9.5,
    color: COLORS.textMuted,
    align: 'right',
    rtl: true
  });
});


// ----------------------------------------------------
// SLIDE 5: EVALUATION AND RETENTION
// ----------------------------------------------------
console.log('Generating Slide 5: Evaluation & Retention...');
let slide5 = createBaseSlide(
  'آلية التقييم والتصفية والاستبقاء والفرز المهني',
  'تطبيق معايير تقييم صارمة وعادلة لضمان جودة الخدمة وانتقاء الكفاءات الجديرة بالتعيين.'
);

// Left Block: Steps
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.6, w: 4.0, h: 3.2,
  fill: { color: COLORS.cardBg },
  line: { color: COLORS.cardBorder, width: 1 }
});

const steps = [
  '1. التقييم الأسبوعي: يقوم رئيس القسم المباشر بملء نموذج تقييم أسبوعي (المظهر، الالتزام، الأخلاقيات، الإنتاجية).',
  '2. التخصيص بعد 9 أيام: يتم توجيه الطالب للقسم الأنسب لرغبته التشغيلية وتقييم رؤساء الأقسام.',
  '3. تصفية المقصرين: الطلاب غير الملتزمين بالانضباط والسرية يتم إنهاء تدريبهم فوراً بالتنسيق مع المدرسة.'
];
slide5.addText(steps.join('\n\n'), {
  x: 1.0, y: 1.8, w: 3.6, h: 2.8,
  fontFace: FONT,
  fontSize: 10.5,
  color: COLORS.textMuted,
  align: 'right',
  rtl: true
});

// Right block: Funnel Options
// Option 1: Weak Performance
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 5.2, y: 1.6, w: 4.0, h: 1.4,
  fill: { color: '200A0A' }, // Dark red tint
  line: { color: '7F1D1D', width: 1 }
});
slide5.addText('🔴 الاستغناء التلقائي لغير الملتزمين', {
  x: 5.4, y: 1.75, w: 3.6, h: 0.3,
  fontFace: FONT,
  fontSize: 13,
  color: 'F87171',
  bold: true,
  align: 'right',
  rtl: true
});
slide5.addText('يضمن الفندق إبعاد المتدربين غير الجادين فوراً لحماية سمعة الفندق، والمحافظة على راحة النزلاء في فندق هينو.', {
  x: 5.4, y: 2.1, w: 3.6, h: 0.8,
  fontFace: FONT,
  fontSize: 10,
  color: 'FCA5A5',
  align: 'right',
  rtl: true
});

// Option 2: Retention
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 5.2, y: 3.2, w: 4.0, h: 1.6,
  fill: { color: '062016' }, // Dark green tint
  line: { color: '065F46', width: 1 }
});
slide5.addText('🟢 الاحتفاظ بالصفوة وتوظيفهم', {
  x: 5.4, y: 3.35, w: 3.6, h: 0.3,
  fontFace: FONT,
  fontSize: 13,
  color: COLORS.secondaryLight,
  bold: true,
  align: 'right',
  rtl: true
});
slide5.addText('الطلاب المتميزون يحصلون على شهادات معتمدة، ويتم تعيينهم فوراً بالفندق بعقود عمل مؤقتة أو دائمة عند توفر شواغر، مع ترشيحهم للفنادق الصديقة.', {
  x: 5.4, y: 3.7, w: 3.6, h: 1.0,
  fontFace: FONT,
  fontSize: 10,
  color: COLORS.secondaryLight,
  align: 'right',
  rtl: true
});


// ----------------------------------------------------
// SLIDE 6: FUTURE EXPANSION
// ----------------------------------------------------
console.log('Generating Slide 6: Future Vision...');
let slide6 = createBaseSlide(
  'الرؤية المستقبلية للتوسع والتطوير والشراكة',
  'تطوير الشراكة لتصبح منصة إقليمية معتمدة لتدريب وتوريد العمالة المؤهلة للقطاع السياحي بالكامل.'
);

// Card 1: Supply Agency
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.6, w: 4.0, h: 3.2,
  fill: { color: COLORS.cardBg },
  line: { color: COLORS.cardBorder, width: 1 }
});
slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 1.6, w: 4.0, h: 0.05,
  fill: { color: COLORS.primary }
});
slide6.addText('💼 مكتب توريد العمالة المدربة (التوظيف)', {
  x: 1.0, y: 1.8, w: 3.6, h: 0.4,
  fontFace: FONT,
  fontSize: 15,
  color: COLORS.primaryLight,
  bold: true,
  align: 'right',
  rtl: true
});
slide6.addText('• تحويل فندق هينو لمظلة ومركز لتصدير العمالة المعتمدة.\n• تجميع المتدربين المتميزين وتوريدهم للفنادق الكبرى الصديقة.\n• تحقيق عوائد مالية تشغيلية للفندق عبر عقود توظيف وتوريد.\n• ترسيخ اسم المدرسة كرافد أساسي موثوق لعمالة الفنادق.', {
  x: 1.0, y: 2.3, w: 3.6, h: 2.3,
  fontFace: FONT,
  fontSize: 11,
  color: COLORS.textMuted,
  align: 'right',
  rtl: true
});

// Card 2: Hospitality Academy
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 5.2, y: 1.6, w: 4.0, h: 3.2,
  fill: { color: COLORS.cardBg },
  line: { color: COLORS.cardBorder, width: 1 }
});
slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 5.2, y: 1.6, w: 4.0, h: 0.05,
  fill: { color: COLORS.secondary }
});
slide6.addText('🏫 الأكاديمية الصيفية (دورات لغير الطلاب)', {
  x: 5.4, y: 1.8, w: 3.6, h: 0.4,
  fontFace: FONT,
  fontSize: 15,
  color: COLORS.secondaryLight,
  bold: true,
  align: 'right',
  rtl: true
});
slide6.addText('• تقديم دورات تدريبية مكثفة (برسوم مدفوعة) لراغبي العمل بالسياحة من خارج خريجي المدرسة.\n• التدريس النظري والمحاضرات تتم داخل فصول مدرسة ستارز.\n• التدريب والتطبيق العملي المكثف يتم داخل أروقة فندق هينو.\n• تقسيم إيرادات الدورات بنسب توافقية بين المدرسة والفندق.', {
  x: 5.4, y: 2.3, w: 3.6, h: 2.3,
  fontFace: FONT,
  fontSize: 11,
  color: COLORS.textMuted,
  align: 'right',
  rtl: true
});


// ----------------------------------------------------
// SLIDE 7: FINANCIAL, LOGISTICS & LEGAL FRAMEWORK
// ----------------------------------------------------
console.log('Generating Slide 7: Financial & Legal...');
let slide7 = createBaseSlide(
  'الإطار اللوجيستي والمكافآت والغطاء القانوني',
  'توفير بيئة تدريب آمنة وقانونية تحفز الطلاب على الإنتاجية والالتزام المهني.'
);

// Left Block: Logistics list
slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.6, w: 4.0, h: 3.2,
  fill: { color: COLORS.cardBg },
  line: { color: COLORS.cardBorder, width: 1 }
});

const logisticsItems = [
  '💵 مكافأة التدريب التشجيعية:\nصرف مكافأة شهرية مناسبة للمتدرب تغطي نفقات انتقاله الشخصية وتحفزه على الإنتاج والاستمرار.',
  '🍔 المزايا العينية الفندقية:\nتوفير وجبات غذائية متكاملة أثناء شفت التدريب، وتوفير الزي الموحد (Uniform) المخصص لكل قسم.',
  '⚖️ الغطاء القانوني والامتثال:\nتوقيع "عقد تشغيل أطفال وموافقة ولي أمر" للطلاب القصر، ونموذج "عقد عمل مؤقت وتعهد فندقي" للطلاب البالغين.'
];

slide7.addText(logisticsItems.join('\n\n'), {
  x: 1.0, y: 1.8, w: 3.6, h: 2.8,
  fontFace: FONT,
  fontSize: 10,
  color: COLORS.textMuted,
  align: 'right',
  rtl: true
});

// Right block: Simulation Card (Estimates)
slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 5.2, y: 1.6, w: 4.0, h: 3.2,
  fill: { color: COLORS.cardBg },
  line: { color: COLORS.accent, width: 1 }
});
slide7.addText('📊 نموذج تقديري لميزانية التدريب (5 طلاب)', {
  x: 5.4, y: 1.8, w: 3.6, h: 0.4,
  fontFace: FONT,
  fontSize: 14,
  color: COLORS.accent,
  bold: true,
  align: 'right',
  rtl: true
});

slide7.addText(
  'افتراض دفعة تدريبية مكونة من 5 طلاب شهرياً:\n\n' +
  '• إجمالي مكافآت الطلاب (1500 ج.م / طالب):  7,500 ج.م\n' +
  '• التكلفة التقديرية للوجبات والزي (500 ج.م / طالب):  2,500 ج.م\n' +
  '-----------------------------------------------\n' +
  '• إجمالي تكلفة المبادرة التشغيلية شهرياً:  10,000 ج.م\n\n' +
  '💡 القيمة التشغيلية المضافة: سد شواغر تشغيلية هامة في الريسبشن والسيرفس والهاوس كيبنج بقيمة إنتاجية متميزة وتكلفة معقولة.',
  {
    x: 5.4, y: 2.3, w: 3.6, h: 2.3,
    fontFace: FONT,
    fontSize: 10.5,
    color: COLORS.textWhite,
    align: 'right',
    rtl: true
  }
);


// ----------------------------------------------------
// SLIDE 8: CALL TO ACTION / NEXT STEPS
// ----------------------------------------------------
console.log('Generating Slide 8: Next Steps...');
let slide8 = createBaseSlide(
  'تفعيل الشراكة والخطوات التنفيذية القادمة',
  'خارطة طريق واضحة ومحددة لبدء تفعيل التعاون بشكل فوري وعملي.'
);

const stepsTimeline = [
  {
    num: '1',
    title: 'مراجعة وتطوير المقترح',
    desc: 'مناقشة وتعديل هذا المقترح الفني واللوجيستي والمالي وإقراره من إدارة الفندق.'
  },
  {
    num: '2',
    title: 'توقيع بروتوكول التعاون',
    desc: 'صياغة اتفاقية تعاون إطارية رسمية وتوقيعها مع مدرسة ستارز وصياغة العقود القانونية.'
  },
  {
    num: '3',
    title: 'انطلاق الدفعة الأولى',
    desc: 'توزيع وتعيين المتدربين داخل الفندق وبدء فترة التدوير (9 أيام) ثم التخصص العملي.'
  }
];

stepsTimeline.forEach((step, idx) => {
  let xOffset = 0.5 + (idx * 3.1);
  
  // Base Card
  slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: xOffset, y: 1.8, w: 2.9, h: 2.6,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.cardBorder, width: 1 }
  });

  // Top Circle for number
  slide8.addShape(pptx.shapes.OVAL, {
    x: xOffset + 1.15, y: 1.4, w: 0.6, h: 0.6,
    fill: { color: COLORS.primary },
    line: { color: COLORS.primaryLight, width: 1 }
  });
  slide8.addText(step.num, {
    x: xOffset + 1.15, y: 1.4, w: 0.6, h: 0.6,
    fontFace: FONT,
    fontSize: 14,
    color: COLORS.textWhite,
    bold: true,
    align: 'center'
  });

  // Title
  slide8.addText(step.title, {
    x: xOffset + 0.1, y: 2.1, w: 2.7, h: 0.35,
    fontFace: FONT,
    fontSize: 13,
    color: COLORS.textWhite,
    bold: true,
    align: 'center',
    rtl: true
  });

  // Description
  slide8.addText(step.desc, {
    x: xOffset + 0.15, y: 2.5, w: 2.6, h: 1.7,
    fontFace: FONT,
    fontSize: 10,
    color: COLORS.textMuted,
    align: 'center',
    rtl: true
  });
});

// Final Greeting / Success text at the bottom
slide8.addText('✨ تمنياتنا بالتوفيق والنجاح لهذه الشراكة المثمرة ✨', {
  x: 0.5, y: 4.6, w: 9.0, h: 0.4,
  fontFace: FONT,
  fontSize: 14,
  color: COLORS.secondaryLight,
  bold: true,
  align: 'center',
  rtl: true
});

// Define output path
const outputDir = path.join('d:', 'Henu', 'التدريب والتطوير', 'مدرسة ستارز');
const outputPath = path.join(outputDir, 'عرض_شراكة_مدرسة_ستارز.pptx');

// Ensure directories exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Save the presentation
console.log(`Saving presentation to ${outputPath}...`);
pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`PowerPoint file created successfully at: ${fileName}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error generating PowerPoint file:', err);
    process.exit(1);
  });
