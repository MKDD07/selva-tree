import React, { useState } from 'react';
import { Lock, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import logoWhite from '../../assets/logo/logo-white.svg';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123@selvatree');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.login(username, password);
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-stone-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Official Brand Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logoWhite}
            alt="Selva Tree Hotels & Resorts"
            className="h-12 w-auto object-contain brightness-110"
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-white">
          Property Management Portal
        </h2>
        <p className="mt-1.5 text-xs text-stone-400">
          Reservations & 10-Suite Inventory Management
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-stone-950/80 backdrop-blur-md py-8 px-6 sm:px-10 border border-stone-800/80 rounded-2xl shadow-2xl">
          {error && (
            <div className="mb-6 rounded-xl bg-rose-950/50 border border-rose-800/60 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-rose-200">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-300 mb-1.5">
                Username
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="block w-full rounded-lg border border-stone-800 bg-stone-900/90 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-300 mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-stone-800 bg-stone-900/90 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 px-4 py-3 text-sm font-semibold text-stone-950 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-950 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Pre-configured Demo Pill */}
          <div className="mt-6 pt-5 border-t border-stone-800/80">
            <div className="bg-stone-900/60 rounded-xl p-3 border border-stone-800 text-xs text-stone-400 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Management Access:</span>
              </div>
              <div className="flex items-center justify-between text-stone-300 font-mono text-[11px] bg-stone-950/60 p-2 rounded-lg border border-stone-800">
                <span>User: <strong className="text-white">admin</strong></span>
                <span>Pass: <strong className="text-white">admin123@selvatree</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <a
            href="/"
            className="text-xs text-stone-500 hover:text-stone-300 transition-colors inline-flex items-center gap-1"
          >
            ← Return to public website
          </a>
        </div>
      </div>
    </div>
  );
}
