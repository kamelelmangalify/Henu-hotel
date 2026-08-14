/* ============================================================
   LuxStay - Hotel Booking System
   JavaScript Application Logic
   ============================================================ */

'use strict';

// ============================================================
// DATA STORE
// ============================================================

const HOTELS_DATA = [
  {
    id: 1,
    name: "The Grand Monarch",
    city: "دبي",
    country: "الإمارات العربية المتحدة",
    stars: 5,
    rating: 9.4,
    ratingLabel: "استثنائي",
    priceFrom: 1850,
    image: "ext1.jpg",
    badge: "الأكثر طلباً",
    description: "تحفة معمارية في قلب دبي تطل على الخليج العربي بأبهى صوره. يجمع بين الرقي الشرقي والتصميم العصري في تناغم مثالي.",
    amenities: ["wifi","pool","spa","gym","restaurant","parking","bar","concierge"],
    amenityLabels: {"wifi":"📶 واي فاي","pool":"🏊 مسبح","spa":"💆 سبا","gym":"🏋️ صالة رياضية","restaurant":"🍽️ مطعم","parking":"🅿️ موقف","bar":"🍸 بار","concierge":"🛎️ خدمة الضيوف"},
    rooms: [
      { id: 101, name: "غرفة ديلوكس", price: 1850, desc: "إطلالة خلابة على الخليج، سرير كينج، حمام رخامي فاخر", capacity: 2, size: "45 م²", features: ["🛏️ كينج بيد","🛁 بانيو فاخر","🌊 إطلالة بحرية","❄️ إيركنديشن","📺 تلفاز ذكي"], img: "room_deluxe.jpg" },
      { id: 102, name: "جناح تنفيذي", price: 3200, desc: "صالة استقبال منفصلة، مكتب للعمل، إطلالة بانورامية", capacity: 2, size: "80 م²", features: ["🛏️ كينج بيد","🛋️ صالة منفصلة","🏙️ إطلالة بانورامية","🍾 ترحيب بالشمبانيا","💼 خدمة البتلر"], img: "room_suite.jpg" },
      { id: 103, name: "الجناح الملكي", price: 8500, desc: "قمة الفخامة مع مسبح خاص وخدمة بتلر على مدار الساعة", capacity: 4, size: "200 م²", features: ["🛏️ كينج بيد + غرفة إضافية","🏊 مسبح خاص","🔭 إطلالة 360°","🛎️ بتلر 24/7","🚗 سيارة خاصة"], img: "room_standard.jpg" }
    ]
  },
  {
    id: 2,
    name: "Rose Garden Palace",
    city: "باريس",
    country: "فرنسا",
    stars: 5,
    rating: 9.1,
    ratingLabel: "ممتاز",
    priceFrom: 2400,
    image: "ext2.jpg",
    badge: "جديد",
    description: "قصر أوروبي تاريخي في قلب باريس يجمع بين الأناقة الكلاسيكية والراحة الحديثة. على بُعد خطوات من برج إيفل.",
    amenities: ["wifi","restaurant","spa","concierge","bar","parking"],
    amenityLabels: {"wifi":"📶 واي فاي","restaurant":"🍽️ مطعم مشهور","spa":"💆 سبا","concierge":"🛎️ خدمة الضيوف","bar":"🍸 بار","parking":"🅿️ موقف"},
    rooms: [
      { id: 201, name: "غرفة سوبيريور", price: 2400, desc: "ديكور باريسي كلاسيكي مع إطلالة على حديقة الفندق", capacity: 2, size: "40 م²", features: ["🛏️ كينج بيد","🪞 مرايا أنتيك","🌹 ديكور كلاسيكي","☕ آلة قهوة نسبرسو","🛁 بانيو كلاسيكي"], img: "room_deluxe.jpg" },
      { id: 202, name: "جناح برج إيفل", price: 5500, desc: "إطلالة مباشرة على برج إيفل، جلسة رومانسية خاصة", capacity: 2, size: "90 م²", features: ["🛏️ كينج بيد","🗼 إطلالة برج إيفل","🛋️ جلسة خارجية","🍾 إفطار يومي","👑 خدمة VIP"], img: "room_suite.jpg" }
    ]
  },
  {
    id: 3,
    name: "Azure Horizon Resort",
    city: "المالديف",
    country: "جمهورية المالديف",
    stars: 5,
    rating: 9.7,
    ratingLabel: "خيالي",
    priceFrom: 4200,
    image: "ext3.jpg",
    badge: "No.1",
    description: "جنة استوائية في أرخبيل المالديف. فيلات مائية بمسابح خاصة وإطلالة على المحيط الهندي الصافي.",
    amenities: ["wifi","pool","spa","gym","restaurant","bar"],
    amenityLabels: {"wifi":"📶 واي فاي","pool":"🏊 مسبح","spa":"💆 سبا","gym":"🏋️ صالة","restaurant":"🍽️ مطعم","bar":"🍹 بار الشاطئ"},
    rooms: [
      { id: 301, name: "فيلا مائية", price: 4200, desc: "فيلا فوق الماء مع مسبح خاص وسلم مباشر للبحر", capacity: 2, size: "120 م²", features: ["🛏️ كينج بيد","🏊 مسبح خاص","🌊 سلم للبحر","🐠 رؤية تحت الماء","🌅 أرضية زجاجية"], img: "room_suite.jpg" },
      { id: 302, name: "فيلا شاطئية", price: 5800, desc: "فيلا مستقلة على الشاطئ الخاص مع حديقة استوائية", capacity: 4, size: "180 م²", features: ["🛏️ كينج بيد + سرير إضافي","🏖️ شاطئ خاص","🌴 حديقة استوائية","🏊 مسبح خاص","🚤 قارب رياضي"], img: "room_deluxe.jpg" }
    ]
  },
  {
    id: 4,
    name: "Sakura Imperial Hotel",
    city: "طوكيو",
    country: "اليابان",
    stars: 5,
    rating: 9.2,
    ratingLabel: "استثنائي",
    priceFrom: 1600,
    image: "ext1.jpg",
    badge: null,
    description: "تجربة يابانية أصيلة في أحدث مبنى فندقي في طوكيو. يمزج بين التراث الياباني الأصيل والتكنولوجيا المتقدمة.",
    amenities: ["wifi","spa","restaurant","gym","concierge"],
    amenityLabels: {"wifi":"📶 واي فاي","spa":"🛁 حمامات يابانية","restaurant":"🍣 مطعم سوشي","gym":"🥋 دوجو رياضي","concierge":"🎎 خدمة الضيوف"},
    rooms: [
      { id: 401, name: "غرفة سيتي فيو", price: 1600, desc: "إطلالة على أفق طوكيو مع ديكور ياباني تقليدي", capacity: 2, size: "35 م²", features: ["🛏️ كينج بيد","🗾 إطلالة المدينة","🍵 طقم الشاي","🛁 أونسن خاص","🎌 ديكور ياباني"], img: "room_deluxe.jpg" },
      { id: 402, name: "جناح فوجي", price: 3800, desc: "جناح بانورامي مع إطلالة على جبل فوجي في الأيام الصافية", capacity: 2, size: "100 م²", features: ["🛏️ كينج بيد","🗻 إطلالة فوجي","🛋️ صالة يابانية","🍶 ساكي ترحيبي","🧖 جلسة أونسن"], img: "room_suite.jpg" }
    ]
  },
  {
    id: 5,
    name: "Al Faisaliah Luxury",
    city: "الرياض",
    country: "المملكة العربية السعودية",
    stars: 5,
    rating: 8.9,
    ratingLabel: "ممتاز",
    priceFrom: 1200,
    image: "ext2.jpg",
    badge: "مميز",
    description: "رمز الفخامة في قلب الرياض. برج أيقوني يضم أرقى الغرف والأجنحة مع إطلالات بانورامية على العاصمة.",
    amenities: ["wifi","pool","spa","gym","restaurant","parking","concierge"],
    amenityLabels: {"wifi":"📶 واي فاي","pool":"🏊 مسبح","spa":"💆 سبا","gym":"🏋️ صالة رياضية","restaurant":"🍽️ مطعم","parking":"🅿️ موقف","concierge":"🛎️ خدمة الضيوف"},
    rooms: [
      { id: 501, name: "غرفة ديلوكس", price: 1200, desc: "إطلالة على أفق الرياض مع كل وسائل الراحة العصرية", capacity: 2, size: "50 م²", features: ["🛏️ كينج بيد","🏙️ إطلالة الرياض","☕ ميني بار مجاني","📺 تلفاز 65 بوصة","🛁 بانيو فاخر"], img: "room_deluxe.jpg" },
      { id: 502, name: "جناح الفيصلية", price: 2800, desc: "جناح فاخر مع غرفة معيشة وغرفة طعام خاصة", capacity: 4, size: "150 م²", features: ["🛏️ كينج بيد + تونين","🛋️ غرفة معيشة","🍽️ غرفة طعام","👨‍🍳 شيف خاص (طلب)","🚗 ليموزين"], img: "room_suite.jpg" }
    ]
  },
  {
    id: 6,
    name: "Santorini Blue Retreat",
    city: "سانتوريني",
    country: "اليونان",
    stars: 4,
    rating: 9.0,
    ratingLabel: "رائع",
    priceFrom: 980,
    image: "ext3.jpg",
    badge: "الأفضل قيمة",
    description: "واحة الرومانسية في جزيرة سانتوريني الساحرة. مبانٍ بيضاء بقباب زرقاء مع مسبح لا نهائي يطل على بحر إيجه.",
    amenities: ["wifi","pool","restaurant","bar","spa"],
    amenityLabels: {"wifi":"📶 واي فاي","pool":"🏊 إنفينيتي بول","restaurant":"🍷 مطعم","bar":"🍸 بار","spa":"💆 سبا"},
    rooms: [
      { id: 601, name: "غرفة كيكلادس", price: 980, desc: "الديكور اليوناني الكلاسيكي مع إطلالة على القباب الزرقاء", capacity: 2, size: "30 م²", features: ["🛏️ كينج بيد","🏛️ معماريا يوناني","🍋 إفطار إيجه","🌅 إطلالة غروب","🛁 جاكوزي"], img: "room_standard.jpg" },
      { id: 602, name: "فيلا الغروب", price: 2200, desc: "فيلا مستقلة مع مسبح خاص وأجمل غروب في العالم", capacity: 2, size: "80 م²", features: ["🛏️ كينج بيد","🏊 مسبح خاص","🌄 أفضل منظر للغروب","🍾 شمبانيا","🌙 عشاء رومانسي"], img: "room_suite.jpg" }
    ]
  }
];

