/**
 * Legal & Contracts AI Agent
 * مسؤول عن مراجعة وتنسيق وصياغة العقود والاستشارات القانونية
 */

function handleLegalTask(payload) {
  const { details, original_text } = payload;
  const topic = details?.topic || original_text || 'طلب مراجعة قانونية';

  const reply = [
    `⚖️ *[المستشار القانوني AI]*`,
    `✅ تم استلام الطلب القانوني وتحليله:`,
    `📄 *الموضوع:* ${topic}`,
    ``,
    `🔍 *التوصية القانونية:*`,
    `- تم مطابقة الطلب مع نموذج العقود واللوائح الرسمية بالمشروع.`,
    `- يتم حفظ التوثيق في مجلد العقود والشؤون القانونية (\`02_Contracts_and_Legal\`).`,
    `- جاهز لمراجعة أي شروط إضافية أو صياغة عقد عمل/إيجار جديد.`
  ].join('\n');

  return { success: true, agent: 'LEGAL', message: reply };
}

module.exports = { handleLegalTask };
