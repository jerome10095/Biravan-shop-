import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Edit2, Trash2, X, Check, Image as ImageIcon,
  ChevronDown, Tag, Palette, AlertCircle, Package,
} from 'lucide-react';
import { formatRWF } from '../../../data.js';
import { addProduct, updateProduct, deleteProduct, saveProducts, getProducts } from '../store.js';

const TAGS = ['Trending', 'New'];
const CAT_OPTIONS = ['Clothing', 'Shoes', 'Accessories'];

const BLANK_PRODUCT = {
  name: '', category: 'Clothing', price: '', tag: null,
  images: [''],
  colors: [{ name: 'Black', hex: '#111111' }],
};

function ColorRow({ color, onChange, onRemove, canRemove }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={color.hex}
        onChange={e => onChange({ ...color, hex: e.target.value })}
        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
        title="Pick color"
      />
      <input
        type="text"
        value={color.name}
        onChange={e => onChange({ ...color, name: e.target.value })}
        placeholder="Color name"
        className="flex-1 px-3 py-1.5 rounded-lg text-sm text-white placeholder-stone-600 outline-none"
        style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.08)' }}
      />
      <input
        type="text"
        value={color.hex}
        onChange={e => onChange({ ...color, hex: e.target.value })}
        placeholder="#000000"
        className="w-24 px-2 py-1.5 rounded-lg text-sm font-mono text-stone-300 placeholder-stone-600 outline-none"
        style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.08)' }}
      />
      {canRemove && (
        <button type="button" onClick={onRemove} className="text-stone-600 hover:text-red-400 transition-colors flex-shrink-0">
          <X size={15} />
        </button>
      )}
    </div>
  );
}

