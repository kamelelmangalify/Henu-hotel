const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ExcelJS = require('exceljs');

const rootDir = path.join('d:', 'Henu');
const invDocsDir = path.join(rootDir, '01_Accounting_System', 'نماذج_جرد_الغرف_والمخازن');
if (!fs.existsSync(invDocsDir)) fs.mkdirSync(invDocsDir, { recursive: true });

// قراءة الشعار
const logoPath = path.join(rootDir, '02_Contracts_and_Legal', 'شعار_الفندق_عقود.jpg');
let logoDataUrl = '';
if (fs.existsSync(logoPath)) {
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  logoDataUrl = `data:image/jpeg;base64,${logoBase64}`;
}

function convertHtmlToPdf(htmlPath, pdfPath) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edgeAlt = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
  let exe = fs.existsSync(edgePath) ? edgePath : (fs.existsSync(edgeAlt) ? edgeAlt : 'msedge.exe');

  const cmd = `powershell -Command "& \\"${exe}\\" --headless --disable-gpu --no-sandbox --print-to-pdf=\\"${pdfPath}\\" \\"${htmlPath}\\""`;
  try {
    execSync(cmd, { encoding: 'utf8' });
    console.log(`✅ PDF Created: ${path.basename(pdfPath)}`);
  } catch (err) {
    console.error(`❌ PDF failed for ${pdfPath}:`, err.message);
  }
}

