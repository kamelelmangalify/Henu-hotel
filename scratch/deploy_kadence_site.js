const fs = require('fs');
const path = require('path');
const { Client } = require('d:/Henu/scratch/node_modules/ssh2');

const uploadsBase = '/wp-content/uploads/hotel';

// ==========================================
// 1. GLOBAL STYLES & FONTS
// ==========================================
const globalStyles = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800&family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
<style>
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

.henu-section {
  padding: 80px 20px;
  font-family: var(--font-montserrat);
}
.henu-container {
  max-width: 1200px;
  margin: 0 auto;
}
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
.henu-subtitle.light { color: rgba(255,255,255,0.85); }

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
  background: transparent;
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
  background: rgba(255,255,255,0.15);
  border-color: var(--clr-gold-light);
}

/* Grid & Cards */
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
.henu-card-body {
  padding: 24px;
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
}

@media (max-width: 768px) {
  .henu-title { font-size: 1.85rem; }
  .henu-section { padding: 50px 16px; }
}
</style>
`;

// ==========================================
// 2. PAGE 1: HOME (الرئيسية)
// ==========================================
const homeContent = `
<!-- wp:html -->
${globalStyles}
<!-- HERO SECTION (Lightened & Radiant Pyramids View) -->
<div style="background: linear-gradient(180deg, rgba(7, 19, 32, 0.35) 0%, rgba(11, 27, 43, 0.65) 100%), url('${uploadsBase}/hero-pyramids-night.jpg') center/cover no-repeat; min-height: 85vh; display: flex; align-items: center; justify-content: center; text-align: center; color: #FFFFFF; padding: 120px 20px 80px; position: relative;">
  <div style="max-width: 900px;">
    <span class="henu-badge" style="background: var(--clr-gold-bright); color: var(--clr-nile-dark);">★ Pyramids View Boutique Hotel · Giza</span>
    <h1 style="font-family: var(--font-cinzel); font-size: clamp(2.4rem, 5vw, 4rem); font-weight: 800; line-height: 1.18; margin: 16px 0; color: #FFFFFF; text-shadow: 0 3px 15px rgba(0,0,0,0.6);">
      Where Ancient Wonders Meet <span style="color: var(--clr-gold-bright);">Modern Comfort</span>
    </h1>
    <p style="font-size: 1.2rem; color: var(--clr-sand); max-width: 720px; margin: 0 auto 32px; line-height: 1.6; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">
      Experience uninterrupted, front-row views of the Great Pyramids and Sphinx from our boutique rooms and rooftop lounge in the heart of historic Nazlet El-Semman.
    </p>
    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
      <a href="/contact#booking" class="btn-henu-gold" style="font-size: 1.1rem; padding: 16px 36px;">📅 Instant WhatsApp Booking</a>
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
        <img src="${uploadsBase}/pyramids-terrace-night.jpg" alt="HENU Pyramids View" style="width: 100%; height: 100%; object-fit: cover; display: block;">
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
      <!-- Room 1 -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-single.jpg" alt="Single Room">
          <div class="henu-card-price">From $12 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 6px;">Single Cozy Room</h3>
          <p style="font-size: 0.88rem; color: var(--clr-gray); margin-bottom: 16px;">Standard ($12) · Window ($15) · Balcony ($20). Perfect for solo adventurers.</p>
          <a href="https://wa.me/20100925827?text=Hello%20HENU,%20I%20want%20to%20book%20a%20Single%20Room." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book via WhatsApp</a>
        </div>
      </div>
      
      <!-- Room 2 -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-double-balcony.jpg" alt="Double Room Balcony">
          <div class="henu-card-price">From $18 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 6px;">Double / Twin Room</h3>
          <p style="font-size: 0.88rem; color: var(--clr-gray); margin-bottom: 16px;">Standard ($18) · Window ($22) · Balcony ($25). Direct pyramid panorama.</p>
          <a href="https://wa.me/20100925827?text=Hello%20HENU,%20I%20want%20to%20book%20a%20Double%20Room." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book via WhatsApp</a>
        </div>
      </div>

      <!-- Room 3 -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-suite.jpg" alt="King Suite">
          <div class="henu-card-price">Special $45 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 6px;">King Suite Pyramids View</h3>
          <p style="font-size: 0.88rem; color: var(--clr-gray); margin-bottom: 16px;">Spacious luxury suite with king bed, marble bath & direct panoramic terrace view.</p>
          <a href="https://wa.me/20100925827?text=Hello%20HENU,%20I%20want%20to%20book%20the%20King%20Suite." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book via WhatsApp</a>
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
        <img src="${uploadsBase}/hero-pyramids-sunset.jpg" alt="Aisha Roof Sunset View" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>
    </div>
  </div>
