const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path for persistent data storage
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'pms_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// -------------------------------------------------------------
// PRE-POPULATED REAL SEED DATA (25 Rooms, 30 Staff, Inventory, Financials)
// -------------------------------------------------------------
const initialData = {
  // Pre-configured Users for Auth & Demo Roles
  users: [
    { id: 'usr-1', username: 'admin', email: 'admin@henuhotel.com', password: '123', name: 'أ.د. كمال الدين (المالك / المدير العام)', role: 'admin', roleLabel: '👑 مدير / مالك الفندق' },
    { id: 'usr-2', username: 'reception', email: 'reception@henuhotel.com', password: '123', name: 'محمود عبد الفتاح (مسؤول الاستقبال)', role: 'receptionist', roleLabel: '🛎️ موظف استقبال' },
    { id: 'usr-3', username: 'housekeeping', email: 'housekeeping@henuhotel.com', password: '123', name: 'مصطفى رجب (مشرف الإشراف الداخلي)', role: 'housekeeping', roleLabel: '🧹 مشرف إشراف داخلي' }
  ],

  // 25 Rooms across 4 floors
  rooms: [
    // الدور الأول (4 غرف)
    { id: '101', floor: 'الدور الأول', type: 'دابل شبك', beds: '1 سرير دابل', price: 1200, status: 'clean', guest: null, notes: 'شباك / شبك' },
    { id: '102', floor: 'الدور الأول', type: 'سرير كينج', beds: '1 سرير كينج', price: 1400, status: 'occupied', guest: { name: 'أحمد محمود العبد', phone: '01012345678', checkin: '2026-08-14', checkout: '2026-08-17', paid: 2800, total: 4200 }, notes: 'سرير كينج شبك' },
    { id: '103', floor: 'الدور الأول', type: 'سويت فندقي', beds: '1 سرير كينج + صالة', price: 2500, status: 'occupied', guest: { name: 'د. طارق علي السيد', phone: '01122334455', checkin: '2026-08-15', checkout: '2026-08-18', paid: 7500, total: 7500 }, notes: 'سويت فندقي فاخر' },
    { id: '104', floor: 'الدور الأول', type: 'كينج شبك', beds: '1 سرير كينج', price: 1500, status: 'clean', guest: null, notes: 'سرير كينج شبك' },

    // الدور الثاني (7 غرف)
    { id: '201', floor: 'الدور الثاني', type: 'سنجل بلكونه', beds: '1 سرير سنجل', price: 900, status: 'clean', guest: null, notes: 'إطلالة بلكونة' },
    { id: '202', floor: 'الدور الثاني', type: 'دابل بلكونه', beds: '1 سرير دابل', price: 1300, status: 'occupied', guest: { name: 'جون سميث (John Smith)', phone: '+447911123456', checkin: '2026-08-12', checkout: '2026-08-16', paid: 5200, total: 5200 }, notes: 'نزيل أجنبي - بلكونة' },
    { id: '203', floor: 'الدور الثاني', type: 'دابل', beds: '1 سرير دابل', price: 1200, status: 'cleaning', guest: null, notes: 'جاري تغيير المفروشات والتعقيم' },
    { id: '204', floor: 'الدور الثاني', type: 'سرير كينج', beds: '1 سرير كينج', price: 1500, status: 'occupied', guest: { name: 'سارة إبراهيم الشريف', phone: '01299887766', checkin: '2026-08-15', checkout: '2026-08-19', paid: 3000, total: 6000 }, notes: 'سرير كينج' },
    { id: '205', floor: 'الدور الثاني', type: 'دابل', beds: '1 سرير دابل', price: 1200, status: 'maintenance', guest: null, notes: 'التكييف يحتاج شحن فريون' },
    { id: '206', floor: 'الدور الثاني', type: 'ترابل شبك جانبي', beds: '3 سراير سنجل', price: 1800, status: 'clean', guest: null, notes: 'عائلية 3 أسرّة' },
    { id: '207', floor: 'الدور الثاني', type: 'دابل شبك جانبي', beds: '1 سرير دابل', price: 1250, status: 'clean', guest: null, notes: 'شبك جانبي' },

    // الدور الثالث (7 غرف)
    { id: '301', floor: 'الدور الثالث', type: 'سنجل بلكونه', beds: '1 سرير سنجل', price: 950, status: 'clean', guest: null, notes: 'بلكونة هادئة' },
    { id: '302', floor: 'الدور الثالث', type: 'دابل بلكونه', beds: '1 سرير دابل', price: 1350, status: 'occupied', guest: { name: 'م. خالد عبد الرحمن', phone: '01005544332', checkin: '2026-08-14', checkout: '2026-08-18', paid: 2700, total: 5400 }, notes: 'بلكونة دور ثالث' },
    { id: '303', floor: 'الدور الثالث', type: 'سرير كينج', beds: '1 سرير كينج', price: 1550, status: 'clean', guest: null, notes: 'جاهزة للتسكين' },
    { id: '304', floor: 'الدور الثالث', type: 'سرير كينج', beds: '1 سرير كينج', price: 1550, status: 'occupied', guest: { name: 'أليكسيس دوفال (Alexis Duval)', phone: '+33612345678', checkin: '2026-08-15', checkout: '2026-08-20', paid: 7750, total: 7750 }, notes: 'سائح فرنسي' },
    { id: '305', floor: 'الدور الثالث', type: 'سرير كينج', beds: '1 سرير كينج', price: 1550, status: 'preparing', guest: null, notes: 'تحت التجهيز لاستقبال دفعة ألمانية' },
    { id: '306', floor: 'الدور الثالث', type: 'كينج بلكونه جانبي', beds: '1 سرير كينج', price: 1650, status: 'cleaning', guest: null, notes: 'تطهير وتعقيم الحمام' },
    { id: '307', floor: 'الدور الثالث', type: 'دبل شبك جانبي', beds: '1 سرير دابل', price: 1300, status: 'clean', guest: null, notes: 'شبك جانبي' },

    // الدور الرابع / الروف (7 غرف)
    { id: '401', floor: 'الدور الرابع (الروف)', type: 'سنجل بلكونه', beds: '1 سرير سنجل', price: 1000, status: 'clean', guest: null, notes: 'إطلالة علوية' },
    { id: '402', floor: 'الدور الرابع (الروف)', type: 'دابل بلكونه', beds: '1 سرير دابل', price: 1400, status: 'clean', guest: null, notes: 'بلكونة واسعة' },
    { id: '403', floor: 'الدور الرابع (الروف)', type: 'سرير كينج - روف أهرامات', beds: '1 سرير كينج', price: 2000, status: 'occupied', guest: { name: 'عمر الفاروق الباز', phone: '01111223344', checkin: '2026-08-13', checkout: '2026-08-17', paid: 8000, total: 8000 }, notes: 'إطلالة مباشرة على الأهرامات' },
    { id: '404', floor: 'الدور الرابع (الروف)', type: 'سرير كينج - روف أهرامات', beds: '1 سرير كينج', price: 2000, status: 'occupied', guest: { name: 'ماريا كوستاس (Maria Kostas)', phone: '+30691234567', checkin: '2026-08-15', checkout: '2026-08-19', paid: 4000, total: 8000 }, notes: 'إطلالة الأهرامات المباشرة' },
    { id: '405', floor: 'الدور الرابع (الروف)', type: 'دابل', beds: '1 سرير دابل', price: 1350, status: 'clean', guest: null, notes: 'جاهزة للتسكين' },
    { id: '406', floor: 'الدور الرابع (الروف)', type: 'ترابل شبك جانبي', beds: '3 سراير سنجل', price: 1900, status: 'maintenance', guest: null, notes: 'إصلاح تسريب سباكة بالحمام' },
    { id: '407', floor: 'الدور الرابع (الروف)', type: 'دابل شبك جانبي', beds: '1 سرير دابل', price: 1350, status: 'clean', guest: null, notes: 'شبك جانبي' }
  ],

  // 30 Real Staff Members distributed across Departments
  hr: [
    // 1. قسم الإدارة والاستقبال (Reception & Management - 6 موظفين)
    { id: 'EMP-101', name: 'أحمد حسام الدين', dept: 'الاستقبال (Front Desk)', role: 'رئيس قسم الاستقبال', shift: 'صباحية', status: 'present', dailySalary: 300, scores: { attendance: 5, hygiene: 5, uniform: 5, softSkills: 5, execution: 5 }, overallScore: 5.0, monthlyPercentage: 100, notes: 'التزام تكتيكي استثنائي ودقة في تسكينات النزلاء' },
    { id: 'EMP-102', name: 'محمود عبد الفتاح', dept: 'الاستقبال (Front Desk)', role: 'موظف استقبال أول', shift: 'صباحية', status: 'present', dailySalary: 250, scores: { attendance: 5, hygiene: 5, uniform: 5, softSkills: 4.8, execution: 4.9 }, overallScore: 4.9, monthlyPercentage: 98, notes: 'ممتاز في سرعة إجراءات الوصول وتوفير الراحة للنزلاء' },
    { id: 'EMP-103', name: 'كريم عادل فتحي', dept: 'الاستقبال (Front Desk)', role: 'موظف استقبال', shift: 'مسائية', status: 'present', dailySalary: 240, scores: { attendance: 5, hygiene: 4.5, uniform: 5, softSkills: 4.7, execution: 4.8 }, overallScore: 4.8, monthlyPercentage: 96, notes: 'جاهزية عالية للوردية المسائية ورعاية الحجوزات المتأخرة' },
    { id: 'EMP-104', name: 'منى فاروق السلامي', dept: 'الاستقبال (Front Desk)', role: 'موظفة علاقات ضيوف', shift: 'صباحية', status: 'present', dailySalary: 260, scores: { attendance: 5, hygiene: 5, uniform: 5, softSkills: 5, execution: 4.9 }, overallScore: 4.98, monthlyPercentage: 99.6, notes: 'لباقة عالية وإتقان للغة الإنجليزية والفرنسية' },
    { id: 'EMP-105', name: 'أيمن صلاح نصر', dept: 'الاستقبال (Front Desk)', role: 'موظف استقبال ليلي', shift: 'ليلية', status: 'present', dailySalary: 250, scores: { attendance: 4.8, hygiene: 4.5, uniform: 4.8, softSkills: 4.6, execution: 4.7 }, overallScore: 4.68, monthlyPercentage: 93.6, notes: 'انضباط في شفت الليل وتقفيل الحسابات' },
    { id: 'EMP-106', name: 'سامح مصطفى كامل', dept: 'الاستقبال (Front Desk)', role: 'حامل أمتعة (Bellman)', shift: 'صباحية', status: 'present', dailySalary: 190, scores: { attendance: 5, hygiene: 4.8, uniform: 5, softSkills: 4.9, execution: 4.8 }, overallScore: 4.86, monthlyPercentage: 97.2, notes: 'مساعدة فورية للنزلاء مع الابتسامة الدائمة' },

    // 2. قسم الإشراف الداخلي والنظافة (Housekeeping - 10 موظفين)
    { id: 'EMP-201', name: 'مصطفى رجب السيد', dept: 'الإشراف الداخلي (Housekeeping)', role: 'مشرف الإشراف الداخلي', shift: 'صباحية', status: 'present', dailySalary: 290, scores: { attendance: 5, hygiene: 5, uniform: 5, softSkills: 4.8, execution: 5 }, overallScore: 4.96, monthlyPercentage: 99.2, notes: 'إشراف ومتابعة دقيقة لنظافة وتطهير الـ 25 غرفة' },
    { id: 'EMP-202', name: 'حسن علي عبد ربه', dept: 'الإشراف الداخلي (Housekeeping)', role: 'عامل غرف أول', shift: 'صباحية', status: 'present', dailySalary: 210, scores: { attendance: 5, hygiene: 4.7, uniform: 4.8, softSkills: 4.6, execution: 4.7 }, overallScore: 4.76, monthlyPercentage: 95.2, notes: 'تجهيز 6 غرف في الزمن القياسي' },
    { id: 'EMP-203', name: 'سيد إبراهيم غانم', dept: 'الإشراف الداخلي (Housekeeping)', role: 'عامل غرف', shift: 'صباحية', status: 'present', dailySalary: 200, scores: { attendance: 4.5, hygiene: 4.6, uniform: 4.5, softSkills: 4.5, execution: 4.6 }, overallScore: 4.54, monthlyPercentage: 90.8, notes: 'نظافة جيدة للغرف بوفق معايير الفندق' },
    { id: 'EMP-204', name: 'رمضان عبد الستار', dept: 'الإشراف الداخلي (Housekeeping)', role: 'عامل غرف', shift: 'مسائية', status: 'present', dailySalary: 200, scores: { attendance: 5, hygiene: 4.5, uniform: 4.7, softSkills: 4.4, execution: 4.5 }, overallScore: 4.62, monthlyPercentage: 92.4, notes: 'تجهيز وتطهير الحمامات والممرات' },
    { id: 'EMP-205', name: 'عاطف سلامة شحاتة', dept: 'الإشراف الداخلي (Housekeeping)', role: 'عامل غرف', shift: 'صباحية', status: 'present', dailySalary: 195, scores: { attendance: 4.8, hygiene: 4.5, uniform: 4.6, softSkills: 4.5, execution: 4.4 }, overallScore: 4.56, monthlyPercentage: 91.2, notes: 'نظافة ممرات الأدوار الثاني والثالث' },
    { id: 'EMP-206', name: 'أميرة عبد المنعم', dept: 'المغسلة (Laundry)', role: 'مشرفة المغسلة والمفروشات', shift: 'صباحية', status: 'present', dailySalary: 230, scores: { attendance: 5, hygiene: 5, uniform: 5, softSkills: 4.8, execution: 4.9 }, overallScore: 4.94, monthlyPercentage: 98.8, notes: 'غسيل وكي وتغليف أطقم المفروشات بدقة' },
    { id: 'EMP-207', name: 'خالد مصطفى بكري', dept: 'المغسلة (Laundry)', role: 'عامل مغسلة', shift: 'صباحية', status: 'present', dailySalary: 190, scores: { attendance: 4.7, hygiene: 4.5, uniform: 4.6, softSkills: 4.3, execution: 4.6 }, overallScore: 4.54, monthlyPercentage: 90.8, notes: 'ترتيب وتوزيع البياضات على الأدوار' },
    { id: 'EMP-208', name: 'صباح فتحي شريف', dept: 'الإشراف الداخلي (Housekeeping)', role: 'عاملة نظافة الأماكن العامة', shift: 'صباحية', status: 'present', dailySalary: 190, scores: { attendance: 5, hygiene: 5, uniform: 4.8, softSkills: 4.8, execution: 4.8 }, overallScore: 4.88, monthlyPercentage: 97.6, notes: 'تلميع ونظافة اللوبي والمصاعد' },
    { id: 'EMP-209', name: 'ياسر جابر إمام', dept: 'الإشراف الداخلي (Housekeeping)', role: 'عامل غرف روف', shift: 'مسائية', status: 'present', dailySalary: 200, scores: { attendance: 4.6, hygiene: 4.5, uniform: 4.5, softSkills: 4.5, execution: 4.6 }, overallScore: 4.54, monthlyPercentage: 90.8, notes: 'تجهيز وتطهير تراس الروف والأهرامات' },
    { id: 'EMP-210', name: 'وائل السيد عبده', dept: 'الإشراف الداخلي (Housekeeping)', role: 'عامل غرف', shift: 'ليلية', status: 'present', dailySalary: 205, scores: { attendance: 4.8, hygiene: 4.6, uniform: 4.6, softSkills: 4.5, execution: 4.7 }, overallScore: 4.64, monthlyPercentage: 92.8, notes: 'تغطية الطلبات العاجلة في الوردية الليلية' },

    // 3. قسم الصيانة والتشغيل (Maintenance & Engineering - 4 موظفين)
    { id: 'EMP-301', name: 'إبراهيم السيد الفقي', dept: 'الهندسة والصيانة (Engineering)', role: 'مهندس صيانة أول', shift: 'صباحية', status: 'present', dailySalary: 320, scores: { attendance: 5, hygiene: 4.8, uniform: 4.9, softSkills: 4.7, execution: 5 }, overallScore: 4.88, monthlyPercentage: 97.6, notes: 'إشراف على التكييف والسباكة والكهرباء' },
    { id: 'EMP-302', name: 'طارق عبد المحسن', dept: 'الهندسة والصيانة (Engineering)', role: 'فني سباكة وتشطيبات', shift: 'صباحية', status: 'present', dailySalary: 260, scores: { attendance: 4.8, hygiene: 4.4, uniform: 4.6, softSkills: 4.5, execution: 4.8 }, overallScore: 4.62, monthlyPercentage: 92.4, notes: 'معالجة تسريب السباكة بغرفة 406' },
    { id: 'EMP-303', name: 'مدحت سعد الدين', dept: 'الهندسة والصيانة (Engineering)', role: 'فني تكييف وتبريد', shift: 'مسائية', status: 'present', dailySalary: 260, scores: { attendance: 5, hygiene: 4.5, uniform: 4.7, softSkills: 4.6, execution: 4.7 }, overallScore: 4.70, monthlyPercentage: 94.0, notes: 'فحص وصيانة كباسة تكييف الغرفة 205' },
    { id: 'EMP-304', name: 'عادل زكي منصور', dept: 'الهندسة والصيانة (Engineering)', role: 'فني كهرباء ومعاون صيانة', shift: 'صباحية', status: 'present', dailySalary: 230, scores: { attendance: 4.7, hygiene: 4.5, uniform: 4.6, softSkills: 4.5, execution: 4.6 }, overallScore: 4.58, monthlyPercentage: 91.6, notes: 'مراجعة شبكة الإنارة بالروف والممرات' },

    // 4. قسم الأغذية والمشروبات والمطبخ (F&B / Kitchen - 5 موظفين)
    { id: 'EMP-401', name: 'الشيف نبيل الدسوقي', dept: 'المطبخ والأغذية (Kitchen/F&B)', role: 'كبير طهاة الفندق (Executive Chef)', shift: 'صباحية', status: 'present', dailySalary: 380, scores: { attendance: 5, hygiene: 5, uniform: 5, softSkills: 4.9, execution: 5 }, overallScore: 4.98, monthlyPercentage: 99.6, notes: 'إعداد بوفيه الإفطار الفاخر والوجبات' },
    { id: 'EMP-402', name: 'علاء الدين مرسي', dept: 'المطبخ والأغذية (Kitchen/F&B)', role: 'شيف شرقي وغربي', shift: 'صباحية', status: 'present', dailySalary: 280, scores: { attendance: 5, hygiene: 4.9, uniform: 5, softSkills: 4.7, execution: 4.8 }, overallScore: 4.88, monthlyPercentage: 97.6, notes: 'إطعام واستجابة سريعة لطلبات الـ Room Service' },
    { id: 'EMP-403', name: 'إسلام فاروق حماد', dept: 'المطبخ والأغذية (Kitchen/F&B)', role: 'مضيف خدمة غرف (Room Service)', shift: 'مسائية', status: 'present', dailySalary: 210, scores: { attendance: 4.9, hygiene: 4.8, uniform: 4.9, softSkills: 4.9, execution: 4.8 }, overallScore: 4.86, monthlyPercentage: 97.2, notes: 'توصيل الوجبات للغرف بلباقة عالية' },
    { id: 'EMP-404', name: 'نسرين عبد العال', dept: 'المطبخ والأغذية (Kitchen/F&B)', role: 'مضيفة مطعم الإفطار', shift: 'صباحية', status: 'present', dailySalary: 220, scores: { attendance: 5, hygiene: 5, uniform: 5, softSkills: 5, execution: 4.8 }, overallScore: 4.96, monthlyPercentage: 99.2, notes: 'استقبال ضيوف الإفطار بابتسامة وترحيب' },
    { id: 'EMP-405', name: 'أشرف الجبالي', dept: 'المطبخ والأغذية (Kitchen/F&B)', role: 'مساعد مطبخ ونظافة أدوات', shift: 'صباحية', status: 'present', dailySalary: 185, scores: { attendance: 4.8, hygiene: 4.7, uniform: 4.6, softSkills: 4.4, execution: 4.6 }, overallScore: 4.62, monthlyPercentage: 92.4, notes: 'غسيل وتطهير الأواني وأدوات السفرة' },

    // 5. قسم الأمن والسلامة (Security & Safety - 3 موظفين)
    { id: 'EMP-501', name: 'العقيد المتقاعد طاهر رزق', dept: 'الأمن والحراسة (Security)', role: 'مدير أمن الفندق', shift: 'صباحية', status: 'present', dailySalary: 350, scores: { attendance: 5, hygiene: 5, uniform: 5, softSkills: 4.8, execution: 5 }, overallScore: 4.96, monthlyPercentage: 99.2, notes: 'تأمين كامل للبوابات والكاميرات' },
    { id: 'EMP-502', name: 'محمد عبد القادر', dept: 'الأمن والحراسة (Security)', role: 'مأمور أمن واستقبال بوابات', shift: 'مسائية', status: 'present', dailySalary: 210, scores: { attendance: 5, hygiene: 4.7, uniform: 4.9, softSkills: 4.7, execution: 4.8 }, overallScore: 4.82, monthlyPercentage: 96.4, notes: 'مراقبة حركة الدخول والخروج بدقة' },
    { id: 'EMP-503', name: 'سعيد شحاتة عطية', dept: 'الأمن والحراسة (Security)', role: 'مأمور أمن ليلي', shift: 'ليلية', status: 'present', dailySalary: 210, scores: { attendance: 5, hygiene: 4.6, uniform: 4.8, softSkills: 4.5, execution: 4.7 }, overallScore: 4.72, monthlyPercentage: 94.4, notes: 'حراسة ليلية ومراجعة منافذ الفندق' },

    // 6. الحسابات والماليات (Finance & HR - 2 موظفين)
    { id: 'EMP-601', name: 'أحمد ماهر عبد اللطيف', dept: 'المالية والحسابات (Finance)', role: 'رئيس الحسابات والمالية', shift: 'صباحية', status: 'present', dailySalary: 360, scores: { attendance: 5, hygiene: 5, uniform: 5, softSkills: 4.9, execution: 5 }, overallScore: 4.98, monthlyPercentage: 99.6, notes: 'إشراف على التقفيل الخزني ومراجعة الإيرادات' },
    { id: 'EMP-602', name: 'شيماء إبراهيم خليل', dept: 'الموارد البشرية (HR)', role: 'مسؤولة الموارد البشرية والرواتب', shift: 'صباحية', status: 'present', dailySalary: 310, scores: { attendance: 5, hygiene: 5, uniform: 5, softSkills: 5, execution: 4.9 }, overallScore: 4.98, monthlyPercentage: 99.6, notes: 'متابعة تقييمات عمال الفندق وشيت الرواتب' }
  ],

  // Active Sample Reservations
  reservations: [
    { id: 'RES-1001', guestName: 'أحمد محمود العبد', nationalId: '29801011234567', phone: '01012345678', roomId: '102', checkin: '2026-08-14', checkout: '2026-08-17', status: 'checked_in', dailyRate: 1400, nights: 3, totalAmount: 4200, paidAmount: 2800, balance: 1400, paymentMethod: 'cash', notes: 'دفعة مقدمة 2800 ج' },
    { id: 'RES-1002', guestName: 'د. طارق علي السيد', nationalId: '28504041234589', phone: '01122334455', roomId: '103', checkin: '2026-08-15', checkout: '2026-08-18', status: 'checked_in', dailyRate: 2500, nights: 3, totalAmount: 7500, paidAmount: 7500, balance: 0, paymentMethod: 'visa', notes: 'مدفوع بالكامل بالفيزا' },
    { id: 'RES-1003', guestName: 'جون سميث (John Smith)', nationalId: 'PASSPORT-UK98765', phone: '+447911123456', roomId: '202', checkin: '2026-08-12', checkout: '2026-08-16', status: 'checked_in', dailyRate: 1300, nights: 4, totalAmount: 5200, paidAmount: 5200, balance: 0, paymentMethod: 'visa', notes: 'مغادرة غداً 12 ظهراً' },
    { id: 'RES-1004', guestName: 'سارة إبراهيم الشريف', nationalId: '29909091234123', phone: '01299887766', roomId: '204', checkin: '2026-08-15', checkout: '2026-08-19', status: 'checked_in', dailyRate: 1500, nights: 4, totalAmount: 6000, paidAmount: 3000, balance: 3000, paymentMethod: 'cash', notes: 'متبقي 3000 جنيه عند المغادرة' },
    { id: 'RES-1005', guestName: 'م. خالد عبد الرحمن', nationalId: '28211029876543', phone: '01005544332', roomId: '302', checkin: '2026-08-14', checkout: '2026-08-18', status: 'checked_in', dailyRate: 1350, nights: 4, totalAmount: 5400, paidAmount: 2700, balance: 2700, paymentMethod: 'cash', notes: 'طلب سرير إضافي للأطفال' },
    { id: 'RES-1006', guestName: 'أليكسيس دوفال (Alexis Duval)', nationalId: 'PASSPORT-FR54321', phone: '+33612345678', roomId: '304', checkin: '2026-08-15', checkout: '2026-08-20', status: 'checked_in', dailyRate: 1550, nights: 5, totalAmount: 7750, paidAmount: 7750, balance: 0, paymentMethod: 'visa', notes: 'تم سداد الحساب بالكامل' },
    { id: 'RES-1007', guestName: 'عمر الفاروق الباز', nationalId: '29003031212121', phone: '01111223344', roomId: '403', checkin: '2026-08-13', checkout: '2026-08-17', status: 'checked_in', dailyRate: 2000, nights: 4, totalAmount: 8000, paidAmount: 8000, balance: 0, paymentMethod: 'cash', notes: 'جناح الروف الأهرامات' },
    { id: 'RES-1008', guestName: 'ماريا كوستاس (Maria Kostas)', nationalId: 'PASSPORT-GR88776', phone: '+30691234567', roomId: '404', checkin: '2026-08-15', checkout: '2026-08-19', status: 'checked_in', dailyRate: 2000, nights: 4, totalAmount: 8000, paidAmount: 4000, balance: 4000, paymentMethod: 'visa', notes: 'سداد نصف المبلغ فيزا' }
  ],

  financials: {
    shift: {
      id: 'SHIFT-20260815-1',
      cashier: 'محمود عبد الفتاح (وردية الصباح)',
      startTime: '2026-08-15 08:00',
      openingBalance: 5000,
      maxSafeCashLimit: 15000,
      cashPolicyStatus: 'التزام كامل بالحد الأقصى للنقدية (Safe Cash Policy Compliant)'
    },
    transactions: [
      { id: 'TXN-101', time: '09:30', type: 'revenue', method: 'cash', amount: 2800, category: 'تسكين غرف', description: 'دفعة غرفة 102 - أحمد محمود', ref: 'RES-1001' },
      { id: 'TXN-102', time: '10:15', type: 'revenue', method: 'visa', amount: 7500, category: 'تسكين غرف', description: 'كامل الإقامة سويت 103 - د. طارق علي', ref: 'RES-1002' },
      { id: 'TXN-103', time: '11:00', type: 'revenue', method: 'cash', amount: 3000, category: 'تسكين غرف', description: 'دفعة غرفة 204 - سارة إبراهيم', ref: 'RES-1004' },
      { id: 'TXN-104', time: '12:20', type: 'expense', method: 'cash', amount: 450, category: 'مصروفات نثرية', description: 'شراء ضيافة ونظافة للاستقبال', ref: 'EXP-88' },
      { id: 'TXN-105', time: '14:00', type: 'revenue', method: 'visa', amount: 7750, category: 'تسكين غرف', description: 'كامل الإقامة غرفة 304 - أليكسيس دوفال', ref: 'RES-1006' },
      { id: 'TXN-106', time: '15:10', type: 'revenue', method: 'cash', amount: 4000, category: 'تسكين غرف', description: 'دفعة مقدمة روف 404 - ماريا كوستاس', ref: 'RES-1008' }
    ]
  },

  inventory: [
    { id: 'INV-101', name: 'ملاءة سرير كينج (King Bed Sheet)', category: 'مفروشات', currentStock: 22, parLevel: 22, unit: 'طقم', status: 'ok' },
    { id: 'INV-102', name: 'ملاءة سرير دابل (Double Bed Sheet)', category: 'مفروشات', currentStock: 12, parLevel: 18, unit: 'طقم', status: 'warning' },
    { id: 'INV-103', name: 'ملاءة سرير سنجل (Single Bed Sheet)', category: 'مفروشات', currentStock: 16, parLevel: 16, unit: 'طقم', status: 'ok' },
    { id: 'INV-104', name: 'لحاف وكيس لحاف (Duvet Set)', category: 'مفروشات', currentStock: 35, parLevel: 42, unit: 'عدد', status: 'warning' },
    { id: 'INV-105', name: 'مخدات فندقية (Hotel Pillows)', category: 'مفروشات', currentStock: 96, parLevel: 96, unit: 'عدد', status: 'ok' },
    { id: 'INV-106', name: 'طقم مناشف وجه وحمام (Towel Sets)', category: 'مستلزمات الغرف', currentStock: 28, parLevel: 50, unit: 'طقم', status: 'critical' },
    { id: 'INV-107', name: 'صابون وشامبو فندقي (Hotel Amenities)', category: 'مستلزمات الغرف', currentStock: 45, parLevel: 100, unit: 'عبوة', status: 'critical' },
    { id: 'INV-108', name: 'منظفات ومطهرات أرضيات (Cleaning Liquids)', category: 'نظافة', currentStock: 15, parLevel: 10, unit: 'لتر', status: 'ok' },
    { id: 'INV-109', name: 'مجموعات شاي ونسكافيه للغرف (Tea & Coffee Kits)', category: 'أغذية ومشروبات', currentStock: 60, parLevel: 120, unit: 'كيس', status: 'warning' }
  ]
};

