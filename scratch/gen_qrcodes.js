const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const outDir = 'd:/Henu/brochure/images';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function generateQRCodes() {
  const qrWhatsapp = path.join(outDir, 'qr_whatsapp.png');
  const qrWebsite = path.join(outDir, 'qr_website.png');
  const qrLocation = path.join(outDir, 'qr_location.png');

  // 1. WhatsApp QR Code (01000925827)
  await QRCode.toFile(qrWhatsapp, 'https://wa.me/201000925827?text=Hello%20HENU%20Hotel,%20I%20got%20your%20brochure%20and%20would%20like%20to%20inquire%20about%20booking.', {
    color: {
      dark: '#0B1B2B',
      light: '#FFFFFF'
    },
    width: 400,
    margin: 2
  });
  console.log('Generated WhatsApp QR Code:', qrWhatsapp);

  // 2. Website QR Code (henuhotel.com)
  await QRCode.toFile(qrWebsite, 'https://henuhotel.com', {
    color: {
      dark: '#0B1B2B',
      light: '#FFFFFF'
    },
    width: 400,
    margin: 2
  });
  console.log('Generated Website QR Code:', qrWebsite);

  // 3. Google Maps Location QR Code
  await QRCode.toFile(qrLocation, 'https://maps.app.goo.gl/XMCE6e85VGvx7cBK9', {
    color: {
      dark: '#0B1B2B',
      light: '#FFFFFF'
    },
    width: 400,
    margin: 2
  });
  console.log('Generated Location QR Code:', qrLocation);
}

generateQRCodes().catch(console.error);
