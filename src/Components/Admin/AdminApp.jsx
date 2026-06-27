import React, { useState, useCallback } from 'react';
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
  const [products, setProducts] = useState(getProducts);
  const [orders, setOrders] = useState(getOrders);

  const navigate = useCallback((to, props = {}) => {
    setPage(to);
    setPageProps(props);
  }, []);

  const refreshProducts = useCallback(() => setProducts(getProducts()), []);
  const refreshOrders = useCallback(() => setOrders(getOrders()), []);

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
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
