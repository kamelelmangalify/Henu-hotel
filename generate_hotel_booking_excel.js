const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function createHotelBookingExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Henu Hotel PMS';
  workbook.lastModifiedBy = 'Henu Hotel PMS';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Colors & Styles
  const primaryHeaderFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E293B' } // Dark Slate
  };
  const goldHeaderFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD97706' } // Amber / Gold
  };
  const floorHeaderFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF334155' }
  };
  const whiteFontBold = {
    name: 'Segoe UI',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' }
  };
  const regularFont = {
    name: 'Segoe UI',
    size: 10
  };
  const boldFont = {
    name: 'Segoe UI',
    size: 10,
    bold: true
  };
  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
  };

  const roomsData = [
    // الدور الأول (4 غرف)
    { id: '101', floor: 'الدور الأول', type: 'دابل شبك', beds: '1 سرير دابل', price: 1200, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'شباك شبك' },
    { id: '102', floor: 'الدور الأول', type: 'سرير كينج', beds: '1 سرير كينج', price: 1400, status: 'مشغولة', guest: 'أحمد محمود العبد', phone: '01012345678', checkin: '2026-08-20', checkout: '2026-08-25', paid: 7000, notes: 'سرير كينج مريح' },
    { id: '103', floor: 'الدور الأول', type: 'سويت', beds: '1 سرير كينج + صالة', price: 2500, status: 'مشغولة', guest: 'د. طارق علي السيد', phone: '01122334455', checkin: '2026-08-22', checkout: '2026-08-27', paid: 12500, notes: 'سويت عائلي فاخر' },
    { id: '104', floor: 'الدور الأول', type: 'كينج شبك', beds: '1 سرير كينج', price: 1500, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'كينج شبك' },

    // الدور الثاني (7 غرف)
    { id: '201', floor: 'الدور الثاني', type: 'سنجل بلكونة', beds: '1 سرير سنجل', price: 900, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'بلكونة خارجية' },
    { id: '202', floor: 'الدور الثاني', type: 'دابل بلكونة', beds: '1 سرير دابل', price: 1300, status: 'مشغولة', guest: 'جون سميث (John Smith)', phone: '+447911123456', checkin: '2026-08-21', checkout: '2026-08-26', paid: 6500, notes: 'سائح إنجليزي' },
    { id: '203', floor: 'الدور الثاني', type: 'دابل', beds: '1 سرير دابل', price: 1200, status: 'تحت التنظيف', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'تجهيز مفروشات' },
    { id: '204', floor: 'الدور الثاني', type: 'سرير كينج', beds: '1 سرير كينج', price: 1500, status: 'مشغولة', guest: 'سارة إبراهيم الشريف', phone: '01299887766', checkin: '2026-08-23', checkout: '2026-08-28', paid: 7500, notes: 'حجز مؤكد' },
    { id: '205', floor: 'الدور الثاني', type: 'دابل', beds: '1 سرير دابل', price: 1200, status: 'صيانة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'فحص التكييف' },
    { id: '206', floor: 'الدور الثاني', type: 'ترابل شبك جانبي', beds: '3 أسرّة فردي', price: 1800, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'غرفة عائلية 3 سراير' },
    { id: '207', floor: 'الدور الثاني', type: 'دابل شبك جانبي', beds: '1 سرير دابل', price: 1250, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'إطلالة جانبية' },

    // الدور الثالث (7 غرف)
    { id: '301', floor: 'الدور الثالث', type: 'سنجل بلكونة', beds: '1 سرير سنجل', price: 950, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'بلكونة دور ثالث' },
    { id: '302', floor: 'الدور الثالث', type: 'دابل بلكونة', beds: '1 سرير دابل', price: 1350, status: 'مشغولة', guest: 'م. خالد عبد الرحمن', phone: '01005544332', checkin: '2026-08-20', checkout: '2026-08-26', paid: 8100, notes: 'حجز أسبوع' },
    { id: '303', floor: 'الدور الثالث', type: 'سرير كينج', beds: '1 سرير كينج', price: 1550, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'جاهزة للتسكين' },
    { id: '304', floor: 'الدور الثالث', type: 'سرير كينج', beds: '1 سرير كينج', price: 1550, status: 'مشغولة', guest: 'أليكسيس دوفال (Alexis Duval)', phone: '+33612345678', checkin: '2026-08-22', checkout: '2026-08-29', paid: 10850, notes: 'سياحة فرنسية' },
    { id: '305', floor: 'الدور الثالث', type: 'سرير كينج', beds: '1 سرير كينج', price: 1550, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'كينج واسعة' },
    { id: '306', floor: 'الدور الثالث', type: 'كنيج بلكونة جانبي', beds: '1 سرير كينج', price: 1650, status: 'تحت التنظيف', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'بلكونة جانبية' },
    { id: '307', floor: 'الدور الثالث', type: 'دبل شبك جانبي', beds: '1 سرير دابل', price: 1300, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'شبك جانبي' },

    // الدور الرابع (7 غرف)
    { id: '401', floor: 'الدور الرابع', type: 'سنجل بلكونة', beds: '1 سرير سنجل', price: 1000, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'إطلالة علوية' },
    { id: '402', floor: 'الدور الرابع', type: 'دابل بلكونة', beds: '1 سرير دابل', price: 1400, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'بلكونة روف' },
    { id: '403', floor: 'الدور الرابع', type: 'سرير كينج', beds: '1 سرير كينج', price: 1900, status: 'مشغولة', guest: 'عمر الفاروق الباز', phone: '01111223344', checkin: '2026-08-19', checkout: '2026-08-25', paid: 11400, notes: 'إطلالة مميزة' },
    { id: '404', floor: 'الدور الرابع', type: 'سرير كينج', beds: '1 سرير كينج', price: 1900, status: 'مشغولة', guest: 'ماريا كوستاس (Maria)', phone: '+30691234567', checkin: '2026-08-21', checkout: '2026-08-27', paid: 11400, notes: 'سائحة يونانية' },
    { id: '405', floor: 'الدور الرابع', type: 'دابل', beds: '1 سرير دابل', price: 1350, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'دابل روف' },
    { id: '406', floor: 'الدور الرابع', type: 'ترابل شبك جانبي', beds: '3 أسرّة فردي', price: 1900, status: 'صيانة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'صيانة سباكة' },
    { id: '407', floor: 'الدور الرابع', type: 'دابل شبك جانبي', beds: '1 سرير دابل', price: 1350, status: 'متاحة', guest: '', phone: '', checkin: '', checkout: '', paid: 0, notes: 'شبك جانبي' }
  ];

  // -------------------------------------------------------------
  // 1. SHEET: لوحة التحكم وحالة الغرف الحالية (Room Status Dashboard)
  // -------------------------------------------------------------
  const wsStatus = workbook.addWorksheet('حالة الغرف الحالية', {
    views: [{ rightToLeft: true, showGridLines: true }]
  });

  // Title Banner
  wsStatus.mergeCells('A1:L1');
  const titleCell = wsStatus.getCell('A1');
  titleCell.value = '🏨 نظام حجز وإدارة غرف فندق هينو (Henu Hotel) - إجمالي 25 غرفة';
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = primaryHeaderFill;
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  wsStatus.getRow(1).height = 40;

  // Subtitle / Date
  wsStatus.mergeCells('A2:L2');
  const subCell = wsStatus.getCell('A2');
  subCell.value = `تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })} | التوزيع حسب الأدوار والأنواع`;
  subCell.font = { name: 'Segoe UI', size: 11, italic: true, color: { argb: 'FF475569' } };
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  wsStatus.getRow(2).height = 25;

  // KPIs
  wsStatus.mergeCells('B4:C4');
  wsStatus.getCell('B4').value = 'إجمالي الغرف';
  wsStatus.getCell('B4').font = boldFont;
  wsStatus.getCell('B4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
  wsStatus.getCell('B4').alignment = { horizontal: 'center', vertical: 'middle' };

  wsStatus.mergeCells('B5:C5');
  wsStatus.getCell('B5').value = 25;
  wsStatus.getCell('B5').font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FF1E293B' } };
  wsStatus.getCell('B5').alignment = { horizontal: 'center', vertical: 'middle' };

  wsStatus.mergeCells('D4:E4');
  wsStatus.getCell('D4').value = 'الغرف المشغولة';
  wsStatus.getCell('D4').font = boldFont;
  wsStatus.getCell('D4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
  wsStatus.getCell('D4').alignment = { horizontal: 'center', vertical: 'middle' };

  wsStatus.mergeCells('D5:E5');
  wsStatus.getCell('D5').value = { formula: 'COUNTIF(E8:E35, "مشغولة")' };
  wsStatus.getCell('D5').font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FFDC2626' } };
  wsStatus.getCell('D5').alignment = { horizontal: 'center', vertical: 'middle' };

  wsStatus.mergeCells('F4:G4');
  wsStatus.getCell('F4').value = 'الغرف المتاحة';
  wsStatus.getCell('F4').font = boldFont;
  wsStatus.getCell('F4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
  wsStatus.getCell('F4').alignment = { horizontal: 'center', vertical: 'middle' };

  wsStatus.mergeCells('F5:G5');
  wsStatus.getCell('F5').value = { formula: 'COUNTIF(E8:E35, "متاحة")' };
  wsStatus.getCell('F5').font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FF16A34A' } };
  wsStatus.getCell('F5').alignment = { horizontal: 'center', vertical: 'middle' };

  wsStatus.mergeCells('H4:I4');
  wsStatus.getCell('H4').value = 'نسبة الإشغال الحالية';
  wsStatus.getCell('H4').font = boldFont;
  wsStatus.getCell('H4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
  wsStatus.getCell('H4').alignment = { horizontal: 'center', vertical: 'middle' };

  wsStatus.mergeCells('H5:I5');
  wsStatus.getCell('H5').value = { formula: 'D5/B5' };
  wsStatus.getCell('H5').numFmt = '0.0%';
  wsStatus.getCell('H5').font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FFD97706' } };
  wsStatus.getCell('H5').alignment = { horizontal: 'center', vertical: 'middle' };

  wsStatus.mergeCells('J4:L4');
  wsStatus.getCell('J4').value = 'إجمالي الإيرادات المحصلة (ج.م)';
  wsStatus.getCell('J4').font = boldFont;
  wsStatus.getCell('J4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };
  wsStatus.getCell('J4').alignment = { horizontal: 'center', vertical: 'middle' };

  wsStatus.mergeCells('J5:L5');
  wsStatus.getCell('J5').value = { formula: 'SUM(K8:K35)' };
  wsStatus.getCell('J5').numFmt = '#,##0 "ج.م"';
  wsStatus.getCell('J5').font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FF2563EB' } };
  wsStatus.getCell('J5').alignment = { horizontal: 'center', vertical: 'middle' };

  [4, 5].forEach(r => {
    wsStatus.getRow(r).height = 25;
    for (let c = 2; c <= 12; c++) {
      wsStatus.getRow(r).getCell(c).border = thinBorder;
    }
  });

  // Headers
  const statusHeaders = [
    'م', 'رقم الغرفة', 'الدور', 'نوع الغرفة', 'حالة الغرفة', 
    'سعر الليلة (ج.م)', 'اسم النزيل الحالي', 'رقم الهاتف', 'تاريخ الوصول', 'تاريخ المغادرة', 'المبلغ المسدد (ج.م)', 'ملاحظات'
  ];

  const headerRow = wsStatus.getRow(7);
  headerRow.height = 30;
  statusHeaders.forEach((h, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = h;
    cell.fill = primaryHeaderFill;
    cell.font = whiteFontBold;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = thinBorder;
  });

  let currentRowIdx = 8;
  let currentFloor = '';

  roomsData.forEach((room, idx) => {
    // Floor separator if changed
    if (room.floor !== currentFloor) {
      currentFloor = room.floor;
      wsStatus.mergeCells(`A${currentRowIdx}:L${currentRowIdx}`);
      const fCell = wsStatus.getCell(`A${currentRowIdx}`);
      fCell.value = `📍 ${currentFloor}`;
      fCell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      fCell.fill = floorHeaderFill;
      fCell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      wsStatus.getRow(currentRowIdx).height = 24;
      for (let c = 1; c <= 12; c++) {
        wsStatus.getRow(currentRowIdx).getCell(c).border = thinBorder;
      }
      currentRowIdx++;
    }

    const row = wsStatus.getRow(currentRowIdx);
    row.height = 22;

    row.getCell(1).value = idx + 1;
    row.getCell(2).value = room.id;
    row.getCell(3).value = room.floor;
    row.getCell(4).value = room.type;
    row.getCell(5).value = room.status;
    row.getCell(6).value = room.price;
    row.getCell(6).numFmt = '#,##0 "ج.م"';
    row.getCell(7).value = room.guest || '-';
    row.getCell(8).value = room.phone || '-';
    row.getCell(9).value = room.checkin || '-';
    row.getCell(10).value = room.checkout || '-';
    row.getCell(11).value = room.paid || 0;
    row.getCell(11).numFmt = '#,##0 "ج.م"';
    row.getCell(12).value = room.notes || '';

    // Status coloring
    const statusCell = row.getCell(5);
    if (room.status === 'مشغولة') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
      statusCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF991B1B' } };
    } else if (room.status === 'متاحة') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
      statusCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF166534' } };
    } else if (room.status === 'تحت التنظيف') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
      statusCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF92400E' } };
    } else {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
      statusCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF475569' } };
    }

    for (let c = 1; c <= 12; c++) {
      const cell = row.getCell(c);
      cell.border = thinBorder;
      if (c !== 5) cell.font = regularFont;
      if ([1, 2, 3, 5, 8, 9, 10].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if ([6, 11].includes(c)) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      }
    }

    currentRowIdx++;
  });

  // Total summary row
  const sumRow = wsStatus.getRow(currentRowIdx);
  sumRow.height = 28;
  wsStatus.mergeCells(`A${currentRowIdx}:E${currentRowIdx}`);
  sumRow.getCell(1).value = 'الإجمالي العام لجميع الغرف (25 غرفة)';
  sumRow.getCell(1).font = whiteFontBold;
  sumRow.getCell(1).fill = primaryHeaderFill;
  sumRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  sumRow.getCell(6).value = { formula: `AVERAGE(F8:F${currentRowIdx - 1})` };
  sumRow.getCell(6).numFmt = '#,##0 "ج.م" (متوسط)';
  sumRow.getCell(6).font = boldFont;
  sumRow.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
  sumRow.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' };

  wsStatus.mergeCells(`G${currentRowIdx}:J${currentRowIdx}`);
  sumRow.getCell(7).value = 'إجمالي المحصل:';
  sumRow.getCell(7).font = boldFont;
  sumRow.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };
  sumRow.getCell(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };

  sumRow.getCell(11).value = { formula: `SUM(K8:K${currentRowIdx - 1})` };
  sumRow.getCell(11).numFmt = '#,##0 "ج.م"';
  sumRow.getCell(11).font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF166534' } };
  sumRow.getCell(11).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
  sumRow.getCell(11).alignment = { horizontal: 'right', vertical: 'middle' };

  sumRow.getCell(12).value = 'نظام محدث تلقائياً';
  sumRow.getCell(12).font = boldFont;
  sumRow.getCell(12).alignment = { horizontal: 'center', vertical: 'middle' };
  sumRow.getCell(12).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };

  for (let c = 1; c <= 12; c++) {
    sumRow.getCell(c).border = thinBorder;
  }

  // Column widths
  wsStatus.columns = [
    { width: 6 },  // م
    { width: 14 }, // رقم الغرفة
    { width: 16 }, // الدور
    { width: 22 }, // نوع الغرفة
    { width: 15 }, // حالة الغرفة
    { width: 18 }, // سعر الليلة
    { width: 28 }, // اسم النزيل
    { width: 18 }, // رقم الهاتف
    { width: 15 }, // تاريخ الوصول
    { width: 15 }, // تاريخ المغادرة
    { width: 20 }, // المبلغ المسدد
    { width: 30 }  // ملاحظات
  ];

  // -------------------------------------------------------------
  // 2. SHEET: سجل الحجوزات التفصيلي (Bookings Ledger)
  // -------------------------------------------------------------
  const wsBookings = workbook.addWorksheet('سجل الحجوزات الكامل', {
    views: [{ rightToLeft: true, showGridLines: true }]
  });

  wsBookings.mergeCells('A1:N1');
  const bTitle = wsBookings.getCell('A1');
  bTitle.value = '📋 سجل الحجوزات والنزلاء التفصيلي (Bookings & Guest Ledger)';
  bTitle.font = { name: 'Segoe UI', size: 15, bold: true, color: { argb: 'FFFFFFFF' } };
  bTitle.fill = goldHeaderFill;
  bTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  wsBookings.getRow(1).height = 36;

  const bookingHeaders = [
    'رقم الحجز', 'رقم الغرفة', 'الدور', 'نوع الغرفة', 'اسم النزيل', 'رقم الهاتف / الهوية',
    'تاريخ الدخول', 'تاريخ الخروج', 'عدد الليالي', 'سعر الليلة (ج.م)', 'الإجمالي المطلوب (ج.م)', 
    'المسدد (ج.م)', 'المتبقي (ج.م)', 'طريقة الدفع والحالة'
  ];

  const bHeaderRow = wsBookings.getRow(3);
  bHeaderRow.height = 28;
  bookingHeaders.forEach((h, idx) => {
    const cell = bHeaderRow.getCell(idx + 1);
    cell.value = h;
    cell.fill = primaryHeaderFill;
    cell.font = whiteFontBold;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = thinBorder;
  });

  const demoBookings = [
    { code: 'BK-2026-001', room: '102', floor: 'الدور الأول', type: 'سرير كينج', guest: 'أحمد محمود العبد', phone: '01012345678', in: '2026-08-20', out: '2026-08-25', nights: 5, rate: 1400, paid: 7000, method: 'فيزا - مدفوع كامل' },
    { code: 'BK-2026-002', room: '103', floor: 'الدور الأول', type: 'سويت', guest: 'د. طارق علي السيد', phone: '01122334455', in: '2026-08-22', out: '2026-08-27', nights: 5, rate: 2500, paid: 12500, method: 'تحويل بنكي - مدفوع كامل' },
    { code: 'BK-2026-003', room: '202', floor: 'الدور الثاني', type: 'دابل بلكونة', guest: 'جون سميث (John Smith)', phone: '+447911123456', in: '2026-08-21', out: '2026-08-26', nights: 5, rate: 1300, paid: 6500, method: 'بطاقة ائتمان دولية' },
    { code: 'BK-2026-004', room: '204', floor: 'الدور الثاني', type: 'سرير كينج', guest: 'سارة إبراهيم الشريف', phone: '01299887766', in: '2026-08-23', out: '2026-08-28', nights: 5, rate: 1500, paid: 4500, method: 'نقدي (عربونا متبقي 3000)' },
    { code: 'BK-2026-005', room: '302', floor: 'الدور الثالث', type: 'دابل بلكونة', guest: 'م. خالد عبد الرحمن', phone: '01005544332', in: '2026-08-20', out: '2026-08-26', nights: 6, rate: 1350, paid: 8100, method: 'فودافون كاش - مدفوع' },
    { code: 'BK-2026-006', room: '304', floor: 'الدور الثالث', type: 'سرير كينج', guest: 'أليكسيس دوفال (Alexis)', phone: '+33612345678', in: '2026-08-22', out: '2026-08-29', nights: 7, rate: 1550, paid: 10850, method: 'Booking.com Online' },
    { code: 'BK-2026-007', room: '403', floor: 'الدور الرابع', type: 'سرير كينج', guest: 'عمر الفاروق الباز', phone: '01111223344', in: '2026-08-19', out: '2026-08-25', nights: 6, rate: 1900, paid: 11400, method: 'نقدي - مسدد كامل' },
    { code: 'BK-2026-008', room: '404', floor: 'الدور الرابع', type: 'سرير كينج', guest: 'ماريا كوستاس (Maria)', phone: '+30691234567', in: '2026-08-21', out: '2026-08-27', nights: 6, rate: 1900, paid: 11400, method: 'Expedia Online' }
  ];

  demoBookings.forEach((b, idx) => {
    const rowIdx = 4 + idx;
    const r = wsBookings.getRow(rowIdx);
    r.height = 22;

    r.getCell(1).value = b.code;
    r.getCell(2).value = b.room;
    r.getCell(3).value = b.floor;
    r.getCell(4).value = b.type;
    r.getCell(5).value = b.guest;
    r.getCell(6).value = b.phone;
    r.getCell(7).value = b.in;
    r.getCell(8).value = b.out;
    r.getCell(9).value = b.nights;
    r.getCell(10).value = b.rate;
    r.getCell(10).numFmt = '#,##0';
    r.getCell(11).value = { formula: `I${rowIdx}*J${rowIdx}` };
    r.getCell(11).numFmt = '#,##0 "ج.م"';
    r.getCell(12).value = b.paid;
    r.getCell(12).numFmt = '#,##0 "ج.م"';
    r.getCell(13).value = { formula: `K${rowIdx}-L${rowIdx}` };
    r.getCell(13).numFmt = '#,##0 "ج.م"';
    r.getCell(14).value = b.method;

    for (let c = 1; c <= 14; c++) {
      const cell = r.getCell(c);
      cell.border = thinBorder;
      cell.font = regularFont;
      if ([1, 2, 3, 7, 8, 9].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if ([10, 11, 12, 13].includes(c)) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      }
    }
  });

  // Empty rows for easy manual entry in Excel
  for (let emptyIdx = demoBookings.length + 1; emptyIdx <= 30; emptyIdx++) {
    const rowIdx = 3 + emptyIdx;
    const r = wsBookings.getRow(rowIdx);
    r.height = 20;
    r.getCell(1).value = `BK-2026-${String(emptyIdx).padStart(3, '0')}`;
    r.getCell(11).value = { formula: `IF(AND(I${rowIdx}>0, J${rowIdx}>0), I${rowIdx}*J${rowIdx}, 0)` };
    r.getCell(11).numFmt = '#,##0 "ج.م"';
    r.getCell(13).value = { formula: `IF(K${rowIdx}>0, K${rowIdx}-L${rowIdx}, 0)` };
    r.getCell(13).numFmt = '#,##0 "ج.م"';
    for (let c = 1; c <= 14; c++) {
      const cell = r.getCell(c);
      cell.border = thinBorder;
      cell.font = regularFont;
      if ([1, 2, 3, 7, 8, 9].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      }
    }
  }

  // Summary row
  const bSumRow = wsBookings.getRow(34);
  bSumRow.height = 28;
  wsBookings.mergeCells('A34:J34');
  bSumRow.getCell(1).value = 'الإجمالي العام لجميع الحجوزات:';
  bSumRow.getCell(1).font = whiteFontBold;
  bSumRow.getCell(1).fill = primaryHeaderFill;
  bSumRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  bSumRow.getCell(11).value = { formula: 'SUM(K4:K33)' };
  bSumRow.getCell(11).numFmt = '#,##0 "ج.م"';
  bSumRow.getCell(11).font = boldFont;
  bSumRow.getCell(11).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };

  bSumRow.getCell(12).value = { formula: 'SUM(L4:L33)' };
  bSumRow.getCell(12).numFmt = '#,##0 "ج.م"';
  bSumRow.getCell(12).font = boldFont;
  bSumRow.getCell(12).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };

  bSumRow.getCell(13).value = { formula: 'SUM(M4:M33)' };
  bSumRow.getCell(13).numFmt = '#,##0 "ج.م"';
  bSumRow.getCell(13).font = boldFont;
  bSumRow.getCell(13).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };

  bSumRow.getCell(14).value = 'حسابات مطابقة';
  bSumRow.getCell(14).font = boldFont;
  bSumRow.getCell(14).alignment = { horizontal: 'center', vertical: 'middle' };
  bSumRow.getCell(14).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };

  for (let c = 1; c <= 14; c++) {
    bSumRow.getCell(c).border = thinBorder;
  }

  wsBookings.columns = [
    { width: 16 }, // كود الحجز
    { width: 12 }, // رقم الغرفة
    { width: 15 }, // الدور
    { width: 20 }, // نوع الغرفة
    { width: 26 }, // اسم النزيل
    { width: 20 }, // الهاتف
    { width: 14 }, // الدخول
    { width: 14 }, // الخروج
    { width: 12 }, // الليالي
    { width: 16 }, // سعر الليلة
    { width: 20 }, // الإجمالي
    { width: 18 }, // المسدد
    { width: 18 }, // المتبقي
    { width: 26 }  // طريقة الدفع
  ];

  // -------------------------------------------------------------
  // 3. SHEET: جدول الحصر والتوزيع المعتمد للـ 25 غرفة (Rooms Master Directory)
  // -------------------------------------------------------------
  const wsMaster = workbook.addWorksheet('توزيع الـ 25 غرفة المعتمد', {
    views: [{ rightToLeft: true, showGridLines: true }]
  });

  wsMaster.mergeCells('A1:G1');
  const mTitle = wsMaster.getCell('A1');
  mTitle.value = '🏨 الدليل الرسمي المعتمد لتوزيع وتصنيف غرف الفندق (إجمالي 25 غرفة)';
  mTitle.font = { name: 'Segoe UI', size: 15, bold: true, color: { argb: 'FFFFFFFF' } };
  mTitle.fill = primaryHeaderFill;
  mTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  wsMaster.getRow(1).height = 36;

  const masterHeaders = ['م', 'رقم الغرفة', 'الدور / الطابق', 'نوع وتوصيف الغرفة', 'مواصفات الأسرّة', 'السعر الافتراضي لليلة (ج.م)', 'موقع وإطلالة الغرفة'];
  const mHeaderRow = wsMaster.getRow(3);
  mHeaderRow.height = 28;
  masterHeaders.forEach((h, idx) => {
    const cell = mHeaderRow.getCell(idx + 1);
    cell.value = h;
    cell.fill = goldHeaderFill;
    cell.font = whiteFontBold;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = thinBorder;
  });

  let mRowIdx = 4;
  let lastFloor = '';
  roomsData.forEach((room, idx) => {
    if (room.floor !== lastFloor) {
      lastFloor = room.floor;
      wsMaster.mergeCells(`A${mRowIdx}:G${mRowIdx}`);
      const cell = wsMaster.getCell(`A${mRowIdx}`);
      cell.value = `🏢 ${lastFloor}`;
      cell.font = whiteFontBold;
      cell.fill = floorHeaderFill;
      cell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      wsMaster.getRow(mRowIdx).height = 24;
      for (let c = 1; c <= 7; c++) wsMaster.getRow(mRowIdx).getCell(c).border = thinBorder;
      mRowIdx++;
    }

    const row = wsMaster.getRow(mRowIdx);
    row.height = 22;
    row.getCell(1).value = idx + 1;
    row.getCell(2).value = room.id;
    row.getCell(3).value = room.floor;
    row.getCell(4).value = room.type;
    row.getCell(5).value = room.beds;
    row.getCell(6).value = room.price;
    row.getCell(6).numFmt = '#,##0 "ج.م"';
    row.getCell(7).value = room.notes;

    for (let c = 1; c <= 7; c++) {
      const cell = row.getCell(c);
      cell.border = thinBorder;
      cell.font = regularFont;
      if ([1, 2, 3].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (c === 6) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      }
    }
    mRowIdx++;
  });

  wsMaster.columns = [
    { width: 6 },
    { width: 15 },
    { width: 18 },
    { width: 24 },
    { width: 25 },
    { width: 25 },
    { width: 30 }
  ];

  const outputPath = path.join(__dirname, 'نظام_حجز_الفندق_25_غرفة.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Excel file successfully created at: ${outputPath}`);
}

createHotelBookingExcel().catch(err => {
  console.error('Error creating Excel file:', err);
});
