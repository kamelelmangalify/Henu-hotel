const booking = {
  init() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    // Set min dates
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    if (checkinInput) {
      const today = new Date().toISOString().split('T')[0];
      checkinInput.min = today;
      checkinInput.addEventListener('change', () => {
        if (!checkinInput.value) return;
        const nextDay = new Date(checkinInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkoutInput.min = nextDay.toISOString().split('T')[0];
        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
          checkoutInput.value = nextDay.toISOString().split('T')[0];
        }
        this.updateSummary();
      });
      checkoutInput.addEventListener('change', () => this.updateSummary());
    }
    
    // Room type change
    const roomSelect = document.getElementById('roomType');
    if (roomSelect) {
      roomSelect.addEventListener('change', () => this.updateSummary());
    }
    
    // Auto-select room from URL query parameter if present
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam && roomSelect && this.roomPrices[roomParam]) {
      roomSelect.value = roomParam;
      this.updateSummary();
    }
    
    // Tours checkboxes
    document.querySelectorAll('.tour-addon').forEach(cb => {
      cb.addEventListener('change', () => this.updateSummary());
    });
    
    // Form submit
    form.addEventListener('submit', (e) => this.handleSubmit(e));
  },
  
  roomPrices: {
    single_std: { price: 12, label: 'Single Room (Standard)' },
    single_win: { price: 15, label: 'Single with Window' },
    single_balc: { price: 20, label: 'Single with Balcony' },
    double_std: { price: 18, label: 'Double Room (Standard)' },
    double_win: { price: 22, label: 'Double with Window' },
    double_balc: { price: 25, label: 'Double with Balcony' },
    triple_std: { price: 25, label: 'Triple Room (Standard)' },
    triple_win: { price: 30, label: 'Triple with Window' },
    triple_balc: { price: 35, label: 'Triple with Balcony' },
    suite: { price: 45, label: 'King Suite — Pyramids View' }
  },
  
  updateSummary() {
    const checkin = document.getElementById('checkin')?.value;
    const checkout = document.getElementById('checkout')?.value;
    const roomType = document.getElementById('roomType')?.value;
    const summaryEl = document.getElementById('bookingSummary');
    
    if (!summaryEl || !checkin || !checkout || !roomType) return;
    
    const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return;
    
    const room = this.roomPrices[roomType];
    if (!room) return;
    
    let total = room.price * nights;
    
    // Add tours
    let toursText = '';
    document.querySelectorAll('.tour-addon:checked').forEach(cb => {
      const tourPrice = parseInt(cb.dataset.price || 0);
      total += tourPrice;
      toursText += `<li>${cb.dataset.name}: $${tourPrice}</li>`;
    });
    
    summaryEl.innerHTML = `
      <h4>Booking Summary</h4>
      <p><strong>${room.label}</strong></p>
      <p>${nights} night${nights > 1 ? 's' : ''} × $${room.price}/night</p>
      ${toursText ? `<p><strong>Add-ons:</strong></p><ul>${toursText}</ul>` : ''}
      <p class="summary-total"><strong>Estimated Total: $${total}</strong></p>
      <p class="summary-note">💳 Pay at Property</p>
    `;
    summaryEl.style.display = 'block';
  },
  
  handleSubmit(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('guestName')?.value || '',
      email: document.getElementById('guestEmail')?.value || '',
      phone: document.getElementById('guestPhone')?.value || '',
      checkin: document.getElementById('checkin')?.value || '',
      checkout: document.getElementById('checkout')?.value || '',
      roomType: document.getElementById('roomType')?.value || '',
      guests: document.getElementById('guestCount')?.value || '1',
      requests: document.getElementById('specialRequests')?.value || '',
    };
    
    // Collect tours
    const tours = [];
    document.querySelectorAll('.tour-addon:checked').forEach(cb => {
      tours.push(cb.dataset.name);
    });
    
    // Build WhatsApp message
    const message = `🏨 *HENU Hotel - New Booking Request*%0A%0A` +
      `👤 Name: ${formData.name}%0A` +
      `📧 Email: ${formData.email}%0A` +
      `📞 Phone: ${formData.phone}%0A` +
      `📅 Check-in: ${formData.checkin}%0A` +
      `📅 Check-out: ${formData.checkout}%0A` +
      `🛏️ Room: ${this.roomPrices[formData.roomType]?.label || formData.roomType}%0A` +
      `👥 Guests: ${formData.guests}%0A` +
      (tours.length ? `🗺️ Tours: ${tours.join(', ')}%0A` : '') +
      (formData.requests ? `📝 Special Requests: ${formData.requests}%0A` : '') +
      `%0A💳 Payment: Pay at Property`;
    
    // Open WhatsApp (replace with actual number)
    // 20XXXXXXXXXX is a placeholder per instructions
    const whatsappUrl = `https://wa.me/20XXXXXXXXXX?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    const successMsg = document.getElementById('bookingSuccess');
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => booking.init());
