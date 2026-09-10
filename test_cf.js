const ExcelJS = require('exceljs');
const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet('Test');

// Test data
ws.getCell('A8').value = '101';
ws.getCell('E8').value = 'ساكن';

ws.addConditionalFormatting({
  ref: 'A8:J60',
  rules: [
    {
      type: 'expression',
      formulae: ['=$E8="ساكن"'],
      style: {
        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDBEAFE' } },
        font: { color: { argb: 'FF1E40AF' }, bold: true }
      }
    },
    {
      type: 'expression',
      formulae: ['=$E8="محجوزة"'],
      style: {
        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFEE2E2' } },
        font: { color: { argb: 'FF991B1B' }, bold: true }
      }
    },
    {
      type: 'expression',
      formulae: ['=$E8="متاحة"'],
      style: {
        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDCFCE7' } },
        font: { color: { argb: 'FF166534' } }
      }
    },
    {
      type: 'expression',
      formulae: ['=$E8="تحت التنظيف"'],
      style: {
        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFEF3C7' } },
        font: { color: { argb: 'FF92400E' } }
      }
    },
    {
      type: 'expression',
      formulae: ['=$E8="صيانة"'],
      style: {
        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFF1F5F9' } },
        font: { color: { argb: 'FF475569' } }
      }
    }
  ]
});

wb.xlsx.writeFile('d:/Henu/test_cf.xlsx').then(() => {
  console.log('CF file written and verified successfully');
});
