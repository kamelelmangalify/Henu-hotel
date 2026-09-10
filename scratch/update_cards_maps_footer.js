const fs = require('fs');
const path = require('path');
const { Client } = require('d:/Henu/scratch/node_modules/ssh2');

const uploadsBase = '/wp-content/uploads/hotel';
const mapsUrl = 'https://maps.app.goo.gl/N5mhKZM6KQVVA9z26';
const fullAddress = '21 Gamal Abdel Nasser St., Nazlet El-Semman, Al Haram, Giza, Egypt';

// ========================================================
// 1. REFINED MU-PLUGIN (NAVBAR + PROFESSIONAL FOOTER)
// ========================================================
const muPhp = `<?php
/**
 * Plugin Name: HENU Hotel Executive Header & Footer
 * Description: Embeds the official executive navbar and professional luxury footer across all pages.
 */

// 1. Header Styles & Typography
add_action('wp_head', 'henu_executive_styles', 999);
function henu_executive_styles() {
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
    font-family: 'Montserrat', sans-serif;
    background: #FCFAF7;
    color: #1A1A1A;
  }

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
    max-width: 1280px;
    margin: 0 auto;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }

  .henu-nav-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .henu-nav-logo {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid #C9873A;
    object-fit: cover;
    display: block;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    transition: transform 0.3s ease;
  }
  .henu-nav-brand:hover .henu-nav-logo {
    transform: scale(1.05);
  }

  .henu-nav-title h1 {
    font-family: 'Cinzel', serif !important;
    font-size: 1.3rem !important;
    font-weight: 800 !important;
    color: #FFFFFF !important;
    letter-spacing: 1.2px !important;
    line-height: 1.1 !important;
    margin: 0 !important;
  }
  .henu-nav-title h1 span { color: #C9873A !important; }

  .henu-nav-title p {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 0.68rem !important;
    color: #DFAB5C !important;
    letter-spacing: 1.5px !important;
    text-transform: uppercase !important;
    font-weight: 600 !important;
    margin: 2px 0 0 0 !important;
  }

  .henu-nav-menu {
    display: flex;
    align-items: center;
    gap: 20px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .henu-nav-menu li a {
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: #FFFFFF;
    text-decoration: none;
    letter-spacing: 0.8px;
    padding: 8px 4px;
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

  .henu-btn-book {
    background: linear-gradient(135deg, #C9873A 0%, #DFAB5C 100%);
    color: #FFFFFF !important;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    padding: 10px 20px;
    border-radius: 6px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
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
  }

  @media (max-width: 1024px) {
    .henu-nav-menu, .henu-btn-book { display: none; }
    .henu-mobile-btn { display: block; }
    .henu-nav-container { padding: 10px 16px; }
  }

  #henuMobileNav {
    display: none;
    background: #071320;
    border-top: 1px solid rgba(201,135,58,0.3);
    padding: 20px;
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
  }

  /* PROFESSIONAL EXECUTIVE FOOTER */
  .henu-footer {
    background: #071320;
    color: #FFFFFF;
    border-top: 3px solid #C9873A;
    padding: 70px 20px 24px;
    font-family: 'Montserrat', sans-serif;
    position: relative;
  }
  .henu-footer-container {
    max-width: 1240px;
    margin: 0 auto;
  }
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
    width: 54px;
    height: 54px;
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .henu-footer-links li a:hover {
    color: #F3C377;
    transform: translateX(4px);
  }
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
  .henu-footer-contact-item strong {
    color: #FFFFFF;
    display: block;
  }
  .henu-footer-contact-item a {
    color: #DFAB5C;
    text-decoration: none;
  }
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
  .henu-footer-bottom a {
    color: #DFAB5C;
    text-decoration: none;
  }

  @media (max-width: 992px) {
    .henu-footer-grid {
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
  }
  @media (max-width: 600px) {
    .henu-footer-grid {
      grid-template-columns: 1fr;
      gap: 30px;
    }
    .henu-footer { padding: 50px 16px 20px; }
  }
</style>
<?php
}

// 2. Render Executive Top Navbar
add_action('wp_body_open', 'henu_render_top_navbar', 1);
function henu_render_top_navbar() {
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
      <a href="https://wa.me/201000925827?text=Hello%20HENU%20Hotel,%20I%20want%20to%20book%20a%20stay." target="_blank" class="henu-btn-book">
        💬 Book WhatsApp
      </a>
      <button class="henu-mobile-btn" onclick="document.getElementById('henuMobileNav').classList.toggle('active')">
        ☰
      </button>
    </div>
  </div>

  <div id="henuMobileNav">
    <ul>
      <li><a href="<?php echo esc_url($home_url); ?>">Home</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>accommodation/">Accommodation</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>experiences/">Experiences</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>b2b/">B2B Services</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>careers/">Careers</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>contact/">Contact & Booking</a></li>
    </ul>
    <a href="https://wa.me/201000925827?text=Hello%20HENU%20Hotel,%20I%20want%20to%20book%20a%20stay." target="_blank" class="henu-btn-book" style="width: 100%; justify-content: center; display: flex;">
      💬 Instant WhatsApp Booking
    </a>
  </div>
</nav>
<?php
}

// 3. Render Professional Executive Footer
add_action('wp_footer', 'henu_render_custom_footer', 999);
function henu_render_custom_footer() {
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
`;

