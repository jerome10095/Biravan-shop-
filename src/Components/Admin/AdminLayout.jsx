import React, { useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, BarChart2, Settings,
  LogOut, ExternalLink, Menu, X, ChevronRight,
} from 'lucide-react';
import { logout } from './store.js';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ currentPage, onNavigate, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    onLogout();
  }

  const Sidebar = ({ mobile = false }) => (
    <div
      className={`flex flex-col h-full ${mobile ? 'w-64' : 'w-64'}`}
      style={{ background: '#0d0c0b', borderRight: '1px solid rgba(212,175,55,0.1)' }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-xl font-bold tracking-widest" style={{ color: 'var(--gold)' }}>BIRAVAN</div>
            <div className="text-stone-500 text-xs tracking-widest uppercase mt-0.5">Admin</div>
          </div>
          {mobile && (
            <button onClick={() => setSidebarOpen(false)} className="text-stone-500 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => { onNavigate(id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
              style={{
                color: active ? '#D4AF37' : '#a8a29e',
                background: active ? 'rgba(212,175,55,0.08)' : 'transparent',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={17} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t space-y-0.5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <a
          href="#/"
          onClick={() => { window.location.hash = '/'; window.location.reload(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:text-stone-300 transition-colors"
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <ExternalLink size={17} />
          View Website
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:text-red-400 transition-colors"
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--ink)' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex flex-col flex-shrink-0">
            <Sidebar mobile />
          </div>
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div
          className="md:hidden flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0d0c0b' }}
        >
          <button onClick={() => setSidebarOpen(true)} className="text-stone-400 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
          <div className="font-display text-lg font-bold tracking-widest" style={{ color: 'var(--gold)' }}>BIRAVAN</div>
          <div className="w-8" />
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
