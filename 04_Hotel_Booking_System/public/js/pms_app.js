/* ==========================================================================
   HENU Hotel Pyramids PMS - Property Management System JavaScript Application
   RTL First - Full API integration, Auth RBAC, Room Configuration, 5-Criteria KPIs
   ========================================================================== */

'use strict';

// Smart API Base Resolver: works both on http://localhost:3000 and direct file:// opening
const API_BASE = (window.location.protocol === 'file:') ? 'http://localhost:3000' : '';

// Application State
let appState = {
  currentUser: null,
  rooms: [],
  reservations: [],
  financials: { shift: {}, summary: {}, transactions: [] },
  hr: [],
  inventory: [],
  currentRackFilter: 'all',
  activeView: 'rackView'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initApp();
});

// Check Authentication Session
function checkAuth() {
  const userJson = localStorage.getItem('henu_pms_user');
  if (!userJson) {
    window.location.href = 'login.html';
    return;
  }
  try {
    appState.currentUser = JSON.parse(userJson);
    renderUserInfo();
    applyRBACPermissions();
  } catch (e) {
    localStorage.removeItem('henu_pms_user');
    window.location.href = 'login.html';
  }
}

// Render User Info Widget
function renderUserInfo() {
  const u = appState.currentUser;
  if (!u) return;

  const roleBadge = document.getElementById('userRoleBadge');
  const nameText = document.getElementById('userNameText');

  if (roleBadge) roleBadge.innerText = u.roleLabel || u.role;
  if (nameText) nameText.innerText = u.name;
}

// Apply Role-Based Access Control (RBAC) UI Permissions
function applyRBACPermissions() {
  const u = appState.currentUser;
  if (!u) return;

  const role = u.role;

  // Show/Hide sidebar items according to Role
  const navRoomsConfig = document.querySelector('.nav-item[data-view="roomsConfigView"]');
  const navFinancials = document.querySelector('.nav-item[data-view="financialsView"]');
  const navHR = document.querySelector('.nav-item[data-view="hrView"]');

  if (role === 'housekeeping') {
    if (navFinancials) navFinancials.style.display = 'none';
    if (navRoomsConfig) navRoomsConfig.style.display = 'none';
  } else if (role === 'receptionist') {
    if (navRoomsConfig) navRoomsConfig.style.display = 'none';
  } else {
    // Admin sees all 6 tabs
    if (navRoomsConfig) navRoomsConfig.style.display = 'flex';
    if (navFinancials) navFinancials.style.display = 'flex';
    if (navHR) navHR.style.display = 'flex';
  }
}

function handleLogout() {
  localStorage.removeItem('henu_pms_user');
  window.location.href = 'login.html';
}

async function initApp() {
  await refreshAllData();
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const checkinInput = document.getElementById('resCheckin');
  const checkoutInput = document.getElementById('resCheckout');
  if (checkinInput) checkinInput.value = today;
  if (checkoutInput) checkoutInput.value = tomorrow;
}

async function refreshAllData() {
  await Promise.all([
    fetchStatus(),
    fetchRooms(),
    fetchReservations(),
    fetchFinancials(),
    fetchHR(),
    fetchInventory()
  ]);
}

function switchView(viewId) {
  appState.activeView = viewId;
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

  const activeSec = document.getElementById(viewId);
  const activeNav = document.querySelector(`.nav-item[data-view="${viewId}"]`);

  if (activeSec) activeSec.classList.add('active');
  if (activeNav) activeNav.classList.add('active');

  if (viewId === 'roomsConfigView') renderRoomsConfigTable();
}

// ==========================================================================
// 1. STATUS & KPIS
// ==========================================================================
async function fetchStatus() {
  try {
    const res = await fetch(API_BASE + '/api/status');
    const data = await res.json();

    document.getElementById('kpiOccupancyRate').innerText = `${data.occupancyRate}%`;
    document.getElementById('kpiOccupiedRooms').innerText = data.occupied;
    document.getElementById('kpiCleanRooms').innerText = data.clean;
    document.getElementById('kpiTodayRevenue').innerText = `${data.financials.totalRevenueToday.toLocaleString()} ج.م`;
    document.getElementById('kpiInventoryAlerts').innerText = data.lowStockCount;

    const inventoryAlertBadge = document.getElementById('inventoryAlertBadge');
    if (inventoryAlertBadge) {
      inventoryAlertBadge.innerText = data.lowStockCount;
      inventoryAlertBadge.style.display = data.lowStockCount > 0 ? 'inline-block' : 'none';
    }
  } catch (err) {
    console.error('Error fetching status:', err);
  }
}

