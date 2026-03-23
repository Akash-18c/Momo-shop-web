import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiPhone, FiUser, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useNotifs } from './AdminLayout';

const EMPTY = { name: '', phone: '', bikeName: '', bikePlate: '' };

function RiderForm({ initial, onSave, onCancel, saving, t, dark }) {
  const [form, setForm] = useState(initial || EMPTY);
  const f = k => e => setForm(p => ({ ...p, [k]: k === 'bikePlate' ? e.target.value.toUpperCase() : e.target.value }));

  const inputBase = {
    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${t.border}`,
    color: t.text,
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem 0.75rem 2.25rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
  };

  return (
    <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
      className="rounded-2xl overflow-hidden mb-6"
      style={{ border: `1px solid ${t.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c,#f0d060,#c9a84c,transparent)' }} />
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: t.card, borderBottom: `1px solid ${t.border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)' }}>
            <FiTruck size={15} color="#c9a84c" />
          </div>
          <div>
            <p className="font-black" style={{ color: t.text }}>{initial ? 'Edit Rider' : 'Add New Rider'}</p>
            <p className="text-[10px]" style={{ color: t.textMuted }}>Fill in rider details</p>
          </div>
        </div>
        <button onClick={onCancel} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ color: t.textMuted, border: `1px solid ${t.border}` }}
          onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.background = t.navHover; }}
          onMouseLeave={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = 'transparent'; }}>
          <FiX size={14} />
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ background: t.card }}>
        {[
          { key: 'name',      label: 'Rider Name',   placeholder: 'e.g. Rahul Kumar',  icon: FiUser  },
          { key: 'phone',     label: 'Phone Number', placeholder: 'e.g. 9876543210',   icon: FiPhone },
          { key: 'bikeName',  label: 'Bike Name',    placeholder: 'e.g. Honda Activa', icon: FiTruck },
          { key: 'bikePlate', label: 'Plate Number', placeholder: 'e.g. WB12AB1234',   icon: FiTruck },
        ].map(({ key, label, placeholder, icon: Icon }) => (
          <div key={key} className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: t.textMuted }}>{label}</label>
            <div className="relative">
              <Icon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(201,168,76,0.5)' }} />
              <input value={form[key]} onChange={f(key)} placeholder={placeholder}
                style={{ ...inputBase, fontFamily: key === 'bikePlate' ? 'monospace' : undefined, letterSpacing: key === 'bikePlate' ? '0.1em' : undefined }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = t.border}
                required />
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 pb-5 flex gap-3" style={{ background: t.card }}>
        <button onClick={() => onSave(form)}
          disabled={saving || !form.name || !form.phone || !form.bikeName || !form.bikePlate}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00', boxShadow: '0 4px 16px rgba(201,168,76,0.25)' }}>
          <FiCheck size={14} /> {saving ? 'Saving...' : 'Save Rider'}
        </button>
        <button onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ color: t.textMuted, border: `1px solid ${t.border}` }}
          onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.borderColor = t.border; }}>
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

function RiderCard({ rider, i, onEdit, onDelete, onToggle, t, dark }) {
  const initials = rider.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: t.card,
        border: `1px solid ${rider.isActive ? 'rgba(201,168,76,0.28)' : t.border}`,
        boxShadow: rider.isActive ? '0 4px 28px rgba(201,168,76,0.1)' : 'none',
        transition: 'all 0.25s ease',
      }}>

      <div className="h-[3px]" style={{
        background: rider.isActive
          ? 'linear-gradient(90deg,transparent,#c9a84c,#f0d060,#c9a84c,transparent)'
          : `linear-gradient(90deg,${t.border},${t.border})`,
      }} />

      {rider.isActive && (
        <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right,rgba(201,168,76,0.07),transparent 70%)' }} />
      )}

      <div className="p-5 relative">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0"
              style={{
                background: rider.isActive ? 'linear-gradient(135deg,rgba(201,168,76,0.22),rgba(240,208,96,0.1))' : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'),
                border: `2px solid ${rider.isActive ? 'rgba(201,168,76,0.45)' : t.border}`,
                color: rider.isActive ? '#f0d060' : t.textMuted,
                boxShadow: rider.isActive ? '0 0 20px rgba(201,168,76,0.2)' : 'none',
              }}>
              {initials}
            </div>
            <div>
              <p className="font-black text-base leading-tight" style={{ color: t.text }}>{rider.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-2 h-2 rounded-full ${rider.isActive ? 'animate-pulse' : ''}`}
                  style={{ background: rider.isActive ? '#c9a84c' : t.textMuted }} />
                <p className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: rider.isActive ? '#c9a84c' : t.textMuted }}>
                  {rider.isActive ? 'On Duty' : 'Off Duty'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={onEdit}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ color: t.textMuted, border: `1px solid ${t.border}` }}
              onMouseEnter={e => { e.currentTarget.style.color = '#c9a84c'; e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = t.border; }}>
              <FiEdit2 size={13} />
            </button>
            <button onClick={() => onDelete(rider._id)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ color: t.textMuted, border: `1px solid ${t.border}` }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = t.border; }}>
              <FiTrash2 size={13} />
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          <a href={`tel:${rider.phone}`}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all"
            style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: `1px solid ${t.border}` }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.background = 'rgba(201,168,76,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <FiPhone size={13} style={{ color: '#c9a84c' }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: t.text }}>{rider.phone}</span>
          </a>

          <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
            style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: `1px solid ${t.border}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <FiTruck size={13} style={{ color: '#c9a84c' }} />
            </div>
            <span className="text-sm font-semibold flex-1" style={{ color: t.text }}>{rider.bikeName}</span>
            <span className="text-[11px] font-black px-2.5 py-1 rounded-lg tracking-widest"
              style={{ background: 'rgba(201,168,76,0.1)', color: '#f0d060', border: '1px solid rgba(201,168,76,0.2)', fontFamily: 'monospace' }}>
              {rider.bikePlate}
            </span>
          </div>
        </div>

        <button onClick={() => onToggle(rider._id)}
          className="w-full py-2.5 rounded-xl text-xs font-black transition-all"
          style={rider.isActive
            ? { background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }
            : { background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
          {rider.isActive ? 'Mark as Off Duty' : 'Mark as On Duty'}
        </button>
      </div>
    </motion.div>
  );
}

export default function AdminRiders() {
  const { t, dark } = useNotifs();
  const [riders,   setRiders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [saving,   setSaving]   = useState(false);

  const fetchRiders = () =>
    api.get('/riders').then(r => setRiders(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchRiders(); }, []);

  const handleCreate = async (form) => {
    setSaving(true);
    try { await api.post('/riders', form); toast.success('Rider added!'); setShowForm(false); fetchRiders(); }
    catch (err) { toast.error(err.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try { await api.put(`/riders/${editing._id}`, form); toast.success('Rider updated!'); setEditing(null); fetchRiders(); }
    catch (err) { toast.error(err.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this rider?')) return;
    try { await api.delete(`/riders/${id}`); toast.success('Rider removed'); fetchRiders(); }
    catch (err) { toast.error(err.message || 'Failed'); }
  };

  const handleToggle = async (id) => {
    try { await api.patch(`/riders/${id}/toggle`); fetchRiders(); }
    catch (err) { toast.error(err.message || 'Failed'); }
  };

  const active   = riders.filter(r => r.isActive);
  const inactive = riders.filter(r => !r.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: t.text, fontFamily: 'Poppins,sans-serif' }}>Riders</h1>
          <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>
            <span style={{ color: '#c9a84c' }}>{active.length} on duty</span> · {inactive.length} off duty
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { setShowForm(v => !v); setEditing(null); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all"
          style={showForm
            ? { background: t.navHover, color: t.textMuted, border: `1px solid ${t.border}` }
            : { background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00', boxShadow: '0 4px 16px rgba(201,168,76,0.3)' }}>
          {showForm ? <><FiX size={15} /> Cancel</> : <><FiPlus size={15} /> Add Rider</>}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && !editing && (
          <RiderForm onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} t={t} dark={dark} />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-10 h-10 border-[3px] border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
          <p className="text-xs" style={{ color: t.textMuted }}>Loading riders...</p>
        </div>
      ) : riders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <FiTruck size={36} style={{ color: 'rgba(201,168,76,0.35)' }} />
          </div>
          <p className="font-bold" style={{ color: t.textMuted }}>No riders yet</p>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>Add your first delivery rider above</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#c9a84c' }} />
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: t.textMuted }}>On Duty ({active.length})</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map((rider, i) => (
                  <RiderCard key={rider._id} rider={rider} i={i} t={t} dark={dark}
                    onEdit={() => { setEditing(rider); setShowForm(false); }}
                    onDelete={handleDelete} onToggle={handleToggle} />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {editing && (
              <RiderForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} saving={saving} t={t} dark={dark} />
            )}
          </AnimatePresence>

          {inactive.length > 0 && (
            <div className="opacity-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: t.textMuted }} />
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: t.textMuted }}>Off Duty ({inactive.length})</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactive.map((rider, i) => (
                  <RiderCard key={rider._id} rider={rider} i={i} t={t} dark={dark}
                    onEdit={() => { setEditing(rider); setShowForm(false); }}
                    onDelete={handleDelete} onToggle={handleToggle} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
