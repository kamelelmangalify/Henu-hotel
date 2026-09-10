const path = require('path');
const nodeModulesPath = path.resolve(__dirname, '../../../node_modules');

const { initializeApp } = require(path.join(nodeModulesPath, 'firebase/app'));
const { getFirestore, doc, setDoc } = require(path.join(nodeModulesPath, 'firebase/firestore'));
const db = require('./db_engine');

const firebaseConfig = {
  apiKey: "AIzaSyCcVHlZHHvHSHFsLagU6haJWZxCgxS_PUs",
  authDomain: "henu-pyramids-hotel.firebaseapp.com",
  projectId: "henu-pyramids-hotel",
  storageBucket: "henu-pyramids-hotel.firebasestorage.app",
  messagingSenderId: "310013988556",
  appId: "1:310013988556:web:fce3c2bcc1c04bbefdfc69",
  measurementId: "G-ZTY00XXTC8"
};

async function syncToFirebase() {
  console.log('======================================================');
  console.log('☁️  HENU HOTEL - FIREBASE CLOUD SYNC ENGINE');
  console.log('======================================================');
  console.log('Connecting to Firebase Project: henu-pyramids-hotel...');

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);

  const profile = db.getProfile();
  const categories = db.getCategories();
  const rooms = db.getRooms();
  const seasons = db.getSeasons();
  const occRules = db.getOccupancyRules();

  console.log(`[1/4] Syncing Hotel Profile: "${profile.hotel_name_ar}"...`);
  await setDoc(doc(firestore, 'hotel_metadata', 'profile'), profile);
  console.log('✅ Profile synced successfully!');

  console.log(`[2/4] Syncing ${categories.length} Room Categories...`);
  for (const cat of categories) {
    await setDoc(doc(firestore, 'room_categories', cat.code), cat);
  }
  console.log('✅ Room categories synced successfully!');

  console.log(`[3/4] Syncing ${rooms.length} Rooms Inventory (Accurate Views & Numbers)...`);
  for (const room of rooms) {
    await setDoc(doc(firestore, 'rooms_inventory', String(room.room_num)), room);
  }
  console.log('✅ All 25 rooms synced successfully!');

  console.log('[4/4] Syncing Pricing Config & October Seasonal Rules...');
  await setDoc(doc(firestore, 'pricing_config', 'seasons'), { seasons });
  await setDoc(doc(firestore, 'pricing_config', 'occupancy_rules'), { occupancy_rules: occRules });
  console.log('✅ Dynamic pricing rules synced successfully!');

  console.log('======================================================');
  console.log('🎉 SUCCESS: All Henu Hotel Data is now LIVE on Firebase!');
  console.log('======================================================');
  process.exit(0);
}

if (require.main === module) {
  syncToFirebase().catch(err => {
    console.error('❌ Firebase Sync Error:', err.message);
    if (err.code) {
      console.error('Code:', err.code);
    }
    process.exit(1);
  });
}

module.exports = syncToFirebase;
