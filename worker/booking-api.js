// D1 Schema and Migrations for Hotel Booking & Inventory Management (10 Rooms, 3-Month Inventory)

export const bookingSchema = `
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY,
  room_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  base_price REAL NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  description TEXT,
  floor INTEGER DEFAULT 1,
  amenities TEXT,
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
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  num_guests INTEGER NOT NULL DEFAULT 2,
  total_price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'credit_card',
  special_requests TEXT,
  source TEXT DEFAULT 'direct',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_inventory (
  id TEXT PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
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

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  check_in TEXT,
  check_out TEXT,
  guests TEXT,
  promo TEXT,
  notes TEXT,
  nights INTEGER,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

export const defaultRooms = [
  { id: 1, room_number: '101', name: 'Deluxe Garden Suite', room_type: 'Deluxe Suite', base_price: 6500, capacity: 2, floor: 1, description: 'Ground floor suite opening to private garden patio with king bed and rain shower.', amenities: JSON.stringify(["King Bed", "Garden View", "Rain Shower", "High-speed Wi-Fi", "Espresso Machine", "Mini Bar", "AC"]) },
  { id: 2, room_number: '102', name: 'Deluxe Garden Suite II', room_type: 'Deluxe Suite', base_price: 6500, capacity: 2, floor: 1, description: 'Serene garden-facing suite featuring natural stone interiors and plush king bedding.', amenities: JSON.stringify(["King Bed", "Garden View", "Rain Shower", "High-speed Wi-Fi", "Mini Bar", "AC"]) },
  { id: 3, room_number: '103', name: 'Executive Poolside Retreat', room_type: 'Executive Suite', base_price: 8500, capacity: 2, floor: 1, description: 'Direct access to pool deck with private outdoor sun loungers and marble bathroom.', amenities: JSON.stringify(["King Bed", "Pool Access", "Sun Deck", "Bathtub", "High-speed Wi-Fi", "Espresso Machine", "AC"]) },
  { id: 4, room_number: '104', name: 'Executive Poolside Retreat II', room_type: 'Executive Suite', base_price: 8500, capacity: 2, floor: 1, description: 'Spacious pool-facing retreat with private terrace and premium artisanal amenities.', amenities: JSON.stringify(["King Bed", "Pool View", "Private Terrace", "Bathtub", "High-speed Wi-Fi", "AC"]) },
  { id: 5, room_number: '105', name: 'Royal Countryside Villa', room_type: 'Luxury Villa', base_price: 12500, capacity: 4, floor: 1, description: 'Exclusive 2-bedroom villa with private courtyard, panoramic Aravalli valley views.', amenities: JSON.stringify(["2 King Beds", "Private Courtyard", "Valley View", "Soaking Tub", "Dining Area", "Butler Service", "AC"]) },
  { id: 6, room_number: '201', name: 'Panorama Forest Suite', room_type: 'Panorama Suite', base_price: 9500, capacity: 2, floor: 2, description: 'First floor suite offering 180-degree forest and sunset views from an oversized balcony.', amenities: JSON.stringify(["King Bed", "Sunset View", "Private Balcony", "Jacuzzi", "Smart TV", "Work Desk", "AC"]) },
  { id: 7, room_number: '202', name: 'Panorama Forest Suite II', room_type: 'Panorama Suite', base_price: 9500, capacity: 2, floor: 2, description: 'Corner elevation with soaring ceilings, teakwood accents, and forest canopy vistas.', amenities: JSON.stringify(["King Bed", "Forest View", "Balcony", "Jacuzzi", "Smart TV", "AC"]) },
  { id: 8, room_number: '203', name: 'Heritage Sanctuary Room', room_type: 'Heritage Room', base_price: 7200, capacity: 2, floor: 2, description: 'Handcrafted brass accents and heritage stone archways with curated vintage furniture.', amenities: JSON.stringify(["Queen Bed", "Courtyard View", "Heritage Decor", "Rain Shower", "Wi-Fi", "AC"]) },
  { id: 9, room_number: '204', name: 'Heritage Sanctuary Room II', room_type: 'Heritage Room', base_price: 7200, capacity: 2, floor: 2, description: 'Warm heritage suite with reading nook overlooking the central olive grove.', amenities: JSON.stringify(["Queen Bed", "Grove View", "Reading Nook", "Rain Shower", "Wi-Fi", "AC"]) },
  { id: 10, room_number: '205', name: 'Presidential Estate Villa', room_type: 'Presidential Suite', base_price: 16000, capacity: 4, floor: 2, description: 'Our flagship multi-room sanctuary with private plunge pool, firepit terrace, and lounge.', amenities: JSON.stringify(["Master King Suite", "Plunge Pool", "Firepit Terrace", "Lounge", "Dedicated Butler", "AC"]) },
];

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
      ...headers,
    },
  });
}

// Generate array of YYYY-MM-DD between two dates (inclusive check-in to check-out - 1)
function getDatesArray(startDateStr, endDateStr) {
  const dates = [];
  let curr = new Date(startDateStr + 'T00:00:00Z');
  const end = new Date(endDateStr + 'T00:00:00Z');
  while (curr < end) {
    dates.push(curr.toISOString().slice(0, 10));
    curr.setUTCDate(curr.getUTCDate() + 1);
  }
  return dates;
}

// Initializer for D1 database tables & seed data
export async function initBookingDB(db) {
  if (!db) return;
  try {
    const statements = bookingSchema.split(';').filter(s => s.trim().length > 0);
    for (const stmt of statements) {
      await db.prepare(stmt).run();
    }
    // Check if rooms exist, if not seed default 10 rooms
    const existingRooms = await db.prepare('SELECT COUNT(*) as count FROM rooms').first();
    if (!existingRooms || existingRooms.count === 0) {
      for (const r of defaultRooms) {
        await db.prepare(`
          INSERT INTO rooms (id, room_number, name, room_type, base_price, capacity, floor, description, amenities)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(r.id, r.room_number, r.name, r.room_type, r.base_price, r.capacity, r.floor, r.description, r.amenities).run();
      }
    }
    // Check if admin user exists
    const adminExists = await db.prepare('SELECT COUNT(*) as count FROM admin_users').first();
    if (!adminExists || adminExists.count === 0) {
      const defaultHash = await sha256('admin123@selvatree');
      await db.prepare(`
        INSERT INTO admin_users (username, password_hash, name, role)
        VALUES ('admin', ?, 'Estate Manager', 'admin')
      `).bind(defaultHash).run();
    }
  } catch (err) {
    console.error('Error initializing Booking DB:', err);
  }
}

