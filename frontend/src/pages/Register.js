import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const fields = [
  { key: 'name',     label: 'Full Name',     type: 'text',     placeholder: 'John Doe',          icon: FiUser  },
  { key: 'email',    label: 'Email Address', type: 'email',    placeholder: 'you@example.com',   icon: FiMail  },
  { key: 'phone',    label: 'Phone Number',  type: 'tel',      placeholder: '7365850429',        icon: FiPhone, optional: true },
  { key: 'password', label: 'Password',      type: 'password', placeholder: '••••••••',          icon: FiLock  },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to MDB 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#f8f5f0] dark:bg-[#080810] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(201,168,76,0.07)' }} />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(201,168,76,0.04)' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} className="w-full max-w-md relative">

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#1a0e00] font-black text-lg mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)', boxShadow: '0 8px 24px rgba(201,168,76,0.4)' }}>
            MDB
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins,sans-serif' }}>Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Join MDB RESTROCAFE today</p>
        </div>

        <div className="bg-white dark:bg-[#111120] rounded-3xl border border-gray-100 dark:border-[#1e1e30] p-8 shadow-xl shadow-black/5 dark:shadow-black/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  {f.label} {f.optional && <span className="text-gray-400 font-normal normal-case">(optional)</span>}
                </label>
                <div className="relative">
                  <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input type={f.type} value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="input pl-11 text-sm" required={!f.optional} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-2 py-3.5 rounded-2xl font-bold text-sm text-[#1a0e00] transition-all active:scale-95 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)' }}>
              {loading
                ? <><div className="w-4 h-4 border-2 border-[#1a0e00]/30 border-t-[#1a0e00] rounded-full animate-spin" /> Creating...</>
                : <>Create Account <FiArrowRight size={15} /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-[#1e1e30] text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold transition-colors" style={{ color: '#c9a84c' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
