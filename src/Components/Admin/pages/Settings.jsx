import React, { useState } from 'react';
import {
  Save, Plus, Trash2, Eye, EyeOff, Check, AlertCircle,
} from 'lucide-react';
import {
  getShopSettings, saveShopSettings,
  getSocialLinks, saveSocialLinks,
  getBrands, saveBrands,
  changePassword,
} from '../store.js';

function Field({ label, value, onChange, type = 'text', placeholder, textarea, hint }) {
  return (
    <div>
      <label className="text-stone-400 text-sm block mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-stone-600 outline-none resize-none"
          style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.1)' }}
          onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-stone-600 outline-none"
          style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.1)' }}
          onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      )}
      {hint && <p className="text-stone-600 text-xs mt-1">{hint}</p>}
    </div>
  );
}

function Section({ title, subtitle, children, onSave, saving, saved }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div>
          <h2 className="text-white font-semibold">{title}</h2>
          {subtitle && <p className="text-stone-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
        {onSave && (
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60"
            style={{ background: saved ? 'rgba(16,185,129,0.15)' : 'var(--gold)', color: saved ? '#10B981' : '#0B0A09', border: saved ? '1px solid rgba(16,185,129,0.3)' : 'none' }}
          >
            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
          </button>
        )}
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

export default function Settings() {
  // Shop info
  const [shop, setShop] = useState(getShopSettings);
  const [shopSaved, setShopSaved] = useState(false);

  // Social links
  const [social, setSocial] = useState(getSocialLinks);
  const [socialSaved, setSocialSaved] = useState(false);

  // Brands
  const [brands, setBrands] = useState(getBrands);
  const [brandsSaved, setBrandsSaved] = useState(false);
  const [newBrand, setNewBrand] = useState('');

  // Password
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [pwShow, setPwShow] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  function saveShop() {
    saveShopSettings(shop);
    setShopSaved(true);
    setTimeout(() => setShopSaved(false), 2500);
  }

  function saveSocial() {
    saveSocialLinks(social);
    setSocialSaved(true);
    setTimeout(() => setSocialSaved(false), 2500);
  }

  function saveBrandsData() {
    saveBrands(brands);
    setBrandsSaved(true);
    setTimeout(() => setBrandsSaved(false), 2500);
  }

  function addBrand() {
    if (!newBrand.trim()) return;
    setBrands(b => [...b, { name: newBrand.trim(), logo: '' }]);
    setNewBrand('');
  }

  function removeBrand(i) {
    setBrands(b => b.filter((_, idx) => idx !== i));
  }

  function handlePasswordSave() {
    setPwError('');
    if (!pwForm.current) { setPwError('Enter your current password'); return; }
    if (pwForm.new.length < 6) { setPwError('New password must be at least 6 characters'); return; }
    if (pwForm.new !== pwForm.confirm) { setPwError('Passwords do not match'); return; }
    changePassword(pwForm.new);
    setPwForm({ current: '', new: '', confirm: '' });
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-stone-500 text-sm mt-0.5">Manage your shop information and website content</p>
      </div>

      {/* Shop Info */}
      <Section
        title="Shop Information"
        subtitle="Basic details shown across the website"
        onSave={saveShop}
        saved={shopSaved}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Shop Name"
            value={shop.name || ''}
            onChange={v => setShop(s => ({ ...s, name: v }))}
            placeholder="BIRAVAN"
          />
          <Field
            label="Subtitle / Tagline"
            value={shop.sub || ''}
            onChange={v => setShop(s => ({ ...s, sub: v }))}
            placeholder="LINE BOUTIQUE"
          />
          <Field
            label="Phone"
            value={shop.phone || ''}
            onChange={v => setShop(s => ({ ...s, phone: v }))}
            placeholder="+250 784 525 336"
            type="tel"
          />
          <Field
            label="Email"
            value={shop.email || ''}
            onChange={v => setShop(s => ({ ...s, email: v }))}
            placeholder="birambaj@gmail.com"
            type="email"
          />
        </div>
        <Field
          label="Address"
          value={shop.address || ''}
          onChange={v => setShop(s => ({ ...s, address: v }))}
          placeholder="KN3 Rd, Gisenyi, Rubavu District, Western Province, Rwanda"
        />
        <Field
          label="Google Maps Link"
          value={shop.mapsLink || ''}
          onChange={v => setShop(s => ({ ...s, mapsLink: v }))}
          placeholder="https://maps.app.goo.gl/..."
          hint="Paste your Google Maps share link here"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Latitude"
            value={String(shop.lat || '')}
            onChange={v => setShop(s => ({ ...s, lat: parseFloat(v) || 0 }))}
            placeholder="-1.6931381"
            type="number"
          />
          <Field
            label="Longitude"
            value={String(shop.lng || '')}
            onChange={v => setShop(s => ({ ...s, lng: parseFloat(v) || 0 }))}
            placeholder="29.2599982"
            type="number"
          />
        </div>
      </Section>

      {/* Social Links */}
      <Section
        title="Social Media Links"
        subtitle="URLs for all social platforms shown in the footer"
        onSave={saveSocial}
        saved={socialSaved}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/biravanlane' },
            { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/250784525336' },
            { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
            { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourhandle' },
            { key: 'snapchat', label: 'Snapchat', placeholder: 'https://snapchat.com/add/yourhandle' },
            { key: 'twitter', label: 'X / Twitter', placeholder: 'https://x.com/yourhandle' },
          ].map(({ key, label, placeholder }) => (
            <Field
              key={key}
              label={label}
              value={social[key] || ''}
              onChange={v => setSocial(s => ({ ...s, [key]: v }))}
              placeholder={placeholder}
              type="url"
            />
          ))}
        </div>
      </Section>

      {/* Brands */}
      <Section
        title="Featured Brands"
        subtitle="Brands displayed in the footer brand strip"
        onSave={saveBrandsData}
        saved={brandsSaved}
      >
        <div className="space-y-2">
          {brands.map((brand, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex-1 text-stone-200 text-sm">{brand.name}</div>
              <button
                onClick={() => removeBrand(i)}
                className="text-stone-600 hover:text-red-400 transition-colors flex-shrink-0"
                title="Remove brand"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newBrand}
            onChange={e => setNewBrand(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addBrand()}
            placeholder="Add new brand name…"
            className="flex-1 px-3 py-2 rounded-lg text-sm text-white placeholder-stone-600 outline-none"
            style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <button
            onClick={addBrand}
            disabled={!newBrand.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-opacity disabled:opacity-40"
            style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.25)' }}
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </Section>

      {/* Change Password */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--ink-card)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <h2 className="text-white font-semibold">Change Admin Password</h2>
          <p className="text-stone-500 text-xs mt-0.5">Update your admin panel access password</p>
        </div>
        <div className="p-6 space-y-4 max-w-sm">
          {pwError && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle size={14} className="flex-shrink-0" />
              {pwError}
            </div>
          )}
          {pwSaved && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg text-sm text-emerald-400"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <Check size={14} className="flex-shrink-0" />
              Password updated successfully!
            </div>
          )}
          {['current', 'new', 'confirm'].map(field => (
            <div key={field}>
              <label className="text-stone-400 text-sm block mb-1.5 capitalize">
                {field === 'confirm' ? 'Confirm New Password' : `${field === 'current' ? 'Current' : 'New'} Password`}
              </label>
              <div className="relative">
                <input
                  type={pwShow ? 'text' : 'password'}
                  value={pwForm[field]}
                  onChange={e => { setPwForm(f => ({ ...f, [field]: e.target.value })); setPwError(''); }}
                  placeholder={field === 'current' ? 'Current password' : field === 'new' ? 'Min. 6 characters' : 'Repeat new password'}
                  className="w-full px-3 pr-10 py-2.5 rounded-lg text-sm text-white placeholder-stone-600 outline-none"
                  style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                {field === 'new' && (
                  <button
                    type="button"
                    onClick={() => setPwShow(!pwShow)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                  >
                    {pwShow ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={handlePasswordSave}
            className="w-full py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: 'var(--gold)', color: '#0B0A09' }}
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Info box */}
      <div
        className="rounded-xl p-5 text-sm text-stone-500"
        style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}
      >
        <p className="font-medium mb-1" style={{ color: 'var(--gold)' }}>Note about settings</p>
        <p>Changes saved here are stored in your browser's local storage and update the live website immediately. For permanent changes that persist across devices, update the <span className="font-mono text-stone-400">src/data.js</span> file directly.</p>
      </div>
    </div>
  );
}
