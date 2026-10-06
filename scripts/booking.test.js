import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';

// In-memory mock SQLite/D1 database runner for unit testing
function createMockD1() {
  const tables = {
    rooms: [],
    bookings: [],
    room_inventory: [],
    admin_users: [],
  };

  return {
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              return executeMockSql(sql, args, tables);
            },
            async first() {
              const res = executeMockSql(sql, args, tables);
              return res?.results?.[0] || null;
            },
            async all() {
              return executeMockSql(sql, args, tables);
            },
          };
        },
        async run() {
          return executeMockSql(sql, [], tables);
        },
        async first() {
          const res = executeMockSql(sql, [], tables);
          return res?.results?.[0] || null;
        },
        async all() {
          return executeMockSql(sql, [], tables);
        },
      };
    },
  };
}

function executeMockSql(sql, args, tables) {
  const s = sql.replace(/\s+/g, ' ').trim();
  if (s.startsWith('CREATE TABLE')) {
    return { success: true };
  }
  if (s.includes('SELECT COUNT(*) as count FROM rooms')) {
    return { results: [{ count: tables.rooms.length }] };
  }
  if (s.includes('SELECT COUNT(*) as count FROM admin_users')) {
    return { results: [{ count: tables.admin_users.length }] };
  }
  if (s.includes('INSERT INTO rooms')) {
    const [id, room_number, name, room_type, base_price, capacity, floor, description, amenities] = args;
    tables.rooms.push({ id, room_number, name, room_type, base_price, capacity, floor, description, amenities, is_active: 1 });
    return { success: true };
  }
  if (s.includes('INSERT INTO admin_users')) {
    const [hash] = args;
    tables.admin_users.push({ id: 1, username: 'admin', password_hash: hash, name: 'Estate Manager', role: 'admin' });
    return { success: true };
  }
  if (s.includes('SELECT id, username, name, role FROM admin_users WHERE username = ?')) {
    const [username, hash] = args;
    const user = tables.admin_users.find(u => u.username === username && u.password_hash === hash);
    return { results: user ? [user] : [] };
  }
  if (s.includes('SELECT * FROM rooms WHERE is_active = 1') || s.includes('SELECT * FROM rooms ORDER BY id ASC')) {
    return { results: [...tables.rooms] };
  }
  if (s.includes('SELECT * FROM rooms WHERE id = ?')) {
    const [id] = args;
    const room = tables.rooms.find(r => r.id === id);
    return { results: room ? [room] : [] };
  }
  if (s.includes('SELECT status, booking_id FROM room_inventory WHERE id = ?')) {
    const [id] = args;
    const inv = tables.room_inventory.find(i => i.id === id);
    return { results: inv ? [inv] : [] };
  }
  if (s.includes('INSERT INTO bookings')) {
    const [id, ref, room_id, guest_name, guest_email, guest_phone, check_in, check_out, num_guests, total_price, payment_status, payment_method, special_requests, source] = args;
    tables.bookings.push({
      id, booking_reference: ref, room_id, guest_name, guest_email, guest_phone,
      check_in, check_out, num_guests, total_price, status: 'confirmed',
      payment_status, payment_method, special_requests, source,
    });
    return { success: true };
  }
  if (s.includes('INSERT INTO room_inventory')) {
    const [id, room_id, date, booking_id] = args;
    const existingIdx = tables.room_inventory.findIndex(i => i.id === id);
    if (existingIdx >= 0) {
      tables.room_inventory[existingIdx] = { id, room_id, date, status: 'booked', booking_id };
    } else {
      tables.room_inventory.push({ id, room_id, date, status: 'booked', booking_id });
    }
    return { success: true };
  }
  if (s.includes('SELECT ri.*, b.booking_reference, b.guest_name')) {
    const [start, end] = args;
    const rows = tables.room_inventory.filter(i => i.date >= start && i.date <= end).map(i => {
      const b = tables.bookings.find(bk => bk.id === i.booking_id);
      return { ...i, booking_reference: b?.booking_reference, guest_name: b?.guest_name };
    });
    return { results: rows };
  }
  if (s.includes('SELECT b.*, r.room_number, r.name as room_name')) {
    const rows = tables.bookings.map(b => {
      const r = tables.rooms.find(rm => rm.id === b.room_id);
      return { ...b, room_number: r?.room_number, room_name: r?.name, room_type: r?.room_type, base_price: r?.base_price };
    });
    return { results: rows };
  }
  if (s.includes('SELECT COUNT(*) as count, SUM(total_price) as total_revenue FROM bookings')) {
    const active = tables.bookings.filter(b => b.status !== 'cancelled');
    const total_revenue = active.reduce((sum, b) => sum + (b.total_price || 0), 0);
    return { results: [{ count: active.length, total_revenue }] };
  }
  if (s.includes('SELECT * FROM bookings WHERE id = ?')) {
    const [id] = args;
    const b = tables.bookings.find(bk => bk.id === id);
    return { results: b ? [b] : [] };
  }
  if (s.includes('UPDATE bookings SET')) {
    const [status, paymentStatus, guestName, guestEmail, guestPhone, specialRequests, totalPrice, bookingId] = args;
    const b = tables.bookings.find(bk => bk.id === bookingId);
    if (b) {
      b.status = status;
      b.payment_status = paymentStatus;
      b.guest_name = guestName;
      b.guest_email = guestEmail;
      b.guest_phone = guestPhone;
      b.special_requests = specialRequests;
      b.total_price = totalPrice;
    }
    return { success: true };
  }
  if (s.includes('DELETE FROM room_inventory WHERE booking_id = ?')) {
    const [bookingId] = args;
    tables.room_inventory = tables.room_inventory.filter(i => i.booking_id !== bookingId);
    return { success: true };
  }
  if (s.includes('DELETE FROM bookings WHERE id = ?')) {
    const [bookingId] = args;
    tables.bookings = tables.bookings.filter(b => b.id !== bookingId);
    return { success: true };
  }
  return { results: [] };
}

