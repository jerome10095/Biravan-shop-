import { supabase } from '../../lib/supabase.js';
import { PRODUCTS as DEFAULT_PRODUCTS, SHOP as DEFAULT_SHOP, SOCIAL_LINKS as DEFAULT_SOCIAL, BRANDS as DEFAULT_BRANDS } from '../../data.js';

// ─── AUTH (stays in sessionStorage — no change) ────────────────────────────
const K_AUTH     = 'bv_admin_auth';
const K_PW = 'bv_admin_pw';

export const isAuthenticated = () => sessionStorage.getItem(K_AUTH) === '1';

export function login(pw) {
  const stored = localStorage.getItem(K_PW);
  if (stored && pw === stored) {
    sessionStorage.setItem(K_AUTH, '1');
    return true;
  }
  return false;
}

export const logout = () => sessionStorage.removeItem(K_AUTH);

export function changePassword(newPw) {
  localStorage.setItem(K_PW, newPw);
}

// ─── ROW MAPPERS ───────────────────────────────────────────────────────────
function rowToProduct(row) {
  return {
    id:          row.id,
    name:        row.name,
    category:    row.category,
    price:       row.price,
    stock:       row.stock ?? null,
    tag:         row.tag ?? null,
    description: row.description || '',
    images:      row.images || [],
    colors:      row.colors || [],
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  };
}

function productToRow(p) {
  return {
    name:        p.name,
    category:    p.category,
    price:       Number(p.price),
    stock:       p.stock != null ? Number(p.stock) : null,
    tag:         p.tag || null,
    description: p.description || '',
    images:      p.images || [],
    colors:      p.colors || [],
  };
}

function rowToOrder(row) {
  return {
    id:            row.id,
    customerName:  row.customer_name,
    phone:         row.phone,
    address:       row.address,
    sector:        row.sector || '',
    notes:         row.notes || '',
    items:         row.items || [],
    subtotal:      row.subtotal,
    shippingFee:   row.shipping_fee,
    total:         row.total,
    paymentMethod: row.payment_method,
    status:        row.status,
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
  };
}

// ─── ENGAGEMENT & AUTO-TAGS (stays in localStorage — UX only) ──────────────
const ENG_KEY = 'bv_engagement';
const NEW_DAYS = 30;

export function getEngagement() {
  try { return JSON.parse(localStorage.getItem(ENG_KEY) || '{}'); } catch { return {}; }
}

export function trackProductView(id) {
  const eng = getEngagement();
  const k = String(id);
  eng[k] = { ...eng[k], views: (eng[k]?.views || 0) + 1, lastView: Date.now() };
  localStorage.setItem(ENG_KEY, JSON.stringify(eng));
}

export function trackCartAdd(id) {
  const eng = getEngagement();
  const k = String(id);
  eng[k] = { ...eng[k], cartAdds: (eng[k]?.cartAdds || 0) + 1 };
  localStorage.setItem(ENG_KEY, JSON.stringify(eng));
}

export function applyAutoTags(products) {
  const eng = getEngagement();
  const hasEngagement = Object.keys(eng).length > 0;
  const now = Date.now();
  const NEW_MS = NEW_DAYS * 24 * 60 * 60 * 1000;

  if (!hasEngagement) {
    return products.map(p => ({ ...p, effectiveTag: p.tag }));
  }

  const scored = products
    .map(p => ({ id: p.id, score: (eng[String(p.id)]?.views || 0) + (eng[String(p.id)]?.cartAdds || 0) * 3 }))
    .sort((a, b) => b.score - a.score);

  const topN = Math.max(1, Math.ceil(products.length * 0.25));
  const trendingIds = new Set(scored.slice(0, topN).filter(s => s.score > 0).map(s => s.id));

  return products.map(p => {
    const isNew      = p.createdAt && (now - new Date(p.createdAt).getTime()) < NEW_MS;
    const isTrending = trendingIds.has(p.id);
    return { ...p, effectiveTag: isTrending ? 'Trending' : isNew ? 'New' : null };
  });
}

