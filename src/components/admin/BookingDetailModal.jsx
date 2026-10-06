import React, { useState } from 'react';
import {
  X,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Trash2,
  CheckCircle,
  Clock,
  User,
  BedDouble,
  AlertTriangle,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export default function BookingDetailModal({
  booking,
  open,
  onClose,
  onUpdated,
}) {
  const [status, setStatus] = useState(booking?.status || 'confirmed');
  const [paymentStatus, setPaymentStatus] = useState(booking?.payment_status || 'pending');
  const [specialRequests, setSpecialRequests] = useState(booking?.special_requests || '');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState('');

  if (!open || !booking) return null;

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.updateBooking(booking.id, {
        status,
        payment_status: paymentStatus,
        special_requests: specialRequests,
      });
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.deleteBooking(booking.id);
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete booking.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-gray-900">
                {booking.booking_reference}
              </span>
              <span
                className={`unt-badge ${
                  booking.status === 'confirmed'
                    ? 'unt-badge-green'
                    : booking.status === 'checked_in'
                    ? 'unt-badge-blue'
                    : booking.status === 'checked_out'
                    ? 'unt-badge-gray'
                    : 'unt-badge-rose'
                }`}
              >
                {booking.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Guest Reservation Overview
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Guest Information Card */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-medium text-base text-gray-900">
                {booking.guest_name}
              </span>
              <span className="text-xs font-semibold text-stone-900 font-mono">
                Room {booking.room_number}
              </span>
            </div>
            <div className="text-xs text-gray-600 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <a href={`tel:${booking.guest_phone}`} className="hover:underline">
                  {booking.guest_phone}
                </a>
              </div>
              {booking.guest_email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <a href={`mailto:${booking.guest_email}`} className="hover:underline">
                    {booking.guest_email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Stay & Room Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                Stay Schedule
              </span>
              <div className="font-semibold text-gray-900 mt-1">
                {booking.check_in} → {booking.check_out}
              </div>
              <div className="text-gray-500 mt-0.5">{booking.num_guests} Guests</div>
            </div>

            <div className="p-3 rounded-lg border border-gray-100 bg-gray-50/50">
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                Billing & Rate
              </span>
              <div className="font-semibold text-gray-900 font-serif text-sm mt-1">
                {formatCurrency(booking.total_price)}
              </div>
              <div className="text-gray-500 mt-0.5 capitalize">{booking.payment_method || 'Card'}</div>
            </div>
          </div>

          {/* Manage Status & Payment Form */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reservation Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="unt-select text-xs"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="checked_in">Checked In (Guest In-House)</option>
                  <option value="checked_out">Checked Out (Completed)</option>
                  <option value="cancelled">Cancelled (Release Room)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="unt-select text-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid (Full)</option>
                  <option value="partial">Partial Advance</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Special Requests / Notes
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Notes regarding this reservation..."
                className="unt-input text-xs"
              />
            </div>
          </div>

          {/* Danger Zone: Delete Booking */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            {deleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600 font-medium">Permanently delete?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  className="px-2 py-1 text-gray-600 text-xs hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="text-xs text-gray-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Reservation</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="unt-btn-secondary text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="unt-btn-primary text-xs"
              >
                {loading ? 'Saving...' : 'Update Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
