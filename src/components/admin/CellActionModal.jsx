import React, { useState } from 'react';
import { X, Calendar, Plus, Lock, Unlock, Wrench, DollarSign, Check, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export default function CellActionModal({
  open,
  onClose,
  cellData, // { room, date, inventory }
  onOpenBookingPrefill,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [customPrice, setCustomPrice] = useState(
    cellData?.inventory?.price_override || ''
  );
  const [note, setNote] = useState(cellData?.inventory?.note || '');
  const [error, setError] = useState('');

  if (!open || !cellData) return null;

  const { room, date, inventory } = cellData;
  const currentStatus = inventory?.status || 'available';
  const effectivePrice = inventory?.price_override || room.base_price;

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    setError('');
    try {
      await adminApi.batchUpdateInventory({
        room_ids: [room.id],
        start_date: date,
        end_date: date,
        status: newStatus,
        price_override: customPrice ? Number(customPrice) : null,
        note,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update cell.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrice = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.batchUpdateInventory({
        room_ids: [room.id],
        start_date: date,
        end_date: date,
        status: currentStatus,
        price_override: customPrice ? Number(customPrice) : null,
        note,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save rate.');
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
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-stone-900 text-white px-2 py-0.5 rounded">
                Room {room.room_number}
              </span>
              <span className="font-serif font-medium text-sm text-gray-900">
                {room.name}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{date}</span>
              <span>•</span>
              <span className="capitalize font-medium text-gray-700">Status: {currentStatus}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Quick Reserve CTA */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBookingPrefill(room.id, date);
            }}
            className="w-full unt-btn-primary flex items-center justify-center gap-2 py-2.5 text-xs shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Reservation for {date}</span>
          </button>

          {/* Quick Status Toggle Actions */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Quick Status Toggles
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleUpdateStatus('available')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  currentStatus === 'available'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Check className="w-4 h-4 text-emerald-600 mb-1" />
                <span>Available</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleUpdateStatus('blocked')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  currentStatus === 'blocked'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Lock className="w-4 h-4 text-amber-600 mb-1" />
                <span>Hold / Block</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleUpdateStatus('maintenance')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  currentStatus === 'maintenance'
                    ? 'border-rose-500 bg-rose-50 text-rose-800 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Wrench className="w-4 h-4 text-rose-600 mb-1" />
                <span>Maintenance</span>
              </button>
            </div>
          </div>

          {/* Nightly Price Override */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <label className="block text-xs font-semibold text-gray-700">
              Custom Nightly Rate (Base: {formatCurrency(room.base_price)})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder={`₹${room.base_price}`}
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="unt-input text-xs flex-1"
              />
              <button
                type="button"
                disabled={loading}
                onClick={handleSavePrice}
                className="unt-btn-secondary text-xs py-2.5 px-3"
              >
                Save Rate
              </button>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Internal Cell Note
            </label>
            <input
              type="text"
              placeholder="e.g. VIP reservation inquiry hold"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="unt-input text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
