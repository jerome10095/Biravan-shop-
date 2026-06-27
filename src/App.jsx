import { useState, useEffect, useMemo } from "react";
import { SHOP, PRODUCTS as DEFAULT_PRODUCTS, distanceKm, getWhatsappUrl, buildWhatsappUrl, ORDER_WHATSAPP_NUMBER, PAYMENT_METHOD_LABELS, formatRWF } from "./data";
import Header from "./Components/Header";
import FloatingDock from "./Components/FloatingDock";
import Main from "./Components/Main";
import Footer from "./Components/Footer";
import ProductDetail from "./Components/ProductDetail";
import SizeGuide from "./Components/SizeGuide";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import OrderConfirmation from "./Components/OrderConfirmation";
import { trackProductView, trackCartAdd, applyAutoTags, getProducts, addOrder } from "./Components/Admin/store.js";
import React from "react";

export default function App() {
  /* ---------- shop / catalog state ---------- */
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [productsReady, setProductsReady] = useState(false);
  const [engTick, setEngTick] = useState(0);

  const taggedProducts = useMemo(() => applyAutoTags(products), [products, engTick]);

  // Initial load from Supabase
  useEffect(() => {
    getProducts().then((prods) => {
      setProducts(prods);
      setProductsReady(true);
    });
  }, []);

  // Re-fetch when admin saves a product (custom event from store.js)
  useEffect(() => {
    function onProductsChanged() {
      getProducts().then(setProducts);
    }
    window.addEventListener("bv:products-changed", onProductsChanged);
    return () => window.removeEventListener("bv:products-changed", onProductsChanged);
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState(() => {
    try { const s = localStorage.getItem("bv_wishlist"); return s ? new Set(JSON.parse(s)) : new Set(); } catch { return new Set(); }
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ---------- cart / checkout state ---------- */
  const [cart, setCart] = useState(() => {
    try { const s = localStorage.getItem("bv_cart"); return s ? JSON.parse(s) : []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("bv_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("bv_wishlist", JSON.stringify([...wishlist])); }, [wishlist]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [shipping, setShipping] = useState({ fullName: "", phone: "", address: "", sector: "", notes: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formError, setFormError] = useState("");

  /* ---------- header / nav state ---------- */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  /* ---------- geolocation state ---------- */
  const [geo, setGeo] = useState({ status: "idle" });

  const anyOverlay = isCartOpen || isCheckoutOpen || !!selectedProduct || !!order || sizeGuideOpen;
  useEffect(() => {
    document.body.style.overflow = anyOverlay ? "hidden" : "";
  }, [anyOverlay]);

  /* ---------- derived totals ---------- */
  const subtotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty   = cart.reduce((s, i) => s + i.qty, 0);
  const shippingFee = cart.length === 0 ? 0 : subtotal >= 100000 ? 0 : 2000;
  const grandTotal  = subtotal + shippingFee;

  /* ---------- wishlist & cart actions ---------- */
  function toggleWishlist(id) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function addToCart(product, color, size, qty) {
    const key = `${product.id}-${color}-${size}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { key, id: product.id, name: product.name, price: product.price, img: product.images[0], color, size, qty }];
    });
    trackCartAdd(product.id);
    setEngTick(t => t + 1);
  }

  function openProduct(product) {
    setSelectedProduct(product);
    trackProductView(product.id);
    setEngTick(t => t + 1);
  }

  function updateQty(key, delta) {
    setCart((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i)).filter((i) => i.qty > 0)
    );
  }

  function removeFromCart(key) {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }

  /* ---------- geolocation ---------- */
  function findMyLocation() {
    if (!navigator.geolocation) {
      setGeo({ status: "error", message: "Geolocation isn't supported by this browser." });
      return;
    }
    setGeo({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = distanceKm(pos.coords.latitude, pos.coords.longitude, SHOP.lat, SHOP.lng);
        setGeo({ status: "success", distance: d });
      },
      (err) => {
        const message = err.code === 1
          ? "Location access was denied. Enable location permissions in your browser to see your distance from the boutique."
          : "We couldn't detect your location right now. Please try again.";
        setGeo({ status: "error", message });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  /* ---------- checkout ---------- */
  function buildOrderMessage(number) {
    const itemLines = cart
      .map((i) => `• ${i.name} — ${i.color} / ${i.size} — x${i.qty} — ${formatRWF(i.price * i.qty)}`)
      .join("\n");
    const addressLine = `${shipping.address}${shipping.sector ? `, ${shipping.sector}` : ""}`;
    const paymentLabel = PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod;

    return [
      "New order from the BIRAVAN website",
      "",
      `Order #${number}`,
      `Name: ${shipping.fullName}`,
      `Phone: ${shipping.phone}`,
      `Address: ${addressLine}`,
      shipping.notes ? `Notes: ${shipping.notes}` : null,
      "",
      "Items:",
      itemLines,
      "",
      `Subtotal: ${formatRWF(subtotal)}`,
      `Shipping: ${shippingFee === 0 ? "Free" : formatRWF(shippingFee)}`,
      `Total: ${formatRWF(grandTotal)}`,
      "",
      `Payment method: ${paymentLabel}`,
    ]
      .filter((line) => line !== null)
      .join("\n");
  }

  async function placeOrder() {
    if (!shipping.fullName || !shipping.phone || !shipping.address || !paymentMethod) {
      setFormError("Please fill in your details and choose a payment method.");
      return;
    }
    setFormError("");
    const number = `BV-${Math.floor(100000 + Math.random() * 900000)}`;

    // Open WhatsApp first so the browser doesn't block the popup
    const orderWhatsappUrl = buildWhatsappUrl(ORDER_WHATSAPP_NUMBER, buildOrderMessage(number));
    window.open(orderWhatsappUrl, "_blank", "noopener,noreferrer");

    // Save order to Supabase (non-blocking — customer already sees confirmation)
    addOrder({
      id:           number,
      customerName: shipping.fullName,
      phone:        shipping.phone,
      address:      shipping.address,
      sector:       shipping.sector,
      notes:        shipping.notes,
      items:        cart.map(i => ({
        id:       i.id,
        name:     i.name,
        price:    i.price,
        qty:      i.qty,
        color:    i.color,
        size:     i.size,
        img:      i.img,
        category: products.find(p => p.id === i.id)?.category || '',
      })),
      subtotal,
      shippingFee,
      total:         grandTotal,
      paymentMethod,
    }).catch(e => console.error("Order save failed:", e));

    setOrder({ number, total: grandTotal, name: shipping.fullName, method: paymentMethod, whatsappUrl: orderWhatsappUrl });
    setCart([]);
    setIsCheckoutOpen(false);
  }

  function closeOrderAndReset() {
    setOrder(null);
    setShipping({ fullName: "", phone: "", address: "", sector: "", notes: "" });
    setPaymentMethod("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- derived urls ---------- */
  const directionsUrl = SHOP.mapsLink;
  const mapEmbedUrl   = `https://www.openstreetmap.org/export/embed.html?bbox=${SHOP.lng - 0.012}%2C${SHOP.lat - 0.009}%2C${SHOP.lng + 0.012}%2C${SHOP.lat + 0.009}&layer=mapnik&marker=${SHOP.lat}%2C${SHOP.lng}`;
  const whatsappUrl   = getWhatsappUrl();

  return (
    <div className="min-h-screen text-stone-100" style={{ background: "var(--ink)" }}>
      <Header
        totalQty={totalQty}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        showAnnouncement={showAnnouncement}
        setShowAnnouncement={setShowAnnouncement}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      <FloatingDock whatsappUrl={whatsappUrl} onOpenSizeGuide={() => setSizeGuideOpen(true)} />

      <Main
        products={taggedProducts}
        productsReady={productsReady}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        search={search}
        setSearch={setSearch}
        wishlist={wishlist}
        onToggleWish={toggleWishlist}
        onOpenProduct={openProduct}
        geo={geo}
        onFindMyLocation={findMyLocation}
        directionsUrl={directionsUrl}
        mapEmbedUrl={mapEmbedUrl}
      />

      <Footer />

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          allProducts={taggedProducts}
          onClose={() => setSelectedProduct(null)}
          onAdd={(color, size, qty) => {
            addToCart(selectedProduct, color, size, qty);
            setSelectedProduct(null);
            setIsCartOpen(true);
          }}
        />
      )}

      {sizeGuideOpen && <SizeGuide onClose={() => setSizeGuideOpen(false)} />}

      {isCartOpen && (
        <Cart
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          subtotal={subtotal}
          shippingFee={shippingFee}
          grandTotal={grandTotal}
          onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
        />
      )}

      {isCheckoutOpen && (
        <Checkout
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          shipping={shipping}
          setShipping={setShipping}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          formError={formError}
          subtotal={subtotal}
          shippingFee={shippingFee}
          grandTotal={grandTotal}
          onPlaceOrder={placeOrder}
        />
      )}

      {order && <OrderConfirmation order={order} onClose={closeOrderAndReset} />}
    </div>
  );
}