</div>
<!-- /wp:html -->
`;

// ==========================================
// 3. PAGE 2: ACCOMMODATION (الإقامة والغرف)
// ==========================================
const accommodationContent = `
<!-- wp:html -->
${globalStyles}
<div class="henu-section" style="background: var(--clr-ivory); padding-top: 40px;">
  <div class="henu-container" style="text-align: center;">
    <span class="henu-badge">Our Rooms</span>
    <h1 class="henu-title">Boutique <span>Accommodation</span></h1>
    <p class="henu-subtitle center">Transparent direct pricing with 0% extra fees. Book direct via WhatsApp for the best guaranteed rate.</p>
    
    <div class="henu-grid-3" style="text-align: left;">
      
      <!-- Single Standard -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-single.jpg" alt="Single Standard">
          <div class="henu-card-price">$12 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.25rem; color: var(--clr-nile);">Single Standard Room</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 12px;">Cozy, private room with high-speed Wi-Fi, A/C, and private marble bathroom.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20Single%20Standard%20($12)." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book on WhatsApp ($12)</a>
        </div>
      </div>

      <!-- Single Window -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-window.jpg" alt="Single Window">
          <div class="henu-card-price">$15 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.25rem; color: var(--clr-nile);">Single with Pyramids Window</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 12px;">Single room featuring a large window with direct Pyramids view and morning sunlight.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20Single%20Window%20($15)." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book on WhatsApp ($15)</a>
        </div>
      </div>

      <!-- Single Balcony -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-double-balcony.jpg" alt="Single Balcony">
          <div class="henu-card-price">$20 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.25rem; color: var(--clr-nile);">Single with Private Balcony</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 12px;">Private outdoor balcony with panoramic Pyramids view, outdoor seating & A/C.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20Single%20Balcony%20($20)." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book on WhatsApp ($20)</a>
        </div>
      </div>

      <!-- Double Standard -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-double.jpg" alt="Double Standard">
          <div class="henu-card-price">$18 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.25rem; color: var(--clr-nile);">Double Standard Room</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 12px;">Queen bed or 2 twin beds, Egyptian cotton linens, smart TV & en-suite bathroom.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20Double%20Standard%20($18)." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book on WhatsApp ($18)</a>
        </div>
      </div>

      <!-- Double Window -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-deluxe-pharaonic.jpg" alt="Double Window">
          <div class="henu-card-price">$22 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.25rem; color: var(--clr-nile);">Double with Pyramids Window</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 12px;">Deluxe double room overlooking the Pyramids of Khufu and Khafre.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20Double%20Window%20($22)." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book on WhatsApp ($22)</a>
        </div>
      </div>

      <!-- Double Balcony -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-double-balcony.jpg" alt="Double Balcony">
          <div class="henu-card-price">$25 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.25rem; color: var(--clr-nile);">Double with Private Balcony</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 12px;">Breathtaking balcony views of the illuminated Pyramids and Sound & Light show.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20Double%20Balcony%20($25)." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book on WhatsApp ($25)</a>
        </div>
      </div>

      <!-- Triple Standard -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-triple.jpg" alt="Triple Standard">
          <div class="henu-card-price">$25 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.25rem; color: var(--clr-nile);">Triple / Family Standard</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 12px;">3 comfortable single beds or 1 double + 1 single. Ideal for families and small groups.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20Triple%20Standard%20($25)." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book on WhatsApp ($25)</a>
        </div>
      </div>

      <!-- Triple Window -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-triple-window.jpg" alt="Triple Window">
          <div class="henu-card-price">$30 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.25rem; color: var(--clr-nile);">Triple with Pyramids Window</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 12px;">Family room with panoramic window facing the Great Pyramids & Sphinx.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20Triple%20Window%20($30)." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book on WhatsApp ($30)</a>
        </div>
      </div>

      <!-- Royal Suite -->
      <div class="henu-card" style="border: 2px solid var(--clr-gold);">
        <div class="henu-card-img">
          <img src="${uploadsBase}/room-suite.jpg" alt="Royal King Suite">
          <div class="henu-card-price" style="background: var(--clr-gold); color: #FFFFFF;">$45 / Night</div>
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.25rem; color: var(--clr-nile);">Royal Suite Pyramids View</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 12px;">Our signature king suite with private terrace, seating area, and VIP amenities.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20the%20Royal%20Suite%20($45)." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book on WhatsApp ($45)</a>
        </div>
      </div>

    </div>
  </div>
