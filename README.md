---
title: Antigravity AI Orchestrator & WhatsApp Bot
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 3000
pinned: false
---

# 🤖 Antigravity Master AI Orchestrator & WhatsApp Bot

خادم سحابي ذكي يعمل 24/7 لمعالجة رسائل الواتساب، توجيه المعاملات المالية والمحاسبية والعقود، وتذكير المواعيد تلقائياً.

## 🚀 المميزات:
- **توجيه النية (Intent Classification):** معالجة الرسائل وتحويلها فوراً للوكيل المختص (محاسب، مستشار قانوني، مشتريات، حجوزات، مساعد شخصي).
- **التذكير بالآلي بالمواعيد:** حساب التوقيت بدقة وإرسال إشعار على الواتساب قبل الموعد بساعة.
- **ربط Meta WhatsApp API:** استجابة سريعة للرسائل النصية وصور الفواتير.

## 🔗 مسارات الـ Webhook:
- `GET /` — فحص حالة الخادم (Health Check).
- `GET /webhook/whatsapp` — التوثيق مع Meta (`hub.challenge`).
- `POST /webhook/whatsapp` — استقبال ومعالجة الرسائل التلقائية.
