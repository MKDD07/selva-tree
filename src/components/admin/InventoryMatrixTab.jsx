import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Phone,
  User,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

export default function InventoryMatrixTab({
  rooms,
  inventoryData,
  loading,
  onRefresh,
  onOpenNewBookingWithPrefill,
  onSelectBookingById,
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewDays, setViewDays] = useState(30); // 14, 30, 60, 90
  const [startDateOffset, setStartDateOffset] = useState(0);
  const [togglingRoomId, setTogglingRoomId] = useState(null);

  const { dates, monthGroups } = useMemo(() => {
    const arr = [];
    const todayD = new Date();
    const start = new Date(todayD);
    start.setDate(todayD.getDate() + startDateOffset);

    for (let i = 0; i < viewDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const dayNum = d.getDate();
      const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const isToday = d.toISOString().slice(0, 10) === todayD.toISOString().slice(0, 10);
      arr.push({ date: d, iso, dayNum, dayName, monthName, isWeekend, isToday });
    }

    const groups = [];
    let currentMonth = '';
    let currentCount = 0;
    arr.forEach((d) => {
      const m = d.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (m !== currentMonth) {
        if (currentMonth) groups.push({ name: currentMonth, count: currentCount });
        currentMonth = m;
        currentCount = 1;
      } else {
        currentCount++;
      }
    });
    if (currentMonth) groups.push({ name: currentMonth, count: currentCount });

    return { dates: arr, monthGroups: groups };
  }, [viewDays, startDateOffset]);

  const handlePrev = () => setStartDateOffset((prev) => Math.max(0, prev - 14));
  const handleNext = () => setStartDateOffset((prev) => Math.min(90 - viewDays, prev + 14));
  const handleResetToday = () => {
    setStartDateOffset(0);
    setSelectedDate(today);
  };

  const handleQuickToggle = async (roomId, isCurrentlyBooked) => {
    setTogglingRoomId(roomId);
    try {
      const action = isCurrentlyBooked ? 'release' : 'book';
      await adminApi.quickToggle({
        room_id: roomId,
        date: selectedDate,
        action,
        guest_name: isCurrentlyBooked ? '' : 'Desk Reservation',
      });
      if (onRefresh) await onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update availability.');
    } finally {
      setTogglingRoomId(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Count available suites for the selected date
  const availableCountForSelectedDate = rooms.filter((r) => {
    const inv = inventoryData?.[`${r.id}_${selectedDate}`];
    return !inv || (inv.status !== 'booked' && !inv.booking_id);
  }).length;

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Real-time Date Bar & Quick Availability Manager for selected date */}
      <div className="unt-card p-5 bg-gradient-to-b from-white to-gray-50/60 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-serif font-medium text-gray-950">
                10-Suites Realtime Availability Control
              </h2>
              <span className="unt-badge unt-badge-green text-[10px]">
                ● Live Real-Time
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Toggle suite presence manually. All changes immediately sync live for customer bookings.
            </p>
          </div>

          {/* Date Picker Control */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-xs">
              <CalendarIcon className="w-4 h-4 text-amber-700" />
              <label htmlFor="selected-target-date" className="text-xs text-gray-500 font-medium">Target Date:</label>
              <input
                id="selected-target-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-semibold text-gray-900 border-none bg-transparent focus:outline-none cursor-pointer"
              />
            </div>
            <button
              onClick={() => setSelectedDate(today)}
              className="px-2.5 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-xs transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* Selected Date Summary & 10 Suite Quick Status Cards */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-gray-600 font-medium">
              Status for <strong className="text-gray-900">{selectedDate}</strong>:
            </span>
            <span className="font-semibold text-emerald-700">
              {availableCountForSelectedDate} of {rooms.length} Suites Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {rooms.map((room) => {
              const inv = inventoryData?.[`${room.id}_${selectedDate}`];
              const isBooked = inv?.status === 'booked' || Boolean(inv?.booking_id);
              const isToggling = togglingRoomId === room.id;

              return (
                <div
                  key={room.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isBooked
                      ? 'bg-stone-900 text-white border-stone-800 shadow-sm'
                      : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                          isBooked ? 'bg-stone-800 text-amber-300' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        Room {room.room_number}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isBooked
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isBooked ? 'Booked' : 'Available'}
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-serif font-medium truncate">
                      {room.name}
                    </div>

                    {isBooked ? (
                      <div className="mt-1 text-[11px] text-stone-300 truncate">
                        Guest: <strong className="text-white">{inv?.guest_name || 'Reserved'}</strong>
                      </div>
                    ) : (
                      <div className="mt-1 text-[11px] text-gray-400">
                        {room.room_type} • {room.capacity} Guests
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-100/20">
                    <button
                      disabled={isToggling || loading}
                      onClick={() => handleQuickToggle(room.id, isBooked)}
                      className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isBooked
                          ? 'bg-stone-800 hover:bg-rose-900/80 text-stone-200 hover:text-white border border-stone-700'
                          : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
                      }`}
                    >
                      {isToggling ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : isBooked ? (
                        <span>Release Suite</span>
                      ) : (
                        <span>+ Mark Booked</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Full 3-Month Interactive Matrix */}
      <div className="space-y-3">
        <div className="unt-card p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-xs">
              <button
                onClick={handlePrev}
                disabled={startDateOffset <= 0}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md disabled:opacity-30"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetToday}
                className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Today
              </button>
              <button
                onClick={handleNext}
                disabled={startDateOffset + viewDays >= 90}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md disabled:opacity-30"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View Horizon */}
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium">
              {[
                { label: '14 Days', val: 14 },
                { label: '30 Days', val: 30 },
                { label: '60 Days', val: 60 },
                { label: '90 Days', val: 90 },
              ].map((v) => (
                <button
                  key={v.val}
                  onClick={() => {
                    setViewDays(v.val);
                    if (startDateOffset + v.val > 90) setStartDateOffset(90 - v.val);
                  }}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    viewDays === v.val
                      ? 'bg-white text-gray-950 font-semibold shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-xs transition-colors"
              title="Refresh availability"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Minimal Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
              <span className="font-medium text-gray-900">Booked (Reserved)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              <span className="text-gray-500">Available</span>
            </div>
          </div>
        </div>

        {/* 10 Suites Calendar Grid */}
        <div className="unt-card overflow-hidden border border-gray-200">
          <div className="overflow-x-auto matrix-scroll">
            <div className="min-w-fit">
              {/* Header: Months */}
              <div className="flex border-b border-gray-200 bg-gray-50/80 text-xs font-semibold text-gray-700">
                <div className="w-60 min-w-[15rem] sticky left-0 z-20 bg-gray-50/95 backdrop-blur px-4 py-2 border-r border-gray-200 flex items-center justify-between">
                  <span>10 Suites</span>
                  <span className="text-[11px] font-normal text-gray-400">Capacity</span>
                </div>
                <div className="flex">
                  {monthGroups.map((g, idx) => (
                    <div
                      key={idx}
                      className="border-r border-gray-200 px-3 py-2 text-center uppercase tracking-wider text-[10px] font-semibold text-gray-500 bg-gray-100/50"
                      style={{ width: `${g.count * 44}px` }}
                    >
                      {g.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Header: Dates */}
              <div className="flex border-b border-gray-200 bg-white text-xs font-medium text-gray-600">
                <div className="w-60 min-w-[15rem] sticky left-0 z-20 bg-white px-4 py-2 border-r border-gray-200 text-[11px] text-gray-400">
                  Click cell to select date
                </div>
                <div className="flex">
                  {dates.map((d) => (
                    <div
                      key={d.iso}
                      onClick={() => setSelectedDate(d.iso)}
                      className={`w-11 min-w-[2.75rem] py-2 text-center border-r border-gray-100 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        d.iso === selectedDate
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : d.isToday
                          ? 'bg-amber-100/70 text-amber-900 font-bold'
                          : d.isWeekend
                          ? 'bg-gray-50 text-gray-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-[9px] uppercase opacity-75">{d.dayName}</span>
                      <span className="text-xs font-semibold">{d.dayNum}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 10 Room Rows */}
              <div className="divide-y divide-gray-100">
                {rooms.map((room) => (
                  <div key={room.id} className="flex hover:bg-gray-50/40 transition-colors">
                    {/* Left Suite Info */}
                    <div className="w-60 min-w-[15rem] sticky left-0 z-10 bg-white px-4 py-3 border-r border-gray-200 flex items-center justify-between shadow-xs">
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-stone-900 px-1.5 py-0.5 bg-stone-100 rounded">
                            {room.room_number}
                          </span>
                          <span className="text-xs font-semibold text-gray-900 truncate">
                            {room.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {room.room_type}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[11px] text-gray-400">
                          {room.capacity} Guests
                        </div>
                      </div>
                    </div>

                    {/* Date Cells */}
                    <div className="flex">
                      {dates.map((d) => {
                        const key = `${room.id}_${d.iso}`;
                        const inv = inventoryData?.[key];
                        const isBooked = inv?.status === 'booked' || Boolean(inv?.booking_id);

                        if (isBooked) {
                          return (
                            <div
                              key={d.iso}
                              onClick={() => {
                                setSelectedDate(d.iso);
                                if (inv?.booking_id) onSelectBookingById(inv.booking_id);
                              }}
                              className="w-11 min-w-[2.75rem] h-12 border-r border-gray-100 p-0.5 flex flex-col items-center justify-center bg-stone-900 text-white cursor-pointer hover:bg-stone-800 transition-colors"
                              title={`Booked: ${inv.guest_name || 'Guest'} (${inv.booking_reference || 'Ref'})`}
                            >
                              <span className="text-[9px] font-semibold tracking-tight truncate w-full px-1 text-center text-amber-200">
                                {inv.guest_name ? inv.guest_name.split(' ')[0] : 'Booked'}
                              </span>
                              <span className="text-[8px] text-stone-400 font-mono">
                                {inv.booking_reference ? inv.booking_reference.slice(-4) : 'RES'}
                              </span>
                            </div>
                          );
                        }

                        // Available Clean Cell
                        return (
                          <div
                            key={d.iso}
                            onClick={() => {
                              setSelectedDate(d.iso);
                              onOpenNewBookingWithPrefill(room.id, d.iso);
                            }}
                            className={`w-11 min-w-[2.75rem] h-12 border-r border-gray-100 flex items-center justify-center cursor-pointer transition-all hover:bg-amber-50/70 group ${
                              d.iso === selectedDate
                                ? 'bg-amber-50/50'
                                : d.isWeekend
                                ? 'bg-gray-50/40'
                                : 'bg-white'
                            }`}
                            title={`Available. Click to reserve Room ${room.room_number} for ${d.iso}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:hidden transition-colors" />
                            <Plus className="w-3 h-3 text-amber-700 hidden group-hover:block transition-all" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