// ─── PRODUCTS ──────────────────────────────────────────────────────────────
async function seedProducts() {
  const rows = DEFAULT_PRODUCTS.map(productToRow);
  const { error } = await supabase.from('products').insert(rows);
  if (error) console.error('Seed error:', error);
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');

  if (error) {
    console.error('getProducts error:', error);
    return DEFAULT_PRODUCTS;
  }

  if (data.length === 0) {
    await seedProducts();
    return DEFAULT_PRODUCTS;
  }

  return data.map(rowToProduct);
}

export async function addProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([productToRow(product)])
    .select()
    .single();
  if (error) throw error;
  window.dispatchEvent(new CustomEvent('bv:products-changed'));
  return data.id;
}

export async function updateProduct(id, updates) {
  const { error } = await supabase
    .from('products')
    .update({ ...productToRow(updates), updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  window.dispatchEvent(new CustomEvent('bv:products-changed'));
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  window.dispatchEvent(new CustomEvent('bv:products-changed'));
}

// ─── ORDERS ────────────────────────────────────────────────────────────────
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getOrders error:', error);
    return [];
  }
  return data.map(rowToOrder);
}

export async function addOrder(order) {
  const { error } = await supabase.from('orders').insert([{
    id:             order.id,
    customer_name:  order.customerName,
    phone:          order.phone,
    address:        order.address,
    sector:         order.sector || '',
    notes:          order.notes || '',
    items:          order.items,
    subtotal:       order.subtotal,
    shipping_fee:   order.shippingFee,
    total:          order.total,
    payment_method: order.paymentMethod,
    status:         'pending',
  }]);
  if (error) throw error;
}

export async function updateOrderStatus(id, status) {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

// ─── SHOP SETTINGS (localStorage — simple config, no DB needed) ────────────
export const getShopSettings  = () => JSON.parse(localStorage.getItem('bv_shop')   || JSON.stringify(DEFAULT_SHOP));
export const saveShopSettings = s  => localStorage.setItem('bv_shop',   JSON.stringify(s));
export const getSocialLinks   = () => JSON.parse(localStorage.getItem('bv_social') || JSON.stringify(DEFAULT_SOCIAL));
export const saveSocialLinks  = s  => localStorage.setItem('bv_social', JSON.stringify(s));
export const getBrands        = () => JSON.parse(localStorage.getItem('bv_brands') || JSON.stringify(DEFAULT_BRANDS));
export const saveBrands       = b  => localStorage.setItem('bv_brands', JSON.stringify(b));

// ─── ANALYTICS ─────────────────────────────────────────────────────────────
export function getAnalytics(orders) {
  const nonCancelled = orders.filter(o => o.status !== 'cancelled');
  const totalRevenue = nonCancelled.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = nonCancelled.length ? totalRevenue / nonCancelled.length : 0;

  const revenueByDay = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayOrders = nonCancelled.filter(o => o.createdAt?.startsWith(dateStr));
    return {
      date:    dateStr,
      label:   d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      count:   dayOrders.length,
    };
  });

  const categoryRevenue = {};
  const productSales = {};
  nonCancelled.forEach(order => {
    order.items.forEach(item => {
      categoryRevenue[item.category || 'Other'] = (categoryRevenue[item.category || 'Other'] || 0) + item.price * item.qty;
      productSales[item.name] = (productSales[item.name] || 0) + item.qty;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }));

  const statusBreakdown = {};
  orders.forEach(o => { statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1; });

  const paymentBreakdown = {};
  nonCancelled.forEach(o => { paymentBreakdown[o.paymentMethod] = (paymentBreakdown[o.paymentMethod] || 0) + 1; });

  return { revenueByDay, categoryRevenue, topProducts, statusBreakdown, paymentBreakdown, totalRevenue, avgOrderValue };
}
