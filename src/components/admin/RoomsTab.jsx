import React from 'react';
import { BedDouble, Users, Check, Sparkles, Plus, ShieldCheck } from 'lucide-react';

export default function RoomsTab({ rooms, onOpenBatchInventory, onOpenNewBooking }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      <div className="unt-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-950 font-serif">
            Estate Suite Inventory Master (10 Rooms)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Estate suite configurations, live capacities, and standard nightly base rates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenBatchInventory} className="unt-btn-secondary text-xs">
            Batch Rate/Block
          </button>
          <button onClick={onOpenNewBooking} className="unt-btn-primary text-xs">
            + Reserve Room
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((room) => (
          <div key={room.id} className="unt-card p-5 flex flex-col justify-between hover:border-gray-300 transition-all shadow-xs">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-block font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                    Room {room.room_number}
                  </div>
                  <h3 className="font-serif font-medium text-base text-gray-900 mt-2">
                    {room.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-stone-900 font-serif">
                    {formatCurrency(room.base_price)}
                  </div>
                  <div className="text-[10px] text-gray-400">/ night</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                <span className="unt-badge unt-badge-gray text-[10px]">
                  {room.room_type}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                  <Users className="w-3.5 h-3.5" />
                  <span>Max {room.capacity} Guests</span>
                </span>
                <span className="text-[11px] text-gray-400">Floor {room.floor}</span>
              </div>

              <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                {room.description}
              </p>

              {/* Amenities chips */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                {Array.isArray(room.amenities) &&
                  room.amenities.map((am, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md border border-gray-100"
                    >
                      {am}
                    </span>
                  ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Active Suite</span>
              </span>
              <button
                onClick={onOpenNewBooking}
                className="text-xs font-semibold text-stone-900 hover:text-amber-700 transition-colors"
              >
                Book this room →
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