// ==========================================================================
// 2. ROOM STATUS RACK (25 ROOMS ACROSS 4 FLOORS)
// ==========================================================================
async function fetchRooms() {
  try {
    const res = await fetch(API_BASE + '/api/rooms');
    appState.rooms = await res.json();
    renderRack();
    renderRoomsConfigTable();
    populateRoomSelectOptions();
  } catch (err) {
    console.error('Error fetching rooms:', err);
  }
}

function filterRack(filterType, btnElement) {
  appState.currentRackFilter = filterType;
  document.querySelectorAll('.filter-bar .filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderRack();
}

function renderRack() {
  const container = document.getElementById('rackFloorsContainer');
  if (!container) return;

  container.innerHTML = '';

  let filteredRooms = appState.rooms;
  if (appState.currentRackFilter !== 'all') {
    filteredRooms = appState.rooms.filter(r => r.status === appState.currentRackFilter);
  }

  const floorsMap = {};
  filteredRooms.forEach(room => {
    if (!floorsMap[room.floor]) {
      floorsMap[room.floor] = [];
    }
    floorsMap[room.floor].push(room);
  });

  const floorKeys = Object.keys(floorsMap);
  if (floorKeys.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem; color:var(--text-muted);">
        لا توجد غرف تطابق التصفية المحددة
      </div>
    `;
    return;
  }

  floorKeys.forEach(floorName => {
    const floorSection = document.createElement('div');
    floorSection.className = 'floor-section';

    const floorRooms = floorsMap[floorName];
    
    let roomsHtml = floorRooms.map(room => {
      let statusClass = room.status;
      let statusLabel = '';
      if (room.status === 'clean') statusLabel = '🟢 شاغرة جاهزة';
      else if (room.status === 'occupied') statusLabel = '🔴 مشغولة';
      else if (room.status === 'cleaning') statusLabel = '🟡 تحت التنظيف';
      else if (room.status === 'preparing') statusLabel = '🔵 تحت التجهيز';
      else if (room.status === 'maintenance') statusLabel = '🟠 صيانة وأعطال';

      let guestBox = '';
      if (room.status === 'occupied' && room.guest) {
        guestBox = `
          <div class="guest-info">
            <div class="guest-name">👤 ${room.guest.name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">📞 ${room.guest.phone || ''}</div>
            <div style="font-size:0.75rem; color:#991b1b; font-weight:600; margin-top:2px;">📅 مغادرة: ${room.guest.checkout}</div>
          </div>
        `;
      }

      let actionButtons = '';
      if (room.status === 'clean') {
        actionButtons = `
          <button class="btn btn-gold btn-sm btn-full" onclick="openNewReservationModal('${room.id}')">
            ➕ تسكين سريع
          </button>
        `;
      } else if (room.status === 'occupied') {
        const res = appState.reservations.find(r => r.roomId === room.id && r.status === 'checked_in');
        const resId = res ? res.id : '';
        actionButtons = `
          <button class="btn btn-success btn-sm" onclick="openCheckoutModal('${resId}')">
            🧾 تصفية
          </button>
          <button class="btn btn-outline btn-sm" onclick="openRoomConfigModal('${room.id}')">
            ⚙️ إعدادات
          </button>
        `;
      } else if (room.status === 'cleaning') {
        actionButtons = `
          <button class="btn btn-success btn-sm btn-full" onclick="quickUpdateRoomStatus('${room.id}', 'clean', 'تم تنظيف وتجهيز الغرفة بنجاح')">
            ✨ تم النظافة والجاهزية
          </button>
        `;
      } else if (room.status === 'preparing') {
        actionButtons = `
          <button class="btn btn-success btn-sm btn-full" onclick="quickUpdateRoomStatus('${room.id}', 'clean', 'جاهزة للتسكين الفوري')">
            🟢 إكمال التجهيز
          </button>
        `;
      } else if (room.status === 'maintenance') {
        actionButtons = `
          <button class="btn btn-primary btn-sm btn-full" onclick="quickUpdateRoomStatus('${room.id}', 'cleaning', 'تم إنهاء الصيانة، تحويل للنظافة')">
            🔧 تم إصلاح العطل
          </button>
        `;
      }

      return `
        <div class="room-card ${statusClass}">
          <div>
            <div class="room-header">
              <span class="room-number">غرفة ${room.id}</span>
              <span class="status-badge ${statusClass}">${statusLabel}</span>
            </div>
            <div class="room-details">
              <strong>${room.type}</strong> • ${room.beds}<br>
              <span style="color:var(--accent-gold); font-weight:700;">${room.price.toLocaleString()} ج.م / ليلة</span>
            </div>
            ${guestBox}
            ${room.notes ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px; font-style:italic;">📝 ${room.notes}</div>` : ''}
          </div>
          <div class="room-actions">
            ${actionButtons}
          </div>
        </div>
      `;
    }).join('');

    floorSection.innerHTML = `
      <div class="floor-title">
        <span>🏢 ${floorName}</span>
        <span style="font-size:0.85rem; font-weight:normal; color:var(--text-muted);">(${floorRooms.length} غرف)</span>
      </div>
      <div class="rooms-grid">
        ${roomsHtml}
      </div>
    `;

    container.appendChild(floorSection);
  });
}

async function quickUpdateRoomStatus(roomId, newStatus, defaultNotes) {
  try {
    const res = await fetch(`/api/rooms/${roomId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, notes: defaultNotes })
    });
    if (res.ok) {
      showToast(`تم تحديث حالة الغرفة ${roomId} بنجاح ✨`);
      await refreshAllData();
    }
  } catch (err) {
    showToast('حدث خطأ أثناء تحديث الحالة', 'error');
  }
}

