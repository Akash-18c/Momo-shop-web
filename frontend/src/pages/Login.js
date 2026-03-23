import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#f8f5f0] dark:bg-[#080810] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(201,168,76,0.07)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(201,168,76,0.04)' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} className="w-full max-w-md relative">

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#1a0e00] font-black text-lg mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)', boxShadow: '0 8px 24px rgba(201,168,76,0.4)' }}>
            MDB
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins,sans-serif' }}>Welcome Back!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Sign in to your MDB account</p>
        </div>

        <div className="bg-white dark:bg-[#111120] rounded-3xl border border-gray-100 dark:border-[#1e1e30] p-8 shadow-xl shadow-black/5 dark:shadow-black/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com" className="input pl-11 text-sm" required />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••" className="input pl-11 text-sm" required />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-2 py-3.5 rounded-2xl font-bold text-sm text-[#1a0e00] transition-all active:scale-95 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)' }}>
              {loading
                ? <><div className="w-4 h-4 border-2 border-[#1a0e00]/30 border-t-[#1a0e00] rounded-full animate-spin" /> Signing in...</>
                : <>Sign In <FiArrowRight size={15} /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-[#1e1e30] text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold transition-colors" style={{ color: '#c9a84c' }}>Create Account</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">By signing in, you agree to our Terms & Privacy Policy</p>
      </motion.div>
    </div>
  );
}
