import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
  { to: '/orders', label: 'My Orders' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { count, setIsOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setUserMenu(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); setUserMenu(false); };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#080810]/95 backdrop-blur-xl shadow-lg shadow-black/30' : 'bg-[#080810]'} border-b border-[#1e1e30]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)', boxShadow: '0 4px 14px rgba(201,168,76,0.4)' }}>
              <span className="text-[#1a0e00] font-black text-xs leading-none">MDB</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-white text-sm leading-tight tracking-tight" style={{fontFamily:'Poppins,sans-serif'}}>MDB RESTROCAFE</p>
              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#c9a84c' }}>Love at First Bite</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => {
              const active = location.pathname === l.to || (l.to !== '/' && location.pathname.startsWith(l.to));
              return (
                <Link key={l.to} to={l.to}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${active ? 'text-[#c9a84c] bg-[#c9a84c]/10' : 'text-gray-400 hover:text-white hover:bg-gray-800/60'}`}>
                  {l.label}
                  {active && <motion.div layoutId="nav-pill" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{background:'#c9a84c'}} />}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Cart */}
            <button onClick={() => setIsOpen(true)} className="relative p-2.5 rounded-xl hover:bg-gray-800/60 text-gray-400 transition-colors">
              <FiShoppingCart size={20} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[#1a0e00] text-[10px] rounded-full flex items-center justify-center font-black px-1 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)' }}>
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(v => !v)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-800/60 transition-colors">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[#1a0e00] font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-gray-300 max-w-[80px] truncate">{user.name?.split(' ')[0]}</span>
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-[#141420] rounded-2xl shadow-xl shadow-black/40 border border-gray-800 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-gray-800">
                          <p className="font-bold text-sm text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          {user.role !== 'admin' && (
                            <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-gray-800 transition-colors font-medium">
                              <FiPackage size={15} /> My Orders
                            </Link>
                          )}
                          {user.role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors font-medium">
                              <FiSettings size={15} /> Admin Panel
                            </Link>
                          )}
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium mt-1">
                            <FiLogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 text-sm font-bold text-[#1a0e00] px-4 py-2.5 rounded-xl transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)', boxShadow: '0 4px 14px rgba(201,168,76,0.35)' }}>
                <FiUser size={14} /> Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setOpen(!open)} className="md:hidden p-2.5 rounded-xl hover:bg-gray-800/60 text-gray-400 transition-colors">
              <AnimatePresence mode="wait">
                <motion.div key={open ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  {open ? <FiX size={20} /> : <FiMenu size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[#1e1e30] bg-[#080810] px-4 py-3 space-y-1">
            {links.map(l => {
              const active = location.pathname === l.to;
              return (
                <Link key={l.to} to={l.to}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${active ? 'bg-[#c9a84c]/10 text-[#c9a84c]' : 'text-gray-300 hover:bg-gray-800/60'}`}>
                  {l.label}
                </Link>
              );
            })}
            {user?.role === 'admin' && (
              <Link to="/admin" className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                ⚙️ Admin Panel
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