// ============================================================
// APP STATE
// ============================================================
let state = {
  currentPage: 'home',
  user: null,
  bookings: JSON.parse(localStorage.getItem('luxstay_bookings') || '[]'),
  filteredHotels: [...HOTELS_DATA],
  selectedHotel: null,
  selectedRoom: null,
};

// ============================================================
// INITIALIZE
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  setMinDates();
  renderFeaturedHotels();
  renderHotelsList(HOTELS_DATA);
  renderBookings();
  setupNavbarScroll();
  setupSearchDefaults();
});

function setupSearchDefaults() {
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);
  const fmt = d => d.toISOString().split('T')[0];
  document.getElementById('searchCheckin').value = fmt(tomorrow);
  document.getElementById('searchCheckout').value = fmt(nextWeek);
}

function setMinDates() {
  const fmt = d => d.toISOString().split('T')[0];
  const today = fmt(new Date());
  ['searchCheckin','searchCheckout','bookCheckin','bookCheckout'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.min = today;
  });
}

function setupNavbarScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(name + 'Page').classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('onclick')?.includes(name));
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  state.currentPage = name;
  if (name === 'bookings') renderBookings();
  if (name === 'hotels') { filterHotels(); }
}

// ============================================================
// SEARCH
// ============================================================
function doSearch() {
  const dest = document.getElementById('searchDestination').value.trim();
  showPage('hotels');
  if (dest) {
    document.getElementById('filterCity').value = dest;
    filterHotels();
    showToast(`🔍 نتائج البحث عن: ${dest}`, 'success');
  }
}

