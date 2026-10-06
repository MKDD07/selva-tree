import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import OverviewTab from './OverviewTab';
import InventoryMatrixTab from './InventoryMatrixTab';
import BookingsTab from './BookingsTab';
import RoomsTab from './RoomsTab';
import NewBookingModal from './NewBookingModal';
import BookingDetailModal from './BookingDetailModal';
import BatchInventoryModal from './BatchInventoryModal';
import CellActionModal from './CellActionModal';
import { adminApi, getStoredToken, getStoredUser } from '../../services/adminApi';
import '../../styles/admin.css';

export default function AdminApp() {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [activeTab, setActiveTab] = useState('inventory'); // inventory, bookings, overview, rooms

  // Data states
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [inventoryData, setInventoryData] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [prefillRoomId, setPrefillRoomId] = useState(null);
  const [prefillDate, setPrefillDate] = useState(null);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [cellActionData, setCellActionData] = useState(null);

  // Toast message
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    if (!getStoredToken()) return;
    setLoading(true);
    setError(null);
    try {
      const [statsRes, roomsRes, invRes, bookingsRes] = await Promise.all([
        adminApi.getStats().catch((err) => { console.warn('Stats err:', err); return null; }),
        adminApi.getRooms().catch((err) => { console.warn('Rooms err:', err); return { rooms: [] }; }),
        adminApi.getInventory().catch((err) => { console.warn('Inventory err:', err); return { inventory: {} }; }),
        adminApi.getBookings().catch((err) => { console.warn('Bookings err:', err); return { bookings: [] }; }),
      ]);

      if (statsRes) setStats(statsRes);
      if (roomsRes?.rooms) setRooms(roomsRes.rooms);
      if (invRes?.inventory) setInventoryData(invRes.inventory);
      if (bookingsRes?.bookings) setBookings(bookingsRes.bookings);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, loadData]);

  // If not logged in, render the login view
  if (!token) {
    return (
      <AdminLogin
        onLoginSuccess={(loggedInUser) => {
          setToken(getStoredToken());
          setUser(loggedInUser);
        }}
      />
    );
  }

  const handleOpenNewBookingPrefill = (roomId, date) => {
    setPrefillRoomId(roomId);
    setPrefillDate(date);
    setNewBookingModalOpen(true);
  };

  const handleSelectBookingById = (bookingId) => {
    const bk = bookings.find((b) => b.id === bookingId);
    if (bk) {
      setSelectedBooking(bk);
    } else {
      // Fetch single or reload
      loadData().then(() => {
        const found = bookings.find((b) => b.id === bookingId);
        if (found) setSelectedBooking(found);
      });
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      user={user}
      onOpenNewBooking={() => {
        setPrefillRoomId(null);
        setPrefillDate(null);
        setNewBookingModalOpen(true);
      }}
      onOpenBatchInventory={() => setBatchModalOpen(true)}
    >
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-2">
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      {activeTab === 'overview' && (
        <OverviewTab
          stats={stats}
          rooms={rooms}
          onNavigateTab={setActiveTab}
          onSelectBooking={(bk) => setSelectedBooking(bk)}
          onOpenNewBooking={() => {
            setPrefillRoomId(null);
            setPrefillDate(null);
            setNewBookingModalOpen(true);
          }}
        />
      )}

      {activeTab === 'inventory' && (
        <InventoryMatrixTab
          rooms={rooms}
          inventoryData={inventoryData}
          loading={loading}
          onRefresh={loadData}
          onCellClick={(room, date, inv) => {
            setCellActionData({ room, date, inventory: inv });
          }}
          onOpenBatchModal={() => setBatchModalOpen(true)}
          onOpenNewBookingWithPrefill={handleOpenNewBookingPrefill}
          onSelectBookingById={handleSelectBookingById}
        />
      )}

      {activeTab === 'bookings' && (
        <BookingsTab
          bookings={bookings}
          rooms={rooms}
          loading={loading}
          onRefresh={loadData}
          onOpenNewBooking={() => {
            setPrefillRoomId(null);
            setPrefillDate(null);
            setNewBookingModalOpen(true);
          }}
          onSelectBooking={(bk) => setSelectedBooking(bk)}
        />
      )}

      {activeTab === 'rooms' && (
        <RoomsTab
          rooms={rooms}
          onOpenBatchInventory={() => setBatchModalOpen(true)}
          onOpenNewBooking={() => {
            setPrefillRoomId(null);
            setPrefillDate(null);
            setNewBookingModalOpen(true);
          }}
        />
      )}

      {activeTab === 'controls' && (
        <div className="space-y-6">
          <div className="unt-card p-6">
            <h2 className="text-lg font-serif font-medium text-gray-900">
              Inventory Rate & Block Controls
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl">
              Control booking availability rules, emergency maintenance, and seasonal rate overrides across all 10 suites.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setBatchModalOpen(true)}
                className="unt-btn-primary text-xs"
              >
                Launch Batch Inventory Controls Modal
              </button>
            </div>
          </div>

          <InventoryMatrixTab
            rooms={rooms}
            inventoryData={inventoryData}
            loading={loading}
            onRefresh={loadData}
            onCellClick={(room, date, inv) => {
              setCellActionData({ room, date, inventory: inv });
            }}
            onOpenBatchModal={() => setBatchModalOpen(true)}
            onOpenNewBookingWithPrefill={handleOpenNewBookingPrefill}
            onSelectBookingById={handleSelectBookingById}
          />
        </div>
      )}

      {/* Modals */}
      <NewBookingModal
        open={newBookingModalOpen}
        onClose={() => setNewBookingModalOpen(false)}
        rooms={rooms}
        prefillRoomId={prefillRoomId}
        prefillDate={prefillDate}
        onSuccess={() => {
          showToast('Reservation successfully created!');
          loadData();
        }}
      />

      <BookingDetailModal
        booking={selectedBooking}
        open={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        onUpdated={() => {
          showToast('Booking record successfully updated.');
          loadData();
        }}
      />

      <BatchInventoryModal
        open={batchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        rooms={rooms}
        onSuccess={() => {
          showToast('Batch inventory updates applied successfully.');
          loadData();
        }}
      />

      <CellActionModal
        open={Boolean(cellActionData)}
        cellData={cellActionData}
        onClose={() => setCellActionData(null)}
        onOpenBookingPrefill={handleOpenNewBookingPrefill}
        onSuccess={() => {
          showToast('Inventory updated.');
          loadData();
        }}
      />
    </AdminLayout>
  );
}