function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(() =>
    product
      ? { ...product, images: product.images.length > 0 ? [...product.images] : [''], price: String(product.price) }
      : { ...BLANK_PRODUCT }
  );
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Valid price required';
    if (form.images.every(img => !img.trim())) e.images = 'At least one image URL is required';
    if (form.colors.some(c => !c.name.trim())) e.colors = 'All colors need a name';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const cleaned = {
      ...form,
      price: Number(form.price),
      images: form.images.filter(img => img.trim()),
      tag: form.tag || null,
    };
    onSave(cleaned);
  }

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  function updateImage(i, val) {
    const imgs = [...form.images];
    imgs[i] = val;
    setField('images', imgs);
  }

  function addImage() {
    if (form.images.length < 5) setField('images', [...form.images, '']);
  }

  function removeImage(i) {
    if (form.images.length > 1) setField('images', form.images.filter((_, idx) => idx !== i));
  }

  function updateColor(i, val) {
    const colors = [...form.colors];
    colors[i] = val;
    setField('colors', colors);
  }

  function addColor() {
    setField('colors', [...form.colors, { name: '', hex: '#888888' }]);
  }

  function removeColor(i) {
    if (form.colors.length > 1) setField('colors', form.colors.filter((_, idx) => idx !== i));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: 'var(--ink-soft)', border: '1px solid rgba(212,175,55,0.15)' }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <h2 className="text-white font-semibold text-lg">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div className="space-y-4">
            <h3 className="text-stone-400 text-xs uppercase tracking-widest font-semibold">Basic Info</h3>
            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                placeholder="e.g. Tailored Wool Blazer"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-stone-600 outline-none"
                style={{ background: 'var(--ink)', border: `1px solid ${errors.name ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}` }}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Category *</label>
                <select
                  value={form.category}
                  onChange={e => setField('category', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none appearance-none cursor-pointer"
                  style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {CAT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Tag</label>
                <select
                  value={form.tag || ''}
                  onChange={e => setField('tag', e.target.value || null)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none appearance-none cursor-pointer"
                  style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <option value="">None</option>
                  {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-stone-400 text-sm block mb-1.5">Price (RWF) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setField('price', e.target.value)}
                placeholder="45000"
                min="0"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-stone-600 outline-none"
                style={{ background: 'var(--ink)', border: `1px solid ${errors.price ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}` }}
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
              {form.price && !isNaN(Number(form.price)) && (
                <p className="text-stone-500 text-xs mt-1">{formatRWF(Number(form.price))}</p>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-stone-400 text-xs uppercase tracking-widest font-semibold">
                Images <span className="text-stone-600 normal-case tracking-normal">(URLs, up to 5)</span>
              </h3>
              {form.images.length < 5 && (
                <button
                  type="button"
                  onClick={addImage}
                  className="text-xs flex items-center gap-1 hover:opacity-80"
                  style={{ color: 'var(--gold)' }}
                >
                  <Plus size={12} /> Add Image
                </button>
              )}
            </div>
            {errors.images && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle size={12} /> {errors.images}
              </p>
            )}
            {form.images.map((img, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <ImageIcon size={15} className="text-stone-600 flex-shrink-0" />
                  <input
                    type="url"
                    value={img}
                    onChange={e => updateImage(i, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 rounded-lg text-sm text-white placeholder-stone-600 outline-none font-mono"
                    style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                  {form.images.length > 1 && (
                    <button type="button" onClick={() => removeImage(i)} className="text-stone-600 hover:text-red-400 transition-colors flex-shrink-0">
                      <X size={15} />
                    </button>
                  )}
                </div>
                {img.trim() && (
                  <div className="ml-6 w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                    <img src={img} alt="" className="w-full h-full object-cover" onError={e => (e.target.style.opacity = '0.2')} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-stone-400 text-xs uppercase tracking-widest font-semibold">Colors</h3>
              <button
                type="button"
                onClick={addColor}
                className="text-xs flex items-center gap-1 hover:opacity-80"
                style={{ color: 'var(--gold)' }}
              >
                <Plus size={12} /> Add Color
              </button>
            </div>
            {errors.colors && <p className="text-red-400 text-xs">{errors.colors}</p>}
            <div className="space-y-2">
              {form.colors.map((color, i) => (
                <ColorRow
                  key={i}
                  color={color}
                  onChange={val => updateColor(i, val)}
                  onRemove={() => removeColor(i)}
                  canRemove={form.colors.length > 1}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ background: 'var(--gold)', color: '#0B0A09' }}
            >
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ product, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: 'var(--ink-soft)', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <Trash2 size={18} color="#EF4444" />
          </div>
          <h2 className="text-white font-semibold">Delete Product</h2>
        </div>
        <p className="text-stone-400 text-sm mb-6">
          Are you sure you want to delete <strong className="text-white">"{product.name}"</strong>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-stone-400"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: '#EF4444', color: 'white' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products({ products, onRefreshProducts, initialProps }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterTag, setFilterTag] = useState('All');
  const [modalProduct, setModalProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (initialProps?.action === 'add') {
      setModalProduct(null);
      setShowModal(true);
    }
  }, [initialProps]);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat;
    const matchTag = filterTag === 'All' || (filterTag === 'None' ? !p.tag : p.tag === filterTag);
    return matchSearch && matchCat && matchTag;
  });

  function handleSave(form) {
    if (modalProduct) {
      updateProduct(modalProduct.id, form);
    } else {
      addProduct(form);
    }
    onRefreshProducts();
    setShowModal(false);
    setModalProduct(null);
  }

  function handleDelete() {
    deleteProduct(deleteTarget.id);
    onRefreshProducts();
    setDeleteTarget(null);
  }

  const tagColors = {
    Trending: { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
    New: { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  };
  const catColors = {
    Clothing: '#3B82F6', Shoes: '#8B5CF6', Accessories: '#F59E0B',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-stone-500 text-sm mt-0.5">{products.length} products total</p>
        </div>
        <button
          onClick={() => { setModalProduct(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'var(--gold)', color: '#0B0A09' }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-3 p-4 rounded-xl"
        style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm text-white placeholder-stone-600 outline-none"
            style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white">
              <X size={13} />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...CAT_OPTIONS].map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filterCat === c ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                color: filterCat === c ? 'var(--gold)' : '#78716c',
                border: `1px solid ${filterCat === c ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['All', 'Trending', 'New', 'None'].map(t => (
            <button
              key={t}
              onClick={() => setFilterTag(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filterTag === t ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                color: filterTag === t ? 'white' : '#78716c',
                border: `1px solid ${filterTag === t ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Products table */}
      {filtered.length === 0 ? (
        <div
          className="py-16 text-center rounded-xl"
          style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Package size={32} className="text-stone-600 mx-auto mb-3" />
          <p className="text-stone-400">No products found</p>
          {search && (
            <button onClick={() => setSearch('')} className="text-sm mt-2" style={{ color: 'var(--gold)' }}>
              Clear search
            </button>
          )}
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
                  {['Product', 'Category', 'Price', 'Tag', 'Colors', 'Images', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-stone-500 font-semibold uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => {
                  const tag = product.tag && tagColors[product.tag];
                  const catColor = catColors[product.category] || '#78716c';
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                            {product.images[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon size={16} className="text-stone-600" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-stone-200 font-medium leading-tight">{product.name}</div>
                            <div className="text-stone-600 text-xs mt-0.5">ID #{product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ color: catColor, background: catColor + '1a' }}
                        >
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-200 font-medium whitespace-nowrap">
                        {formatRWF(product.price)}
                      </td>
                      <td className="px-4 py-3">
                        {tag ? (
                          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ color: tag.color, background: tag.bg }}>
                            {product.tag}
                          </span>
                        ) : (
                          <span className="text-stone-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {product.colors.slice(0, 4).map((c, i) => (
                            <div
                              key={i}
                              title={c.name}
                              className="w-4 h-4 rounded-full border border-white/10"
                              style={{ background: c.hex }}
                            />
                          ))}
                          {product.colors.length > 4 && (
                            <span className="text-stone-600 text-xs ml-1">+{product.colors.length - 4}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-stone-500 text-xs">{product.images.length}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setModalProduct(product); setShowModal(true); }}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-white transition-colors"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 transition-colors"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t text-stone-600 text-xs" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            Showing {filtered.length} of {products.length} products
          </div>
        </div>
      )}

      {showModal && (
        <ProductModal
          product={modalProduct}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setModalProduct(null); }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          product={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
