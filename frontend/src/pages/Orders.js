import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiArrowRight, FiClock, FiShoppingBag, FiCheckCircle, FiTruck, FiMapPin, FiHome, FiXCircle } from 'react-icons/fi';
import api from '../services/api';
import { OrderSkeleton } from '../components/Skeletons';

const STATUS_META = {
  Placed:          { color: '#818cf8', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.3)',  dot: '#818cf8'  },
  Accepted:        { color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)',  dot: '#a78bfa'  },
  Preparing:       { color: '#fb923c', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)',  dot: '#fb923c'  },
  'On the Way':    { color: '#facc15', bg: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.3)',   dot: '#facc15'  },
  'Arriving Soon': { color: '#2dd4bf', bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.3)',  dot: '#2dd4bf'  },
  Delivered:       { color: '#4ade80', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',   dot: '#4ade80'  },
  Cancelled:       { color: '#f87171', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',   dot: '#f87171'  },
};

const STATUS_ICON = {
  Placed: FiCheckCircle, Accepted: FiPackage, Preparing: FiClock,
  'On the Way': FiTruck, 'Arriving Soon': FiMapPin, Delivered: FiHome, Cancelled: FiXCircle,
};

function OrderCard({ order, i }) {
  const meta    = STATUS_META[order.status] || STATUS_META.Placed;
  const isLive  = !['Delivered', 'Cancelled'].includes(order.status);
  const Icon    = STATUS_ICON[order.status] || FiPackage;

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
      <Link to={`/orders/${order._id}`} className="block group">
        <div className="rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01]"
          style={{
            background: '#0d0d1a',
            border: `1px solid rgba(255,255,255,0.07)`,
            boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = meta.border}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>

          {/* top row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              {/* status icon circle */}
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                <Icon size={18} color={meta.color} />
              </div>
              <div>
                <p className="font-black text-white text-sm">#{order._id.slice(-6).toUpperCase()}</p>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <FiClock size={10} />
                  {new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-black text-lg" style={{ color: '#c9a84c' }}>₹{order.totalAmount.toFixed(0)}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{order.paymentMethod}</p>
            </div>
          </div>

          {/* status pill */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: meta.dot, boxShadow: isLive ? `0 0 6px ${meta.dot}` : 'none',
                  animation: isLive ? 'pulse 2s infinite' : 'none' }} />
              {order.status}
            </span>
          </div>

          {/* items preview */}
          <p className="text-xs truncate mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {order.items.map(it => `${it.name} ×${it.quantity}`).join(' · ')}
          </p>

          {/* footer */}
          <div className="flex items-center justify-between pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {order.items.length} item{order.items.length > 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-2.5"
              style={{ color: isLive ? meta.color : 'rgba(255,255,255,0.3)' }}>
              {isLive ? 'Track Order' : 'View Details'}
              <FiArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const active = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status));
  const past   = orders.filter(o =>  ['Delivered', 'Cancelled'].includes(o.status));

  return (
    <div className="min-h-screen" style={{ background: '#07070f' }}>
      {/* header glow */}
      <div className="relative overflow-hidden" style={{ background: '#0d0d1a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 100% at 50% -30%, rgba(201,168,76,0.12), transparent)' }} />
        <div className="relative max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: 'Poppins,sans-serif' }}>My Orders</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? 's' : ''} total` : 'Track and manage your orders'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        {loading ? (
          <div className="space-y-4">{Array(3).fill(0).map((_, i) => <OrderSkeleton key={i} />)}</div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <FiPackage size={36} color="#374151" />
            </div>
            <h3 className="font-black text-white text-xl mb-2">No orders yet</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>Your order history will appear here</p>
            <Link to="/menu"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00' }}>
              <FiShoppingBag size={15} /> Browse Menu
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Active */}
            {active.length > 0 && (
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Active Orders ({active.length})
                  </p>
                </div>
                <div className="space-y-3">
                  {active.map((o, i) => <OrderCard key={o._id} order={o} i={i} />)}
                </div>
              </div>
            )}

            {/* Past */}
            {past.length > 0 && (
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Past Orders ({past.length})
                </p>
                <div className="space-y-3">
                  {past.map((o, i) => <OrderCard key={o._id} order={o} i={i} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