// ========================================================
// 2. PERFECTED HOME PAGE HTML (CARDS & ALIGNMENT FIXED)
// ========================================================
const homePageHtml = `<!-- wp:html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Montserrat:wght@400;500;600;700;800&family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
<style>
:root {
  --clr-nile-dark: #071320;
  --clr-nile: #0B1B2B;
  --clr-gold: #C9873A;
  --clr-gold-light: #DFAB5C;
  --clr-gold-bright: #F3C377;
  --clr-sand: #F7F2E8;
  --clr-sand-dark: #EADDCF;
  --clr-ivory: #FCFAF7;
  --clr-dark: #1A1A1A;
  --clr-gray: #555555;
  --font-cinzel: 'Cinzel', serif;
  --font-montserrat: 'Montserrat', sans-serif;
  --font-cairo: 'Cairo', sans-serif;
  --radius: 12px;
  --shadow: 0 8px 30px rgba(0,0,0,0.06);
}

.henu-section { padding: 80px 20px; font-family: var(--font-montserrat); }
.henu-container { max-width: 1240px; margin: 0 auto; }
.henu-badge {
  background: var(--clr-gold);
  color: #FFFFFF;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 5px 16px;
  border-radius: 30px;
  display: inline-block;
  margin-bottom: 12px;
}
.henu-title {
  font-family: var(--font-cinzel);
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--clr-nile);
  line-height: 1.25;
  margin-bottom: 14px;
}
.henu-title span { color: var(--clr-gold); }
.henu-title.light { color: #FFFFFF; }
.henu-title.light span { color: var(--clr-gold-light); }
.henu-subtitle {
  font-size: 1.05rem;
  color: var(--clr-gray);
  max-width: 700px;
  margin-bottom: 40px;
  line-height: 1.6;
}
.henu-subtitle.center { margin-left: auto; margin-right: auto; text-align: center; }
.henu-subtitle.light { color: rgba(255,255,255,0.95); }

.btn-henu-gold {
  background: var(--clr-gold);
  color: #FFFFFF !important;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(201,135,58,0.35);
}
.btn-henu-gold:hover {
  background: var(--clr-gold-light);
  transform: translateY(-2px);
}
.btn-henu-outline {
  background: rgba(7, 19, 32, 0.7);
  backdrop-filter: blur(4px);
  color: #FFFFFF !important;
  font-weight: 700;
  padding: 13px 26px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  border: 1.5px solid #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-henu-outline:hover {
  background: var(--clr-gold);
  border-color: var(--clr-gold);
}

/* CARDS GRID & UNIFORM SIZING */
.henu-grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}
.henu-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 40px;
  align-items: center;
}
.henu-card {
  background: #FFFFFF;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid var(--clr-sand-dark);
  transition: all 0.35s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.henu-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.12);
}
.henu-card-img {
  height: 240px;
  width: 100%;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}
.henu-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.henu-card:hover .henu-card-img img { transform: scale(1.08); }
.henu-card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}
.henu-card-price {
  position: absolute;
  top: 14px;
  right: 14px;
  background: var(--clr-nile);
  color: var(--clr-gold-light);
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.9rem;
  font-family: var(--font-cinzel);
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

@media (max-width: 768px) {
  .henu-title { font-size: 1.85rem; }
  .henu-section { padding: 50px 16px; }
  .henu-card-img { height: 210px; }
}
</style>

<!-- HERO SECTION (PURE NATURAL UNTOUCHED PHOTO) -->
<div style="background-image: url('${uploadsBase}/hero-pyramids-sunset.jpg'); background-size: cover; background-position: center center; background-repeat: no-repeat; min-height: 85vh; display: flex; align-items: center; justify-content: center; text-align: center; color: #FFFFFF; padding: 80px 20px; position: relative;">
  <div style="max-width: 900px; background: rgba(7, 19, 32, 0.45); padding: 36px 28px; border-radius: 16px; backdrop-filter: blur(6px); border: 1px solid rgba(201, 135, 58, 0.4); box-shadow: 0 12px 40px rgba(0,0,0,0.4);">
    <span class="henu-badge" style="background: var(--clr-gold); color: #FFFFFF; font-size: 0.85rem; padding: 6px 22px;">★ Pyramids View Boutique Hotel · Giza</span>
    <h1 style="font-family: var(--font-cinzel); font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 900; line-height: 1.2; margin: 16px 0; color: #FFFFFF; text-shadow: 0 3px 15px rgba(0,0,0,0.8);">
      Where Ancient Wonders Meet <span style="color: var(--clr-gold-bright);">Modern Comfort</span>
    </h1>
    <p style="font-size: 1.2rem; font-weight: 500; color: #FFFFFF; max-width: 720px; margin: 0 auto 30px; line-height: 1.6; text-shadow: 0 2px 10px rgba(0,0,0,0.85);">
      Experience uninterrupted, front-row views of the Great Pyramids and Sphinx from our boutique rooms and rooftop lounge in the heart of historic Nazlet El-Semman.
    </p>
    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
      <a href="/contact#booking" class="btn-henu-gold" style="font-size: 1.05rem; padding: 15px 32px; box-shadow: 0 6px 20px rgba(201,135,58,0.5);">📅 Instant WhatsApp Booking</a>
      <a href="/accommodation" class="btn-henu-outline" style="font-size: 1.05rem; padding: 15px 28px;">🛏️ View Rooms from $12</a>
    </div>
  </div>
</div>

<!-- QUICK BOOKING BAR -->
<div style="background: var(--clr-nile); padding: 24px 20px; border-top: 3px solid var(--clr-gold);">
  <div class="henu-container" style="display: flex; gap: 16px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
    <div style="color: #FFFFFF;">
      <div style="font-size: 0.8rem; color: var(--clr-gold-light); font-weight: 700; text-transform: uppercase;">Direct Booking Hotline (WhatsApp Only)</div>
      <div style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-cinzel);">+20 100 092 5827</div>
    </div>
    <div style="color: #FFFFFF;">
      <div style="font-size: 0.8rem; color: var(--clr-sand); font-weight: 700; text-transform: uppercase;">Customer Service & Calls</div>
      <div style="font-size: 1.2rem; font-weight: 800; font-family: var(--font-cinzel);">+20 112 345 6777</div>
    </div>
    <a href="https://wa.me/201000925827?text=Hello%20HENU%20Hotel,%20I%20would%20like%20to%20inquire%20about%20room%20availability%20and%20rates." target="_blank" class="btn-henu-gold">
      💬 Chat on WhatsApp
    </a>
  </div>
</div>

<!-- WELCOME & LOCATION -->
<div class="henu-section" style="background: var(--clr-ivory);">
  <div class="henu-container">
    <div class="henu-grid-2">
      <div>
        <span class="henu-badge">Prime Location</span>
        <h2 class="henu-title">A Sanctuary at <span>21 Gamal Abdel Nasser St.</span></h2>
        <p class="henu-subtitle" style="margin-bottom: 20px;">
          Located at <strong>21 Gamal Abdel Nasser St., Nazlet El-Semman</strong>, just 2 minutes' walk from the Great Sphinx and Pyramids entrance. HENU Pyramids Hotel offers an authentic blend of traditional Pharaonic hospitality and modern comfort.
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px;">
          <div style="background: #FFFFFF; padding: 18px; border-radius: 8px; border: 1px solid var(--clr-sand-dark); box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
            <div style="font-size: 1.5rem; color: var(--clr-gold); font-weight: 800; font-family: var(--font-cinzel);">2 Min</div>
            <div style="font-size: 0.85rem; color: var(--clr-gray); font-weight: 600;">Walk to Sphinx & Pyramids Gate</div>
          </div>
          <div style="background: #FFFFFF; padding: 18px; border-radius: 8px; border: 1px solid var(--clr-sand-dark); box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
            <div style="font-size: 1.5rem; color: var(--clr-gold); font-weight: 800; font-family: var(--font-cinzel);">$12+</div>
            <div style="font-size: 0.85rem; color: var(--clr-gray); font-weight: 600;">Best Direct Room Rates</div>
          </div>
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <a href="/accommodation" class="btn-henu-gold">Explore Rooms →</a>
          <a href="${mapsUrl}" target="_blank" class="btn-henu-outline" style="background: var(--clr-nile); color: #FFFFFF !important; border-color: var(--clr-gold);">📍 Google Maps Location</a>
        </div>
      </div>
      <div style="border-radius: var(--radius); overflow: hidden; border: 2px solid var(--clr-gold); box-shadow: var(--shadow); height: 380px;">
        <img src="${uploadsBase}/pyramids-terrace-night.jpg" alt="HENU Pyramids View" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>
    </div>
  </div>
</div>

<!-- FEATURED ROOMS CARDS (UNIFORM ALIGNMENT) -->
<div class="henu-section" style="background: var(--clr-sand);">
  <div class="henu-container" style="text-align: center;">
    <span class="henu-badge">Accommodation</span>
    <h2 class="henu-title">Featured <span>Rooms & Suites</span></h2>
    <p class="henu-subtitle center">From cozy single rooms to royal panoramic suites with private pyramid balconies.</p>
    
    <div class="henu-grid-3" style="text-align: left;">
      <!-- Single Room -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-single.jpg" alt="Single Cozy Room">
          <div class="henu-card-price">From $12 / Night</div>
        </div>
        <div class="henu-card-body">
          <div>
            <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 6px;">Single Cozy Room</h3>
            <p style="font-size: 0.88rem; color: var(--clr-gray); line-height: 1.5; margin-bottom: 16px;">Standard ($12) · Window ($15) · Balcony ($20). Perfect for solo travelers with private bath & Wi-Fi.</p>
          </div>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20a%20Single%20Room." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book via WhatsApp ($12)</a>
        </div>
      </div>
      
      <!-- Double Room -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-double-balcony.jpg" alt="Double Room Balcony">
          <div class="henu-card-price">From $18 / Night</div>
        </div>
        <div class="henu-card-body">
          <div>
            <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 6px;">Double / Twin Room</h3>
            <p style="font-size: 0.88rem; color: var(--clr-gray); line-height: 1.5; margin-bottom: 16px;">Standard ($18) · Window ($22) · Balcony ($25). Direct pyramid panorama with balcony seating.</p>
          </div>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20a%20Double%20Room." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book via WhatsApp ($18)</a>
        </div>
      </div>

      <!-- King Suite -->
      <div class="henu-card" style="border: 2px solid var(--clr-gold);">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-suite.jpg" alt="King Suite Pyramids View">
          <div class="henu-card-price" style="background: var(--clr-gold); color: #FFFFFF;">Special $45 / Night</div>
        </div>
        <div class="henu-card-body">
          <div>
            <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 6px;">King Suite Pyramids View</h3>
            <p style="font-size: 0.88rem; color: var(--clr-gray); line-height: 1.5; margin-bottom: 16px;">Spacious luxury suite with king bed, marble bath & direct panoramic terrace view.</p>
          </div>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20the%20King%20Suite." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book via WhatsApp ($45)</a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- AISHA ROOF LOUNGE SHOWCASE -->
<div class="henu-section" style="background: linear-gradient(135deg, #071320 0%, #0F2338 100%); color: #FFFFFF;">
  <div class="henu-container">
    <div class="henu-grid-2">
      <div>
        <span class="henu-badge" style="background: var(--clr-gold-light); color: var(--clr-nile-dark);">Rooftop Experience</span>
        <h2 class="henu-title light">Aisha Roof <span>Lounge & Cafe</span></h2>
        <p class="henu-subtitle light">
          Dine under the stars with front-row seats to the nightly Pyramids Sound & Light Show. Enjoy traditional Egyptian gourmet breakfast, authentic grills, handcrafted mocktails, and fresh shisha.
        </p>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; font-size: 0.95rem; padding: 0;">
          <li>🍳 Fresh Egyptian & Continental Breakfast with morning pyramid sunrise.</li>
          <li>🍽️ Authentic Oriental Grills, Fresh Mezze & International Dishes.</li>
          <li>🍹 Specialty Mocktails, Fresh Juices & Egyptian Mint Tea.</li>
          <li>💨 Premium Shisha Lounge with panoramic sunset chill-out.</li>
        </ul>
        <a href="https://wa.me/201000925827?text=Hello,%20I%20would%20like%20to%20reserve%20a%20table%20at%20Aisha%20Roof%20Lounge." target="_blank" class="btn-henu-gold">Reserve a Rooftop Table →</a>
      </div>
      <div style="border-radius: var(--radius); overflow: hidden; border: 2px solid var(--clr-gold); height: 380px;">
        <img src="${uploadsBase}/hero-pyramids-sunset.jpg" alt="Aisha Roof Sunset View" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>
    </div>
  </div>
</div>
<!-- /wp:html -->
`;

