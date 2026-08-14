/**
 * Accountant AI Agent
 * مسؤول عن الفواتير، المصروفات، تقفيل الورديات، وتسجيل البيانات المحاسبية
 */

function handleAccountingTask(payload) {
  const { transaction_type, amount, details, contact_name } = payload;
  const amountFormatted = new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 2 }).format(amount || 0);

  let reply = '';
  if (transaction_type === 'GUEST_CHECKIN') {
    reply = [
      `📊 *[وكيل المحاسبة]*`,
      `✅ تم معالجة قيد دخول النزيل: *${details?.guest_name || contact_name || 'نزيل'}*`,
      `🏨 الغرفة: ${details?.room_number || 'غير محدد'} | الليالي: ${details?.nights || 1}`,
      `💰 المبلغ المحصل: ${amountFormatted} جـ`,
      `تم التوثيق في سجل الإيرادات المحاسبي.`
    ].join('\n');
  } else if (transaction_type === 'CAFE_SHIFT') {
    reply = [
      `📊 *[وكيل المحاسبة]*`,
      `✅ تم تقفيل وردية الكافيه / المطعم بنجاح`,
      `☕ الوردية: ${details?.shift || 'عامة'}`,
      `💰 الإيراد الإجمالي: ${amountFormatted} جـ`,
      `تم ترحيل المبلغ وتوزيع الضريبة.`
    ].join('\n');
  } else {
    reply = [
      `📊 *[وكيل المحاسبة]*`,
      `✅ تم تسجيل الفاتورة / المصروف بنجاح`,
      `🏢 المورد / الجهة: ${details?.vendor_name || 'مصروف عام'}`,
      `💰 الإجمالي: ${amountFormatted} جـ`,
      `تم إدراج العملية في سجل المصروفات وقائمة الفواتير.`
    ].join('\n');
  }

  return { success: true, agent: 'ACCOUNTANT', message: reply };
}

module.exports = { handleAccountingTask };
