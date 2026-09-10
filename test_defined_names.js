const ExcelJS = require('exceljs');
const wb = new ExcelJS.Workbook();
wb.calcProperties.fullCalcOnLoad = true;

const wsConfig = wb.addWorksheet('إعدادات_النظام');
// List of statuses in column A
const statuses = ['متاحة', 'ساكن', 'محجوزة', 'تحت التنظيف', 'صيانة'];
statuses.forEach((s, idx) => {
  wsConfig.getCell(`A${idx + 1}`).value = s;
});

// List of payment methods in column B
const paymentMethods = [
  'مؤكد - نقدي',
  'مؤكد - فيزا',
  'مؤكد - فودافون كاش',
  'مؤكد - بوكينج',
  'دفعة مقدمة',
  'معلق',
  'ملغي'
];
paymentMethods.forEach((p, idx) => {
  wsConfig.getCell(`B${idx + 1}`).value = p;
});

// Sheet 1: Rooms
const ws1 = wb.addWorksheet('حالة_الغرف');
ws1.getCell('A8').value = '101';
ws1.getCell('A9').value = '102';

// Add defined names
wb.definedNames.add('إعدادات_النظام!$A$1:$A$5', 'قائمة_الحالات');
wb.definedNames.add('إعدادات_النظام!$B$1:$B$7', 'طرق_الدفع');
wb.definedNames.add('حالة_الغرف!$A$8:$A$60', 'قائمة_الغرف');

// In ws1, status cell validation uses قائمة_الحالات
ws1.getCell('E8').dataValidation = {
  type: 'list',
  allowBlank: true,
  formulae: ['قائمة_الحالات']
};

// In ws2, booking sheet uses قائمة_الغرف
const ws2 = wb.addWorksheet('سجل_الحجوزات');
ws2.getCell('B4').dataValidation = {
  type: 'list',
  allowBlank: true,
  formulae: ['قائمة_الغرف']
};
ws2.getCell('N4').dataValidation = {
  type: 'list',
  allowBlank: true,
  formulae: ['طرق_الدفع']
};

wb.xlsx.writeFile('d:/Henu/test_defined_names.xlsx').then(() => {
  console.log('Defined names test passed successfully!');
});