// Save files locally
const localMuPhp = 'd:/Henu/scratch/henu-navbar.php';
const localHomeHtml = 'd:/Henu/scratch/pages/home_perfected.html';

fs.writeFileSync(localMuPhp, muPhp, 'utf8');
fs.writeFileSync(localHomeHtml, homePageHtml, 'utf8');

// Also update contact page with 21 Gamal Abdel Nasser St. and new mapsUrl
const localContactHtml = 'd:/Henu/scratch/pages/contact.html';
let contactContent = fs.readFileSync(localContactHtml, 'utf8');
contactContent = contactContent.replace(/https:\/\/maps\.app\.goo\.gl\/[a-zA-Z0-9_-]+/g, mapsUrl);
contactContent = contactContent.replace(/13\s*Gamal\s*Abdel\s*Nasser/gi, '21 Gamal Abdel Nasser');
contactContent = contactContent.replace(/13\s*شارع\s*جمال\s*عبد\s*الناصر/gi, '21 شارع جمال عبد الناصر');
fs.writeFileSync(localContactHtml, contactContent, 'utf8');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connected. Uploading MU-Plugin, Home, and Contact pages...');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    function put(loc, rem) {
      return new Promise((res, rej) => {
        sftp.fastPut(loc, rem, err => err ? rej(err) : res());
      });
    }

    async function deployAll() {
      await put(localMuPhp, 'domains/henuhotel.com/public_html/wp-content/mu-plugins/henu-navbar.php');
      await put(localHomeHtml, 'domains/henuhotel.com/public_html/p_home_perfected.html');
      await put(localContactHtml, 'domains/henuhotel.com/public_html/p_contact_perfected.html');

      const cmd = `
        cd ~/domains/henuhotel.com/public_html

        # 1. Test PHP syntax
        php -l wp-content/mu-plugins/henu-navbar.php

        # 2. Update Home Page Post Content
        HOME_ID=$(wp post list --post_type=page --name=home --field=ID)
        wp post update $HOME_ID p_home_perfected.html

        # 3. Update Contact Page Post Content
        CON_ID=$(wp post list --post_type=page --name=contact --field=ID)
        wp post update $CON_ID p_contact_perfected.html

        # 4. Clean temp files
        rm -f p_home_perfected.html p_contact_perfected.html

        # 5. Purge All LiteSpeed Cache
        wp litespeed-purge all 2>/dev/null || true
        echo "=== ALL UPDATES & PROFESSIONAL FOOTER DEPLOYED SUCCESSFULLY ==="
      `;

      conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('data', d => out += d);
        stream.on('close', () => {
          console.log(out);
          conn.end();
        });
      });
    }

    deployAll().catch(e => {
      console.error(e);
      conn.end();
    });
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972'
});
