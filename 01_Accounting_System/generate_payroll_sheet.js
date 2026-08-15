const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function createPayrollWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Antigravity Accounting & HR System';
  workbook.created = new Date();

  // =========================================================
  // بيانات الموظفين الـ 30 وتقسيمهم حسب الأقسام
  // =========================================================
  const employees = [
    // الاستقبال والمكاتب الأمامية (6 موظفين) - dept: 'reception'
    { id: 'EMP-101', name: 'أحمد محمود علي', role: 'مشرف استقبال', salary: 7500, dept: 'reception', absence: 0, penalty: 0, advance: 500 },
    { id: 'EMP-102', name: 'محمد حسن إبراهيم', role: 'موظف استقبال نهار', salary: 5800, dept: 'reception', absence: 1, penalty: 0, advance: 0 },
    { id: 'EMP-103', name: 'عمر خالد فوزي', role: 'موظف استقبال ليل', salary: 5800, dept: 'reception', absence: 0, penalty: 0, advance: 300 },
    { id: 'EMP-104', name: 'نور الدين طارق', role: 'موظف استقبال', salary: 5500, dept: 'reception', absence: 0, penalty: 1, advance: 0 },
    { id: 'EMP-105', name: 'مريم عادل القاضي', role: 'مأمور علاقات نزلاء', salary: 6000, dept: 'reception', absence: 0, penalty: 0, advance: 200 },
    { id: 'EMP-106', name: 'مصطفى كمال الدين', role: 'مساعد استقبال', salary: 4800, dept: 'reception', absence: 1, penalty: 0, advance: 150 },

    // الإشراف الداخلي والنظافة (12 موظف) - dept: 'housekeeping'
    { id: 'EMP-107', name: 'أميرة عبد العزيز', role: 'مشرفة الإشراف الداخلي', salary: 6500, dept: 'housekeeping', absence: 0, penalty: 0, advance: 400 },
    { id: 'EMP-108', name: 'سيد مصطفى طه', role: 'عامل غرف أول', salary: 4600, dept: 'housekeeping', absence: 1, penalty: 0, advance: 200 },
    { id: 'EMP-109', name: 'حسين علي كمال', role: 'عامل تنظيف غرف', salary: 4400, dept: 'housekeeping', absence: 2, penalty: 1, advance: 0 },
    { id: 'EMP-110', name: 'إبراهيم خليفة', role: 'عامل تنظيف غرف', salary: 4400, dept: 'housekeeping', absence: 0, penalty: 0, advance: 100 },
    { id: 'EMP-111', name: 'رمضان فتحي', role: 'عامل تنظيف غرف', salary: 4400, dept: 'housekeeping', absence: 0, penalty: 0, advance: 0 },
    { id: 'EMP-112', name: 'عاطف منصور', role: 'عامل تنظيف غرف', salary: 4400, dept: 'housekeeping', absence: 3, penalty: 2, advance: 300 },
    { id: 'EMP-113', name: 'حسن شحاتة', role: 'عامل غسيل وكتانيات', salary: 4500, dept: 'housekeeping', absence: 0, penalty: 0, advance: 250 },
    { id: 'EMP-114', name: 'زينب أحمد السيد', role: 'عامله نظافة أماكن عامة', salary: 4200, dept: 'housekeeping', absence: 0, penalty: 0, advance: 0 },
    { id: 'EMP-115', name: 'فاطمة محمود', role: 'عامله نظافة أماكن عامة', salary: 4200, dept: 'housekeeping', absence: 1, penalty: 0, advance: 100 },
    { id: 'EMP-116', name: 'محمود جابر', role: 'عامل نظافة ممرات', salary: 4300, dept: 'housekeeping', absence: 2, penalty: 0, advance: 0 },
    { id: 'EMP-117', name: 'علي عبد السميع', role: 'مساعد إشراف داخلي', salary: 4300, dept: 'housekeeping', absence: 0, penalty: 0, advance: 150 },
    { id: 'EMP-118', name: 'فتحي رجب', role: 'عامل نظافة وأماكن عامة', salary: 4200, dept: 'housekeeping', absence: 0, penalty: 1, advance: 0 },

    // المطعم والكافيه والخدمة (8 موظفين) - dept: 'restaurant'
    { id: 'EMP-119', name: 'خالد رجب سلامة', role: 'مدير مطعم وكافيه', salary: 8500, dept: 'restaurant', absence: 0, penalty: 0, advance: 1000 },
    { id: 'EMP-120', name: 'طارق صلاح الدين', role: 'مشرف أغذية ومشروبات', salary: 6800, dept: 'restaurant', absence: 0, penalty: 0, advance: 300 },
    { id: 'EMP-121', name: 'إسلام يوسف أحمد', role: 'ويتر كافيه رئيسي', salary: 4900, dept: 'restaurant', absence: 0, penalty: 0, advance: 0 },
    { id: 'EMP-122', name: 'مصطفى ربيع جابر', role: 'ويتر كافيه', salary: 4700, dept: 'restaurant', absence: 2, penalty: 1, advance: 200 },
    { id: 'EMP-123', name: 'وليد صبري', role: 'ويتر مطعم إفطار', salary: 4700, dept: 'restaurant', absence: 0, penalty: 0, advance: 150 },
    { id: 'EMP-124', name: 'كريم شعبان', role: 'باريستا بائع كافيه', salary: 5000, dept: 'restaurant', absence: 0, penalty: 0, advance: 400 },
    { id: 'EMP-125', name: 'سامح فاروق', role: 'مساعد ويتر تجهيز', salary: 4300, dept: 'restaurant', absence: 1, penalty: 0, advance: 0 },
    { id: 'EMP-126', name: 'أحمد بدوي', role: 'عامل غسيل أطباق وتجهيز', salary: 4200, dept: 'restaurant', absence: 0, penalty: 0, advance: 100 },

    // الصيانة والإدارة والخدمات المعاونة (4 موظفين) - dept: 'maintenance'
    { id: 'EMP-127', name: 'المهندس تامر فؤاد', role: 'مشرف صيانة الفندق', salary: 7200, dept: 'maintenance', absence: 0, penalty: 0, advance: 600 },
    { id: 'EMP-128', name: 'جمال عبد المعطي', role: 'فني كهرباء وسباكة', salary: 5200, dept: 'maintenance', absence: 0, penalty: 0, advance: 200 },
    { id: 'EMP-129', name: 'رفعت عبد الصمد', role: 'سائق ومسؤول خدمات', salary: 5000, dept: 'maintenance', absence: 1, penalty: 0, advance: 150 },
    { id: 'EMP-130', name: 'صبحي عبد العال', role: 'مسؤول أمن وحراسة', salary: 4800, dept: 'maintenance', absence: 0, penalty: 0, advance: 0 }
  ];

  // أسم الشيتات الفرعية للتقييم اليومي لكل قسم
  const deptSheets = {
    reception: { name: 'تقييم يومي - الاستقبال', title: '📋 شيت التقييم اليومي للـ KPIs — قسم الاستقبال والمكاتب الأمامية' },
    housekeeping: { name: 'تقييم يومي - الإشراف والغرف', title: '🧹 شيت التقييم اليومي للـ KPIs — قسم الإشراف الداخلي والغرف' },
    restaurant: { name: 'تقييم يومي - المطعم والخدمة', title: '🍽️ شيت التقييم اليومي للـ KPIs — قسم المطعم والكافيه' },
    maintenance: { name: 'تقييم يومي - الصيانة والخدمات', title: '🔧 شيت التقييم اليومي للـ KPIs — قسم الصيانة والخدمات المعاونة' }
  };

  // =========================================================
  // 1. إنشاء شيتات التقييم اليومية لكل قسم وتدوين الدرجات
  // =========================================================
  const deptRowMapping = {}; // يخزن رقم الصف لكل موظف في شيت قسمه

  for (const [deptKey, deptInfo] of Object.entries(deptSheets)) {
    const dSheet = workbook.addWorksheet(deptInfo.name, {
      views: [{ rightToLeft: true }]
    });

    // عنوان شيت القسم
    dSheet.mergeCells('A1:AJ1');
    const tCell = dSheet.getCell('A1');
    tCell.value = deptInfo.title;
    tCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    tCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    tCell.alignment = { horizontal: 'center', vertical: 'middle' };

    dSheet.addRow([]); // صف فارغ

    // رؤوس أعمدة شيت التقييم اليومي (كود، اسم، وظيفة، أيام 1 إلى 30، إجمالي، نسبة مئوية)
    const kpiHeaders = ['كود الموظف', 'اسم الموظف', 'الوظيفة'];
    for (let day = 1; day <= 30; day++) {
      kpiHeaders.push(`يوم ${day}`);
    }
    kpiHeaders.push('إجمالي الدرجات (من 150)', 'النسبة الشهرية % (من 100)');

    const hRow = dSheet.addRow(kpiHeaders);
    hRow.height = 28;
    hRow.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'CCCCCC' } },
        bottom: { style: 'medium', color: { argb: '1F4E78' } },
        left: { style: 'thin', color: { argb: 'CCCCCC' } },
        right: { style: 'thin', color: { argb: 'CCCCCC' } }
      };
    });

    // تصفية موظفي هذا القسم
    const deptEmps = employees.filter(e => e.dept === deptKey);
    const dStartRow = 4;

    deptEmps.forEach((emp, index) => {
      const currentRow = dStartRow + index;
      deptRowMapping[emp.id] = { sheetName: deptInfo.name, rowNum: currentRow };

      const rowValues = [emp.id, emp.name, emp.role];

      // توليد درجـات يوميـة نموذجية واقعيـة (من 1 إلى 5 درجات يومياً لكل يوم)
      // 5 درجات تتقسم إلى: (1. الحضور بالموعد | 2. النظافة الشخصية | 3. الزي الرسمي | 4. الابتسامة واللباقة | 5. الأداء المهني)
      for (let day = 1; day <= 30; day++) {
        let dailyScore = 5;
        // إذا كان الموظف لديه غياب أو جزاءات يتم خصم درجات في بعض الأيام لتكون البيانات واقعية ومتناسقة
        if (emp.absence > 0 && day % 10 === 0 && day / 10 <= emp.absence) dailyScore = 0;
        else if (emp.penalty > 0 && day % 7 === 0) dailyScore = 3;
        else if (index % 2 === 1 && day % 5 === 0) dailyScore = 4;
        
        rowValues.push(dailyScore);
      }

      // حساب الإجمالي والنسبة المئوية بالمعادلات:
      // Col D (col 4) إلى Col AG (col 33) هما الـ 30 يوم
      // Col AH (col 34): `=SUM(D{r}:AG{r})`
      // Col AI (col 35): `=ROUND((AH{r} / 150) * 100, 0)`
      const r = currentRow;
      rowValues.push({ formula: `SUM(D${r}:AG${r})` });
      rowValues.push({ formula: `ROUND((AH${r}/150)*100, 0)` });

      const dRow = dSheet.addRow(rowValues);
      dRow.height = 22;
      const isEven = index % 2 === 0;
      const bg = isEven ? 'F9FAFB' : 'FFFFFF';

      dRow.eachCell((cell, colNum) => {
        cell.font = { name: 'Arial', size: 9 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
        cell.alignment = { horizontal: colNum <= 3 ? 'right' : 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'E5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
          left: { style: 'thin', color: { argb: 'E5E7EB' } },
          right: { style: 'thin', color: { argb: 'E5E7EB' } }
        };

        if (colNum >= 4 && colNum <= 33) {
          // تمييز الأيام بالوان خفيفة
          if (cell.value === 5) cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF276749' } };
          if (cell.value === 0) {
            cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFC53030' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5' } };
          }
        }

        if (colNum === 35) { // النسبة المئوية %
          cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1F4E78' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EBF8FF' } };
        }
      });
    });

    // ضبط عرض الأعمدة
    dSheet.getColumn(1).width = 12; // كود
    dSheet.getColumn(2).width = 22; // اسم
    dSheet.getColumn(3).width = 24; // وظيفة
    for (let c = 4; c <= 33; c++) dSheet.getColumn(c).width = 6.5; // الأيام
    dSheet.getColumn(34).width = 18; // إجمالي
    dSheet.getColumn(35).width = 22; // نسبة مئوية
  }

  // =========================================================
  // 2. الشيت الرئيسي: كشف الرواتب والتقييم الشهري (مرتبط آلياً)
  // =========================================================
  const masterSheet = workbook.addWorksheet('كشف الرواتب والتقييم الشهري', {
    views: [{ rightToLeft: true }]
  });

  masterSheet.mergeCells('A1:Q1');
  const titleCell = masterSheet.getCell('A1');
  titleCell.value = '🏨 فندق هينو الأهرامات — كشف الرواتب المالي الشهري المرتبط آلياً بتقييم الـ KPIs اليومي';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  masterSheet.addRow([]); // صف فارغ

  const headers = [
    'كود الموظف',
    'اسم الموظف',
    'القسم / الوظيفة',
    'الراتب الشامل',
    'الراتب الأساسي (75%)',
    'حافز الـ KPI المتاح (25%)',
    'التقييم الشهري (من 100)',
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

  const headerRow = masterSheet.addRow(headers);
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

  const startRow = 4;
  employees.forEach((emp, idx) => {
    const r = startRow + idx;
    const mapInfo = deptRowMapping[emp.id];

    // معادلة الربط اللحظي مع شيت التقييم اليومي الخاص بالقسم:
    // الخانة G{r} تأخذ قيمتها مباشرة من النسبة المئوية في شيت التقييم اليومي (العامود AI أي رقم 35)
    const kpiFormula = `'${mapInfo.sheetName}'!AI${mapInfo.rowNum}`;

    const row = masterSheet.addRow([
      emp.id,
      emp.name,
      emp.role,
      emp.salary,
      { formula: `D${r}*0.75` },
      { formula: `D${r}*0.25` },
      { formula: kpiFormula }, // 👈 التقييم الشهري المرتبط آلياً!
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
      if (colNum === 7) { // التقييم المرتبط آلياً
        cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1F4E78' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EFF6FF' } };
      }
      if (colNum === 8) { // النسبة المئوية للحافز
        cell.numFmt = '0%';
        cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1F4E78' } };
      }
      if (colNum === 16) { // صافي المدفوع
        cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF276749' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6F4EA' } };
      }
    });
  });

  // صف الإجمالي في الشيت الرئيسي
  const lastRow = startRow + employees.length - 1;

  const totalsRow = masterSheet.addRow([
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

  const masterWidths = [12, 22, 24, 16, 16, 16, 14, 14, 16, 12, 14, 12, 14, 14, 16, 18, 20];
  masterSheet.columns.forEach((col, idx) => {
    col.width = masterWidths[idx] || 16;
  });

  // =========================================================
  // 3. الشيت التعليمي: دليل وشروط حساب المرتبات والـ KPIs
  // =========================================================
  const guideSheet = workbook.addWorksheet('دليل وشروط حساب المرتبات', {
    views: [{ rightToLeft: true }]
  });

  guideSheet.mergeCells('A1:E1');
  const gTitle = guideSheet.getCell('A1');
  gTitle.value = '💡 قواعد وشروط حساب أجور وحوافز الـ KPIs اليومية — فندق هينو الأهرامات';
  gTitle.font = { name: 'Arial', size: 15, bold: true, color: { argb: 'FFFFFFFF' } };
  gTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF375623' } };
  gTitle.alignment = { horizontal: 'center', vertical: 'middle' };

  guideSheet.addRow([]);

  const rules = [
    ['معيار التقييم اليومي (5 درجات يومياً):', '1. الحضور والالتزام بالميعاد (1 درجة)\n2. النظافة الشخصية والمظهر (1 درجة)\n3. ارتداء الزي الرسمي بالكامل Uniform (1 درجة)\n4. الابتسامة واللباقة الفندقية أثناء العمل (1 درجة)\n5. جودة وإتقان مهام الوظيفة الفندقية (1 درجة).'],
    ['طريقة حساب التقييم الشهري:', 'يتم تجميع درجات الأيام الـ 30 (حد أقصى 150 درجة)، وتحسب النسبة المئوية % وتُرَحَّل آلياً إلى شيت المرتبات الرئيسي.'],
    ['معادلة هيكلة الراتب (75% / 25%):', 'الراتب الشامل يتكون من: 75% راتب أساسي ثابت + 25% حافز تقييم أداء متغيّر (KPIs).'],
    ['معيار استحقاق حافز الـ KPI (من 100):', '• تقييم 90% إلى 100% ⬅️ صرف 100% من الحافز المتاح.\n• تقييم 80% إلى 89% ⬅️ صرف 75% من الحافز المتاح.\n• تقييم 70% إلى 79% ⬅️ صرف 50% من الحافز المتاح.\n• تقييم أقل من 70% ⬅️ صرف 0% من الحافز (حرمان لحين التحسين).'],
    ['معادلة خصم الغياب والجزاءات:', 'خصم أجر اليوم = (الراتب الأساسي 75% ÷ 30 يوم) × عدد أيام الغياب أو الجزاءات.']
  ];

  rules.forEach(r => {
    const row = guideSheet.addRow([r[0], r[1]]);
    row.height = 36;
    row.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF1F4E78' } };
    row.getCell(2).font = { name: 'Arial', size: 10 };
    row.getCell(2).alignment = { wrapText: true };
  });

  guideSheet.getColumn(1).width = 35;
  guideSheet.getColumn(2).width = 85;

  // حفظ الملف مع دعم التعامل مع القفل
  let outputPath = path.join(__dirname, 'جدول_رواتب_وتقييم_الموظفين_الشهري.xlsx');
  try {
    await workbook.xlsx.writeFile(outputPath);
    console.log(`Master Payroll Workbook with Daily KPI Trackers created at: ${outputPath}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      outputPath = path.join(__dirname, 'جدول_رواتب_وتقييم_30_موظف_الشهري.xlsx');
      await workbook.xlsx.writeFile(outputPath);
      console.log(`Main file locked, saved to fallback path: ${outputPath}`);
    } else {
      throw err;
    }
  }
  return outputPath;
}

createPayrollWorkbook().catch(err => console.error(err));