// Helper: load DB
function loadDB() {
  if (!fs.existsSync(DATA_FILE)) {
    saveDB(initialData);
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    // Ensure users & full HR list exist in existing DB
    if (!parsed.users) parsed.users = initialData.users;
    if (!parsed.hr || parsed.hr.length < 30) parsed.hr = initialData.hr;
    return parsed;
  } catch (err) {
    console.error('Error reading db, loading defaults:', err);
    return initialData;
  }
}

// Helper: save DB
function saveDB(db) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving db:', err);
  }
}

let db = loadDB();

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. AUTHENTICATION & LOGIN API (RBAC)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = db.users.find(u => 
    (u.username === username || u.email === username) && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleLabel: user.roleLabel
    }
  });
});

// Get User Accounts
app.get('/api/users', (req, res) => {
  res.json(db.users.map(u => ({ id: u.id, name: u.name, role: u.role, roleLabel: u.roleLabel, email: u.email })));
});

// 2. SYSTEM STATUS KPIS
app.get('/api/status', (req, res) => {
  const totalRooms = db.rooms.length;
  const occupied = db.rooms.filter(r => r.status === 'occupied').length;
  const clean = db.rooms.filter(r => r.status === 'clean').length;
  const cleaning = db.rooms.filter(r => r.status === 'cleaning').length;
  const preparing = db.rooms.filter(r => r.status === 'preparing').length;
  const maintenance = db.rooms.filter(r => r.status === 'maintenance').length;
  const occupancyRate = ((occupied / totalRooms) * 100).toFixed(1);

  const txns = db.financials.transactions;
  const totalCashRev = txns.filter(t => t.type === 'revenue' && t.method === 'cash').reduce((s, t) => s + t.amount, 0);
  const totalVisaRev = txns.filter(t => t.type === 'revenue' && t.method === 'visa').reduce((s, t) => s + t.amount, 0);
  const totalExp = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netCashInSafe = db.financials.shift.openingBalance + totalCashRev - totalExp;

  const lowStockCount = db.inventory.filter(i => i.status === 'warning' || i.status === 'critical').length;

  res.json({
    totalRooms,
    occupied,
    clean,
    cleaning,
    preparing,
    maintenance,
    occupancyRate: parseFloat(occupancyRate),
    financials: {
      totalRevenueToday: totalCashRev + totalVisaRev,
      totalCashRev,
      totalVisaRev,
      totalExp,
      netCashInSafe,
      maxSafeCashLimit: db.financials.shift.maxSafeCashLimit,
      cashPolicyViolated: netCashInSafe > db.financials.shift.maxSafeCashLimit
    },
    lowStockCount
  });
});

