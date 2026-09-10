const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const db = require('./db_engine');

// 100% relative path: works from any drive or folder
const EXCEL_PATH = path.resolve(__dirname, '../../01_Hotel_Data_Workspace/01_Excel_Templates/Master_Hotel_Setup.xlsx');

async function importHotelExcel() {
  console.log('====================================================');
  console.log('🏨 HENU SMART HOTEL - EXCEL DATA IMPORTER & SEEDER');
  console.log('====================================================');
  console.log(`📂 Reading Excel from: ${EXCEL_PATH}`);

  if (!fs.existsSync(EXCEL_PATH)) {
    console.error(`❌ Error: Master Excel file not found at: ${EXCEL_PATH}`);
    console.error('Please ensure Master_Hotel_Setup.xlsx exists in 01_Hotel_Data_Workspace/01_Excel_Templates/');
    process.exit(1);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(EXCEL_PATH);

  const newDBData = db.getDefaultSchema();

  // ----------------------------------------------------
  // 1. IMPORT HOTEL PROFILE
  // ----------------------------------------------------
  const sProfile = workbook.getWorksheet('01_Hotel_Profile');
  if (sProfile) {
    sProfile.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const key = row.getCell(1).text ? row.getCell(1).text.trim() : null;
        let val = row.getCell(3).value;

        if (key && val !== undefined && val !== null) {
          // Clean rich text or formula if any
          if (typeof val === 'object' && val.result !== undefined) {
            val = val.result;
          }
          if (typeof val === 'object' && val.text) {
            val = val.text;
          }
          newDBData.profile[key] = val;
        }
      }
    });
    console.log(`✅ [1/5] Hotel Profile Imported: "${newDBData.profile.hotel_name_ar || 'Henu Hotel'}"`);
  }

  // ----------------------------------------------------
  // 2. IMPORT ROOM CATEGORIES
  // ----------------------------------------------------
  const sCategories = workbook.getWorksheet('02_Room_Categories');
  if (sCategories) {
    sCategories.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const code = row.getCell(1).text ? row.getCell(1).text.trim() : null;
        const name_ar = row.getCell(2).text ? row.getCell(2).text.trim() : '';
        const name_en = row.getCell(3).text ? row.getCell(3).text.trim() : '';
        const capacity = Number(row.getCell(4).value) || 2;
        const beds = row.getCell(5).text ? row.getCell(5).text.trim() : '';
        const base_usd = Number(row.getCell(6).value) || 0;
        const base_egp = Number(row.getCell(7).value) || 0;
        const amenities = row.getCell(8).text ? row.getCell(8).text.trim() : '';

        if (code) {
          newDBData.categories.push({
            code,
            name_ar,
            name_en,
            capacity,
            beds,
            base_usd,
            base_egp,
            amenities
          });
        }
      }
    });
    console.log(`✅ [2/5] Room Categories Imported: ${newDBData.categories.length} categories defined`);
  }

  const categoryCodes = new Set(newDBData.categories.map(c => c.code));

  // ----------------------------------------------------
  // 3. IMPORT ROOMS INVENTORY
  // ----------------------------------------------------
  const sRooms = workbook.getWorksheet('03_Rooms_Inventory');
  const seenRooms = new Set();
  let duplicateErrors = 0;

  if (sRooms) {
    sRooms.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const room_num = row.getCell(1).text ? row.getCell(1).text.trim() : null;
        const floor = row.getCell(2).text ? row.getCell(2).text.trim() : '';
        const category_code = row.getCell(3).text ? row.getCell(3).text.trim() : '';
        const view_desc = row.getCell(4).text ? row.getCell(4).text.trim() : '';
        const status = row.getCell(5).text ? row.getCell(5).text.trim() : 'متاحة';
        const notes = row.getCell(6).text ? row.getCell(6).text.trim() : '';

        if (room_num) {
          if (seenRooms.has(room_num)) {
            console.warn(`⚠️ Warning: Duplicate room number "${room_num}" at row ${rowNumber}. Skipping duplicate.`);
            duplicateErrors++;
            return;
          }
          seenRooms.add(room_num);

          if (!categoryCodes.has(category_code)) {
            console.warn(`⚠️ Warning: Room ${room_num} has unknown category "${category_code}".`);
          }

          newDBData.rooms.push({
            room_num,
            floor,
            category_code,
            view_desc,
            status: status || 'متاحة',
            notes
          });
        }
      }
    });
    console.log(`✅ [3/5] Rooms Inventory Imported: ${newDBData.rooms.length} rooms registered`);
  }

  // ----------------------------------------------------
  // 4. IMPORT SEASONS SETUP
  // ----------------------------------------------------
  const sSeasons = workbook.getWorksheet('04_Seasons_Setup');
  if (sSeasons) {
    sSeasons.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const name = row.getCell(1).text ? row.getCell(1).text.trim() : null;
        const startRaw = row.getCell(2).value;
        const endRaw = row.getCell(3).value;
        const multiplier = Number(row.getCell(4).value) || 1.0;
        const notes = row.getCell(6).text ? row.getCell(6).text.trim() : '';

        // Format dates into YYYY-MM-DD
        const formatDate = (d) => {
          if (d instanceof Date) {
            return d.toISOString().split('T')[0];
          }
          return String(d || '').trim();
        };

        const start = formatDate(startRaw);
        const end = formatDate(endRaw);

        if (name && start && end) {
          newDBData.seasons.push({
            name,
            start,
            end,
            multiplier,
            notes
          });
        }
      }
    });
    console.log(`✅ [4/5] Seasonal Rules Imported: ${newDBData.seasons.length} seasons active (High season starts Oct 1st)`);
  }

  // ----------------------------------------------------
  // 5. IMPORT OCCUPANCY RULES
  // ----------------------------------------------------
  const sOcc = workbook.getWorksheet('05_Occupancy_Rules');
  if (sOcc) {
    sOcc.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const tier = row.getCell(1).text ? row.getCell(1).text.trim() : null;
        const min_occ = Number(row.getCell(2).value) || 0;
        const max_occ = Number(row.getCell(3).value) || 100;
        const adjustment = row.getCell(4).text ? row.getCell(4).text.trim() : '';
        const multiplier = Number(row.getCell(5).value) || 1.0;
        const desc = row.getCell(6).text ? row.getCell(6).text.trim() : '';

        if (tier) {
          newDBData.occupancy_rules.push({
            tier,
            min_occ,
            max_occ,
            adjustment,
            multiplier,
            desc
          });
        }
      }
    });
    console.log(`✅ [5/5] Occupancy Rules Imported: ${newDBData.occupancy_rules.length} surge tiers configured`);
  }

  // Preserve existing reservations if DB already had them
  const existingReservations = db.getReservations();
  if (existingReservations && existingReservations.length > 0) {
    newDBData.reservations = existingReservations;
    console.log(`ℹ️ Preserved ${existingReservations.length} existing reservations in database.`);
  }

  // Save to database
  db.saveDB(newDBData);

  console.log('====================================================');
  console.log('🎉 SUCCESS: Hotel Database Synced Successfully!');
  console.log(`📁 Database saved at: ${path.resolve(__dirname, '../database/hotel_db.json')}`);
  console.log('====================================================\n');

  // Quick verification demo:
  console.log('--- SYSTEM VERIFICATION TEST ---');
  console.log(`Total Rooms Active: ${db.getRooms().length}`);
  
  // Test Pricing Engine for Oct 15th 2026 (Winter Season)
  const testCategory = newDBData.categories[0].code; // STD_DBL
  const testDate = '2026-10-15';
  const priceQuote = db.calculateRoomPrice(testCategory, testDate, true);
  console.log(`Test Price Quote for Category "${testCategory}" on ${testDate} (Winter High Season):`);
  console.log(`• Base Price: $${priceQuote.base_usd}`);
  console.log(`• Season Multiplier: x${priceQuote.season_multiplier} (${priceQuote.applied_season})`);
  console.log(`• Occupancy Multiplier: x${priceQuote.occupancy_multiplier} (${priceQuote.applied_occupancy_tier})`);
  console.log(`• Direct Booking Discount: -$${priceQuote.direct_discount_usd}`);
  console.log(`• Final Rate: $${priceQuote.final_usd} USD (~${priceQuote.final_egp} EGP)`);
  console.log('--------------------------------\n');
}

if (require.main === module) {
  importHotelExcel().catch(err => {
    console.error('Fatal import error:', err);
    process.exit(1);
  });
}

module.exports = importHotelExcel;
