import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import Contact from './pages/Contact';
import AdminMessages from './pages/admin/AdminMessages';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminGallery from './pages/admin/AdminGallery';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminRiders from './pages/admin/AdminRiders';
import Footer from './components/Footer';

/* ── Branded page loader (auth check / protected route) ── */
function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
      style={{ background: '#0a0a0f' }}>

      {/* dual conic rings */}
      <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg,#c9a84c 0%,rgba(201,168,76,.08) 70%,transparent 100%)',
            WebkitMask: 'radial-gradient(farthest-side,transparent calc(100% - 3.5px),#000 calc(100% - 3.5px))',
            mask:        'radial-gradient(farthest-side,transparent calc(100% - 3.5px),#000 calc(100% - 3.5px))',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
          className="absolute rounded-full"
          style={{
            inset: 16,
            background: 'conic-gradient(from 180deg,#f0d060 0%,rgba(240,208,96,.06) 60%,transparent 100%)',
            WebkitMask: 'radial-gradient(farthest-side,transparent calc(100% - 2.5px),#000 calc(100% - 2.5px))',
            mask:        'radial-gradient(farthest-side,transparent calc(100% - 2.5px),#000 calc(100% - 2.5px))',
          }}
        />
        {/* centre logo */}
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative z-10"
          style={{ background: 'linear-gradient(135deg,#dc2626,#ef4444)', boxShadow: '0 0 28px rgba(239,68,68,.45)' }}>
          <span className="text-white font-black text-[10px] tracking-wide">MDB</span>
        </div>
      </div>

      {/* glow */}
      <div style={{ width: 60, height: 10, marginTop: -4,
        background: 'radial-gradient(ellipse,rgba(201,168,76,.28) 0%,transparent 70%)', filter: 'blur(5px)' }} />

      {/* brand */}
      <p className="mt-5 font-black tracking-[.12em] text-sm gold-shimmer">MDB RESTROCAFE</p>
      <p className="mt-1 text-[10px] tracking-[.25em] uppercase" style={{ color: 'rgba(255,255,255,.2)' }}>Love at First Bite</p>

      {/* label */}
      <p className="mt-5 text-xs font-semibold" style={{ color: 'rgba(201,168,76,.7)' }}>{label}</p>

      {/* bouncing dots */}
      <div className="flex gap-1.5 mt-3">
        {[0, 1, 2].map(i => (
          <motion.span key={i}
            animate={{ scale: [.6, 1.15, .6], opacity: [.3, 1, .3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'rgba(201,168,76,.8)' }}
          />
        ))}
      </div>
    </div>
  );
}

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader label="Authenticating…" />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

/* ── Fade wrapper for page transitions ── */
function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster
              position="top-center"
              toastOptions={{
                style: { borderRadius: '14px', fontWeight: 600, fontSize: '14px' },
                success: { style: { background: '#052e16', color: '#4ade80', border: '1px solid #166534' } },
                error: { style: { background: '#450a0a', color: '#f87171', border: '1px solid #991b1b' } },
                duration: 3000,
              }}
            />
            <Routes>
              <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="menu" element={<AdminMenu />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="riders" element={<AdminRiders />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="messages" element={<AdminMessages />} />
              </Route>
              <Route path="/*" element={
                <>
                  <Navbar />
                  <CartDrawer />
                  <PageTransition>
                    <Routes>
                      <Route path="/" element={<><Home /><Footer /></>} />
                      <Route path="/menu" element={<Menu />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                      <Route path="/orders/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
                    </Routes>
                  </PageTransition>
                </>
              } />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
