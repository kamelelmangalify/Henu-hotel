const fs = require('fs');
const { Client } = require('d:/Henu/scratch/node_modules/ssh2');

const muPhp = `<?php
/**
 * Plugin Name: HENU Hotel Header & Branding
 * Description: Custom header branding filter for HENU Pyramids Hotel (Logo + Title)
 */

add_filter('get_custom_logo', 'henu_custom_logo_markup', 999);
function henu_custom_logo_markup($html) {
    $logo_url = home_url('/wp-content/uploads/hotel/official-logo.jpg');
    $home_url = home_url('/');
    
    return '<a href="' . esc_url($home_url) . '" class="brand henu-brand-wrap" rel="home" style="display:inline-flex; align-items:center; gap:12px; text-decoration:none;">'
         . '<img src="' . esc_url($logo_url) . '" alt="HENU Pyramids Hotel Logo" style="width:58px; height:58px; border-radius:50%; border:2px solid #C9873A; object-fit:cover; display:inline-block; vertical-align:middle; box-shadow:0 3px 10px rgba(0,0,0,0.5);">'
         . '<div class="henu-brand-text" style="display:flex; flex-direction:column; justify-content:center; text-align:left;">'
         . '<span style="font-family:\'Cinzel\', serif; font-size:1.3rem; font-weight:900; color:#FFFFFF; letter-spacing:1.5px; line-height:1.1;">HENU <span style="color:#C9873A;">HOTEL</span></span>'
         . '<span style="font-family:\'Montserrat\', sans-serif; font-size:0.7rem; color:#DFAB5C; letter-spacing:1.2px; text-transform:uppercase; font-weight:700; margin-top:2px;">Pyramids View · Giza</span>'
         . '</div>'
         . '</a>';
}

// Add global styles for header in wp_head
add_action('wp_head', function() {
    echo '<style>
        .site-header { background: #071320 !important; border-bottom: 2px solid #C9873A !important; }
        .main-navigation .primary-menu-container > ul > li > a { color: #FFFFFF !important; font-family: "Cinzel", serif !important; font-weight: 700 !important; font-size: 0.95rem !important; }
        .main-navigation .primary-menu-container > ul > li > a:hover { color: #F3C377 !important; }
        .entry-hero, .entry-header, .page-header, h1.entry-title { display: none !important; }
        .content-container { padding-top: 0 !important; }
    </style>';
}, 999);
`;

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connected. Writing MU-Plugin...');
  conn.exec(`
    mkdir -p ~/domains/henuhotel.com/public_html/wp-content/mu-plugins
    cat << 'EOF' > ~/domains/henuhotel.com/public_html/wp-content/mu-plugins/henu-custom-header.php
${muPhp}
EOF
    cd ~/domains/henuhotel.com/public_html
    wp litespeed-purge all 2>/dev/null || true
    echo "=== MU-PLUGIN CREATED AND CACHE PURGED ==="
  `, (err, stream) => {
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
