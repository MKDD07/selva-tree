import React from 'react';
import {
  TrendingUp,
  Users,
  CreditCard,
  BedDouble,
  ArrowUpRight,
  LogIn,
  LogOut,
  Calendar,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function OverviewTab({
  stats,
  rooms,
  onNavigateTab,
  onSelectBooking,
  onOpenNewBooking,
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="unt-card bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estate Property Management System</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-normal text-white">
            Welcome to Selva Tree Booking & Inventory Hub
          </h2>
          <p className="mt-1 text-sm text-stone-300">
            Live inventory and reservation management for all 10 estate suites.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('inventory')}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>View Inventory Matrix</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenNewBooking}
              className="px-4 py-2 rounded-lg bg-stone-700/60 hover:bg-stone-700 border border-stone-600 text-stone-200 text-xs font-semibold transition-all"
            >
              + Create Reservation
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Metric KPI Cards (Untitled UI design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Occupancy Rate */}
        <div className="unt-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Occupancy (30 Days)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900 font-serif">
              {stats?.occupancy_rate_30d || 0}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">Target 75%</span>
          </div>
          <div className="mt-2 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats?.occupancy_rate_30d || 0)}%` }}
            />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="unt-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Reservations</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900 font-serif">
              {stats?.active_bookings_count || 0}
            </span>
            <span className="text-xs text-gray-500">Confirmed Stays</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Across 10 boutique suites</p>
        </div>

        {/* Total Revenue */}
        <div className="unt-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Booked Value</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-semibold text-gray-900 font-serif">
              {formatCurrency(stats?.total_revenue || 0)}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Verified pipeline value</p>
        </div>

        {/* Total Rooms Capacity */}
        <div className="unt-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900 font-serif">
              10 Rooms
            </span>
            <span className="text-xs text-emerald-600 font-medium">100% Online</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Max 90 days date tracking</p>
        </div>
      </div>

      {/* Today's Schedule: Check-ins & Check-outs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Arrivals */}
        <div className="unt-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <LogIn className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-gray-900">Today's Arrivals (Check-Ins)</h3>
            </div>
            <span className="unt-badge unt-badge-green">
              {stats?.today_checkins?.length || 0} Expected
            </span>
          </div>

          {stats?.today_checkins?.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs bg-gray-50 rounded-lg border border-dashed border-gray-200">
              No guest arrivals scheduled for today ({stats?.today || 'Today'}).
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats?.today_checkins?.map((bk) => (
                <div
                  key={bk.id}
                  onClick={() => onSelectBooking(bk)}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 transition-all cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{bk.guest_name}</div>
                    <div className="text-xs text-gray-500">
                      Room {bk.room_number} • {bk.room_name} • {bk.guest_phone}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="unt-badge unt-badge-blue text-[11px]">
                      {bk.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Departures */}
        <div className="unt-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-gray-900">Today's Departures (Check-Outs)</h3>
            </div>
            <span className="unt-badge unt-badge-amber">
              {stats?.today_checkouts?.length || 0} Expected
            </span>
          </div>

          {stats?.today_checkouts?.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs bg-gray-50 rounded-lg border border-dashed border-gray-200">
              No guest departures scheduled for today ({stats?.today || 'Today'}).
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats?.today_checkouts?.map((bk) => (
                <div
                  key={bk.id}
                  onClick={() => onSelectBooking(bk)}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 transition-all cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{bk.guest_name}</div>
                    <div className="text-xs text-gray-500">
                      Room {bk.room_number} • {bk.room_name} • {bk.guest_phone}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="unt-badge unt-badge-amber text-[11px]">
                      {bk.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Reservations Stream */}
      <div className="unt-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Recent Reservations</h3>
            <p className="text-xs text-gray-500">Latest guest stays and reservation activity</p>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-semibold text-stone-900 hover:text-stone-700 inline-flex items-center gap-1"
          >
            <span>View All Reservations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats?.recent_bookings?.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs bg-gray-50 rounded-lg border border-dashed border-gray-200">
            No bookings recorded yet. Click "+ Create Reservation" to add the first stay.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium bg-gray-50/50">
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Guest Name</th>
                  <th className="py-2.5 px-3">Room</th>
                  <th className="py-2.5 px-3">Stay Dates</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats?.recent_bookings?.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-gray-900">
                      {b.booking_reference}
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-900">
                      <div>{b.guest_name}</div>
                      <div className="text-[11px] text-gray-400 font-normal">{b.guest_phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-gray-800">Room {b.room_number}</span>
                      <div className="text-[11px] text-gray-400">{b.room_name}</div>
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      {b.check_in} → {b.check_out}
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-900">
                      {formatCurrency(b.total_price)}
                    </td>
                    <td className="py-3 px-3">
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
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectBooking(b)}
                        className="text-stone-900 hover:text-amber-700 font-semibold text-xs"
                      >
                        Details
                      </button>
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
