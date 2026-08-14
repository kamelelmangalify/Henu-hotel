# استخدم بيئة Node.js مستقرة وخفيفة
FROM node:20-alpine

# تحديد مجلد العمل
WORKDIR /app

# نسخ ملفات الحزم والتثبيت
COPY package*.json ./
RUN npm install --production

# نسخ كود المشروع بالكامل
COPY . .

# فتح المنفذ الخارجي 3000
EXPOSE 3000

# تشغيل الخادم الرئيسي
CMD ["npm", "start"]