// ==========================================================================
// 3. ROOMS MANAGEMENT & CONFIGURATION TABLE (ADMIN FEATURE)
// ==========================================================================
function renderRoomsConfigTable() {
  const tbody = document.getElementById('roomsConfigTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.rooms.map(room => {
    let statusLabel = '';
    if (room.status === 'clean') statusLabel = '<span class="status-badge clean">🟢 شاغرة جاهزة</span>';
    else if (room.status === 'occupied') statusLabel = '<span class="status-badge occupied">🔴 مشغولة</span>';
    else if (room.status === 'cleaning') statusLabel = '<span class="status-badge cleaning">🟡 تحت التنظيف</span>';
    else if (room.status === 'preparing') statusLabel = '<span class="status-badge preparing">🔵 تحت التجهيز</span>';
    else if (room.status === 'maintenance') statusLabel = '<span class="status-badge maintenance">🟠 صيانة وأعطال</span>';

    return `
      <tr>
        <td><strong style="font-size:1.1rem; color:var(--primary-navy);">غرفة ${room.id}</strong></td>
        <td>${room.floor}</td>
        <td><strong>${room.type}</strong></td>
        <td>${room.beds}</td>
        <td><strong style="color:var(--accent-gold);">${room.price.toLocaleString()} ج.م</strong></td>
        <td>${statusLabel}</td>
        <td>${room.notes || '-'}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="openRoomConfigModal('${room.id}')">
            ✏️ تعديل البيانات
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openRoomConfigModal(roomId) {
  const room = appState.rooms.find(r => r.id === roomId);
  if (!room) return;

  document.getElementById('cfgRoomId').value = room.id;
  document.getElementById('cfgModalRoomNum').innerText = room.id;
  document.getElementById('cfgFloor').value = room.floor;
  document.getElementById('cfgType').value = room.type;
  document.getElementById('cfgBeds').value = room.beds;
  document.getElementById('cfgPrice').value = room.price;
  document.getElementById('cfgStatus').value = room.status;
  document.getElementById('cfgNotes').value = room.notes || '';

  openModal('roomConfigModal');
}

async function handleRoomConfigSubmit(e) {
  e.preventDefault();
  const roomId = document.getElementById('cfgRoomId').value;
  const payload = {
    floor: document.getElementById('cfgFloor').value,
    type: document.getElementById('cfgType').value,
    beds: document.getElementById('cfgBeds').value,
    price: Number(document.getElementById('cfgPrice').value),
    status: document.getElementById('cfgStatus').value,
    notes: document.getElementById('cfgNotes').value
  };

  try {
    const res = await fetch(`/api/rooms/${roomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast(`تم حفظ وتحديث إعدادات الغرفة ${roomId} بنجاح 💾`);
      closeModal('roomConfigModal');
      await refreshAllData();
    }
  } catch (err) {
    showToast('حدث خطأ أثناء تعديل الغرفة', 'error');
  }
}

