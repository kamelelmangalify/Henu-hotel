const ExcelJS = require('exceljs');
const path = require('path');

async function createHotelInventoryExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Antigravity Hotel Agent';
  workbook.created = new Date();

  // ---------------------------------------------------------
  // 1. الشيت الأول: بيان الغرف والسراير تفصيلي (Detailed Rooms)
  // ---------------------------------------------------------
  const roomSheet = workbook.addWorksheet('حصر الغرف والسراير', {
    views: [{ rightToLeft: true }]
  });

  // البيانات الخاصة بالغرف
  const roomsData = [
    // الدور الأول
    { floor: 'الدور الأول', room: '101', type: 'دابل شبك', king: 0, double: 1, single: 0, notes: 'شباك / شبك' },
    { floor: 'الدور الأول', room: '102', type: 'سرير كينج', king: 1, double: 0, single: 0, notes: 'سكن Staf / سرير كينج' },
    { floor: 'الدور الأول', room: '103', type: 'سويت', king: 1, double: 0, single: 0, notes: 'سويت فندقي' },
    { floor: 'الدور الأول', room: '104', type: 'كينج شبك', king: 1, double: 0, single: 0, notes: 'سرير كينج شبك' },
    
    // الدور الثاني
    { floor: 'الدور الثاني', room: '201', type: 'سنجل بلكونه', king: 0, double: 0, single: 1, notes: 'بلكونة' },
    { floor: 'الدور الثاني', room: '202', type: 'دابل بلكونه', king: 0, double: 1, single: 0, notes: 'بلكونة' },
    { floor: 'الدور الثاني', room: '203', type: 'دابل', king: 0, double: 1, single: 0, notes: 'غرفة دابل' },
    { floor: 'الدور الثاني', room: '204', type: 'سرير كينج', king: 1, double: 0, single: 0, notes: 'سرير كينج' },
    { floor: 'الدور الثاني', room: '205', type: 'دابل', king: 0, double: 1, single: 0, notes: 'غرفة دابل' },
    { floor: 'الدور الثاني', room: '206', type: 'ترابل شبك جانبي', king: 0, double: 0, single: 3, notes: '3 سراير سنجل (أو دابل + سنجل)' },
    { floor: 'الدور الثاني', room: '207', type: 'دابل شبك جانبي', king: 0, double: 1, single: 0, notes: 'شبك جانبي' },

    // الدور الثالث
    { floor: 'الدور الثالث', room: '301', type: 'سنجل بلكونه', king: 0, double: 0, single: 1, notes: 'بلكونة' },
    { floor: 'الدور الثالث', room: '302', type: 'دابل بلكونه', king: 0, double: 1, single: 0, notes: 'بلكونة' },
    { floor: 'الدور الثالث', room: '303', type: 'سرير كينج', king: 1, double: 0, single: 0, notes: 'سرير كينج' },
    { floor: 'الدور الثالث', room: '304', type: 'سرير كينج', king: 1, double: 0, single: 0, notes: 'سرير كينج' },
    { floor: 'الدور الثالث', room: '305', type: 'سرير كينج', king: 1, double: 0, single: 0, notes: 'سرير كينج' },
    { floor: 'الدور الثالث', room: '306', type: 'كينج بلكونه جانبي', king: 1, double: 0, single: 0, notes: 'بلكونة جانبية' },
    { floor: 'الدور الثالث', room: '307', type: 'دبل شبك جانبي', king: 0, double: 1, single: 0, notes: 'شبك جانبي' },

    // الدور الرابع
    { floor: 'الدور الرابع', room: '401', type: 'سنجل بلكونه', king: 0, double: 0, single: 1, notes: 'بلكونة' },
    { floor: 'الدور الرابع', room: '402', type: 'دابل بلكونه', king: 0, double: 1, single: 0, notes: 'بلكونة' },
    { floor: 'الدور الرابع', room: '403', type: 'سرير كينج', king: 1, double: 0, single: 0, notes: 'سرير كينج' },
    { floor: 'الدور الرابع', room: '404', type: 'سرير كينج', king: 1, double: 0, single: 0, notes: 'سرير كينج' },
    { floor: 'الدور الرابع', room: '405', type: 'دابل', king: 0, double: 1, single: 0, notes: 'غرفة دابل' },
    { floor: 'الدور الرابع', room: '406', type: 'ترابل شبك جانبي', king: 0, double: 0, single: 3, notes: '3 سراير سنجل' },
    { floor: 'الدور الرابع', room: '407', type: 'دابل شبك جانبي', king: 0, double: 1, single: 0, notes: 'شبك جانبي' },
  ];

  // العناوين الرئيسي للشيت الأول
  roomSheet.mergeCells('A1:H1');
  const titleCell = roomSheet.getCell('A1');
  titleCell.value = '🏨 حصر الغرف وتوزيع الأسرّة بالفندق (حسب الأدوار)';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  roomSheet.addRow([]);

  // عناوين الأعمدة
  const headers = [
    'الدور',
    'رقم الغرفة',
    'وصف وتصنيف الغرفة',
    'سرير كينج (180-200 سم)',
    'سرير دابل (160 سم)',
    'سرير سنجل (100-120 سم)',
    'إجمالي عدد الأسرّة',
    'ملاحظات وتفاصيل'
  ];

  const headerRow = roomSheet.addRow(headers);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'D9D9D9' } },
      bottom: { style: 'medium', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: 'D9D9D9' } },
      right: { style: 'thin', color: { argb: 'D9D9D9' } }
    };
  });

  // إضافة البيانات
  let startRow = 4;
  roomsData.forEach((item, index) => {
    const totalBeds = item.king + item.double + item.single;
    const row = roomSheet.addRow([
      item.floor,
      item.room,
      item.type,
      item.king,
      item.double,
      item.single,
      totalBeds,
      item.notes
    ]);
    row.height = 22;

    // تمييز الأسطر بألوان متناوبة
    const isEven = index % 2 === 0;
    const bgColor = isEven ? 'F2F4F7' : 'FFFFFF';

    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Arial', size: 10 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cell.alignment = { horizontal: colNumber <= 3 ? 'center' : 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'E0E0E0' } },
        bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
        left: { style: 'thin', color: { argb: 'E0E0E0' } },
        right: { style: 'thin', color: { argb: 'E0E0E0' } }
      };

      if (colNumber >= 4 && colNumber <= 7) {
        cell.font = { name: 'Arial', size: 10, bold: true };
      }
    });
  });

  // صف الإجمالي
  const totalRowIndex = startRow + roomsData.length;
  const totalsRow = roomSheet.addRow([
    'الإجمالي الكلي',
    `${roomsData.length} غرفة`,
    '-',
    `=SUM(D4:D${totalRowIndex - 1})`,
    `=SUM(E4:E${totalRowIndex - 1})`,
    `=SUM(F4:F${totalRowIndex - 1})`,
    `=SUM(G4:G${totalRowIndex - 1})`,
    'حصر شامل للغرف'
  ]);
  totalsRow.height = 26;

  totalsRow.eachCell((cell, colNumber) => {
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF1F4E78' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9E1F2' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'double', color: { argb: '1F4E78' } },
      bottom: { style: 'double', color: { argb: '1F4E78' } },
      left: { style: 'thin', color: { argb: 'B4C6E7' } },
      right: { style: 'thin', color: { argb: 'B4C6E7' } }
    };
  });

  // ضبط عرض الأعمدة
  roomSheet.columns.forEach((col, idx) => {
    const widths = [16, 14, 24, 22, 20, 22, 18, 30];
    col.width = widths[idx] || 20;
  });

  // ---------------------------------------------------------
  // 2. الشيت الثاني: حساب كميات المفروشات المطلوبة (Linen & Bedding)
  // ---------------------------------------------------------
  const linenSheet = workbook.addWorksheet('خطة المفروشات والمقاسات', {
    views: [{ rightToLeft: true }]
  });

  linenSheet.mergeCells('A1:G1');
  const linenTitle = linenSheet.getCell('A1');
  linenTitle.value = '🧺 جدول حساب المقاسات وكميات المفروشات المطلوبة للفندق';
  linenTitle.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  linenTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF375623' } };
  linenTitle.alignment = { horizontal: 'center', vertical: 'middle' };

  linenSheet.addRow([]);

  const linenHeaders = [
    'نوع ومقاس السرير',
    'المقاس القياسي (سم)',
    'عدد الأسرّة بالفندق',
    'ملاءة سرير (Sheet)',
    'لحاف فندقي + كيس (Duvet)',
    'مخدات (Pillows)',
    'واقي مرتبة (Protector)'
  ];

  const linenHeaderRow = linenSheet.addRow(linenHeaders);
  linenHeaderRow.height = 28;
  linenHeaderRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF548235' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'D9D9D9' } },
      bottom: { style: 'medium', color: { argb: '000000' } }
    };
  });

  // بيانات حساب المفروشات (مع احتساب الاحتياطي للغسيل والبديل 1.5x إلى 2x)
  // كينج: 11 سرير
  // دابل: 9 سراير
  // سنجل: 8 سراير
  const linenItems = [
    {
      bedType: 'سرير كينج (King Bed)',
      size: '180 × 200 سم (أو 200×200)',
      count: 11,
      sheets: 11 * 2, // ملاءتين لكل سرير (الفرش + المغسلة)
      duvets: 11 * 1.5, // 1.5 لحاف لكل سرير
      pillows: 11 * 4, // 4 مخدات كبيرة لكل سرير كينج
      protectors: 11 * 1.2
    },
    {
      bedType: 'سرير دابل (Double Bed)',
      size: '160 × 200 سم',
      count: 9,
      sheets: 9 * 2,
      duvets: 9 * 1.5,
      pillows: 9 * 4, // 4 مخدات لكل سرير دابل
      protectors: 9 * 1.2
    },
    {
      bedType: 'سرير سنجل (Single Bed)',
      size: '100 × 200 سم (أو 120×200)',
      count: 8,
      sheets: 8 * 2,
      duvets: 8 * 1.5,
      pillows: 8 * 2, // مخدتين لكل سرير سنجل
      protectors: 8 * 1.2
    }
  ];

  linenItems.forEach((item, index) => {
    const row = linenSheet.addRow([
      item.bedType,
      item.size,
      item.count,
      Math.ceil(item.sheets) + ' طقم (مغسول + احتياطي)',
      Math.ceil(item.duvets) + ' لحاف وكيس',
      Math.ceil(item.pillows) + ' مخدة',
      Math.ceil(item.protectors) + ' كفر واقي'
    ]);
    row.height = 24;
    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 10 };
      cell.alignment = { horizontal: colNum === 1 || colNum === 2 ? 'right' : 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'E0E0E0' } },
        bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
        left: { style: 'thin', color: { argb: 'E0E0E0' } },
        right: { style: 'thin', color: { argb: 'E0E0E0' } }
      };
      if (colNum === 3) cell.font = { name: 'Arial', size: 11, bold: true };
    });
  });

  // إضافة المجموع والملاحظات الهامة للمغسلة والتشغيل
  linenSheet.addRow([]);
  const noteHeader = linenSheet.addRow(['💡 ملاحظات وتوصيات شراء المفروشات للفندق:']);
  noteHeader.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFC00000' } };

  const notesList = [
    '• تم احتساب كميات المفروشات بناءً على معدل دورة المغسلة القياسي (Par Level = 2.0 للملاءات والمخدات، 1.5 للألحفة).',
    '• سراير الكينج (11 سرير): تحتاج مقاس ملاءة 280×300 سم على الأقل لسهولة التثبيت تحت المرتبة.',
    '• سراير الدابل (9 سراير): تحتاج مقاس ملاءة 240×280 سم.',
    '• سراير السنجل (8 سراير): تحتاج مقاس ملاءة 180×280 سم.',
    '• إجمالي المخدات المطلوبة بالفندق: 96 مخدة قياسية (70×50 سم).'
  ];

  notesList.forEach(n => {
    const r = linenSheet.addRow([n]);
    r.getCell(1).font = { name: 'Arial', size: 10, italic: true };
  });

  linenSheet.columns.forEach((col, idx) => {
    const widths = [28, 25, 20, 26, 22, 18, 22];
    col.width = widths[idx] || 22;
  });

  // حفظ الملف
  const outputPath = path.join(__dirname, 'حصر_غرف_ومفروشات_الفندق.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Excel created successfully at: ${outputPath}`);
  return outputPath;
}

createHotelInventoryExcel().catch(err => console.error(err));
