const fs = require('fs');
const path = require('path');

const rootDir = path.join('d:', 'Henu');
const archiveDir = path.join(rootDir, '_archive_and_old_versions');

if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });

function moveToArchive(sourcePath, relativeName) {
  if (fs.existsSync(sourcePath)) {
    const destPath = path.join(archiveDir, relativeName);
    const destFolder = path.dirname(destPath);
    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
    try {
      fs.renameSync(sourcePath, destPath);
      console.log(`Archived: ${relativeName}`);
    } catch (e) {
      console.log(`Could not move ${relativeName}: ${e.message}`);
    }
  }
}

// 1. أرشفة المجلدات والملفات المكررة أو القديمة بالكامل
const itemsToArchive = [
  'trail',
  'عقودالعمل',
  'مصاريف الاستاذ خالد',
  'accountant',
  '06_Archive_Excel_Data',
  '~$سجل الايرادات والمصروفات.xlsx',
  'مصاريف_الأستاذ_خالد.xlsx', // مكرر في الجذر، النسخة الرسمية داخل 01_Accounting_System
  'سجل الايرادات والمصروفات.xlsx', // مكرر في الجذر، النسخة الرسمية داخل 01_Accounting_System
  'تقرير_مصروفات_الأستاذ_خالد.pdf', // مكرر في الجذر، النسخة الرسمية داخل 01_Accounting_System
  path.join('01_Accounting_System', 'جدول_رواتب_وتقييم_30_موظف_الشهري.xlsx'),
  path.join('01_Accounting_System', 'كشف_حضور_وانصراف_الموظفين_قابل_للطباعة.xlsx'),
  path.join('01_Accounting_System', '~$جدول_رواتب_وتقييم_30_موظف_الشهري.xlsx'),
  path.join('01_Accounting_System', '~$جدول_رواتب_وتقييم_الموظفين_الشهري.xlsx'),
  path.join('01_Accounting_System', '~$كشف_حضور_وانصراف_أسبوعي_بالتوقيعات.xlsx'),
  path.join('01_Accounting_System', '~$كشف_حضور_وانصراف_الموظفين_قابل_للطباعة.xlsx'),
  path.join('التدريب والتطوير', 'مدرسة ستارز')
];

itemsToArchive.forEach(rel => {
  const full = path.join(rootDir, rel);
  moveToArchive(full, rel);
});

console.log('\n✨ CLEANUP AND ARCHIVING COMPLETED SUCCESSFULLY!');
