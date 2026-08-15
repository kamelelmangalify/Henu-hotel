const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function createAttendanceWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Antigravity Accounting & HR System';
  workbook.created = new Date();

  // قائمة أسماء 20 موظفاً كمثال جاهز للتعبئة أو الطباعة
  const sampleEmployees = [
    { id: 'EMP-101', name: 'أحمد محمود علي', role: 'مشرف استقبال' },
    { id: 'EMP-102', name: 'محمد حسن إبراهيم', role: 'موظف استقبال نهار' },
    { id: 'EMP-103', name: 'عمر خالد فوزي', role: 'موظف استقبال ليل' },
    { id: 'EMP-104', name: 'نور الدين طارق', role: 'موظف استقبال' },
    { id: 'EMP-105', name: 'مريم عادل القاضي', role: 'علاقات نزلاء' },
    { id: 'EMP-106', name: 'مصطفى كمال الدين', role: 'مساعد استقبال' },
    { id: 'EMP-107', name: 'أميرة عبد العزيز', role: 'مشرفة الإشراف الداخلي' },
    { id: 'EMP-108', name: 'سيد مصطفى طه', role: 'عامل غرف أول' },
    { id: 'EMP-109', name: 'حسين علي كمال', role: 'عامل تنظيف غرف' },
    { id: 'EMP-110', name: 'إبراهيم خليفة', role: 'عامل تنظيف غرف' },
    { id: 'EMP-111', name: 'رمضان فتحي', role: 'عامل تنظيف غرف' },
    { id: 'EMP-112', name: 'عاطف منصور', role: 'عامل تنظيف غرف' },
    { id: 'EMP-113', name: 'حسن شحاتة', role: 'عامل غسيل وكتانيات' },
    { id: 'EMP-114', name: 'زينب أحمد السيد', role: 'عامله نظافة أماكن عامة' },
    { id: 'EMP-115', name: 'خالد رجب سلامة', role: 'مدير مطعم وكافيه' },
    { id: 'EMP-116', name: 'طارق صلاح الدين', role: 'مشرف أغذية ومشروبات' },
    { id: 'EMP-117', name: 'إسلام يوسف أحمد', role: 'ويتر كافيه رئيسي' },
    { id: 'EMP-118', name: 'وليد صبري', role: 'ويتر مطعم إفطار' },
    { id: 'EMP-119', name: 'المهندس تامر فؤاد', role: 'مشرف صيانة الفندق' },
    { id: 'EMP-120', name: 'صبحي عبد العال', role: 'مسؤول أمن وحراسة' }
  ];

  // دالة إنشاء شيت حضور وانصراف عرضي (Landscape) بـ 20 صفاً
  function buildAttendanceSheet(sheetName, sheetTitle) {
    const sheet = workbook.addWorksheet(sheetName, {
      views: [{ rightToLeft: true }],
      pageSetup: {
        paperSize: 9, // A4
        orientation: 'landscape', // 👈 طباعة عرضية!
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 1
      }
    });

    // عنوان شيت الحضور الرئيسي (دمج الأعمدة من A إلى AK أي 41 عمود)
    sheet.mergeCells('A1:AK1');
    const tCell = sheet.getCell('A1');
    tCell.value = `🏨 فندق هينو الأهرامات — ${sheetTitle}`;
    tCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    tCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    tCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // شريط بيانات الشهر والوردية والاعتماد
    sheet.mergeCells('A2:D2');
    sheet.mergeCells('E2:Q2');
    sheet.mergeCells('R2:AD2');
    sheet.mergeCells('AE2:AK2');

    const c1 = sheet.getCell('A2'); c1.value = 'الشهر: ................. 2026م';
    const c2 = sheet.getCell('E2'); c2.value = 'القسم: ...........................................';
    const c3 = sheet.getCell('R2'); c3.value = 'الرموز: (ح: حضور | غ: غياب | ج: إجازة | خ: تأخير)';
    const c4 = sheet.getCell('AE2'); c4.value = 'اعتماد المدير: ..............................';

    [c1, c2, c3, c4].forEach(cell => {
      cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF1F4E78' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F4F8' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });

    sheet.getRow(2).height = 24;
    sheet.addRow([]); // صف فارغ

    // عناوين الأعمدة (م، كود، اسم الموظف، القسم، 31 يوم، حضور، غياب، إجازة، تأخير)
    const headers = ['م', 'كود', 'اسم الموظف', 'القسم / الوظيفة'];
    for (let day = 1; day <= 31; day++) {
      headers.push(`${day}`);
    }
    headers.push('حضور', 'غياب', 'إجازة', 'تأخير', 'ملاحظات / التوقيع');

    const hRow = sheet.addRow(headers);
    hRow.height = 26;
    hRow.eachCell(cell => {
      cell.font = { name: 'Arial', size: 8.5, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'CCCCCC' } },
        bottom: { style: 'medium', color: { argb: '1F4E78' } },
        left: { style: 'thin', color: { argb: 'CCCCCC' } },
        right: { style: 'thin', color: { argb: 'CCCCCC' } }
      };
    });

    // إضافة 20 صفاً للموظفين بالتمام والكمال
    const startRowIndex = 5;
    for (let i = 0; i < 20; i++) {
      const emp = sampleEmployees[i] || { id: '', name: '', role: '' };
      const r = startRowIndex + i;

      const rowValues = [i + 1, emp.id, emp.name, emp.role];

      // إضافة 31 يوم حضور افتراضي (رمز "ح" للحضور)
      for (let day = 1; day <= 31; day++) {
        // توزيع رموز الحضور والغياب والإجازات كنموذج جاهز
        let code = 'ح';
        if (day % 7 === 0) code = 'ج'; // إجازة أسبوعية
        else if (i % 5 === 2 && day === 15) code = 'غ'; // غياب
        else if (i % 4 === 1 && day === 22) code = 'خ'; // تأخير
        rowValues.push(code);
      }

      // معادلات ملخص كشف الحضور تلقائياً:
      // Col E (col 5) إلى Col AI (col 35) هما الـ 31 يوم
      // Col AJ (col 36): إجمالي الحضور `=COUNTIF(E{r}:AI{r}, "ح")`
      // Col AK (col 37): إجمالي الغياب `=COUNTIF(E{r}:AI{r}, "غ")`
      // Col AL (col 38): إجمالي الإجازة `=COUNTIF(E{r}:AI{r}, "ج")`
      // Col AM (col 39): إجمالي التأخير `=COUNTIF(E{r}:AI{r}, "خ")`
      rowValues.push({ formula: `COUNTIF(E${r}:AI${r}, "ح")` });
      rowValues.push({ formula: `COUNTIF(E${r}:AI${r}, "غ")` });
      rowValues.push({ formula: `COUNTIF(E${r}:AI${r}, "ج")` });
      rowValues.push({ formula: `COUNTIF(E${r}:AI${r}, "خ")` });
      rowValues.push(''); // ملاحظات وتوقيع

      const row = sheet.addRow(rowValues);
      row.height = 20;
      const isEven = i % 2 === 0;
      const bg = isEven ? 'F9FAFB' : 'FFFFFF';

      row.eachCell((cell, colNum) => {
        cell.font = { name: 'Arial', size: 8.5 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
        cell.alignment = { horizontal: colNum <= 4 ? 'right' : 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'E5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
          left: { style: 'thin', color: { argb: 'E5E7EB' } },
          right: { style: 'thin', color: { argb: 'E5E7EB' } }
        };

        // تمييز الرموز بألوان خفيفة
        if (colNum >= 5 && colNum <= 35) {
          if (cell.value === 'ح') cell.font = { name: 'Arial', size: 8.5, bold: true, color: { argb: 'FF276749' } };
          if (cell.value === 'غ') {
            cell.font = { name: 'Arial', size: 8.5, bold: true, color: { argb: 'FFC53030' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5' } };
          }
          if (cell.value === 'ج') cell.font = { name: 'Arial', size: 8.5, bold: true, color: { argb: 'FFD97706' } };
          if (cell.value === 'خ') cell.font = { name: 'Arial', size: 8.5, bold: true, color: { argb: 'FFDD6B20' } };
        }

        // تمييز خانات الإحصاءات والأرقام
        if (colNum >= 36 && colNum <= 39) {
          cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF1F4E78' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EDF2F7' } };
        }
      });
    }

    // صف إجمالي كشف الحضور للانصراف
    const totalRowIndex = startRowIndex + 20;
    const totalsValues = ['-', '-', 'الإجمالي الكلي', '-'];
    for (let day = 1; day <= 31; day++) {
      const colLetter = sheet.getColumn(4 + day).letter;
      totalsValues.push({ formula: `COUNTIF(${colLetter}5:${colLetter}${totalRowIndex - 1}, "ح")` });
    }
    totalsValues.push(
      { formula: `SUM(AJ5:AJ${totalRowIndex - 1})` },
      { formula: `SUM(AK5:AK${totalRowIndex - 1})` },
      { formula: `SUM(AL5:AL${totalRowIndex - 1})` },
      { formula: `SUM(AM5:AM${totalRowIndex - 1})` },
      '-'
    );

    const tRow = sheet.addRow(totalsValues);
    tRow.height = 24;
    tRow.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF1F4E78' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9E1F2' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'double', color: { argb: '1F4E78' } },
        bottom: { style: 'double', color: { argb: '1F4E78' } },
        left: { style: 'thin', color: { argb: 'B4C6E7' } },
        right: { style: 'thin', color: { argb: 'B4C6E7' } }
      };
    });

    // ضبط عرض الأعمدة بدقة للطباعة العرضية (Landscape A4)
    sheet.getColumn(1).width = 4.5; // م
    sheet.getColumn(2).width = 10;  // كود
    sheet.getColumn(3).width = 20;  // اسم الموظف
    sheet.getColumn(4).width = 20;  // الوظيفة
    for (let c = 5; c <= 35; c++) sheet.getColumn(c).width = 4.2; // الـ 31 يوم
    sheet.getColumn(36).width = 7.5; // حضور
    sheet.getColumn(37).width = 7.5; // غياب
    sheet.getColumn(38).width = 7.5; // إجازة
    sheet.getColumn(39).width = 7.5; // تأخير
    sheet.getColumn(40).width = 16;  // ملاحظات
  }

  // 1. إنشاء الشيت الأول بـ 20 موظف (المجموعة الأولى)
  buildAttendanceSheet('كشف الحضور (المجموعة 1)', 'كشف الحضور والانصراف والدوام الشهري (20 موظف)');

  // 2. إنشاء الشيت الثاني بـ 10 موظفين إضافيين (المجموعة الثانية)
  buildAttendanceSheet('كشف الحضور (المجموعة 2)', 'كشف الحضور والانصراف والدوام الشهري (المجموعة 2)');

  // حفظ ملف الإكسيل المستقل لكشف الحضور
  const attendanceFilePath = path.join(__dirname, 'كشف_حضور_وانصراف_الموظفين_قابل_للطباعة.xlsx');
  await workbook.xlsx.writeFile(attendanceFilePath);
  console.log(`Printable Landscape Attendance Excel created at: ${attendanceFilePath}`);

  return attendanceFilePath;
}

createAttendanceWorkbook().catch(err => console.error(err));
