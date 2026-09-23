-- =========================================================
-- Chunk 2 DDL: Hotels, Room Types, Rooms Inventory & Amenities
-- =========================================================

CREATE TABLE IF NOT EXISTS hotels (
    id VARCHAR(64) PRIMARY KEY,
    owner_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL, -- Giza, Cairo, Alexandria, Fayoum
    zone VARCHAR(100) NOT NULL, -- Pyramids, Downtown, Zamalek, Montaza, etc.
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    star_rating INT DEFAULT 4 CHECK (star_rating BETWEEN 1 AND 5),
    check_in_time VARCHAR(20) DEFAULT '14:00',
    check_out_time VARCHAR(20) DEFAULT '12:00',
    commission_rate DECIMAL(5, 4) DEFAULT 0.0800, -- 8% commission policy
    amenities JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hotels_city_zone ON hotels(city, zone);
CREATE INDEX IF NOT EXISTS idx_hotels_owner ON hotels(owner_id);

CREATE TABLE IF NOT EXISTS room_types (
    id VARCHAR(64) PRIMARY KEY,
    hotel_id VARCHAR(64) NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g. Pyramid View Royal Suite
    description TEXT,
    max_occupancy INT NOT NULL DEFAULT 2,
    base_price_per_night DECIMAL(10, 2) NOT NULL,
    size_sqm INT DEFAULT 35,
    bed_type VARCHAR(50) DEFAULT 'King',
    amenities JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_room_types_hotel ON room_types(hotel_id);

CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(64) PRIMARY KEY,
    hotel_id VARCHAR(64) NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    room_type_id VARCHAR(64) NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hotel_id, room_number)
);

CREATE INDEX IF NOT EXISTS idx_rooms_hotel_type ON rooms(hotel_id, room_type_id);
