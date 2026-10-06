import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export default function NewBookingModal({
  open,
  onClose,
  rooms,
  prefillRoomId,
  prefillDate,
  onSuccess,
}) {
  const [roomId, setRoomId] = useState(prefillRoomId || (rooms[0]?.id || 1));
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  
  // Date default
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState(prefillDate || today);
  const [checkOut, setCheckOut] = useState(
    prefillDate
      ? new Date(new Date(prefillDate).getTime() + 86400000).toISOString().slice(0, 10)
      : tomorrow
  );
  
  const [numGuests, setNumGuests] = useState(2);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [specialRequests, setSpecialRequests] = useState('');
  const [source, setSource] = useState('direct');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefillRoomId) setRoomId(prefillRoomId);
    if (prefillDate) {
      setCheckIn(prefillDate);
      const nextDay = new Date(new Date(prefillDate).getTime() + 86400000).toISOString().slice(0, 10);
      setCheckOut(nextDay);
    }
  }, [prefillRoomId, prefillDate, open]);

  if (!open) return null;

  const selectedRoom = rooms.find((r) => String(r.id) === String(roomId)) || rooms[0];

  // Calculate estimated nights and total
  const nightsCount = Math.max(
    1,
    Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) || 1
  );
  const estimatedTotal = (selectedRoom?.base_price || 6500) * nightsCount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminApi.createBooking({
        room_id: Number(roomId),
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in: checkIn,
        check_out: checkOut,
        num_guests: Number(numGuests),
        total_price: estimatedTotal,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        special_requests: specialRequests,
        source,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create booking.');
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
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div>
            <h3 className="font-serif font-medium text-lg text-gray-900">
              Create New Hotel Reservation
            </h3>
            <p className="text-xs text-gray-500">
              Allocates suite and locks date availability.
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
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Room Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Room (10 Hotel Suites)
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              className="unt-select text-xs"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.room_number} - {r.name} ({r.room_type} • {formatCurrency(r.base_price)}/nt)
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Check-in Date
              </label>
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="unt-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Check-out Date
              </label>
              <input
                type="date"
                required
                min={checkIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="unt-input text-xs"
              />
            </div>
          </div>

          {/* Guest Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Guest Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vikramaditya Rathore"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="unt-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Guest Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98110 XXXXX"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="unt-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="guest@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="unt-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Number of Guests
              </label>
              <select
                value={numGuests}
                onChange={(e) => setNumGuests(e.target.value)}
                className="unt-select text-xs"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests (Standard)</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests (Villa Max)</option>
              </select>
            </div>
          </div>

          {/* Payment & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <option value="paid">Paid</option>
                <option value="partial">Partial Advance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="unt-select text-xs"
              >
                <option value="credit_card">Credit Card</option>
                <option value="upi">UPI / Net Banking</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Pay at Estate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Booking Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="unt-select text-xs"
              >
                <option value="direct">Direct Call / Desk</option>
                <option value="website">Website Form</option>
                <option value="vip">VIP / Corporate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Special Requests / Dietary Preferences
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Late check-in 8 PM, poolside flower arrangement..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="unt-input text-xs"
            />
          </div>

          {/* Pricing Summary Box */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-gray-900">
                {nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'} Stay ({checkIn} → {checkOut})
              </div>
              <div className="text-gray-500 text-[11px]">
                {selectedRoom?.name} @ {formatCurrency(selectedRoom?.base_price)}/nt
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-950 font-serif">
                {formatCurrency(estimatedTotal)}
              </div>
              <div className="text-[10px] text-gray-400">Total payable</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="unt-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="unt-btn-primary text-xs"
            >
              {loading ? 'Confirming Reservation...' : 'Confirm & Lock Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
