import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiTag, FiPercent, FiDollarSign, FiCalendar, FiUsers, FiShoppingBag, FiX, FiCheck, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useNotifs } from './AdminLayout';

const EMPTY = { code: '', discount: '', discountType: 'percentage', minOrder: '', maxUses: '100', expiry: '' };

function CouponCard({ coupon, onDelete, t, dark }) {
  const isActive   = coupon.isActive && new Date(coupon.expiry) > new Date();
  const usagePct   = Math.min(100, (coupon.usedCount / coupon.maxUses) * 100);
  const daysLeft   = Math.max(0, Math.ceil((new Date(coupon.expiry) - new Date()) / 86400000));
  const almostFull = usagePct >= 80;
  const urgent     = isActive && daysLeft <= 3;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="relative rounded-2xl overflow-hidden cursor-default"
      style={{
        background: t.card,
        border: `1px solid ${isActive ? 'rgba(201,168,76,0.3)' : t.border}`,
        boxShadow: isActive ? '0 4px 28px rgba(201,168,76,0.1)' : 'none',
        transition: 'all 0.25s ease',
      }}>

      <div className="h-[3px]" style={{
        background: isActive
          ? 'linear-gradient(90deg,transparent 0%,#c9a84c 30%,#f0d060 50%,#c9a84c 70%,transparent 100%)'
          : `linear-gradient(90deg,${t.border},${t.border})`,
      }} />

      {isActive && (
        <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right,rgba(201,168,76,0.07),transparent 70%)' }} />
      )}

      <div className="p-5 relative">
        {/* top row */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: isActive ? 'linear-gradient(135deg,rgba(201,168,76,0.2),rgba(240,208,96,0.1))' : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'),
                border: `1.5px solid ${isActive ? 'rgba(201,168,76,0.4)' : t.border}`,
                boxShadow: isActive ? '0 0 16px rgba(201,168,76,0.15)' : 'none',
              }}>
              <FiTag size={17} color={isActive ? '#c9a84c' : t.textMuted} />
            </div>
            <div>
              <p className="font-black tracking-[0.15em] text-base" style={{ color: t.text, fontFamily: 'monospace' }}>{coupon.code}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                <p className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: isActive ? '#34d399' : '#f87171' }}>
                  {isActive ? 'Active' : 'Expired'}
                </p>
              </div>
            </div>
          </div>
          <button onClick={() => onDelete(coupon._id)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ color: t.textMuted, border: `1px solid ${t.border}` }}
            onMouseEnter={e => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.background='rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.color=t.textMuted; e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor=t.border; }}>
            <FiTrash2 size={13} />
          </button>
        </div>

        {/* hero discount */}
        <div className="mb-1">
          <p className="font-black leading-none"
            style={{
              fontSize: '3rem',
              background: isActive ? 'linear-gradient(135deg,#c9a84c 0%,#f0d060 50%,#c9a84c 100%)' : (dark ? 'linear-gradient(135deg,#2a2a3a,#374151)' : 'linear-gradient(135deg,#cbd5e1,#94a3b8)'),
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: isActive ? 'drop-shadow(0 0 12px rgba(201,168,76,0.3))' : 'none',
            }}>
            {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
          </p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: t.textMuted }}>
            {coupon.discountType === 'percentage' ? 'Percentage Off' : 'Flat Discount'}
          </p>
        </div>

        {/* ticket notch */}
        <div className="relative my-4 mx-[-20px]">
          <div className="border-t border-dashed" style={{ borderColor: isActive ? 'rgba(201,168,76,0.2)' : t.border }} />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
            style={{ background: t.bg, border: `1px solid ${isActive ? 'rgba(201,168,76,0.2)' : t.border}`, marginLeft: '-10px' }} />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
            style={{ background: t.bg, border: `1px solid ${isActive ? 'rgba(201,168,76,0.2)' : t.border}`, marginRight: '-10px' }} />
        </div>

        {/* meta chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold"
            style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', color: t.textMuted, border: `1px solid ${t.border}` }}>
            <FiShoppingBag size={10} /> Min ₹{coupon.minOrder || 0}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold"
            style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', color: t.textMuted, border: `1px solid ${t.border}` }}>
            <FiCalendar size={10} />
            {new Date(coupon.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          {isActive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold"
              style={{
                background: urgent ? 'rgba(239,68,68,0.12)' : 'rgba(201,168,76,0.1)',
                color: urgent ? '#f87171' : '#c9a84c',
                border: `1px solid ${urgent ? 'rgba(239,68,68,0.25)' : 'rgba(201,168,76,0.25)'}`,
              }}>
              <FiZap size={10} /> {daysLeft}d left
            </div>
          )}
        </div>

        {/* usage bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: t.textMuted }}>
              <FiUsers size={10} /> Usage
            </span>
            <span className="text-[11px] font-black" style={{ color: almostFull ? '#f87171' : t.textMuted }}>
              {coupon.usedCount} <span style={{ color: t.textMuted }}>/ {coupon.maxUses}</span>
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)', border: `1px solid ${t.border}` }}>
            <motion.div className="h-full rounded-full"
              initial={{ width: 0 }} animate={{ width: `${usagePct}%` }} transition={{ duration: 1, ease: [0.22,1,0.36,1] }}
              style={{
                background: almostFull ? 'linear-gradient(90deg,#ef4444,#f87171)' : isActive ? 'linear-gradient(90deg,#c9a84c,#f0d060)' : (dark ? '#2a2a3a' : '#cbd5e1'),
                boxShadow: isActive && !almostFull ? '0 0 8px rgba(201,168,76,0.4)' : almostFull ? '0 0 8px rgba(239,68,68,0.4)' : 'none',
              }} />
          </div>
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

  const fetchCoupons = () =>
    api.get('/coupons').then(r => setCoupons(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.post('/coupons', form); toast.success('Coupon created!'); setForm(EMPTY); setShowForm(false); fetchCoupons(); }
    catch (err) { toast.error(err.message || 'Failed'); }
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
    border: `1px solid ${t.border}`,
    color: t.text,
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black" style={{ color: t.text, fontFamily: 'Poppins,sans-serif' }}>Coupons</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: t.textMuted }}>
            <span style={{ color: '#4ade80' }}>{active.length} active</span> · {inactive.length} expired
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0"
          style={showForm
            ? { background: t.navHover, color: t.textMuted, border: `1px solid ${t.border}` }
            : { background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00', boxShadow: '0 4px 16px rgba(201,168,76,0.3)' }}>
          {showForm ? <><FiX size={15} /> Cancel</> : <><FiPlus size={15} /> New Coupon</>}
        </motion.button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${t.border}`, boxShadow: '0 8px 32px rgba(201,168,76,0.08)' }}>
            <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c,#f0d060,#c9a84c,transparent)' }} />
            <div className="px-6 py-4 flex items-center gap-3" style={{ background: t.card, borderBottom: `1px solid ${t.border}` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
                <FiTag size={15} color="#c9a84c" />
              </div>
              <div>
                <p className="font-black" style={{ color: t.text }}>Create New Coupon</p>
                <p className="text-[10px]" style={{ color: t.textMuted }}>Fill in the details below</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="p-6" style={{ background: t.card }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'code',     label: 'Coupon Code',   placeholder: 'e.g. SAVE20',       type: 'text',   mono: true },
                  { key: 'minOrder', label: 'Min Order (₹)', placeholder: '0 = no minimum',    type: 'number'             },
                  { key: 'maxUses',  label: 'Max Uses',      placeholder: '100',                type: 'number'             },
                ].map(({ key, label, placeholder, type, mono }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: t.textMuted }}>{label}</label>
                    <input type={type} value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: key === 'code' ? e.target.value.toUpperCase() : e.target.value }))}
                      placeholder={placeholder}
                      style={{ ...inputStyle, fontFamily: mono ? 'monospace' : undefined, letterSpacing: mono ? '0.12em' : undefined }}
                      onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                      onBlur={e => e.target.style.borderColor = t.border}
                      required={key === 'code'} min={key !== 'code' ? '0' : undefined} />
                  </div>
                ))}

                {/* discount value */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: t.textMuted }}>Discount Value</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: t.textMuted }}>
                      {form.discountType === 'percentage' ? <FiPercent size={13} /> : <FiDollarSign size={13} />}
                    </div>
                    <input type="number" value={form.discount}
                      onChange={e => setForm(p => ({ ...p, discount: e.target.value }))}
                      placeholder="20"
                      style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                      onBlur={e => e.target.style.borderColor = t.border}
                      required min="0" />
                  </div>
                </div>

                {/* type toggle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: t.textMuted }}>Discount Type</label>
                  <div className="flex gap-2 p-1 rounded-xl"
                    style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: `1px solid ${t.border}` }}>
                    {['percentage', 'flat'].map(tp => (
                      <button key={tp} type="button" onClick={() => setForm(p => ({ ...p, discountType: tp }))}
                        className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                        style={form.discountType === tp
                          ? { background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00' }
                          : { color: t.textMuted }}>
                        {tp === 'percentage' ? '% Off' : '₹ Flat'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* expiry */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: t.textMuted }}>Expiry Date</label>
                  <input type="date" value={form.expiry}
                    onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))}
                    style={{ ...inputStyle, colorScheme: dark ? 'dark' : 'light' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = t.border}
                    required />
                </div>
              </div>

              {/* live preview */}
              <AnimatePresence>
                {form.code && form.discount && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 px-4 py-3.5 rounded-xl flex items-center gap-3"
                    style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)' }}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(201,168,76,0.2)' }}>
                      <FiCheck size={12} color="#c9a84c" />
                    </div>
                    <p className="text-sm" style={{ color: t.text }}>
                      <span className="font-black tracking-wider" style={{ color: '#f0d060', fontFamily: 'monospace' }}>{form.code}</span>
                      {' '}gives{' '}
                      <span className="font-bold">{form.discountType === 'percentage' ? `${form.discount}% off` : `₹${form.discount} off`}</span>
                      {form.minOrder > 0 && <> on orders above <span className="font-bold">₹{form.minOrder}</span></>}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="submit" disabled={saving}
                className="mt-4 w-full py-3.5 rounded-xl font-black text-sm transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00', boxShadow: '0 4px 16px rgba(201,168,76,0.25)' }}>
                {saving ? 'Creating...' : '+ Create Coupon'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-[3px] border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
          <p className="text-xs" style={{ color: t.textMuted }}>Loading coupons...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)' }}>
            <FiTag size={36} style={{ color: 'rgba(201,168,76,0.3)' }} />
          </div>
          <p className="font-bold" style={{ color: t.textMuted }}>No coupons yet</p>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>Create your first coupon above</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: t.textMuted }}>Active Coupons ({active.length})</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map(c => <CouponCard key={c._id} coupon={c} onDelete={handleDelete} t={t} dark={dark} />)}
              </div>
            </div>
          )}
          {inactive.length > 0 && (
            <div className="opacity-50">
              <div className="flex items-center gap-2 mb-4 mt-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: t.textMuted }}>Expired / Inactive ({inactive.length})</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactive.map(c => <CouponCard key={c._id} coupon={c} onDelete={handleDelete} t={t} dark={dark} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
