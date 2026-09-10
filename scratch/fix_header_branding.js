const { Client } = require('d:/Henu/scratch/node_modules/ssh2');
const conn = new Client();

console.log('Fixing Kadence header branding (Logo + Hotel Name)...');

conn.on('ready', () => {
  const cmd = `
    cd ~/domains/henuhotel.com/public_html

    # 1. Regenerate metadata for all media attachments
    wp media regenerate --yes

    # 2. Get the logo attachment ID
    LOGO_ID=$(wp post list --post_type=attachment --name=official-logo --field=ID)
    if [ -z "$LOGO_ID" ]; then
      LOGO_ID=$(wp media import wp-content/uploads/hotel/official-logo.jpg --title="HENU Hotel Official Logo" --porcelain)
    fi
    echo "Using Logo ID: $LOGO_ID"

    # 3. Configure Kadence Theme mods for Logo + Title display
    wp theme mod set custom_logo $LOGO_ID
    wp theme mod set site_title_layout "logo_title"
    wp theme mod set header_branding_logo_width 70
    wp theme mod set mobile_header_branding_logo_width 55
    wp theme mod set site_title_color "#FFFFFF"
    wp theme mod set site_tagline_color "#C9873A"

    # 4. Enhance Custom CSS for the Header Branding
    wp custom-css set "
      /* HIDE DEFAULT PAGE TITLES IN CONTENT AREA */
      .entry-hero, .entry-header, .page-header, h1.entry-title, .single-content header { display: none !important; }
      .content-container { padding-top: 0 !important; }
      .site-main { padding-top: 0 !important; }

      /* HEADER BRANDING: LOGO + HOTEL NAME */
      .site-header { background: #071320 !important; border-bottom: 2px solid #C9873A !important; padding: 6px 0 !important; }
      .site-branding { display: flex !important; align-items: center !important; gap: 14px !important; text-decoration: none !important; }
      .site-branding .brand { display: flex !important; align-items: center !important; gap: 12px !important; text-decoration: none !important; }
      .site-branding .custom-logo { width: 60px !important; height: 60px !important; border-radius: 50% !important; border: 1.5px solid #C9873A !important; object-fit: cover !important; box-shadow: 0 2px 10px rgba(0,0,0,0.5) !important; }
      .site-title { font-family: 'Cinzel', serif !important; font-size: 1.35rem !important; font-weight: 800 !important; letter-spacing: 1.5px !important; line-height: 1.1 !important; margin: 0 !important; }
      .site-title a { color: #FFFFFF !important; text-decoration: none !important; }
      .site-title a:hover { color: #F3C377 !important; }
      .site-description { font-family: 'Montserrat', sans-serif !important; font-size: 0.75rem !important; color: #DFAB5C !important; letter-spacing: 1px !important; text-transform: uppercase !important; margin: 2px 0 0 0 !important; font-weight: 600 !important; }

      /* NAVIGATION MENU */
      .main-navigation .primary-menu-container > ul > li > a { color: #FFFFFF !important; font-weight: 700 !important; font-family: 'Cinzel', serif !important; font-size: 0.95rem !important; letter-spacing: 0.5px !important; padding: 10px 14px !important; }
      .main-navigation .primary-menu-container > ul > li > a:hover { color: #F3C377 !important; }
      
      /* FOOTER */
      .site-footer { background: #071320 !important; color: #FFFFFF !important; border-top: 2px solid #C9873A !important; }
    "

    # 5. Purge Cache
    wp litespeed-purge all 2>/dev/null || true
    echo "=== BRANDING CONFIGURED SUCCESSFULLY ==="
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