// 3. ROOMS MANAGEMENT & CONFIGURATION
app.get('/api/rooms', (req, res) => {
  res.json(db.rooms);
});

// Update Room Details (Price, Beds, Type, Status, Notes)
app.put('/api/rooms/:id', (req, res) => {
  const roomId = req.params.id;
  const { floor, type, beds, price, status, notes } = req.body;

  const room = db.rooms.find(r => r.id === roomId);
  if (!room) {
    return res.status(404).json({ error: 'الغرفة غير موجودة' });
  }

  if (floor) room.floor = floor;
  if (type) room.type = type;
  if (beds) room.beds = beds;
  if (price !== undefined) room.price = Number(price);
  if (status) room.status = status;
  if (notes !== undefined) room.notes = notes;

  if (status && status !== 'occupied') {
    room.guest = null;
  }

  saveDB(db);
  res.json({ success: true, room });
});

// Patch Room Status Quick
app.patch('/api/rooms/:id/status', (req, res) => {
  const roomId = req.params.id;
  const { status, notes } = req.body;
  const room = db.rooms.find(r => r.id === roomId);

  if (!room) {
    return res.status(404).json({ error: 'الغرفة غير موجودة' });
  }

  if (status) room.status = status;
  if (notes !== undefined) room.notes = notes;

  if (status && status !== 'occupied') {
    room.guest = null;
  }

  saveDB(db);
  res.json({ success: true, room });
});

