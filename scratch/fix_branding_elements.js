const { Client } = require('d:/Henu/scratch/node_modules/ssh2');
const conn = new Client();

console.log('Configuring header branding elements and logo...');

const muPhp = `<?php
/**
 * Plugin Name: HENU Hotel Header Branding
 * Description: Custom header branding for HENU Pyramids Hotel (Logo + Title)
 */

// Custom logo rendering in Kadence
add_action('before_kadence_logo_output', function() {
    $logo_url = home_url('/wp-content/uploads/hotel/official-logo.jpg');
    echo '<img class="custom-logo" src="' . esc_url($logo_url) . '" alt="HENU Pyramids Hotel Logo" style="width:58px; height:58px; border-radius:50%; border:2px solid #C9873A; object-fit:cover; display:inline-block; vertical-align:middle; box-shadow:0 3px 10px rgba(0,0,0,0.5); margin-right:10px;">';
});

// Also inject into mobile drawer header
add_action('kadence_before_mobile_drawer_content', function() {
    $logo_url = home_url('/wp-content/uploads/hotel/official-logo.jpg');
    echo '<div style="display:flex; align-items:center; gap:10px; padding:15px; border-bottom:1px solid rgba(201,135,58,0.3);">'
       . '<img src="' . esc_url($logo_url) . '" style="width:45px; height:45px; border-radius:50%; border:1.5px solid #C9873A;">'
       . '<div style="font-family:\'Cinzel\', serif; font-size:1.1rem; font-weight:800; color:#FFFFFF;">HENU <span style="color:#C9873A;">HOTEL</span></div>'
       . '</div>';
});
`;

conn.on('ready', () => {
  const cmd = `
    cat << 'EOF' > ~/domains/henuhotel.com/public_html/wp-content/mu-plugins/henu-custom-header.php
${muPhp}
EOF

    cd ~/domains/henuhotel.com/public_html

    # 1. Update Kadence Theme Mods
    wp theme mod set header_branding_elements '["logo","title","tagline"]' --format=json
    wp theme mod set mobile_header_branding_elements '["logo","title","tagline"]' --format=json
    wp theme mod set site_title_layout "standard"
    wp theme mod set site_title_color "#FFFFFF"
    wp theme mod set site_tagline_color "#DFAB5C"

    # 2. Update Custom CSS for full branding style
    wp custom-css set "
      /* HIDE DEFAULT WORDPRESS / KADENCE PAGE TITLES IN CONTENT BODY */
      .entry-hero, .entry-header, .page-header, h1.entry-title, .single-content header { display: none !important; }
      .content-container { padding-top: 0 !important; }
      .site-main { padding-top: 0 !important; }

      /* SITE HEADER & BRANDING */
      .site-header { background: #071320 !important; border-bottom: 2px solid #C9873A !important; }
      .site-branding a.brand { display: flex !important; align-items: center !important; gap: 12px !important; text-decoration: none !important; }
      .site-branding .site-title-wrap { display: flex !important; flex-direction: column !important; justify-content: center !important; text-align: left !important; }
      .site-branding .site-title { font-family: 'Cinzel', serif !important; font-size: 1.35rem !important; font-weight: 900 !important; color: #FFFFFF !important; letter-spacing: 1.5px !important; line-height: 1.15 !important; margin: 0 !important; }
      .site-branding .site-description { font-family: 'Montserrat', sans-serif !important; font-size: 0.72rem !important; color: #DFAB5C !important; letter-spacing: 1.2px !important; text-transform: uppercase !important; margin: 2px 0 0 0 !important; font-weight: 700 !important; }

      /* PRIMARY NAVIGATION MENU */
      .main-navigation .primary-menu-container > ul > li > a { color: #FFFFFF !important; font-weight: 700 !important; font-family: 'Cinzel', serif !important; font-size: 0.95rem !important; letter-spacing: 0.5px !important; padding: 8px 14px !important; }
      .main-navigation .primary-menu-container > ul > li > a:hover { color: #F3C377 !important; }
      .main-navigation .primary-menu-container > ul > li.current-menu-item > a { color: #C9873A !important; }

      /* MOBILE DRAWER */
      #mobile-drawer { background: #071320 !important; }
      .mobile-navigation ul li a { color: #FFFFFF !important; font-family: 'Cinzel', serif !important; font-weight: 700 !important; }
      .mobile-toggle-open-container .menu-toggle-open { color: #C9873A !important; }

      /* FOOTER */
      .site-footer { background: #071320 !important; color: #FFFFFF !important; border-top: 2px solid #C9873A !important; }
    "

    # 3. Purge LiteSpeed Cache
    wp litespeed-purge all 2>/dev/null || true
    echo "=== BRANDING FULLY ACTIVE ==="
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
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972'
});
