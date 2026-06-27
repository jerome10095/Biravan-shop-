import React, { useState, useCallback, useEffect } from 'react';
import { isAuthenticated, getProducts, getOrders } from './store.js';
import AdminLogin from './AdminLogin.jsx';
import AdminLayout from './AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Orders from './pages/Orders.jsx';
import Analytics from './pages/Analytics.jsx';
import Settings from './pages/Settings.jsx';

const PAGES = { dashboard: Dashboard, products: Products, orders: Orders, analytics: Analytics, settings: Settings };

export default function AdminApp() {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [page, setPage] = useState('dashboard');
  const [pageProps, setPageProps] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    Promise.all([getProducts(), getOrders()]).then(([prods, ords]) => {
      setProducts(prods);
      setOrders(ords);
      setLoading(false);
    });
  }, [authed]);

  const navigate = useCallback((to, props = {}) => {
    setPage(to);
    setPageProps(props);
  }, []);

  const refreshProducts = useCallback(() => {
    getProducts().then(setProducts);
  }, []);

  const refreshOrders = useCallback(() => {
    getOrders().then(setOrders);
  }, []);

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="text-stone-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const PageComponent = PAGES[page] || Dashboard;

  return (
    <AdminLayout currentPage={page} onNavigate={navigate} onLogout={() => setAuthed(false)}>
      <PageComponent
        products={products}
        orders={orders}
        onRefreshProducts={refreshProducts}
        onRefreshOrders={refreshOrders}
        onNavigate={navigate}
        initialProps={pageProps}
      />
    </AdminLayout>
  );
}