// 4. RESERVATIONS LEDGER
app.get('/api/reservations', (req, res) => {
  res.json(db.reservations);
});

app.post('/api/reservations', (req, res) => {
  const { guestName, nationalId, phone, roomId, checkin, checkout, dailyRate, paidAmount, paymentMethod, notes } = req.body;

  if (!guestName || !roomId || !checkin || !checkout) {
    return res.status(400).json({ error: 'رجاء إدخال كافة البيانات الأساسية (اسم النزيل، رقم الغرفة، وتواريخ الإقامة)' });
  }

  const room = db.rooms.find(r => r.id === roomId);
  if (!room) {
    return res.status(400).json({ error: 'الغرفة غير صالحة' });
  }

  const d1 = new Date(checkin);
  const d2 = new Date(checkout);
  const diffTime = Math.abs(d2 - d1);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  const rate = Number(dailyRate) || room.price;
  const totalAmount = nights * rate;
  const paid = Number(paidAmount) || 0;
  const balance = totalAmount - paid;

  const newResId = `RES-${Date.now().toString().slice(-4)}`;
  const newReservation = {
    id: newResId,
    guestName,
    nationalId: nationalId || '-',
    phone: phone || '-',
    roomId,
    checkin,
    checkout,
    status: 'checked_in',
    dailyRate: rate,
    nights,
    totalAmount,
    paidAmount: paid,
    balance,
    paymentMethod: paymentMethod || 'cash',
    notes: notes || ''
  };

  db.reservations.unshift(newReservation);

  room.status = 'occupied';
  room.guest = {
    name: guestName,
    phone,
    checkin,
    checkout,
    paid,
    total: totalAmount
  };

  if (paid > 0) {
    db.financials.transactions.unshift({
      id: `TXN-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      type: 'revenue',
      method: paymentMethod || 'cash',
      amount: paid,
      category: 'تسكين غرف',
      description: `دفعة تسكين غرفة ${roomId} - النزيل ${guestName}`,
      ref: newResId
    });
  }

  saveDB(db);
  res.json({ success: true, reservation: newReservation });
});

app.post('/api/reservations/:id/checkout', (req, res) => {
  const resId = req.params.id;
  const { additionalCharges, settlementPayment, paymentMethod } = req.body;

  const reservation = db.reservations.find(r => r.id === resId);
  if (!reservation) {
    return res.status(404).json({ error: 'الحجز غير موجود' });
  }

  const extras = Number(additionalCharges) || 0;
  const extraPay = Number(settlementPayment) || 0;

  reservation.totalAmount += extras;
  reservation.paidAmount += extraPay;
  reservation.balance = reservation.totalAmount - reservation.paidAmount;
  reservation.status = 'checked_out';

  const room = db.rooms.find(r => r.id === reservation.roomId);
  if (room) {
    room.status = 'cleaning';
    room.guest = null;
    room.notes = 'حاجة إلى تنظيف وتجهيز بعد مغادرة النزيل';
  }

  if (extraPay > 0) {
    db.financials.transactions.unshift({
      id: `TXN-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      type: 'revenue',
      method: paymentMethod || 'cash',
      amount: extraPay,
      category: 'تصفية مغادرة',
      description: `تصفية حساب مغادرة غرفة ${reservation.roomId} - ${reservation.guestName}`,
      ref: resId
    });
  }

  saveDB(db);
  res.json({ success: true, reservation, room });
});

