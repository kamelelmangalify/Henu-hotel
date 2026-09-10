const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function buildPortableHotelPackage() {
  const packageDir = path.join(__dirname, 'نظام_حجز_الفندق_المحمول');
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
  }

  // -------------------------------------------------------------
  // 1. Build the Ultra-Compatible Excel File
  // -------------------------------------------------------------
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Henu Hotel PMS';
  wb.lastModifiedBy = 'Henu Hotel PMS';
  wb.created = new Date();
  wb.modified = new Date();

  // Force Excel to calculate all formulas on open regardless of Excel version/locale
  wb.calcProperties.fullCalcOnLoad = true;

  // Styling
  const navyHeader = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  const tealHeader = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
  const goldHeader = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB45309' } };
  const whiteBold  = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  const cellFont   = { name: 'Segoe UI', size: 10 };
  const boldFont   = { name: 'Segoe UI', size: 10, bold: true };
  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
  };

  const initialRooms = [
    { id: '101', floor: 'الدور الأول', type: 'دابل شبك', price: 1200, notes: 'شباك شبك' },
    { id: '102', floor: 'الدور الأول', type: 'سرير كينج', price: 1400, notes: 'سرير كينج مريح' },
    { id: '103', floor: 'الدور الأول', type: 'سويت عائلي', price: 2500, notes: 'سويت عائلي فاخر' },
    { id: '104', floor: 'الدور الأول', type: 'كينج شبك', price: 1500, notes: 'كينج شبك' },
    { id: '201', floor: 'الدور الثاني', type: 'سنجل بلكونة', price: 900, notes: 'بلكونة خارجية' },
    { id: '202', floor: 'الدور الثاني', type: 'دابل بلكونة', price: 1300, notes: 'بلكونة وتراس' },
    { id: '203', floor: 'الدور الثاني', type: 'دابل قياسي', price: 1200, notes: 'تجهيز مفروشات' },
    { id: '204', floor: 'الدور الثاني', type: 'سرير كينج', price: 1500, notes: 'كينج واسع' },
    { id: '205', floor: 'الدور الثاني', type: 'دابل قياسي', price: 1200, notes: 'شباك قياسي' },
    { id: '206', floor: 'الدور الثاني', type: 'ترابل 3 أسرّة', price: 1800, notes: 'غرفة عائلية 3 سراير' },
    { id: '207', floor: 'الدور الثاني', type: 'دابل جانبي', price: 1250, notes: 'إطلالة جانبية' },
    { id: '301', floor: 'الدور الثالث', type: 'سنجل بلكونة', price: 950, notes: 'بلكونة دور ثالث' },
    { id: '302', floor: 'الدور الثالث', type: 'دابل بلكونة', price: 1350, notes: 'بلكونة مميزة' },
    { id: '303', floor: 'الدور الثالث', type: 'سرير كينج', price: 1550, notes: 'كينج فاخر' },
    { id: '304', floor: 'الدور الثالث', type: 'سرير كينج', price: 1550, notes: 'كينج فاخر' },
    { id: '305', floor: 'الدور الثالث', type: 'سرير كينج', price: 1550, notes: 'كينج واسعة' },
    { id: '306', floor: 'الدور الثالث', type: 'كينج بلكونة', price: 1650, notes: 'بلكونة جانبية' },
    { id: '307', floor: 'الدور الثالث', type: 'دابل جانبي', price: 1300, notes: 'شبك جانبي' },
    { id: '401', floor: 'الدور الرابع', type: 'سنجل بلكونة', price: 1000, notes: 'إطلالة روف علوية' },
    { id: '402', floor: 'الدور الرابع', type: 'دابل بلكونة', price: 1400, notes: 'بلكونة روف' },
    { id: '403', floor: 'الدور الرابع', type: 'سرير كينج', price: 1900, notes: 'إطلالة مميزة' },
    { id: '404', floor: 'الدور الرابع', type: 'سرير كينج', price: 1900, notes: 'كينج روف' },
    { id: '405', floor: 'الدور الرابع', type: 'دابل روف', price: 1350, notes: 'دابل روف' },
    { id: '406', floor: 'الدور الرابع', type: 'ترابل 3 أسرّة', price: 1900, notes: 'ترابل روف' },
    { id: '407', floor: 'الدور الرابع', type: 'دابل جانبي', price: 1350, notes: 'شبك جانبي' }
  ];

  // -------------------------------------------------------------
  // Sheet 0: إعدادات_النظام (Configuration Sheet for Universal Compatibility)
  // -------------------------------------------------------------
  const wsConfig = wb.addWorksheet('إعدادات_النظام', { state: 'hidden' });
  
  // Statuses in Col A
  const statuses = ['متاحة', 'ساكن', 'محجوزة', 'تحت التنظيف', 'صيانة'];
  statuses.forEach((s, idx) => {
    wsConfig.getCell(`A${idx + 1}`).value = s;
  });

  // Payment methods in Col B
  const payments = [
    'مؤكد - نقدي',
    'مؤكد - فيزا',
    'مؤكد - فودافون كاش',
    'مؤكد - بوكينج',
    'دفعة مقدمة',
    'معلق',
    'ملغي'
  ];
  payments.forEach((p, idx) => {
    wsConfig.getCell(`B${idx + 1}`).value = p;
  });

  // Register Global Defined Names (Works across all Excel versions & Locales)
  wb.definedNames.add('إعدادات_النظام!$A$1:$A$5', 'قائمة_حالات_الغرفة');
  wb.definedNames.add('إعدادات_النظام!$B$1:$B$7', 'طرق_الدفع');
  wb.definedNames.add('حالة_الغرف_والأسعار!$A$8:$A$60', 'قائمة_الغرف');

  // -------------------------------------------------------------
  // Sheet 1: حالة الغرف والأسعار
  // -------------------------------------------------------------
  const ws1 = wb.addWorksheet('حالة_الغرف_والأسعار', {
    views: [{ rightToLeft: true, showGridLines: true }]
  });

  // Banner
  ws1.mergeCells('A1:J1');
  const title1 = ws1.getCell('A1');
  title1.value = '🏨 لوحة متابعة حالة الغرف والأسعار الفورية (تلوين تلقائي للصف بالكامل حسب الحالة)';
  title1.font = { name: 'Segoe UI', size: 15, bold: true, color: { argb: 'FFFFFFFF' } };
  title1.fill = navyHeader;
  title1.alignment = { horizontal: 'center', vertical: 'middle' };
  ws1.getRow(1).height = 38;

  // KPI Dashboard Cards
  ws1.mergeCells('A3:B3');
  ws1.getCell('A3').value = 'إجمالي الغرف';
  ws1.getCell('A3').font = boldFont;
  ws1.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
  ws1.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.mergeCells('A4:B4');
  ws1.getCell('A4').value = { formula: 'COUNTA(A8:A60)', result: 25 };
  ws1.getCell('A4').font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FF0F172A' } };
  ws1.getCell('A4').alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.mergeCells('C3:D3');
  ws1.getCell('C3').value = 'غرف ساكنة (نزيل حالي)';
  ws1.getCell('C3').font = boldFont;
  ws1.getCell('C3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };
  ws1.getCell('C3').alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.mergeCells('C4:D4');
  ws1.getCell('C4').value = { formula: 'COUNTIF(E8:E60, "ساكن")', result: 0 };
  ws1.getCell('C4').font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FF1E40AF' } };
  ws1.getCell('C4').alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.mergeCells('E3:F3');
  ws1.getCell('E3').value = 'غرف محجوزة (قادمة)';
  ws1.getCell('E3').font = boldFont;
  ws1.getCell('E3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
  ws1.getCell('E3').alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.mergeCells('E4:F4');
  ws1.getCell('E4').value = { formula: 'COUNTIF(E8:E60, "محجوزة")', result: 0 };
  ws1.getCell('E4').font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFDC2626' } };
  ws1.getCell('E4').alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.getCell('G3').value = 'غرف متاحة';
  ws1.getCell('G3').font = boldFont;
  ws1.getCell('G3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
  ws1.getCell('G3').alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.getCell('G4').value = { formula: 'COUNTIF(E8:E60, "متاحة")', result: 25 };
  ws1.getCell('G4').font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FF16A34A' } };
  ws1.getCell('G4').alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.getCell('H3').value = 'نسبة الإشغال';
  ws1.getCell('H3').font = boldFont;
  ws1.getCell('H3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
  ws1.getCell('H3').alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.getCell('H4').value = { formula: 'IF(A4>0, (C4+E4)/A4, 0)', result: 0 };
  ws1.getCell('H4').numFmt = '0.0%';
  ws1.getCell('H4').font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFD97706' } };
  ws1.getCell('H4').alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.mergeCells('I3:J3');
  ws1.getCell('I3').value = 'إجمالي المحصل (ج.م)';
  ws1.getCell('I3').font = boldFont;
  ws1.getCell('I3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };
  ws1.getCell('I3').alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.mergeCells('I4:J4');
  ws1.getCell('I4').value = { formula: 'SUM(I8:I60)', result: 0 };
  ws1.getCell('I4').numFmt = '#,##0 "ج.م"';
  ws1.getCell('I4').font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FF2563EB' } };
  ws1.getCell('I4').alignment = { horizontal: 'center', vertical: 'middle' };

  [3, 4].forEach(r => {
    ws1.getRow(r).height = 24;
    for (let c = 1; c <= 10; c++) ws1.getRow(r).getCell(c).border = thinBorder;
  });

  // Table Headers
  const h1 = [
    'رقم الغرفة', 'الدور / الطابق', 'نوع الغرفة', 'السعر لليلة (ج.م)', 
    'حالة الغرفة (قائمة منسدلة)', 'اسم النزيل الحالي', 'تاريخ الدخول', 'تاريخ الخروج', 'المبلغ المدفوع (ج.م)', 'ملاحظات'
  ];
  const headRow1 = ws1.getRow(7);
  headRow1.height = 28;
  h1.forEach((name, i) => {
    const c = headRow1.getCell(i + 1);
    c.value = name;
    c.fill = navyHeader;
    c.font = whiteBold;
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = thinBorder;
  });

  const startRow = 8;
  const maxRoomsCount = 50;

  for (let idx = 0; idx < maxRoomsCount; idx++) {
    const rIdx = startRow + idx;
    const row = ws1.getRow(rIdx);
    row.height = 22;

    const r = initialRooms[idx];
    if (r) {
      row.getCell(1).value = r.id;
      row.getCell(2).value = r.floor;
      row.getCell(3).value = r.type;
      row.getCell(4).value = r.price;
      row.getCell(4).numFmt = '#,##0 "ج.م"';
      row.getCell(10).value = r.notes || '';
    } else {
      row.getCell(1).value = '';
      row.getCell(2).value = '';
      row.getCell(3).value = '';
      row.getCell(4).value = '';
      row.getCell(4).numFmt = '#,##0 "ج.م"';
      row.getCell(10).value = '';
    }

    // Status: Dropdown referencing the Named Range 'قائمة_حالات_الغرفة'
    const statusCell = row.getCell(5);
    statusCell.value = r ? 'متاحة' : '';
    statusCell.dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['قائمة_حالات_الغرفة']
    };
    statusCell.font = { name: 'Segoe UI', size: 10, bold: true };

    // Guest Name: fetched from Bookings sheet
    row.getCell(6).value = {
      formula: `IF(A${rIdx}="","", IFERROR(INDEX(سجل_الحجوزات!$E$4:$E$100, MATCH(A${rIdx}, سجل_الحجوزات!$B$4:$B$100, 0)), "-"))`,
      result: r ? '-' : ''
    };

    // Check-in: fetched from Bookings sheet
    row.getCell(7).value = {
      formula: `IF(A${rIdx}="","", IFERROR(INDEX(سجل_الحجوزات!$G$4:$G$100, MATCH(A${rIdx}, سجل_الحجوزات!$B$4:$B$100, 0)), "-"))`,
      result: r ? '-' : ''
    };

    // Check-out: fetched from Bookings sheet
    row.getCell(8).value = {
      formula: `IF(A${rIdx}="","", IFERROR(INDEX(سجل_الحجوزات!$H$4:$H$100, MATCH(A${rIdx}, سجل_الحجوزات!$B$4:$B$100, 0)), "-"))`,
      result: r ? '-' : ''
    };

    // Paid amount: summed from Bookings sheet
    row.getCell(9).value = {
      formula: `IF(A${rIdx}="","", SUMIF(سجل_الحجوزات!$B$4:$B$100, A${rIdx}, سجل_الحجوزات!$L$4:$L$100))`,
      result: r ? 0 : ''
    };
    row.getCell(9).numFmt = '#,##0 "ج.م"';

    const defaultFill = r ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } } : null;

    for (let c = 1; c <= 10; c++) {
      const cell = row.getCell(c);
      cell.border = thinBorder;
      if (defaultFill) cell.fill = defaultFill;
      cell.font = (c === 1 || c === 5) ? boldFont : cellFont;
      if ([1, 2, 5, 7, 8].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if ([4, 9].includes(c)) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      }
    }
  }

  // Summary Row
  const totalRowIdx = startRow + maxRoomsCount;
  const sumRow1 = ws1.getRow(totalRowIdx);
  sumRow1.height = 26;
  ws1.mergeCells(`A${totalRowIdx}:C${totalRowIdx}`);
  sumRow1.getCell(1).value = 'الإجمالي العام للغرف المسجلة';
  sumRow1.getCell(1).font = whiteBold;
  sumRow1.getCell(1).fill = navyHeader;
  sumRow1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  sumRow1.getCell(4).value = { formula: `AVERAGE(D8:D${totalRowIdx - 1})` };
  sumRow1.getCell(4).numFmt = '#,##0 "ج.م" (متوسط)';
  sumRow1.getCell(4).font = boldFont;
  sumRow1.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
  sumRow1.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };

  ws1.mergeCells(`E${totalRowIdx}:H${totalRowIdx}`);
  sumRow1.getCell(5).value = 'إجمالي الإيراد المسدد حالياً:';
  sumRow1.getCell(5).font = boldFont;
  sumRow1.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
  sumRow1.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };

  sumRow1.getCell(9).value = { formula: `SUM(I8:I${totalRowIdx - 1})`, result: 0 };
  sumRow1.getCell(9).numFmt = '#,##0 "ج.م"';
  sumRow1.getCell(9).font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF166534' } };
  sumRow1.getCell(9).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
  sumRow1.getCell(9).alignment = { horizontal: 'right', vertical: 'middle' };

  sumRow1.getCell(10).value = 'مربوط تلقائياً';
  sumRow1.getCell(10).alignment = { horizontal: 'center', vertical: 'middle' };
  sumRow1.getCell(10).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
  for (let c = 1; c <= 10; c++) sumRow1.getCell(c).border = thinBorder;

  ws1.columns = [
    { width: 14 }, { width: 16 }, { width: 22 }, { width: 18 }, { width: 22 },
    { width: 25 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 25 }
  ];

  // Full Row Conditional Formatting
  ws1.addConditionalFormatting({
    ref: `A8:J${totalRowIdx - 1}`,
    rules: [
      {
        type: 'expression',
        formulae: ['=$E8="ساكن"'],
        style: {
          fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDBEAFE' } },
          font: { color: { argb: 'FF1E40AF' } }
        }
      },
      {
        type: 'expression',
        formulae: ['=$E8="محجوزة"'],
        style: {
          fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFEE2E2' } },
          font: { color: { argb: 'FF991B1B' } }
        }
      },
      {
        type: 'expression',
        formulae: ['=$E8="متاحة"'],
        style: {
          fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDCFCE7' } },
          font: { color: { argb: 'FF166534' } }
        }
      },
      {
        type: 'expression',
        formulae: ['=$E8="تحت التنظيف"'],
        style: {
          fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFEF3C7' } },
          font: { color: { argb: 'FF92400E' } }
        }
      },
      {
        type: 'expression',
        formulae: ['=$E8="صيانة"'],
        style: {
          fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFF1F5F9' } },
          font: { color: { argb: 'FF475569' } }
        }
      }
    ]
  });

  // -------------------------------------------------------------
  // Sheet 2: سجل الحجوزات
  // -------------------------------------------------------------
  const ws2 = wb.addWorksheet('سجل_الحجوزات', {
    views: [{ rightToLeft: true, showGridLines: true }]
  });

  ws2.mergeCells('A1:N1');
  const t2 = ws2.getCell('A1');
  t2.value = '📋 سجل وتفاصيل حجوزات النزلاء ومتابعة الحسابات (فارغ وجاهز لتسجيل الحجوزات)';
  t2.font = { name: 'Segoe UI', size: 15, bold: true, color: { argb: 'FFFFFFFF' } };
  t2.fill = tealHeader;
  t2.alignment = { horizontal: 'center', vertical: 'middle' };
  ws2.getRow(1).height = 36;

  const h2 = [
    'رقم الحجز', 'رقم الغرفة (قائمة)', 'الدور (تلقائي)', 'نوع الغرفة (تلقائي)', 
    'اسم النزيل', 'رقم الهاتف', 'تاريخ الدخول', 'تاريخ الخروج', 
    'عدد الليالي (تلقائي)', 'سعر الليلة (تلقائي)', 'الإجمالي المطلوب (ج.م)', 
    'المبلغ المسدد (ج.م)', 'المتبقي (ج.م)', 'طريقة الدفع والحالة'
  ];

  const headRow2 = ws2.getRow(3);
  headRow2.height = 28;
  h2.forEach((name, i) => {
    const c = headRow2.getCell(i + 1);
    c.value = name;
    c.fill = tealHeader;
    c.font = whiteBold;
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = thinBorder;
  });

  const bRowStart = 4;
  const totalBookingRows = 60;

  for (let idx = 1; idx <= totalBookingRows; idx++) {
    const rIdx = bRowStart + idx - 1;
    const row = ws2.getRow(rIdx);
    row.height = 22;

    row.getCell(1).value = `BK-${String(idx).padStart(3, '0')}`;

    // Room dropdown using the Named Range 'قائمة_الغرف'
    row.getCell(2).value = '';
    row.getCell(2).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['قائمة_الغرف']
    };

    // Auto Floor
    row.getCell(3).value = {
      formula: `IF(B${rIdx}="","", IFERROR(VLOOKUP(B${rIdx}, حالة_الغرف_والأسعار!$A$8:$D$60, 2, FALSE), ""))`
    };

    // Auto Room Type
    row.getCell(4).value = {
      formula: `IF(B${rIdx}="","", IFERROR(VLOOKUP(B${rIdx}, حالة_الغرف_والأسعار!$A$8:$D$60, 3, FALSE), ""))`
    };

    row.getCell(5).value = '';
    row.getCell(6).value = '';
    row.getCell(7).value = '';
    row.getCell(8).value = '';

    // Nights
    row.getCell(9).value = {
      formula: `IF(AND(G${rIdx}<>"", H${rIdx}<>""), H${rIdx}-G${rIdx}, "")`
    };

    // Base Rate
    row.getCell(10).value = {
      formula: `IF(B${rIdx}="","", IFERROR(VLOOKUP(B${rIdx}, حالة_الغرف_والأسعار!$A$8:$D$60, 4, FALSE), 0))`
    };
    row.getCell(10).numFmt = '#,##0';

    // Total = Nights * Rate
    row.getCell(11).value = {
      formula: `IF(AND(I${rIdx}>0, J${rIdx}>0), I${rIdx}*J${rIdx}, 0)`,
      result: 0
    };
    row.getCell(11).numFmt = '#,##0 "ج.م"';

    // Paid
    row.getCell(12).value = 0;
    row.getCell(12).numFmt = '#,##0 "ج.م"';

    // Remaining = Total - Paid
    row.getCell(13).value = {
      formula: `IF(K${rIdx}>0, K${rIdx}-L${rIdx}, 0)`,
      result: 0
    };
    row.getCell(13).numFmt = '#,##0 "ج.م"';

    // Payment method dropdown using the Named Range 'طرق_الدفع'
    row.getCell(14).value = '';
    row.getCell(14).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['طرق_الدفع']
    };

    for (let c = 1; c <= 14; c++) {
      const cell = row.getCell(c);
      cell.border = thinBorder;
      cell.font = cellFont;
      if ([1, 2, 3, 7, 8, 9, 14].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if ([10, 11, 12, 13].includes(c)) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      }
    }
  }

  // Summary Row in Bookings
  const lastBRow = bRowStart + totalBookingRows;
  const sumRow2 = ws2.getRow(lastBRow);
  sumRow2.height = 28;
  ws2.mergeCells(`A${lastBRow}:J${lastBRow}`);
  sumRow2.getCell(1).value = 'إجمالي الحسابات والمبالغ للحجوزات المسجلة:';
  sumRow2.getCell(1).font = whiteBold;
  sumRow2.getCell(1).fill = navyHeader;
  sumRow2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  sumRow2.getCell(11).value = { formula: `SUM(K4:K${lastBRow - 1})`, result: 0 };
  sumRow2.getCell(11).numFmt = '#,##0 "ج.م"';
  sumRow2.getCell(11).font = boldFont;
  sumRow2.getCell(11).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };

  sumRow2.getCell(12).value = { formula: `SUM(L4:L${lastBRow - 1})`, result: 0 };
  sumRow2.getCell(12).numFmt = '#,##0 "ج.م"';
  sumRow2.getCell(12).font = boldFont;
  sumRow2.getCell(12).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };

  sumRow2.getCell(13).value = { formula: `SUM(M4:M${lastBRow - 1})`, result: 0 };
  sumRow2.getCell(13).numFmt = '#,##0 "ج.م"';
  sumRow2.getCell(13).font = boldFont;
  sumRow2.getCell(13).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };

  sumRow2.getCell(14).value = 'مطابق تلقائياً';
  sumRow2.getCell(14).font = boldFont;
  sumRow2.getCell(14).alignment = { horizontal: 'center', vertical: 'middle' };
  sumRow2.getCell(14).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };

  for (let c = 1; c <= 14; c++) sumRow2.getCell(c).border = thinBorder;

  ws2.columns = [
    { width: 14 }, { width: 16 }, { width: 16 }, { width: 22 }, { width: 25 },
    { width: 18 }, { width: 14 }, { width: 14 }, { width: 16 }, { width: 18 },
    { width: 20 }, { width: 18 }, { width: 18 }, { width: 24 }
  ];

  // -------------------------------------------------------------
  // Sheet 3: دليل أنواع الغرف والأسعار
  // -------------------------------------------------------------
  const ws3 = wb.addWorksheet('دليل_الأنواع_والأسعار', {
    views: [{ rightToLeft: true, showGridLines: true }]
  });

  ws3.mergeCells('A1:F1');
  const t3 = ws3.getCell('A1');
  t3.value = '🏷️ قائمة تصنيف أنواع الغرف والأسعار المعتمدة بالفندق';
  t3.font = { name: 'Segoe UI', size: 15, bold: true, color: { argb: 'FFFFFFFF' } };
  t3.fill = goldHeader;
  t3.alignment = { horizontal: 'center', vertical: 'middle' };
  ws3.getRow(1).height = 36;

  const h3 = ['م', 'نوع الغرفة', 'سعة الأفراد', 'مواصفات الأسرّة', 'سعر الليلة المقترح (ج.م)', 'ملاحظات وتجهيزات'];
  const headRow3 = ws3.getRow(3);
  headRow3.height = 26;
  h3.forEach((name, i) => {
    const c = headRow3.getCell(i + 1);
    c.value = name;
    c.fill = goldHeader;
    c.font = whiteBold;
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = thinBorder;
  });

  const roomTypesData = [
    { no: 1, type: 'سنجل بلكونة (Single)', cap: '1 فرد', beds: '1 سرير سنجل', price: '900 - 1,000 ج.م', notes: 'بلكونة خارجية مطلة' },
    { no: 2, type: 'دابل قياسي (Double)', cap: '2 فرد', beds: '1 سرير دابل', price: '1,200 - 1,350 ج.م', notes: 'تكييف + شاشة + حمام خاص' },
    { no: 3, type: 'دابل بلكونة (Double Balcony)', cap: '2 فرد', beds: '1 سرير دابل', price: '1,300 - 1,400 ج.م', notes: 'بلكونة خاصة وتراس' },
    { no: 4, type: 'سرير كينج فاخر (King Room)', cap: '2 فرد', beds: '1 سرير كينج كبير', price: '1,400 - 1,900 ج.م', notes: 'مساحة واسعة + جلسة خاصة' },
    { no: 5, type: 'ترابل عائلي (Triple)', cap: '3 أفراد', beds: '3 أسرّة فردية', price: '1,800 - 1,900 ج.م', notes: 'مثالية للعائلات والمجموعات' },
    { no: 6, type: 'سويت عائلي فاخر (Suite)', cap: '3-4 أفراد', beds: '1 كينج + صالة جلوس', price: '2,500 ج.م', notes: 'أعلى فئة مع صالة ضيافة' }
  ];

  roomTypesData.forEach((rt, idx) => {
    const rIdx = 4 + idx;
    const row = ws3.getRow(rIdx);
    row.height = 24;
    row.getCell(1).value = rt.no;
    row.getCell(2).value = rt.type;
    row.getCell(3).value = rt.cap;
    row.getCell(4).value = rt.beds;
    row.getCell(5).value = rt.price;
    row.getCell(6).value = rt.notes;

    for (let c = 1; c <= 6; c++) {
      const cell = row.getCell(c);
      cell.border = thinBorder;
      cell.font = cellFont;
      if ([1, 3].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (c === 5) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = boldFont;
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      }
    }
  });

  ws3.columns = [
    { width: 8 }, { width: 28 }, { width: 16 }, { width: 24 }, { width: 24 }, { width: 35 }
  ];

  // Save the Excel file inside the portable folder
  const portableExcelPath = path.join(packageDir, 'جدول_حجز_الغرف_الفندقي_الشامل.xlsx');
  await wb.xlsx.writeFile(portableExcelPath);
  console.log('Portable Excel saved to:', portableExcelPath);

  // Also save to root workspace files
  const rootExcelPath = path.join(__dirname, 'جدول_حجز_الغرف_الذكي_المترابط.xlsx');
  try {
    await wb.xlsx.writeFile(rootExcelPath);
    console.log('Root Excel updated:', rootExcelPath);
  } catch (e) {
    console.log('Notice root excel locked:', e.message);
  }

  // -------------------------------------------------------------
  // 2. Copy the Standalone Visual HTML Web System
  // -------------------------------------------------------------
  const srcHtml = path.join(__dirname, 'برنامج_حجز_الفندق.html');
  const destHtml = path.join(packageDir, 'برنامج_حجز_الغرف_التفاعلي.html');
  if (fs.existsSync(srcHtml)) {
    fs.copyFileSync(srcHtml, destHtml);
    console.log('HTML app copied to portable folder:', destHtml);
  }

  // -------------------------------------------------------------
  // 3. Write Clear Instructions Guide (README & guide.txt)
  // -------------------------------------------------------------
  const guideText = `================================================================================
🏨 نظام حجز الغرف الفندقي المحمول - فندق هينو (Henu Hotel PMS)
================================================================================

مرحباً بك! هذا المجلد يحتوي على النظام المتكامل لحجز الغرف، وهو مصمم ليعمل على 
أي جهاز كمبيوتر آخر، أو لابتوب، أو فلاش ميموري (USB) دون الحاجة لتثبيت أي برامج إضافية.

--------------------------------------------------------------------------------
📁 محتويات هذا المجلد:
--------------------------------------------------------------------------------
1. [ جدول_حجز_الغرف_الفندقي_الشامل.xlsx ]
   - ملف الإكسيل الرئيسي والشامل لحجز الغرف.
   - يحتوي على 3 أوراق عمل:
     * ورقة 1 (حالة_الغرف_والأسعار): لمتابعة الـ 25 غرفة، وتلوين الصفوف تلقائياً 
       (أزرق للساكن، أحمر للمحجوز، أخضر للمتاح، أصفر للتنظيف، رمادي للصيانة).
     * ورقة 2 (سجل_الحجوزات): لتسجيل بيانات النزلاء والحسابات والمدفوعات والمتبقي.
     * ورقة 3 (دليل_الأنواع_والأسعار): مرجع تصنيف الغرف والأسعار وسعة الأفراد.
   - تم ضبط الملف ليعمل مع جميع إصدارات الإكسيل والأجهزة الأخرى مع حساب تلقائي 
     فوري للمعادلات والقوائم المنسدلة بدون أي أخطاء فواصل.

2. [ برنامج_حجز_الغرف_التفاعلي.html ]
   - نظام واجهة ويب تفاعلية فائقة السرعة تعمل بضغطة زر (Double Click).
   - تفتح في أي متصفح (Google Chrome, Microsoft Edge, Firefox, Safari).
   - ميزة هذا الملف: يعمل على أي جهاز حتى لو لم يكن مثبتاً عليه برنامج Microsoft Excel!
   - يتيح لك البحث عن الغرف، وتسكين النزلاء، وتغيير الحالات، وطباعة الفواتير.

--------------------------------------------------------------------------------
⚙️ تعليمات هامة عند فتح ملف الإكسيل على جهاز كمبيوتر جديد:
--------------------------------------------------------------------------------
1. عند فتح الملف لأول مرة، إذا ظهر شريط أصفر بالأعلى يطلب:
   [ Enable Editing / تمكين التحرير ] أو [ Enable Content / تمكين المحتوى ]
   يرجى الضغط عليه للموافقة حتى تعمل القوائم المنسدلة والتلوين التلقائي.

2. إذا كنت تنقل المجلد عبر فلاش ميموري (USB):
   يُفضل نسخ المجلد بالكامل ولصقه على سطح المكتب (Desktop) أو القرص (D أو C)
   على الجهاز الجديد قبل فتحه لضمان سرعة الحفظ التلقائي.

--------------------------------------------------------------------------------
📞 الدعم والاستخدام:
النظام جاهز تماماً للتشغيل المباشر 100%.
`;

  fs.writeFileSync(path.join(packageDir, 'دليل_التشغيل_على_أي_جهاز.txt'), guideText, 'utf8');
  fs.writeFileSync(path.join(packageDir, 'README.txt'), guideText, 'utf8');

  console.log('SUCCESS: Portable hotel package completely assembled at:', packageDir);
}

buildPortableHotelPackage().catch(err => {
  console.error('ERROR building package:', err);
});
