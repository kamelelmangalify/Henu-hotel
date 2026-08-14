# دليل تشغيل خادم الذكاء الاصطناعي والمواتساب 24/7 مجاناً (Free Cloud Hosting)

هذا الدليل يشرح كيفية رفع خادم الموجّه الرئيسي وتذكير المواعيد ليعمل **على السحابة مجاناً 24 ساعة / 7 أيام في الأسبوع** دون الحاجة لفتح الكومبيوتر الشخصي.

---

## 🌟 الخيار الأول: Render.com (الأسهل والأسرع - مجاني 100%)

1. **إنشاء حساب مجاني:**
   - سجل في موقع [Render.com](https://render.com).

2. **ربط الكود بـ GitHub / Render:**
   - ارفع كود المجلد لـ GitHub في مستودع (Repository) خاص بك.
   - من لوحة Render اختر **New > Web Service**.
   - اختر المستودع، وضع الإعدادات التالية:
     - **Runtime:** `Docker`
     - **Instance Type:** `Free`

3. **إضافة متغيرات البيئة (Environment Variables):**
   في صفحة الإعدادات أضف المتغيرات التالية:
   - `WA_PHONE_NUMBER_ID`: رقم معرف الواتساب من Meta.
   - `WA_ACCESS_TOKEN`: رمز الوصول Access Token.
   - `WA_VERIFY_TOKEN`: `antigravity_token` (أو أي كلمة من اختيارك).
   - `GOOGLE_API_KEY`: مفتاح Gemini مجاني من [Google AI Studio](https://aistudio.google.com).

4. **إبقاء الخدمة متصلة دائماً (Keep-Alive):**
   - لإبقاء الخدمة شغالة دون نوم، استخدم موقع مجاني مثل [UptimeRobot.com](https://uptimerobot.com) واجعل رابط الفحص: `https://your-app.onrender.com/health` كل 5 دقائق.

---

## 🚀 الخيار الثاني: Oracle Cloud Always Free VPS (الأقوى والأمثل للأبد)

تقدم Oracle خادم VPS كامل بـ **Linux (Ubuntu)** مجاني تماماً للأبد (4 Core CPU, 24 GB RAM):

1. **إنشاء الحساب:**
   - اشترك في [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/).

2. **إنشاء خادم (Compute Instance):**
   - اختر **Create Instance** بنظام `Ubuntu 22.04 LTS`.

3. **تشغيل المشروع بكلمة واحدة عبر Docker:**
   افتح مبدل الأوامر Terminal في الخادم ونفذ:
   ```bash
   git clone <YOUR_GIT_REPO_URL>
   cd Henu
   cp .env.example .env
   # قم بتعديل قيم .env ببياناتك
   docker-compose up -d --build
   ```
   سيعمل الخادم تلقائياً وتعمل الجدولة وتذكير الواتساب على مدار 24 ساعة بانتظام!

---

## 📲 ربط الويب هوك مع Meta WhatsApp

1. ادخل على [Meta Developer Portal](https://developers.facebook.com/).
2. انتقل لتطبيقك > **WhatsApp > Configuration**.
3. في خانة **Callback URL** ضع رابط خادمك السحابي:
   `https://YOUR-CLOUD-URL.com/webhook/whatsapp`
4. في **Verify Token** ضع: `antigravity_token`.
5. اضغط **Verify and Save**.

الآن أي رسالة تصدر منك على الواتساب ستصل للمساعد الشخصي، ويقوم بتوجيهها للمحاسب/القانوني/الحجوزات، أو جدولة موعدك والتذكير به قبل الوقت بـ 60 دقيقة تلقائياً! 🎯
