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
    <title>شركة الإدارة الفندقية الأمريكية | حلول إدارة الفنادق والمطاعم، التوريدات، والتشطيبات</title>
    <!-- Tailwind CSS v4 CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Cairo', sans-serif; }
        .glass-card { background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(12px); border: 1px solid rgba(217, 119, 6, 0.3); }
        .gold-gradient-text { background: linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #FBBF24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .bg-gold-gradient { background: linear-gradient(135deg, #D97706 0%, #B45309 100%); }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen selection:bg-amber-500 selection:text-slate-950">

    <!-- Top Announcement Bar -->
    <div class="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 text-xs md:text-sm font-black py-2.5 px-4 text-center shadow-lg flex items-center justify-center gap-2">
        <span class="bg-slate-950 text-amber-400 text-xs px-3 py-0.5 rounded-full">كل خدمات فندقك ومطعمك من مصدر واحد</span>
        <span>إدارة متكاملة + توريد مستلزمات + تشطيبات فندقية — وفر وقتك وفلوسك!</span>
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
                    <span class="text-xs text-amber-400 font-semibold">American Hotel & Restaurant Management</span>
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

    <!-- Hero Section -->
    <section class="relative py-16 md:py-24 px-4 overflow-hidden border-b border-slate-800/60">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10"></div>
        
        <div class="max-w-5xl mx-auto text-center">
            <div class="inline-flex items-center gap-2 bg-slate-900 border border-amber-500/40 text-amber-400 text-xs md:text-sm font-bold px-4 py-1.5 rounded-full mb-6 shadow-inner">
                <span>⭐</span> شريكك الشامل لإدارة وتجهيز الفنادق والمطاعم
            </div>

            <h2 class="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                إدارة الفنادق والمطاعم، التوريدات، والتشطيبات <br>
                <span class="gold-gradient-text">كل احتياجاتك الفندقية من مصدر واحد!</span>
            </h2>

            <p class="text-slate-300 text-base md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-8">
                نوفر لك الوقت والمال: بدءاً من التشطيب والديكور الفندقي الفاخر، وتوريد كافة المستلزمات والأغراض بأسعار المصنع، وحتى الإدارة التشغيلية الكاملة ومواقع الحجز المباشر بدون أي عمولات.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="https://wa.me/201222600296?text=مرحباً،%20أرغب%20في%20استشارة%20مجانية%20لإدارة%20وتوريد%20وتشطيب%20مشروعي%20الفندقي" target="_blank" class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base py-4 px-8 rounded-2xl transition shadow-xl flex items-center justify-center gap-3">
                    <span>💬</span> احصل على استشارة مجانية شاملة
                </a>
                <a href="#services" class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-base py-4 px-8 rounded-2xl transition flex items-center justify-center gap-2">
                    <span>📦</span> استعرض قائمة الخدمات والتوريدات
                </a>
            </div>

            <!-- Highlights Bar -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 pt-10 border-t border-slate-800/80">
                <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div class="text-2xl md:text-3xl font-black text-amber-400">100%</div>
                    <div class="text-xs text-slate-400 font-semibold mt-1">مصدر واحد لكل خدماتك</div>
                </div>
                <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div class="text-2xl md:text-3xl font-black text-emerald-400">0%</div>
                    <div class="text-xs text-slate-400 font-semibold mt-1">عمولة على الحجوزات المباشرة</div>
                </div>
                <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div class="text-2xl md:text-3xl font-black text-blue-400">وفر وقتك وفلوسك</div>
                    <div class="text-xs text-slate-400 font-semibold mt-1">أسعار توريد مباشرة بدون وسيط</div>
                </div>
                <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div class="text-2xl md:text-3xl font-black text-purple-400">تشطيب فاخر</div>
                    <div class="text-xs text-slate-400 font-semibold mt-1">ديكورات وتجهيزات فندقية</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Grid (جميع الخدمات والتوريدات والتشطيبات) -->
    <section id="services" class="py-16 md:py-24 px-4 border-b border-slate-800/60">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-14">
                <span class="bg-amber-500/20 text-amber-400 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
                    🛠️ خدماتنا وتوريداتنا المباشرة
                </span>
                <h3 class="text-3xl md:text-4xl font-black text-white mt-3">
                    كل ما يحتاجه فندقك ومطعمك من الألف إلى الياء
                </h3>
                <p class="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-2">
                    نجمع لك الإدارة الفندقية، وتوريد المستلزمات بأسعار الجملة، وأعمال التشطيبات والديكور في مكان واحد:
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- Service 1: Hotel & Restaurant Management -->
                <div class="glass-card rounded-2xl p-6 hover:border-amber-500 transition duration-300 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-2xl mb-4">🏨</div>
                        <h4 class="text-xl font-bold text-white mb-2">إدارة الفنادق والمطاعم</h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-4">
                            إدارة تشغيلية وتسويقية متكاملة للفنادق والمطاعم، زيادة نسب الإشغال، رفع جودة الخدمة والتقييمات، وتطبيق سياسات النقدية والـ Cash Clearance.
                        </p>
                    </div>
                    <span class="text-amber-400 text-xs font-bold bg-amber-500/10 border border-amber-500/20 py-1.5 px-3 rounded-lg text-center block">تشغيل احترافي كامل</span>
                </div>

                <!-- Service 2: One-Stop Hospitality Supplies -->
                <div class="glass-card rounded-2xl p-6 hover:border-emerald-500 transition duration-300 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl mb-4">🛒</div>
                        <h4 class="text-xl font-bold text-white mb-2">توريد كافة المستلزمات الفندقية</h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-4">
                            توريد شامل من مصدر واحد: الكتانيات والمفروشات الفندقية، مستلزمات الضيافة والشامبو والصابون، المياه والمشروبات والمناديل، ومعدات المطابخ والمنظفات.
                        </p>
                    </div>
                    <span class="text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-3 rounded-lg text-center block">وفر وقتك وفلوسك (أسعار المصنع)</span>
                </div>

                <!-- Service 3: Hotel Fit-out & Renovation -->
                <div class="glass-card rounded-2xl p-6 hover:border-blue-500 transition duration-300 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-2xl mb-4">🎨</div>
                        <h4 class="text-xl font-bold text-white mb-2">أعمال التشطيبات والديكور الفندقي</h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-4">
                            تصميم وتنفيذ كافة أعمال التشطيبات الداخلية والديكور الفندقي الفاخر (فرعوني، كلاسيك، مودرن)، تجديد الغرف والحمامات، وتجهيز الإضاءة والتكييف.
                        </p>
                    </div>
                    <span class="text-blue-400 text-xs font-bold bg-blue-500/10 border border-blue-500/20 py-1.5 px-3 rounded-lg text-center block">تشطيب فندقي فاخر</span>
                </div>

                <!-- Service 4: Direct Booking Engine -->
                <div class="glass-card rounded-2xl p-6 hover:border-purple-500 transition duration-300 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-2xl mb-4">🌐</div>
                        <h4 class="text-xl font-bold text-white mb-2">موقع حجز مباشر (0% عمولة)</h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-4">
                            بناء موقع إلكتروني فندقي خاص بفندقك مع محرك حجز ودفع إلكتروني آمن، للتخلص من عمولات OTAs الباهظة والاحتفاظ بـ 100% من أرباحك.
                        </p>
                    </div>
                    <span class="text-purple-400 text-xs font-bold bg-purple-500/10 border border-purple-500/20 py-1.5 px-3 rounded-lg text-center block">حجوزات مباشرة بدون وسطاء</span>
                </div>

                <!-- Service 5: Staffing & Recruitment -->
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

                <!-- Service 6: US Hospitality Standards Training -->
                <div class="glass-card rounded-2xl p-6 hover:border-teal-500 transition duration-300 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-2xl mb-4">🎓</div>
                        <h4 class="text-xl font-bold text-white mb-2">التدريب بالمعايير الأمريكية</h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-4">
                            تدريب طاقم العمل وتأهيلهم وفقاً لأعلى معايير الضيافة الأمريكية العالمية لتقديم تجربة نزيل ممتازة واجتذاب السياح الأجانب.
                        </p>
                    </div>
                    <span class="text-teal-400 text-xs font-bold bg-teal-500/10 border border-teal-500/20 py-1.5 px-3 rounded-lg text-center block">معايير ضيافة عالمية</span>
                </div>

            </div>
        </div>
    </section>

    <!-- Portfolio Section (معرض الأعمال والمشروعات الحية) -->
    <section id="portfolio" class="py-16 md:py-24 px-4 bg-slate-900/50 border-b border-slate-800/60">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-12">
                <span class="bg-amber-500/20 text-amber-400 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
                    🌟 معرض الأعمال المباشرة (Live Portfolio)
                </span>
                <h3 class="text-3xl md:text-4xl font-black text-white mt-3">
                    نماذج من منصاتنا ومواقعنا المنفذة بنجاح
                </h3>
                <p class="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-2">
                    قم بزيارة المشاريع الحية التي قمنا بتصميمها وتشغيلها، واطلع على تجربة السلاسة وأنظمة الحجز المباشر:
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <!-- Card 1: Supreme Signature Journeys -->
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
                            منصة حجز فاخرة ومصممة بأحدث تقنيات الويب العالمية، تتميز بواجهة مستخدم فندقية سرعة فائقة وتصميم يضمن أعلى معدلات التحويل بالحجز المباشر.
                        </p>
                    </div>

                    <a href="https://supremesignaturejourneys.com" target="_blank" class="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl transition text-center flex items-center justify-center gap-2 shadow-lg">
                        <span>زيارة المنصة الحية</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                </div>

                <!-- Card 2: Travel Deals Space Henu -->
                <div class="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-amber-500 transition duration-300 shadow-2xl group">
                    <div>
                        <div class="flex justify-between items-start mb-4">
                            <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
                                نظام حجز فندق هينو الأهرامات
                            </span>
                            <span class="text-emerald-400 text-2xl">🏨</span>
                        </div>
                        <h4 class="text-2xl font-black text-white group-hover:text-amber-400 transition mb-3">
                            Travel Deals Space — HENU Hotel
                        </h4>
                        <p class="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                            بوابة الحجز المباشر الخاصة بفندق هينو الأهرامات، تتيح للنزلاء استعراض الغرف الـ 25 والأسعار والحجز المباشر بالفيزا بدون أدنى عمولة لمنصات الوساطة.
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
                وفر وقتك وفلوسك وابدأ في تجهيز وإدارة مشروعك الفندقي والمطعم الآن!
            </h3>
            <p class="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto font-light">
                تواصل مع فريق الإدارة الفندقية الأمريكية الآن للحصول على استشارة مجانية لمعاينة فندقك أو مطعمك وتوريد كافة مستلزماتك من مصدر واحد.
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
console.log('✅ Expanded Landing Page created at:', path.join(landingDir, 'index.html'));

// 2. نشر الصفحة المحدثة فوراً على هوستنجر والدومينين
console.log('🔌 Connecting to Hostinger via SSH to deploy expanded landing page...');

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
          echo "=== Verified Deployment for both domains ==="
          ls -la ~/domains/thetravelwiki.blog/public_html/index.html
          ls -la ~/domains/thetravelwiki.space/public_html/index.html
        `;

        conn.exec(fixCmd, (err, stream) => {
          if (err) throw err;
          let out = '';
          stream.on('data', d => out += d);
          stream.on('close', () => {
            console.log(out);
            console.log('🎉 EXPANDED LANDING PAGE DEPLOYED TO HOSTINGER SUCCESSFULLY!');
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
