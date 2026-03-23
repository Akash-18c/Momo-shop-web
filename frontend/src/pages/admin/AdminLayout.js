import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiShoppingBag, FiImage, FiTag, FiMenu, FiLogOut,
  FiHome, FiPackage, FiChevronRight, FiMessageSquare, FiBell, FiX, FiTruck,
  FiSun, FiMoon, FiRefreshCw,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const POLL_MS = 10000;
const LS_KEY  = 'admin_orders_last_seen';
const THEME_KEY = 'admin_theme';

export const NotifContext = createContext({ orders: 0, messages: 0, clearOrders: () => {}, clearMessages: () => {}, dark: true, t: {} });
export const useNotifs = () => useContext(NotifContext);

/* ── Theme tokens ── */
const DARK = {
  bg:         '#0a0a0f',
  sidebar:    '#0d0d18',
  header:     '#0d0d18',
  main:       '#0f0f1a',
  card:       '#141420',
  border:     'rgba(255,255,255,0.08)',
  text:       '#ffffff',
  textMuted:  '#6b7280',
  navHover:   'rgba(255,255,255,0.06)',
  navActive:  'rgba(239,68,68,0.18)',
};
const LIGHT = {
  bg:         '#f1f5f9',
  sidebar:    '#ffffff',
  header:     '#ffffff',
  main:       '#f1f5f9',
  card:       '#ffffff',
  border:     'rgba(0,0,0,0.08)',
  text:       '#0f172a',
  textMuted:  '#64748b',
  navHover:   'rgba(0,0,0,0.05)',
  navActive:  'rgba(239,68,68,0.1)',
};

/* ── Notif panel ── */
function NotifPanel({ notifs, onClose, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,   scale: 1     }}
      exit={{    opacity: 0, y: -10, scale: 0.95  }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      className="absolute top-full right-0 mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl z-[999]"
      style={{ background: t.card, border: `1px solid ${t.border}`, boxShadow: '0 16px 48px rgba(0,0,0,0.35)' }}>
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#ef4444,#f97316)' }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-sm" style={{ color: t.text }}>Notifications</p>
          <button onClick={onClose} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-black/10 transition-colors">
            <FiX size={13} color={t.textMuted} />
          </button>
        </div>
        {notifs.orders === 0 && notifs.messages === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: t.textMuted }}>No new notifications</p>
        ) : (
          <div className="space-y-2">
            {notifs.orders > 0 && (
              <Link to="/admin/orders" onClick={onClose}
                className="flex items-center gap-3 p-2.5 rounded-xl transition-colors"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.2)' }}>
                  <FiPackage size={14} color="#ef4444" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: t.text }}>New Orders</p>
                  <p className="text-xs" style={{ color: t.textMuted }}>Tap to manage</p>
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: '#ef4444', color: '#fff' }}>{notifs.orders}</span>
              </Link>
            )}
            {notifs.messages > 0 && (
              <Link to="/admin/messages" onClick={onClose}
                className="flex items-center gap-3 p-2.5 rounded-xl transition-colors"
                style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.18)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,168,76,0.2)' }}>
                  <FiMessageSquare size={14} color="#c9a84c" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: t.text }}>Unread Messages</p>
                  <p className="text-xs" style={{ color: t.textMuted }}>Tap to read</p>
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: '#c9a84c', color: '#1a0e00' }}>{notifs.messages}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Bell button ── */
function BellButton({ notifs, t }) {
  const [open, setOpen] = useState(false);
  const total = notifs.orders + notifs.messages;
  const ref   = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <motion.button onClick={() => setOpen(v => !v)} whileTap={{ scale: 0.92 }}
        className="relative p-2.5 rounded-xl transition-colors"
        style={{ background: total > 0 ? 'rgba(239,68,68,0.12)' : `${t.navHover}`, border: `1px solid ${total > 0 ? 'rgba(239,68,68,0.35)' : t.border}` }}>
        <FiBell size={17} color={total > 0 ? '#ef4444' : t.textMuted} />
        <AnimatePresence>
          {total > 0 && (
            <motion.span key={total} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-black text-white px-1"
              style={{ background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.7)' }}>
              {total > 9 ? '9+' : total}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <AnimatePresence>
        {open && <NotifPanel notifs={notifs} onClose={() => setOpen(false)} t={t} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Refresh overlay ── */
function RefreshOverlay() {
  const tips = [
    'Syncing latest orders…',
    'Refreshing menu data…',
    'Loading fresh stats…',
    'Almost there…',
  ];
  const [tip, setTip] = useState(tips[0]);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % tips.length; setTip(tips[i]); }, 600);
    return () => clearInterval(id);
  }, []); // eslint-disable-line
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)' }}>

      {/* outer slow ring */}
      <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #c9a84c 0%, rgba(201,168,76,0.08) 70%, transparent 100%)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            mask:        'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
          }}
        />
        {/* inner fast ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
          className="absolute rounded-full"
          style={{
            width: 64, height: 64,
            background: 'conic-gradient(from 180deg, #f0d060 0%, rgba(240,208,96,0.06) 60%, transparent 100%)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px))',
            mask:        'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px))',
          }}
        />
        {/* centre logo */}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center shadow-lg"
          style={{ boxShadow: '0 0 24px rgba(239,68,68,0.4)' }}>
          <span className="text-white font-black text-[10px]">MDB</span>
        </div>
      </div>

      {/* glow under rings */}
      <div className="mt-[-8px] w-16 h-4 rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.25) 0%, transparent 70%)', filter: 'blur(6px)' }} />

      <motion.p
        key={tip}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-sm font-semibold tracking-wide"
        style={{ color: 'rgba(201,168,76,0.8)' }}>
        {tip}
      </motion.p>
      <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>MDB RESTROCAFE Admin</p>
    </motion.div>
  );
}

