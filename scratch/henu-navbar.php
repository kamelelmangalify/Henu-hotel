<?php
/**
 * Plugin Name: HENU Hotel Executive Header, Footer & Multilingual Switcher
 * Description: Embeds official logo, navigation, professional footer, and 8-language switcher (EN, FR, DE, ES, IT, RU, SV, ZH, AR).
 */

add_action('wp_head', 'henu_multilingual_styles', 999);
function henu_multilingual_styles() {
?>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Montserrat:wght@400;500;600;700;800&family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
<style>
  /* Reset Kadence default header & footer */
  #masthead, .site-header, .entry-hero, .entry-header, .page-header, h1.entry-title, #colophon, .site-footer {
    display: none !important;
  }
  .content-container, .site-main, #inner-wrap {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  body {
    margin: 0 !important;
    top: 0 !important;
    font-family: 'Montserrat', sans-serif;
    background: #FCFAF7;
    color: #1A1A1A;
  }

  /* Hide Google Translate top banner */
  .goog-te-banner-frame.skiptranslate, .goog-te-banner-frame, iframe.goog-te-banner-frame { display: none !important; }
  body { top: 0px !important; }
  .goog-logo-link, .goog-te-gadget span, .goog-te-gadget { display: none !important; }
  #google_translate_element { display: none !important; }
  .skiptranslate { display: inline-block; }

  /* EXECUTIVE NAVBAR */
  .henu-navbar {
    background: #071320;
    border-bottom: 2px solid #C9873A;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999999;
    box-shadow: 0 4px 25px rgba(0,0,0,0.6);
  }

  .henu-nav-container {
    max-width: 1320px;
    margin: 0 auto;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }

  .henu-nav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .henu-nav-logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #C9873A;
    object-fit: cover;
    display: block;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    transition: transform 0.3s ease;
  }
  .henu-nav-brand:hover .henu-nav-logo { transform: scale(1.05); }

  .henu-nav-title h1 {
    font-family: 'Cinzel', serif !important;
    font-size: 1.25rem !important;
    font-weight: 800 !important;
    color: #FFFFFF !important;
    letter-spacing: 1.2px !important;
    line-height: 1.1 !important;
    margin: 0 !important;
  }
  .henu-nav-title h1 span { color: #C9873A !important; }

  .henu-nav-title p {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 0.65rem !important;
    color: #DFAB5C !important;
    letter-spacing: 1.5px !important;
    text-transform: uppercase !important;
    font-weight: 600 !important;
    margin: 2px 0 0 0 !important;
  }

  .henu-nav-menu {
    display: flex;
    align-items: center;
    gap: 18px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .henu-nav-menu li a {
    font-family: 'Cinzel', serif;
    font-size: 0.88rem;
    font-weight: 700;
    color: #FFFFFF;
    text-decoration: none;
    letter-spacing: 0.6px;
    padding: 6px 2px;
    transition: all 0.25s ease;
    display: inline-block;
    position: relative;
  }
  .henu-nav-menu li a:hover { color: #F3C377; }
  .henu-nav-menu li a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #C9873A;
    transition: width 0.3s ease;
  }
  .henu-nav-menu li a:hover::after { width: 100%; }

  .henu-nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  /* LANGUAGE SELECTOR DROPDOWN */
  .henu-lang-dropdown {
    position: relative;
    display: inline-block;
  }

  .henu-lang-btn {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(201,135,58,0.5);
    color: #FFFFFF;
    padding: 7px 12px;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Montserrat', sans-serif;
    transition: all 0.3s ease;
  }
  .henu-lang-btn:hover {
    background: rgba(201,135,58,0.25);
    border-color: #C9873A;
  }

  .henu-lang-menu {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background: #071320;
    border: 1.5px solid #C9873A;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    min-width: 160px;
    z-index: 100000;
    padding: 6px 0;
    margin-top: 6px;
  }
  .henu-lang-dropdown:hover .henu-lang-menu,
  .henu-lang-menu.show {
    display: block;
  }

  .henu-lang-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    color: #FFFFFF;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .henu-lang-option:hover {
    background: rgba(201,135,58,0.3);
    color: #F3C377;
  }
  .henu-lang-option .flag { font-size: 1.1rem; }

  .henu-btn-book {
    background: linear-gradient(135deg, #C9873A 0%, #DFAB5C 100%);
    color: #FFFFFF !important;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 0.82rem;
    padding: 9px 16px;
    border-radius: 6px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(201,135,58,0.35);
    transition: all 0.3s ease;
  }
  .henu-btn-book:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(201,135,58,0.5);
  }

  .henu-mobile-btn {
    display: none;
    background: transparent;
    border: none;
    color: #C9873A;
    font-size: 1.8rem;
    cursor: pointer;
    padding: 4px 6px;
  }

  @media (max-width: 1080px) {
    .henu-nav-menu, .henu-btn-book { display: none; }
    .henu-mobile-btn { display: block; }
    .henu-nav-container { padding: 10px 16px; }
  }

  /* MOBILE DRAWER */
  #henuMobileNav {
    display: none;
    background: #071320;
    border-top: 1px solid rgba(201,135,58,0.3);
    padding: 20px 16px;
  }
  #henuMobileNav.active { display: block; }
  #henuMobileNav ul {
    list-style: none;
    padding: 0;
    margin: 0 0 16px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  #henuMobileNav ul li a {
    color: #FFFFFF;
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    font-weight: 700;
    text-decoration: none;
    display: block;
    padding: 6px 0;
  }

  .henu-mobile-lang-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(201,135,58,0.25);
  }
  .henu-mobile-lang-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(201,135,58,0.3);
    color: #FFFFFF;
    padding: 8px 4px;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .henu-mobile-lang-btn:hover { background: rgba(201,135,58,0.3); }

  /* FOOTER */
  .henu-footer {
    background: #071320;
    color: #FFFFFF;
    border-top: 3px solid #C9873A;
    padding: 70px 20px 24px;
    font-family: 'Montserrat', sans-serif;
  }
  .henu-footer-container { max-width: 1240px; margin: 0 auto; }
  .henu-footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1.3fr 1.1fr;
    gap: 40px;
    margin-bottom: 50px;
  }
  .henu-footer-col h4 {
    font-family: 'Cinzel', serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: #DFAB5C;
    letter-spacing: 1px;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 8px;
  }
  .henu-footer-col h4::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 35px;
    height: 2px;
    background: #C9873A;
  }
  .henu-footer-brand-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }
  .henu-footer-brand-header img {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid #C9873A;
    object-fit: cover;
  }
  .henu-footer-brand-header h3 {
    font-family: 'Cinzel', serif;
    font-size: 1.25rem;
    font-weight: 900;
    color: #FFFFFF;
    margin: 0;
    line-height: 1.1;
  }
  .henu-footer-brand-header h3 span { color: #C9873A; }
  .henu-footer-desc {
    font-size: 0.88rem;
    color: #CBD5E1;
    line-height: 1.7;
    margin-bottom: 20px;
  }
  .henu-footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .henu-footer-links li a {
    color: #E2E8F0;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.25s ease;
  }
  .henu-footer-links li a:hover { color: #F3C377; }
  .henu-footer-contact-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-size: 0.88rem;
  }
  .henu-footer-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    color: #CBD5E1;
  }
  .henu-footer-contact-item strong { color: #FFFFFF; display: block; }
  .henu-footer-contact-item a { color: #DFAB5C; text-decoration: none; }
  .henu-footer-bottom {
    border-top: 1px solid rgba(201,135,58,0.25);
    padding-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 0.82rem;
    color: #94A3B8;
  }

  @media (max-width: 992px) {
    .henu-footer-grid { grid-template-columns: 1fr 1fr; gap: 30px; }
  }
  @media (max-width: 600px) {
    .henu-footer-grid { grid-template-columns: 1fr; gap: 30px; }
    .henu-footer { padding: 50px 16px 20px; }
  }
</style>

<!-- Hidden Google Translate Element -->
<div id="google_translate_element"></div>
<script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,fr,de,es,it,ru,sv,zh-CN,ar',
    autoDisplay: false
  }, 'google_translate_element');
}

