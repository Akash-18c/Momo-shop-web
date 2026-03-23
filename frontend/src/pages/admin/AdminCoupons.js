import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiTag, FiPercent, FiDollarSign, FiCalendar, FiUsers, FiShoppingBag, FiX, FiCheck, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useNotifs } from './AdminLayout';

const EMPTY = { code: '', discount: '', discountType: 'percentage', minOrder: '', maxUses: '100', expiry: '' };

function CouponCard({ coupon, onDelete, onEdit, t, dark }) {
  const isActive   = coupon.isActive && new Date(coupon.expiry) > new Date();
  const usagePct   = Math.min(100, (coupon.usedCount / coupon.maxUses) * 100);
  const daysLeft   = Math.max(0, Math.ceil((new Date(coupon.expiry) - new Date()) / 86400000));
  const almostFull = usagePct >= 80;
  const urgent     = isActive && daysLeft <= 3;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden"
      style={{ background: t.card, border: `1px solid ${isActive ? 'rgba(201,168,76,0.3)' : t.border}`, boxShadow: isActive ? '0 4px 28px rgba(201,168,76,0.1)' : 'none' }}>

      <div className="h-[3px]" style={{ background: isActive ? 'linear-gradient(90deg,transparent,#c9a84c,#f0d060,#c9a84c,transparent)' : `linear-gradient(90deg,${t.border},${t.border})` }} />

      {isActive && <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none" style={{ background: 'radial-gradient(circle at top right,rgba(201,168,76,0.07),transparent 70%)' }} />}

      <div className="p-4 relative">
        {/* top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: isActive ? 'rgba(201,168,76,0.15)' : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'), border: `1.5px solid ${isActive ? 'rgba(201,168,76,0.4)' : t.border}` }}>
              <FiTag size={15} color={isActive ? '#c9a84c' : t.textMuted} />
            </div>
            <div>
              <p className="font-black tracking-[0.12em] text-sm" style={{ color: t.text, fontFamily: 'monospace' }}>{coupon.code}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isActive ? '#34d399' : '#f87171' }}>{isActive ? 'Active' : 'Expired'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => onEdit(coupon)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ color: t.textMuted, border: `1px solid ${t.border}` }}
              onMouseEnter={e => { e.currentTarget.style.color='#c9a84c'; e.currentTarget.style.background='rgba(201,168,76,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color=t.textMuted; e.currentTarget.style.background='transparent'; }}>
              <FiEdit2 size={12} />
            </button>
            <button onClick={() => onDelete(coupon._id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ color: t.textMuted, border: `1px solid ${t.border}` }}
              onMouseEnter={e => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.background='rgba(239,68,68,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color=t.textMuted; e.currentTarget.style.background='transparent'; }}>
              <FiTrash2 size={12} />
            </button>
          </div>
        </div>

        {/* discount value */}
        <p className="font-black leading-none mb-0.5"
          style={{ fontSize: '2.5rem', background: isActive ? 'linear-gradient(135deg,#c9a84c,#f0d060)' : (dark ? 'linear-gradient(135deg,#2a2a3a,#374151)' : 'linear-gradient(135deg,#cbd5e1,#94a3b8)'), WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
        </p>
        <p className="text-xs font-semibold mb-3" style={{ color: t.textMuted }}>{coupon.discountType === 'percentage' ? 'Percentage Off' : 'Flat Discount'}</p>

        {/* ticket notch */}
        <div className="relative my-3 mx-[-16px]">
          <div className="border-t border-dashed" style={{ borderColor: isActive ? 'rgba(201,168,76,0.2)' : t.border }} />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: t.bg, marginLeft: '-8px' }} />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: t.bg, marginRight: '-8px' }} />
        </div>

        {/* meta chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold" style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', color: t.textMuted, border: `1px solid ${t.border}` }}>
            <FiShoppingBag size={9} /> Min ₹{coupon.minOrder || 0}
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold" style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', color: t.textMuted, border: `1px solid ${t.border}` }}>
            <FiCalendar size={9} /> {new Date(coupon.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          {isActive && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
              style={{ background: urgent ? 'rgba(239,68,68,0.12)' : 'rgba(201,168,76,0.1)', color: urgent ? '#f87171' : '#c9a84c', border: `1px solid ${urgent ? 'rgba(239,68,68,0.25)' : 'rgba(201,168,76,0.25)'}` }}>
              <FiZap size={9} /> {daysLeft}d left
            </div>
          )}
        </div>

        {/* usage bar */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold flex items-center gap-1" style={{ color: t.textMuted }}><FiUsers size={9} /> Usage</span>
          <span className="text-[10px] font-black" style={{ color: almostFull ? '#f87171' : t.textMuted }}>{coupon.usedCount} / {coupon.maxUses}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' }}>
          <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${usagePct}%` }} transition={{ duration: 1 }}
            style={{ background: almostFull ? 'linear-gradient(90deg,#ef4444,#f87171)' : isActive ? 'linear-gradient(90deg,#c9a84c,#f0d060)' : (dark ? '#2a2a3a' : '#cbd5e1') }} />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminCoupons() {
  const { t, dark } = useNotifs();
  const [coupons,  setCoupons]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchCoupons = () =>
    api.get('/coupons').then(r => setCoupons(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchCoupons(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };
  const openEdit   = (c) => {
    setForm({ code: c.code, discount: String(c.discount), discountType: c.discountType, minOrder: String(c.minOrder || ''), maxUses: String(c.maxUses), expiry: c.expiry?.split('T')[0] || '' });
    setEditingId(c._id); setShowForm(true);
  };
  const closeForm  = () => { setShowForm(false); setEditingId(null); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editingId) { await api.put(`/coupons/${editingId}`, form); toast.success('Coupon updated!'); }
      else           { await api.post('/coupons', form);             toast.success('Coupon created!'); }
      closeForm(); fetchCoupons();
    } catch (err) { toast.error(err.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try { await api.delete(`/coupons/${id}`); toast.success('Deleted!'); fetchCoupons(); }
    catch (err) { toast.error(err.message || 'Failed'); }
  };

  const active   = coupons.filter(c => c.isActive && new Date(c.expiry) > new Date());
  const inactive = coupons.filter(c => !c.isActive || new Date(c.expiry) <= new Date());

  const inputStyle = {
    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${t.border}`, color: t.text,
    borderRadius: '0.75rem', padding: '0.65rem 1rem',
    width: '100%', fontSize: '0.875rem', outline: 'none',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black" style={{ color: t.text, fontFamily: 'Poppins,sans-serif' }}>Coupons</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: t.textMuted }}>
            <span style={{ color: '#4ade80' }}>{active.length} active</span> · {inactive.length} expired
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={showForm ? closeForm : openCreate}
          className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0"
          style={showForm
            ? { background: t.navHover, color: t.textMuted, border: `1px solid ${t.border}` }
            : { background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00', boxShadow: '0 4px 16px rgba(201,168,76,0.3)' }}>
          {showForm ? <><FiX size={14} /> Cancel</> : <><FiPlus size={14} /> New Coupon</>}
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${t.border}`, boxShadow: '0 8px 32px rgba(201,168,76,0.08)' }}>
            <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c,#f0d060,#c9a84c,transparent)' }} />
            <div className="px-4 sm:px-6 py-3 flex items-center gap-3" style={{ background: t.card, borderBottom: `1px solid ${t.border}` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
                <FiTag size={14} color="#c9a84c" />
              </div>
              <div>
                <p className="font-black text-sm" style={{ color: t.text }}>{editingId ? 'Edit Coupon' : 'Create New Coupon'}</p>
                <p className="text-[10px]" style={{ color: t.textMuted }}>Fill in the details below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6" style={{ background: t.card }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'code',     label: 'Coupon Code',   placeholder: 'SAVE20',  type: 'text',   mono: true },
                  { key: 'minOrder', label: 'Min Order (₹)', placeholder: '0',       type: 'number'             },
                  { key: 'maxUses',  label: 'Max Uses',      placeholder: '100',     type: 'number'             },
                ].map(({ key, label, placeholder, type, mono }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: t.textMuted }}>{label}</label>
                    <input type={type} value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: key === 'code' ? e.target.value.toUpperCase() : e.target.value }))}
                      placeholder={placeholder}
                      style={{ ...inputStyle, fontFamily: mono ? 'monospace' : undefined }}
                      onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                      onBlur={e => e.target.style.borderColor = t.border}
                      required={key === 'code'} min={key !== 'code' ? '0' : undefined} />
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: t.textMuted }}>Discount</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.textMuted }}>
                      {form.discountType === 'percentage' ? <FiPercent size={12} /> : <FiDollarSign size={12} />}
                    </div>
                    <input type="number" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))}
                      placeholder="20" style={{ ...inputStyle, paddingLeft: '2rem' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                      onBlur={e => e.target.style.borderColor = t.border}
                      required min="0" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: t.textMuted }}>Type</label>
                  <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: `1px solid ${t.border}` }}>
                    {['percentage', 'flat'].map(tp => (
                      <button key={tp} type="button" onClick={() => setForm(p => ({ ...p, discountType: tp }))}
                        className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                        style={form.discountType === tp ? { background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00' } : { color: t.textMuted }}>
                        {tp === 'percentage' ? '% Off' : '₹ Flat'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: t.textMuted }}>Expiry</label>
                  <input type="date" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))}
                    style={{ ...inputStyle, colorScheme: dark ? 'dark' : 'light' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = t.border}
                    required />
                </div>
              </div>

              {form.code && form.discount && (
                <div className="mt-3 px-3 py-2.5 rounded-xl flex items-center gap-2" style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <FiCheck size={12} color="#c9a84c" />
                  <p className="text-xs" style={{ color: t.text }}>
                    <span className="font-black" style={{ color: '#f0d060', fontFamily: 'monospace' }}>{form.code}</span>
                    {' '}→ {form.discountType === 'percentage' ? `${form.discount}% off` : `₹${form.discount} off`}
                    {form.minOrder > 0 && ` on orders above ₹${form.minOrder}`}
                  </p>
                </div>
              )}

              <button type="submit" disabled={saving}
                className="mt-3 w-full py-3 rounded-xl font-black text-sm transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00' }}>
                {saving ? 'Saving...' : editingId ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List — hidden while form is open */}
      {!showForm && (
        <>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-[3px] border-t-transparent rounded-full animate-spin" style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
            </div>
          ) : coupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FiTag size={36} className="mb-3 opacity-20" style={{ color: t.textMuted }} />
              <p className="font-bold" style={{ color: t.textMuted }}>No coupons yet</p>
            </div>
          ) : (
            <>
              {active.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: t.textMuted }}>Active ({active.length})</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {active.map(c => <CouponCard key={c._id} coupon={c} onDelete={handleDelete} onEdit={openEdit} t={t} dark={dark} />)}
                  </div>
                </div>
              )}
              {inactive.length > 0 && (
                <div className="opacity-60">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: t.textMuted }}>Expired ({inactive.length})</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {inactive.map(c => <CouponCard key={c._id} coupon={c} onDelete={handleDelete} onEdit={openEdit} t={t} dark={dark} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
