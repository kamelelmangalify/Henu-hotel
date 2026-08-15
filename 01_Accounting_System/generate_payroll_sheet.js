const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function createPayrollWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Antigravity Accounting & HR System';
  workbook.created = new Date();

  // =========================================================
  // الشيت الأول: كشف الرواتب والتقييم الشهري (30 موظف)
  // =========================================================
  const sheet = workbook.addWorksheet('كشف الرواتب والتقييم الشهري', {
    views: [{ rightToLeft: true }]
  });

  // عنوان الشيت الرئيسي
  sheet.mergeCells('A1:Q1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = '🏨 فندق هينو الأهرامات — كشف الرواتب وتقييم الأداء الشهري الشامل (30 موظف)';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.addRow([]); // صف فارغ

  // عناوين الأعمدة
  const headers = [
    'كود الموظف',
    'اسم الموظف',
    'القسم / الوظيفة',
    'الراتب الشامل',
    'الراتب الأساسي (75%)',
    'حافز الـ KPI المتاح (25%)',
    'تقييم الأداء (من 100)',
    'نسبة استحقاق الحافز',
    'حافز الأداء المستحق',
    'أيام الغياب',
    'خصم الغياب (جـ)',
    'أيام الجزاءات',
    'خصم الجزاءات (جـ)',
    'خصم السلف',
    'إجمالي الخصومات',
    'صافي الراتب المدفوع',
    'التوقيع بالاستلام'
  ];

  const headerRow = sheet.addRow(headers);
  headerRow.height = 30;
  headerRow.eachCell(cell => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'CCCCCC' } },
      bottom: { style: 'medium', color: { argb: '1F4E78' } },
      left: { style: 'thin', color: { argb: 'CCCCCC' } },
      right: { style: 'thin', color: { argb: 'CCCCCC' } }
    };
  });

  // قائمة 30 موظف موزعين على كافة أقسام الفندق
  const employees = [
    // الاستقبال والمكاتب الأمامية (6 موظفين)
    { id: 'EMP-101', name: 'أحمد محمود علي', role: 'مشرف استقبال', salary: 7500, score: 95, absence: 0, penalty: 0, advance: 500 },
    { id: 'EMP-102', name: 'محمد حسن إبراهيم', role: 'موظف استقبال نهار', salary: 5800, score: 88, absence: 1, penalty: 0, advance: 0 },
    { id: 'EMP-103', name: 'عمر خالد فوزي', role: 'موظف استقبال ليل', salary: 5800, score: 92, absence: 0, penalty: 0, advance: 300 },
    { id: 'EMP-104', name: 'نور الدين طارق', role: 'موظف استقبال', salary: 5500, score: 84, absence: 0, penalty: 1, advance: 0 },
    { id: 'EMP-105', name: 'مريم عادل القاضي', role: 'مأمور علاقات نزلاء', salary: 6000, score: 96, absence: 0, penalty: 0, advance: 200 },
    { id: 'EMP-106', name: 'مصطفى كمال الدين', role: 'مساعد استقبال', salary: 4800, score: 78, absence: 1, penalty: 0, advance: 150 },

    // الإشراف الداخلي والنظافة (12 موظف)
    { id: 'EMP-107', name: 'أميرة عبد العزيز', role: 'مشرفة الإشراف الداخلي', salary: 6500, score: 94, absence: 0, penalty: 0, advance: 400 },
    { id: 'EMP-108', name: 'سيد مصطفى طه', role: 'عامل غرف أول', salary: 4600, score: 85, absence: 1, penalty: 0, advance: 200 },
    { id: 'EMP-109', name: 'حسين علي كمال', role: 'عامل تنظيف غرف', salary: 4400, score: 79, absence: 2, penalty: 1, advance: 0 },
    { id: 'EMP-110', name: 'إبراهيم خليفة', role: 'عامل تنظيف غرف', salary: 4400, score: 91, absence: 0, penalty: 0, advance: 100 },
    { id: 'EMP-111', name: 'رمضان فتحي', role: 'عامل تنظيف غرف', salary: 4400, score: 83, absence: 0, penalty: 0, advance: 0 },
    { id: 'EMP-112', name: 'عاطف منصور', role: 'عامل تنظيف غرف', salary: 4400, score: 68, absence: 3, penalty: 2, advance: 300 },
    { id: 'EMP-113', name: 'حسن شحاتة', role: 'عامل غسيل وكتانيات', salary: 4500, score: 90, absence: 0, penalty: 0, advance: 250 },
    { id: 'EMP-114', name: 'زينب أحمد السيد', role: 'عامله نظافة أماكن عامة', salary: 4200, score: 87, absence: 0, penalty: 0, advance: 0 },
    { id: 'EMP-115', name: 'فاطمة محمود', role: 'عامله نظافة أماكن عامة', salary: 4200, score: 80, absence: 1, penalty: 0, advance: 100 },
    { id: 'EMP-116', name: 'محمود جابر', role: 'عامل نظافة ممرات', salary: 4300, score: 74, absence: 2, penalty: 0, advance: 0 },
    { id: 'EMP-117', name: 'علي عبد السميع', role: 'مساعد إشراف داخلي', salary: 4300, score: 89, absence: 0, penalty: 0, advance: 150 },
    { id: 'EMP-118', name: 'فتحي رجب', role: 'عامل نظافة وأماكن عامة', salary: 4200, score: 86, absence: 0, penalty: 1, advance: 0 },

    // المطعم والكافيه والأغذية والمشروبات (8 موظفين)
    { id: 'EMP-119', name: 'خالد رجب سلامة', role: 'مدير مطعم وكافيه', salary: 8500, score: 97, absence: 0, penalty: 0, advance: 1000 },
    { id: 'EMP-120', name: 'طارق صلاح الدين', role: 'مشرف أغذية ومشروبات', salary: 6800, score: 91, absence: 0, penalty: 0, advance: 300 },
    { id: 'EMP-121', name: 'إسلام يوسف أحمد', role: 'ويتر كافيه رئيسي', salary: 4900, score: 88, absence: 0, penalty: 0, advance: 0 },
    { id: 'EMP-122', name: 'مصطفى ربيع جابر', role: 'ويتر كافيه', salary: 4700, score: 72, absence: 2, penalty: 1, advance: 200 },
    { id: 'EMP-123', name: 'وليد صبري', role: 'ويتر مطعم إفطار', salary: 4700, score: 86, absence: 0, penalty: 0, advance: 150 },
    { id: 'EMP-124', name: 'كريم شعبان', role: 'باريستا بائع كافيه', salary: 5000, score: 93, absence: 0, penalty: 0, advance: 400 },
    { id: 'EMP-125', name: 'سامح فاروق', role: 'مساعد ويتر تجهيز', salary: 4300, score: 81, absence: 1, penalty: 0, advance: 0 },
    { id: 'EMP-126', name: 'أحمد بدوي', role: 'عامل غسيل أطباق وتجهيز', salary: 4200, score: 85, absence: 0, penalty: 0, advance: 100 },

    // الصيانة والإدارة والخدمات المعاونة (4 موظفين)
    { id: 'EMP-127', name: 'المهندس تامر فؤاد', role: 'مشرف صيانة الفندق', salary: 7200, score: 94, absence: 0, penalty: 0, advance: 600 },
    { id: 'EMP-128', name: 'جمال عبد المعطي', role: 'فني كهرباء وسباكة', salary: 5200, score: 89, absence: 0, penalty: 0, advance: 200 },
    { id: 'EMP-129', name: 'رفعت عبد الصمد', role: 'سائق ومسؤول خدمات', salary: 5000, score: 87, absence: 1, penalty: 0, advance: 150 },
    { id: 'EMP-130', name: 'صبحي عبد العال', role: 'مسؤول أمن وحراسة', salary: 4800, score: 92, absence: 0, penalty: 0, advance: 0 }
  ];

  const startRow = 4;
  employees.forEach((emp, idx) => {
    const r = startRow + idx;
    
    const row = sheet.addRow([
      emp.id,
      emp.name,
      emp.role,
      emp.salary,
      { formula: `D${r}*0.75` },
      { formula: `D${r}*0.25` },
      emp.score,
      { formula: `IF(G${r}>=90,1,IF(G${r}>=80,0.75,IF(G${r}>=70,0.5,0)))` },
      { formula: `F${r}*H${r}` },
      emp.absence,
      { formula: `ROUND((E${r}/30)*J${r}, 2)` },
      emp.penalty,
      { formula: `ROUND((E${r}/30)*L${r}, 2)` },
      emp.advance,
      { formula: `K${r}+M${r}+N${r}` },
      { formula: `E${r}+I${r}-O${r}` },
      ''
    ]);

    row.height = 23;
    const isEven = idx % 2 === 0;
    const bg = isEven ? 'F9FAFB' : 'FFFFFF';

    row.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9.5 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { horizontal: colNum <= 3 ? 'right' : 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'E5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
        left: { style: 'thin', color: { argb: 'E5E7EB' } },
        right: { style: 'thin', color: { argb: 'E5E7EB' } }
      };

      if ([4, 5, 6, 9, 11, 13, 14, 15, 16].includes(colNum)) {
        cell.numFmt = '#,##0.00" جـ"';
      }
      if (colNum === 8) {
        cell.numFmt = '0%';
        cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1F4E78' } };
      }
      if (colNum === 16) {
        cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF276749' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6F4EA' } };
      }
    });
  });

  // صف الإجمالي
  const lastRow = startRow + employees.length - 1;

  const totalsRow = sheet.addRow([
    'الإجمالي الكلي',
    `${employees.length} موظف`,
    '-',
    { formula: `SUM(D4:D${lastRow})` },
    { formula: `SUM(E4:E${lastRow})` },
    { formula: `SUM(F4:F${lastRow})` },
    { formula: `AVERAGE(G4:G${lastRow})` },
    '-',
    { formula: `SUM(I4:I${lastRow})` },
    { formula: `SUM(J4:J${lastRow})` },
    { formula: `SUM(K4:K${lastRow})` },
    { formula: `SUM(L4:L${lastRow})` },
    { formula: `SUM(M4:M${lastRow})` },
    { formula: `SUM(N4:N${lastRow})` },
    { formula: `SUM(O4:O${lastRow})` },
    { formula: `SUM(P4:P${lastRow})` },
    '-'
  ]);

  totalsRow.height = 28;
  totalsRow.eachCell((cell, colNum) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1F4E78' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9E1F2' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'double', color: { argb: '1F4E78' } },
      bottom: { style: 'double', color: { argb: '1F4E78' } },
      left: { style: 'thin', color: { argb: 'B4C6E7' } },
      right: { style: 'thin', color: { argb: 'B4C6E7' } }
    };
    if ([4, 5, 6, 9, 11, 13, 14, 15, 16].includes(colNum)) {
      cell.numFmt = '#,##0.00" جـ"';
    }
  });

  const widths = [12, 22, 24, 16, 16, 16, 14, 14, 16, 12, 14, 12, 14, 14, 16, 18, 20];
  sheet.columns.forEach((col, idx) => {
    col.width = widths[idx] || 16;
  });

  // =========================================================
  // الشيت الثاني: دليل تعليمات وشروط الصرف
  // =========================================================
  const guideSheet = workbook.addWorksheet('دليل وشروط حساب المرتبات', {
    views: [{ rightToLeft: true }]
  });

  guideSheet.mergeCells('A1:E1');
  const gTitle = guideSheet.getCell('A1');
  gTitle.value = '💡 قواعد وشروط حساب أجور وحوافز فندق هينو الأهرامات (30 موظف)';
  gTitle.font = { name: 'Arial', size: 15, bold: true, color: { argb: 'FFFFFFFF' } };
  gTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF375623' } };
  gTitle.alignment = { horizontal: 'center', vertical: 'middle' };

  guideSheet.addRow([]);

  const rules = [
    ['معادلة هيكلة الراتب:', 'الراتب الشامل يتقسم إلى: 75% راتب أساسي ثابت + 25% حافز تقييم أداء متغيّر (KPIs).'],
    ['معيار استحقاق حافز الـ KPI (من 100):', '• تقييم 90% إلى 100% ⬅️ صرف 100% من الحافز المتاح.'],
    ['', '• تقييم 80% إلى 89% ⬅️ صرف 75% من الحافز المتاح.'],
    ['', '• تقييم 70% إلى 79% ⬅️ صرف 50% من الحافز المتاح.'],
    ['', '• تقييم أقل من 70% ⬅️ صرف 0% من الحافز (حرمان لحين التحسين).'],
    ['معادلة خصم الغياب:', 'خصم قيمة أجر يوم الغياب = (الراتب الأساسي 75% ÷ 30 يوم) × عدد أيام الغياب.'],
    ['معادلة خصم الجزاءات:', 'خصم الجزاء الإداري = (الراتب الأساسي 75% ÷ 30 يوم) × عدد أيام الجزاء.'],
    ['صافي الراتب المدفوع:', 'صافي المرتب = الراتب الأساسي + حافز الـ KPI المستحق - (خصم الغياب + الجزاءات + السلفيات).']
  ];

  rules.forEach(r => {
    const row = guideSheet.addRow([r[0], r[1]]);
    row.height = 24;
    row.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF1F4E78' } };
    row.getCell(2).font = { name: 'Arial', size: 10.5 };
  });

  guideSheet.getColumn(1).width = 30;
  guideSheet.getColumn(2).width = 80;

  // حفظ الملف مع التعامل مع القفل
  let outputPath = path.join(__dirname, 'جدول_رواتب_وتقييم_الموظفين_الشهري.xlsx');
  try {
    await workbook.xlsx.writeFile(outputPath);
    console.log(`Excel Payroll for 30 employees created successfully at: ${outputPath}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      outputPath = path.join(__dirname, 'جدول_رواتب_وتقييم_30_موظف_الشهري.xlsx');
      await workbook.xlsx.writeFile(outputPath);
      console.log(`Main file locked, created fallback file at: ${outputPath}`);
    } else {
      throw err;
    }
  }
  return outputPath;
}

createPayrollWorkbook().catch(err => console.error(err));
