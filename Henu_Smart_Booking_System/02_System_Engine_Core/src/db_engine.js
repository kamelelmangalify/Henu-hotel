const fs = require('fs');
const path = require('path');

// Relative path to database file - works anywhere regardless of drive letter or OS
const DB_DIR = path.resolve(__dirname, '../database');
const DB_FILE = path.join(DB_DIR, 'hotel_db.json');
const DB_BACKUP_FILE = path.join(DB_DIR, 'hotel_db.backup.json');

class HotelDatabaseEngine {
  constructor() {
    this.ensureDirectory();
    this.data = this.loadDB();
  }

  ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  getDefaultSchema() {
    return {
      metadata: {
        system_version: '1.0.0',
        last_updated: new Date().toISOString(),
        hotel_id: 'default'
      },
      profile: {
        hotel_name_ar: 'فندق هينو السياحي',
        hotel_name_en: 'Henu Boutique Hotel',
        currency_primary: 'USD',
        currency_secondary: 'EGP',
        exchange_rate_usd_to_egp: 50.0,
        direct_discount_percent: 10,
        tax_rate_percent: 14,
        service_charge_percent: 12,
        phone_contact: '',
        email_contact: '',
        city_location: 'Giza, Egypt',
        checkin_time: '14:00',
        checkout_time: '12:00'
      },
      categories: [],
      rooms: [],
      seasons: [],
      occupancy_rules: [],
      reservations: []
    };
  }

