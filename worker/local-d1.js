import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const DB_FILE = '.dev-db.json';

// In-memory + persisted JSON D1 Mock for Vite dev mode
export class LocalD1 {
  constructor() {
    this.tables = {
      rooms: [],
      bookings: [],
      room_inventory: [],
      admin_users: [],
      inquiries: [],
    };
    this._ready = this.load();
  }

  async load() {
    try {
      if (existsSync(DB_FILE)) {
        const raw = await readFile(DB_FILE, 'utf8');
        this.tables = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not load local dev database, starting fresh:', e.message);
    }
  }

  async save() {
    try {
      await writeFile(DB_FILE, JSON.stringify(this.tables, null, 2), 'utf8');
    } catch (e) {
      console.warn('Could not save local dev database:', e.message);
    }
  }

  prepare(sql) {
    const self = this;
    return {
      bind(...args) {
        return {
          async run() {
            const res = await self.executeSql(sql, args);
            await self.save();
            return res;
          },
          async first() {
            const res = await self.executeSql(sql, args);
            return res?.results?.[0] || null;
          },
          async all() {
            return self.executeSql(sql, args);
          },
        };
      },
      async run() {
        const res = await self.executeSql(sql, []);
        await self.save();
        return res;
      },
      async first() {
        const res = await self.executeSql(sql, []);
        return res?.results?.[0] || null;
      },
      async all() {
        return self.executeSql(sql, []);
      },
    };
  }

  async executeSql(sql, args) {
    const s = sql.replace(/\s+/g, ' ').trim();

    if (s.startsWith('CREATE TABLE')) {
      return { success: true };
    }

    if (s.includes('SELECT COUNT(*) as count FROM rooms')) {
      return { results: [{ count: this.tables.rooms?.length || 0 }] };
    }

    if (s.includes('SELECT COUNT(*) as count FROM admin_users')) {
      return { results: [{ count: this.tables.admin_users?.length || 0 }] };
    }

    if (s.includes('INSERT INTO rooms')) {
      const [id, room_number, name, room_type, base_price, capacity, floor, description, amenities] = args;
      if (!this.tables.rooms) this.tables.rooms = [];
      const existing = this.tables.rooms.find(r => r.id === id || r.room_number === room_number);
      if (!existing) {
        this.tables.rooms.push({ id, room_number, name, room_type, base_price, capacity, floor, description, amenities, is_active: 1 });
      }
      return { success: true };
    }

    if (s.includes('INSERT INTO admin_users')) {
      const [hash] = args;
      if (!this.tables.admin_users) this.tables.admin_users = [];
      if (this.tables.admin_users.length === 0) {
        this.tables.admin_users.push({ id: 1, username: 'admin', password_hash: hash, name: 'Estate Manager', role: 'admin' });
      }
      return { success: true };
    }

    if (s.includes('SELECT id, username, name, role FROM admin_users WHERE username = ?')) {
      const [username, hash] = args;
      const user = (this.tables.admin_users || []).find(u =>
        u.username === username && (hash === undefined || u.password_hash === hash)
      );
      return { results: user ? [user] : [] };
    }

    if (s.includes('FROM rooms WHERE is_active = 1') || s.includes('SELECT * FROM rooms ORDER BY id ASC')) {
      return { results: [...(this.tables.rooms || [])] };
    }

    if (s.includes('SELECT * FROM rooms WHERE id = ?')) {
      const [id] = args;
      const room = (this.tables.rooms || []).find(r => r.id === Number(id));
      return { results: room ? [room] : [] };
    }

    if (s.includes('SELECT status, booking_id FROM room_inventory WHERE id = ?')) {
      const [id] = args;
      const inv = (this.tables.room_inventory || []).find(i => i.id === id);
      return { results: inv ? [inv] : [] };
    }

    if (s.includes('INSERT INTO bookings')) {
      const [id, ref, room_id, guest_name, guest_email, guest_phone, check_in, check_out, num_guests, total_price, payment_status, payment_method, special_requests, source] = args;
      if (!this.tables.bookings) this.tables.bookings = [];
      this.tables.bookings.push({
        id, booking_reference: ref, room_id: Number(room_id), guest_name, guest_email, guest_phone,
        check_in, check_out, num_guests: Number(num_guests), total_price: Number(total_price),
        status: 'confirmed', payment_status, payment_method, special_requests, source,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      });
      return { success: true };
    }

    if (s.includes('INSERT INTO inquiries')) {
      const [id, name, phone, email, check_in, check_out, guests, promo, notes, nights] = args;
      if (!this.tables.inquiries) this.tables.inquiries = [];
      this.tables.inquiries.push({ id, name, phone, email, check_in, check_out, guests, promo, notes, nights, status: 'new', created_at: new Date().toISOString() });
      return { success: true };
    }

    if (s.includes('INSERT INTO room_inventory')) {
      if (!this.tables.room_inventory) this.tables.room_inventory = [];
      // Could be batch update or booking insert
      if (s.includes("'booked'")) {
        const [id, room_id, date, booking_id] = args;
        const existingIdx = this.tables.room_inventory.findIndex(i => i.id === id);
        const item = { id, room_id: Number(room_id), date, status: 'booked', booking_id, updated_at: new Date().toISOString() };
        if (existingIdx >= 0) this.tables.room_inventory[existingIdx] = item;
        else this.tables.room_inventory.push(item);
      } else {
        const [id, room_id, date, status, price_override, note] = args;
        const existingIdx = this.tables.room_inventory.findIndex(i => i.id === id);
        const item = { id, room_id: Number(room_id), date, status, price_override, note, updated_at: new Date().toISOString() };
        if (existingIdx >= 0) this.tables.room_inventory[existingIdx] = item;
        else this.tables.room_inventory.push(item);
      }
      return { success: true };
    }

    if (s.includes('DELETE FROM room_inventory WHERE id = ?')) {
      const [id] = args;
      if (this.tables.room_inventory) {
        this.tables.room_inventory = this.tables.room_inventory.filter(i => i.id !== id);
      }
      return { success: true };
    }

    if (s.includes('FROM room_inventory WHERE date IN')) {
      const dates = args;
      const rows = (this.tables.room_inventory || []).filter(i => dates.includes(i.date));
      return { results: rows };
    }

    if (s.includes('FROM room_inventory WHERE date >= ? AND date <= ?')) {
      const [start, end] = args;
      const rows = (this.tables.room_inventory || []).filter(i => i.date >= start && i.date <= end);
      return { results: rows };
    }

    if (s.includes('SELECT ri.*, b.booking_reference, b.guest_name')) {
      const [start, end] = args;
      const rows = (this.tables.room_inventory || [])
        .filter(i => i.date >= start && i.date <= end)
        .map(i => {
          const b = (this.tables.bookings || []).find(bk => bk.id === i.booking_id);
          return {
            ...i,
            booking_reference: b?.booking_reference,
            guest_name: b?.guest_name,
            guest_phone: b?.guest_phone,
            booking_status: b?.status,
            booking_total: b?.total_price,
          };
        });
      return { results: rows };
    }

    if (s.includes('FROM bookings b JOIN rooms r ON b.room_id = r.id')) {
      let rows = (this.tables.bookings || []).map(b => {
        const r = (this.tables.rooms || []).find(rm => rm.id === b.room_id);
        return {
          ...b,
          room_number: r?.room_number,
          room_name: r?.name,
          room_type: r?.room_type,
          base_price: r?.base_price,
        };
      });

      if (s.includes('b.check_in = ?')) {
        const [checkIn] = args;
        rows = rows.filter(b => b.check_in === checkIn && b.status !== 'cancelled');
      } else if (s.includes('b.check_out = ?')) {
        const [checkOut] = args;
        rows = rows.filter(b => b.check_out === checkOut && b.status !== 'cancelled');
      }

      return { results: rows };
    }

    if (s.includes('SELECT COUNT(*) as count, SUM(total_price) as total_revenue FROM bookings')) {
      const active = (this.tables.bookings || []).filter(b => b.status !== 'cancelled');
      const total_revenue = active.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
      return { results: [{ count: active.length, total_revenue }] };
    }

    if (s.includes('SELECT COUNT(*) as booked_count FROM room_inventory')) {
      const [today] = args;
      const booked_count = (this.tables.room_inventory || []).filter(i => i.status === 'booked' && i.date >= today).length;
      return { results: [{ booked_count }] };
    }

    if (s.includes('SELECT * FROM bookings WHERE id = ?')) {
      const [id] = args;
      const b = (this.tables.bookings || []).find(bk => bk.id === id);
      return { results: b ? [b] : [] };
    }

    if (s.includes('UPDATE bookings SET status = "cancelled"')) {
      const [id] = args;
      const b = (this.tables.bookings || []).find(bk => bk.id === id);
      if (b) {
        b.status = 'cancelled';
        b.updated_at = new Date().toISOString();
      }
      return { success: true };
    }

    if (s.includes('UPDATE bookings SET')) {
      const [status, paymentStatus, guestName, guestEmail, guestPhone, specialRequests, totalPrice, bookingId] = args;
      const b = (this.tables.bookings || []).find(bk => bk.id === bookingId);
      if (b) {
        b.status = status;
        b.payment_status = paymentStatus;
        b.guest_name = guestName;
        b.guest_email = guestEmail;
        b.guest_phone = guestPhone;
        b.special_requests = specialRequests;
        b.total_price = Number(totalPrice);
        b.updated_at = new Date().toISOString();
      }
      return { success: true };
    }

    if (s.includes('DELETE FROM room_inventory WHERE booking_id = ?')) {
      const [bookingId] = args;
      if (this.tables.room_inventory) {
        this.tables.room_inventory = this.tables.room_inventory.filter(i => i.booking_id !== bookingId);
      }
      return { success: true };
    }

    if (s.includes('DELETE FROM bookings WHERE id = ?')) {
      const [bookingId] = args;
      if (this.tables.bookings) {
        this.tables.bookings = this.tables.bookings.filter(b => b.id !== bookingId);
      }
      return { success: true };
    }

    return { results: [] };
  }
}
