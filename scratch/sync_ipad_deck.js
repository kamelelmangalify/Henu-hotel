const fs = require('fs');
const path = require('path');

const src = path.join('d:', 'Henu', '05_Tourist_Attractions_App', 'ipad_presentation_local.html');
const dst = path.join('d:', 'Henu', '05_Tourist_Attractions_App', 'index.html');

fs.copyFileSync(src, dst);
console.log('✅ Synchronized ipad_presentation_local.html -> index.html');