// 5. FINANCIALS & SHIFT CLEARANCE
app.get('/api/financials', (req, res) => {
  const txns = db.financials.transactions;
  const cashRev = txns.filter(t => t.type === 'revenue' && t.method === 'cash').reduce((s, t) => s + t.amount, 0);
  const visaRev = txns.filter(t => t.type === 'revenue' && t.method === 'visa').reduce((s, t) => s + t.amount, 0);
  const expenses = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const expectedCashInSafe = db.financials.shift.openingBalance + cashRev - expenses;

  res.json({
    shift: db.financials.shift,
    summary: {
      openingBalance: db.financials.shift.openingBalance,
      cashRev,
      visaRev,
      expenses,
      expectedCashInSafe,
      totalRevenue: cashRev + visaRev,
      policyExceeded: expectedCashInSafe > db.financials.shift.maxSafeCashLimit,
      maxSafeCashLimit: db.financials.shift.maxSafeCashLimit
    },
    transactions: txns
  });
});

app.post('/api/financials/transaction', (req, res) => {
  const { type, method, amount, category, description } = req.body;

  if (!amount || amount <= 0 || !category) {
    return res.status(400).json({ error: 'رجاء إدخال المبلغ والتصنيف بصورة صحيحة' });
  }

  const newTxn = {
    id: `TXN-${Date.now().toString().slice(-4)}`,
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    type: type || 'revenue',
    method: method || 'cash',
    amount: Number(amount),
    category,
    description: description || '',
    ref: `MANUAL-${Date.now().toString().slice(-4)}`
  };

  db.financials.transactions.unshift(newTxn);
  saveDB(db);
  res.json({ success: true, transaction: newTxn });
});