</div>
<!-- /wp:html -->
`;

// ==========================================
// 4. PAGE 3: EXPERIENCES (الجولات والتجارب)
// ==========================================
const experiencesContent = `
<!-- wp:html -->
${globalStyles}
<div class="henu-section" style="background: var(--clr-ivory); padding-top: 40px;">
  <div class="henu-container" style="text-align: center;">
    <span class="henu-badge">Tours & Safari</span>
    <h1 class="henu-title">Curated Giza <span>Experiences</span></h1>
    <p class="henu-subtitle center">Discover ancient Egypt with licensed Egyptologist guides, private desert safaris, and VIP transport.</p>

    <div class="henu-grid-3" style="text-align: left;">
      
      <!-- Tour 1 -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/hero-pyramids-sunset.jpg" alt="Pyramids Tour">
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.2rem; color: var(--clr-nile);">Pyramids & Sphinx VIP Tour</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 14px;">Skip-the-line plateau access, Great Sphinx visit, and private Egyptologist guide.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20book%20the%20Pyramids%20VIP%20Tour." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Book Tour via WhatsApp</a>
        </div>
      </div>

      <!-- Tour 2 -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/pyramids-terrace-night.jpg" alt="Sound & Light">
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.2rem; color: var(--clr-nile);">Pyramids Sound & Light Show</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 14px;">Watch the history of Egypt illuminate across the Pyramids from our exclusive rooftop terrace.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20want%20to%20reserve%20for%20Sound%20and%20Light%20Show." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Reserve on WhatsApp</a>
        </div>
      </div>

      <!-- Tour 3 -->
      <div class="henu-card">
        <div class="henu-card-img">
          <img src="${uploadsBase}/hero-pyramids-night.jpg" alt="Airport Pickup">
        </div>
        <div class="henu-card-body">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.2rem; color: var(--clr-nile);">Private Airport Transfers</h3>
          <p style="font-size: 0.85rem; color: var(--clr-gray); margin-bottom: 14px;">Cairo International Airport (CAI) or Sphinx Airport (SPX) directly to HENU Hotel with professional chauffeur.</p>
          <a href="https://wa.me/201000925827?text=Hello%20HENU,%20I%20need%20Airport%20Pickup." target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center;">Request Transfer</a>
        </div>
      </div>

    </div>
  </div>
