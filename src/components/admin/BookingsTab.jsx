import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Ban,
  User,
  MoreVertical,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

export default function BookingsTab({
  bookings,
  rooms,
  loading,
  onRefresh,
  onOpenNewBooking,
  onSelectBooking,
  onUpdateStatus,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      searchTerm === '' ||
      b.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guest_phone.includes(searchTerm) ||
      b.guest_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || b.status === statusFilter;
    const matchesRoom = roomFilter === '' || String(b.room_id) === String(roomFilter);

    return matchesSearch && matchesStatus && matchesRoom;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters Bar */}
      <div className="unt-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by guest, phone, or reference (e.g. ST-123456)..."
              className="unt-input pl-9 text-xs"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="unt-select sm:w-40 text-xs"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Room Filter */}
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="unt-select sm:w-48 text-xs"
          >
            <option value="">All 10 Rooms</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                Room {r.room_number} - {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-xs"
            title="Refresh bookings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={onOpenNewBooking} className="unt-btn-primary text-xs py-2 px-3.5">
            <Plus className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="unt-card overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            No bookings found matching the current search/filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Guest Information</th>
                  <th className="py-3 px-4">Room Assigned</th>
                  <th className="py-3 px-4">Check-In / Out</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Booking Ref */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-gray-950">
                        {b.booking_reference}
                      </div>
                      <div className="text-[10px] text-gray-400 capitalize">
                        Source: {b.source || 'Direct'}
                      </div>
                    </td>

                    {/* Guest Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{b.guest_name}</div>
                      <div className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{b.guest_phone}</span>
                      </div>
                      {b.guest_email && (
                        <div className="text-gray-400 text-[10px] truncate max-w-[180px]">
                          {b.guest_email}
                        </div>
                      )}
                    </td>

                    {/* Room */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded text-[11px]">
                          {b.room_number}
                        </span>
                        <span className="font-medium text-gray-800">{b.room_name}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {b.num_guests} Guests
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800">
                        {b.check_in}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        to {b.check_out}
                      </div>
                    </td>

                    {/* Total Amount & Payment Status */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-950">
                        {formatCurrency(b.total_price)}
                      </div>
                      <span
                        className={`inline-block mt-0.5 text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          b.payment_status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.payment_status === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.payment_status || 'Pending'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`unt-badge ${
                          b.status === 'confirmed'
                            ? 'unt-badge-green'
                            : b.status === 'checked_in'
                            ? 'unt-badge-blue'
                            : b.status === 'checked_out'
                            ? 'unt-badge-gray'
                            : 'unt-badge-rose'
                        }`}
                      >
                        {b.status === 'confirmed' && 'Confirmed'}
                        {b.status === 'checked_in' && 'Checked In'}
                        {b.status === 'checked_out' && 'Checked Out'}
                        {b.status === 'cancelled' && 'Cancelled'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectBooking(b)}
                          className="px-2.5 py-1 text-xs font-semibold text-stone-900 hover:text-amber-800 hover:bg-stone-100 rounded-md transition-colors"
                        >
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
