import React, { useMemo } from 'react';
import { TrendingUp, ShoppingBag, Package, CreditCard } from 'lucide-react';
import { formatRWF, PAYMENT_METHOD_LABELS } from '../../../data.js';
import { getAnalytics } from '../store.js';

// --- Simple SVG line chart ---
function LineChart({ data, valueKey, color = '#D4AF37', formatY = v => v }) {
  const values = data.map(d => d[valueKey]);
  const max = Math.max(...values, 1);
  const W = 560;
  const H = 130;
  const PAD = { top: 12, right: 12, bottom: 24, left: 52 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const xOf = i => PAD.left + (i / (data.length - 1)) * chartW;
  const yOf = v => PAD.top + chartH - (v / max) * chartH;

  const pts = data.map((d, i) => ({ x: xOf(i), y: yOf(d[valueKey]) }));
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${PAD.top + chartH} L${PAD.left},${PAD.top + chartH} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const xLabels = data.filter((_, i) => i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map(t => {
        const y = PAD.top + chartH * (1 - t);
        const val = max * t;
        return (
          <g key={t}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(255,255,255,0.05)" />
            <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)">
              {val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${Math.round(val / 1000)}k` : Math.round(val)}
            </text>
          </g>
        );
      })}
      {xLabels.map((d, i) => {
        const idx = data.indexOf(d);
        return (
          <text key={i} x={xOf(idx)} y={H - 4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">
            {d.label}
          </text>
        );
      })}
      <path d={areaPath} fill={`url(#grad-${color.replace('#', '')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.filter((_, i) => i % 7 === 0 || i === pts.length - 1).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
      ))}
    </svg>
  );
}

// --- Horizontal bar chart ---
function BarChart({ data, nameKey, valueKey, color = '#D4AF37', formatValue = v => v }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = (d[valueKey] / max) * 100;
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="text-stone-300 text-sm truncate" style={{ width: '140px', flexShrink: 0 }} title={d[nameKey]}>
              {d[nameKey]}
            </div>
            <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                style={{ width: `${Math.max(pct, 2)}%`, background: color, minWidth: '24px' }}
              >
                <span className="text-xs font-bold" style={{ color: '#0B0A09' }}>{d[valueKey]}</span>
              </div>
            </div>
            <div className="text-stone-500 text-xs flex-shrink-0 w-20 text-right">{formatValue(d[valueKey])}</div>
          </div>
        );
      })}
    </div>
  );
}