</div>
<!-- /wp:html -->
`;

// ==========================================
// 5. PAGE 4: B2B & MANAGEMENT (خدمات الشركات)
// ==========================================
const b2bContent = `
<!-- wp:html -->
${globalStyles}
<div class="henu-section" style="background: var(--clr-ivory); padding-top: 40px;">
  <div class="henu-container">
    <div style="text-align: center; margin-bottom: 40px;">
      <span class="henu-badge">Partnerships</span>
      <h1 class="henu-title">B2B & <span>Hotel Management</span></h1>
      <p class="henu-subtitle center">Corporate travel contracts, tour operator allotments, and full hospitality management services.</p>
    </div>

    <div class="henu-grid-2">
      <div>
        <h3 style="font-family: var(--font-cinzel); font-size: 1.5rem; color: var(--clr-nile); margin-bottom: 12px;">Corporate & Agency Inquiries</h3>
        <p style="color: var(--clr-gray); line-height: 1.7; margin-bottom: 20px;">
          For corporate travel inquiries, group allocations, or business partnerships, please contact our management team directly via email or our corporate hotline.
        </p>
        <div style="background: #FFFFFF; padding: 20px; border-radius: var(--radius); border: 1px solid var(--clr-sand-dark); margin-bottom: 16px;">
          <div style="font-size: 0.85rem; color: var(--clr-gray);">Corporate Email:</div>
          <div style="font-size: 1.15rem; font-weight: 800; color: var(--clr-gold); font-family: var(--font-cinzel);">info@henuhotel.com</div>
          <div style="font-size: 0.85rem; color: var(--clr-gray); margin-top: 10px;">Corporate Hotline / Calls:</div>
          <div style="font-size: 1.15rem; font-weight: 800; color: var(--clr-nile); font-family: var(--font-cinzel);">+20 112 345 6777</div>
        </div>
      </div>

      <div style="background: #FFFFFF; padding: 30px; border-radius: var(--radius); border: 1px solid var(--clr-sand-dark); box-shadow: var(--shadow);">
        <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 14px;">Send Business Inquiry</h3>
        <form action="mailto:info@henuhotel.com" method="post" enctype="text/plain" style="display: flex; flex-direction: column; gap: 12px;">
          <input type="text" placeholder="Company / Agency Name" required style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);">
          <input type="email" placeholder="Official Business Email" required style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);">
          <input type="tel" placeholder="Phone Number" required style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);">
          <textarea placeholder="Describe your group size, dates, or partnership proposal..." rows="4" required style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);"></textarea>
          <button type="submit" class="btn-henu-gold" style="width: 100%; justify-content: center;">Send to info@henuhotel.com</button>
        </form>
      </div>
    </div>
  </div>
</div>
<!-- /wp:html -->
`;

// ==========================================
// 6. PAGE 5: CAREERS (الوظائف)
// ==========================================
const careersContent = `
<!-- wp:html -->
${globalStyles}
<div class="henu-section" style="background: var(--clr-ivory); padding-top: 40px;">
  <div class="henu-container">
    <div style="text-align: center; margin-bottom: 40px;">
      <span class="henu-badge">Join Our Team</span>
      <h1 class="henu-title">Careers at <span>HENU Hotel</span></h1>
      <p class="henu-subtitle center">Join our hospitality family at the Pyramids. We are looking for talented, multilingual professionals.</p>
    </div>

    <div class="henu-grid-2">
      <div>
        <h3 style="font-family: var(--font-cinzel); font-size: 1.4rem; color: var(--clr-nile); margin-bottom: 14px;">Open Positions:</h3>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          <div style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid var(--clr-sand-dark);">
            <h4 style="font-weight: 700; color: var(--clr-nile);">Front Desk Receptionist (Multilingual)</h4>
            <p style="font-size: 0.85rem; color: var(--clr-gray);">English & Spanish/Italian/German speaking required.</p>
          </div>
          <div style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid var(--clr-sand-dark);">
            <h4 style="font-weight: 700; color: var(--clr-nile);">Aisha Roof Lounge Barista & Server</h4>
            <p style="font-size: 0.85rem; color: var(--clr-gray);">Experience in specialty coffee, mocktails, and guest service.</p>
          </div>
          <div style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid var(--clr-sand-dark);">
            <h4 style="font-weight: 700; color: var(--clr-nile);">Housekeeping & Maintenance Supervisor</h4>
            <p style="font-size: 0.85rem; color: var(--clr-gray);">Hospitality cleanliness & quality inspection standards.</p>
          </div>
        </div>
      </div>

      <div style="background: #FFFFFF; padding: 30px; border-radius: var(--radius); border: 1px solid var(--clr-sand-dark); box-shadow: var(--shadow);">
        <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 14px;">Apply for a Job</h3>
        <form action="mailto:info@henuhotel.com" method="post" enctype="text/plain" style="display: flex; flex-direction: column; gap: 12px;">
          <input type="text" placeholder="Full Name" required style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);">
          <input type="email" placeholder="Email Address" required style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);">
          <input type="tel" placeholder="Mobile Phone" required style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);">
          <input type="text" placeholder="Position Applying For" required style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);">
          <textarea placeholder="Tell us about your experience and languages spoken..." rows="3" required style="padding: 12px; border: 1px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);"></textarea>
          <button type="submit" class="btn-henu-gold" style="width: 100%; justify-content: center;">Submit Application</button>
        </form>
      </div>
    </div>
  </div>
