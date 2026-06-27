import React, { useMemo } from 'react';
import { Package, ShoppingBag, TrendingUp, Clock, ChevronRight, AlertTriangle } from 'lucide-react';
import { formatRWF } from '../../../data.js';
import { getAnalytics } from '../store.js';

export const STATUS_CONFIG = {
  pending:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'Pending' },
  confirmed: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',  label: 'Confirmed' },
  shipped:   { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',  label: 'Shipped' },
  delivered: { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  label: 'Delivered' },
  cancelled: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   label: 'Cancelled' },
};

export default function Dashboard({ products, orders, onNavigate }) {
  const analytics = useMemo(() => getAnalytics(orders), [orders]);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const recentOrders = orders.slice(0, 6);
  const totalCategoryRev = Object.values(analytics.categoryRevenue).reduce((s, v) => s + v, 0);

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: '#D4AF37',
      sub: `${products.filter(p => p.tag).length} tagged`,
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: '#3B82F6',
      sub: `${orders.filter(o => o.status === 'delivered').length} delivered`,
    },
    {
      label: 'Revenue (excl. cancelled)',
      value: formatRWF(analytics.totalRevenue),
      icon: TrendingUp,
      color: '#10B981',
      sub: `Avg ${formatRWF(Math.round(analytics.avgOrderValue))}`,
      small: true,
    },
    {
      label: 'Pending Orders',
      value: pendingCount,
      icon: Clock,
      color: '#F59E0B',
      sub: pendingCount > 0 ? 'Needs attention' : 'All clear',
      alert: pendingCount > 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-0.5">BIRAVAN LINE BOUTIQUE — Admin Overview</p>
      </div>

      {pendingCount > 0 && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl text-sm"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <AlertTriangle size={17} color="#F59E0B" className="flex-shrink-0" />
          <span className="text-yellow-200">
            You have <strong>{pendingCount} pending order{pendingCount > 1 ? 's' : ''}</strong> awaiting confirmation.
          </span>
          <button
            onClick={() => onNavigate('orders', { status: 'pending' })}
            className="ml-auto text-yellow-400 text-xs flex items-center gap-1 hover:opacity-80 flex-shrink-0"
          >
            View <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, sub, small, alert }) => (
          <div
            key={label}
            className="rounded-xl p-5"
            style={{
              background: 'var(--ink-card)',
              border: `1px solid ${alert ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ background: color + '1a' }}>
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <div className={`font-bold text-white mb-0.5 leading-tight ${small ? 'text-base' : 'text-2xl'}`}>
              {value}
            </div>
            <div className="text-stone-400 text-xs">{label}</div>
            <div className="text-stone-600 text-xs mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div
          className="lg:col-span-2 rounded-xl p-5"
          style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Orders</h2>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: 'var(--gold)' }}
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-0">
            {recentOrders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-stone-200 text-sm font-medium truncate">{order.customerName}</span>
                      <span className="text-stone-600 text-xs font-mono flex-shrink-0">{order.id}</span>
                    </div>
                    <div className="text-stone-500 text-xs mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {' · '}
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <div className="text-stone-200 text-sm font-medium">{formatRWF(order.total)}</div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ color: cfg.color, background: cfg.bg }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status + Category breakdown */}
        <div
          className="rounded-xl p-5 space-y-5"
          style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <h2 className="text-white font-semibold mb-3">Orders by Status</h2>
            <div className="space-y-2.5">
              {Object.entries(analytics.statusBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => {
                  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
                  const pct = Math.round((count / orders.length) * 100);
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: cfg.color }}>{cfg.label}</span>
                        <span className="text-stone-500">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg.color }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <h3 className="text-white text-sm font-semibold mb-3">Revenue by Category</h3>
            <div className="space-y-2.5">
              {Object.entries(analytics.categoryRevenue).map(([cat, rev]) => {
                const pct = totalCategoryRev > 0 ? Math.round((rev / totalCategoryRev) * 100) : 0;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-stone-300">{cat}</span>
                      <span className="text-stone-500">{pct}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--gold)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div
        className="rounded-xl p-5"
        style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('products', { action: 'add' })}
            className="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ background: 'var(--gold)', color: '#0B0A09' }}
          >
            + Add Product
          </button>
          <button
            onClick={() => onNavigate('orders', { status: 'pending' })}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            Pending Orders ({pendingCount})
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#d6d3d1', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            View Analytics
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#d6d3d1', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Site Settings
          </button>
        </div>
      </div>
    </div>
  );
}