function populateRoomSelectOptions() {
  const select = document.getElementById('resRoomId');
  if (!select) return;

  select.innerHTML = '<option value="">-- اختر الغرفة --</option>';

  appState.rooms.forEach(room => {
    const isClean = room.status === 'clean';
    const label = `غرفة ${room.id} (${room.floor}) - ${room.type} - ${room.price} ج.م [${isClean ? 'جاهزة 🟢' : room.status}]`;
    const option = document.createElement('option');
    option.value = room.id;
    option.innerText = label;
    option.disabled = !isClean;
    select.appendChild(option);
  });
}

function updateResPriceHint() {
  const roomId = document.getElementById('resRoomId').value;
  const room = appState.rooms.find(r => r.id === roomId);
  if (room) {
    document.getElementById('resDailyRate').value = room.price;
  }
}

// ==========================================================================
// 4. RESERVATIONS LEDGER
// ==========================================================================
async function fetchReservations() {
  try {
    const res = await fetch(API_BASE + '/api/reservations');
    appState.reservations = await res.json();
    renderReservationsTable();
  } catch (err) {
    console.error('Error fetching reservations:', err);
  }
}

function renderReservationsTable() {
  const tbody = document.getElementById('reservationsTableBody');
  if (!tbody) return;

  if (appState.reservations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;">لا توجد حجوزات مسجلة</td></tr>`;
    return;
  }

  tbody.innerHTML = appState.reservations.map(r => {
    let statusBadge = '';
    if (r.status === 'checked_in') statusBadge = '<span class="status-badge occupied">تسكين نشط 🔴</span>';
    else if (r.status === 'checked_out') statusBadge = '<span class="status-badge clean">تم المغادرة 🟢</span>';
    else statusBadge = '<span class="status-badge cleaning">حجز مؤكد 🟡</span>';

    return `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td><strong>${r.guestName}</strong><br><small style="color:var(--text-muted);">${r.phone}</small></td>
        <td><strong style="color:var(--primary-navy);">غرفة ${r.roomId}</strong></td>
        <td>${r.checkin}</td>
        <td>${r.checkout}</td>
        <td>${r.dailyRate.toLocaleString()} ج</td>
        <td><strong>${r.totalAmount.toLocaleString()} ج</strong></td>
        <td style="color:#059669;">${r.paidAmount.toLocaleString()} ج</td>
        <td style="color:${r.balance > 0 ? '#dc2626' : '#059669'}; font-weight:700;">${r.balance.toLocaleString()} ج</td>
        <td>${statusBadge}</td>
        <td>
          ${r.status === 'checked_in' ? `
            <button class="btn btn-success btn-sm" onclick="openCheckoutModal('${r.id}')">
              🧾 تسوية ومغادرة
            </button>
          ` : `
            <span style="font-size:0.8rem; color:var(--text-muted);">مكتمل</span>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

function openNewReservationModal(roomId) {
  if (roomId) {
    document.getElementById('resRoomId').value = roomId;
    updateResPriceHint();
  }
  openModal('reservationModal');
}

async function handleReservationSubmit(e) {
  e.preventDefault();

  const payload = {
    guestName: document.getElementById('resGuestName').value,
    nationalId: document.getElementById('resNationalId').value,
    phone: document.getElementById('resPhone').value,
    roomId: document.getElementById('resRoomId').value,
    checkin: document.getElementById('resCheckin').value,
    checkout: document.getElementById('resCheckout').value,
    dailyRate: document.getElementById('resDailyRate').value,
    paidAmount: document.getElementById('resPaidAmount').value,
    paymentMethod: document.getElementById('resPaymentMethod').value,
    notes: document.getElementById('resNotes').value
  };

  try {
    const res = await fetch(API_BASE + '/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (res.ok) {
      showToast(`تم تسكين النزيل ${payload.guestName} بنجاح! 🚀`);
      closeModal('reservationModal');
      document.getElementById('reservationForm').reset();
      await refreshAllData();
    } else {
      showToast(result.error || 'حدث خطأ أثناء التسكين', 'error');
    }
  } catch (err) {
    showToast('عفواً، فشل الاتصال بالسيرفر', 'error');
  }
}

function openCheckoutModal(resId) {
  const reservation = appState.reservations.find(r => r.id === resId);
  if (!reservation) {
    showToast('لم يتم العثور على الحجز النشط', 'error');
    return;
  }

  document.getElementById('checkoutResId').value = resId;
  
  const summaryBox = document.getElementById('checkoutSummaryBox');
  summaryBox.innerHTML = `
    <div><strong>النزيل:</strong> ${reservation.guestName}</div>
    <div><strong>الغرفة:</strong> ${reservation.roomId} | <strong>عدد الليالي:</strong> ${reservation.nights} ليلة</div>
    <div><strong>إجمالي تكلفة الإقامة:</strong> ${reservation.totalAmount.toLocaleString()} ج.م</div>
    <div><strong>المبلغ المدفوع سابقاً:</strong> ${reservation.paidAmount.toLocaleString()} ج.م</div>
    <div style="font-size:1.1rem; color:#dc2626; font-weight:700; margin-top:6px;" id="checkoutBalanceText">
      المتبقي الحالي للتصفية: ${reservation.balance.toLocaleString()} ج.م
    </div>
  `;

  document.getElementById('checkoutPayment').value = reservation.balance;
  document.getElementById('checkoutExtras').value = 0;

  openModal('checkoutModal');
}

function recalcCheckoutBalance() {
  const resId = document.getElementById('checkoutResId').value;
  const reservation = appState.reservations.find(r => r.id === resId);
  if (!reservation) return;

  const extras = Number(document.getElementById('checkoutExtras').value) || 0;
  const newTotal = reservation.totalAmount + extras;
  const newBalance = newTotal - reservation.paidAmount;

  document.getElementById('checkoutBalanceText').innerText = `المتبقي الحالي للتصفية: ${newBalance.toLocaleString()} ج.م`;
  document.getElementById('checkoutPayment').value = newBalance;
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  const resId = document.getElementById('checkoutResId').value;
  const additionalCharges = document.getElementById('checkoutExtras').value;
  const settlementPayment = document.getElementById('checkoutPayment').value;
  const paymentMethod = document.getElementById('checkoutMethod').value;

  try {
    const res = await fetch(`/api/reservations/${resId}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ additionalCharges, settlementPayment, paymentMethod })
    });
    if (res.ok) {
      showToast('تمت تصفية الحساب وإتمام مغادرة النزيل وتحرير الغرفة 🟢');
      closeModal('checkoutModal');
      await refreshAllData();
    }
  } catch (err) {
    showToast('حدث خطأ أثناء المغادرة', 'error');
  }
}

// ==========================================================================
// 5. FINANCIALS & SHIFT CLEARANCE
// ==========================================================================
async function fetchFinancials() {
  try {
    const res = await fetch(API_BASE + '/api/financials');
    appState.financials = await res.json();
    renderFinancialsView();
  } catch (err) {
    console.error('Error fetching financials:', err);
  }
}

function renderFinancialsView() {
  const { summary, transactions } = appState.financials;

  const safeCashDisplay = document.getElementById('safeCashDisplay');
  if (safeCashDisplay) {
    safeCashDisplay.innerText = `${summary.expectedCashInSafe.toLocaleString()} ج.م`;
    if (summary.policyExceeded) {
      safeCashDisplay.style.color = '#dc2626';
    } else {
      safeCashDisplay.style.color = '#1e40af';
    }
  }

  const tbody = document.getElementById('financialsTableBody');
  if (!tbody) return;

  tbody.innerHTML = transactions.map(t => {
    const isRev = t.type === 'revenue';
    return `
      <tr>
        <td><strong>${t.id}</strong></td>
        <td>${t.time}</td>
        <td>
          <span class="status-badge ${isRev ? 'clean' : 'occupied'}">
            ${isRev ? 'إيراد (+)' : 'مصروف (-)'}
          </span>
        </td>
        <td>${t.method === 'cash' ? '💵 كاش' : '💳 فيزا (POS)'}</td>
        <td><strong style="color:${isRev ? '#059669' : '#dc2626'}">${isRev ? '+' : '-'}${t.amount.toLocaleString()} ج</strong></td>
        <td>${t.category}</td>
        <td>${t.description}</td>
      </tr>
    `;
  }).join('');
}

function openShiftCloseModal() {
  const { summary, shift } = appState.financials;
  const box = document.getElementById('shiftAuditSummary');
  box.innerHTML = `
    <div><strong>أمـين الخـزينـة الحالي:</strong> ${shift.cashier}</div>
    <div><strong>رصـيد بداية الورديـة:</strong> ${summary.openingBalance.toLocaleString()} ج.م</div>
    <div><strong>إجمالي المقبوضات كاش:</strong> ${summary.cashRev.toLocaleString()} ج.م | <strong>فيزا:</strong> ${summary.visaRev.toLocaleString()} ج.م</div>
    <div><strong>إجمالي المصروفات النثرية:</strong> ${summary.expenses.toLocaleString()} ج.م</div>
    <div style="font-size:1.1rem; color:var(--primary-navy); font-weight:800; margin-top:6px;">
      المفروض تواجده بالخزينة (النقدية المتوقعة): ${summary.expectedCashInSafe.toLocaleString()} ج.م
    </div>
  `;
  document.getElementById('shiftPhysicalCash').value = summary.expectedCashInSafe;
  openModal('shiftCloseModal');
}

async function handleShiftCloseSubmit(e) {
  e.preventDefault();
  const cashierName = document.getElementById('shiftCashierName').value;
  const physicalCashCounted = document.getElementById('shiftPhysicalCash').value;
  const handoverNotes = document.getElementById('shiftNotes').value;

  try {
    const res = await fetch(API_BASE + '/api/financials/shift-close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cashierName, physicalCashCounted, handoverNotes })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(`تم تقفيل الوردية بنجاح! النتيجة: ${data.report.disparityStatus} 🔒`);
      closeModal('shiftCloseModal');
      await refreshAllData();
    }
  } catch (err) {
    showToast('خطأ أثناء تقفيل الوردية', 'error');
  }
}

function openAddTransactionModal() {
  openModal('addTransactionModal');
}

async function handleAddTxnSubmit(e) {
  e.preventDefault();
  const type = document.getElementById('txnType').value;
  const method = document.getElementById('txnMethod').value;
  const amount = document.getElementById('txnAmount').value;
  const category = document.getElementById('txnCategory').value;
  const description = document.getElementById('txnDesc').value;

  try {
    const res = await fetch(API_BASE + '/api/financials/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, method, amount, category, description })
    });
    if (res.ok) {
      showToast('تمت إضافة الحركة المالية بالخزينة 💾');
      closeModal('addTransactionModal');
      document.getElementById('txnForm').reset();
      await refreshAllData();
    }
  } catch (err) {
    showToast('خطأ أثناء إضافة الحركة', 'error');
  }
}

// ==========================================================================
// 6. HR & DAILY 5-CRITERIA KPIS (30 REAL STAFF MEMBERS)
// ==========================================================================
async function fetchHR() {
  try {
    const res = await fetch(API_BASE + '/api/hr');
    appState.hr = await res.json();
    renderHRTable();
  } catch (err) {
    console.error('Error fetching HR:', err);
  }
}

function renderHRTable() {
  const tbody = document.getElementById('hrTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.hr.map(emp => {
    const overall = emp.overallScore || 5.0;
    const pct = emp.monthlyPercentage || 100;
    let scoreColor = overall >= 4.7 ? '#059669' : (overall >= 4.0 ? '#d97706' : '#dc2626');

    return `
      <tr>
        <td><strong>${emp.id}</strong></td>
        <td><strong>${emp.name}</strong></td>
        <td><strong>${emp.dept}</strong><br><small style="color:var(--text-muted);">${emp.role}</small></td>
        <td>${emp.shift}</td>
        <td>${emp.dailySalary} ج / يوم</td>
        <td><strong style="color:${scoreColor}; font-size:1.1rem;">⭐ ${overall.toFixed(2)} / 5.0</strong></td>
        <td><strong style="color:var(--primary-navy);">${pct}%</strong></td>
        <td>${emp.notes || '-'}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="openHrEvalModal('${emp.id}')">
            📝 تقييم 5 عناصر
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openHrEvalModal(empId) {
  const emp = appState.hr.find(e => e.id === empId);
  if (!emp) return;

  document.getElementById('hrEmpId').value = emp.id;
  document.getElementById('hrEmpName').value = `${emp.name} (${emp.dept} - ${emp.role})`;
  
  const sc = emp.scores || { attendance: 5, hygiene: 5, uniform: 5, softSkills: 5, execution: 5 };
  document.getElementById('evalAttendance').value = sc.attendance;
  document.getElementById('evalHygiene').value = sc.hygiene;
  document.getElementById('evalUniform').value = sc.uniform;
  document.getElementById('evalSoftSkills').value = sc.softSkills;
  document.getElementById('evalExecution').value = sc.execution;

  document.getElementById('hrNotes').value = emp.notes || '';

  openModal('hrEvalModal');
}

async function handleHrEvalSubmit(e) {
  e.preventDefault();
  const empId = document.getElementById('hrEmpId').value;
  
  const scores = {
    attendance: document.getElementById('evalAttendance').value,
    hygiene: document.getElementById('evalHygiene').value,
    uniform: document.getElementById('evalUniform').value,
    softSkills: document.getElementById('evalSoftSkills').value,
    execution: document.getElementById('evalExecution').value
  };

  const notes = document.getElementById('hrNotes').value;

  try {
    const res = await fetch(API_BASE + '/api/hr/evaluations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empId, scores, notes })
    });
    if (res.ok) {
      showToast('تم واعتماد التقييم الخماسي وحساب النسبة الشهري ⭐');
      closeModal('hrEvalModal');
      await refreshAllData();
    }
  } catch (err) {
    showToast('خطأ أثناء التقييم', 'error');
  }
}

// ==========================================================================
// 7. INVENTORY & PAR LEVEL ALERTS
// ==========================================================================
async function fetchInventory() {
  try {
    const res = await fetch(API_BASE + '/api/inventory');
    appState.inventory = await res.json();
    renderInventoryTable();
  } catch (err) {
    console.error('Error fetching inventory:', err);
  }
}

function renderInventoryTable() {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.inventory.map(item => {
    let statusBadge = '';
    if (item.status === 'ok') statusBadge = '<span class="status-badge clean">رصيد آمن 🟢</span>';
    else if (item.status === 'warning') statusBadge = '<span class="status-badge cleaning">تنبيه إعادة طلب 🟡</span>';
    else statusBadge = '<span class="status-badge occupied">حرج جداً 🔴</span>';

    return `
      <tr>
        <td><strong>${item.id}</strong></td>
        <td><strong>${item.name}</strong></td>
        <td>${item.category}</td>
        <td><strong style="font-size:1.1rem; color:${item.status === 'ok' ? 'var(--primary-navy)' : '#dc2626'}">${item.currentStock}</strong> ${item.unit}</td>
        <td>${item.parLevel} ${item.unit}</td>
        <td>${item.unit}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-success btn-sm" onclick="updateInventoryStock('${item.id}', 5, 'add')">➕ توريد +5</button>
          <button class="btn btn-outline btn-sm" onclick="updateInventoryStock('${item.id}', 1, 'consume')">➖ استهلاك -1</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function updateInventoryStock(itemId, delta, action) {
  try {
    const res = await fetch(API_BASE + '/api/inventory/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, delta, action })
    });
    if (res.ok) {
      showToast('تم تحديث كمية المخزون 📦');
      await refreshAllData();
    }
  } catch (err) {
    showToast('خطأ أثناء تحديث المخزون', 'error');
  }
}

// Toast helper
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') toast.style.backgroundColor = '#991b1b';

  toast.innerHTML = `<span>${type === 'error' ? '⚠️' : '🔔'}</span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