async function createMatrixInventoryExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Henu Hotel Matrix Inventory';
  workbook.created = new Date();

  // ---------------------------------------------------------
  // Sheet 1: جرد مشتملات الغرف الـ 25 (جدول الـ 40 عمود رأسية)
  // ---------------------------------------------------------
  const roomSheet = workbook.addWorksheet('جرد الغرف (علامة صح)', {
    views: [{ rightToLeft: true }],
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 }
  });

  roomSheet.mergeCells('A1:AS1');
  const t1 = roomSheet.getCell('A1');
  t1.value = '🏨 فندق هينو الأهرامات — كشف ورسومات جرد مشتملات وأثاث الغرف الـ 25 (جدول خانات الصح والتجميع)';
  t1.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  t1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  t1.alignment = { horizontal: 'center', vertical: 'middle' };
  roomSheet.getRow(1).height = 30;

  roomSheet.mergeCells('A2:AS2');
  const sub1 = roomSheet.getCell('A2');
  sub1.value = 'تعليمات للجرد: يضع عامل/مشرفة الإشراف الداخلي علامة صح (✓) أمام كل صنف موجود وسليم بالغرفة ، وفي نهاية الجدول يتم حساب الإجمالي التلقائي.';
  sub1.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1F4E78' } };
  sub1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F4F8' } };
  sub1.alignment = { horizontal: 'center', vertical: 'middle' };
  roomSheet.getRow(2).height = 22;

  roomSheet.addRow([]);

  const roomColumns = [
    'رقم الغرفة',
    'الدور / الطابق',
    'نوع الغرفة',
    'سرير كينج 180×200',
    'سرير سينجل 120×200',
    'مرتبة كينج 180×200',
    'مرتبة سينجل 120×200',
    'واقي مرتبة ضد الماء',
    'ملاية سرير كبير',
    'ملاية سرير صغير',
    'كيس مخدة فندقي',
    'مخدة فندقية ناعمة',
    'لحاف فندقي / كوفرتة',
    'شاشة سمارت 32 بوصة',
    'رسيفر وقنوات فضائية',
    'ريموت شاشة + رسيفر',
    'تكييف 1.5/2.25 حصان',
    'ريموت تكييف',
    'ثلاجة ميني بار 4.5 قدم',
    'غلاية مياه كهربائية',
    'طقم أكواب وكوفيشوب',
    'دولاب ملابس + 10 شماعات',
    'تسريحة / مكتب + كرسي',
    'كمودينو + أبجورة إضاءة',
    'مرآة فندقية تكبير',
    'ستائر بلاك آوت (Blackout)',
    'استشوار شعر (Hair Dryer)',
    'بشكير حمام كبير',
    'فوطة وجه ويدين',
    'مشاية حمام قطن',
    'سلة مهملات بالبدال',
    'ستارة دش حمام',
    'خزينة إلكترونية Safe Box',
    'حامل أمتعة خشبي',
    'لوحة فرعونية / ديكور',
    'صنف إضافي 1 (فارغ)',
    'صنف إضافي 2 (فارغ)',
    'صنف إضافي 3 (فارغ)',
    'صنف إضافي 4 (فارغ)',
    'صنف إضافي 5 (فارغ)',
    'إجمالي الأصناف الفعلية (✓)',
    'نسبة الاكتمال %',
    'ملاحظات الإشراف'
  ];

  const rHeaderRow = roomSheet.addRow(roomColumns);
  rHeaderRow.height = 140;

  rHeaderRow.eachCell((cell, colNum) => {
    cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'bottom', textRotation: 90, wrapText: false };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  const roomsList = [
    { no: '101', floor: 'الأول', type: 'مزدوجة' },
    { no: '102', floor: 'الأول', type: 'ثلاثية' },
    { no: '103', floor: 'الأول', type: 'مفردة' },
    { no: '104', floor: 'الأول', type: 'مزدوجة' },
    { no: '105', floor: 'الأول', type: 'مزدوجة' },
    { no: '106', floor: 'الأول', type: 'ثلاثية' },
    { no: '201', floor: 'الثاني', type: 'ديلوكس أهرامات' },
    { no: '202', floor: 'الثاني', type: 'ديلوكس أهرامات' },
    { no: '203', floor: 'الثاني', type: 'مزدوجة' },
    { no: '204', floor: 'الثاني', type: 'مزدوجة' },
    { no: '205', floor: 'الثاني', type: 'ثلاثية عائلية' },
    { no: '206', floor: 'الثاني', type: 'مفردة' },
    { no: '207', floor: 'الثاني', type: 'مزدوجة' },
    { no: '301', floor: 'الثالث', type: 'جناح أهرامات' },
    { no: '302', floor: 'الثالث', type: 'ديلوكس أهرامات' },
    { no: '303', floor: 'الثالث', type: 'مزدوجة' },
    { no: '304', floor: 'الثالث', type: 'ثلاثية' },
    { no: '305', floor: 'الثالث', type: 'مفردة' },
    { no: '306', floor: 'الثالث', type: 'مزدوجة' },
    { no: '401', floor: 'الروف', type: 'جناح الروف الملكي' },
    { no: '402', floor: 'الروف', type: 'روف أهرامات' },
    { no: '403', floor: 'الروف', type: 'روف أهرامات' },
    { no: '404', floor: 'الروف', type: 'ثلاثية روف' },
    { no: '405', floor: 'الروف', type: 'مفردة روف' },
    { no: '406', floor: 'الروف', type: 'مزدوجة روف' }
  ];

  const startRow = 5;
  roomsList.forEach((rm, idx) => {
    const rIdx = startRow + idx;
    const rowValues = [rm.no, rm.floor, rm.type];

    for (let c = 4; c <= 35; c++) {
      rowValues.push('✓');
    }
    for (let c = 36; c <= 40; c++) {
      rowValues.push('');
    }

    rowValues.push({ formula: `COUNTA(D${rIdx}:AN${rIdx})` });
    rowValues.push({ formula: `ROUND((AO${rIdx}/32)*100, 0)` });
    rowValues.push('جاهزة للتسكين');

    const row = roomSheet.addRow(rowValues);
    row.height = 20;
    const isEven = idx % 2 === 0;
    const bg = isEven ? 'F9FAFB' : 'FFFFFF';

    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { horizontal: colNum <= 3 ? 'center' : 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };

      if (colNum >= 4 && colNum <= 40 && cell.value === '✓') {
        cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF276749' } };
      }
      if (colNum === 41) {
        cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1F4E78' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EBF8FF' } };
      }
      if (colNum === 42) {
        cell.numFmt = '0"%"';
        cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF276749' } };
      }
    });
  });

  const endRow = startRow + roomsList.length - 1;
  const totalsRowValues = ['إجمالي التجميع الفندقي', '25 غرفة', 'الموجود الإجمالي'];

  for (let c = 4; c <= 40; c++) {
    const colLetter = roomSheet.getColumn(c).letter;
    totalsRowValues.push({ formula: `COUNTA(${colLetter}5:${colLetter}${endRow})` });
  }

  totalsRowValues.push({ formula: `SUM(AO5:AO${endRow})` });
  totalsRowValues.push({ formula: `AVERAGE(AP5:AP${endRow})` });
  totalsRowValues.push('التقرير النهائي');

  const totRow = roomSheet.addRow(totalsRowValues);
  totRow.height = 24;
  totRow.eachCell((cell, colNum) => {
    cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF1F4E78' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9E1F2' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'double', color: { argb: '1F4E78' } }, bottom: { style: 'double', color: { argb: '1F4E78' } }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  roomSheet.getColumn(1).width = 9;
  roomSheet.getColumn(2).width = 10;
  roomSheet.getColumn(3).width = 18;

  for (let c = 4; c <= 40; c++) {
    roomSheet.getColumn(c).width = 5.2;
  }

  roomSheet.getColumn(41).width = 12;
  roomSheet.getColumn(42).width = 10;
  roomSheet.getColumn(43).width = 16;

  // ---------------------------------------------------------
  // Sheet 2: جرد وتقفيل المخازن (جدول خانات الكميات والصح)
  // ---------------------------------------------------------
  const storeSheet = workbook.addWorksheet('جرد وتجميع المخازن', {
    views: [{ rightToLeft: true }],
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1 }
  });

  storeSheet.mergeCells('A1:AI1');
  const t2 = storeSheet.getCell('A1');
  t2.value = '📦 فندق هينو الأهرامات — سجل جرد ورصيد المخازن العمودي والشامل (Store Inventory Matrix)';
  t2.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  t2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  t2.alignment = { horizontal: 'center', vertical: 'middle' };
  storeSheet.getRow(1).height = 30;

  storeSheet.addRow([]);

  const storeColumns = [
    'كود الصنف',
    'اسم الصنف الفندقي',
    'المخزن التابع له',
    'وحدة القياس',
    'ملاية سرير كبير',
    'ملاية سرير صغير',
    'بشكير حمام كبير',
    'فوطة وجه ويدين',
    'مشاية حمام قطن',
    'كيس مخدة فندقي',
    'لحاف فندقي / كوفرتة',
    'شامبو فندقي 30 مل',
    'شاور جيل 30 مل',
    'صابون معطر 20 جم',
    'أطقم شاي وقهوة',
    'سكر وظروف كوفيشوب',
    'لمبات ليد 9 واط',
    'بطاريات ريموت تكييف',
    'أقفال أبواب ومفصلات',
    'أكواب وزجاجات مياه',
    'أكياس قمامة بالبدال',
    'مطهرات ومعطرات جو',
    'صنف مخزن 1 (فارغ)',
    'صنف مخزن 2 (فارغ)',
    'صنف مخزن 3 (فارغ)',
    'صنف مخزن 4 (فارغ)',
    'صنف مخزن 5 (فارغ)',
    'الرصيد الفعلي الحالي',
    'حد الأمان (Par Level)',
    'حالة التوريد والطلب',
    'سعر الوحدة التقديري',
    'إجمالي قيمة المخزون',
    'ملاحظات وتوجيهات الشراء'
  ];

  const sHeaderRow = storeSheet.addRow(storeColumns);
  sHeaderRow.height = 140;

  sHeaderRow.eachCell((cell, colNum) => {
    cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'bottom', textRotation: 90, wrapText: false };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  const storeItemsList = [
    { code: 'LIN-01', name: 'ملايات وسراير كبير وصغير', store: 'مخزن المفروشات والكتانيات', unit: 'طقم', qty: 168, par: 168, price: 300 },
    { code: 'LIN-02', name: 'بشاكير وفوط ومشايات حمام', store: 'مخزن المفروشات والكتانيات', unit: 'قطعة', qty: 250, par: 250, price: 180 },
    { code: 'AMN-01', name: 'شامبو وشاور صابون ضيافة', store: 'مخزن الضيافة والـ Amenities', unit: 'كرتونة', qty: 12, par: 10, price: 650 },
    { code: 'AMN-02', name: 'أطقم كوفيشوب وسكر ومياه', store: 'مخزن الضيافة والـ Amenities', unit: 'كرتونة', qty: 15, par: 8, price: 400 },
    { code: 'MNT-01', name: 'قطع غيار كهرباء ولمبات وبطاريات', store: 'مخزن الصيانة والخدمات', unit: 'علبة', qty: 14, par: 8, price: 280 }
  ];

  const stStartRow = 5;
  storeItemsList.forEach((st, idx) => {
    const sIdx = stStartRow + idx;
    const sRowValues = [st.code, st.name, st.store, st.unit];

    for (let c = 5; c <= 27; c++) {
      sRowValues.push('✓');
    }

    sRowValues.push(st.qty);
    sRowValues.push(st.par);
    sRowValues.push({ formula: `IF(AB${sIdx}>=AC${sIdx},"رصيد آمن 🟢","طلب شراء عاجل 🔴")` });
    sRowValues.push(st.price);
    sRowValues.push({ formula: `AB${sIdx}*AE${sIdx}` });
    sRowValues.push('مكتمل الجرد');

    const sRow = storeSheet.addRow(sRowValues);
    sRow.height = 22;
    const isEven = idx % 2 === 0;
    const bg = isEven ? 'F9FAFB' : 'FFFFFF';

    sRow.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { horizontal: colNum <= 4 ? 'right' : 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };

      if ([31, 32].includes(colNum)) cell.numFmt = '#,##0" جـ"';
      if (colNum === 30) cell.font = { name: 'Arial', size: 9, bold: true };
    });
  });

  storeSheet.getColumn(1).width = 11;
  storeSheet.getColumn(2).width = 24;
  storeSheet.getColumn(3).width = 24;
  storeSheet.getColumn(4).width = 10;

  for (let c = 5; c <= 27; c++) {
    storeSheet.getColumn(c).width = 5.2;
  }

  storeSheet.getColumn(28).width = 14;
  storeSheet.getColumn(29).width = 14;
  storeSheet.getColumn(30).width = 16;
  storeSheet.getColumn(31).width = 14;
  storeSheet.getColumn(32).width = 16;
  storeSheet.getColumn(33).width = 18;

  let excelPath = path.join(invDocsDir, 'سجل_جرد_الغرف_والمخازن_الفندقية_الشامل.xlsx');
  try {
    await workbook.xlsx.writeFile(excelPath);
    console.log(`✅ Matrix Inventory Excel Workbook created at: ${excelPath}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      excelPath = path.join(invDocsDir, 'سجل_جرد_الغرف_والمخازن_الفندقية_المطور.xlsx');
      await workbook.xlsx.writeFile(excelPath);
      console.log(`Main inventory excel locked, saved to: ${excelPath}`);
    } else {
      throw err;
    }
  }
}

async function run() {
  await createMatrixInventoryExcel();
}

run().catch(err => console.error(err));