// ============================================================
// HOTEL RENDERING
// ============================================================
function renderFeaturedHotels() {
  const container = document.getElementById('featuredHotels');
  const featured = HOTELS_DATA.slice(0, 3);
  container.innerHTML = featured.map(h => hotelCardHTML(h)).join('');
}

function hotelCardHTML(hotel) {
  const imgMap = { 1:'ext1.jpg', 2:'ext2.jpg', 3:'ext3.jpg', 4:'ext1.jpg', 5:'ext2.jpg', 6:'ext3.jpg' };
  const img = imgMap[hotel.id] || 'ext1.jpg';
  const stars = '⭐'.repeat(hotel.stars);
  const amenitiesTop = Object.entries(hotel.amenityLabels).slice(0, 3).map(([,v]) => `<span class="amenity-tag">${v}</span>`).join('');
  const badge = hotel.badge ? `<span class="hotel-badge">${hotel.badge}</span>` : '';
  return `
    <div class="hotel-card" onclick="openHotelDetail(${hotel.id})">
      <div class="hotel-card-img-wrapper">
        <img src="${img}" alt="${hotel.name}" class="hotel-card-img" loading="lazy" />
        ${badge}
      </div>
      <div class="hotel-card-body">
        <div class="hotel-card-stars">${stars}</div>
        <div class="hotel-card-name">${hotel.name}</div>
        <div class="hotel-card-location">📍 ${hotel.city}، ${hotel.country}</div>
        <div class="hotel-card-amenities">${amenitiesTop}</div>
        <div class="hotel-card-footer">
          <div class="hotel-price">
            <span class="price-from">يبدأ من</span>
            <span class="price-amount">${hotel.priceFrom.toLocaleString('ar-SA')} ريال</span>
            <span class="price-night">/ الليلة</span>
          </div>
          <div class="hotel-rating">
            <span class="rating-score">${hotel.rating}</span>
            <span class="rating-label">${hotel.ratingLabel}</span>
          </div>
        </div>
      </div>
    </div>`;
}