app.post('/api/financials/shift-close', (req, res) => {
  const { cashierName, physicalCashCounted, handoverNotes } = req.body;

  const txns = db.financials.transactions;
  const cashRev = txns.filter(t => t.type === 'revenue' && t.method === 'cash').reduce((s, t) => s + t.amount, 0);
  const expenses = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const expectedCash = db.financials.shift.openingBalance + cashRev - expenses;

  const counted = Number(physicalCashCounted) || 0;
  const disparity = counted - expectedCash;

  const shiftReport = {
    closedAt: new Date().toLocaleString('ar-EG'),
    cashierName: cashierName || db.financials.shift.cashier,
    openingBalance: db.financials.shift.openingBalance,
    totalCashRev: cashRev,
    totalExpenses: expenses,
    expectedCashInSafe: expectedCash,
    physicalCashCounted: counted,
    disparityAmount: disparity,
    disparityStatus: disparity === 0 ? 'مطابقة تامّة 🟢' : (disparity > 0 ? `زيادة قدرها +${disparity} ج 🔵` : `عجز قدره ${disparity} ج 🔴`),
    handoverNotes: handoverNotes || ''
  };

  db.financials.shift = {
    id: `SHIFT-${Date.now().toString().slice(-4)}`,
    cashier: 'الوردية التالية',
    startTime: new Date().toLocaleString('ar-EG'),
    openingBalance: counted,
    maxSafeCashLimit: 15000,
    cashPolicyStatus: 'جاهز للاستلام'
  };

  saveDB(db);
  res.json({ success: true, report: shiftReport });
});