  loadDB() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('⚠️ Warning reading DB file, trying backup:', err.message);
      if (fs.existsSync(DB_BACKUP_FILE)) {
        const raw = fs.readFileSync(DB_BACKUP_FILE, 'utf8');
        return JSON.parse(raw);
      }
    }
    return this.getDefaultSchema();
  }

  saveDB(newData = null) {
    if (newData) {
      this.data = newData;
    }
    this.data.metadata.last_updated = new Date().toISOString();

    const jsonString = JSON.stringify(this.data, null, 2);
    const tempFile = path.join(DB_DIR, `hotel_db.${Date.now()}.tmp`);

    // Atomic write pattern: write to temp file then rename to prevent corruption
    fs.writeFileSync(tempFile, jsonString, 'utf8');
    if (fs.existsSync(DB_FILE)) {
      fs.copyFileSync(DB_FILE, DB_BACKUP_FILE);
    }
    fs.renameSync(tempFile, DB_FILE);
    return true;
  }

  getProfile() {
    return this.data.profile;
  }

  getCategories() {
    return this.data.categories;
  }

  getCategoryByCode(code) {
    return this.data.categories.find(c => c.code === code) || null;
  }

  getRooms() {
    return this.data.rooms.map(room => {
      const category = this.getCategoryByCode(room.category_code);
      return {
        ...room,
        category: category || { name_ar: 'غير محدد', name_en: 'Unassigned', base_usd: 0, base_egp: 0 }
      };
    });
  }

  getRoom(roomNumber) {
    const room = this.data.rooms.find(r => String(r.room_num) === String(roomNumber));
    if (!room) return null;
    return {
      ...room,
      category: this.getCategoryByCode(room.category_code)
    };
  }

  getSeasons() {
    return this.data.seasons;
  }

  getOccupancyRules() {
    return this.data.occupancy_rules;
  }

  getReservations() {
    return this.data.reservations;
  }

  // Check room availability for date range [checkin, checkout)
  isRoomAvailable(roomNumber, checkinStr, checkoutStr) {
    const checkin = new Date(checkinStr);
    const checkout = new Date(checkoutStr);

    if (isNaN(checkin) || isNaN(checkout) || checkin >= checkout) {
      throw new Error('Invalid date range');
    }

    const room = this.getRoom(roomNumber);
    if (!room || room.status !== 'متاحة') {
      return false;
    }

    const overlappingBooking = this.data.reservations.find(res => {
      if (String(res.room_num) !== String(roomNumber)) return false;
      if (res.status === 'ملغي' || res.status === 'cancelled') return false;

      const resStart = new Date(res.checkin);
      const resEnd = new Date(res.checkout);

      // Overlap condition: start < resEnd && end > resStart
      return (checkin < resEnd && checkout > resStart);
    });

    return !overlappingBooking;
  }

  // Get all available rooms for a given stay period
  getAvailableRooms(checkinStr, checkoutStr) {
    const allRooms = this.getRooms();
    return allRooms.filter(r => this.isRoomAvailable(r.room_num, checkinStr, checkoutStr));
  }

  // Calculate current occupancy rate for a specific date (0.0 to 1.0)
  getOccupancyRateForDate(dateStr) {
    const targetDate = new Date(dateStr);
    const totalRooms = this.data.rooms.filter(r => r.status === 'متاحة').length;
    if (totalRooms === 0) return 0;

    const bookedCount = this.data.reservations.filter(res => {
      if (res.status === 'ملغي' || res.status === 'cancelled') return false;
      const resStart = new Date(res.checkin);
      const resEnd = new Date(res.checkout);
      return targetDate >= resStart && targetDate < resEnd;
    }).length;

    return Math.min(1.0, bookedCount / totalRooms);
  }

  // Calculate dynamic price for a specific category and date
  calculateRoomPrice(categoryCode, dateStr, isDirectBooking = false) {
    const category = this.getCategoryByCode(categoryCode);
    if (!category) return null;

    const baseUSD = category.base_usd;
    const baseEGP = category.base_egp;
    const targetDate = new Date(dateStr);

    // 1. Season multiplier (Starts Oct 1st etc.)
    let seasonMultiplier = 1.0;
    let appliedSeason = null;

    for (const season of this.data.seasons) {
      const sStart = new Date(season.start);
      const sEnd = new Date(season.end);
      if (targetDate >= sStart && targetDate <= sEnd) {
        seasonMultiplier = season.multiplier || 1.0;
        appliedSeason = season.name;
        break; // Match first active season
      }
    }

    // 2. Occupancy surge multiplier
    const occupancyRate = this.getOccupancyRateForDate(dateStr);
    const occPercent = Math.round(occupancyRate * 100);
    let occupancyMultiplier = 1.0;
    let appliedTier = 'Base Rate';

    for (const rule of this.data.occupancy_rules) {
      if (occPercent >= rule.min_occ && occPercent <= rule.max_occ) {
        occupancyMultiplier = rule.multiplier || 1.0;
        appliedTier = rule.tier;
        break;
      }
    }

    // Combined formula
    let finalUSD = Math.round(baseUSD * seasonMultiplier * occupancyMultiplier);
    let finalEGP = Math.round(baseEGP * seasonMultiplier * occupancyMultiplier);

    // 3. Direct booking discount (if booking from hotel website)
    let directDiscountAmount = 0;
    if (isDirectBooking) {
      const discountPercent = this.data.profile.direct_discount_percent || 10;
      directDiscountAmount = Math.round(finalUSD * (discountPercent / 100));
      finalUSD = finalUSD - directDiscountAmount;
      finalEGP = Math.round(finalUSD * (this.data.profile.exchange_rate_usd_to_egp || 50));
    }

    return {
      category_code: categoryCode,
      date: dateStr,
      base_usd: baseUSD,
      base_egp: baseEGP,
      season_multiplier: seasonMultiplier,
      applied_season: appliedSeason,
      occupancy_percent: occPercent,
      occupancy_multiplier: occupancyMultiplier,
      applied_occupancy_tier: appliedTier,
      is_direct_booking: isDirectBooking,
      direct_discount_usd: directDiscountAmount,
      final_usd: finalUSD,
      final_egp: finalEGP
    };
  }

  // Create a confirmed booking
  addReservation(resData) {
    const resId = resData.id || `RES-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const newReservation = {
      id: resId,
      room_num: String(resData.room_num),
      guest_name: resData.guest_name || 'نزيل مباشر',
      guest_phone: resData.guest_phone || '',
      guest_email: resData.guest_email || '',
      checkin: resData.checkin,
      checkout: resData.checkout,
      nights: resData.nights || 1,
      total_price_usd: resData.total_price_usd || 0,
      total_price_egp: resData.total_price_egp || 0,
      source: resData.source || 'Website_Direct', // 'Website_Direct', 'Booking.com', 'Agoda', 'Expedia', 'Reception'
      status: resData.status || 'مؤكد',
      created_at: new Date().toISOString()
    };

    this.data.reservations.push(newReservation);
    this.saveDB();
    return newReservation;
  }
}

module.exports = new HotelDatabaseEngine();
