const ExcelJS = require('exceljs');
const path = require('path');

async function createPayrollWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Antigravity Accounting & HR System';
  workbook.created = new Date();

  // =========================================================
  // الشيت الأول: كشف الرواتب والتقييم الشهري (Monthly Payroll)
  // =========================================================
  const sheet = workbook.addWorksheet('كشف الرواتب والتقييم الشهري', {
    views: [{ rightToLeft: true }]
  });

  // عنوان الشيت الرئيسي
  sheet.mergeCells('A1:Q1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = '🏨 فندق هينو الأهرامات — كشف الرواتب وتقييم الأداء الشهري (Payroll & KPI Sheet)';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.addRow([]); // صف فارغ

  // عناوين الأعمدة
  const headers = [
    'كود',
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

  // بيانات نموذجية لـ 8 موظفين بالفندق
  const employees = [
    { id: 'EMP-101', name: 'أحمد محمود علي', role: 'مشرف استقبال', salary: 7000, score: 95, absence: 0, penalty: 0, advance: 500 },
    { id: 'EMP-102', name: 'محمد حسن إبراهيم', role: 'موظف استقبال', salary: 5500, score: 88, absence: 1, penalty: 0, advance: 0 },
    { id: 'EMP-103', name: 'أميرة عبد العزيز', role: 'مشرفة غرف', salary: 6000, score: 92, absence: 0, penalty: 0, advance: 300 },
    { id: 'EMP-104', name: 'سيد مصطفى طه', role: 'عامل نظافة غرف', salary: 4500, score: 82, absence: 2, penalty: 1, advance: 200 },
    { id: 'EMP-105', name: 'حسين علي كمال', role: 'عامل نظافة غرف', salary: 4500, score: 75, absence: 1, penalty: 0, advance: 0 },
    { id: 'EMP-106', name: 'خالد رجب سلامة', role: 'مدير مطعم وكافيه', salary: 8000, score: 96, absence: 0, penalty: 0, advance: 1000 },
    { id: 'EMP-107', name: 'إسلام يوسف أحمد', role: 'ويتر كافيه', salary: 4800, score: 85, absence: 0, penalty: 1, advance: 0 },
    { id: 'EMP-108', name: 'مصطفى ربيع جابر', role: 'ويتر كافيه', salary: 4800, score: 68, absence: 3, penalty: 2, advance: 400 },
  ];

  const startRow = 4;
  employees.forEach((emp, idx) => {
    const r = startRow + idx;
    
    // معادلات الإكسيل الذكية تلقائياً:
    // Col D: الراتب الشامل
    // Col E: الأساسي 75% = D * 0.75
    // Col F: حافز متاح 25% = D * 0.25
    // Col G: التقييم
    // Col H: نسبة الاستحقاق = IF(G>=90, 1, IF(G>=80, 0.75, IF(G>=70, 0.5, 0)))
    // Col I: حافز مستحق = F * H
    // Col J: أيام الغياب
    // Col K: خصم الغياب = (E / 30) * J
    // Col L: أيام الجزاءات
    // Col M: خصم الجزاءات = (E / 30) * L
    // Col N: خصم السلف
    // Col O: إجمالي الخصومات = K + M + N
    // Col P: صافي المدفوع = E + I - O

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
      '' // توقيع الموظف
    ]);

    row.height = 24;
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

      // تنسيق الأرقام والعملات والنسب
      if ([4, 5, 6, 9, 11, 13, 14, 15, 16].includes(colNum)) {
        cell.numFmt = '#,##0.00" جـ"';
      }
      if (colNum === 8) {
        cell.numFmt = '0%';
        cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1F4E78' } };
      }
      if (colNum === 16) {
        cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF276749' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6F4EA' } };
      }
    });
  });

  // صف الإجمالي
  const lastRow = startRow + employees.length - 1;
  const totalsRowIndex = lastRow + 1;

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

  // عرض الأعمدة
  const widths = [12, 22, 22, 16, 16, 16, 14, 14, 16, 12, 14, 12, 14, 14, 16, 18, 20];
  sheet.columns.forEach((col, idx) => {
    col.width = widths[idx] || 16;
  });

  // =========================================================
  // الشيت الثاني: دليل تعليمات وشروط الصرف والـ KPIs
  // =========================================================
  const guideSheet = workbook.addWorksheet('دليل وشروط حساب المرتبات', {
    views: [{ rightToLeft: true }]
  });

  guideSheet.mergeCells('A1:E1');
  const gTitle = guideSheet.getCell('A1');
  gTitle.value = '💡 قواعد وشروط حساب أجور وحوافز فندق هينو الأهرامات';
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

  // حفظ الملف
  const outputPath = path.join(__dirname, 'جدول_رواتب_وتقييم_الموظفين_الشهري.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Excel Payroll created successfully at: ${outputPath}`);
  return outputPath;
}

createPayrollWorkbook().catch(err => console.error(err));
