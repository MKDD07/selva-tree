-- Migration 0002: Booking Inventory & Reservations System (10 Rooms, Date-Wise Inventory)

CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY,
  room_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  base_price REAL NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  description TEXT,
  floor INTEGER DEFAULT 1,
  amenities TEXT, -- JSON array
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_reference TEXT NOT NULL UNIQUE,
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in TEXT NOT NULL,  -- YYYY-MM-DD
  check_out TEXT NOT NULL, -- YYYY-MM-DD
  num_guests INTEGER NOT NULL DEFAULT 2,
  total_price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed', 'checked_in', 'checked_out', 'cancelled'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'partial', 'refunded'
  payment_method TEXT DEFAULT 'credit_card', -- 'credit_card', 'upi', 'bank_transfer', 'cash'
  special_requests TEXT,
  source TEXT DEFAULT 'direct', -- 'direct', 'website', 'phone', 'ota'
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_inventory (
  id TEXT PRIMARY KEY, -- format: {room_id}_{date}
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  date TEXT NOT NULL, -- YYYY-MM-DD
  status TEXT NOT NULL DEFAULT 'available', -- 'available', 'booked', 'blocked', 'maintenance'
  price_override REAL,
  booking_id TEXT REFERENCES bookings(id) ON DELETE SET NULL,
  note TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed the 10 Hotel Rooms (Max 10 rooms)
INSERT OR IGNORE INTO rooms (id, room_number, name, room_type, base_price, capacity, description, floor, amenities) VALUES
  (1, '101', 'Deluxe Garden Suite', 'Deluxe Suite', 6500, 2, 'Ground floor suite opening to private garden patio with king bed and rain shower.', 1, '["King Bed", "Garden View", "Rain Shower", "High-speed Wi-Fi", "Espresso Machine", "Mini Bar", "AC"]'),
  (2, '102', 'Deluxe Garden Suite II', 'Deluxe Suite', 6500, 2, 'Serene garden-facing suite featuring natural stone interiors and plush king bedding.', 1, '["King Bed", "Garden View", "Rain Shower", "High-speed Wi-Fi", "Mini Bar", "AC"]'),
  (3, '103', 'Executive Poolside Retreat', 'Executive Suite', 8500, 2, 'Direct access to pool deck with private outdoor sun loungers and marble bathroom.', 1, '["King Bed", "Pool Access", "Sun Deck", "Bathtub", "High-speed Wi-Fi", "Espresso Machine", "AC"]'),
  (4, '104', 'Executive Poolside Retreat II', 'Executive Suite', 8500, 2, 'Spacious pool-facing retreat with private terrace and premium artisanal amenities.', 1, '["King Bed", "Pool View", "Private Terrace", "Bathtub", "High-speed Wi-Fi", "AC"]'),
  (5, '105', 'Royal Countryside Villa', 'Luxury Villa', 12500, 4, 'Exclusive 2-bedroom villa with private courtyard, panoramic Aravalli valley views.', 1, '["2 King Beds", "Private Courtyard", "Valley View", "Soaking Tub", "Dining Area", "Butler Service", "AC"]'),
  (6, '201', 'Panorama Forest Suite', 'Panorama Suite', 9500, 2, 'First floor suite offering 180-degree forest and sunset views from an oversized balcony.', 2, '["King Bed", "Sunset View", "Private Balcony", "Jacuzzi", "Smart TV", "Work Desk", "AC"]'),
  (7, '202', 'Panorama Forest Suite II', 'Panorama Suite', 9500, 2, 'Corner elevation with soaring ceilings, teakwood accents, and forest canopy vistas.', 2, '["King Bed", "Forest View", "Balcony", "Jacuzzi", "Smart TV", "AC"]'),
  (8, '203', 'Heritage Sanctuary Room', 'Heritage Room', 7200, 2, 'Handcrafted brass accents and heritage stone archways with curated vintage furniture.', 2, '["Queen Bed", "Courtyard View", "Heritage Decor", "Rain Shower", "Wi-Fi", "AC"]'),
  (9, '204', 'Heritage Sanctuary Room II', 'Heritage Room', 7200, 2, 'Warm heritage suite with reading nook overlooking the central olive grove.', 2, '["Queen Bed", "Grove View", "Reading Nook", "Rain Shower", "Wi-Fi", "AC"]'),
  (10, '205', 'Presidential Estate Villa', 'Presidential Suite', 16000, 4, 'Our flagship multi-room sanctuary with private plunge pool, firepit terrace, and lounge.', 2, '["Master King Suite", "Plunge Pool", "Firepit Terrace", "Lounge", "Dedicated Butler", "AC"]');

-- Seed Default Admin Account (Username: admin, Password: admin123@selvatree / sha256)
-- password_hash for 'admin123@selvatree': 20e6f30a9058b762ba384666cf3ef3dc54b5dfa5e55092eb2fef764aa5ec9b53
INSERT OR IGNORE INTO admin_users (id, username, password_hash, name, role) VALUES
  (1, 'admin', '20e6f30a9058b762ba384666cf3ef3dc54b5dfa5e55092eb2fef764aa5ec9b53', 'Estate Manager', 'admin');
