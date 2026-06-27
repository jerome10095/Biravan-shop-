import React, { useState, useEffect } from 'react';
import {
  Search, X, ChevronDown, ChevronUp, Phone, MapPin,
  CreditCard, Package, Calendar, SlidersHorizontal,
} from 'lucide-react';
import { formatRWF, PAYMENT_METHOD_LABELS } from '../../../data.js';
import { updateOrderStatus } from '../store.js';
import { STATUS_CONFIG } from './Dashboard.jsx';

const ALL_STATUSES = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { color: '#78716c', bg: 'rgba(120,113,108,0.1)', label: status };
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

function StatusSelect({ current, onChange }) {
  return (
    <select
      value={current}
      onChange={e => onChange(e.target.value)}
      className="text-xs px-2 py-1 rounded-lg outline-none cursor-pointer font-medium"
      style={{
        background: STATUS_CONFIG[current]?.bg || 'rgba(120,113,108,0.1)',
        color: STATUS_CONFIG[current]?.color || '#78716c',
        border: `1px solid ${STATUS_CONFIG[current]?.color || '#78716c'}30`,
      }}
    >
      {Object.entries(STATUS_CONFIG).map(([s, { label }]) => (
        <option key={s} value={s} style={{ background: '#1B1814', color: 'white' }}>
          {label}
        </option>
      ))}
    </select>
  );
}

function OrderRow({ order, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const payLabel = PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod;

  return (
    <>
      <tr
        className="border-b border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3 font-mono text-stone-400 text-xs whitespace-nowrap">{order.id}</td>
        <td className="px-4 py-3">
          <div className="text-stone-200 text-sm font-medium">{order.customerName}</div>
          <div className="text-stone-500 text-xs mt-0.5 flex items-center gap-1">
            <Phone size={10} /> {order.phone}
          </div>
        </td>
        <td className="px-4 py-3 text-stone-400 text-xs whitespace-nowrap">
          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </td>
        <td className="px-4 py-3 text-stone-200 font-medium text-sm whitespace-nowrap">{formatRWF(order.total)}</td>
        <td className="px-4 py-3">
          <div onClick={e => e.stopPropagation()}>
            <StatusSelect
              current={order.status}
              onChange={status => onStatusChange(order.id, status)}
            />
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="text-stone-500 text-xs">{payLabel}</div>
        </td>
        <td className="px-4 py-3 text-stone-500">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-white/5">
          <td colSpan={7} className="px-4 pb-4">
            <div
              className="rounded-xl p-4 space-y-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-stone-500 text-xs uppercase tracking-wide font-semibold">Delivery Address</div>
                  <div className="text-stone-300 flex items-start gap-1.5">
                    <MapPin size={12} className="mt-1 flex-shrink-0 text-stone-500" />
                    {order.address}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-stone-500 text-xs uppercase tracking-wide font-semibold">Payment</div>
                  <div className="text-stone-300 flex items-center gap-1.5">
                    <CreditCard size={12} className="text-stone-500" />
                    {payLabel}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-stone-500 text-xs uppercase tracking-wide font-semibold">Order Date</div>
                  <div className="text-stone-300 flex items-center gap-1.5">
                    <Calendar size={12} className="text-stone-500" />
                    {new Date(order.createdAt).toLocaleString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="text-sm">
                  <div className="text-stone-500 text-xs uppercase tracking-wide font-semibold mb-1">Notes</div>
                  <div className="text-stone-300 italic">{order.notes}</div>
                </div>
              )}

              <div>
                <div className="text-stone-500 text-xs uppercase tracking-wide font-semibold mb-2">Items Ordered</div>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                        {item.img && (
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-stone-200 text-sm">{item.name}</div>
                        <div className="text-stone-500 text-xs mt-0.5">
                          {item.color} · {item.size} · Qty {item.qty}
                        </div>
                      </div>
                      <div className="text-stone-300 text-sm font-medium flex-shrink-0">
                        {formatRWF(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="flex flex-col sm:flex-row sm:justify-end gap-1 pt-3 border-t text-sm"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex justify-between sm:flex-col sm:items-end gap-2">
                  <div className="text-stone-500">
                    Subtotal: <span className="text-stone-300">{formatRWF(order.subtotal)}</span>
                  </div>
                  <div className="text-stone-500">
                    Shipping: <span className="text-stone-300">{order.shippingFee === 0 ? 'Free' : formatRWF(order.shippingFee)}</span>
                  </div>
                  <div className="font-semibold" style={{ color: 'var(--gold)' }}>
                    Total: {formatRWF(order.total)}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Orders({ orders, onRefreshOrders, initialProps }) {
  const [statusFilter, setStatusFilter] = useState(initialProps?.status || 'all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (initialProps?.status) setStatusFilter(initialProps.status);
  }, [initialProps]);

  async function handleStatusChange(orderId, status) {
    await updateOrderStatus(orderId, status);
    onRefreshOrders();
  }

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    return matchStatus && matchSearch;
  });

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = s === 'all' ? orders.length : orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  const totalRevenue = filtered
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-stone-500 text-sm mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: orders.length, color: '#3B82F6' },
          { label: 'Pending', value: counts.pending, color: '#F59E0B' },
          { label: 'Delivered', value: counts.delivered, color: '#10B981' },
          { label: 'Revenue', value: formatRWF(orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)), color: 'var(--gold)', small: true },
        ].map(({ label, value, color, small }) => (
          <div
            key={label}
            className="rounded-xl px-4 py-3"
            style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className={`font-bold ${small ? 'text-sm' : 'text-xl'} text-white`}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-3 p-4 rounded-xl"
        style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer…"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm text-white placeholder-stone-600 outline-none"
            style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-1.5">
          {ALL_STATUSES.map(s => {
            const cfg = STATUS_CONFIG[s] || { color: 'var(--gold)', label: 'All' };
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  color: active ? (s === 'all' ? 'var(--gold)' : cfg.color) : '#78716c',
                  background: active ? (s === 'all' ? 'rgba(212,175,55,0.1)' : cfg.bg) : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? (s === 'all' ? 'rgba(212,175,55,0.3)' : cfg.color + '40') : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                {s === 'all' ? 'All' : cfg.label} ({counts[s]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders table */}
      {filtered.length === 0 ? (
        <div
          className="py-16 text-center rounded-xl"
          style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Package size={32} className="text-stone-600 mx-auto mb-3" />
          <p className="text-stone-400">No orders found</p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Payment', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-stone-500 font-semibold uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="px-4 py-3 border-t flex items-center justify-between text-xs text-stone-600"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <span>Showing {filtered.length} of {orders.length} orders</span>
            {statusFilter !== 'all' && (
              <span>
                Revenue (visible): <span className="text-stone-400 font-medium">{formatRWF(totalRevenue)}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