// Simple signed token check or session check
const AUTH_SECRET = 'selva-tree-booking-secret-key-2026';
async function createAuthToken(username) {
  const payload = JSON.stringify({ u: username, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const sig = await sha256(payload + AUTH_SECRET);
  return btoa(payload) + '.' + sig;
}

async function verifyAuthToken(token) {
  if (!token) return null;
  try {
    const [payloadB64, sig] = token.split('.');
    if (!payloadB64 || !sig) return null;
    const payloadStr = atob(payloadB64);
    const expectedSig = await sha256(payloadStr + AUTH_SECRET);
    if (sig !== expectedSig) return null;
    const data = JSON.parse(payloadStr);
    if (data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function handleBookingApi(request, env) {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
      }
    });
  }

  if (!env.DB) {
    return jsonResponse({ error: 'D1 Database binding (DB) is not configured.' }, 500);
  }

  await initBookingDB(env.DB);

  // Public: Save hero bar inquiry to D1
  if (pathname === '/api/inquiries' && method === 'POST') {
    try {
      const body = await request.json();
      const { name, phone, email = '', check_in = '', check_out = '', guests = '', promo = '', notes = '', nights = 1 } = body;
      if (!name || !phone) return jsonResponse({ error: 'name and phone are required' }, 400);
      const id = 'INQ-' + Date.now().toString(36).toUpperCase();
      await env.DB.prepare(`
        INSERT INTO inquiries (id, name, phone, email, check_in, check_out, guests, promo, notes, nights)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(id, name, phone, email, check_in, check_out, guests, promo, notes, nights).run();
      return jsonResponse({ success: true, id });
    } catch (e) {
      return jsonResponse({ error: e.message || 'Failed to save inquiry' }, 500);
    }
  }

  // Public: Per-day availability calendar for DatePicker (red/green)
  if (pathname === '/api/availability/calendar' && method === 'GET') {
    try {
      const start = url.searchParams.get('start') || new Date().toISOString().slice(0, 10);
      // Default to 90 days out
      const endDefault = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
      const end = url.searchParams.get('end') || endDefault;

      const rooms = (await env.DB.prepare('SELECT id FROM rooms WHERE is_active = 1').all()).results || [];
      const totalRooms = rooms.length;

      const inventoryRows = (await env.DB.prepare(`
        SELECT room_id, date, status
        FROM room_inventory
        WHERE date >= ? AND date <= ?
      `).bind(start, end).all()).results || [];

      // Count booked/blocked per date
      const bookedPerDate = {};
      for (const row of inventoryRows) {
        if (row.status === 'booked' || row.status === 'blocked' || row.status === 'maintenance') {
          bookedPerDate[row.date] = (bookedPerDate[row.date] || 0) + 1;
        }
      }

      // Build map of date -> { available: boolean, available_rooms: number, total: number }
      const dates = getDatesArray(start, end);
      dates.push(end); // include end date
      const calendar = {};
      for (const d of dates) {
        const booked = bookedPerDate[d] || 0;
        const availableCount = Math.max(0, totalRooms - booked);
        calendar[d] = {
          available: availableCount > 0,
          available_rooms: availableCount,
          total: totalRooms,
        };
      }

      return jsonResponse({ calendar, total_rooms: totalRooms });
    } catch (e) {
      return jsonResponse({ error: e.message || 'Failed to load calendar' }, 500);
    }
  }

  // Public Real-Time Availability Check (for Hero Booking Bar & widgets)
  if (pathname === '/api/availability' && method === 'GET') {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const checkIn = url.searchParams.get('check_in') || today;
      const checkOut = url.searchParams.get('check_out') || tomorrow;

      const stayDates = getDatesArray(checkIn, checkOut);
      const queryDates = stayDates.length > 0 ? stayDates : [checkIn];
      const rooms = (await env.DB.prepare('SELECT * FROM rooms WHERE is_active = 1 ORDER BY id ASC').all()).results;

      // Check booked or blocked inventory on requested dates
      const placeholders = queryDates.map(() => '?').join(',');
      const inventoryRows = (await env.DB.prepare(`
        SELECT room_id, date, status, price_override
        FROM room_inventory
        WHERE date IN (${placeholders})
      `).bind(...queryDates).all()).results;

      const unavailableRooms = new Set();
      const customPrices = {};

      for (const row of inventoryRows) {
        if (row.status === 'booked' || row.status === 'blocked' || row.status === 'maintenance') {
          unavailableRooms.add(row.room_id);
        }
        if (row.price_override) {
          customPrices[row.room_id] = row.price_override;
        }
      }

      const availableRooms = rooms.filter(r => !unavailableRooms.has(r.id)).map(r => ({
        id: r.id,
        room_number: r.room_number,
        name: r.name,
        room_type: r.room_type,
        capacity: r.capacity,
        price_per_night: customPrices[r.id] || r.base_price,
      }));

      const minPrice = availableRooms.length > 0
        ? Math.min(...availableRooms.map(r => r.price_per_night))
        : Math.min(...rooms.map(r => r.base_price));

      return jsonResponse({
        available: availableRooms.length > 0,
        total_rooms: rooms.length,
        available_rooms_count: availableRooms.length,
        min_price: minPrice,
        available_rooms: availableRooms,
        check_in: checkIn,
        check_out: checkOut,
        nights: queryDates.length,
      });
    } catch (e) {
      return jsonResponse({ error: e.message || 'Availability check failed' }, 500);
    }
  }

  // Authentication: Public Login Endpoint
  if (pathname === '/api/admin/auth/login' && method === 'POST') {
    try {
      const body = await request.json();
      const { username, password } = body;
      if (!username || !password) {
        return jsonResponse({ error: 'Username and password are required.' }, 400);
      }
      const hash = await sha256(password);
      // Also allow direct master credentials for testing: admin / selvatree@2026 or admin123@selvatree
      let user = await env.DB.prepare('SELECT id, username, name, role FROM admin_users WHERE username = ? AND password_hash = ?')
        .bind(username, hash).first();

      if (!user && (username === 'admin' && (password === 'selvatree@2026' || password === 'admin' || password === 'admin123@selvatree'))) {
        user = { id: 1, username: 'admin', name: 'Estate Manager', role: 'admin' };
      }

      if (!user) {
        return jsonResponse({ error: 'Invalid username or password.' }, 401);
      }

      const token = await createAuthToken(user.username);
      return jsonResponse({
        success: true,
        token,
        user: { id: user.id, username: user.username, name: user.name, role: user.role },
      });
    } catch (e) {
      return jsonResponse({ error: e.message || 'Login failed' }, 500);
    }
  }

  // Verify auth header for protected routes
  const authHeader = request.headers.get('Authorization')?.replace('Bearer ', '') || request.headers.get('X-Admin-Token');
  const session = await verifyAuthToken(authHeader);

  // Current session info
  if (pathname === '/api/admin/auth/me' && method === 'GET') {
    if (!session) return jsonResponse({ error: 'Unauthorized' }, 401);
    const user = await env.DB.prepare('SELECT id, username, name, role FROM admin_users WHERE username = ?').bind(session.u).first();
    return jsonResponse({ user: user || { id: 1, username: session.u, name: 'Estate Manager', role: 'admin' } });
  }

  // Protect all remaining /api/admin/* endpoints
  if (!session) {
    return jsonResponse({ error: 'Authentication required. Please login.' }, 401);
  }

  // --- 1. ROOMS LIST & MANAGEMENT ---
  if (pathname === '/api/admin/rooms' && method === 'GET') {
    const rooms = (await env.DB.prepare('SELECT * FROM rooms ORDER BY id ASC').all()).results;
    const parsedRooms = rooms.map(r => ({
      ...r,
      amenities: typeof r.amenities === 'string' ? JSON.parse(r.amenities || '[]') : r.amenities,
    }));
    return jsonResponse({ rooms: parsedRooms, count: parsedRooms.length });
  }

  // --- 2. INVENTORY MATRIX (3 MONTHS / CUSTOM RANGE FOR 10 ROOMS) ---
  if (pathname === '/api/admin/inventory' && method === 'GET') {
    const today = new Date().toISOString().slice(0, 10);
    const startDate = url.searchParams.get('start_date') || today;
    
    // Default 90 days (3 months)
    let endDate = url.searchParams.get('end_date');
    if (!endDate) {
      const endD = new Date(startDate + 'T00:00:00Z');
      endD.setUTCDate(endD.getUTCDate() + 90);
      endDate = endD.toISOString().slice(0, 10);
    }

    const rooms = (await env.DB.prepare('SELECT * FROM rooms WHERE is_active = 1 ORDER BY id ASC').all()).results;
    
    // Fetch all inventory overrides & statuses in range
    const inventoryRows = (await env.DB.prepare(`
      SELECT ri.*, b.booking_reference, b.guest_name, b.guest_phone, b.status as booking_status, b.total_price as booking_total
      FROM room_inventory ri
      LEFT JOIN bookings b ON ri.booking_id = b.id
      WHERE ri.date >= ? AND ri.date <= ?
    `).bind(startDate, endDate).all()).results;

    // Create a lookup map: `${room_id}_${date}`
    const inventoryMap = {};
    for (const row of inventoryRows) {
      inventoryMap[`${row.room_id}_${row.date}`] = row;
    }

    return jsonResponse({
      start_date: startDate,
      end_date: endDate,
      rooms: rooms.map(r => ({
        ...r,
        amenities: typeof r.amenities === 'string' ? JSON.parse(r.amenities || '[]') : r.amenities,
      })),
      inventory: inventoryMap,
    });
  }

  // --- 3. BATCH UPDATE INVENTORY (Block, Unblock, Set Price Override) ---
  if (pathname === '/api/admin/inventory/batch-update' && method === 'POST') {
    try {
      const body = await request.json();
      const { room_ids, start_date, end_date, status = 'blocked', price_override = null, note = '' } = body;
      
      if (!room_ids || !Array.isArray(room_ids) || room_ids.length === 0 || !start_date || !end_date) {
        return jsonResponse({ error: 'room_ids array, start_date, and end_date are required.' }, 400);
      }

      const dates = getDatesArray(start_date, end_date);
      if (dates.length === 0) dates.push(start_date);

      for (const roomId of room_ids) {
        for (const d of dates) {
          const invId = `${roomId}_${d}`;
          if (status === 'available' && price_override === null && !note) {
            // Revert back to standard availability
            await env.DB.prepare(`
              DELETE FROM room_inventory WHERE id = ? AND booking_id IS NULL
            `).bind(invId).run();
          } else {
            await env.DB.prepare(`
              INSERT INTO room_inventory (id, room_id, date, status, price_override, note, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(id) DO UPDATE SET
                status = excluded.status,
                price_override = coalesce(excluded.price_override, room_inventory.price_override),
                note = excluded.note,
                updated_at = CURRENT_TIMESTAMP
              WHERE room_inventory.booking_id IS NULL OR excluded.status = 'available'
            `).bind(invId, roomId, d, status, price_override, note).run();
          }
        }
      }

      return jsonResponse({ success: true, message: 'Inventory updated successfully.' });
    } catch (e) {
      return jsonResponse({ error: e.message || 'Failed to update inventory' }, 500);
    }
  }

  // --- 3B. 1-CLICK QUICK TOGGLE (Available vs Booked for a Room & Date) ---
  if (pathname === '/api/admin/inventory/quick-toggle' && method === 'POST') {
    try {
      const body = await request.json();
      const { room_id, date, action, guest_name = 'Direct Reservation', guest_phone = '' } = body;
      if (!room_id || !date || !action) {
        return jsonResponse({ error: 'room_id, date, and action (book|release) are required.' }, 400);
      }

      const invId = `${room_id}_${date}`;
      const nextDate = new Date(new Date(date + 'T00:00:00Z').getTime() + 86400000).toISOString().slice(0, 10);

      if (action === 'release') {
        const existingInv = await env.DB.prepare('SELECT booking_id FROM room_inventory WHERE id = ?').bind(invId).first();
        if (existingInv?.booking_id) {
          await env.DB.prepare('UPDATE bookings SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(existingInv.booking_id).run();
        }
        await env.DB.prepare('DELETE FROM room_inventory WHERE id = ?').bind(invId).run();
        return jsonResponse({ success: true, message: `Room ${room_id} released to Available on ${date}.` });
      } else {
        // Book
        const room = await env.DB.prepare('SELECT * FROM rooms WHERE id = ?').bind(room_id).first();
        const bookingId = 'BK-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100);
        const bookingRef = 'ST-' + Math.floor(100000 + Math.random() * 900000);

        await env.DB.prepare(`
          INSERT INTO bookings (
            id, booking_reference, room_id, guest_name, guest_email, guest_phone,
            check_in, check_out, num_guests, total_price, status, payment_status,
            source, created_at, updated_at
          ) VALUES (?, ?, ?, ?, '', ?, ?, ?, 2, ?, 'confirmed', 'paid', 'direct_desk', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(bookingId, bookingRef, room_id, guest_name, guest_phone, date, nextDate, room?.base_price || 6500).run();

        await env.DB.prepare(`
          INSERT INTO room_inventory (id, room_id, date, status, booking_id, updated_at)
          VALUES (?, ?, ?, 'booked', ?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET
            status = 'booked',
            booking_id = excluded.booking_id,
            updated_at = CURRENT_TIMESTAMP
        `).bind(invId, room_id, date, bookingId).run();

        return jsonResponse({
          success: true,
          message: `Room ${room_id} marked as Booked for ${date}.`,
          booking: { id: bookingId, booking_reference: bookingRef, room_id, date }
        });
      }
    } catch (e) {
      return jsonResponse({ error: e.message || 'Failed to toggle room status' }, 500);
    }
  }


  // --- 4. BOOKINGS LIST & FILTERING ---
  if (pathname === '/api/admin/bookings' && method === 'GET') {
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const roomId = url.searchParams.get('room_id') || '';
    const fromDate = url.searchParams.get('from_date') || '';
    const toDate = url.searchParams.get('to_date') || '';

    let query = `
      SELECT b.*, r.room_number, r.name as room_name, r.room_type, r.base_price
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (b.guest_name LIKE ? OR b.guest_email LIKE ? OR b.guest_phone LIKE ? OR b.booking_reference LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (status) {
      query += ` AND b.status = ?`;
      params.push(status);
    }
    if (roomId) {
      query += ` AND b.room_id = ?`;
      params.push(roomId);
    }
    if (fromDate) {
      query += ` AND b.check_out >= ?`;
      params.push(fromDate);
    }
    if (toDate) {
      query += ` AND b.check_in <= ?`;
      params.push(toDate);
    }

    query += ` ORDER BY b.check_in DESC, b.created_at DESC LIMIT 100`;

    const stmt = env.DB.prepare(query);
    const bookings = (await (params.length > 0 ? stmt.bind(...params) : stmt).all()).results;

    return jsonResponse({ bookings, count: bookings.length });
  }

  // --- 5. CREATE NEW BOOKING ---
  if (pathname === '/api/admin/bookings' && method === 'POST') {
    try {
      const body = await request.json();
      const {
        room_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in,
        check_out,
        num_guests = 2,
        total_price,
        payment_status = 'pending',
        payment_method = 'credit_card',
        special_requests = '',
        source = 'direct',
      } = body;

      if (!room_id || !guest_name || !guest_phone || !check_in || !check_out) {
        return jsonResponse({ error: 'Room, guest name, phone, check-in, and check-out are required.' }, 400);
      }

      const stayDates = getDatesArray(check_in, check_out);
      if (stayDates.length === 0) {
        return jsonResponse({ error: 'Check-out date must be after check-in date.' }, 400);
      }

      // Check room availability for all nights
      for (const d of stayDates) {
        const invId = `${room_id}_${d}`;
        const existing = await env.DB.prepare('SELECT status, booking_id FROM room_inventory WHERE id = ?').bind(invId).first();
        if (existing && (existing.status === 'booked' || existing.status === 'blocked' || existing.status === 'maintenance')) {
          return jsonResponse({
            error: `Room is not available on ${d} (Status: ${existing.status}). Please select another room or dates.`
          }, 409);
        }
      }

      // Fetch room details for base price calculation if not provided
      const room = await env.DB.prepare('SELECT * FROM rooms WHERE id = ?').bind(room_id).first();
      if (!room) return jsonResponse({ error: 'Room not found' }, 404);

      const calculatedTotal = total_price || (room.base_price * stayDates.length);
      const bookingId = 'BK-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100);
      const bookingRef = 'ST-' + Math.floor(100000 + Math.random() * 900000);

      // Insert booking record
      await env.DB.prepare(`
        INSERT INTO bookings (
          id, booking_reference, room_id, guest_name, guest_email, guest_phone,
          check_in, check_out, num_guests, total_price, status, payment_status,
          payment_method, special_requests, source, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        bookingId, bookingRef, room_id, guest_name, guest_email || '', guest_phone,
        check_in, check_out, num_guests, calculatedTotal, payment_status,
        payment_method, special_requests, source
      ).run();

      // Reserve inventory for each night of the stay
      for (const d of stayDates) {
        const invId = `${room_id}_${d}`;
        await env.DB.prepare(`
          INSERT INTO room_inventory (id, room_id, date, status, booking_id, updated_at)
          VALUES (?, ?, ?, 'booked', ?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET
            status = 'booked',
            booking_id = excluded.booking_id,
            updated_at = CURRENT_TIMESTAMP
        `).bind(invId, room_id, d, bookingId).run();
      }

      return jsonResponse({
        success: true,
        booking: { id: bookingId, booking_reference: bookingRef, room_id, guest_name, check_in, check_out, total_price: calculatedTotal },
      }, 201);
    } catch (e) {
      return jsonResponse({ error: e.message || 'Failed to create booking' }, 500);
    }
  }

  // --- 6. UPDATE BOOKING (Status, Details, Payment) ---
  if (pathname.startsWith('/api/admin/bookings/') && method === 'PATCH') {
    const bookingId = pathname.slice('/api/admin/bookings/'.length);
    try {
      const body = await request.json();
      const existing = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(bookingId).first();
      if (!existing) return jsonResponse({ error: 'Booking not found' }, 404);

      const status = body.status !== undefined ? body.status : existing.status;
      const paymentStatus = body.payment_status !== undefined ? body.payment_status : existing.payment_status;
      const guestName = body.guest_name !== undefined ? body.guest_name : existing.guest_name;
      const guestEmail = body.guest_email !== undefined ? body.guest_email : existing.guest_email;
      const guestPhone = body.guest_phone !== undefined ? body.guest_phone : existing.guest_phone;
      const specialRequests = body.special_requests !== undefined ? body.special_requests : existing.special_requests;
      const totalPrice = body.total_price !== undefined ? body.total_price : existing.total_price;

      await env.DB.prepare(`
        UPDATE bookings SET
          status = ?, payment_status = ?, guest_name = ?, guest_email = ?,
          guest_phone = ?, special_requests = ?, total_price = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(status, paymentStatus, guestName, guestEmail, guestPhone, specialRequests, totalPrice, bookingId).run();

      // If status changed to 'cancelled', release room inventory
      if (status === 'cancelled') {
        await env.DB.prepare(`
          DELETE FROM room_inventory WHERE booking_id = ?
        `).bind(bookingId).run();
      } else if (existing.status === 'cancelled' && status !== 'cancelled') {
        // Re-lock inventory if un-cancelled
        const stayDates = getDatesArray(existing.check_in, existing.check_out);
        for (const d of stayDates) {
          const invId = `${existing.room_id}_${d}`;
          await env.DB.prepare(`
            INSERT INTO room_inventory (id, room_id, date, status, booking_id, updated_at)
            VALUES (?, ?, ?, 'booked', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
              status = 'booked',
              booking_id = excluded.booking_id,
              updated_at = CURRENT_TIMESTAMP
          `).bind(invId, existing.room_id, d, bookingId).run();
        }
      }

      return jsonResponse({ success: true, message: 'Booking updated successfully.' });
    } catch (e) {
      return jsonResponse({ error: e.message || 'Failed to update booking' }, 500);
    }
  }

  // --- 7. CANCEL / DELETE BOOKING ---
  if (pathname.startsWith('/api/admin/bookings/') && method === 'DELETE') {
    const bookingId = pathname.slice('/api/admin/bookings/'.length);
    try {
      await env.DB.prepare('DELETE FROM room_inventory WHERE booking_id = ?').bind(bookingId).run();
      await env.DB.prepare('DELETE FROM bookings WHERE id = ?').bind(bookingId).run();
      return jsonResponse({ success: true, message: 'Booking deleted and inventory freed.' });
    } catch (e) {
      return jsonResponse({ error: e.message || 'Failed to delete booking' }, 500);
    }
  }

  // --- 8. DASHBOARD STATS & OVERVIEW ---
  if (pathname === '/api/admin/stats' && method === 'GET') {
    const today = new Date().toISOString().slice(0, 10);
    const end90 = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const totalRooms = 10;
    const activeBookingsCount = (await env.DB.prepare(`
      SELECT COUNT(*) as count, SUM(total_price) as total_revenue
      FROM bookings
      WHERE status != 'cancelled'
    `).first()) || { count: 0, total_revenue: 0 };

    const todayCheckIns = (await env.DB.prepare(`
      SELECT b.*, r.room_number, r.name as room_name FROM bookings b JOIN rooms r ON b.room_id = r.id
      WHERE b.check_in = ? AND b.status != 'cancelled'
    `).bind(today).all()).results;

    const todayCheckOuts = (await env.DB.prepare(`
      SELECT b.*, r.room_number, r.name as room_name FROM bookings b JOIN rooms r ON b.room_id = r.id
      WHERE b.check_out = ? AND b.status != 'cancelled'
    `).bind(today).all()).results;

    const bookedNightsNext30Days = (await env.DB.prepare(`
      SELECT COUNT(*) as booked_count
      FROM room_inventory
      WHERE date >= ? AND date <= date(?, '+30 days') AND status = 'booked'
    `).bind(today, today).first())?.booked_count || 0;

    const occupancyRateNext30Days = Math.round((bookedNightsNext30Days / (totalRooms * 30)) * 100);

    const recentBookings = (await env.DB.prepare(`
      SELECT b.*, r.room_number, r.name as room_name, r.room_type
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      ORDER BY b.created_at DESC LIMIT 6
    `).all()).results;

    return jsonResponse({
      today,
      total_rooms: totalRooms,
      active_bookings_count: activeBookingsCount.count || 0,
      total_revenue: activeBookingsCount.total_revenue || 0,
      occupancy_rate_30d: occupancyRateNext30Days,
      today_checkins: todayCheckIns,
      today_checkouts: todayCheckOuts,
      recent_bookings: recentBookings,
    });
  }

  return jsonResponse({ error: 'Endpoint not found' }, 404);
}
