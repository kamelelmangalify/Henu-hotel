-- =========================================================
-- Chunk 3 DDL: Real-Time Availability & Search Indexing
-- =========================================================

-- Create index on city, zone and star_rating for rapid search filtering
CREATE INDEX IF NOT EXISTS idx_hotels_search_composite ON hotels(city, zone, star_rating);

-- Create index on room_types price & occupancy for filtering
CREATE INDEX IF NOT EXISTS idx_room_types_search ON room_types(base_price_per_night, max_occupancy);
