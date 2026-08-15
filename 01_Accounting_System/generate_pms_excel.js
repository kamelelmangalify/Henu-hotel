const ExcelJS = require('exceljs');
const path = require('path');

async function createPMSWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Henu Hotel Pyramids PMS';
  workbook.created = new Date();

  // قائمة الغرف الـ 25 للفندق وتوزيعها على الأدوار
  const roomsData = [
    // الدور الأول (101 - 106)
    { room: '101', floor: 'الدور الأول', type: 'غرفة مزدوجة - طابق أرضي', beds: 2, rate: 1200, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: 'جاهزة للتسكين' },
    { room: '102', room: '102', floor: 'الدور الأول', type: 'غرفة ثلاثية - طابق أرضي', beds: 3, rate: 1500, status: 'مشغولة', guest: 'John Smith (Booking.com)', checkIn: '2026-08-14', checkOut: '2026-08-18', notes: 'نزيل أجنبي - مسدد بالكامل' },
    { room: '103', floor: 'الدور الأول', type: 'غرفة مفردة - طابق أرضي', beds: 1, rate: 900, status: 'تحت التنظيف', guest: '', checkIn: '', checkOut: '', notes: 'مغادرة صباح اليوم' },
    { room: '104', floor: 'الدور الأول', type: 'غرفة مزدوجة - طابق أرضي', beds: 2, rate: 1200, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' },
    { room: '105', floor: 'الدور الأول', type: 'غرفة مزدوجة - طابق أرضي', beds: 2, rate: 1200, status: 'مشغولة', guest: 'أحمد علي (مباشر)', checkIn: '2026-08-15', checkOut: '2026-08-17', notes: 'متبقي 600 جـ' },
    { room: '106', floor: 'الدور الأول', type: 'غرفة ثلاثية - طابق أرضي', beds: 3, rate: 1500, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' },

    // الدور الثاني (201 - 207)
    { room: '201', floor: 'الدور الثاني', type: 'غرفة ديلوكس إطلالة الأهرامات', beds: 2, rate: 1800, status: 'مشغولة', guest: 'Marco Rossi (Expedia)', checkIn: '2026-08-13', checkOut: '2026-08-16', notes: 'إطلالة مباشرة على الهرم' },
    { room: '202', floor: 'الدور الثاني', type: 'غرفة ديلوكس إطلالة الأهرامات', beds: 2, rate: 1800, status: 'مشغولة', guest: 'Sarah Jenkins (Booking.com)', checkIn: '2026-08-15', checkOut: '2026-08-20', notes: 'رحلة خيل وسفاري' },
    { room: '203', floor: 'الدور الثاني', type: 'غرفة مزدوجة قياسية', beds: 2, rate: 1300, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' },
    { room: '204', floor: 'الدور الثاني', type: 'غرفة مزدوجة قياسية', beds: 2, rate: 1300, status: 'صيانة', guest: '', checkIn: '', checkOut: '', notes: 'إصلاح التكييف' },
    { room: '205', floor: 'الدور الثاني', type: 'غرفة ثلاثية عائلية', beds: 3, rate: 1600, status: 'مشغولة', guest: 'عائلة محمود حسان (مباشر)', checkIn: '2026-08-14', checkOut: '2026-08-17', notes: 'سرير إضافي' },
    { room: '206', floor: 'الدور الثاني', type: 'غرفة مفردة قياسية', beds: 1, rate: 950, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' },
    { room: '207', floor: 'الدور الثاني', type: 'غرفة مزدوجة قياسية', beds: 2, rate: 1300, status: 'تحت التنظيف', guest: '', checkIn: '', checkOut: '', notes: 'تنظيف وتغيير كتانيات' },

    // الدور الثالث (301 - 306)
    { room: '301', floor: 'الدور الثالث', type: 'جناح فندقي إطلالة الأهرامات', beds: 3, rate: 2200, status: 'مشغولة', guest: 'David Miller (Booking.com)', checkIn: '2026-08-12', checkOut: '2026-08-19', notes: 'VIP - عشاء روف مجهز' },
    { room: '302', floor: 'الدور الثالث', type: 'غرفة ديلوكس إطلالة الأهرامات', beds: 2, rate: 1800, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' },
    { room: '303', floor: 'الدور الثالث', type: 'غرفة مزدوجة قياسية', beds: 2, rate: 1300, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' },
    { room: '304', floor: 'الدور الثالث', type: 'غرفة ثلاثية قياسية', beds: 3, rate: 1600, status: 'مشغولة', guest: 'خالد إبراهيم (واتساب)', checkIn: '2026-08-15', checkOut: '2026-08-16', notes: 'وصول متأخر' },
    { room: '305', floor: 'الدور الثالث', type: 'غرفة مفردة قياسية', beds: 1, rate: 950, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' },
    { room: '306', floor: 'الدور الثالث', type: 'غرفة مزدوجة قياسية', beds: 2, rate: 1300, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' },

    // الروف / الدور الرابع (401 - 406)
    { room: '401', floor: 'الروف - الدور الرابع', type: 'جناح الروف الملكي بفراندا الأهرامات', beds: 2, rate: 2500, status: 'مشغولة', guest: 'Pierre Dupont (Direct Agent)', checkIn: '2026-08-10', checkOut: '2026-08-17', notes: 'توصيل مطار مجاني' },
    { room: '402', floor: 'الروف - الدور الرابع', type: 'غرفة روف إطلالة الأهرامات', beds: 2, rate: 1900, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' },
    { room: '403', floor: 'الروف - الدور الرابع', type: 'غرفة روف إطلالة الأهرامات', beds: 2, rate: 1900, status: 'تحت التنظيف', guest: '', checkIn: '', checkOut: '', notes: 'تجهيز لمحيط الروف' },
    { room: '404', floor: 'الروف - الدور الرابع', type: 'غرفة ثلاثية روف', beds: 3, rate: 1700, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' },
    { room: '405', floor: 'الروف - الدور الرابع', type: 'غرفة مفردة روف', beds: 1, rate: 1000, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' },
    { room: '406', floor: 'الروف - الدور الرابع', type: 'غرفة مزدوجة روف', beds: 2, rate: 1400, status: 'شاغرة جاهزة', guest: '', checkIn: '', checkOut: '', notes: '' }
  ];

  // =========================================================
  // 1. شيت حالة الغرف الـ 25 (Room Rack & Status Matrix)
  // =========================================================
  const statusSheet = workbook.addWorksheet('حالة الغرف الـ 25 (Room Rack)', {
    views: [{ rightToLeft: true }]
  });

  statusSheet.mergeCells('A1:I1');
  const sTitle = statusSheet.getCell('A1');
  sTitle.value = '🏨 فندق هينو الأهرامات — شاشة حالة الغرف الـ 25 التفاعلية (Room Status & Inventory Rack)';
  sTitle.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  sTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  sTitle.alignment = { horizontal: 'center', vertical: 'middle' };

  statusSheet.getRow(1).height = 32;

  // إحصائيات سريعة في الصف 2
  statusSheet.mergeCells('A2:B2'); statusSheet.getCell('A2').value = '🟢 شاغرة جاهزة: =COUNTIF(E5:E29, "شاغرة جاهزة")';
  statusSheet.mergeCells('C2:D2'); statusSheet.getCell('C2').value = '🔴 مشغولة: =COUNTIF(E5:E29, "مشغولة")';
  statusSheet.mergeCells('E2:F2'); statusSheet.getCell('E2').value = '🟡 تحت التنظيف: =COUNTIF(E5:E29, "تحت التنظيف")';
  statusSheet.mergeCells('G2:H2'); statusSheet.getCell('G2').value = '🟠 صيانة: =COUNTIF(E5:E29, "صيانة")';

  [statusSheet.getCell('A2'), statusSheet.getCell('C2'), statusSheet.getCell('E2'), statusSheet.getCell('G2')].forEach(cell => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1F4E78' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F4F8' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  statusSheet.getRow(2).height = 25;
  statusSheet.addRow([]);

  const rackHeaders = ['رقم الغرفة', 'الطابق', 'نوع الغرفة', 'عدد الأسرة', 'حالة الغرفة', 'اسم النزيل الحالي', 'تاريخ الوصول', 'تاريخ المغادرة', 'سعر الليلة (جـ)', 'ملاحظات وتوجيهات الإشراف'];
  const rHRow = statusSheet.addRow(rackHeaders);
  rHRow.height = 26;
  rHRow.eachCell(cell => {
    cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  roomsData.forEach((room, idx) => {
    const row = statusSheet.addRow([
      room.room,
      room.floor,
      room.type,
      room.beds,
      room.status,
      room.guest,
      room.checkIn,
      room.checkOut,
      room.rate,
      room.notes
    ]);

    row.height = 22;
    const isEven = idx % 2 === 0;
    const bg = isEven ? 'F9FAFB' : 'FFFFFF';

    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { horizontal: [1, 4, 5, 7, 8, 9].includes(colNum) ? 'center' : 'right', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };

      if (colNum === 5) { // حالة الغرفة
        if (cell.value === 'شاغرة جاهزة') {
          cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF276749' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C6F6D5' } };
        } else if (cell.value === 'مشغولة') {
          cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF9B2C2C' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FED7D7' } };
        } else if (cell.value === 'تحت التنظيف') {
          cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF975A16' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEFCBF' } };
        } else if (cell.value === 'صيانة') {
          cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFC05621' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEEBC8' } };
        }
      }

      if (colNum === 9) {
        cell.numFmt = '#,##0" جـ"';
      }
    });
  });

  statusSheet.getColumn(1).width = 12;
  statusSheet.getColumn(2).width = 16;
  statusSheet.getColumn(3).width = 28;
  statusSheet.getColumn(4).width = 12;
  statusSheet.getColumn(5).width = 16;
  statusSheet.getColumn(6).width = 24;
  statusSheet.getColumn(7).width = 14;
  statusSheet.getColumn(8).width = 14;
  statusSheet.getColumn(9).width = 16;
  statusSheet.getColumn(10).width = 25;

  // =========================================================
  // 2. سجل الحجوزات والتسكين التفصيلي (Reservations Master Ledger)
  // =========================================================
  const resSheet = workbook.addWorksheet('سجل الحجوزات والتسكين', {
    views: [{ rightToLeft: true }]
  });

  resSheet.mergeCells('A1:O1');
  const rTitle = resSheet.getCell('A1');
  rTitle.value = '📋 سجل الحجوزات والتسكين اليومي الشامل — فندق هينو الأهرامات';
  rTitle.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  rTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  rTitle.alignment = { horizontal: 'center', vertical: 'middle' };

  resSheet.getRow(1).height = 30;
  resSheet.addRow([]);

  const resHeaders = [
    'رقم الحجز',
    'اسم النزيل',
    'الجنسية / الهوية',
    'رقم الهاتف / الواتساب',
    'مصدر الحجز',
     'رقم الغرفة',
    'تاريخ الوصول',
    'تاريخ المغادرة',
    'عدد الليالي',
    'سعر الليلة',
    'إجمالي قيمة الإقامة',
    'المبلغ المدفوع (مقدم)',
    'المتبقي للسداد',
    'حالة السداد',
    'ملاحظات خاصة'
  ];

  const resHRow = resSheet.addRow(resHeaders);
  resHRow.height = 26;
  resHRow.eachCell(cell => {
    cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  const sampleBookings = [
    { id: 'RES-2026-001', name: 'John Smith', nat: 'أمركي - Passport 98234', phone: '+1 555 0192', source: 'Booking.com', room: '102', in: '2026-08-14', out: '2026-08-18', rate: 1500, paid: 6000, paidStatus: 'مسدد بالكامل', notes: 'طلب سرير أطفال' },
    { id: 'RES-2026-002', name: 'أحمد علي محمود', nat: 'مصري - 298010112345', phone: '01012345678', source: 'حجز مباشر', room: '105', in: '2026-08-15', out: '2026-08-17', rate: 1200, paid: 1800, paidStatus: 'متبقي جزء', notes: 'متبقي 600 جـ عند المغادرة' },
    { id: 'RES-2026-003', name: 'Marco Rossi', nat: 'إيطالي - Passport IT8821', phone: '+39 06 6982', source: 'Expedia', room: '201', in: '2026-08-13', out: '2026-08-16', rate: 1800, paid: 5400, paidStatus: 'مسدد بالكامل', notes: 'إطلالة الأهرامات' },
    { id: 'RES-2026-004', name: 'Sarah Jenkins', nat: 'بريطاني - Passport UK1192', phone: '+44 20 7946', source: 'Booking.com', room: '202', in: '2026-08-15', out: '2026-08-20', rate: 1800, paid: 9000, paidStatus: 'مسدد بالكامل', notes: 'شامل الإفطار' },
    { id: 'RES-2026-005', name: 'عائلة محمود حسان', nat: 'مصري - 28504049876', phone: '01223344556', source: 'حجز مباشر', room: '205', in: '2026-08-14', out: '2026-08-17', rate: 1600, paid: 4800, paidStatus: 'مسدد بالكامل', notes: 'سرير إضافي' },
    { id: 'RES-2026-006', name: 'David Miller', nat: 'كندي - Passport CA9912', phone: '+1 416 555', source: 'Booking.com', room: '301', in: '2026-08-12', out: '2026-08-19', rate: 2200, paid: 15400, paidStatus: 'مسدد بالكامل', notes: 'جناح فندقي VIP' },
    { id: 'RES-2026-007', name: 'Pierre Dupont', nat: 'فرنسي - Passport FR7732', phone: '+33 1 4268', source: 'وكيل سياحي', room: '401', in: '2026-08-10', out: '2026-08-17', rate: 2500, paid: 17500, paidStatus: 'مسدد بالكامل', notes: 'جناح الروف الملكي' }
  ];

  const resStartRow = 4;
  sampleBookings.forEach((b, idx) => {
    const r = resStartRow + idx;
    const row = resSheet.addRow([
      b.id,
      b.name,
      b.nat,
      b.phone,
      b.source,
      b.room,
      b.in,
      b.out,
      { formula: `DATEVALUE(H${r})-DATEVALUE(G${r})` },
      b.rate,
      { formula: `I${r}*J${r}` },
      b.paid,
      { formula: `K${r}-L${r}` },
      b.paidStatus,
      b.notes
    ]);

    row.height = 22;
    const isEven = idx % 2 === 0;
    const bg = isEven ? 'F9FAFB' : 'FFFFFF';

    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { horizontal: [1, 5, 6, 7, 8, 9, 14].includes(colNum) ? 'center' : 'right', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };

      if ([10, 11, 12, 13].includes(colNum)) {
        cell.numFmt = '#,##0" جـ"';
      }
      if (colNum === 13) { // المتبقي
        cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFC53030' } };
      }
    });
  });

  resSheet.getColumn(1).width = 15;
  resSheet.getColumn(2).width = 22;
  resSheet.getColumn(3).width = 24;
  resSheet.getColumn(4).width = 16;
  resSheet.getColumn(5).width = 15;
  resSheet.getColumn(6).width = 12;
  resSheet.getColumn(7).width = 14;
  resSheet.getColumn(8).width = 14;
  resSheet.getColumn(9).width = 12;
  resSheet.getColumn(10).width = 14;
  resSheet.getColumn(11).width = 16;
  resSheet.getColumn(12).width = 16;
  resSheet.getColumn(13).width = 16;
  resSheet.getColumn(14).width = 15;
  resSheet.getColumn(15).width = 24;

  const outputPath = path.join(__dirname, 'نظام_حجوزات_وتسكين_الغرف_الفندقي.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Professional PMS Excel Workbook created at: ${outputPath}`);

  return outputPath;
}

createPMSWorkbook().catch(err => console.error(err));
