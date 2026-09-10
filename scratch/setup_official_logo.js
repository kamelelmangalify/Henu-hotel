const fs = require('fs');
const path = require('path');
const { Client } = require('d:/Henu/scratch/node_modules/ssh2');

const logoLocal = 'd:/Henu/03_Procurement_and_Orders/شعار_الفندق_عقود.jpg';
const conn = new Client();

console.log('Connecting to upload official logo and set Kadence theme header/favicon...');

conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;

    sftp.fastPut(logoLocal, 'domains/henuhotel.com/public_html/wp-content/uploads/hotel/official-logo.jpg', (err) => {
      if (err) throw err;
      console.log('Logo uploaded to server. Importing into WordPress...');

      const cmd = `
        cd ~/domains/henuhotel.com/public_html

        # 1. Import Logo into WordPress Media Library
        LOGO_ID=$(wp media import wp-content/uploads/hotel/official-logo.jpg --title="HENU Hotel Official Logo" --porcelain)
        echo "Logo Media ID: $LOGO_ID"

        # 2. Set Custom Logo & Site Icon (Favicon)
        wp option update site_icon $LOGO_ID
        wp theme mod set custom_logo $LOGO_ID

        # 3. Configure Kadence Header with Logo
        wp theme mod set logo_layout "standard"
        wp theme mod set site_title_layout "logo"
        
        # 4. Hide default page titles across all pages
        for id in $(wp post list --post_type=page --format=ids); do
          wp post meta update $id _kad_page_title hide
          wp post meta update $id _kad_post_title hide
        done

        # 5. Global Custom CSS in Kadence Customizer
        wp custom-css set "
          .entry-hero, .entry-header, .page-header, h1.entry-title, .single-content header { display: none !important; }
          .content-container { padding-top: 0 !important; }
          .site-main { padding-top: 0 !important; }
          .site-branding .custom-logo { max-height: 65px !important; width: auto !important; border-radius: 50% !important; border: 1.5px solid #C9873A !important; }
          .site-header { background: #071320 !important; border-bottom: 2px solid #C9873A !important; }
          .main-navigation .primary-menu-container > ul > li > a { color: #FFFFFF !important; font-weight: 700 !important; font-family: 'Cinzel', serif !important; font-size: 0.95rem !important; }
          .main-navigation .primary-menu-container > ul > li > a:hover { color: #F3C377 !important; }
          .site-footer { background: #071320 !important; color: #FFFFFF !important; border-top: 2px solid #C9873A !important; }
        "

        # 6. Purge LiteSpeed Cache
        wp litespeed-purge all 2>/dev/null || true
        echo "=== ALL SETTINGS APPLIED SUCCESSFULLY ==="
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
