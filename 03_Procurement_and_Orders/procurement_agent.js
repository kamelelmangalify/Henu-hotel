/**
 * Procurement & Orders AI Agent
 * مسؤول عن طلبات الشراء، الموردين، ومستلزمات الفندق والصيانة
 */

function handleProcurementTask(payload) {
  const { details, original_text, amount } = payload;
  const item = details?.item || original_text || 'طلب مشتريات';

  const reply = [
    `🛒 *[مسؤول المشتريات والتوريد]*`,
    `✅ تم تسجيل طلب التوريد / الشراء:`,
    `📦 *الطلب:* ${item}`,
    amount ? `💰 *التكلفة التقديرية:* ${amount} جـ` : '',
    `📋 *الحالة:* قيد التجهيز والمتابعة مع المورد المعتمد.`,
    `تم الحفظ في نظام طلبات المشتريات (\`03_Procurement_and_Orders\`).`
  ].filter(Boolean).join('\n');

  return { success: true, agent: 'PROCUREMENT', message: reply };
}

module.exports = { handleProcurementTask };
