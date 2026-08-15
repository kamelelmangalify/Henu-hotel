const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function createWeeklyAttendanceWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Antigravity Accounting & HR System';
  workbook.created = new Date();

  // قائمة الـ 20 موظفاً الأولى المجهزة لكشف الحضور الأسبوعي
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

  const daysOfWeek = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  function buildWeeklySheet(sheetName, sheetTitle) {
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

    // عنوان الشيت (حتى العمود AJ أي 36 عمود)
    sheet.mergeCells('A1:AJ1');
    const tCell = sheet.getCell('A1');
    tCell.value = `🏨 فندق هينو الأهرامات — ${sheetTitle}`;
    tCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    tCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    tCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // شريط التواريخ والبيانات
    sheet.mergeCells('A2:D2');
    sheet.mergeCells('E2:L2');
    sheet.mergeCells('M2:AB2');
    sheet.mergeCells('AC2:AJ2');

    const c1 = sheet.getCell('A2'); c1.value = 'الأسبوع رقم: [ &nbsp; ] (من ..... إلى ..... / 2026م)';
    const c2 = sheet.getCell('E2'); c2.value = 'القسم: ...........................................';
    const c3 = sheet.getCell('M2'); c3.value = 'تعليمات: يوقع الموظف بالحضور والانصراف يومياً أمام مشرف الوردية';
    const c4 = sheet.getCell('AC2'); c4.value = 'اعتماد المشرف: ..............................';

    [c1, c2, c3, c4].forEach(cell => {
      cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF1F4E78' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F4F8' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });

    sheet.getRow(2).height = 24;

    // الصف 3 و 4: عناوين الأعمدة
    sheet.mergeCells(3, 1, 4, 1); sheet.getCell(3, 1).value = 'م';
    sheet.mergeCells(3, 2, 4, 2); sheet.getCell(3, 2).value = 'كود';
    sheet.mergeCells(3, 3, 4, 3); sheet.getCell(3, 3).value = 'اسم الموظف';
    sheet.mergeCells(3, 4, 4, 4); sheet.getCell(3, 4).value = 'القسم / الوظيفة';

    let startCol = 5;
    daysOfWeek.forEach(dayName => {
      const endCol = startCol + 3;
      sheet.mergeCells(3, startCol, 3, endCol);
      const dayCell = sheet.getCell(3, startCol);
      dayCell.value = dayName;
      dayCell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFFFFF' } };
      dayCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
      dayCell.alignment = { horizontal: 'center', vertical: 'middle' };

      sheet.getCell(4, startCol).value = 'حضور';
      sheet.getCell(4, startCol + 1).value = 'توقيع';
      sheet.getCell(4, startCol + 2).value = 'انصراف';
      sheet.getCell(4, startCol + 3).value = 'توقيع';

      startCol += 4;
    });

    sheet.mergeCells(3, 33, 4, 33); sheet.getCell(3, 33).value = 'أيام الحضور';
    sheet.mergeCells(3, 34, 4, 36); sheet.getCell(3, 34).value = 'ملاحظات المشرف والتفريغ';

    [3, 4].forEach(rIdx => {
      const r = sheet.getRow(rIdx);
      r.height = 22;
      r.eachCell(cell => {
        cell.font = { name: 'Arial', size: 8.5, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'CCCCCC' } },
          bottom: { style: 'medium', color: { argb: '1F4E78' } },
          left: { style: 'thin', color: { argb: 'CCCCCC' } },
          right: { style: 'thin', color: { argb: 'CCCCCC' } }
        };
      });
    });

    // إضافة 20 صفاً للموظفين بفرمولات ومساحات توقيع
    for (let i = 0; i < 20; i++) {
      const emp = sampleEmployees[i] || { id: '', name: '', role: '' };

      const rowValues = [i + 1, emp.id, emp.name, emp.role];

      for (let day = 0; day < 7; day++) {
        rowValues.push('08:00 ص', '', '04:00 م', '');
      }

      rowValues.push(7);
      rowValues.push('');

      const row = sheet.addRow(rowValues);
      row.height = 22;
      const bg = i % 2 === 0 ? 'F9FAFB' : 'FFFFFF';

      row.eachCell((cell, colNum) => {
        cell.font = { name: 'Arial', size: 8 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
        cell.alignment = { horizontal: colNum <= 4 ? 'right' : 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'E5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
          left: { style: 'thin', color: { argb: 'E5E7EB' } },
          right: { style: 'thin', color: { argb: 'E5E7EB' } }
        };

        if (colNum === 33) {
          cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF1F4E78' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EDF2F7' } };
        }
      });
    }

    sheet.getColumn(1).width = 4;
    sheet.getColumn(2).width = 9;
    sheet.getColumn(3).width = 18;
    sheet.getColumn(4).width = 18;

    for (let c = 5; c <= 32; c++) {
      sheet.getColumn(c).width = 6.2;
    }

    sheet.getColumn(33).width = 9;
    sheet.getColumn(34).width = 18;
  }

  buildWeeklySheet('حضور أسبوعي بالتوقيعات', 'كشف الحضور والانصراف والدوام الأسبوعي بتوقيع الموظفين (20 موظف)');

  const outputPath = path.join(__dirname, 'كشف_حضور_وانصراف_أسبوعي_بالتوقيعات.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Weekly Landscape Attendance workbook with signatures created at: ${outputPath}`);

  return outputPath;
}

createWeeklyAttendanceWorkbook().catch(err => console.error(err));