test('Booking & Inventory D1 API: Auth, 10-Room Matrix, and Reservation Workflow', async () => {
  const env = { DB: createMockD1() };

  // 1. Admin Login
  const loginReq = new Request('https://selva-tree.test/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123@selvatree' }),
  });
  const loginRes = await worker.fetch(loginReq, env);
  assert.equal(loginRes.status, 200);
  const loginData = await loginRes.json();
  assert.ok(loginData.token, 'Returns signed session token');
  assert.equal(loginData.user.username, 'admin');

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${loginData.token}`,
  };

  // 2. Fetch 10 Rooms
  const roomsReq = new Request('https://selva-tree.test/api/admin/rooms', { headers: authHeaders });
  const roomsRes = await worker.fetch(roomsReq, env);
  assert.equal(roomsRes.status, 200);
  const roomsData = await roomsRes.json();
  assert.equal(roomsData.rooms.length, 10, 'Pre-configured with exactly 10 rooms');
  assert.equal(roomsData.rooms[0].room_number, '101');
  assert.equal(roomsData.rooms[9].room_number, '205');

  // 3. Create Reservation
  const bookReq = new Request('https://selva-tree.test/api/admin/bookings', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      room_id: 1,
      guest_name: 'Dr. Vikram Malhotra',
      guest_phone: '+919876543210',
      guest_email: 'vikram@example.com',
      check_in: '2026-10-10',
      check_out: '2026-10-12',
      num_guests: 2,
    }),
  });
  const bookRes = await worker.fetch(bookReq, env);
  assert.equal(bookRes.status, 201);
  const bookData = await bookRes.json();
  assert.ok(bookData.booking.booking_reference.startsWith('ST-'));
  assert.equal(bookData.booking.total_price, 13000); // 2 nights * 6500

  // 4. Double booking collision prevention
  const collideReq = new Request('https://selva-tree.test/api/admin/bookings', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      room_id: 1,
      guest_name: 'Second Guest',
      guest_phone: '+919876500000',
      check_in: '2026-10-11',
      check_out: '2026-10-13',
    }),
  });
  const collideRes = await worker.fetch(collideReq, env);
  assert.equal(collideRes.status, 409, 'Rejects conflicting stay dates');

  // 5. Query 3-Month Inventory Matrix
  const invReq = new Request('https://selva-tree.test/api/admin/inventory?start_date=2026-10-01&end_date=2026-12-31', {
    headers: authHeaders,
  });
  const invRes = await worker.fetch(invReq, env);
  assert.equal(invRes.status, 200);
  const invData = await invRes.json();
  assert.equal(invData.rooms.length, 10);
  assert.ok(invData.inventory['1_2026-10-10']);
  assert.equal(invData.inventory['1_2026-10-10'].status, 'booked');

  // 6. Check Dashboard Stats
  const statsReq = new Request('https://selva-tree.test/api/admin/stats', { headers: authHeaders });
  const statsRes = await worker.fetch(statsReq, env);
  assert.equal(statsRes.status, 200);
  const statsData = await statsRes.json();
  assert.equal(statsData.total_rooms, 10);
  assert.equal(statsData.active_bookings_count, 1);
  assert.equal(statsData.total_revenue, 13000);
});