// ============================================================
// FILTER HOTELS
// ============================================================
function filterHotels() {
  const city = (document.getElementById('filterCity')?.value || '').toLowerCase();
  const maxPrice = parseInt(document.getElementById('priceRange')?.value || 9999);
  const starChecks = [...document.querySelectorAll('.star-check input:checked')].map(i => parseInt(i.value));
  const amenityChecks = [...document.querySelectorAll('.amenity-check input:checked')].map(i => i.value);
  const sort = document.getElementById('sortSelect')?.value || 'rating';

  let filtered = HOTELS_DATA.filter(h => {
    if (city && !h.city.toLowerCase().includes(city) && !h.country.toLowerCase().includes(city) && !h.name.toLowerCase().includes(city)) return false;
    if (h.priceFrom > maxPrice) return false;
    if (starChecks.length && !starChecks.includes(h.stars)) return false;
    if (amenityChecks.length && !amenityChecks.every(a => h.amenities.includes(a))) return false;
    return true;
  });

  if (sort === 'rating') filtered.sort((a,b) => b.rating - a.rating);
  else if (sort === 'price-asc') filtered.sort((a,b) => a.priceFrom - b.priceFrom);
  else if (sort === 'price-desc') filtered.sort((a,b) => b.priceFrom - a.priceFrom);
  else if (sort === 'name') filtered.sort((a,b) => a.name.localeCompare(b.name));

  state.filteredHotels = filtered;
  renderHotelsList(filtered);
}

