/**
 * UNIFIED HOTEL MANAGEMENT SYSTEM (25 ROOMS)
 * Hotel Henu - Firebase Realtime Engine & Application State
 */

// Master 25 Rooms Layout
const MASTER_25_ROOMS = [
  // Floor 1 (4 Rooms)
  { roomNumber: "101", floor: 1, floorName: "الدور الأول", type: "دابل شباك", category: "دابل", defaultPrice: 750, status: "available", currentGuest: "" },
  { roomNumber: "102", floor: 1, floorName: "الدور الأول", type: "سرير كينج", category: "كينج", defaultPrice: 900, status: "available", currentGuest: "" },
  { roomNumber: "103", floor: 1, floorName: "الدور الأول", type: "سويت", category: "سويت", defaultPrice: 1500, status: "available", currentGuest: "" },
  { roomNumber: "104", floor: 1, floorName: "الدور الأول", type: "كينج شباك", category: "كينج", defaultPrice: 900, status: "available", currentGuest: "" },
  // Floor 2 (7 Rooms)
  { roomNumber: "201", floor: 2, floorName: "الدور الثاني", type: "سنجل بلكونة", category: "سنجل", defaultPrice: 600, status: "available", currentGuest: "" },
  { roomNumber: "202", floor: 2, floorName: "الدور الثاني", type: "دابل بلكونة", category: "دابل", defaultPrice: 850, status: "available", currentGuest: "" },
  { roomNumber: "203", floor: 2, floorName: "الدور الثاني", type: "دابل", category: "دابل", defaultPrice: 750, status: "available", currentGuest: "" },
  { roomNumber: "204", floor: 2, floorName: "الدور الثاني", type: "سرير كينج", category: "كينج", defaultPrice: 900, status: "available", currentGuest: "" },
  { roomNumber: "205", floor: 2, floorName: "الدور الثاني", type: "دابل", category: "دابل", defaultPrice: 750, status: "available", currentGuest: "" },
  { roomNumber: "206", floor: 2, floorName: "الدور الثاني", type: "ترابل شباك جانبي", category: "ترابل", defaultPrice: 1100, status: "available", currentGuest: "" },
  { roomNumber: "207", floor: 2, floorName: "الدور الثاني", type: "دابل شباك جانبي", category: "دابل", defaultPrice: 750, status: "available", currentGuest: "" },
  // Floor 3 (7 Rooms)
  { roomNumber: "301", floor: 3, floorName: "الدور الثالث", type: "سنجل بلكونة", category: "سنجل", defaultPrice: 600, status: "available", currentGuest: "" },
  { roomNumber: "302", floor: 3, floorName: "الدور الثالث", type: "دابل بلكونة", category: "دابل", defaultPrice: 850, status: "available", currentGuest: "" },
  { roomNumber: "303", floor: 3, floorName: "الدور الثالث", type: "سرير كينج", category: "كينج", defaultPrice: 900, status: "available", currentGuest: "" },
  { roomNumber: "304", floor: 3, floorName: "الدور الثالث", type: "سرير كينج", category: "كينج", defaultPrice: 900, status: "available", currentGuest: "" },
  { roomNumber: "305", floor: 3, floorName: "الدور الثالث", type: "سرير كينج", category: "كينج", defaultPrice: 900, status: "available", currentGuest: "" },
  { roomNumber: "306", floor: 3, floorName: "الدور الثالث", type: "كينج بلكونة جانبي", category: "كينج", defaultPrice: 950, status: "available", currentGuest: "" },
  { roomNumber: "307", floor: 3, floorName: "الدور الثالث", type: "دبل شباك جانبي", category: "دابل", defaultPrice: 750, status: "available", currentGuest: "" },
  // Floor 4 (7 Rooms)
  { roomNumber: "401", floor: 4, floorName: "الدور الرابع", type: "سنجل بلكونة", category: "سنجل", defaultPrice: 600, status: "available", currentGuest: "" },
  { roomNumber: "402", floor: 4, floorName: "الدور الرابع", type: "دابل بلكونة", category: "دابل", defaultPrice: 850, status: "available", currentGuest: "" },
  { roomNumber: "403", floor: 4, floorName: "الدور الرابع", type: "سرير كينج", category: "كينج", defaultPrice: 900, status: "available", currentGuest: "" },
  { roomNumber: "404", floor: 4, floorName: "الدور الرابع", type: "سرير كينج", category: "كينج", defaultPrice: 900, status: "available", currentGuest: "" },
  { roomNumber: "405", floor: 4, floorName: "الدور الرابع", type: "دابل", category: "دابل", defaultPrice: 750, status: "available", currentGuest: "" },
  { roomNumber: "406", floor: 4, floorName: "الدور الرابع", type: "ترابل شباك جانبي", category: "ترابل", defaultPrice: 1100, status: "available", currentGuest: "" },
  { roomNumber: "407", floor: 4, floorName: "الدور الرابع", type: "دابل شباك جانبي", category: "دابل", defaultPrice: 750, status: "available", currentGuest: "" }
];

// Master 10 Staff Accounts
const MASTER_10_STAFF = [
  { name: "مدير الفندق (الرئيسي)", email: "henuphotel@gmail.com", password: "123456", role: "مدير الفندق", createdAt: "2026-09-01" },
  { name: "موظف وردية صباحية (Morning)", email: "morning@henuhotel.com", password: "123456", role: "موظف استقبال", createdAt: "2026-09-01" },
  { name: "موظف وردية مسائية (Afternoon)", email: "afternoon@henuhotel.com", password: "123456", role: "موظف استقبال", createdAt: "2026-09-01" },
  { name: "مسؤول وردية ليلية (Night Auditor)", email: "night@henuhotel.com", password: "123456", role: "مسؤول الاستقبال", createdAt: "2026-09-01" },
  { name: "محاسب الفندق (Accountant)", email: "accountant@henuhotel.com", password: "123456", role: "محاسب", createdAt: "2026-09-01" },
  { name: "موظف 1 (Employee 1)", email: "employee1@henuhotel.com", password: "123456", role: "موظف استقبال", createdAt: "2026-09-01" },
  { name: "موظف 2 (Employee 2)", email: "employee2@henuhotel.com", password: "123456", role: "موظف استقبال", createdAt: "2026-09-01" },
  { name: "موظف 3 (Employee 3)", email: "employee3@henuhotel.com", password: "123456", role: "إشراف داخلي", createdAt: "2026-09-01" },
  { name: "موظف 4 (Employee 4)", email: "employee4@henuhotel.com", password: "123456", role: "إشراف داخلي", createdAt: "2026-09-01" },
  { name: "موظف 5 (Employee 5)", email: "employee5@henuhotel.com", password: "123456", role: "موظف", createdAt: "2026-09-01" }
];
