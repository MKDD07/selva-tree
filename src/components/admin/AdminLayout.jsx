import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BookmarkCheck,
  BedDouble,
  SlidersHorizontal,
  LogOut,
  ExternalLink,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { clearSession } from '../../services/adminApi';
import logoDark from '../../assets/logo/logo-dark.svg';

export default function AdminLayout({
  activeTab,
  setActiveTab,
  user,
  onOpenNewBooking,
  onOpenBatchInventory,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'inventory', name: '10 Suites Matrix (3M)', icon: CalendarDays },
    { id: 'bookings', name: 'Reservations', icon: BookmarkCheck },
    { id: 'overview', name: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'rooms', name: 'Suites Directory', icon: BedDouble },
  ];

  const handleLogout = () => {
    clearSession();
    window.location.href = '/admin-login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans antialiased text-gray-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 z-30">
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <img
              src={logoDark}
              alt="Selva Tree"
              className="h-8 w-auto object-contain"
            />
          </div>
          <span className="unt-badge unt-badge-green text-[10px] px-2 py-0.5 font-medium">
            Active
          </span>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={onOpenNewBooking}
            className="w-full unt-btn-primary flex items-center justify-center gap-2 py-2.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Booking & Inventory
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isActive ? 'bg-stone-800 text-amber-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/70">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-xs font-semibold text-stone-800">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-gray-900 truncate">
                  {user?.name || 'Estate Manager'}
                </div>
                <div className="text-[11px] text-gray-500 capitalize truncate">
                  {user?.role || 'Admin'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 py-1.5 rounded-md hover:bg-white border border-transparent hover:border-gray-200 transition-all"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find((n) => n.id === activeTab)?.name || 'Dashboard'}
              </h1>
              <span className="hidden sm:inline-block text-xs px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md font-medium">
                10 Suites Matrix
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenBatchInventory}
              className="unt-btn-secondary text-xs py-2 px-3 hidden sm:flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
              <span>Block / Set Rates</span>
            </button>

            <button
              onClick={onOpenNewBooking}
              className="unt-btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Room</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 p-4 space-y-1 shadow-lg">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-stone-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Signed in as {user?.name || 'Admin'}</span>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-600 font-medium hover:underline"
              >
                Sign out
              </button>
            </div>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
