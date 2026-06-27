import { PRODUCTS as DEFAULT_PRODUCTS, SHOP as DEFAULT_SHOP, SOCIAL_LINKS as DEFAULT_SOCIAL, BRANDS as DEFAULT_BRANDS } from '../../data.js';

const K = {
  products: 'bv_products',
  orders: 'bv_orders',
  auth: 'bv_admin_auth',
  shop: 'bv_shop',
  social: 'bv_social',
  brands: 'bv_brands',
  password: 'bv_admin_pw',
};

const DEFAULT_PW = 'biravan2025';

// --- AUTH ---
export const isAuthenticated = () => sessionStorage.getItem(K.auth) === '1';

export function login(pw) {
  if (pw === (localStorage.getItem(K.password) || DEFAULT_PW)) {
    sessionStorage.setItem(K.auth, '1');
    return true;
  }
  return false;
}

export const logout = () => sessionStorage.removeItem(K.auth);

export function changePassword(newPw) {
  localStorage.setItem(K.password, newPw);
}

// --- PRODUCTS ---
export function getProducts() {
  const s = localStorage.getItem(K.products);
  return s ? JSON.parse(s) : DEFAULT_PRODUCTS;
}

export function saveProducts(p) {
  localStorage.setItem(K.products, JSON.stringify(p));
  // Notify any open main-site tab (same tab: custom event; other tabs: storage event)
  window.dispatchEvent(new CustomEvent('bv:products-changed'));
}

export function addProduct(product) {
  const products = getProducts();
  const id = Math.max(0, ...products.map(p => p.id)) + 1;
  const next = [...products, { ...product, id, createdAt: new Date().toISOString() }];
  saveProducts(next);
  return id;
}

export function updateProduct(id, updates) {
  saveProducts(getProducts().map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
}

export function deleteProduct(id) {
  saveProducts(getProducts().filter(p => p.id !== id));
}

// --- ORDERS ---
const DEMO_NAMES = ['Jean Claude Mutabazi', 'Aline Uwase', 'Patrick Nkurunziza', 'Marie Ingabire', 'David Hakizimana', 'Grace Mukamana', 'Eric Ndayishimiye', 'Yvette Uwimana', 'James Karangwa', 'Solange Niyonzima', 'Bosco Tuyishime', 'Clarisse Nyirahabimana'];
const DEMO_PHONES = ['+250 781 234 567', '+250 788 345 678', '+250 790 456 789', '+250 783 567 890', '+250 787 654 321'];
const DEMO_ADDRESSES = ['KN 3 Rd, Kigali', 'KG 15 Ave, Kigali', 'NR1, Musanze', 'KG 9 Ave, Kicukiro', 'Gisenyi, Rubavu', 'KN 78 St, Nyarugenge'];
const DEMO_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'delivered', 'delivered', 'cancelled'];
const DEMO_PAYMENTS = ['momo', 'airtel', 'cod'];
const DEMO_NOTES = ['', '', '', 'Please deliver before 6 PM', '', 'Call before delivery', '', 'Leave at the gate', ''];

function createDemoOrders() {
  const products = getProducts();
  const orders = Array.from({ length: 35 }, (_, i) => {
    const numItems = 1 + Math.floor(Math.random() * 3);
    const items = Array.from({ length: numItems }, () => {
      const p = products[Math.floor(Math.random() * products.length)];
      const qty = 1 + Math.floor(Math.random() * 2);
      return { id: p.id, name: p.name, price: p.price, qty, color: p.colors[0]?.name || 'Default', size: p.category === 'Shoes' ? '42' : 'M', img: p.images[0], category: p.category };
    });
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shippingFee = subtotal >= 100000 ? 0 : 2000;
    const daysAgo = Math.floor(Math.random() * 50);
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
    return {
      id: `BV-${100001 + i}`,
      customerName: DEMO_NAMES[Math.floor(Math.random() * DEMO_NAMES.length)],
      phone: DEMO_PHONES[Math.floor(Math.random() * DEMO_PHONES.length)],
      address: DEMO_ADDRESSES[Math.floor(Math.random() * DEMO_ADDRESSES.length)],
      items, subtotal, shippingFee,
      total: subtotal + shippingFee,
      paymentMethod: DEMO_PAYMENTS[Math.floor(Math.random() * DEMO_PAYMENTS.length)],
      status: DEMO_STATUSES[Math.floor(Math.random() * DEMO_STATUSES.length)],
      notes: DEMO_NOTES[Math.floor(Math.random() * DEMO_NOTES.length)],
      createdAt, updatedAt: createdAt,
    };
  });
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  saveOrders(orders);
  return orders;
}

export function getOrders() {
  const s = localStorage.getItem(K.orders);
  if (s) return JSON.parse(s);
  return createDemoOrders();
}

export function saveOrders(orders) {
  localStorage.setItem(K.orders, JSON.stringify(orders));
}

export function updateOrderStatus(id, status) {
  saveOrders(getOrders().map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o));
}

export function addOrder(order) {
  const orders = getOrders();
  saveOrders([order, ...orders]);
}

// --- SHOP SETTINGS ---
export const getShopSettings = () => JSON.parse(localStorage.getItem(K.shop) || JSON.stringify(DEFAULT_SHOP));
export const saveShopSettings = s => localStorage.setItem(K.shop, JSON.stringify(s));
export const getSocialLinks = () => JSON.parse(localStorage.getItem(K.social) || JSON.stringify(DEFAULT_SOCIAL));
export const saveSocialLinks = s => localStorage.setItem(K.social, JSON.stringify(s));
export const getBrands = () => JSON.parse(localStorage.getItem(K.brands) || JSON.stringify(DEFAULT_BRANDS));
export const saveBrands = b => localStorage.setItem(K.brands, JSON.stringify(b));

// --- ANALYTICS ---
export function getAnalytics(orders) {
  const nonCancelled = orders.filter(o => o.status !== 'cancelled');
  const totalRevenue = nonCancelled.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = nonCancelled.length ? totalRevenue / nonCancelled.length : 0;

  const revenueByDay = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayOrders = nonCancelled.filter(o => o.createdAt.startsWith(dateStr));
    return {
      date: dateStr,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      count: dayOrders.length,
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

  const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));

  const statusBreakdown = {};
  orders.forEach(o => { statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1; });

  const paymentBreakdown = {};
  nonCancelled.forEach(o => { paymentBreakdown[o.paymentMethod] = (paymentBreakdown[o.paymentMethod] || 0) + 1; });

  return { revenueByDay, categoryRevenue, topProducts, statusBreakdown, paymentBreakdown, totalRevenue, avgOrderValue };
}
