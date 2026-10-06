import React, { useState } from 'react';
import { X, SlidersHorizontal, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export default function BatchInventoryModal({
  open,
  onClose,
  rooms,
  onSuccess,
}) {
  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const [selectedRoomIds, setSelectedRoomIds] = useState(rooms.map((r) => r.id));
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextWeek);
  const [status, setStatus] = useState('blocked');
  const [customPrice, setCustomPrice] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleToggleAllRooms = () => {
    if (selectedRoomIds.length === rooms.length) {
      setSelectedRoomIds([]);
    } else {
      setSelectedRoomIds(rooms.map((r) => r.id));
    }
  };

  const handleToggleRoom = (id) => {
    if (selectedRoomIds.includes(id)) {
      setSelectedRoomIds(selectedRoomIds.filter((rId) => rId !== id));
    } else {
      setSelectedRoomIds([...selectedRoomIds, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRoomIds.length === 0) {
      setError('Please select at least one room.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await adminApi.batchUpdateInventory({
        room_ids: selectedRoomIds,
        start_date: startDate,
        end_date: endDate,
        status,
        price_override: customPrice ? Number(customPrice) : null,
        note,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update inventory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div>
            <h3 className="font-serif font-medium text-lg text-gray-900">
              Batch Inventory & Rate Controls
            </h3>
            <p className="text-xs text-gray-500">
              Bulk update availability, maintenance, or pricing for selected rooms & dates.
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
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Room Selector Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-700">
                Target Rooms ({selectedRoomIds.length}/{rooms.length} Selected)
              </label>
              <button
                type="button"
                onClick={handleToggleAllRooms}
                className="text-[11px] font-semibold text-stone-900 hover:underline"
              >
                {selectedRoomIds.length === rooms.length ? 'Deselect All' : 'Select All 10 Rooms'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-gray-50 rounded-xl border border-gray-200">
              {rooms.map((r) => {
                const isSelected = selectedRoomIds.includes(r.id);
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => handleToggleRoom(r.id)}
                    className={`flex items-center justify-center p-2 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white font-semibold shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>Room {r.room_number}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="unt-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="unt-input text-xs"
              />
            </div>
          </div>

          {/* Action Status Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Set Inventory Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="unt-select text-xs"
              >
                <option value="available">Mark Available (Standard)</option>
                <option value="blocked">Mark Blocked (Private Hold)</option>
                <option value="maintenance">Mark Maintenance Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Price Override / Night (Optional ₹)
              </label>
              <input
                type="number"
                placeholder="Leave blank for base rate"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="unt-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Internal Note / Reason
            </label>
            <input
              type="text"
              placeholder="e.g. Corporate wedding block, Deep sanitization, Weekend rate surge..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="unt-input text-xs"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
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
              {loading ? 'Applying Batch Changes...' : 'Apply Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
