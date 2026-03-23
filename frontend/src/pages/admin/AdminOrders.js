import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiUser, FiMapPin, FiPhone, FiCalendar, FiFilter, FiTruck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useNotifs } from './AdminLayout';

const STATUSES = ['Placed', 'Accepted', 'Preparing', 'On the Way', 'Arriving Soon', 'Delivered', 'Cancelled'];

const STATUS_STYLE = {
  Placed:          { pill: 'bg-blue-500/15 text-blue-400 border-blue-500/30',       dot: 'bg-blue-400'    },
  Accepted:        { pill: 'bg-violet-500/15 text-violet-400 border-violet-500/30', dot: 'bg-violet-400'  },
  Preparing:       { pill: 'bg-orange-500/15 text-orange-400 border-orange-500/30', dot: 'bg-orange-400'  },
  'On the Way':    { pill: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400'  },
  'Arriving Soon': { pill: 'bg-teal-500/15 text-teal-400 border-teal-500/30',       dot: 'bg-teal-400'    },
  Delivered:       { pill: 'bg-green-500/15 text-green-400 border-green-500/30',    dot: 'bg-green-400'   },
  Cancelled:       { pill: 'bg-red-500/15 text-red-400 border-red-500/30',          dot: 'bg-red-400'     },
};

const BTN_COLORS = {
  Placed:          'hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/40',
  Accepted:        'hover:bg-violet-500/20 hover:text-violet-300 hover:border-violet-500/40',
  Preparing:       'hover:bg-orange-500/20 hover:text-orange-300 hover:border-orange-500/40',
  'On the Way':    'hover:bg-yellow-500/20 hover:text-yellow-300 hover:border-yellow-500/40',
  'Arriving Soon': 'hover:bg-teal-500/20 hover:text-teal-300 hover:border-teal-500/40',
  Delivered:       'hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/40',
  Cancelled:       'hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40',
};

const todayStr = () => new Date().toISOString().split('T')[0];

export default function AdminOrders() {
  const { t, dark, clearOrders } = useNotifs();
  const [orders,   setOrders]   = useState([]);
  const [riders,   setRiders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');
  const [date,     setDate]     = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filter) params.status = filter;
    api.get('/orders/admin/all', { params })
      .then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { clearOrders(); }, []); // eslint-disable-line
  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { api.get('/riders').then(r => setRiders(r.data)).catch(() => {}); }, []);

  const displayed = date
    ? orders.filter(o => new Date(o.createdAt).toISOString().split('T')[0] === date)
    : orders;

  const updateStatus = async (id, status, currentStatus) => {
    if (currentStatus === 'Delivered' && status === 'Cancelled') { toast.error('Cannot cancel a delivered order'); return; }
    try { await api.patch(`/orders/${id}/status`, { status }); toast.success(`Status → ${status}`); fetchOrders(); }
    catch (err) { toast.error(err.message || 'Failed'); }
  };

  const assignRider = async (orderId, riderId) => {
    try {
      await api.patch(`/orders/${orderId}/rider`, { riderId: riderId || null });
      toast.success(riderId ? 'Rider assigned!' : 'Rider removed');
      fetchOrders();
    } catch (err) { toast.error(err.message || 'Failed'); }
  };

  const inputCls = {
    background: t.card,
    border: `1px solid ${t.border}`,
    color: t.text,
    colorScheme: dark ? 'dark' : 'light',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black" style={{ color: t.text, fontFamily: 'Poppins,sans-serif' }}>Orders</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: t.textMuted }}>
            {displayed.length} order{displayed.length !== 1 ? 's' : ''}
            {date ? ` on ${new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ' total'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="relative flex items-center">
            <FiCalendar size={12} className="absolute left-2.5 pointer-events-none" style={{ color: t.textMuted }} />
            <input type="date" value={date} max={todayStr()} onChange={e => setDate(e.target.value)}
              className="text-xs rounded-xl pl-7 pr-2 py-2 focus:outline-none"
              style={inputCls} />
          </div>
          <div className="relative flex items-center">
            <FiFilter size={12} className="absolute left-2.5 pointer-events-none" style={{ color: t.textMuted }} />
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="text-xs rounded-xl pl-7 pr-3 py-2 focus:outline-none appearance-none"
              style={inputCls}>
              <option value="">All</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="flex flex-wrap gap-2">
        {[{ label: 'Today', val: todayStr() }, { label: 'Yesterday', val: new Date(Date.now() - 86400000).toISOString().split('T')[0] }, { label: 'All', val: '' }]
          .map(({ label, val }) => (
            <button key={label} onClick={() => setDate(val)}
              className="text-xs px-3 py-1.5 rounded-xl font-semibold transition-all"
              style={{
                border: `1px solid ${date === val ? 'rgba(239,68,68,0.5)' : t.border}`,
                background: date === val ? 'rgba(239,68,68,0.15)' : 'transparent',
                color: date === val ? '#f87171' : t.textMuted,
              }}>
              {label}
            </button>
          ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: '#ef4444', borderTopColor: 'transparent' }} />
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20" style={{ color: t.textMuted }}>
          <FiPackage size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No orders found</p>
          {date && <p className="text-sm mt-1">Try a different date or clear the filter</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((order, i) => {
            const style      = STATUS_STYLE[order.status] || STATUS_STYLE.Placed;
            const isExpanded = expanded === order._id;
            const isDelivered = order.status === 'Delivered';
            const isCancelled = order.status === 'Cancelled';

            return (
              <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-2xl overflow-hidden transition-all"
                style={{ background: t.card, border: `1px solid ${t.border}` }}>

                {/* Header row */}
                <div className="p-4 sm:p-5 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : order._id)}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', color: t.textMuted }}>
                        <FiPackage size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-black text-sm" style={{ color: t.text }}>#{order._id.slice(-6).toUpperCase()}</p>
                          <span className={`inline-flex items-center gap-1 border px-2.5 py-0.5 rounded-full text-[11px] font-bold ${style.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />{order.status}
                          </span>
                          {order.rider && (
                            <span className="inline-flex items-center gap-1 border px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-400 border-indigo-500/30">
                              <FiTruck size={9} /> {order.rider.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1 text-xs" style={{ color: t.textMuted }}><FiUser size={10} /> {order.user?.name || 'User'}</span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: t.textMuted }}>
                            <FiClock size={10} />
                            {new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-black text-red-400 text-lg">₹{order.totalAmount.toFixed(0)}</span>
                      <span className="text-xs" style={{ color: t.textMuted }}>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="p-4 sm:p-5 space-y-5"
                    style={{ borderTop: `1px solid ${t.border}` }}>

                    {/* Items */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: t.textMuted }}>Items</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, j) => (
                          <span key={j} className="text-xs px-3 py-1.5 rounded-xl font-medium"
                            style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', color: t.text }}>
                            {item.name} ×{item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2 text-sm" style={{ color: t.textMuted }}>
                        <FiMapPin size={13} className="mt-0.5 flex-shrink-0" />
                        <span>{order.address?.street}, {order.address?.city} {order.address?.pincode}</span>
                      </div>
                      {order.address?.phone && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: t.textMuted }}>
                          <FiPhone size={13} /><span>{order.address.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Rider Assignment */}
                    <div className="rounded-xl p-4" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)' }}>
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <FiTruck size={12} /> Assign Delivery Rider
                      </p>
                      {order.rider ? (
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                              style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>
                              {order.rider.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold" style={{ color: t.text }}>{order.rider.name}</p>
                              <p className="text-xs" style={{ color: t.textMuted }}>{order.rider.phone} · {order.rider.bikePlate}</p>
                            </div>
                          </div>
                          <button onClick={() => assignRider(order._id, null)}
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <FiX size={11} /> Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          {riders.filter(r => r.isActive).length === 0 ? (
                            <p className="text-xs" style={{ color: t.textMuted }}>No active riders. Add riders from the Riders page.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {riders.filter(r => r.isActive).map(rider => (
                                <button key={rider._id} onClick={() => assignRider(order._id, rider._id)}
                                  className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                                  style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                                  <FiTruck size={11} />
                                  <span>{rider.name}</span>
                                  <span className="font-mono text-indigo-600">{rider.bikePlate}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status buttons */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>Update Status</p>
                        {isDelivered && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">✓ Completed</span>}
                        {isCancelled && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">Cancelled</span>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {STATUSES.map(s => {
                          const isActive           = order.status === s;
                          const disabledByDelivered = isDelivered && s === 'Cancelled';
                          const disabledByCancelled = isCancelled && !isActive;
                          return (
                            <button key={s}
                              onClick={() => !disabledByDelivered && !disabledByCancelled && updateStatus(order._id, s, order.status)}
                              disabled={disabledByDelivered || disabledByCancelled}
                              className={`text-xs px-3 py-2 rounded-xl font-semibold border transition-all duration-200 ${
                                isActive ? `${STATUS_STYLE[s].pill} border-current`
                                  : disabledByDelivered || disabledByCancelled ? 'opacity-40 cursor-not-allowed'
                                  : `${BTN_COLORS[s]}`
                              }`}
                              style={!isActive && !disabledByDelivered && !disabledByCancelled
                                ? { border: `1px solid ${t.border}`, color: t.textMuted }
                                : {}}>
                              {isActive && '✓ '}{s}
                            </button>
                          );
                        })}
                      </div>
                      {isDelivered && <p className="text-xs mt-2" style={{ color: t.textMuted }}>* Delivered orders cannot be cancelled</p>}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