// 6. HR & DAILY 5-CRITERIA EVALUATION FORM (30 STAFF)
app.get('/api/hr', (req, res) => {
  res.json(db.hr);
});

// Submit 5-Criteria Daily Evaluation & Recalculate Monthly KPI %
app.post('/api/hr/evaluations', (req, res) => {
  const { empId, scores, notes, status } = req.body;

  const emp = db.hr.find(e => e.id === empId);
  if (!emp) {
    return res.status(404).json({ error: 'الموظف غير موجود' });
  }

  if (scores) {
    const attendance = Number(scores.attendance) || 5;
    const hygiene = Number(scores.hygiene) || 5;
    const uniform = Number(scores.uniform) || 5;
    const softSkills = Number(scores.softSkills) || 5;
    const execution = Number(scores.execution) || 5;

    emp.scores = { attendance, hygiene, uniform, softSkills, execution };
    
    // Calculate overall daily score (average of 5 criteria out of 5.0)
    const avg = (attendance + hygiene + uniform + softSkills + execution) / 5;
    emp.overallScore = parseFloat(avg.toFixed(2));
    
    // Monthly Percentage = (overallScore / 5.0) * 100
    emp.monthlyPercentage = parseFloat(((emp.overallScore / 5) * 100).toFixed(1));
  }

  if (notes !== undefined) emp.notes = notes;
  if (status !== undefined) emp.status = status;

  saveDB(db);
  res.json({ success: true, employee: emp });
});

// 7. INVENTORY MANAGEMENT
app.get('/api/inventory', (req, res) => {
  db.inventory.forEach(item => {
    const ratio = item.currentStock / item.parLevel;
    if (ratio <= 0.5) item.status = 'critical';
    else if (ratio < 1.0) item.status = 'warning';
    else item.status = 'ok';
  });
  res.json(db.inventory);
});

app.post('/api/inventory/update', (req, res) => {
  const { itemId, delta, action } = req.body;

  const item = db.inventory.find(i => i.id === itemId);
  if (!item) {
    return res.status(404).json({ error: 'الصنف غير موجود بالمخزن' });
  }

  const change = Number(delta) || 0;
  if (action === 'add') {
    item.currentStock += change;
  } else if (action === 'consume') {
    item.currentStock = Math.max(0, item.currentStock - change);
  }

  const ratio = item.currentStock / item.parLevel;
  if (ratio <= 0.5) item.status = 'critical';
  else if (ratio < 1.0) item.status = 'warning';
  else item.status = 'ok';

  saveDB(db);
  res.json({ success: true, item });
});

// Fallback route to serve index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏨 HENU Hotel Pyramids PMS Web App Server Started!`);
  console.log(`🌐 Server Running on: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
