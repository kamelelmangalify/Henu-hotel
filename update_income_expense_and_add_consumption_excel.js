const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const rootDir = path.join('d:', 'Henu');

async function addThreeSheetsToPettyCash() {
  const filePath = path.join(rootDir, 'سجل الايرادات والمصروفات.xlsx');
  const tempReadPath = path.join(rootDir, 'temp_read_petty.xlsx');
  const tempWritePath = path.join(rootDir, 'temp_write_petty.xlsx');

  // إزالة أية أقفال حية
  const lockFile = path.join(rootDir, '~$سجل الايرادات والمصروفات.xlsx');
  if (fs.existsSync(lockFile)) {
    try { fs.unlinkSync(lockFile); } catch(e) {}
  }

  // نسخ الملف للقراءة بأمان
  fs.copyFileSync(filePath, tempReadPath);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(tempReadPath);

  const newSheetNames = ['1-C Petty Cash', '2-A Petty Cash', '2-B Petty Cash'];

  for (const sheetName of newSheetNames) {
    if (workbook.getWorksheet(sheetName)) {
      workbook.removeWorksheet(sheetName);
    }

    const sheet = workbook.addWorksheet(sheetName, {
      views: [{ rightToLeft: true }]
    });

    // 1. عنوان الهيدر
    sheet.mergeCells('A1:N1');
    const headerCell = sheet.getCell('A1');
    headerCell.value = 'هوستل الأهرامات — سجل حركة صندوق المصروفات النثرية (' + sheetName + ')';
    headerCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    headerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 32;

    // 2. سقف الصندوق وحد الإنذار
    sheet.getCell('A2').value = 'سقف الصندوق (ج):';
    sheet.getCell('A2').font = { bold: true, size: 10 };
    sheet.getCell('C2').value = 'حد الإنذار (ج):';
    sheet.getCell('C2').font = { bold: true, size: 10 };
    sheet.getCell('D2').value = 5000;
    sheet.getCell('D2').font = { bold: true, color: { argb: 'FFC00000' } };
    sheet.getRow(2).height = 22;

    // 3. عناوين الأعمدة
    const headers = [
      'رقم',
      'التاريخ',
      'رصيد افتتاحي',
      'رقم الإذن',
      'البيان',
      'الجهة المستلمة',
      'مصروف (ج)',
      'إيراد (ج)',
      'رقم الفاتورة',
      'رصيد متبقي',
      'تنبيه',
      'ملاحظات',
      'توقيع الصراف',
      'توقيع المراجع'
    ];

    const hRow = sheet.addRow(headers);
    hRow.height = 26;
    hRow.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });

    // 4. إضافة بيانات نموذجية مع المعادلات الحسابية
    const initialRows = [
      [1, '2026-08-01', 0, '', 'رصيد تحويل افتتاحي للخزينة', 'صراف الخزينة', '', 5000, 'INV-101', { formula: 'C4-G4+H4', result: 5000 }, { formula: 'IF(J4<200,"تنبيه: اعد التعبئة","مقبول")', result: 'مقبول' }, 'تم الاستلام كاش', 'أحمد', 'المراجع'],
      [2, '2026-08-02', '', '', 'شراء مستلزمات نظافة وضيافة', 'الخدمات العامة', 450, '', 'INV-102', { formula: 'J4-G5+H5', result: 4550 }, { formula: 'IF(J5<200,"تنبيه: اعد التعبئة","مقبول")', result: 'مقبول' }, 'فاتورة معتمدة', 'أحمد', 'المراجع'],
      [3, '2026-08-03', '', '', 'مصاريف صيانة سباكة طارئة', 'فني الصيانة', 320, '', 'INV-103', { formula: 'J5-G6+H6', result: 4230 }, { formula: 'IF(J6<200,"تنبيه: اعد التعبئة","مقبول")', result: 'مقبول' }, 'إذن صيانة #FR1', 'أحمد', 'المراجع'],
      [4, '2026-08-05', '', '', 'إيراد خدمات مغسلة النزلاء', 'الاستقبال', '', 650, 'REC-55', { formula: 'J6-G7+H7', result: 4880 }, { formula: 'IF(J7<200,"تنبيه: اعد التعبئة","مقبول")', result: 'مقبول' }, 'تحصيل كاش', 'أحمد', 'المراجع']
    ];

    initialRows.forEach((r) => {
      const row = sheet.addRow(r);
      row.height = 22;
      row.eachCell((cell, colNum) => {
        cell.font = { name: 'Arial', size: 9 };
        cell.alignment = { horizontal: colNum === 1 || colNum === 2 || colNum === 7 || colNum === 8 || colNum === 10 || colNum === 11 ? 'center' : 'right', vertical: 'middle' };
        cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };
      });
    });

    for (let i = 5; i <= 30; i++) {
      const rowIdx = i + 3;
      const prevRowIdx = rowIdx - 1;
      const emptyRow = sheet.addRow([
        i,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        { formula: `J${prevRowIdx}-G${rowIdx}+H${rowIdx}` },
        { formula: `IF(J${rowIdx}<200,"تنبيه: اعد التعبئة","مقبول")` },
        '',
        '',
        ''
      ]);
      emptyRow.height = 20;
      emptyRow.eachCell((cell, colNum) => {
        cell.font = { name: 'Arial', size: 9 };
        cell.alignment = { horizontal: colNum === 1 || colNum === 2 || colNum === 7 || colNum === 8 || colNum === 10 || colNum === 11 ? 'center' : 'right', vertical: 'middle' };
        cell.border = { top: { style: 'thin', color: { argb: 'F3F4F6' } }, bottom: { style: 'thin', color: { argb: 'F3F4F6' } }, left: { style: 'thin', color: { argb: 'F3F4F6' } }, right: { style: 'thin', color: { argb: 'F3F4F6' } } };
      });
    }

    const widths = [6, 12, 12, 10, 30, 20, 12, 12, 12, 14, 18, 20, 14, 14];
    sheet.columns.forEach((col, i) => {
      if (widths[i]) col.width = widths[i];
    });
  }

  await workbook.xlsx.writeFile(tempWritePath);
  
  // استبدال الملف الأصلي بالنسخة المحدثة
  try {
    fs.copyFileSync(tempWritePath, filePath);
    console.log(`✅ Updated "سجل الايرادات والمصروفات.xlsx" with 3 new sheets: 1-C Petty Cash, 2-A Petty Cash, 2-B Petty Cash.`);
  } catch (err) {
    console.log(`⚠️ Note: Created updated file at ${tempWritePath}. Could not overwrite original directly if opened in another app.`);
  }

  // تنظيف المؤقت
  try { fs.unlinkSync(tempReadPath); } catch(e) {}
  try { fs.unlinkSync(tempWritePath); } catch(e) {}
}

