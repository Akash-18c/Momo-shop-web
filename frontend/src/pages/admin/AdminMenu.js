import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiX, FiChevronDown, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api, { bustCache } from '../../services/api';
import { useNotifs } from './AdminLayout';

const CATEGORIES = ['Momo', 'Spring Rolls', 'Wings', 'Fries', 'Burger', 'Desserts', 'Beverages'];
const EMPTY_FORM = { name: '', description: '', price: '', category: 'Momo', isVeg: true, isFeatured: false, image: null };

function CategorySelect({ value, onChange, t, dark }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({});
  const btnRef          = useRef();

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const dropH = Math.min(CATEGORIES.length * 41, 220);
      const goUp = (window.innerHeight - r.bottom) < dropH + 8;
      setPos(goUp
        ? { bottom: window.innerHeight - r.top + 6, left: r.left, width: r.width }
        : { top: r.bottom + 6, left: r.left, width: r.width }
      );
    }
    setOpen(v => !v);
  };

  return (
    <>
      <button ref={btnRef} type="button" onClick={toggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '0.625rem 1rem',
          background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          border: `1px solid ${open ? 'rgba(201,168,76,0.6)' : t.border}`,
          borderRadius: '0.75rem', color: t.text,
          fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', outline: 'none',
        }}>
        <span>{value}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
          <FiChevronDown size={15} color={t.textMuted} />
        </motion.span>
      </button>

      {open && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onMouseDown={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              top: pos.top ?? undefined,
              bottom: pos.bottom ?? undefined,
              left: pos.left, width: pos.width,
              zIndex: 9999,
              borderRadius: '0.75rem',
              maxHeight: '220px',
              overflowY: 'auto',
              background: dark ? '#1e1e30' : '#ffffff',
              border: `1px solid ${t.border}`,
              boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
            }}>
            {CATEGORIES.map(cat => (
              <button key={cat} type="button"
                onMouseDown={() => { onChange(cat); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '0.6rem 1rem',
                  background: value === cat
                    ? (dark ? 'rgba(201,168,76,0.18)' : 'rgba(201,168,76,0.12)')
                    : 'transparent',
                  color: value === cat ? '#f0d060' : t.text,
                  fontSize: '0.875rem', fontWeight: value === cat ? 600 : 400,
                  cursor: 'pointer', border: 'none', outline: 'none',
                  borderBottom: `1px solid ${t.border}`,
                }}
                onMouseEnter={e => { if (value !== cat) e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { if (value !== cat) e.currentTarget.style.background = 'transparent'; }}>
                <span>{cat}</span>
                {value === cat && <FiCheck size={13} color="#c9a84c" />}
              </button>
            ))}
          </motion.div>
        </>,
        document.body
      )}
    </>
  );
}