// --- Mini stat card ---
function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ background: color + '1a' }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="text-white font-bold text-xl leading-tight">{value}</div>
      <div className="text-stone-400 text-xs mt-0.5">{label}</div>
      {sub && <div className="text-stone-600 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

// --- Section wrapper ---
function Section({ title, children, subtitle }) {
  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div>
        <h2 className="text-white font-semibold">{title}</h2>
        {subtitle && <p className="text-stone-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

const PAYMENT_LABELS = {
  momo: 'MTN MoMo',
  airtel: 'Airtel Money',
  cod: 'Cash on Delivery',
  card: 'Card',
};

const PAYMENT_COLORS = {
  momo: '#FFCB05',
  airtel: '#EF4444',
  cod: '#10B981',
  card: '#3B82F6',
};

export default function Analytics({ orders, products }) {
  const data = useMemo(() => getAnalytics(orders), [orders]);

  const nonCancelled = orders.filter(o => o.status !== 'cancelled');
  const thisMonth = orders.filter(o => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthRev = thisMonth.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  const totalPaymentCount = Object.values(data.paymentBreakdown).reduce((s, v) => s + v, 0);
  const totalCatRev = Object.values(data.categoryRevenue).reduce((s, v) => s + v, 0);

  const categoryData = Object.entries(data.categoryRevenue).map(([name, revenue]) => ({
    name,
    revenue,
    pct: totalCatRev > 0 ? Math.round((revenue / totalCatRev) * 100) : 0,
  }));

  const hasRevData = data.revenueByDay.some(d => d.revenue > 0);
  const hasOrderData = data.revenueByDay.some(d => d.count > 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-stone-500 text-sm mt-0.5">Sales trends, product performance & customer insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={formatRWF(data.totalRevenue)}
          sub="Excluding cancelled"
          icon={TrendingUp}
          color="#10B981"
        />
        <StatCard
          label="Total Orders"
          value={orders.length}
          sub={`${nonCancelled.length} completed`}
          icon={ShoppingBag}
          color="#3B82F6"
        />
        <StatCard
          label="Avg. Order Value"
          value={formatRWF(Math.round(data.avgOrderValue))}
          sub="Per completed order"
          icon={CreditCard}
          color="var(--gold)"
        />
        <StatCard
          label="This Month Revenue"
          value={formatRWF(thisMonthRev)}
          sub={`${thisMonth.length} orders`}
          icon={Package}
          color="#8B5CF6"
        />
      </div>

      {/* Revenue trend */}
      <Section title="Revenue Trend" subtitle="Last 30 days — completed orders only">
        {hasRevData ? (
          <LineChart data={data.revenueByDay} valueKey="revenue" color="#D4AF37" />
        ) : (
          <div className="py-10 text-center text-stone-500 text-sm">No revenue data for the last 30 days</div>
        )}
      </Section>

      {/* Orders per day */}
      <Section title="Daily Orders" subtitle="Last 30 days">
        {hasOrderData ? (
          <LineChart data={data.revenueByDay} valueKey="count" color="#3B82F6" formatY={v => v} />
        ) : (
          <div className="py-10 text-center text-stone-500 text-sm">No order data for the last 30 days</div>
        )}
      </Section>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top products */}
        <Section title="Top Selling Products" subtitle="By units sold (excluding cancelled)">
          {data.topProducts.length > 0 ? (
            <BarChart
              data={data.topProducts}
              nameKey="name"
              valueKey="qty"
              color="#D4AF37"
              formatValue={v => `${v} units`}
            />
          ) : (
            <div className="py-8 text-center text-stone-500 text-sm">Not enough data yet</div>
          )}
        </Section>

        {/* Category revenue */}
        <Section title="Revenue by Category">
          <div className="space-y-4">
            {categoryData.map(({ name, revenue, pct }) => {
              const catColors = { Clothing: '#3B82F6', Shoes: '#8B5CF6', Accessories: '#F59E0B' };
              const color = catColors[name] || 'var(--gold)';
              return (
                <div key={name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-stone-300">{name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-stone-200 font-medium">{formatRWF(revenue)}</span>
                      <span className="text-stone-600 text-xs ml-2">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
            {categoryData.length === 0 && (
              <div className="py-8 text-center text-stone-500 text-sm">No category data yet</div>
            )}
          </div>
        </Section>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Payment methods */}
        <Section title="Payment Methods" subtitle="Distribution across completed orders">
          <div className="space-y-3">
            {Object.entries(data.paymentBreakdown).map(([method, count]) => {
              const pct = totalPaymentCount > 0 ? Math.round((count / totalPaymentCount) * 100) : 0;
              const color = PAYMENT_COLORS[method] || '#78716c';
              return (
                <div key={method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-300">{PAYMENT_LABELS[method] || method}</span>
                    <span className="text-stone-500">{count} orders ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(data.paymentBreakdown).length === 0 && (
              <div className="py-8 text-center text-stone-500 text-sm">No payment data yet</div>
            )}
          </div>
        </Section>

        {/* Order status summary */}
        <Section title="Order Status Overview">
          <div className="space-y-3">
            {Object.entries(data.statusBreakdown).map(([status, count]) => {
              const STATUS_COLORS = {
                pending: '#F59E0B', confirmed: '#3B82F6', shipped: '#8B5CF6',
                delivered: '#10B981', cancelled: '#EF4444',
              };
              const STATUS_LABELS = {
                pending: 'Pending', confirmed: 'Confirmed', shipped: 'Shipped',
                delivered: 'Delivered', cancelled: 'Cancelled',
              };
              const pct = Math.round((count / orders.length) * 100);
              const color = STATUS_COLORS[status] || '#78716c';
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color }}>{STATUS_LABELS[status] || status}</span>
                    <span className="text-stone-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="pt-4 border-t mt-4 grid grid-cols-2 gap-3"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div>
              <div className="text-stone-500 text-xs">Conversion Rate</div>
              <div className="text-white font-bold text-lg">
                {orders.length > 0
                  ? `${Math.round((orders.filter(o => o.status === 'delivered').length / orders.length) * 100)}%`
                  : '—'}
              </div>
              <div className="text-stone-600 text-xs">Orders delivered</div>
            </div>
            <div>
              <div className="text-stone-500 text-xs">Cancellation Rate</div>
              <div className="text-white font-bold text-lg">
                {orders.length > 0
                  ? `${Math.round((orders.filter(o => o.status === 'cancelled').length / orders.length) * 100)}%`
                  : '—'}
              </div>
              <div className="text-stone-600 text-xs">Orders cancelled</div>
            </div>
          </div>
        </Section>
      </div>

      {/* Product inventory summary */}
      <Section title="Product Inventory" subtitle={`${products.length} products across all categories`}>
        <div className="grid sm:grid-cols-3 gap-4">
          {['Clothing', 'Shoes', 'Accessories'].map(cat => {
            const catProducts = products.filter(p => p.category === cat);
            const catColors = { Clothing: '#3B82F6', Shoes: '#8B5CF6', Accessories: '#F59E0B' };
            const color = catColors[cat];
            const avgPrice = catProducts.length
              ? Math.round(catProducts.reduce((s, p) => s + p.price, 0) / catProducts.length)
              : 0;
            return (
              <div key={cat} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-stone-300 text-sm font-medium">{cat}</span>
                </div>
                <div className="text-2xl font-bold text-white">{catProducts.length}</div>
                <div className="text-stone-500 text-xs mt-1">products</div>
                {avgPrice > 0 && (
                  <div className="text-stone-500 text-xs mt-2">Avg: {formatRWF(avgPrice)}</div>
                )}
                <div className="text-stone-600 text-xs mt-0.5">
                  {catProducts.filter(p => p.tag).length} tagged ({catProducts.filter(p => p.tag === 'Trending').length} trending)
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
