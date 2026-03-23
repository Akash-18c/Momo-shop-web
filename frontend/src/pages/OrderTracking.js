import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle, FiClock, FiPackage, FiTruck, FiMapPin,
  FiHome, FiArrowLeft, FiPhone, FiXCircle, FiStar,
} from 'react-icons/fi';
import api from '../services/api';

const STEPS = [
  {
    key: 'Placed',
    label: 'Order Placed',
    icon: FiCheckCircle,
    desc: 'We received your order',
    grad: 'from-blue-500 to-indigo-600',
    glow: 'rgba(99,102,241,0.45)',
    ring: 'rgba(99,102,241,0.3)',
    text: '#818cf8',
  },
  {
    key: 'Accepted',
    label: 'Accepted',
    icon: FiPackage,
    desc: 'Restaurant confirmed your order',
    grad: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.45)',
    ring: 'rgba(139,92,246,0.3)',
    text: '#a78bfa',
  },
  {
    key: 'Preparing',
    label: 'Preparing',
    icon: FiClock,
    desc: 'Chef is cooking your food',
    grad: 'from-orange-500 to-amber-500',
    glow: 'rgba(249,115,22,0.45)',
    ring: 'rgba(249,115,22,0.3)',
    text: '#fb923c',
  },
  {
    key: 'On the Way',
    label: 'On the Way',
    icon: FiTruck,
    desc: 'Rider picked up your order',
    grad: 'from-yellow-400 to-orange-500',
    glow: 'rgba(234,179,8,0.45)',
    ring: 'rgba(234,179,8,0.3)',
    text: '#facc15',
  },
  {
    key: 'Arriving Soon',
    label: 'Arriving Soon',
    icon: FiMapPin,
    desc: 'Almost at your doorstep!',
    grad: 'from-teal-400 to-cyan-500',
    glow: 'rgba(20,184,166,0.45)',
    ring: 'rgba(20,184,166,0.3)',
    text: '#2dd4bf',
  },
  {
    key: 'Delivered',
    label: 'Delivered',
    icon: FiHome,
    desc: 'Enjoy your meal!',
    grad: 'from-green-400 to-emerald-500',
    glow: 'rgba(34,197,94,0.45)',
    ring: 'rgba(34,197,94,0.3)',
    text: '#4ade80',
  },
];

