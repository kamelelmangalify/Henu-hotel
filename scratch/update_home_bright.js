const fs = require('fs');
const path = require('path');
const { Client } = require('d:/Henu/scratch/node_modules/ssh2');

// Let's create a script that updates the home page and global CSS on the server
const updatedGlobalStyles = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800&family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
<style>
/* HIDE DEFAULT WORDPRESS / KADENCE PAGE TITLES */
.entry-hero, .entry-header, .page-header, h1.entry-title, .single-content header {
  display: none !important;
}

:root {
  --clr-nile-dark: #071320;
  --clr-nile: #0B1B2B;
  --clr-nile-mid: #14283D;
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
.henu-container { max-width: 1200px; margin: 0 auto; }
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
  background: rgba(7, 19, 32, 0.6);
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
  border: 1.5px solid var(--clr-gold-bright);
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-henu-outline:hover {
  background: var(--clr-gold);
  border-color: var(--clr-gold);
}

.henu-grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
}
.henu-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 36px;
  align-items: center;
}
.henu-card {
  background: #FFFFFF;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid var(--clr-sand-dark);
  transition: all 0.35s ease;
}
.henu-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.1);
}
.henu-card-img {
  height: 220px;
  overflow: hidden;
  position: relative;
}
.henu-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.henu-card:hover .henu-card-img img {
  transform: scale(1.06);
}
.henu-card-body { padding: 24px; }
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
}

@media (max-width: 768px) {
  .henu-title { font-size: 1.85rem; }
  .henu-section { padding: 50px 16px; }
}
</style>
`;

// BRIGHT HERO SECTION
const updatedHomeHtml = `<!-- wp:html -->
${updatedGlobalStyles}
<!-- HERO SECTION (BRIGHT & RADIANT GOLDEN SUNSET PYRAMIDS VIEW) -->
<div style="background: linear-gradient(180deg, rgba(7, 19, 32, 0.15) 0%, rgba(7, 19, 32, 0.35) 60%, rgba(7, 19, 32, 0.7) 100%), url('/wp-content/uploads/hotel/hero-pyramids-sunset.jpg') center 40%/cover no-repeat; min-height: 90vh; display: flex; align-items: center; justify-content: center; text-align: center; color: #FFFFFF; padding: 130px 20px 90px; position: relative;">
  <div style="max-width: 920px; background: rgba(7, 19, 32, 0.3); padding: 30px 24px; border-radius: 16px; backdrop-filter: blur(3px); border: 1px solid rgba(201, 135, 58, 0.3); box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
    <span class="henu-badge" style="background: var(--clr-gold); color: #FFFFFF; font-size: 0.85rem; padding: 6px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">★ Pyramids View Boutique Hotel · Giza</span>
    <h1 style="font-family: var(--font-cinzel); font-size: clamp(2.3rem, 5.2vw, 4.1rem); font-weight: 900; line-height: 1.15; margin: 18px 0; color: #FFFFFF; text-shadow: 0 4px 20px rgba(0,0,0,0.8);">
      Where Ancient Wonders Meet <span style="color: var(--clr-gold-bright);">Modern Comfort</span>
    </h1>
    <p style="font-size: 1.25rem; font-weight: 500; color: #FFFFFF; max-width: 740px; margin: 0 auto 34px; line-height: 1.6; text-shadow: 0 2px 12px rgba(0,0,0,0.85);">
      Experience uninterrupted, front-row views of the Great Pyramids and Sphinx from our boutique rooms and rooftop lounge in the heart of historic Nazlet El-Semman.
    </p>
    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
      <a href="/contact#booking" class="btn-henu-gold" style="font-size: 1.1rem; padding: 16px 36px; box-shadow: 0 6px 20px rgba(201,135,58,0.5);">📅 Instant WhatsApp Booking</a>
      <a href="/accommodation" class="btn-henu-outline" style="font-size: 1.1rem; padding: 16px 32px;">🛏️ View Rooms from $12</a>
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

<!-- WELCOME & ABOUT -->
<div class="henu-section" style="background: var(--clr-ivory);">
  <div class="henu-container">
    <div class="henu-grid-2">
      <div>
        <span class="henu-badge">Welcome to HENU</span>
        <h2 class="henu-title">A Sanctuary in the <span>Heart of History</span></h2>
        <p class="henu-subtitle" style="margin-bottom: 20px;">
          Located just 2 minutes' walk from the Giza Plateau entrance and the iconic Sphinx, HENU Pyramids Hotel offers an authentic blend of traditional Pharaonic hospitality and boutique comfort.
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px;">
          <div style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid var(--clr-sand-dark);">
            <div style="font-size: 1.5rem; color: var(--clr-gold); font-weight: 800; font-family: var(--font-cinzel);">2 Min</div>
            <div style="font-size: 0.85rem; color: var(--clr-gray); font-weight: 600;">Walk to Sphinx & Pyramids Gate</div>
          </div>
          <div style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid var(--clr-sand-dark);">
            <div style="font-size: 1.5rem; color: var(--clr-gold); font-weight: 800; font-family: var(--font-cinzel);">$12+</div>
            <div style="font-size: 0.85rem; color: var(--clr-gray); font-weight: 600;">Best Direct Room Rates</div>
          </div>
        </div>
        <a href="/accommodation" class="btn-henu-gold">Explore All Rooms →</a>
      </div>
      <div style="border-radius: var(--radius); overflow: hidden; border: 2px solid var(--clr-gold); box-shadow: var(--shadow);">
        <img src="/wp-content/uploads/hotel/pyramids-terrace-night.jpg" alt="HENU Pyramids View" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>
    </div>
  </div>