/* ── Refresh button ── */
function RefreshButton({ t }) {
  const [spinning, setSpinning] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const handleRefresh = () => {
    if (spinning) return;
    setSpinning(true);
    setShowOverlay(true);
    setTimeout(() => window.location.reload(), 1400);
  };
  return (
    <>
      <AnimatePresence>{showOverlay && <RefreshOverlay />}</AnimatePresence>
      <motion.button
        onClick={handleRefresh}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.9 }}
        title="Refresh page"
        className="relative flex items-center justify-center select-none"
        style={{ width: 38, height: 38 }}>
        <motion.span
          animate={spinning ? { rotate: 360 } : { rotate: 0 }}
          transition={spinning ? { repeat: Infinity, duration: 0.9, ease: 'linear' } : { duration: 0 }}
          className="absolute inset-0 rounded-full"
          style={{
            background: spinning
              ? 'conic-gradient(from 0deg, #c9a84c 0%, rgba(201,168,76,0.15) 60%, transparent 100%)'
              : 'none',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px))',
            mask:        'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px))',
          }}
        />
        {!spinning && (
          <span className="absolute inset-0 rounded-full" style={{ border: `1.5px solid ${t.border}` }} />
        )}
        {spinning && (
          <span className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 12px rgba(201,168,76,0.35)' }} />
        )}
        <motion.span
          animate={spinning ? { rotate: -360 } : { rotate: 0 }}
          transition={spinning ? { repeat: Infinity, duration: 0.9, ease: 'linear' } : { duration: 0 }}
          style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
          <FiRefreshCw size={15} color={spinning ? '#c9a84c' : t.textMuted} />
        </motion.span>
      </motion.button>
    </>
  );
}