function setSiteLanguage(langCode, langName, flagIcon) {
  var select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event('change'));
    var currentBtn = document.getElementById('currentLangBtn');
    if (currentBtn) {
      currentBtn.innerHTML = flagIcon + ' ' + langName + ' ▾';
    }
  } else {
    // Retry once if element not ready yet
    setTimeout(function() {
      var s2 = document.querySelector('.goog-te-combo');
      if (s2) {
        s2.value = langCode;
        s2.dispatchEvent(new Event('change'));
      }
    }, 500);
  }
}
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
<?php
}

// 2. Render Top Navbar with Language Selector
add_action('wp_body_open', 'henu_render_top_navbar_multilingual', 1);
function henu_render_top_navbar_multilingual() {
    $logo_url = home_url('/wp-content/uploads/hotel/official-logo.jpg');
    $home_url = home_url('/');
?>
<nav class="henu-navbar">
  <div class="henu-nav-container">
    <a href="<?php echo esc_url($home_url); ?>" class="henu-nav-brand">
      <img src="<?php echo esc_url($logo_url); ?>" alt="HENU Pyramids Hotel Logo" class="henu-nav-logo">
      <div class="henu-nav-title">
        <h1>HENU <span>HOTEL</span></h1>
        <p>Pyramids View · Giza</p>
      </div>
    </a>

    <ul class="henu-nav-menu">
      <li><a href="<?php echo esc_url($home_url); ?>">Home</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>accommodation/">Accommodation</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>experiences/">Experiences</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>b2b/">B2B Services</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>careers/">Careers</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>contact/">Contact & Booking</a></li>
    </ul>

    <div class="henu-nav-actions">
      <!-- 8-Language Switcher Dropdown -->
      <div class="henu-lang-dropdown">
        <button type="button" class="henu-lang-btn" id="currentLangBtn" onclick="document.getElementById('henuLangMenu').classList.toggle('show')">
          🌐 <span>English</span> ▾
        </button>
        <div class="henu-lang-menu" id="henuLangMenu">
          <div class="henu-lang-option" onclick="setSiteLanguage('en', 'English', '🇬🇧'); document.getElementById('henuLangMenu').classList.remove('show');">
            <span class="flag">🇬🇧</span> <span>English</span>
          </div>
          <div class="henu-lang-option" onclick="setSiteLanguage('fr', 'Français', '🇫🇷'); document.getElementById('henuLangMenu').classList.remove('show');">
            <span class="flag">🇫🇷</span> <span>Français</span>
          </div>
          <div class="henu-lang-option" onclick="setSiteLanguage('de', 'Deutsch', '🇩🇪'); document.getElementById('henuLangMenu').classList.remove('show');">
            <span class="flag">🇩🇪</span> <span>Deutsch</span>
          </div>
          <div class="henu-lang-option" onclick="setSiteLanguage('es', 'Español', '🇪🇸'); document.getElementById('henuLangMenu').classList.remove('show');">
            <span class="flag">🇪🇸</span> <span>Español</span>
          </div>
          <div class="henu-lang-option" onclick="setSiteLanguage('it', 'Italiano', '🇮🇹'); document.getElementById('henuLangMenu').classList.remove('show');">
            <span class="flag">🇮🇹</span> <span>Italiano</span>
          </div>
          <div class="henu-lang-option" onclick="setSiteLanguage('ru', 'Русский', '🇷🇺'); document.getElementById('henuLangMenu').classList.remove('show');">
            <span class="flag">🇷🇺</span> <span>Русский</span>
          </div>
          <div class="henu-lang-option" onclick="setSiteLanguage('sv', 'Svenska', '🇸🇪'); document.getElementById('henuLangMenu').classList.remove('show');">
            <span class="flag">🇸🇪</span> <span>Svenska</span>
          </div>
          <div class="henu-lang-option" onclick="setSiteLanguage('zh-CN', '中文', '🇨🇳'); document.getElementById('henuLangMenu').classList.remove('show');">
            <span class="flag">🇨🇳</span> <span>中文 (简体)</span>
          </div>
          <div class="henu-lang-option" onclick="setSiteLanguage('ar', 'العربية', '🇪🇬'); document.getElementById('henuLangMenu').classList.remove('show');">
            <span class="flag">🇪🇬</span> <span>العربية</span>
          </div>
        </div>
      </div>

      <!-- Booking Button -->
      <a href="https://wa.me/201000925827?text=Hello%20HENU%20Hotel,%20I%20want%20to%20book%20a%20stay." target="_blank" class="henu-btn-book">
        💬 Book WhatsApp
      </a>

      <!-- Mobile Menu Toggle -->
      <button class="henu-mobile-btn" onclick="document.getElementById('henuMobileNav').classList.toggle('active')">
        ☰
      </button>
    </div>
  </div>

  <!-- Mobile Dropdown with Links & Languages -->
  <div id="henuMobileNav">
    <ul>
      <li><a href="<?php echo esc_url($home_url); ?>">Home</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>accommodation/">Accommodation</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>experiences/">Experiences</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>b2b/">B2B Services</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>careers/">Careers</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>contact/">Contact & Booking</a></li>
    </ul>

    <!-- Mobile Language Selector Grid -->
    <div style="font-size: 0.75rem; color: #DFAB5C; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Select Language:</div>
    <div class="henu-mobile-lang-grid">
      <div class="henu-mobile-lang-btn" onclick="setSiteLanguage('en', 'English', '🇬🇧');"><span>🇬🇧</span> English</div>
      <div class="henu-mobile-lang-btn" onclick="setSiteLanguage('fr', 'Français', '🇫🇷');"><span>🇫🇷</span> Français</div>
      <div class="henu-mobile-lang-btn" onclick="setSiteLanguage('de', 'Deutsch', '🇩🇪');"><span>🇩🇪</span> Deutsch</div>
      <div class="henu-mobile-lang-btn" onclick="setSiteLanguage('es', 'Español', '🇪🇸');"><span>🇪🇸</span> Español</div>
      <div class="henu-mobile-lang-btn" onclick="setSiteLanguage('it', 'Italiano', '🇮🇹');"><span>🇮🇹</span> Italiano</div>
      <div class="henu-mobile-lang-btn" onclick="setSiteLanguage('ru', 'Русский', '🇷🇺');"><span>🇷🇺</span> Русский</div>
      <div class="henu-mobile-lang-btn" onclick="setSiteLanguage('sv', 'Svenska', '🇸🇪');"><span>🇸🇪</span> Svenska</div>
      <div class="henu-mobile-lang-btn" onclick="setSiteLanguage('zh-CN', '中文', '🇨🇳');"><span>🇨🇳</span> 中文</div>
      <div class="henu-mobile-lang-btn" onclick="setSiteLanguage('ar', 'العربية', '🇪🇬');"><span>🇪🇬</span> العربية</div>
    </div>

    <a href="https://wa.me/201000925827?text=Hello%20HENU%20Hotel,%20I%20want%20to%20book%20a%20stay." target="_blank" class="henu-btn-book" style="width: 100%; justify-content: center; display: flex;">
      💬 Instant WhatsApp Booking
    </a>
  </div>
</nav>
<?php
}

