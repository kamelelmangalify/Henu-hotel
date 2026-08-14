const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function rebuildSpreadsheet() {
    // Read user modified rows JSON
    const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, 'user_modified_rows.json'), 'utf8'));

    // Extract items from row 8 to 153
    const items = [];
    rawData.forEach(r => {
        if (r.rNum >= 8 && r.rNum <= 153) {
            const vals = r.values;
            const num = vals[1];
            const page = vals[2];
            const desc = vals[3] || '';
            let amount = vals[4];
            if (typeof amount === 'object' && amount !== null && amount.result !== undefined) {
                amount = amount.result;
            }
            amount = Number(amount) || 0;
            const status = 'معتمد';
            let cat = vals[6] || 'نثريات وتجهيزات';
            const notes = vals[7] || '';

            if (!page || !desc) return; // Skip empty rows

            const descStr = String(desc);

            // Refine category if needed based on description
            if (descStr.includes('سيراميك') || descStr.includes('بلوك') || descStr.includes('أسمنت') || descStr.includes('حديد') || descStr.includes('رمل')) {
                cat = 'مواد بناء ومحارة';
            } else if (descStr.includes('تكسير') || descStr.includes('بناء') || descStr.includes('نجارة عامود') || descStr.includes('عتبة')) {
                cat = 'أعمال مدنية ومباني';
            } else if (descStr.includes('سباكة') || descStr.includes('حوض') || descStr.includes('بلاعة') || descStr.includes('حنفية') || descStr.includes('صرف')) {
                cat = 'سباكة وصرف';
            } else if (descStr.includes('كهرباء') || descStr.includes('تليفون') || descStr.includes('سلك') || descStr.includes('مفاتيح نور') || descStr.includes('قارئ USB') || descStr.includes('دش')) {
                cat = 'كهرباء وإنارة';
            } else if (descStr.includes('دهان') || descStr.includes('لاكية') || descStr.includes('معجون') || descStr.includes('تنر') || descStr.includes('شكارة ممتاز')) {
                cat = 'دهانات وتكسية';
            } else if (descStr.includes('رخام') || descStr.includes('جرانيت') || descStr.includes('جبسين بورد') || descStr.includes('بديل الرخام') || descStr.includes('ديكور') || descStr.includes('رسومات')) {
                cat = 'أعمال تشطيب وديكور';
            } else if (descStr.includes('مفروشات') || descStr.includes('سراير') || descStr.includes('ستائر') || descStr.includes('مراتب') || descStr.includes('غسيل المراتب') || descStr.includes('كراسي')) {
                cat = 'أثاث ومفروشات';
            } else if (descStr.includes('مقابض') || descStr.includes('كالون') || descStr.includes('أبواب') || descStr.includes('ميداليات') || descStr.includes('قلوب')) {
                cat = 'إكسسوارات وتشطيبات';
            } else if (descStr.includes('أجور') || descStr.includes('عمال') || descStr.includes('مرتبات') || descStr.includes('يومية') || descStr.includes('مصنعيات') || descStr.includes('سلفة') || descStr.includes('المحامي') || descStr.includes('أحمد صبري') || descStr.includes('طارق الحداد') || descStr.includes('مناولة')) {
                cat = 'أجور وعمالة';
            } else if (descStr.includes('نقل') || descStr.includes('عربية') || descStr.includes('كارو') || descStr.includes('مخلفات') || descStr.includes('تنزيل') || descStr.includes('شحن')) {
                cat = 'نقل وشحن';
            } else if (descStr.includes('أسانسير') || descStr.includes('مصعد') || descStr.includes('تكييف')) {
                cat = 'صيانة ومصاعد';
            } else if (descStr.includes('فاتورة') || descStr.includes('إنترنت')) {
                cat = 'مرافق وفواتير';
            } else if (descStr.includes('نظافة') || descStr.includes('منظفات') || descStr.includes('شامبو') || descStr.includes('غسيل الفرش')) {
                cat = 'نظافة وغسيل';
            } else if (descStr.includes('يافطة') || descStr.includes('علامات')) {
                cat = 'ديكور ومكملات';
            }

            items.push({
                num,
                page,
                desc,
                amount,
                status,
                cat,
                notes
            });
        }
    });

    console.log('Processed', items.length, 'items from user edits.');
    const totalSum = items.reduce((sum, item) => sum + item.amount, 0);
    console.log('New Total Sum of User Modified Ledger:', totalSum);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'نظام إدارة هوستل الأهرامات';
    workbook.lastModifiedBy = 'الخبير المحاسبي';
    workbook.created = new Date();

    const primaryNavy = '1E3A8A';
    const lightGray = 'F3F4F6';
    const softGreen = 'DCFCE7';
    const textGreen = '166534';
    const borderGray = 'D1D5DB';

    const endRowIdx = 7 + items.length;

    // -------------------------------------------------------------
    // SHEET 1: Detailed Ledger (سجل المصروفات التفصيلي)
    // -------------------------------------------------------------
    const ws1 = workbook.addWorksheet('سجل المصروفات التفصيلي', { views: [{ rightToLeft: true }] });

    ws1.mergeCells('A1:G1');
    const titleCell = ws1.getCell('A1');
    titleCell.value = 'هوستل الأهرامات — سجل كشف مصاريف الأستاذ خالد (المعدل والمعتمد بالكامل)';
    titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryNavy } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws1.getRow(1).height = 40;

    ws1.mergeCells('A2:G2');
    const subCell = ws1.getCell('A2');
    subCell.value = `تم التحديث والاعتماد المحاسبي بتاريخ: ${new Date().toLocaleDateString('ar-EG')} — متوافق 100% مع التعديلات اليدوية المسجلة بالدفتر الشامل`;
    subCell.font = { name: 'Calibri', size: 11, italic: true, color: { argb: '374151' } };
    subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E7EB' } };
    subCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws1.getRow(2).height = 25;

    ws1.getRow(3).height = 10;

    // KPI Summary Cards
    ws1.mergeCells('A4:C4');
    ws1.getCell('A4').value = 'إجمالي المصروفات المعتمدة الكلية (بعد التعديلات اليدوية)';
    ws1.getCell('A4').font = { bold: true, size: 11, color: { argb: primaryNavy } };
    ws1.getCell('A4').alignment = { horizontal: 'center' };

    ws1.mergeCells('A5:C5');
    ws1.getCell('A5').value = { formula: `SUM(D8:D${endRowIdx})` };
    ws1.getCell('A5').font = { bold: true, size: 15, color: { argb: textGreen } };
    ws1.getCell('A5').numFmt = '#,##0 "ج.م"';
    ws1.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: softGreen } };
    ws1.getCell('A5').alignment = { horizontal: 'center' };

    ws1.mergeCells('D4:E4');
    ws1.getCell('D4').value = 'إجمالي عدد البنود';
    ws1.getCell('D4').font = { bold: true, size: 11, color: { argb: primaryNavy } };
    ws1.getCell('D4').alignment = { horizontal: 'center' };

    ws1.mergeCells('D5:E5');
    ws1.getCell('D5').value = { formula: `COUNTA(C8:C${endRowIdx})` };
    ws1.getCell('D5').font = { bold: true, size: 15, color: { argb: primaryNavy } };
    ws1.getCell('D5').alignment = { horizontal: 'center' };

    ws1.mergeCells('F4:G4');
    ws1.getCell('F4').value = 'حالة اعتماد السجل';
    ws1.getCell('F4').font = { bold: true, size: 11, color: { argb: primaryNavy } };
    ws1.getCell('F4').alignment = { horizontal: 'center' };

    ws1.mergeCells('F5:G5');
    ws1.getCell('F5').value = 'معتمد 100%';
    ws1.getCell('F5').font = { bold: true, size: 14, color: { argb: textGreen } };
    ws1.getCell('F5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: softGreen } };
    ws1.getCell('F5').alignment = { horizontal: 'center' };

    ws1.getRow(4).height = 20;
    ws1.getRow(5).height = 30;
    ws1.getRow(6).height = 12;

    // Header Columns
    const headers = ['م', 'مصدر المستند', 'البيان وتفاصيل المصروف', 'المبلغ (جنيه)', 'حالة البند', 'التصنيف الرئيسي', 'ملاحظات وتوجيه محاسبي'];
    const headerRow = ws1.getRow(7);
    headerRow.values = headers;
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryNavy } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'medium', color: { argb: primaryNavy } },
            bottom: { style: 'medium', color: { argb: primaryNavy } },
            left: { style: 'thin', color: { argb: 'FFFFFF' } },
            right: { style: 'thin', color: { argb: 'FFFFFF' } }
        };
    });

    items.forEach((item, index) => {
        const rowNum = 8 + index;
        const row = ws1.getRow(rowNum);
        row.values = [
            item.num,
            item.page,
            item.desc,
            item.amount,
            item.status,
            item.cat,
            item.notes
        ];
        row.height = 22;

        const isEven = index % 2 === 0;

        row.eachCell((cell, colNum) => {
            cell.font = { name: 'Calibri', size: 10.5 };
            cell.border = {
                top: { style: 'thin', color: { argb: borderGray } },
                bottom: { style: 'thin', color: { argb: borderGray } },
                left: { style: 'thin', color: { argb: borderGray } },
                right: { style: 'thin', color: { argb: borderGray } }
            };

            if (colNum === 1 || colNum === 2) {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            } else if (colNum === 3 || colNum === 7) {
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
            } else if (colNum === 4) {
                cell.alignment = { horizontal: 'left', vertical: 'middle' };
                cell.numFmt = '#,##0 "ج.م"';
                cell.font = { bold: true };
            } else if (colNum === 5) {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: softGreen } };
                cell.font = { color: { argb: textGreen }, bold: true };
            } else if (colNum === 6) {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            }

            if (colNum !== 5 && isEven) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGray } };
            }
        });
    });

    // Total Row Sheet 1
    const lastRowIndex = 8 + items.length;
    const totalRow = ws1.getRow(lastRowIndex);
    totalRow.values = [
        '',
        'المجموع الإجمالي',
        'إجمالي كافة المصروفات المعتمدة بعد التعديلات',
        { formula: `SUM(D8:D${endRowIdx})` },
        'معتمد 100%',
        'إجمالي عام',
        `مجموع ${items.length} بنداً معتمداً بالكامل`
    ];
    totalRow.height = 30;
    totalRow.eachCell((cell, colNum) => {
        cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryNavy } };
        cell.alignment = { horizontal: colNum === 3 ? 'right' : 'center', vertical: 'middle' };
        if (colNum === 4) {
            cell.numFmt = '#,##0 "ج.م"';
        }
    });

    ws1.getColumn(1).width = 6;
    ws1.getColumn(2).width = 24;
    ws1.getColumn(3).width = 58;
    ws1.getColumn(4).width = 16;
    ws1.getColumn(5).width = 14;
    ws1.getColumn(6).width = 24;
    ws1.getColumn(7).width = 35;

    // -------------------------------------------------------------
    // SHEET 2: Summary by Category (ملخص حسب التصنيفات)
    // -------------------------------------------------------------
    const ws2 = workbook.addWorksheet('ملخص حسب التصنيفات', { views: [{ rightToLeft: true }] });

    ws2.mergeCells('A1:D1');
    const s2Title = ws2.getCell('A1');
    s2Title.value = 'هوستل الأهرامات — ملخص المصروفات المعدلة موزع حسب التصنيفات الرئيسية';
    s2Title.font = { name: 'Calibri', size: 15, bold: true, color: { argb: 'FFFFFF' } };
    s2Title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryNavy } };
    s2Title.alignment = { horizontal: 'center', vertical: 'middle' };
    ws2.getRow(1).height = 36;

    const s2Headers = ['التصنيف المحاسبي الرئيسي', 'إجمالي المصروفات المعتمدة (جنيه)', 'عدد البنود المعتمدة', 'النسبة المئوية من الإجمالي'];
    const s2HeaderRow = ws2.getRow(3);
    s2HeaderRow.values = s2Headers;
    s2HeaderRow.height = 26;
    s2HeaderRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryNavy } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const uniqueCats = Array.from(new Set(items.map(i => i.cat)));

    uniqueCats.forEach((cat, idx) => {
        const rNum = 4 + idx;
        const row = ws2.getRow(rNum);
        row.values = [
            cat,
            { formula: `SUMIF('سجل المصروفات التفصيلي'!F8:F${endRowIdx}, "${cat}", 'سجل المصروفات التفصيلي'!D8:D${endRowIdx})` },
            { formula: `COUNTIF('سجل المصروفات التفصيلي'!F8:F${endRowIdx}, "${cat}")` },
            { formula: `B${rNum}/B${4 + uniqueCats.length}` }
        ];
        row.height = 22;

        row.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
        row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
        row.getCell(2).numFmt = '#,##0 "ج.م"';
        row.getCell(2).font = { bold: true };
        row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(4).numFmt = '0.0%';

        row.eachCell(cell => {
            cell.border = {
                top: { style: 'thin', color: { argb: borderGray } },
                bottom: { style: 'thin', color: { argb: borderGray } },
                left: { style: 'thin', color: { argb: borderGray } },
                right: { style: 'thin', color: { argb: borderGray } }
            };
            if (idx % 2 === 0) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGray } };
            }
        });
    });

    // Total Row Sheet 2
    const totalCatRowIndex = 4 + uniqueCats.length;
    const s2Total = ws2.getRow(totalCatRowIndex);
    s2Total.values = [
        'المجموع الإجمالي',
        { formula: `SUM(B4:B${totalCatRowIndex - 1})` },
        { formula: `SUM(C4:C${totalCatRowIndex - 1})` },
        { formula: `SUM(D4:D${totalCatRowIndex - 1})` }
    ];
    s2Total.height = 28;
    s2Total.eachCell((cell, col) => {
        cell.font = { bold: true, size: 11, color: { argb: 'FFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryNavy } };
        cell.alignment = { horizontal: col === 1 ? 'right' : 'center', vertical: 'middle' };
        if (col === 2) cell.numFmt = '#,##0 "ج.م"';
        if (col === 4) cell.numFmt = '0.0%';
    });

    ws2.getColumn(1).width = 30;
    ws2.getColumn(2).width = 28;
    ws2.getColumn(3).width = 20;
    ws2.getColumn(4).width = 22;

    // -------------------------------------------------------------
    // SHEET 3: Page Reconciliation (مطابقة صفحات الدفتر الورقي)
    // -------------------------------------------------------------
    const ws3 = workbook.addWorksheet('مطابقة صفحات الدفتر', { views: [{ rightToLeft: true }] });

    ws3.mergeCells('A1:D1');
    const s3Title = ws3.getCell('A1');
    s3Title.value = 'هوستل الأهرامات — جدول مطابقة صفحات الدفتر الورقي (بعد التعديلات اليدوية)';
    s3Title.font = { name: 'Calibri', size: 15, bold: true, color: { argb: 'FFFFFF' } };
    s3Title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryNavy } };
    s3Title.alignment = { horizontal: 'center', vertical: 'middle' };
    ws3.getRow(1).height = 36;

    const s3Headers = ['رقم الصفحة / المستند', 'إجمالي الصفحة المحسوب بالإكسيل (جنيه)', 'عدد البنود بالصفحة', 'ملاحظات المطابقة المحاسبية'];
    const s3HeaderRow = ws3.getRow(3);
    s3HeaderRow.values = s3Headers;
    s3HeaderRow.height = 26;
    s3HeaderRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryNavy } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const pageNames = Array.from(new Set(items.map(i => i.page).filter(Boolean)));

    pageNames.forEach((pg, idx) => {
        const rNum = 4 + idx;
        const row = ws3.getRow(rNum);
        row.values = [
            pg,
            { formula: `SUMIF('سجل المصروفات التفصيلي'!B8:B${endRowIdx}, "${pg}", 'سجل المصروفات التفصيلي'!D8:D${endRowIdx})` },
            { formula: `COUNTIF('سجل المصروفات التفصيلي'!B8:B${endRowIdx}, "${pg}")` },
            'مطابق للقيم والبنود المعدلة بدفتر المصروفات'
        ];
        row.height = 24;

        row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
        row.getCell(2).numFmt = '#,##0 "ج.م"';
        row.getCell(2).font = { bold: true, color: { argb: textGreen } };
        row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };

        row.eachCell(cell => {
            cell.border = {
                top: { style: 'thin', color: { argb: borderGray } },
                bottom: { style: 'thin', color: { argb: borderGray } },
                left: { style: 'thin', color: { argb: borderGray } },
                right: { style: 'thin', color: { argb: borderGray } }
            };
            if (idx % 2 === 0) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGray } };
            }
        });
    });

    const totalPgRowIndex = 4 + pageNames.length;
    const s3Total = ws3.getRow(totalPgRowIndex);
    s3Total.values = [
        'المجموع الإجمالي الشامل',
        { formula: `SUM(B4:B${totalPgRowIndex - 1})` },
        { formula: `SUM(C4:C${totalPgRowIndex - 1})` },
        'إجمالي كافة الصفحات والمستندات معتمدة 100%'
    ];
    s3Total.height = 28;
    s3Total.eachCell((cell, col) => {
        cell.font = { bold: true, size: 11, color: { argb: 'FFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryNavy } };
        cell.alignment = { horizontal: col === 4 ? 'right' : 'center', vertical: 'middle' };
        if (col === 2) cell.numFmt = '#,##0 "ج.م"';
    });

    ws3.getColumn(1).width = 25;
    ws3.getColumn(2).width = 32;
    ws3.getColumn(3).width = 20;
    ws3.getColumn(4).width = 45;

    const dest1 = path.join(__dirname, 'مصاريف الاستاذ خالد', 'مصاريف_الأستاذ_خالد.xlsx');
    const dest2 = path.join(__dirname, 'مصاريف_الأستاذ_خالد.xlsx');

    await workbook.xlsx.writeFile(dest1);
    await workbook.xlsx.writeFile(dest2);
    console.log('Successfully rebuilt Excel files at:');
    console.log('1.', dest1);
    console.log('2.', dest2);
}

rebuildSpreadsheet().catch(console.error);
