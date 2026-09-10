const https = require('https');

// Initialize Firebase via compat or direct REST to Firestore
const projectId = "henu-pyramids-hotel";

const staff = [
  {
    name: "مدير الفندق (الرئيسي)",
    email: "henuphotel@gmail.com",
    password: "123456",
    role: "مدير الفندق",
    createdAt: "2026-09-01"
  },
  {
    name: "موظف وردية صباحية (Morning)",
    email: "morning@henuhotel.com",
    password: "123456",
    role: "موظف استقبال",
    createdAt: "2026-09-01"
  },
  {
    name: "موظف وردية مسائية (Afternoon)",
    email: "afternoon@henuhotel.com",
    password: "123456",
    role: "موظف استقبال",
    createdAt: "2026-09-01"
  },
  {
    name: "مسؤول وردية ليلية (Night Auditor)",
    email: "night@henuhotel.com",
    password: "123456",
    role: "مسؤول الاستقبال",
    createdAt: "2026-09-01"
  },
  {
    name: "محاسب الفندق (Accountant)",
    email: "accountant@henuhotel.com",
    password: "123456",
    role: "محاسب",
    createdAt: "2026-09-01"
  },
  {
    name: "موظف 1 (Employee 1)",
    email: "employee1@henuhotel.com",
    password: "123456",
    role: "موظف استقبال",
    createdAt: "2026-09-01"
  },
  {
    name: "موظف 2 (Employee 2)",
    email: "employee2@henuhotel.com",
    password: "123456",
    role: "موظف استقبال",
    createdAt: "2026-09-01"
  },
  {
    name: "موظف 3 (Employee 3)",
    email: "employee3@henuhotel.com",
    password: "123456",
    role: "إشراف داخلي",
    createdAt: "2026-09-01"
  },
  {
    name: "موظف 4 (Employee 4)",
    email: "employee4@henuhotel.com",
    password: "123456",
    role: "إشراف داخلي",
    createdAt: "2026-09-01"
  },
  {
    name: "موظف 5 (Employee 5)",
    email: "employee5@henuhotel.com",
    password: "123456",
    role: "موظف",
    createdAt: "2026-09-01"
  }
];

console.log('Total staff prepared for Firestore:', staff.length);
