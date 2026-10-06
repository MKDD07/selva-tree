// Admin API Client for Hotel Booking & 10-Room D1 Inventory

const TOKEN_KEY = 'selva_admin_token';
const USER_KEY = 'selva_admin_user';

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      clearSession();
      window.location.href = '/admin-login';
    }
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data;
}

export const adminApi = {
  async login(username, password) {
    const res = await request('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res.token && res.user) {
      saveSession(res.token, res.user);
    }
    return res;
  },

  async me() {
    return request('/api/admin/auth/me');
  },

  async getRooms() {
    return request('/api/admin/rooms');
  },

  async getInventory(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    return request(`/api/admin/inventory?${params.toString()}`);
  },

  async batchUpdateInventory(payload) {
    return request('/api/admin/inventory/batch-update', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async quickToggle(payload) {
    return request('/api/admin/inventory/quick-toggle', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getBookings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.roomId) params.set('room_id', filters.roomId);
    if (filters.fromDate) params.set('from_date', filters.fromDate);
    if (filters.toDate) params.set('to_date', filters.toDate);
    return request(`/api/admin/bookings?${params.toString()}`);
  },

  async createBooking(bookingData) {
    return request('/api/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async updateBooking(bookingId, updates) {
    return request(`/api/admin/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteBooking(bookingId) {
    return request(`/api/admin/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  },

  async getStats() {
    return request('/api/admin/stats');
  },
};