async function createConsumptionTrackerExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Henu Hotel Management';
  workbook.created = new Date();

  // ---------------------------------------------------------
  // الشيت 1: ميزان حركة المخزون وتنبيهات الأمان (Par Level Balance)
  // ---------------------------------------------------------
  const summarySheet = workbook.addWorksheet('ميزان حركة المواد والضيافة', {
    views: [{ rightToLeft: true }]
  });

  summarySheet.mergeCells('A1:I1');
  const sTitle = summarySheet.getCell('A1');
  sTitle.value = '☕ فندق هينو الأهرامات — ميزان حركة استهلاك الضيافة والمشروبات والمناديل (Par Level Balance)';
  sTitle.font = { name: 'Arial', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  sTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  sTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  summarySheet.getRow(1).height = 32;

  summarySheet.addRow([]);

  const summaryHeaders = [
    'كود الصنف',
    'اسم الصنف والمستلزمات',
    'وحدة القياس',
    'رصيد أول المدة',
    'المشتريات / الوارد (+)',
    'المستهلك / المنصرف (-)',
    'الرصيد المتبقي الحصري',
    'حد الأمان / الطلب (Par Level)',
    'حالة المخزون والتنبيه'
  ];

  const shRow = summarySheet.addRow(summaryHeaders);
  shRow.height = 26;
  shRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD97706' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  const inventoryItems = [
    ['CON-01', 'مياه معدنية صغيرة (0.5 لتر)', 'كرتونة (24 زجاجة)', 25, 40, 18, { formula: 'D4+E4-F4', result: 47 }, 15, { formula: 'IF(G4<=H4,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }],
    ['CON-02', 'مياه معدنية كبيرة (1.5 لتر)', 'كرتونة (12 زجاجة)', 15, 20, 12, { formula: 'D5+E5-F5', result: 23 }, 10, { formula: 'IF(G5<=H5,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }],
    ['CON-03', 'قارورة مياه ديسبنسر (19 لتر)', 'قارورة', 8, 15, 9, { formula: 'D6+E6-F6', result: 14 }, 5, { formula: 'IF(G6<=H6,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }],
    ['CON-04', 'نسكافيه 3 في 1 (Nescafé 3in1)', 'علبة (24 ظرف)', 20, 30, 22, { formula: 'D7+E7-F7', result: 28 }, 12, { formula: 'IF(G7<=H7,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }],
    ['CON-05', 'نسكافيه بلاك (Nescafé Classic)', 'برطمان / علبة', 10, 15, 12, { formula: 'D8+E8-F8', result: 13 }, 6, { formula: 'IF(G8<=H8,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }],
    ['CON-06', 'شاي فتلة فندقي (Tea Bags)', 'علبة (100 فتلة)', 18, 25, 14, { formula: 'D9+E9-F9', result: 29 }, 10, { formula: 'IF(G9<=H9,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }],
    ['CON-07', 'ظروف سكر أبيض فندقي', 'كرتونة (1000 ظرف)', 5, 10, 6, { formula: 'D10+E10-F10', result: 9 }, 4, { formula: 'IF(G10<=H10,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }],
    ['CON-08', 'ظروف سكر دايت / بني', 'علبة (100 ظرف)', 12, 15, 14, { formula: 'D11+E11-F11', result: 13 }, 8, { formula: 'IF(G11<=H11,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }],
    ['CON-09', 'مناديل سحب فندقية للغرف (Facial Tissues)', 'علبة / باكيت', 60, 100, 75, { formula: 'D12+E12-F12', result: 85 }, 30, { formula: 'IF(G12<=H12,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }],
    ['CON-10', 'رول مناديل حمامات (Toilet Paper)', 'لفة / كرتونة', 40, 80, 55, { formula: 'D13+E13-F13', result: 65 }, 25, { formula: 'IF(G13<=H13,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }],
    ['CON-11', 'صابون ضيافة فندقي 20 جم', 'كرتونة (500 قطعة)', 4, 8, 5, { formula: 'D14+E14-F14', result: 7 }, 3, { formula: 'IF(G14<=H14,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }],
    ['CON-12', 'شامبو وشاور جل فندقي 30 مل', 'كرتونة (200 عبوة)', 6, 12, 8, { formula: 'D15+E15-F15', result: 10 }, 4, { formula: 'IF(G15<=H15,"⚠️ تنبيه: إعادة طلب فوري","🟢 رصيد آمن ومستقر")', result: '🟢 رصيد آمن ومستقر' }]
  ];

  inventoryItems.forEach((r) => {
    const row = summarySheet.addRow(r);
    row.height = 22;
    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.alignment = { horizontal: colNum === 1 || colNum === 3 || colNum >= 4 ? 'center' : 'right', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };
    });
  });

  const sWidths = [14, 32, 20, 15, 20, 20, 20, 22, 26];
  summarySheet.columns.forEach((col, i) => col.width = sWidths[i]);

  // ---------------------------------------------------------
  // الشيت 2: دفتر حركة الصرف والمسحوبات اليومية (Daily Log)
  // ---------------------------------------------------------
  const logSheet = workbook.addWorksheet('سجل الحركة والمسحوبات اليومية', {
    views: [{ rightToLeft: true }]
  });

  logSheet.mergeCells('A1:I1');
  const lTitle = logSheet.getCell('A1');
  lTitle.value = '📝 سجل حركة صرف الضيافة والمشروبات والمناديل اليومية';
  lTitle.font = { name: 'Arial', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  lTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  lTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  logSheet.getRow(1).height = 32;

  logSheet.addRow([]);

  const logHeaders = [
    'مسلسل',
    'التاريخ',
    'اسم الصنف',
    'الجهة / الدور / الغرفة',
    'الكمية المسحوبة',
    'وحدة القياس',
    'اسم الموظف المسلم/المستلم',
    'الغرض من الاستهلاك',
    'ملاحظات الاعتماد'
  ];

  const lhRow = logSheet.addRow(logHeaders);
  lhRow.height = 26;
  lhRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, bottom: { style: 'medium' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });

  const dailyLogs = [
    [1, '2026-08-15', 'مياه معدنية صغيرة (0.5 لتر)', 'استقبال الفندق', 2, 'كرتونة', 'محمد استقبال', 'ضيافة النزلاء الواصلين', 'تم الاعتماد'],
    [2, '2026-08-15', 'نسكافيه 3 في 1', 'الروف (تراس الفندق)', 3, 'علبة', 'سارة بوفيه', 'مشروبات روف الفندق', 'تم الاعتماد'],
    [3, '2026-08-16', 'شاي فتلة فندقي', 'الدور الثاني (غرف 201-207)', 2, 'علبة', 'أحمد هاوس كيبنج', 'تجهيز صينية الكيتل بالغرف', 'تم الاعتماد'],
    [4, '2026-08-16', 'ظروف سكر أبيض فندقي', 'الدور الثالث (غرف 301-307)', 1, 'كرتونة', 'محمود هاوس كيبنج', 'تجهيز غرف النزلاء', 'تم الاعتماد'],
    [5, '2026-08-17', 'مناديل سحب فندقية', 'جميع أدوار الفندق', 15, 'علبة', 'إبراهيم هاوس كيبنج', 'توزيع على 25 غرفة', 'تم الاعتماد'],
    [6, '2026-08-17', 'رول مناديل حمامات', 'الدور الرابع والروف', 10, 'لفة', 'إبراهيم هاوس كيبنج', 'تزويد الحمامات', 'تم الاعتماد'],
    [7, '2026-08-18', 'قارورة مياه ديسبنسر (19 لتر)', 'استقبال الفندق + البوفيه', 3, 'قارورة', 'حسن استقبال', 'مبرد المياه الرئيسي', 'تم الاعتماد']
  ];

  dailyLogs.forEach((r) => {
    const row = logSheet.addRow(r);
    row.height = 22;
    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.alignment = { horizontal: colNum === 1 || colNum === 2 || colNum === 5 || colNum === 6 ? 'center' : 'right', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } }, left: { style: 'thin', color: { argb: 'E5E7EB' } }, right: { style: 'thin', color: { argb: 'E5E7EB' } } };
    });
  });

  for (let i = 8; i <= 30; i++) {
    const row = logSheet.addRow([i, '', '', '', '', '', '', '', '']);
    row.height = 20;
    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.alignment = { horizontal: colNum === 1 || colNum === 2 || colNum === 5 || colNum === 6 ? 'center' : 'right', vertical: 'middle' };
      cell.border = { top: { style: 'thin', color: { argb: 'F3F4F6' } }, bottom: { style: 'thin', color: { argb: 'F3F4F6' } }, left: { style: 'thin', color: { argb: 'F3F4F6' } }, right: { style: 'thin', color: { argb: 'F3F4F6' } } };
    });
  }

  const lWidths = [8, 14, 30, 26, 16, 16, 24, 26, 18];
  logSheet.columns.forEach((col, i) => col.width = lWidths[i]);

  const destPath1 = path.join(rootDir, 'سجل_استهلاك_المياه_والمشروبات_ومستلزمات_الضيافة.xlsx');
  const inventoryDir = path.join(rootDir, '01_Accounting_System', 'نماذج_جرد_الغرف_والمخازن');
  if (!fs.existsSync(inventoryDir)) {
    fs.mkdirSync(inventoryDir, { recursive: true });
  }
  const destPath2 = path.join(inventoryDir, 'سجل_استهلاك_المياه_والمشروبات_ومستلزمات_الضيافة.xlsx');

  await workbook.xlsx.writeFile(destPath1);
  fs.copyFileSync(destPath1, destPath2);
  console.log(`✅ Created "سجل_استهلاك_المياه_والمشروبات_ومستلزمات_الضيافة.xlsx" in root and inventory folders.`);
}

async function main() {
  await addThreeSheetsToPettyCash();
  await createConsumptionTrackerExcel();
  console.log('\n✨ ALL EXCEL TASKS COMPLETED SUCCESSFULLY!');
}

main().catch(err => console.error(err));
