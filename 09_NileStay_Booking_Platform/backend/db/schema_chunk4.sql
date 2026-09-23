-- =========================================================
-- Chunk 4 DDL: Booking Engine, Overbooking Lock & Commission Module
-- =========================================================

CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    reference_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. NS-2026-89421
    guest_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    hotel_id VARCHAR(64) NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    room_type_id VARCHAR(64) NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    room_id VARCHAR(64) REFERENCES rooms(id) ON DELETE SET NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights_count INT NOT NULL CHECK (nights_count > 0),
    guests_count INT NOT NULL DEFAULT 1,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(50),
    special_requests TEXT,
    nightly_rate DECIMAL(10, 2) NOT NULL,
    subtotal_stay_amount DECIMAL(10, 2) NOT NULL,
    commission_rate DECIMAL(5, 4) DEFAULT 0.0800, -- 8% Low Commission
    commission_amount DECIMAL(10, 2) NOT NULL, -- 8% of subtotal
    hotel_payout_amount DECIMAL(10, 2) NOT NULL, -- 92% to hotel owner
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    booking_status VARCHAR(20) DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_hotel_dates ON bookings(hotel_id, room_type_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_guest ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(reference_code);
