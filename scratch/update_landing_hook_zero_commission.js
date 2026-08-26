const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const rootDir = path.join('d:', 'Henu');
const landingDir = path.join(rootDir, 'website_landing_thetravelwiki');

if (!fs.existsSync(landingDir)) {
  fs.mkdirSync(landingDir, { recursive: true });
}

const landingHtmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>0% عمولة حجز | شركة الإدارة الفندقية الأمريكية - وفر حتى 35% من أرباحك</title>
    <!-- Tailwind CSS v4 CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Cairo', sans-serif; }
        .glass-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); border: 1.5px solid rgba(217, 119, 6, 0.35); }
        .gold-gradient-text { background: linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #FBBF24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .bg-gold-gradient { background: linear-gradient(135deg, #D97706 0%, #B45309 100%); }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen selection:bg-amber-500 selection:text-slate-950">

    <!-- Top Announcement Bar (PRIMARY HOOK) -->
    <div class="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 text-slate-950 text-xs md:text-sm font-black py-2.5 px-4 text-center shadow-lg flex items-center justify-center gap-2">
        <span class="bg-slate-950 text-amber-400 text-xs px-3 py-0.5 rounded-full font-bold">🚨 الحل الجذري لأهم مشكلة فندقية</span>
        <span>ادفع 0% عمولة لحجوزاتك ووفر حتى 35% من أرباحك الإجمالية للفنادق والمطاعم!</span>
    </div>

    <!-- Header / Navbar -->
    <header class="border-b border-slate-800/80 bg-slate-950/90 sticky top-0 z-50 backdrop-blur-md">
        <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-gold-gradient flex items-center justify-center font-black text-slate-950 text-xl shadow-lg">
                    US
                </div>
                <div>
                    <h1 class="font-black text-white text-base md:text-lg leading-none">الإدارة الفندقية الأمريكية</h1>
                    <span class="text-xs text-amber-400 font-semibold">Zero Commission Direct Booking Tech</span>
                </div>
            </div>
            
            <div class="flex items-center gap-3">
                <a href="https://wa.me/201222600296" target="_blank" class="hidden sm:flex bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm py-2.5 px-4 rounded-xl transition items-center gap-2 shadow-md">
                    <span>🇪🇬</span> واتساب مصري
                </a>
                <a href="https://wa.me/13074542064" target="_blank" class="bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs md:text-sm py-2.5 px-4 rounded-xl transition flex items-center gap-2 shadow-md">
                    <span>🇺🇸</span> واتساب أمريكي
                </a>
            </div>
        </div>
    </header>

    <!-- Hero Section (DOMINANT ZERO COMMISSION HOOK) -->
    <section class="relative py-16 md:py-24 px-4 overflow-hidden border-b border-slate-800/60">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-slate-950 to-slate-950 -z-10"></div>
        
        <div class="max-w-5xl mx-auto text-center">
            <div class="inline-flex items-center gap-2 bg-slate-900 border-2 border-amber-500/60 text-amber-400 text-xs md:text-sm font-black px-4 py-2 rounded-full mb-6 shadow-xl animate-pulse">
                🔥 ضربة معلم: حل المشكلة الأكبر والأهم لجميع ملاك الفنادق والمطاعم
            </div>

            <h2 class="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                ليه تدي منصات الحجز الخارجية <span class="text-red-500 underline">35% من مكسبك؟</span> <br>
                <span class="gold-gradient-text">حجوزات فندقك ومطعمك بـ 0% عمولة كاملة!</span>
            </h2>

            <p class="text-slate-200 text-base md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-8">
                شركة الإدارة الفندقية الأمريكية تقدم لك الحل النهائـي: بنبني لك <strong class="text-amber-400 font-bold">موقع ويب خاص بالفندق والمطعم</strong> بنظام حجز مباشر بدون أي وسطاء.. العميل يحجز عندك مباشرة وكل قرش ربح يروح لجيبك لوحدك!
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="https://wa.me/201222600296?text=مرحباً،%20أرغب%20في%20وقف%20نزيف%20العمولات%20وبناء%20موقع%20حجز%20مباشر%20بـ%200%25%20عمولة%20لفندقي" target="_blank" class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg py-4 px-8 rounded-2xl transition shadow-2xl flex items-center justify-center gap-3">
                    <span>💬</span> احصل على موقع الحجز المباشر (0% عمولة)
                </a>
                <a href="#calculator" class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-base py-4 px-8 rounded-2xl transition flex items-center justify-center gap-2">
                    <span>💰</span> احسب وفرك المالي الشهري
                </a>
            </div>

            <!-- Zero Commission Main Highlight Box -->
            <div class="bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/10 border-2 border-amber-400 rounded-3xl p-6 md:p-8 mt-12 text-right shadow-2xl max-w-4xl mx-auto">
                <div class="flex items-center gap-3 mb-3">
                    <span class="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase">المقارنة القاطعة</span>
                    <h3 class="text-xl md:text-2xl font-black text-white">فرق الأرباح الصافية بين المنصات والموقع المباشر</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div class="bg-red-950/40 border border-red-500/40 p-4 rounded-2xl">
                        <div class="text-red-400 font-bold text-sm">❌ منصات الوساطة الخارجية (OTAs)</div>
                        <div class="text-2xl font-black text-white mt-1">تقتطع 18% إلى 35% عمولة</div>
                        <div class="text-slate-400 text-xs mt-1">استنزاف الأرباح، تأخير التحصيل، والتحكم في أسعارك.</div>
                    </div>
                    <div class="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl">
                        <div class="text-emerald-400 font-bold text-sm">🟢 نظام الحجز المباشر لـ الإدارة الأمريكية</div>
                        <div class="text-2xl font-black text-emerald-400 mt-1">0% عمولة (0 جـ وسيط)</div>
                        <div class="text-slate-300 text-xs mt-1">تحصيل فوري، كاش بالفيزا، والربح الصافي 100% لك.</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Supporting Pillars Section (الإدارة، التوريدات، التشطيبات) -->
    <section class="py-16 md:py-24 px-4 border-b border-slate-800/60">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-14">
                <span class="bg-amber-500/20 text-amber-400 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
                    🛠️ منظومة الخدمات الفندقية الشاملة
                </span>
                <h3 class="text-3xl md:text-4xl font-black text-white mt-3">
                    بجانب نظام الـ 0% عمولة.. ندير ونجهز فندقك ومطعمك بالكامل
                </h3>
                <p class="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-2">
                    وفر وقتك وفلوسك من خلال التعامل مع مصدر واحد موثوق يغطي كافة احتياجات التشغيل والتوريدات والتشطيبات:
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- Pillar 1: Zero Commission Booking System -->
                <div class="glass-card rounded-2xl p-6 hover:border-amber-400 transition duration-300 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-2xl mb-4">🌐</div>
                        <h4 class="text-xl font-bold text-white mb-2">موقع حجز مباشر (0% عمولة)</h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-4">
                            إنشاء بوابة إلكترونية فندقية خاصة بفندقك ومطعمك مع محرك حجز ودفع إلكتروني فوري للتخلص النهائي من عمولات الوساطة.
                        </p>
                    </div>
                    <span class="text-amber-400 text-xs font-bold bg-amber-500/10 border border-amber-500/20 py-1.5 px-3 rounded-lg text-center block">0% عمولة وربح صافي 100%</span>
                </div>

                <!-- Pillar 2: Hotel & Restaurant Management -->
                <div class="glass-card rounded-2xl p-6 hover:border-blue-500 transition duration-300 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-2xl mb-4">🏨</div>
                        <h4 class="text-xl font-bold text-white mb-2">إدارة الفنادق والمطاعم</h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-4">
                            إدارة تشغيلية وتسويقية احترافية للفنادق والمطاعم، لزيادة نسب الإشغال وتطبيق سياسات الجودة والـ Cash Clearance.
                        </p>
                    </div>
                    <span class="text-blue-400 text-xs font-bold bg-blue-500/10 border border-blue-500/20 py-1.5 px-3 rounded-lg text-center block">إدارة وتشغيل بالمعايير الأمريكية</span>
                </div>

                <!-- Pillar 3: One-Stop Hospitality Supplies -->
                <div class="glass-card rounded-2xl p-6 hover:border-emerald-500 transition duration-300 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl mb-4">🛒</div>
                        <h4 class="text-xl font-bold text-white mb-2">توريد كافة المستلزمات (مصدر واحد)</h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-4">
                            توريد المفروشات، الكتانيات، مستلزمات الضيافة (الشامبو والصابون)، المياه، المشروبات، المناديل، والمنظفات بأسعار المصنع لتوفير وقتك وفلوسك.
                        </p>
                    </div>
                    <span class="text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-3 rounded-lg text-center block">وفر وقتك وفلوسك (بأسعار المصنع)</span>
                </div>

                <!-- Pillar 4: Hotel Fit-out & Renovation -->
                <div class="glass-card rounded-2xl p-6 hover:border-purple-500 transition duration-300 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-2xl mb-4">🎨</div>
                        <h4 class="text-xl font-bold text-white mb-2">أعمال التشطيبات والديكور الفندقي</h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-4">
                            تصميم وتنفيذ كافة التشطيبات الفندقية الفاخرة (فرعوني، مودرن)، تجديد الغرف، الحمامات، المطابخ، والتجهيزات الكهربائية والتكييف.
                        </p>
                    </div>
                    <span class="text-purple-400 text-xs font-bold bg-purple-500/10 border border-purple-500/20 py-1.5 px-3 rounded-lg text-center block">تشطيبات وديكورات فندقية</span>
                </div>

                <!-- Pillar 5: Staff Recruitment & Training -->
                <div class="glass-card rounded-2xl p-6 hover:border-red-500 transition duration-300 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-black text-2xl mb-4">👥</div>
                        <h4 class="text-xl font-bold text-white mb-2">توفير وتوظيف الـ Staff الفوري</h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-4">
                            توفير عمالة وموظفين محترفين ومدرّبين لجميع الأقسام (ريسبشن، إشراف داخلي، شيفات، صالة، وإدارة) لسد العجز فوراً.
                        </p>
                    </div>
                    <span class="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 py-1.5 px-3 rounded-lg text-center block">سد عجز العمالة فوراً</span>
                </div>

                <!-- Pillar 6: Hospitality Standards -->
                <div class="glass-card rounded-2xl p-6 hover:border-teal-500 transition duration-300 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-2xl mb-4">🎓</div>
                        <h4 class="text-xl font-bold text-white mb-2">التدريب الفندقي المعتمد</h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-4">
                            رفع كفاءة طاقم الضيافة والاستقبال طبقاً لأعلى المعايير الأمريكية لتقديم خدمة راقية تضمن التقييمات الإيجابية واجتذاب السياح.
                        </p>
                    </div>
                    <span class="text-teal-400 text-xs font-bold bg-teal-500/10 border border-teal-500/20 py-1.5 px-3 rounded-lg text-center block">أعلى تقييمات للنزلاء</span>
                </div>

            </div>
        </div>
    </section>

    <!-- Live Portfolio Section (معرض الأعمال الحية) -->
    <section id="portfolio" class="py-16 md:py-24 px-4 bg-slate-900/50 border-b border-slate-800/60">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-12">
                <span class="bg-amber-500/20 text-amber-400 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
                    🌟 معرض الأعمال المباشرة (Live Portfolio)
                </span>
                <h3 class="text-3xl md:text-4xl font-black text-white mt-3">
                    مواقع ومنصات حجز بدون عمولة قمنا بتدشينها
                </h3>
                <p class="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-2">
                    شاهد بنفسك النماذج الحية لمواقع الحجز المباشر التي تتيح الحجز والتحصيل بـ 0% عمولة:
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <!-- Project 1 -->
                <div class="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-amber-500 transition duration-300 shadow-2xl group">
                    <div>
                        <div class="flex justify-between items-start mb-4">
                            <span class="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1 rounded-full">
                                منصة سياحة وفنادق دولية
                            </span>
                            <span class="text-amber-400 text-2xl">🌐</span>
                        </div>
                        <h4 class="text-2xl font-black text-white group-hover:text-amber-400 transition mb-3">
                            Supreme Signature Journeys
                        </h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                            منصة حجز فاخرة ومصممة بأحدث تقنيات الويب العالمية، تتيح الحجز المباشر السريع وتوفر تجربة ضيافة استثنائية.
                        </p>
                    </div>

                    <a href="https://supremesignaturejourneys.com" target="_blank" class="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl transition text-center flex items-center justify-center gap-2 shadow-lg">
                        <span>زيارة المنصة الحية</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                </div>

                <!-- Project 2 -->
                <div class="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-amber-500 transition duration-300 shadow-2xl group">
                    <div>
                        <div class="flex justify-between items-start mb-4">
                            <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
                                بوابة حجز فندق هينو (0% عمولة)
                            </span>
                            <span class="text-emerald-400 text-2xl">🏨</span>
                        </div>
                        <h4 class="text-2xl font-black text-white group-hover:text-amber-400 transition mb-3">
                            Travel Deals Space — HENU Hotel
                        </h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                            بوابة الحجز المباشر الخاصة بفندق هينو الأهرامات، تتيح للنزلاء استعراض الغرف الـ 25 والأسعار والحجز المباشر بالفيزا بدون أدنى عمولة.
                        </p>
                    </div>

                    <a href="https://traveldeals.space/henu/index.html" target="_blank" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl transition text-center flex items-center justify-center gap-2 shadow-lg">
                        <span>زيارة بوابة الحجز الحية</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                </div>

            </div>
        </div>
    </section>

    <!-- Call To Action Footer -->
    <footer class="py-16 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
        <div class="max-w-4xl mx-auto text-center">
            <h3 class="text-3xl md:text-4xl font-black text-white mb-4">
                أوقف نزيف العمولات الآن وابدأ الحجز المباشر (0% عمولة)!
            </h3>
            <p class="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto font-light">
                تواصل مع فريق الإدارة الفندقية الأمريكية فوراً لبناء موقعك المباشر وإدارة وتوريد كافة مستلزمات فندقك ومطعمك من مصدر واحد.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="https://wa.me/201222600296" target="_blank" class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base py-4 px-8 rounded-2xl transition shadow-xl flex items-center justify-center gap-2">
                    <span>🇪🇬</span> تواصل عبر واتساب مصر: 01222600296
                </a>
                <a href="https://wa.me/13074542064" target="_blank" class="w-full sm:w-auto bg-blue-700 hover:bg-blue-600 text-white font-black text-base py-4 px-8 rounded-2xl transition shadow-xl flex items-center justify-center gap-2">
                    <span>🇺🇸</span> تواصل عبر واتساب أمريكا: +13074542064
                </a>
            </div>

            <div class="mt-12 pt-8 border-t border-slate-800/80 text-xs text-slate-500">
                جميع الحقوق محفوظة © 2026 شركة الإدارة الفندقية الأمريكية | thetravelwiki.blog & thetravelwiki.space
            </div>
        </div>
    </footer>

</body>
</html>`;

fs.writeFileSync(path.join(landingDir, 'index.html'), landingHtmlContent, 'utf8');
console.log('✅ Updated Landing Page with Dominant 0% Commission Hook at:', path.join(landingDir, 'index.html'));

// 2. نشر الصفحة المحدثة فوراً على هوستنجر والدومينين
console.log('🔌 Connecting to Hostinger via SSH to deploy updated zero-commission hook landing page...');

const conn = new Client();

conn.on('ready', () => {
  console.log('⚡ Connected to Hostinger!');
  
  conn.sftp((err, sftp) => {
    if (err) throw err;

    const localFile = path.join(landingDir, 'index.html');

    // رفع لـ thetravelwiki.blog
    sftp.fastPut(localFile, '/home/u732967645/domains/thetravelwiki.blog/public_html/index.html', (err) => {
      if (err) console.error('Error Blog:', err);
      else console.log('✅ Uploaded to thetravelwiki.blog');

      // رفع لـ thetravelwiki.space
      sftp.fastPut(localFile, '/home/u732967645/domains/thetravelwiki.space/public_html/index.html', (err) => {
        if (err) console.error('Error Space:', err);
        else console.log('✅ Uploaded to thetravelwiki.space');

        const fixCmd = `
          chmod 644 ~/domains/thetravelwiki.blog/public_html/index.html
          chmod 644 ~/domains/thetravelwiki.space/public_html/index.html
          echo "=== Verified Deployment with Zero Commission Primary Hook ==="
          ls -la ~/domains/thetravelwiki.blog/public_html/index.html
          ls -la ~/domains/thetravelwiki.space/public_html/index.html
        `;

        conn.exec(fixCmd, (err, stream) => {
          if (err) throw err;
          let out = '';
          stream.on('data', d => out += d);
          stream.on('close', () => {
            console.log(out);
            console.log('🎉 ZERO COMMISSION PRIMARY HOOK LANDING PAGE DEPLOYED TO HOSTINGER SUCCESSFULLY!');
            conn.end();
          });
        });
      });
    });
  });
}).connect({
  host: '195.35.39.71',
  port: 65002,
  username: 'u732967645',
  password: 'Koky@2027_1972'
});
