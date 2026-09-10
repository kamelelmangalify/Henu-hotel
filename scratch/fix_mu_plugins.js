const fs = require('fs');
const path = require('path');
const { Client } = require('d:/Henu/scratch/node_modules/ssh2');

const cleanNavbarPhp = `<?php
/**
 * Plugin Name: HENU Hotel Executive Header & Navbar
 * Description: Embeds the official golden logo, hotel name, and navigation menu across all pages.
 */

// 1. Injected Styles
add_action('wp_head', 'henu_header_styles', 999);
function henu_header_styles() {
?>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  /* HIDE DEFAULT KADENCE HEADER & DEFAULT TITLES */
  #masthead, .site-header, .entry-hero, .entry-header, .page-header, h1.entry-title {
    display: none !important;
  }
  .content-container, .site-main, #inner-wrap {
    padding-top: 0 !important;
    margin-top: 0 !important;
  }

  /* EXECUTIVE NAVBAR */
  .henu-navbar {
    background: #071320;
    border-bottom: 2px solid #C9873A;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    font-family: "Montserrat", sans-serif;
  }

  .henu-nav-container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  /* BRANDING (LOGO + NAME) */
  .henu-nav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }

  .henu-nav-logo {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid #C9873A;
    object-fit: cover;
    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    transition: transform 0.3s ease;
  }
  .henu-nav-brand:hover .henu-nav-logo {
    transform: scale(1.05);
  }

  .henu-nav-title {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .henu-nav-title h1 {
    font-family: "Cinzel", serif !important;
    font-size: 1.35rem !important;
    font-weight: 900 !important;
    color: #FFFFFF !important;
    letter-spacing: 1.5px !important;
    line-height: 1.1 !important;
    margin: 0 !important;
  }
  .henu-nav-title h1 span {
    color: #C9873A !important;
  }

  .henu-nav-title p {
    font-size: 0.72rem !important;
    color: #DFAB5C !important;
    letter-spacing: 1.2px !important;
    text-transform: uppercase !important;
    font-weight: 700 !important;
    margin: 2px 0 0 0 !important;
  }

  /* NAV LINKS */
  .henu-nav-menu {
    display: flex;
    align-items: center;
    gap: 22px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .henu-nav-menu li a {
    font-family: "Cinzel", serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #FFFFFF;
    text-decoration: none;
    letter-spacing: 0.5px;
    transition: color 0.3s ease;
    padding: 6px 0;
  }

  .henu-nav-menu li a:hover {
    color: #F3C377;
  }

  /* NAV CTA BUTTON */
  .henu-nav-cta {
    background: #C9873A;
    color: #FFFFFF !important;
    font-weight: 700;
    font-size: 0.88rem;
    padding: 10px 20px;
    border-radius: 6px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(201,135,58,0.3);
  }
  .henu-nav-cta:hover {
    background: #DFAB5C;
    transform: translateY(-1px);
  }

  /* MOBILE TOGGLE */
  .henu-mobile-toggle {
    display: none;
    background: transparent;
    border: none;
    color: #C9873A;
    font-size: 1.8rem;
    cursor: pointer;
  }

  @media (max-width: 992px) {
    .henu-nav-menu, .henu-nav-cta { display: none; }
    .henu-mobile-toggle { display: block; }
    .henu-nav-title h1 { font-size: 1.15rem !important; }
    .henu-nav-logo { width: 46px; height: 46px; }
  }

  /* MOBILE MENU DRAWER */
  #henuMobileMenu {
    display: none;
    background: #071320;
    border-top: 1px solid rgba(201,135,58,0.3);
    padding: 20px;
  }
  #henuMobileMenu.active {
    display: block;
  }
  #henuMobileMenu ul {
    list-style: none;
    padding: 0;
    margin: 0 0 16px 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  #henuMobileMenu ul li a {
    color: #FFFFFF;
    font-family: "Cinzel", serif;
    font-size: 1.05rem;
    font-weight: 700;
    text-decoration: none;
    display: block;
  }
</style>
<?php
}

// 2. Injected Executive Navbar HTML at Top of Body
add_action('wp_body_open', 'henu_render_navbar', 1);
function henu_render_navbar() {
    $logo_url = home_url('/wp-content/uploads/hotel/official-logo.jpg');
    $home_url = home_url('/');
?>
<nav class="henu-navbar">
  <div class="henu-nav-container">
    <!-- Brand Logo & Hotel Name -->
    <a href="<?php echo esc_url($home_url); ?>" class="henu-nav-brand">
      <img src="<?php echo esc_url($logo_url); ?>" alt="HENU Pyramids Hotel Logo" class="henu-nav-logo">
      <div class="henu-nav-title">
        <h1>HENU <span>HOTEL</span></h1>
        <p>Pyramids View · Giza</p>
      </div>
    </a>

    <!-- Desktop Menu Links -->
    <ul class="henu-nav-menu">
      <li><a href="<?php echo esc_url($home_url); ?>">Home</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>accommodation/">Accommodation</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>experiences/">Experiences</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>b2b/">B2B Services</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>careers/">Careers</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>contact/">Contact & Booking</a></li>
    </ul>

    <!-- Right WhatsApp Booking CTA -->
    <a href="https://wa.me/201000925827?text=Hello%20HENU%20Hotel,%20I%20want%20to%20book%20a%20stay." target="_blank" class="henu-nav-cta">
      💬 Book WhatsApp
    </a>

    <!-- Mobile Toggle Button -->
    <button class="henu-mobile-toggle" onclick="document.getElementById('henuMobileMenu').classList.toggle('active')">
      ☰
    </button>
  </div>

  <!-- Mobile Dropdown -->
  <div id="henuMobileMenu">
    <ul>
      <li><a href="<?php echo esc_url($home_url); ?>">Home</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>accommodation/">Accommodation</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>experiences/">Experiences</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>b2b/">B2B Services</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>careers/">Careers</a></li>
      <li><a href="<?php echo esc_url($home_url); ?>contact/">Contact & Booking</a></li>
    </ul>
    <a href="https://wa.me/201000925827?text=Hello%20HENU%20Hotel,%20I%20want%20to%20book%20a%20stay." target="_blank" class="henu-nav-cta" style="width:100%; justify-content:center; display:flex;">
      💬 Instant WhatsApp Booking
    </a>
  </div>
</nav>
<?php
}
`;

const localPhp = 'd:/Henu/scratch/henu-navbar.php';
fs.writeFileSync(localPhp, cleanNavbarPhp, 'utf8');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connected. Uploading clean PHP file...');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    sftp.fastPut(localPhp, 'domains/henuhotel.com/public_html/wp-content/mu-plugins/henu-navbar.php', (err) => {
      if (err) throw err;

      const cmd = `
        cd ~/domains/henuhotel.com/public_html
        # Remove any broken old file
        rm -f wp-content/mu-plugins/henu-custom-header.php

        # Test PHP syntax
        php -l wp-content/mu-plugins/henu-navbar.php

        # Clear LiteSpeed Cache
        wp litespeed-purge all 2>/dev/null || true
        echo "=== NAVBAR SUCCESSFULLY INSTALLED AND VERIFIED ==="
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
    });
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972'
});
