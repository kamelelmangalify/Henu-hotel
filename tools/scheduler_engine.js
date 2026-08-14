const fs = require('fs');
const path = require('path');

const SCHEDULES_FILE = path.join(__dirname, 'schedules.json');

/**
 * تحميل المواعيد من الملف
 */
function loadSchedules() {
  if (!fs.existsSync(SCHEDULES_FILE)) {
    fs.writeFileSync(SCHEDULES_FILE, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
  try {
    const data = fs.readFileSync(SCHEDULES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading schedules:', err.message);
    return [];
  }
}

/**
 * حفظ المواعيد في الملف
 */
function saveSchedules(schedules) {
  fs.writeFileSync(SCHEDULES_FILE, JSON.stringify(schedules, null, 2), 'utf8');
}

/**
 * تحويل نص التاريخ والوقت لـ ISO Date مع مراعاة المناطق الزمنية
 */
function parseTargetDateTime(dateStr, timeStr) {
  let targetDate = new Date();

  const lowerDate = (dateStr || '').trim().toLowerCase();

  if (lowerDate.includes('اليوم') || lowerDate === 'today') {
    // اليوم
  } else if (lowerDate.includes('غد') || lowerDate.includes('بكرة') || lowerDate === 'tomorrow') {
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (dateStr && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    targetDate = new Date(y, m - 1, d);
  }

  // تحليل الوقت
  let hours = 12;
  let minutes = 0;

  if (timeStr) {
    const timeMatch = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(ص|م|AM|PM|مساء|صباحا|مساءً|صباحاً)?/i);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const period = timeMatch[3] ? timeMatch[3].toLowerCase() : '';

      if ((period.includes('م') || period.includes('pm') || period.includes('مساء')) && hours < 12) {
        hours += 12;
      }
      if ((period.includes('ص') || period.includes('am') || period.includes('صباح')) && hours === 12) {
        hours = 0;
      }
    }
  }

  targetDate.setHours(hours, minutes, 0, 0);
  return targetDate;
}

/**
 * إضافة موعد جديد مع حساب وقت التذكير قبلها بـ 60 دقيقة
 */
function addAppointment({ title, dateStr, timeStr, notes = '', fromNumber = '', reminderMinutesBefore = 60 }) {
  const schedules = loadSchedules();
  const appointmentTime = parseTargetDateTime(dateStr, timeStr);

  // حساب وقت التذكير (قبل الموعد بـ 60 دقيقة)
  const reminderTime = new Date(appointmentTime.getTime() - reminderMinutesBefore * 60 * 1000);

  const newAppointment = {
    id: `APT-${Date.now()}`,
    title,
    raw_date: dateStr,
    raw_time: timeStr,
    appointment_time: appointmentTime.toISOString(),
    reminder_time: reminderTime.toISOString(),
    reminder_minutes_before: reminderMinutesBefore,
    notes,
    from_number: fromNumber,
    created_at: new Date().toISOString(),
    status: 'PENDING', // PENDING | REMINDED | COMPLETED | CANCELLED
    reminded_at: null
  };

  schedules.push(newAppointment);
  saveSchedules(schedules);
  return newAppointment;
}

/**
 * فحص المواعيد المستحقة للتذكير (التي حان وقت التذكير بها ولم تُرسل بعد)
 */
function checkPendingReminders() {
  const schedules = loadSchedules();
  const now = new Date();
  const dueReminders = [];

  schedules.forEach(apt => {
    if (apt.status === 'PENDING') {
      const remTime = new Date(apt.reminder_time);
      if (now >= remTime) {
        apt.status = 'REMINDED';
        apt.reminded_at = now.toISOString();
        dueReminders.push(apt);
      }
    }
  });

  if (dueReminders.length > 0) {
    saveSchedules(schedules);
  }

  return dueReminders;
}

/**
 * تنسيق رسالة الواتساب الخاصة بالتذكير
 */
function formatReminderWhatsAppMessage(apt) {
  const aptTime = new Date(apt.appointment_time);
  const timeStr = aptTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = aptTime.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return [
    `🔔 *تذكير هام بموعد قادم (بعد ساعة)*`,
    ``,
    `📌 *العنوان:* ${apt.title}`,
    `📅 *التاريخ:* ${dateStr}`,
    `⏰ *الوقت:* ${timeStr}`,
    apt.notes ? `📝 *ملاحظات:* ${apt.notes}` : '',
    ``,
    `_تم إرسال التذكير تلقائياً بواسطة مساعدك الشخصي الذكي 🤖_`
  ].filter(Boolean).join('\n');
}

/**
 * تنسيق تأكيد إدخال الموعد
 */
function formatConfirmationWhatsAppMessage(apt) {
  const aptTime = new Date(apt.appointment_time);
  const remTime = new Date(apt.reminder_time);
  const timeStr = aptTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = aptTime.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
  const remTimeStr = remTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

  return [
    `📅 *تم جدولة الموعد بنجاح*`,
    ``,
    `📌 *الموعد:* ${apt.title}`,
    `📆 *اليوم والتاريخ:* ${dateStr}`,
    `⏰ *توقيت الموعد:* ${timeStr}`,
    `🔔 *التذكير:* سيتم تذكيرك على الواتساب الساعة ${remTimeStr} (قبل الموعد بـ 60 دقيقة)`,
    apt.notes ? `📝 *ملاحظات:* ${apt.notes}` : '',
  ].filter(Boolean).join('\n');
}

module.exports = {
  loadSchedules,
  addAppointment,
  checkPendingReminders,
  formatReminderWhatsAppMessage,
  formatConfirmationWhatsAppMessage
};
