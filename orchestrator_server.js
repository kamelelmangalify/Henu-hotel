const express = require('express');
const axios = require('axios');
const path = require('path');

const schedulerEngine = require('./tools/scheduler_engine');
const { handleAccountingTask } = require('./accountant/accountant_agent');
const { handleLegalTask } = require('./02_Contracts_and_Legal/legal_agent');
const { handleProcurementTask } = require('./03_Procurement_and_Orders/procurement_agent');
const { handleBookingTask } = require('./04_Hotel_Booking_System/booking_agent');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID || '';
const WA_ACCESS_TOKEN = process.env.WA_ACCESS_TOKEN || '';
const VERIFY_TOKEN = process.env.WA_VERIFY_TOKEN || 'antigravity_token';

/**
 * إرسال رسالة رد عبر الواتساب (Meta WhatsApp Business API)
 */
async function sendWhatsAppMessage(to, messageText) {
  if (!WA_PHONE_NUMBER_ID || !WA_ACCESS_TOKEN) {
    console.log(`[SIMULATION MODE] WhatsApp message to ${to}:\n${messageText}`);
    return;
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${WA_PHONE_NUMBER_ID}/messages`;
    await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: messageText }
      },
      {
        headers: {
          Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`[WA SENT OK] To: ${to}`);
  } catch (err) {
    console.error('[WA SEND ERROR]', err.response?.data || err.message);
  }
}

/**
 * تحليل النية بواسطة Gemini أو المحلل الذكي
 */
async function classifyIntentAndRoute(text) {
  const lower = (text || '').toLowerCase();

  // فحص النيات المباشرة (Fast Rule-based Pattern Matcher)
  if (lower.includes('ذكرني') || lower.includes('موعد') || lower.includes('اجتماع') || lower.includes('تذكير') || lower.includes('جدول')) {
    // استخراج تفاصيل الموعد
    return {
      domain: 'SCHEDULER',
      details: {
        title: text.replace(/(ذكرني بـ|ذكرني ب|موعد|عندنا|عندي|جدولة)/g, '').trim() || text,
        dateStr: text.includes('بكرة') || text.includes('غدا') || text.includes('غداً') ? 'غداً' : 'اليوم',
        timeStr: text
      }
    };
  }

  if (lower.includes('فاتورة') || lower.includes('مصروف') || lower.includes('دفعت') || lower.includes('شراء') || lower.includes('جنيه') || lower.includes('وردية') || lower.includes('كافيه')) {
    return {
      domain: 'ACCOUNTANT',
      payload: {
        transaction_type: lower.includes('وردية') || lower.includes('كافيه') ? 'CAFE_SHIFT' : lower.includes('دخول') ? 'GUEST_CHECKIN' : 'EXPENSE_BILL',
        amount: parseFloat((text.match(/\d+(?:\.\d+)?/) || [0])[0]),
        original_text: text,
        details: { notes: text }
      }
    };
  }

  if (lower.includes('عقد') || lower.includes('قانوني') || lower.includes('لوائح') || lower.includes('شرط') || lower.includes('محامي')) {
    return {
      domain: 'LEGAL',
      payload: { details: { topic: text }, original_text: text }
    };
  }

  if (lower.includes('مشتريات') || lower.includes('مورد') || lower.includes('طلب شراء') || lower.includes('صيانة غرف')) {
    return {
      domain: 'PROCUREMENT',
      payload: { details: { item: text }, original_text: text }
    };
  }

  if (lower.includes('حجز') || lower.includes('غرفة') || lower.includes('نزيل') || lower.includes('تسكين')) {
    return {
      domain: 'BOOKING',
      payload: { details: { guest_name: 'نزيل', room_number: 'مستعلم عنها' }, original_text: text }
    };
  }

  return { domain: 'ASSISTANT', payload: { original_text: text } };
}

// ----------------------------------------------------
// Webhook Routes
// ----------------------------------------------------

// 1. Health check & web root (Keeping Cloud Server Alive)
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Antigravity Master AI Orchestrator 24/7 Server',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 2. Meta WhatsApp Verification Endpoint
app.get('/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WEBHOOK VERIFIED]');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// 3. WhatsApp Message Handler Endpoint
app.post('/webhook/whatsapp', async (req, res) => {
  res.status(200).send('EVENT_RECEIVED');

  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const contact = changes?.value?.contacts?.[0];

    if (!message) return;

    const fromNumber = message.from;
    const msgType = message.type;
    const text = msgType === 'text' ? message.text?.body : (message.image?.caption || message.document?.caption || '');

    console.log(`[INCOMING WA] From: ${fromNumber} (${contact?.profile?.name || 'User'}) - Msg: "${text}"`);

    // توجيه الرسالة عبر الـ Master Router
    const routeResult = await classifyIntentAndRoute(text);

    let replyMessage = '';

    if (routeResult.domain === 'SCHEDULER') {
      const apt = schedulerEngine.addAppointment({
        title: routeResult.details.title,
        dateStr: routeResult.details.dateStr,
        timeStr: routeResult.details.timeStr,
        fromNumber,
        reminderMinutesBefore: 60 // التذكير قبل الموعد بساعة
      });
      replyMessage = schedulerEngine.formatConfirmationWhatsAppMessage(apt);

    } else if (routeResult.domain === 'ACCOUNTANT') {
      const resAcc = handleAccountingTask({ ...routeResult.payload, contact_name: contact?.profile?.name });
      replyMessage = resAcc.message;

    } else if (routeResult.domain === 'LEGAL') {
      const resLeg = handleLegalTask(routeResult.payload);
      replyMessage = resLeg.message;

    } else if (routeResult.domain === 'PROCUREMENT') {
      const resProc = handleProcurementTask(routeResult.payload);
      replyMessage = resProc.message;

    } else if (routeResult.domain === 'BOOKING') {
      const resBook = handleBookingTask(routeResult.payload);
      replyMessage = resBook.message;

    } else {
      replyMessage = [
        `🤖 *[المساعد الشخصي الذكي - Antigravity]*`,
        ``,
        `أهلاً بك! تم استلام رسالتك وتوثيقها.`,
        `💡 يمكنك أن تطلب مني مباشرة:`,
        `1️⃣ تسجيل موعد والتذكير به قبل الموعد بساعة.`,
        `2️⃣ قيد فاتورة أو مصروف للمحاسب.`,
        `3️⃣ مراجعة بند أو عقد قانوني.`,
        `4️⃣ طلب شراء أو استعلام حجوزات الغرف.`
      ].join('\n');
    }

    // إرسال الرد المنسق فوراً على الواتساب
    await sendWhatsAppMessage(fromNumber, replyMessage);

  } catch (err) {
    console.error('[WEBHOOK ERROR]', err.message);
  }
});

// ----------------------------------------------------
// Background Scheduler Engine Worker (Runs Every 30 Seconds)
// ----------------------------------------------------
setInterval(async () => {
  try {
    const dueReminders = schedulerEngine.checkPendingReminders();
    for (const apt of dueReminders) {
      console.log(`[TRIGGERING REMINDER] Appointment: "${apt.title}" to ${apt.from_number}`);
      const reminderMsg = schedulerEngine.formatReminderWhatsAppMessage(apt);
      if (apt.from_number) {
        await sendWhatsAppMessage(apt.from_number, reminderMsg);
      }
    }
  } catch (err) {
    console.error('[SCHEDULER WORKER ERROR]', err.message);
  }
}, 30000);

// ----------------------------------------------------
// Start Server
// ----------------------------------------------------
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Antigravity Master AI Orchestrator running on port ${PORT}`);
  console.log(`⏰ Scheduler Engine Active (Checking reminders every 30s)`);
  console.log(`====================================================`);
});
