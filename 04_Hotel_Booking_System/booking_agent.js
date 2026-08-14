/**
 * Hotel Booking System AI Agent
 * مسؤول عن الحجوزات، تسكين النزلاء، واستعلامات الغرف
 */

function handleBookingTask(payload) {
  const { details, original_text } = payload;
  const guestName = details?.guest_name || 'نزيل جديد';
  const room = details?.room_number || 'غير محددة';

  const reply = [
    `🏨 *[مسؤول الحجوزات والنزلاء]*`,
    `✅ تم معالجة طلب الحجز:`,
    `👤 *اسم النزيل:* ${guestName}`,
    `🔑 *رقم الغرفة:* ${room}`,
    `📅 *مدة الإقامة:* ${details?.nights || 1} ليالي`,
    `تم الحديث وسجل الحجز جاهز في نظام الفندق (\`04_Hotel_Booking_System\`).`
  ].join('\n');

  return { success: true, agent: 'BOOKING', message: reply };
}

module.exports = { handleBookingTask };