</div>
<!-- /wp:html -->
`;

// ==========================================
// 7. PAGE 6: CONTACT & BOOKING (الحجز والتواصل)
// ==========================================
const contactContent = `
<!-- wp:html -->
${globalStyles}
<div class="henu-section" style="background: var(--clr-ivory); padding-top: 40px;" id="booking">
  <div class="henu-container">
    <div style="text-align: center; margin-bottom: 40px;">
      <span class="henu-badge">Contact & Booking</span>
      <h1 class="henu-title">Book Your Stay <span>Directly</span></h1>
      <p class="henu-subtitle center">Instant WhatsApp booking with best rate guarantee, 0% commission, and flexible payment upon arrival.</p>
    </div>

    <div class="henu-grid-2">
      <!-- Left: Interactive WhatsApp Booking Form -->
      <div style="background: #FFFFFF; padding: 32px; border-radius: var(--radius); border: 2px solid var(--clr-gold); box-shadow: var(--shadow);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 1.5rem;">💬</span>
          <h3 style="font-family: var(--font-cinzel); font-size: 1.4rem; color: var(--clr-nile);">Instant WhatsApp Booking</h3>
        </div>
        <p style="font-size: 0.88rem; color: var(--clr-gray); margin-bottom: 20px;">
          Direct Booking Number: <strong>01000925827</strong> (+20 100 092 5827)
        </p>

        <form id="wpBookingForm" onsubmit="event.preventDefault(); submitWhatsAppBooking();" style="display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--clr-nile); display: block; margin-bottom: 4px;">Select Room Category:</label>
            <select id="roomSelect" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat); font-weight: 600;">
              <option value="Single Standard ($12/night)">Single Standard Room — $12/night</option>
              <option value="Single Window ($15/night)">Single with Pyramids Window — $15/night</option>
              <option value="Single Balcony ($20/night)">Single with Private Balcony — $20/night</option>
              <option value="Double Standard ($18/night)">Double Standard Room — $18/night</option>
              <option value="Double Window ($22/night)">Double with Pyramids Window — $22/night</option>
              <option value="Double Balcony ($25/night)">Double with Private Balcony — $25/night</option>
              <option value="Triple Standard ($25/night)">Triple Family Room — $25/night</option>
              <option value="Triple Window ($30/night)">Triple with Pyramids Window — $30/night</option>
              <option value="Triple Balcony ($35/night)">Triple with Private Balcony — $35/night</option>
              <option value="Royal Suite ($45/night)">Royal King Suite Pyramids View — $45/night</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 700; color: var(--clr-nile); display: block; margin-bottom: 4px;">Check-in Date:</label>
              <input type="date" id="checkInDate" required style="width: 100%; padding: 10px; border: 1.5px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);">
            </div>
            <div>
              <label style="font-size: 0.85rem; font-weight: 700; color: var(--clr-nile); display: block; margin-bottom: 4px;">Check-out Date:</label>
              <input type="date" id="checkOutDate" required style="width: 100%; padding: 10px; border: 1.5px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 700; color: var(--clr-nile); display: block; margin-bottom: 4px;">Number of Guests:</label>
              <select id="guestCount" style="width: 100%; padding: 10px; border: 1.5px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);">
                <option value="1 Guest">1 Guest</option>
                <option value="2 Guests" selected>2 Guests</option>
                <option value="3 Guests">3 Guests</option>
                <option value="4+ Guests">4+ Guests (Family)</option>
              </select>
            </div>
            <div>
              <label style="font-size: 0.85rem; font-weight: 700; color: var(--clr-nile); display: block; margin-bottom: 4px;">Guest Name:</label>
              <input type="text" id="guestName" placeholder="Your Name" required style="width: 100%; padding: 10px; border: 1.5px solid #CBD5E1; border-radius: 6px; font-family: var(--font-montserrat);">
            </div>
          </div>

          <button type="submit" class="btn-henu-gold" style="width: 100%; justify-content: center; font-size: 1.05rem; padding: 16px;">
            📲 Book Now via WhatsApp (01000925827)
          </button>
        </form>

        <script>
        function submitWhatsAppBooking() {
          var room = document.getElementById('roomSelect').value;
          var inDate = document.getElementById('checkInDate').value;
          var outDate = document.getElementById('checkOutDate').value;
          var guests = document.getElementById('guestCount').value;
          var name = document.getElementById('guestName').value;

          var text = "Hello HENU Hotel! I would like to book a stay:%0A" +
                     "- Guest Name: " + encodeURIComponent(name) + "%0A" +
                     "- Room: " + encodeURIComponent(room) + "%0A" +
                     "- Check-in: " + encodeURIComponent(inDate) + "%0A" +
                     "- Check-out: " + encodeURIComponent(outDate) + "%0A" +
                     "- Guests: " + encodeURIComponent(guests);

          window.open("https://wa.me/201000925827?text=" + text, "_blank");
        }
        </script>
      </div>

      <!-- Right: Contact Cards & Location -->
      <div>
        <div style="background: #FFFFFF; padding: 24px; border-radius: var(--radius); border: 1px solid var(--clr-sand-dark); box-shadow: var(--shadow); margin-bottom: 20px;">
          <h3 style="font-family: var(--font-cinzel); font-size: 1.3rem; color: var(--clr-nile); margin-bottom: 14px;">Hotel Contact Details</h3>
          
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <div style="font-size: 0.75rem; color: var(--clr-gold); font-weight: 700; text-transform: uppercase;">Direct Booking WhatsApp Only:</div>
              <div style="font-size: 1.2rem; font-weight: 800; color: var(--clr-nile); font-family: var(--font-cinzel);">
                <a href="https://wa.me/201000925827" style="color: var(--clr-nile); text-decoration: none;">+20 100 092 5827</a>
              </div>
            </div>

            <div>
              <div style="font-size: 0.75rem; color: var(--clr-gray); font-weight: 700; text-transform: uppercase;">General Inquiries (WhatsApp & Calls):</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--clr-nile); font-family: var(--font-cinzel);">
                <a href="tel:+201123456777" style="color: var(--clr-nile); text-decoration: none;">+20 112 345 6777</a>
              </div>
            </div>

            <div>
              <div style="font-size: 0.75rem; color: var(--clr-gray); font-weight: 700; text-transform: uppercase;">Official Hotel Email:</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--clr-gold);">
                <a href="mailto:info@henuhotel.com" style="color: var(--clr-gold); text-decoration: none;">info@henuhotel.com</a>
              </div>
            </div>

            <div>
              <div style="font-size: 0.75rem; color: var(--clr-gray); font-weight: 700; text-transform: uppercase;">Address & Location:</div>
              <div style="font-size: 0.95rem; color: var(--clr-dark); font-weight: 600;">
                21 Gamal Abdel Nasser St., Nazlet El-Semman, Al Haram, Giza, Egypt
              </div>
            </div>
          </div>
        </div>

        <!-- Google Maps Direct Button -->
        <a href="https://maps.app.goo.gl/XMCE6e85VGvx7cBK9" target="_blank" class="btn-henu-gold" style="width: 100%; justify-content: center; background: var(--clr-nile);">
          📍 Open in Google Maps Navigation →
        </a>
      </div>
    </div>
  </div>
