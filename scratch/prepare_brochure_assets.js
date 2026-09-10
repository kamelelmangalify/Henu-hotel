const fs = require('fs');
const path = require('path');

const bDir = 'd:/Henu/brochure/images';
if (!fs.existsSync(bDir)) {
  fs.mkdirSync(bDir, { recursive: true });
}

// Copy official logo
fs.copyFileSync('d:/Henu/03_Procurement_and_Orders/شعار_الفندق_عقود.jpg', path.join(bDir, 'hotel-logo.jpg'));

// Copy categorized website hotel images
const websiteImages = [
  'hero-pyramids-night.jpg',
  'hero-pyramids-sunset.jpg',
  'pyramids-terrace-night.jpg',
  'room-suite.jpg',
  'room-double-balcony.jpg',
  'room-double.jpg',
  'room-single.jpg',
  'room-window.jpg',
  'room-triple-window.jpg',
  'corridor-pharaoh.jpg',
  'corridor-vases.jpg',
  'lobby-mosaic.jpg',
  'bathroom-marble.jpg'
];

websiteImages.forEach(img => {
  const src = path.join('d:/Henu/website/images/hotel', img);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(bDir, img));
    console.log('Copied hotel photo:', img);
  }
});

console.log('All brochure assets prepared successfully!');
