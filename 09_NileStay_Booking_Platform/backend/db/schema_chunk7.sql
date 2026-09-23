-- =========================================================
-- Chunk 7 DDL: Master Admin & Payment Gateways Schema
-- =========================================================

CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    gateway_name VARCHAR(50) DEFAULT 'Paymob' CHECK (gateway_name IN ('Paymob', 'Fawry', 'Visa_Mastercard', 'Cash_At_Hotel')),
    transaction_reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_status VARCHAR(20) DEFAULT 'success' CHECK (payment_status IN ('pending', 'success', 'failed', 'refunded')),
    gateway_response JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_ref ON payment_transactions(transaction_reference);