</div>
<!-- /wp:html -->
`;

// ==========================================
// 8. DEPLOYMENT SCRIPT VIA SSH
// ==========================================
const conn = new Client();

console.log('Connecting to WordPress to deploy all 6 pages...');

conn.on('ready', () => {
  // Save page contents temporarily on server and import via WP-CLI
  conn.sftp((err, sftp) => {
    if (err) throw err;

    function writeFile(remotePath, content) {
      return new Promise((resolve, reject) => {
        const stream = sftp.createWriteStream(remotePath);
        stream.write(content, 'utf8');
        stream.end();
        stream.on('finish', resolve);
        stream.on('error', reject);
      });
    }

    async function deploy() {
      const base = 'domains/henuhotel.com/public_html';
      
      await writeFile(`${base}/page_home.html`, homeContent);
      await writeFile(`${base}/page_accommodation.html`, accommodationContent);
      await writeFile(`${base}/page_experiences.html`, experiencesContent);
      await writeFile(`${base}/page_b2b.html`, b2bContent);
      await writeFile(`${base}/page_careers.html`, careersContent);
      await writeFile(`${base}/page_contact.html`, contactContent);

      const wpCmd = `
        cd ~/domains/henuhotel.com/public_html

        # Create or update Pages
        wp post create --post_type=page --post_title="Home" --post_name="home" --post_status="publish" --post_content="$(cat page_home.html)" --porcelain > /tmp/home_id.txt
        wp post create --post_type=page --post_title="Accommodation" --post_name="accommodation" --post_status="publish" --post_content="$(cat page_accommodation.html)" --porcelain > /tmp/acc_id.txt
        wp post create --post_type=page --post_title="Experiences" --post_name="experiences" --post_status="publish" --post_content="$(cat page_experiences.html)" --porcelain > /tmp/exp_id.txt
        wp post create --post_type=page --post_title="B2B Services" --post_name="b2b" --post_status="publish" --post_content="$(cat page_b2b.html)" --porcelain > /tmp/b2b_id.txt
        wp post create --post_type=page --post_title="Careers" --post_name="careers" --post_status="publish" --post_content="$(cat page_careers.html)" --porcelain > /tmp/car_id.txt
        wp post create --post_type=page --post_title="Contact & Booking" --post_name="contact" --post_status="publish" --post_content="$(cat page_contact.html)" --porcelain > /tmp/con_id.txt

        # Set Static Front Page
        HOME_ID=$(cat /tmp/home_id.txt)
        wp option update show_on_front 'page'
        wp option update page_on_front $HOME_ID

        # Clean up temp files
        rm -f page_*.html /tmp/*_id.txt

        # List all pages
        wp post list --post_type=page
      `;

      conn.exec(wpCmd, (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('data', d => out += d);
        stream.on('close', () => {
          console.log('=== WordPress Pages Created ===\n' + out);
          conn.end();
        });
      });
    }

    deploy().catch(e => {
      console.error('Deployment error:', e);
      conn.end();
    });
  });
}).connect({
  host: '89.117.169.80',
  port: 65002,
  username: 'u535479989',
  password: 'Koky@2026&1972'
});
