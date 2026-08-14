# 🏨 دليل الإعداد الكامل — نظام الأتمتة المحاسبية
## هوستل الأهرامات | Zoho Books + n8n + WhatsApp + GPT-4o

---

## المرحلة الأولى: إعداد Zoho Books

### 1. الحصول على OAuth2 Credentials

1. اذهب إلى [Zoho Developer Console](https://api-console.zoho.com/)
2. اضغط **Add Client** → اختر **Self Client**
3. احفظ الـ `Client ID` و `Client Secret`
4. في قسم **Generate Code**, أدخل هذه الـ Scopes:
   ```
   ZohoBooks.settings.CREATE,ZohoBooks.settings.READ,
   ZohoBooks.accountants.CREATE,ZohoBooks.accountants.READ,
   ZohoBooks.invoices.CREATE,ZohoBooks.invoices.READ,
   ZohoBooks.bills.CREATE,ZohoBooks.bills.READ,
   ZohoBooks.journals.CREATE,ZohoBooks.journals.READ
   ```
5. اضغط **Generate** واحفظ الـ `Authorization Code` (صالح لدقيقتين فقط!)

### 2. تشغيل سكربتات الإعداد

```bash
# الانتقال لمجلد الإعداد
cd D:\Henu\zoho_setup

# تثبيت المكتبات
pip install -r requirements.txt

# نسخ ملف الإعدادات
copy config.env.example config.env

# تعديل config.env بالبيانات الحقيقية (افتح بـ Notepad)
notepad config.env

# تهيئة التوكن (مرة واحدة فقط بعد الحصول على الكود)
python 01_auth.py --init --code=YOUR_AUTH_CODE_HERE

# تشغيل الإعداد الكامل
python 05_run_all.py
```

### 3. التحقق من النتائج

- **Zoho Books → Accountant → Chart of Accounts** — ابحث عن 18 حساب جديد
- **Settings → Taxes** — تحقق من VAT 14% و Service Charge 12% و WHT 1%/3%
- **Settings → Reporting Tags** — تحقق من Department (Rooms / Cafe & Restaurant / G&A)

---

## المرحلة الثانية: إعداد n8n

### 1. متطلبات n8n

- n8n مُشغَّل على HTTPS (إلزامي لـ Meta webhooks)
- إصدار n8n 1.0+ (لدعم الـ Switch node الجديد)

### 2. إعداد الـ Credentials في n8n

**Credential 1: Meta WhatsApp Token**
- النوع: **HTTP Header Auth**
- الاسم: `Meta WA Token`
- Header Name: `Authorization`
- Header Value: `Bearer YOUR_META_ACCESS_TOKEN`

**Credential 2: OpenAI**
- النوع: **OpenAI API**
- الاسم: `OpenAI GPT4o`
- API Key: مفتاح OpenAI

**Credential 3: Zoho Books**
- النوع: **HTTP Header Auth**
- الاسم: `Zoho Books Token`
- Header Name: `Authorization`
- Header Value: `Zoho-oauthtoken YOUR_ACCESS_TOKEN`
  > ملاحظة: يحتاج تجديد كل ساعة — يفضل استخدام HTTP node مع تجديد تلقائي

### 3. استيراد الـ Workflows

```
n8n → Settings → Import from File
→ استورد بالترتيب:
   01_whatsapp_webhook.json
   02_llm_parser.json
   03_zoho_execution.json
   04_auto_response.json
```

### 4. إعداد Environment Variables في n8n

```
WA_PHONE_NUMBER_ID = رقم الهاتف من Meta
ZOHO_ORG_ID       = رقم المنشأة من Zoho
```

### 5. ربط الـ Workflows ببعض

في الـ workflow رقم 1 (Webhook Receiver)، اجعل السطح النصي والصوتي يستدعي **workflow 2** (LLM Parser)، ثم workflow 2 يستدعي **workflow 3** (Zoho Execution)، ثم 3 يستدعي **workflow 4** (Auto Response).

---

## المرحلة الثالثة: إعداد Meta WhatsApp Business API

### 1. إنشاء التطبيق

1. اذهب إلى [Meta Developer Portal](https://developers.facebook.com/)
2. **My Apps → Create App → Business**
3. أضف منتج **WhatsApp**
4. اختر أو أنشئ **WhatsApp Business Account**

### 2. تسجيل الـ Webhook

1. في **WhatsApp → Configuration → Webhook**:
   - **Callback URL**: `https://YOUR-N8N-URL/webhook/whatsapp-incoming`
   - **Verify Token**: نفس قيمة `WA_VERIFY_TOKEN` في config.env
2. اشترك في الأحداث: `messages`

### 3. اختبار الربط

أرسل رسالة اختبارية من رقم موظف مسجّل:
```
دخول نزيل: محمد أحمد، غرفة 5، ليلتين، نقد، 900 جنيه
```

---

## استكشاف الأخطاء (Troubleshooting)

| المشكلة | الحل |
|---|---|
| `invalid_client` عند الـ auth | تحقق من Client ID/Secret في config.env |
| `organization_id` خطأ | شغّل `python 01_auth.py --test` للحصول على الـ ID الصحيح |
| Webhook لا يستجيب | تحقق أن الـ n8n يعمل على HTTPS وأن الـ workflow مُفعَّل (Active) |
| LLM لا يُخرج JSON | تحقق من OPENAI_API_KEY وأن الـ GPT-4o متاح |
| `account not found` في Zoho | تأكد من تشغيل `05_run_all.py` بنجاح أولاً |

---

*آخر تحديث: أغسطس 2026*