</div>

<!-- FEATURED ROOMS -->
<div class="henu-section" style="background: var(--clr-sand);">
  <div class="henu-container" style="text-align: center;">
    <span class="henu-badge">Accommodation</span>
    <h2 class="henu-title">Featured <span>Rooms & Suites</span></h2>
    <p class="henu-subtitle center">From cozy single rooms to royal panoramic suites with private pyramid balconies.</p>
    
    <div class="henu-grid-3" style="text-align: left;">
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="/wp-content/uploads/hotel/room-single.jpg" alt="Single Room">
          <div class="henu-card-price">From $12 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 6px;">Single Cozy Room</h3>
          <p style="font-size: 0.88rem; color: var(--clr-gray); margin-bottom: 16px;">Standard ($12) · Window ($15) · Balcony ($20). Perfect for solo travelers.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20a%20Single%20Room." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book via WhatsApp</a>
        </div>
      </div>
      
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="/wp-content/uploads/hotel/room-double-balcony.jpg" alt="Double Room Balcony">
          <div class="henu-card-price">From $18 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 6px;">Double / Twin Room</h3>
          <p style="font-size: 0.88rem; color: var(--clr-gray); margin-bottom: 16px;">Standard ($18) · Window ($22) · Balcony ($25). Direct pyramid panorama.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20a%20Double%20Room." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book via WhatsApp</a>
        </div>
      </div>

      <div class="henu-card">
        <div class="henu-card-img">
          <img src="/wp-content/uploads/hotel/room-suite.jpg" alt="King Suite">
          <div class="henu-card-price">Special $45 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 6px;">King Suite Pyramids View</h3>
          <p style="font-size: 0.88rem; color: var(--clr-gray); margin-bottom: 16px;">Spacious luxury suite with king bed, marble bath & direct panoramic terrace view.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20the%20King%20Suite." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book via WhatsApp</a>
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
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; font-size: 0.95rem;">
          <li>🍳 Fresh Egyptian & Continental Breakfast with morning pyramid sunrise.</li>
          <li>🍽️ Authentic Oriental Grills, Fresh Mezze & International Dishes.</li>
          <li>🍹 Specialty Mocktails, Fresh Juices & Egyptian Mint Tea.</li>
          <li>💨 Premium Shisha Lounge with panoramic sunset chill-out.</li>
        </ul>
        <a href="https://wa.me/201000925827?text=Hello,%20I%20would%20like%20to%20reserve%20a%20table%20at%20Aisha%20Roof%20Lounge." target="_blank" class="btn-henu-gold">Reserve a Rooftop Table →</a>
      </div>
      <div style="border-radius: var(--radius); overflow: hidden; border: 2px solid var(--clr-gold);">
        <img src="/wp-content/uploads/hotel/hero-pyramids-sunset.jpg" alt="Aisha Roof Sunset View" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>
    </div>
  </div>
</div>
<!-- /wp:html -->
`;

const localPath = 'd:/Henu/scratch/pages/home_bright.html';
fs.writeFileSync(localPath, updatedHomeHtml, 'utf8');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connected. Updating Home page & hiding title...');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    sftp.fastPut(localPath, 'domains/henuhotel.com/public_html/p_home_bright.html', (err) => {
      if (err) throw err;

      const cmd = `
        cd ~/domains/henuhotel.com/public_html

        # 1. Update Home Page Content
        HOME_ID=$(wp post list --post_type=page --name=home --field=ID)
        wp post update $HOME_ID p_home_bright.html

        # 2. Disable default titles in Kadence page layout meta
        for id in $(wp post list --post_type=page --format=ids); do
          wp post meta update $id _kad_page_title hide
          wp post meta update $id _kad_post_title hide
        done

        # 3. Add Custom CSS in Kadence Customizer to completely hide any theme title header
        wp custom-css set ".entry-hero, .entry-header, .page-header, h1.entry-title, .single-content header { display: none !important; } .content-container { padding-top: 0 !important; } .site-main { padding-top: 0 !important; }"

        # 4. Clean temp file
        rm -f p_home_bright.html

        # 5. Purge Cache
        wp litespeed-purge all 2>/dev/null || true
        echo "SUCCESS: Home page brightened and title removed!"
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