export default function AdminMenu() {
  const { t, dark } = useNotifs();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState('');

  const fetchFoods = () => api.get('/foods').then(r => setFoods(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchFoods(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY_FORM); setPreview(''); setShowModal(true); };
  const openEdit = (food) => { setEditing(food); setForm({ ...food, price: food.price.toString(), image: null }); setPreview(food.image); setShowModal(true); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    compressImage(file).then(compressed => setForm(p => ({ ...p, image: compressed })));
  };

  const compressImage = (file) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 900;
      let { width, height } = img;
      if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })), 'image/jpeg', 0.82);
    };
    img.src = URL.createObjectURL(file);
  });

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
      if (editing) await api.put(`/foods/${editing._id}`, fd);
      else await api.post('/foods', fd);
      toast.success(editing ? 'Item updated!' : 'Item added!');
      bustCache('/foods');
      bustCache('/foods/featured');
      setShowModal(false); fetchFoods();
    } catch (err) { toast.error(err.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try { await api.delete(`/foods/${id}`); toast.success('Deleted!'); bustCache('/foods'); bustCache('/foods/featured'); fetchFoods(); }
    catch (err) { toast.error(err.message || 'Failed to delete'); }
  };

  const handleToggle = async (id) => {
    try { await api.patch(`/foods/${id}/toggle`); bustCache('/foods'); bustCache('/foods/featured'); fetchFoods(); }
    catch (err) { toast.error(err.message); }
  };

  const inputStyle = {
    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${t.border}`,
    color: t.text,
    borderRadius: '0.75rem',
    padding: '0.625rem 1rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: t.text, fontFamily: 'Poppins,sans-serif' }}>Manage Menu</h1>
          <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>{foods.length} items total</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black"
          style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00', boxShadow: '0 4px 16px rgba(201,168,76,0.3)' }}>
          <FiPlus size={15} /> Add Item
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {foods.map((food, i) => (
            <motion.div key={food._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-2xl p-4 flex gap-3 transition-all"
              style={{ background: t.card, border: `1px solid ${t.border}` }}>
              <img src={food.image || 'https://via.placeholder.com/80?text=F'} alt={food.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <p className="font-bold text-sm truncate" style={{ color: t.text }}>{food.name}</p>
                  <span className={`text-xs flex-shrink-0 px-1.5 py-0.5 rounded-full font-semibold ${food.isVeg ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                    {food.isVeg ? '🟢' : '🔴'}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>{food.category}</p>
                <p className="font-black mt-0.5" style={{ color: '#c9a84c' }}>₹{food.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => handleToggle(food._id)}
                    className="text-xs flex items-center gap-1 transition-colors"
                    style={{ color: food.isAvailable ? '#4ade80' : t.textMuted }}>
                    {food.isAvailable ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                    {food.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                  <button onClick={() => openEdit(food)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: '#60a5fa' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,165,250,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(food._id)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: '#f87171' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
                style={{ background: t.card, border: `1px solid ${t.border}` }}
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6" style={{ borderBottom: `1px solid ${t.border}` }}>
                  <h2 className="font-bold text-lg" style={{ color: t.text }}>{editing ? 'Edit Item' : 'Add New Item'}</h2>
                  <button onClick={() => setShowModal(false)}
                    className="p-2 rounded-xl transition-colors"
                    style={{ color: t.textMuted }}
                    onMouseEnter={e => e.currentTarget.style.background = t.navHover}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <FiX />
                  </button>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center"
                      style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                      {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover" /> : <span className="text-3xl">🍽️</span>}
                    </div>
                    <label className="cursor-pointer text-sm font-medium hover:underline" style={{ color: '#c9a84c' }}>
                      Upload Image <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Item Name" style={inputStyle} required />
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Description" style={{ ...inputStyle, height: '5rem', resize: 'none' }} />
                  <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="Price (₹)" style={inputStyle} required min="0" />
                  <CategorySelect
                    value={form.category}
                    onChange={cat => setForm(p => ({ ...p, category: cat }))}
                    t={t} dark={dark}
                  />
                  {/* Veg / Non-Veg prominent toggle */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: t.textMuted }}>Food Type</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button"
                        onClick={() => setForm(p => ({ ...p, isVeg: true }))}
                        style={{
                          padding: '0.6rem 0.75rem',
                          borderRadius: '0.75rem',
                          border: form.isVeg ? '2px solid #22c55e' : `1px solid ${t.border}`,
                          background: form.isVeg ? 'rgba(34,197,94,0.12)' : 'transparent',
                          color: form.isVeg ? '#4ade80' : t.textMuted,
                          fontWeight: 700, fontSize: '0.8rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                          transition: 'all 0.15s',
                        }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: '2px solid #16a34a', flexShrink: 0 }} />
                        Vegetarian
                      </button>
                      <button type="button"
                        onClick={() => setForm(p => ({ ...p, isVeg: false }))}
                        style={{
                          padding: '0.6rem 0.75rem',
                          borderRadius: '0.75rem',
                          border: !form.isVeg ? '2px solid #ef4444' : `1px solid ${t.border}`,
                          background: !form.isVeg ? 'rgba(239,68,68,0.12)' : 'transparent',
                          color: !form.isVeg ? '#f87171' : t.textMuted,
                          fontWeight: 700, fontSize: '0.8rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                          transition: 'all 0.15s',
                        }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', border: '2px solid #dc2626', flexShrink: 0 }} />
                        Non-Veg
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} className="w-4 h-4" style={{ accentColor: '#c9a84c' }} />
                    <span className="text-sm font-medium" style={{ color: t.text }}>Mark as Featured</span>
                  </label>
                  <button type="submit" disabled={saving}
                    className="w-full py-3 rounded-xl font-black text-sm transition-all disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00' }}>
                    {saving ? 'Saving...' : editing ? 'Update Item' : 'Add Item'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