/* ── Theme toggle button ── */
function ThemeToggle({ dark, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      className="relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all overflow-hidden"
      style={{
        background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
      }}>
      {/* sliding pill */}
      <div className="relative w-10 h-5 rounded-full flex items-center"
        style={{ background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(201,168,76,0.25)' }}>
        <motion.div
          animate={{ x: dark ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: dark ? '#374151' : 'linear-gradient(135deg,#c9a84c,#f0d060)', boxShadow: dark ? 'none' : '0 2px 8px rgba(201,168,76,0.4)' }}>
          {dark
            ? <FiMoon size={9} color="#9ca3af" />
            : <FiSun  size={9} color="#1a0e00" />}
        </motion.div>
      </div>
      <span className="text-xs font-bold" style={{ color: dark ? '#9ca3af' : '#64748b' }}>
        {dark ? 'Dark' : 'Light'}
      </span>
    </motion.button>
  );
}

/* ── Nav items ── */
const navItems = [
  { to: '/admin',          label: 'Dashboard',  icon: FiGrid,          end: true },
  { to: '/admin/menu',     label: 'Menu Items', icon: FiShoppingBag              },
  { to: '/admin/orders',   label: 'Orders',     icon: FiPackage                  },
  { to: '/admin/riders',   label: 'Riders',     icon: FiTruck                    },
  { to: '/admin/gallery',  label: 'Gallery',    icon: FiImage                    },
  { to: '/admin/coupons',  label: 'Coupons',    icon: FiTag                      },
  { to: '/admin/messages', label: 'Messages',   icon: FiMessageSquare            },
];

/* ── Sidebar ── */
function Sidebar({ notifs, onClose, t, dark }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-64 flex-shrink-0 transition-colors duration-300"
      style={{ background: t.sidebar, borderRight: `1px solid ${t.border}` }}>

      {/* logo */}
      <div className="p-5" style={{ borderBottom: `1px solid ${t.border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-900/30 flex-shrink-0">
            <span className="text-white font-black text-xs">MDB</span>
          </div>
          <div>
            <p className="font-black text-sm leading-tight" style={{ color: t.text, fontFamily: 'Poppins,sans-serif' }}>MDB RESTROCAFE</p>
            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* user card */}
      <div className="px-3 pt-3">
        <div className="px-3 py-3 rounded-2xl flex items-center gap-3"
          style={{ background: dark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)', border: dark ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(239,68,68,0.15)' }}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate" style={{ color: t.text }}>{user?.name}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400">Administrator</p>
          </div>
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: t.textMuted }}>Navigation</p>
        {navItems.map(item => {
          const badge = item.to === '/admin/orders' ? notifs.orders : item.to === '/admin/messages' ? notifs.messages : 0;
          return (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? '' : ''}`
              }
              style={({ isActive }) => ({
                background: isActive ? (dark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)') : 'transparent',
                color: isActive ? (dark ? '#fff' : '#0f172a') : t.textMuted,
                border: isActive ? `1px solid ${dark ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.15)'}` : '1px solid transparent',
              })}>
              {({ isActive }) => (
                <>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: isActive ? '#ef4444' : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                      color: isActive ? '#fff' : t.textMuted,
                      boxShadow: isActive ? '0 4px 12px rgba(239,68,68,0.35)' : 'none',
                    }}>
                    <item.icon size={15} />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {badge > 0 && (
                    <motion.span key={badge} initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                      className="text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                      style={{
                        background: item.to === '/admin/orders' ? '#ef4444' : '#c9a84c',
                        color:      item.to === '/admin/orders' ? '#fff'    : '#1a0e00',
                        boxShadow:  item.to === '/admin/orders' ? '0 0 8px rgba(239,68,68,0.6)' : '0 0 8px rgba(201,168,76,0.5)',
                      }}>
                      {badge > 9 ? '9+' : badge}
                    </motion.span>
                  )}
                  {!badge && isActive && <FiChevronRight size={14} className="text-red-400" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* bottom */}
      <div className="p-3 space-y-0.5" style={{ borderTop: `1px solid ${t.border}` }}>
        <Link to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ color: t.textMuted }}
          onMouseEnter={e => e.currentTarget.style.background = t.navHover}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
            <FiHome size={15} color={t.textMuted} />
          </div>
          View Website
        </Link>
        <button onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ color: t.textMuted }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = 'transparent'; }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
            <FiLogOut size={15} color={t.textMuted} />
          </div>
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ── Layout ── */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifs, setNotifs] = useState({ orders: 0, messages: 0 });
  const [dark, setDark] = useState(() => (localStorage.getItem(THEME_KEY) ?? 'dark') !== 'light');

  const t = dark ? DARK : LIGHT;

  const toggleTheme = () => {
    setDark(v => {
      const next = !v;
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      return next;
    });
  };

  const poll = useCallback(async () => {
    try {
      const [ordersRes, msgsRes] = await Promise.all([
        api.get('/orders/admin/all'),
        api.get('/messages'),
      ]);
      const lastSeen = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
      const newOrderCount = (ordersRes.data || []).filter(o => new Date(o.createdAt).getTime() > lastSeen).length;
      const unreadMessages = (msgsRes.data || []).filter(m => !m.isRead).length;
      setNotifs({ orders: newOrderCount, messages: unreadMessages });
    } catch {}
  }, []);

  const clearOrders = useCallback(() => {
    localStorage.setItem(LS_KEY, Date.now().toString());
    setNotifs(n => ({ ...n, orders: 0 }));
  }, []);

  const clearMessages = useCallback(() => {
    setNotifs(n => ({ ...n, messages: 0 }));
  }, []);

  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  return (
    <NotifContext.Provider value={{ ...notifs, clearOrders, clearMessages, dark, t }}>
      <div className="flex h-screen overflow-hidden transition-colors duration-300" style={{ background: t.bg }}>

        {/* desktop sidebar */}
        <div className="hidden lg:flex flex-shrink-0">
          <Sidebar notifs={notifs} onClose={() => {}} t={t} dark={dark} />
        </div>

        {/* mobile sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)} />
              <motion.div initial={{ x: -264 }} animate={{ x: 0 }} exit={{ x: -264 }}
                transition={{ type: 'spring', damping: 28, stiffness: 200 }}
                className="fixed left-0 top-0 h-full z-50 lg:hidden shadow-2xl">
                <Sidebar notifs={notifs} onClose={() => setSidebarOpen(false)} t={t} dark={dark} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* header */}
          <header className="px-4 sm:px-6 py-3.5 flex items-center gap-4 flex-shrink-0 transition-colors duration-300"
            style={{ background: t.header, borderBottom: `1px solid ${t.border}` }}>
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl transition-all"
              style={{ background: t.navHover, color: t.textMuted }}>
              <FiMenu size={18} />
            </button>
            <div className="flex-1">
              <h1 className="font-black text-base" style={{ color: t.text, fontFamily: 'Poppins,sans-serif' }}>Admin Dashboard</h1>
              <p className="text-xs" style={{ color: t.textMuted }}>MDB RESTROCAFE Management</p>
            </div>
            <div className="flex items-center gap-2.5">
              {/* live dot */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-green-400">Live</span>
              </div>
              {/* refresh */}
              <RefreshButton t={t} />
              {/* theme toggle */}
              <ThemeToggle dark={dark} onToggle={toggleTheme} />
              {/* bell */}
              <BellButton notifs={notifs} t={t} />
            </div>
          </header>

          {/* main content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 transition-colors duration-300"
            style={{ background: t.main }}>
            <Outlet />
          </main>
        </div>
      </div>
    </NotifContext.Provider>
  );
}