function renderHotelsList(hotels) {
  const container = document.getElementById('hotelsList');
  const count = document.getElementById('resultsCount');
  if (!container) return;
  count.textContent = `${hotels.length} فندق متاح`;
  if (!hotels.length) {
    container.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-secondary)">
      <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
      <p>لا توجد نتائج مطابقة. حاول تعديل معايير البحث.</p>
    </div>`;
    return;
  }
  const imgMap = { 1:'ext1.jpg', 2:'ext2.jpg', 3:'ext3.jpg', 4:'ext1.jpg', 5:'ext2.jpg', 6:'ext3.jpg' };
  container.innerHTML = hotels.map(h => {
    const img = imgMap[h.id] || 'ext1.jpg';
    const stars = '⭐'.repeat(h.stars);
    const amenities = Object.values(h.amenityLabels).slice(0, 4).map(v => `<span class="amenity-tag">${v}</span>`).join('');
    return `
      <div class="hotel-list-card" onclick="openHotelDetail(${h.id})">
        <div style="overflow:hidden">
          <img src="${img}" alt="${h.name}" class="hotel-list-img" loading="lazy" />
        </div>
        <div class="hotel-list-body">
          <div>
            <div class="hotel-list-header">
              <div>
                <div class="hotel-list-stars">${stars}</div>
                <div class="hotel-list-name">${h.name}</div>
                <div style="font-size:.85rem;color:var(--text-secondary);margin-top:.2rem">📍 ${h.city}، ${h.country}</div>
              </div>
              <div class="hotel-rating">
                <span class="rating-score">${h.rating}</span>
                <span class="rating-label">${h.ratingLabel}</span>
              </div>
            </div>
            <p class="hotel-list-desc">${h.description}</p>
            <div class="hotel-list-amenities">${amenities}</div>
          </div>
          <div class="hotel-list-footer">
            <div class="hotel-price">
              <span class="price-from">يبدأ من</span>
              <span class="price-amount">${h.priceFrom.toLocaleString('ar-SA')} ريال</span>
              <span class="price-night">/ الليلة</span>
            </div>
            <button class="btn-primary" onclick="event.stopPropagation(); openHotelDetail(${h.id})">عرض التفاصيل</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function updatePriceLabel() {
  const val = document.getElementById('priceRange').value;
  document.getElementById('priceLabel').textContent = `حتى ${parseInt(val).toLocaleString('ar-SA')} ريال`;
}

function resetFilters() {
  document.getElementById('filterCity').value = '';
  document.getElementById('priceRange').value = 5000;
  document.getElementById('priceLabel').textContent = 'حتى 5,000 ريال';
  document.querySelectorAll('.star-check input, .amenity-check input').forEach(i => i.checked = false);
  filterHotels();
  showToast('✨ تم إعادة تعيين الفلاتر', 'success');
}

// ============================================================
// HOTEL DETAIL
// ============================================================
function openHotelDetail(hotelId) {
  const hotel = HOTELS_DATA.find(h => h.id === hotelId);
  if (!hotel) return;
  state.selectedHotel = hotel;
  const imgMap = { 1:'ext1.jpg', 2:'ext2.jpg', 3:'ext3.jpg', 4:'ext1.jpg', 5:'ext2.jpg', 6:'ext3.jpg' };
  const img = imgMap[hotel.id] || 'ext1.jpg';
  const roomImgs = { 'room_deluxe.jpg':'room_deluxe.jpg', 'room_suite.jpg':'room_suite.jpg', 'room_standard.jpg':'room_standard.jpg' };

  const roomsHTML = hotel.rooms.map(room => `
    <div class="room-card">
      <img src="${room.img}" alt="${room.name}" />
      <div>
        <div class="room-card-name">${room.name}</div>
        <div class="room-card-desc">${room.desc}</div>
        <div style="font-size:.8rem;color:var(--text-muted);margin-bottom:.75rem">👥 يتسع لـ ${room.capacity} | 📐 ${room.size}</div>
        <div class="room-card-features">${room.features.map(f => `<span class="room-feature">${f}</span>`).join('')}</div>
      </div>
      <div class="room-price-box">
        <span class="price-amount">${room.price.toLocaleString('ar-SA')}</span>
        <span class="price-night">ريال / الليلة</span>
        <button class="btn-primary" onclick="openBookingModal(${hotel.id}, ${room.id})">احجز الآن</button>
      </div>
    </div>`).join('');

  const amenitiesHTML = Object.values(hotel.amenityLabels).map(a =>
    `<div class="amenity-detail-item">${a}</div>`).join('');

  document.getElementById('hotelDetailContent').innerHTML = `
    <div class="hotel-detail-hero">
      <img src="${img}" alt="${hotel.name}" />
      <div class="hotel-detail-hero-content">
        <div style="max-width:1280px;margin:0 auto;padding:0 2rem">
          <div style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:1rem">
            <div>
              <div style="color:var(--gold);font-size:1.2rem;margin-bottom:.5rem">${'⭐'.repeat(hotel.stars)}</div>
              <h1 style="font-size:2.5rem;font-weight:900;margin-bottom:.5rem">${hotel.name}</h1>
              <p style="color:var(--text-secondary)">📍 ${hotel.city}، ${hotel.country}</p>
            </div>
            <div style="display:flex;align-items:center;gap:1.5rem">
              <div class="hotel-rating" style="padding:.75rem 1.25rem">
                <span class="rating-score" style="font-size:1.5rem">${hotel.rating}</span>
                <span class="rating-label" style="font-size:.9rem">${hotel.ratingLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hotel-detail-content" style="padding-bottom:4rem">
      <div style="margin-bottom:1.5rem;padding-top:1.5rem">
        <button class="btn-ghost" onclick="showPage('hotels')" style="font-size:.85rem">← العودة للفنادق</button>
      </div>
      <div class="hotel-detail-layout">
        <div>
          <div class="detail-section">
            <h2>عن الفندق</h2>
            <p style="color:var(--text-secondary);line-height:1.9;font-size:1rem">${hotel.description}</p>
          </div>
          <div class="detail-section">
            <h2>المرافق والخدمات</h2>
            <div class="amenities-detail-grid">${amenitiesHTML}</div>
          </div>
          <div class="detail-section">
            <h2>الغرف المتاحة</h2>
            <div class="rooms-grid">${roomsHTML}</div>
          </div>
        </div>
        <div class="booking-sidebar">
          <div class="booking-sidebar-card glass-card">
            <h3>احجز إقامتك</h3>
            <span class="sidebar-price">من ${hotel.priceFrom.toLocaleString('ar-SA')} ريال/ليلة</span>
            <div class="sidebar-form">
              <div>
                <label>تاريخ الوصول</label>
                <input type="date" id="sidebarCheckin" min="${new Date().toISOString().split('T')[0]}" />
              </div>
              <div>
                <label>تاريخ المغادرة</label>
                <input type="date" id="sidebarCheckout" min="${new Date().toISOString().split('T')[0]}" />
              </div>
              <div>
                <label>عدد الضيوف</label>
                <select id="sidebarGuests"><option>1 ضيف</option><option selected>2 ضيوف</option><option>3 ضيوف</option><option>4 ضيوف</option></select>
              </div>
              <hr class="sidebar-divider" />
              <div style="text-align:center;color:var(--text-secondary);font-size:.85rem">اختر غرفتك من القائمة أدناه</div>
              ${hotel.rooms.map(r => `
                <button class="btn-outline" style="display:flex;justify-content:space-between;align-items:center;text-align:right;padding:.75rem 1rem" onclick="openBookingModal(${hotel.id}, ${r.id})">
                  <span>${r.name}</span>
                  <span style="color:var(--gold);font-weight:800">${r.price.toLocaleString('ar-SA')} ريال</span>
                </button>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`;

  showPage('hotelDetail');
}

// ============================================================
// BOOKING MODAL
// ============================================================
function openBookingModal(hotelId, roomId) {
  const hotel = HOTELS_DATA.find(h => h.id === hotelId);
  const room = hotel?.rooms.find(r => r.id === roomId);
  if (!hotel || !room) return;
  state.selectedHotel = hotel;
  state.selectedRoom = room;

  document.getElementById('bookingModalSubtitle').textContent = `${hotel.name} – ${room.name}`;

  const imgMap = { 1:'ext1.jpg', 2:'ext2.jpg', 3:'ext3.jpg', 4:'ext1.jpg', 5:'ext2.jpg', 6:'ext3.jpg' };

  document.getElementById('bookingSummaryContent').innerHTML = `
    <img src="${imgMap[hotel.id]}" alt="${hotel.name}" style="width:100%;height:160px;object-fit:cover;border-radius:12px;margin-bottom:1rem" />
    <div class="booking-summary-item"><span>الفندق</span><span>${hotel.name}</span></div>
    <div class="booking-summary-item"><span>الموقع</span><span>📍 ${hotel.city}</span></div>
    <div class="booking-summary-item"><span>التقييم</span><span>⭐ ${hotel.rating} ${hotel.ratingLabel}</span></div>
    <div class="booking-summary-item"><span>نوع الغرفة</span><span>${room.name}</span></div>
    <div class="booking-summary-item"><span>المساحة</span><span>${room.size}</span></div>
    <div class="booking-summary-item"><span>الطاقة الاستيعابية</span><span>${room.capacity} أشخاص</span></div>
  `;

  // Set default dates
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);
  const fmt = d => d.toISOString().split('T')[0];
  document.getElementById('bookCheckin').value = fmt(tomorrow);
  document.getElementById('bookCheckout').value = fmt(nextWeek);

  document.getElementById('totalRoomPrice').textContent = `${room.price.toLocaleString('ar-SA')} ريال`;
  updateBookingTotal();
  openModal('bookingModal');
}

function updateBookingTotal() {
  const checkin = document.getElementById('bookCheckin')?.value;
  const checkout = document.getElementById('bookCheckout')?.value;
  if (!checkin || !checkout || !state.selectedRoom) return;

  const nights = Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / (1000*60*60*24)));
  const roomPrice = state.selectedRoom.price;
  const subtotal = roomPrice * nights;
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  document.getElementById('totalNights').textContent = `${nights} ليلة`;
  document.getElementById('totalTax').textContent = `${tax.toLocaleString('ar-SA', {maximumFractionDigits:0})} ريال`;
  document.getElementById('totalAmount').textContent = `${total.toLocaleString('ar-SA', {maximumFractionDigits:0})} ريال`;
}

function selectPayment(type, id) {
  document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('cardFields').style.display = type === 'card' ? 'block' : 'none';
}

function formatCard(input) {
  let val = input.value.replace(/\D/g,'').substring(0, 16);
  input.value = val.replace(/(.{4})/g,'$1 ').trim();
}

// ============================================================
// CONFIRM BOOKING
// ============================================================
function confirmBooking(e) {
  e.preventDefault();
  const checkin = document.getElementById('bookCheckin').value;
  const checkout = document.getElementById('bookCheckout').value;
  const firstName = document.getElementById('guestFirstName').value;
  const lastName = document.getElementById('guestLastName').value;
  const email = document.getElementById('guestEmail').value;
  const phone = document.getElementById('guestPhone').value;
  const special = document.getElementById('specialRequests').value;

  if (!checkin || !checkout || new Date(checkout) <= new Date(checkin)) {
    showToast('⚠️ يرجى اختيار تواريخ صحيحة', 'error');
    return;
  }

  const nights = Math.round((new Date(checkout) - new Date(checkin)) / (1000*60*60*24));
  const subtotal = state.selectedRoom.price * nights;
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const booking = {
    id: 'LX' + Date.now().toString().slice(-8),
    hotelId: state.selectedHotel.id,
    hotelName: state.selectedHotel.name,
    hotelCity: state.selectedHotel.city,
    hotelCountry: state.selectedHotel.country,
    roomName: state.selectedRoom.name,
    roomPrice: state.selectedRoom.price,
    checkin,
    checkout,
    nights,
    guests: document.getElementById('bookGuests').value,
    guestName: `${firstName} ${lastName}`,
    email,
    phone,
    special,
    totalAmount: Math.round(total),
    status: 'confirmed',
    bookedAt: new Date().toISOString(),
    imgId: state.selectedHotel.id,
  };

  state.bookings.unshift(booking);
  localStorage.setItem('luxstay_bookings', JSON.stringify(state.bookings));

  closeModal('bookingModal');

  document.getElementById('successMessage').textContent =
    `شكراً ${firstName}! سيتم إرسال تفاصيل حجزك إلى ${email}`;
  document.getElementById('successBookingRef').textContent = `رقم الحجز: ${booking.id}`;
  openModal('successModal');
  renderBookings();
}

// ============================================================
// BOOKINGS PAGE
// ============================================================
function renderBookings() {
  const container = document.getElementById('bookingsList');
  if (!container) return;
  const bookings = state.bookings;

  if (!bookings.length) {
    container.innerHTML = `
      <div class="bookings-empty">
        <div class="empty-icon">🏨</div>
        <h2>لا توجد حجوزات بعد</h2>
        <p style="margin-bottom:2rem">ابدأ رحلتك الآن واحجز في أفخم الفنادق حول العالم</p>
        <button class="btn-primary btn-large" onclick="showPage('hotels')">استكشف الفنادق</button>
      </div>`;
    return;
  }

  const imgMap = { 1:'ext1.jpg', 2:'ext2.jpg', 3:'ext3.jpg', 4:'ext1.jpg', 5:'ext2.jpg', 6:'ext3.jpg' };

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;flex-wrap:wrap;gap:1rem">
      <h2>${bookings.length} حجز</h2>
      <div style="display:flex;gap:.75rem">
        <button class="btn-outline" onclick="showPage('hotels')">+ حجز جديد</button>
      </div>
    </div>
    ${bookings.map(b => {
      const img = imgMap[b.imgId] || 'ext1.jpg';
      const checkinDate = new Date(b.checkin).toLocaleDateString('ar-SA', {year:'numeric',month:'long',day:'numeric'});
      const checkoutDate = new Date(b.checkout).toLocaleDateString('ar-SA', {year:'numeric',month:'long',day:'numeric'});
      return `
        <div class="booking-item">
          <img src="${img}" alt="${b.hotelName}" />
          <div>
            <div class="booking-hotel-name">${b.hotelName}</div>
            <div style="color:var(--text-secondary);font-size:.85rem;margin-bottom:.5rem">📍 ${b.hotelCity}، ${b.hotelCountry} | ${b.roomName}</div>
            <div class="booking-dates">📅 ${checkinDate} → ${checkoutDate} (${b.nights} ليالٍ)</div>
            <div style="font-size:.85rem;color:var(--text-secondary);margin-bottom:.25rem">👤 ${b.guestName} | ${b.guests}</div>
            <div class="booking-ref-text">رقم الحجز: <strong style="color:var(--gold);font-family:monospace">${b.id}</strong></div>
          </div>
          <div class="booking-status-box">
            <span class="status-badge ${b.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}">
              ${b.status === 'confirmed' ? '✅ مؤكد' : '⏳ قيد المعالجة'}
            </span>
            <span class="booking-total-price">${b.totalAmount.toLocaleString('ar-SA')} ريال</span>
            <button class="btn-cancel" onclick="cancelBooking('${b.id}')">إلغاء الحجز</button>
          </div>
        </div>`;
    }).join('')}`;
}

function cancelBooking(bookingId) {
  if (!confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟')) return;
  state.bookings = state.bookings.filter(b => b.id !== bookingId);
  localStorage.setItem('luxstay_bookings', JSON.stringify(state.bookings));
  renderBookings();
  showToast('🗑️ تم إلغاء الحجز بنجاح', 'success');
}

// ============================================================
// AUTH (DEMO)
// ============================================================
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  state.user = { email, name: email.split('@')[0] };
  closeModal('loginModal');
  showToast(`✅ مرحباً بك، ${state.user.name}!`, 'success');
  document.getElementById('loginBtn').textContent = `👤 ${state.user.name}`;
}

function handleRegister(e) {
  e.preventDefault();
  const first = document.getElementById('regFirstName').value;
  const last = document.getElementById('regLastName').value;
  const email = document.getElementById('regEmail').value;
  state.user = { email, name: `${first} ${last}` };
  closeModal('registerModal');
  showToast(`🎉 تم إنشاء حسابك بنجاح، ${first}!`, 'success');
  document.getElementById('loginBtn').textContent = `👤 ${first}`;
}

// ============================================================
// MODAL MANAGEMENT
// ============================================================
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

// ============================================================
// MOBILE MENU
// ============================================================
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
let toastTimeout;
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.className = 'toast', 3500);
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});