// 3. Render Professional Executive Footer
add_action('wp_footer', 'henu_render_custom_footer_multilingual', 999);
function henu_render_custom_footer_multilingual() {
    $logo_url = home_url('/wp-content/uploads/hotel/official-logo.jpg');
    $home_url = home_url('/');
    $maps_url = 'https://maps.app.goo.gl/N5mhKZM6KQVVA9z26';
?>
<footer class="henu-footer">
  <div class="henu-footer-container">
    <div class="henu-footer-grid">
      
      <!-- Col 1: About & Logo -->
      <div class="henu-footer-col">
        <div class="henu-footer-brand-header">
          <img src="<?php echo esc_url($logo_url); ?>" alt="HENU Pyramids Hotel">
          <div>
            <h3>HENU <span>HOTEL</span></h3>
            <span style="font-size: 0.72rem; color: #DFAB5C; letter-spacing: 1px; text-transform: uppercase; font-weight: 700;">Pyramids View · Giza</span>
          </div>
        </div>
        <p class="henu-footer-desc">
          Boutique hotel situated in historic Nazlet El-Semman, just 2 minutes' walk from the Great Sphinx & Pyramids Gate. Featuring luxury rooms, authentic hospitality, and panoramic dining at Aisha Rooftop Lounge.
        </p>
        <div style="display: inline-block; background: rgba(201,135,58,0.15); border: 1px solid #C9873A; color: #DFAB5C; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">
          ★ 2 Min Walk to Sphinx Gate
        </div>
      </div>

      <!-- Col 2: Quick Links -->
      <div class="henu-footer-col">
        <h4>Explore Hotel</h4>
        <ul class="henu-footer-links">
          <li><a href="<?php echo esc_url($home_url); ?>">› Home Overview</a></li>
          <li><a href="<?php echo esc_url($home_url); ?>accommodation/">› Rooms & Suites ($12 - $45)</a></li>
          <li><a href="<?php echo esc_url($home_url); ?>experiences/">› Tours & Desert Safari</a></li>
          <li><a href="<?php echo esc_url($home_url); ?>b2b/">› B2B & Corporate Travel</a></li>
          <li><a href="<?php echo esc_url($home_url); ?>careers/">› Join Our Team (Careers)</a></li>
          <li><a href="<?php echo esc_url($home_url); ?>contact/">› Contact & Direct Booking</a></li>
        </ul>
      </div>

      <!-- Col 3: Contact Details -->
      <div class="henu-footer-col">
        <h4>Direct Contact</h4>
        <div class="henu-footer-contact-list">
          <div class="henu-footer-contact-item">
            <span style="font-size: 1.2rem; color: #C9873A;">💬</span>
            <div>
              <strong>WhatsApp Booking (Only):</strong>
              <a href="https://wa.me/201000925827" target="_blank">+20 100 092 5827</a>
            </div>
          </div>
          <div class="henu-footer-contact-item">
            <span style="font-size: 1.2rem; color: #C9873A;">📞</span>
            <div>
              <strong>Customer Service & Calls:</strong>
              <a href="tel:+201123456777">+20 112 345 6777</a>
            </div>
          </div>
          <div class="henu-footer-contact-item">
            <span style="font-size: 1.2rem; color: #C9873A;">✉️</span>
            <div>
              <strong>Official Email:</strong>
              <a href="mailto:info@henuhotel.com">info@henuhotel.com</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Col 4: Location & Navigation -->
      <div class="henu-footer-col">
        <h4>Our Location</h4>
        <div class="henu-footer-contact-item" style="margin-bottom: 18px;">
          <span style="font-size: 1.2rem; color: #C9873A;">📍</span>
          <div>
            <strong>Hotel Address:</strong>
            <span style="color: #CBD5E1; font-size: 0.85rem; line-height: 1.5;">21 Gamal Abdel Nasser St., Nazlet El-Semman, Al Haram, Giza, Egypt</span>
          </div>
        </div>
        <a href="<?php echo esc_url($maps_url); ?>" target="_blank" style="background: #C9873A; color: #FFFFFF; font-weight: 700; font-size: 0.85rem; padding: 12px 18px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(201,135,58,0.3); transition: all 0.3s ease;">
          📍 Open in Google Maps →
        </a>
      </div>

    </div>

    <!-- Bottom Copyright -->
    <div class="henu-footer-bottom">
      <div>
        © <?php echo date('Y'); ?> <strong>HENU Pyramids Hotel</strong>. All Rights Reserved.
      </div>
      <div>
        Direct Rates from <strong>$12/Night</strong> · 21 Gamal Abdel Nasser St., Nazlet El-Semman
      </div>
    </div>
  </div>
</footer>
<?php
}