const CANCELLED = {
  key: 'Cancelled', label: 'Cancelled',
  icon: FiXCircle, desc: 'This order was cancelled',
  grad: 'from-red-500 to-rose-600',
  glow: 'rgba(239,68,68,0.45)', ring: 'rgba(239,68,68,0.3)', text: '#f87171',
};

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchOrder = async () => {
    try { const r = await api.get(`/orders/${id}`); setOrder(r.data); } catch {}
  };

  useEffect(() => {
    fetchOrder().finally(() => setLoading(false));
    intervalRef.current = setInterval(fetchOrder, 15000);
    return () => clearInterval(intervalRef.current);
  }, [id]); // eslint-disable-line

  const isCancelled = order?.status === 'Cancelled';
  const currentStep = isCancelled ? CANCELLED : STEPS.find(s => s.key === order?.status) || STEPS[0];
  const currentIdx  = STEPS.findIndex(s => s.key === order?.status);
  const isLive      = order && !['Delivered', 'Cancelled'].includes(order.status);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#07070f' }}>
      <div className="text-center">
        <div className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
          style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
        <p className="text-gray-500 font-medium text-sm">Loading your order...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#07070f' }}>
      <div className="text-center">
        <p className="text-5xl mb-4">📦</p>
        <p className="font-bold text-gray-300 mb-4">Order not found</p>
        <Link to="/orders" className="btn-primary inline-block text-sm">Back to Orders</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#07070f' }}>

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden" style={{ background: '#0d0d1a' }}>
        {/* glow blob behind */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 80% at 50% -20%, ${currentStep.glow}, transparent)` }} />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          <Link to="/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold mb-6 transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
            <FiArrowLeft size={15} /> Back to Orders
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Order ID</p>
              <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Poppins,sans-serif' }}>
                #{order._id.slice(-6).toUpperCase()}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* amount pill */}
            <div className="rounded-2xl px-4 py-3 text-right flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="font-black text-xl" style={{ color: '#c9a84c' }}>₹{order.totalAmount.toFixed(0)}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{order.paymentMethod}</p>
            </div>
          </div>

          {/* current status big badge */}
          <AnimatePresence mode="wait">
            <motion.div key={order.status}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-5 flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${currentStep.ring}` }}>
              {/* icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg,var(--tw-gradient-stops))`,
                  boxShadow: `0 0 24px ${currentStep.glow}` }}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${currentStep.grad}`}
                  style={{ boxShadow: `0 0 24px ${currentStep.glow}` }}>
                  <currentStep.icon size={26} color="#fff" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Current Status</p>
                <p className="text-xl font-black" style={{ color: currentStep.text }}>{currentStep.label}</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{currentStep.desc}</p>
              </div>
              {isLive && (
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: currentStep.text, boxShadow: `0 0 8px ${currentStep.glow}` }} />
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>Live</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Timeline */}
        {!isCancelled && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl p-6" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="font-black text-white text-base mb-6">Order Timeline</p>

            <div className="space-y-0">
              {STEPS.map((step, i) => {
                const done    = i < currentIdx;
                const current = i === currentIdx;
                const future  = i > currentIdx;
                const Icon    = step.icon;

                return (
                  <div key={step.key} className="flex gap-4">
                    {/* dot + connector */}
                    <div className="flex flex-col items-center flex-shrink-0" style={{ width: 44 }}>
                      <motion.div
                        animate={current ? { scale: [1, 1.12, 1], boxShadow: [`0 0 0px ${step.glow}`, `0 0 18px ${step.glow}`, `0 0 0px ${step.glow}`] } : {}}
                        transition={current ? { repeat: Infinity, duration: 2 } : {}}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 flex-shrink-0"
                        style={
                          done || current
                            ? { background: `linear-gradient(135deg,var(--tw-gradient-stops))`, backgroundImage: `linear-gradient(135deg,${step.grad.includes('from-') ? '' : ''})` }
                            : { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.06)' }
                        }>
                        {/* inline gradient via style */}
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${done || current ? `bg-gradient-to-br ${step.grad}` : ''}`}
                          style={done || current ? { boxShadow: `0 4px 16px ${step.glow}` } : {}}>
                          <Icon size={18} color={done || current ? '#fff' : '#374151'} />
                        </div>
                      </motion.div>

                      {i < STEPS.length - 1 && (
                        <div className="w-0.5 flex-1 my-1 min-h-[32px] rounded-full overflow-hidden"
                          style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            initial={{ height: '0%' }}
                            animate={{ height: done ? '100%' : '0%' }}
                            transition={{ duration: 0.7, delay: i * 0.1 }}
                            className={`w-full bg-gradient-to-b ${step.grad}`} />
                        </div>
                      )}
                    </div>

                    {/* text */}
                    <div className="pb-7 flex-1 pt-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm" style={{ color: future ? '#374151' : '#fff' }}>
                          {step.label}
                        </p>
                        {current && (
                          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: `${step.glow}`, color: step.text, border: `1px solid ${step.ring}` }}>
                            Now
                          </motion.span>
                        )}
                        {done && (
                          <span className="text-[10px] font-bold" style={{ color: '#4ade80' }}>✓ Done</span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: future ? '#1f2937' : 'rgba(255,255,255,0.4)' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Cancelled banner */}
        {isCancelled && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)' }}>
              <FiXCircle size={22} color="#f87171" />
            </div>
            <div>
              <p className="font-black text-red-400 text-lg">Order Cancelled</p>
              <p className="text-sm text-gray-500">This order has been cancelled</p>
            </div>
          </motion.div>
        )}

        {/* Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="font-black text-white text-base mb-4">Items Ordered</p>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <img src={item.image || 'https://via.placeholder.com/52?text=🍽'}
                  alt={item.name} className="w-[52px] h-[52px] rounded-xl object-cover flex-shrink-0"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">{item.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <p className="font-black text-sm flex-shrink-0" style={{ color: '#c9a84c' }}>
                  ₹{(item.price * item.quantity).toFixed(0)}
                </p>
              </div>
            ))}
          </div>

          {/* totals */}
          <div className="mt-4 pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Discount</span>
                <span className="font-semibold text-green-400">-₹{order.discount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">Total Paid</span>
              <span className="font-black text-xl" style={{ color: '#c9a84c' }}>₹{order.totalAmount.toFixed(0)}</span>
            </div>
          </div>
        </motion.div>

        {/* Delivery address */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-6" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="font-black text-white text-base mb-4">Delivery Address</p>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <FiMapPin size={17} color="#ef4444" />
            </div>
            <div>
              <p className="font-bold text-white">{order.address?.name}</p>
              {order.address?.phone && (
                <a href={`tel:${order.address.phone}`}
                  className="flex items-center gap-1.5 text-sm font-semibold mt-0.5 transition-colors"
                  style={{ color: '#c9a84c' }}>
                  <FiPhone size={12} /> {order.address.phone}
                </a>
              )}
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {order.address?.street}, {order.address?.city} {order.address?.pincode}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Rider card — only show when assigned */}
        {order.rider && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl p-4 sm:p-6" style={{ background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.25)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.15)' }}>
                <FiTruck size={14} color="#818cf8" />
              </div>
              <p className="font-black text-white text-base">Your Delivery Rider</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
                {order.rider.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-sm sm:text-base truncate">{order.rider.name}</p>
                <a href={`tel:${order.rider.phone}`}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold mt-0.5"
                  style={{ color: '#818cf8' }}>
                  <FiPhone size={11} /> {order.rider.phone}
                </a>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs mb-1 truncate max-w-[80px] sm:max-w-none" style={{ color: 'rgba(255,255,255,0.35)' }}>{order.rider.bikeName}</p>
                <div className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl font-black text-xs sm:text-sm tracking-widest"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>
                  {order.rider.bikePlate}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Delivered celebration */}
        {order.status === 'Delivered' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="rounded-2xl p-6 text-center"
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <p className="text-4xl mb-2"><FiStar size={36} color="#4ade80" /></p>
            <p className="font-black text-green-400 text-lg">Order Delivered!</p>
            <p className="text-sm mt-1 mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Hope you enjoyed your meal</p>
            <Link to="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>
              Order Again
            </Link>
          </motion.div>
        )}

        {/* live polling note */}
        {isLive && (
          <p className="text-center text-xs pb-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
            🔄 Auto-refreshing every 15 seconds
          </p>
        )}
      </div>
    </div>
  );
}
