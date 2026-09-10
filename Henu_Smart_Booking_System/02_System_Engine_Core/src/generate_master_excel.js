const ExcelJS = require('exceljs');
const path = require('path');

async function buildPreciseHotelExcel() {
  console.log('Building 100% Authentic Henu Hotel Master Excel Setup...');

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Henu Smart Hotel Systems';
  workbook.created = new Date(2026, 8, 9);

  const primaryNavy = '1E3A8A';
  const borderGray = 'CBD5E1';
  const zebraLight = 'F8FAFC';

  const thinBorder = {
    top: { style: 'thin', color: { argb: borderGray } },
    left: { style: 'thin', color: { argb: borderGray } },
    bottom: { style: 'thin', color: { argb: borderGray } },
    right: { style: 'thin', color: { argb: borderGray } }
  };

  // ==========================================
  // SHEET 1: Hotel_Profile
  // ==========================================
  const s1 = workbook.addWorksheet('01_Hotel_Profile', { views: [{ rightToLeft: true }] });
  s1.columns = [
    { header: 'مفتاح الإعداد (Config Key)', key: 'key', width: 28 },
    { header: 'اسم الإعداد (Arabic Label)', key: 'label', width: 32 },
    { header: 'القيمة الحالية (Setting Value)', key: 'value', width: 40 },
    { header: 'ملاحظات وإرشادات التعديل', key: 'notes', width: 45 }
  ];

  const profileData = [
    { key: 'hotel_name_ar', label: 'اسم الفندق (بالعربية)', value: 'فندق هينو السياحي', notes: 'يظهر في الفواتير وموقع الحجز' },
    { key: 'hotel_name_en', label: 'Hotel Name (English)', value: 'Henu Boutique Hotel', notes: 'Displayed on OTAs & Booking Engine' },
    { key: 'currency_primary', label: 'العملة الأساسية للنظام', value: 'USD', notes: 'USD أو EGP (يوصى بـ USD للحجوزات الدولية)' },
    { key: 'currency_secondary', label: 'العملة الثانوية (المحلية)', value: 'EGP', notes: 'تستخدم في الاستقبال والفواتير المحلية' },
    { key: 'exchange_rate_usd_to_egp', label: 'سعر الصرف (الدولار مقابل الجنيه)', value: 50.0, notes: 'للتحويل التلقائي للأسعار' },
    { key: 'direct_discount_percent', label: 'نسبة خصم الحجز المباشر (%)', value: 10, notes: 'خصم تلقائي للنزيل عند الحجز من موقع الفندق مباشرة' },
    { key: 'tax_rate_percent', label: 'ضريبة القيمة المضافة (%)', value: 14, notes: 'تحسب اختيارياً بالفواتير' },
    { key: 'service_charge_percent', label: 'رسوم الخدمة (%)', value: 12, notes: 'تضاف في الفواتير الرسمية' },
    { key: 'phone_contact', label: 'هاتف التواصل / واتساب الاستقبال', value: '+20 100 234 5678', notes: 'يستقبل إشعارات الحجز الجديد' },
    { key: 'email_contact', label: 'البريد الإلكتروني الرسمي', value: 'booking@henuhotel.com', notes: 'تصل إليه إشعارات الحجز' },
    { key: 'city_location', label: 'الموقع الجغرافي', value: 'شارع الهرم الرئيسي - الجيزة', notes: 'جميع البلكونات على الشارع الرئيسي - الروف له إطلالة أهرامات' },
    { key: 'checkin_time', label: 'موعد تسجيل الوصول الافتراضي (Check-in)', value: '14:00', notes: 'الساعة 2:00 ظهراً' },
    { key: 'checkout_time', label: 'موعد تسجيل المغادرة الافتراضي (Check-out)', value: '12:00', notes: 'الساعة 12:00 ظهراً' }
  ];
  profileData.forEach(d => s1.addRow(d));

  // ==========================================
  // SHEET 2: Room_Categories (لا أجنحة نهائياً - غرف عائلية)
  // ==========================================
  const s2 = workbook.addWorksheet('02_Room_Categories', { views: [{ rightToLeft: true }] });
  s2.columns = [
    { header: 'كود الفئة (Category Code)', key: 'code', width: 22 },
    { header: 'اسم الفئة (بالعربية)', key: 'name_ar', width: 30 },
    { header: 'Category Name (English)', key: 'name_en', width: 30 },
    { header: 'السعة القصوى (أفراد)', key: 'capacity', width: 18 },
    { header: 'مواصفات الأسرّة', key: 'beds', width: 26 },
    { header: 'السعر الأساسي ($ USD)', key: 'base_usd', width: 22 },
    { header: 'السعر بالجنيه (ج.م EGP)', key: 'base_egp', width: 22 },
    { header: 'المرافق والتجهيزات (Amenities)', key: 'amenities', width: 50 }
  ];

  const categoriesData = [
    { code: 'SGL_BALC', name_ar: 'غرفة سنجل بلكونة على الشارع', name_en: 'Single Room Main Street Balcony', capacity: 1, beds: '1 سرير سنجل فردي', base_usd: 19, base_egp: 950, amenities: 'بلكونة على الشارع الرئيسي، مكتب عمل، تكييف، واي فاي مجاني' },
    { code: 'STD_DBL', name_ar: 'غرفة دابل قياسية', name_en: 'Standard Double Room', capacity: 2, beds: '1 سرير دابل كبير', base_usd: 25, base_egp: 1250, amenities: 'تكييف، شاشة تلفزيون، حمام خاص، واي فاي' },
    { code: 'DBL_BALC', name_ar: 'غرفة دابل بلكونة على الشارع', name_en: 'Double Room Main Street Balcony', capacity: 2, beds: '1 سرير دابل كبير', base_usd: 27, base_egp: 1350, amenities: 'بلكونة على الشارع الرئيسي، تكييف، شاشة تلفزيون، واي فاي' },
    { code: 'KNG_ROOM', name_ar: 'غرفة كينج سرير كبير', name_en: 'King Room', capacity: 2, beds: '1 سرير كينج مريح', base_usd: 31, base_egp: 1550, amenities: 'سرير كينج واسع، تكييف، ثلاجة ميني بار، شاشة تلفزيون' },
    { code: 'KNG_BALC', name_ar: 'غرفة كينج بلكونة على الشارع', name_en: 'King Room Main Street Balcony', capacity: 2, beds: '1 سرير كينج مريح', base_usd: 33, base_egp: 1650, amenities: 'بلكونة على الشارع الرئيسي، سرير كينج واسع، ميني بار، شاشة تلفزيون' },
    { code: 'TRP_FAM', name_ar: 'غرفة عائلية ثلاثية (3 أسرّة)', name_en: 'Family Triple Room (3 Beds)', capacity: 3, beds: '3 أسرّة فردية', base_usd: 37, base_egp: 1850, amenities: 'مساحة عائلية واسعة، 3 أسرة مريحة، حمام خاص، تكييف' },
    { code: 'QUAD_FAM', name_ar: 'غرفة عائلية رباعية (4 أفراد)', name_en: 'Family Quadruple Room (4 Guests)', capacity: 4, beds: 'سرير كينج + 2 سرير فردي', base_usd: 45, base_egp: 2250, amenities: 'أكبر غرفة عائلية بالفندق، سعة 4 أفراد، جلسة عائلية، ثلاجة، شاشة ذكية' }
  ];
  categoriesData.forEach(d => s2.addRow(d));

  // ==========================================
  // SHEET 3: Rooms_Inventory (حصر الـ 25 غرفة الفعلي والدقيق)
  // ==========================================
  const s3 = workbook.addWorksheet('03_Rooms_Inventory', { views: [{ rightToLeft: true }] });
  s3.columns = [
    { header: 'رقم الغرفة (Room Number)', key: 'room_num', width: 24 },
    { header: 'الدور / الطابق (Floor)', key: 'floor', width: 20 },
    { header: 'كود فئة الغرفة (Category Code)', key: 'category_code', width: 28 },
    { header: 'نوع الإطلالة والموقع الدقيق', key: 'view_desc', width: 35 },
    { header: 'الحالة التشغيلية الحالية', key: 'status', width: 22 },
    { header: 'ملاحظات الصيانة والتشغيل', key: 'notes', width: 35 }
  ];

  const roomsData = [
    // الدور الأول (4 غرف)
    { room_num: '101', floor: 'الدور الأول', category_code: 'STD_DBL', view_desc: 'شباك شبك داخلي هادئ', status: 'متاحة', notes: 'جاهزة' },
    { room_num: '102', floor: 'الدور الأول', category_code: 'KNG_ROOM', view_desc: 'شباك داخلي هادئ', status: 'متاحة', notes: 'سرير كينج مريح' },
    { room_num: '103', floor: 'الدور الأول', category_code: 'QUAD_FAM', view_desc: 'شباك واسع', status: 'متاحة', notes: 'غرفة عائلية رباعية 4 أفراد' },
    { room_num: '104', floor: 'الدور الأول', category_code: 'KNG_ROOM', view_desc: 'شباك شبك هادئ', status: 'متاحة', notes: 'كينج شبك' },

    // الدور الثاني (7 غرف)
    { room_num: '201', floor: 'الدور الثاني', category_code: 'SGL_BALC', view_desc: 'بلكونة على الشارع الرئيسي', status: 'متاحة', notes: 'بلكونة شارع رئيسي' },
    { room_num: '202', floor: 'الدور الثاني', category_code: 'DBL_BALC', view_desc: 'بلكونة على الشارع الرئيسي', status: 'متاحة', notes: 'بلكونة شارع رئيسي' },
    { room_num: '203', floor: 'الدور الثاني', category_code: 'STD_DBL', view_desc: 'شباك داخلي', status: 'متاحة', notes: 'جاهزة' },
    { room_num: '204', floor: 'الدور الثاني', category_code: 'KNG_ROOM', view_desc: 'شباك داخلي هادئ', status: 'متاحة', notes: 'سرير كينج' },
    { room_num: '205', floor: 'الدور الثاني', category_code: 'STD_DBL', view_desc: 'شباك داخلي', status: 'متاحة', notes: 'جاهزة' },
    { room_num: '206', floor: 'الدور الثاني', category_code: 'TRP_FAM', view_desc: 'شباك جانبي واسع', status: 'متاحة', notes: 'عائلية 3 أسرة فردية' },
    { room_num: '207', floor: 'الدور الثاني', category_code: 'STD_DBL', view_desc: 'شباك شبك جانبي', status: 'متاحة', notes: 'جاهزة' },

    // الدور الثالث (7 غرف)
    { room_num: '301', floor: 'الدور الثالث', category_code: 'SGL_BALC', view_desc: 'بلكونة على الشارع الرئيسي', status: 'متاحة', notes: 'بلكونة شارع رئيسي' },
    { room_num: '302', floor: 'الدور الثالث', category_code: 'DBL_BALC', view_desc: 'بلكونة على الشارع الرئيسي', status: 'متاحة', notes: 'بلكونة شارع رئيسي' },
    { room_num: '303', floor: 'الدور الثالث', category_code: 'KNG_ROOM', view_desc: 'شباك خارجي', status: 'متاحة', notes: 'جاهزة' },
    { room_num: '304', floor: 'الدور الثالث', category_code: 'KNG_ROOM', view_desc: 'شباك خارجي', status: 'متاحة', notes: 'جاهزة' },
    { room_num: '305', floor: 'الدور الثالث', category_code: 'KNG_ROOM', view_desc: 'شباك خارجي هادئ', status: 'متاحة', notes: 'جاهزة' },
    { room_num: '306', floor: 'الدور الثالث', category_code: 'KNG_BALC', view_desc: 'بلكونة على الشارع الرئيسي', status: 'متاحة', notes: 'بلكونة شارع رئيسي' },
    { room_num: '307', floor: 'الدور الثالث', category_code: 'STD_DBL', view_desc: 'شباك شبك جانبي', status: 'متاحة', notes: 'جاهزة' },

    // الدور الرابع (7 غرف - مع إطلالة الروف على الأهرامات)
    { room_num: '401', floor: 'الدور الرابع', category_code: 'SGL_BALC', view_desc: 'بلكونة على الشارع الرئيسي', status: 'متاحة', notes: 'بلكونة شارع رئيسي' },
    { room_num: '402', floor: 'الدور الرابع', category_code: 'DBL_BALC', view_desc: 'بلكونة على الشارع الرئيسي', status: 'متاحة', notes: 'بلكونة شارع رئيسي' },
    { room_num: '403', floor: 'الدور الرابع', category_code: 'KNG_ROOM', view_desc: 'شباك خارجي علوي', status: 'متاحة', notes: 'بالقرب من الروف' },
    { room_num: '404', floor: 'الدور الرابع', category_code: 'KNG_ROOM', view_desc: 'شباك خارجي علوي', status: 'متاحة', notes: 'بالقرب من الروف' },
    { room_num: '405', floor: 'الدور الرابع', category_code: 'STD_DBL', view_desc: 'شباك علوي هادئ', status: 'متاحة', notes: 'بالقرب من الروف' },
    { room_num: '406', floor: 'الدور الرابع', category_code: 'TRP_FAM', view_desc: 'شباك عائلي علوي', status: 'متاحة', notes: 'عائلية 3 أسرة فردية' },
    { room_num: '407', floor: 'الدور الرابع', category_code: 'STD_DBL', view_desc: 'شباك شبك علوي', status: 'متاحة', notes: 'جاهزة' }
  ];
  roomsData.forEach(d => s3.addRow(d));

  // ==========================================
  // SHEET 4: Seasons_Setup (بدء موسم الشتاء السياحي 1 أكتوبر)
  // ==========================================
  const s4 = workbook.addWorksheet('04_Seasons_Setup', { views: [{ rightToLeft: true }] });
  s4.columns = [
    { header: 'اسم الموسم (Season Name)', key: 'name', width: 28 },
    { header: 'تاريخ البدء (Start Date: YYYY-MM-DD)', key: 'start', width: 30 },
    { header: 'تاريخ الانتهاء (End Date: YYYY-MM-DD)', key: 'end', width: 30 },
    { header: 'معامل زيادة السعر (Multiplier)', key: 'multiplier', width: 26 },
    { header: 'نسبة الزيادة المئوية (%)', key: 'percent', width: 24 },
    { header: 'ملاحظات الاستراتيجية التلقائية', key: 'notes', width: 45 }
  ];

  const seasonsData = [
    { name: 'موسم الشتاء والذروة السياحية', start: '2026-10-01', end: '2027-04-30', multiplier: 1.30, percent: '+30%', notes: 'يبدأ تلقائياً أول أكتوبر لجميع الغرف وجميع المنصات' },
    { name: 'أعياد رأس السنة والكريسماس', start: '2026-12-20', end: '2027-01-08', multiplier: 1.50, percent: '+50%', notes: 'ذروة الطلب العالمية - أعلى سعر للغرف' },
    { name: 'موسم الصيف العادي', start: '2027-05-01', end: '2027-09-30', multiplier: 1.00, percent: '0% (Base)', notes: 'تطبيق السعر الأساسي للغرفة دون زيادة' }
  ];
  seasonsData.forEach(d => s4.addRow(d));

  // ==========================================
  // SHEET 5: Occupancy_Rules
  // ==========================================
  const s5 = workbook.addWorksheet('05_Occupancy_Rules', { views: [{ rightToLeft: true }] });
  s5.columns = [
    { header: 'شريحة الإشغال (Tier Name)', key: 'tier', width: 28 },
    { header: 'من نسبة إشغال (%)', key: 'min_occ', width: 20 },
    { header: 'إلى نسبة إشغال (%)', key: 'max_occ', width: 20 },
    { header: 'تعديل السعر التلقائي (%)', key: 'adjustment', width: 24 },
    { header: 'معامل الضرب (Multiplier)', key: 'multiplier', width: 24 },
    { header: 'وصف السلوك الذكي للخوارزمية', key: 'desc', width: 45 }
  ];

  const occRules = [
    { tier: '1. إشغال مبكر / منخفض', min_occ: 0, max_occ: 35, adjustment: '0%', multiplier: 1.00, desc: 'البيع بالسعر الأساسي لتشجيع وتثبيت الحجوزات المبكرة' },
    { tier: '2. إشغال متوسط ونشط', min_occ: 36, max_occ: 65, adjustment: '+15%', multiplier: 1.15, desc: 'رفع السعر تلقائياً مع تسارع الحجوزات وتأكيد الطلب' },
    { tier: '3. إشغال مرتفع وحرج', min_occ: 66, max_occ: 85, adjustment: '+30%', multiplier: 1.30, desc: 'استغلال ندرة الغرف المتبقية لتعظيم متوسط سعر الليلة ADR' },
    { tier: '4. ذروة الإشغال (آخر الغرف)', min_occ: 86, max_occ: 100, adjustment: '+50%', multiplier: 1.50, desc: 'بيع آخر غرفتين إلى 3 غرف بأعلى عائد ممكن للنزلاء المضطرين' }
  ];
  occRules.forEach(d => s5.addRow(d));

  // Style all sheets
  const sheets = [s1, s2, s3, s4, s5];
  sheets.forEach(sheet => {
    const headerRow = sheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: primaryNavy }
      };
      cell.font = {
        name: 'Segoe UI',
        bold: true,
        size: 11,
        color: { argb: 'FFFFFF' }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      };
      cell.border = thinBorder;
    });

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.height = 24;
        const isEven = rowNumber % 2 === 0;
        row.eachCell((cell) => {
          if (isEven) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: zebraLight }
            };
          }
          cell.font = {
            name: 'Segoe UI',
            size: 10,
            color: { argb: '1E293B' }
          };
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          cell.border = thinBorder;
        });
      }
    });
  });

  const targetExcelPath = path.resolve('d:/Henu/Henu_Smart_Booking_System/01_Hotel_Data_Workspace/01_Excel_Templates/Master_Hotel_Setup.xlsx');
  await workbook.xlsx.writeFile(targetExcelPath);
  console.log('Precise Master Excel Template written successfully to:', targetExcelPath);
}

buildPreciseHotelExcel().catch(err => {
  console.error('Failed to build precise Master Excel:', err);
  process.exit(1);
});
