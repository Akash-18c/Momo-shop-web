import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPhone, FiMail, FiMapPin, FiSend, FiClock,
  FiUser, FiMessageSquare, FiInstagram, FiFacebook,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const INFO = [
  {
    icon: FiPhone, label: 'Call Us',
    value: '+91 7365850429', sub: 'Mon–Sun, 10 AM – 10 PM',
    href: 'tel:7365850429',
    gradient: 'linear-gradient(135deg, #c9a84c, #f0d060)',
    iconColor: '#1a0e00',
  },
  {
    icon: FiMail, label: 'Email Us',
    value: 'mdbrestrocafe@gmail.com', sub: 'Reply within 24 hours',
    href: 'mailto:mdbrestrocafe@gmail.com',
    gradient: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(240,208,96,0.28))',
    iconColor: '#c9a84c',
  },
  {
    icon: FiMapPin, label: 'Location',
    value: 'Egra, West Bengal', sub: 'MDB RESTROCAFE · Dine-in & Takeaway',
    href: 'https://maps.app.goo.gl/4Zi4GmqbJtVG3xEm8',
    gradient: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(240,208,96,0.28))',
    iconColor: '#c9a84c',
  },
  {
    icon: FiClock, label: 'Open Hours',
    value: '10 AM – 10 PM', sub: 'Monday to Sunday',
    href: null,
    gradient: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(240,208,96,0.28))',
    iconColor: '#c9a84c',
  },
];

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/messages', form);
      toast.success('Message sent! We\'ll get back to you soon 🙏');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch { toast.error('Failed to send message'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#0B0F1A', color: '#e2e8f0' }} className="min-h-screen">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24"
        style={{ background: 'linear-gradient(160deg, #0a0500 0%, #1c0f00 35%, #0f0800 65%, #1a1200 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.09]"
          style={{ backgroundImage: 'radial-gradient(circle, #c9a84c 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute -top-32 -right-32 w-72 h-72 sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.11) 0%, transparent 65%)' }} />
        <div className="absolute top-0 inset-x-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #c9a84c 35%, #f0d060 50%, #c9a84c 65%, transparent 100%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-5"
              style={{ color: '#f0d060', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.28)' }}>
              📬 Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-none"
              style={{ fontFamily: 'Poppins, sans-serif' }}>
              Contact{' '}
              <span style={{
                background: 'linear-gradient(90deg, #c9a84c, #f0d060, #c9a84c)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Us</span>
            </h1>
            <p className="text-white/50 text-sm sm:text-base max-w-sm sm:max-w-md mx-auto leading-relaxed">
              Questions, feedback or bulk orders?<br className="hidden sm:block" /> We'd love to hear from you.
            </p>
          </motion.div>
        </div>

        {/* SVG wave — same color as page bg, zero white line */}
        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-12 block"
            style={{ fill: '#0B0F1A' }}>
            <path d="M0,24 C480,48 960,0 1440,24 L1440,48 L0,48 Z" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Info Cards ── */}
        <section className="py-8 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {INFO.map((item, i) => {
              const inner = (
                <>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                    style={{ background: item.gradient }}>
                    <item.icon size={16} style={{ color: item.iconColor }} />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#c9a84c' }}>{item.label}</p>
                  <p className="font-bold text-white text-[10px] sm:text-sm leading-snug break-all w-full">{item.value}</p>
                  <p className="text-[9px] sm:text-[11px] text-gray-400 mt-0.5 leading-tight">{item.sub}</p>
                </>
              );
              const cls = 'group flex flex-col items-center text-center p-3 sm:p-5 lg:p-6 rounded-2xl border hover:border-[#c9a84c]/50 hover:shadow-[0_8px_28px_rgba(201,168,76,0.12)] transition-all duration-300 h-full bg-[#111827] border-[#1e2535]';
              return (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show"
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  {item.href
                    ? <a href={item.href} target={item.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={cls}>{inner}</a>
                    : <div className={cls}>{inner}</div>}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Form + Sidebar ── */}
        <section className="pb-12 sm:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-8">

            {/* Form — 3 cols */}
            <motion.div className="lg:col-span-3" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#1e2535] shadow-[0_2px_32px_rgba(0,0,0,0.4)]">

                {/* form header */}
                <div className="px-5 sm:px-7 py-5 sm:py-6 flex items-center gap-3"
                  style={{ background: 'linear-gradient(160deg, #0a0500, #1c0f00)' }}>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.3)' }}>
                    <FiMessageSquare size={15} style={{ color: '#f0d060' }} />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: '#c9a84c' }}>Send a Message</p>
                    <h2 className="text-base sm:text-lg font-black text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>We'd Love to Hear From You</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4" style={{ background: '#111827' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Your Name *</label>
                      <div className="relative">
                        <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <input value={form.name} onChange={set('name')} placeholder="John Doe" required className="input pl-9 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email *</label>
                      <div className="relative">
                        <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required className="input pl-9 text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Phone</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <input value={form.phone} onChange={set('phone')} placeholder="7365850429" className="input pl-9 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Subject</label>
                      <input value={form.subject} onChange={set('subject')} placeholder="Order enquiry..." className="input text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Message *</label>
                    <textarea value={form.message} onChange={set('message')} rows={5} required
                      placeholder="Tell us how we can help you..." className="input resize-none text-sm" />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)', color: '#1a0e00' }}>
                    {loading
                      ? <><div className="w-4 h-4 border-2 border-[#1a0e00]/30 border-t-[#1a0e00] rounded-full animate-spin" /> Sending...</>
                      : <><FiSend size={14} /> Send Message</>}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Sidebar — 2 cols */}
            <motion.div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5"
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }}>

              {/* Map */}
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#1e2535] shadow-[0_2px_32px_rgba(0,0,0,0.4)]">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-[#1e2535] flex items-center justify-between" style={{ background: '#111827' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(201,168,76,0.15)' }}>
                      <FiMapPin size={13} style={{ color: '#c9a84c' }} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Our Location</p>
                      <p className="text-[10px] text-gray-400">Egra, West Bengal</p>
                    </div>
                  </div>
                  <a href="https://maps.app.goo.gl/4Zi4GmqbJtVG3xEm8" target="_blank" rel="noreferrer"
                    className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap"
                    style={{ background: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)' }}>
                    Directions ↗
                  </a>
                </div>
                <div className="h-44 sm:h-52">
                  <iframe
                    title="MDB RESTROCAFE"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.4!2d87.5271!3d21.9042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1c4b8e2f1d3a5b%3A0x7e2f4c8d1a3b5e6f!2sMDB%20RESTROCAFE!5e1!3m2!1sen!2sin!4v1700000000000"
                    width="100%" height="100%"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Quick Contact */}
              <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#1e2535] shadow-[0_2px_32px_rgba(0,0,0,0.4)]" style={{ background: '#111827' }}>
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-3 sm:mb-4" style={{ color: '#c9a84c' }}>Quick Contact</p>

                <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
                  <a href="tel:7365850429"
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#1a2035] transition-colors group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)' }}>
                      <FiPhone size={14} className="text-[#1a0e00]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium">Call Now</p>
                      <p className="font-bold text-white text-sm group-hover:text-[#c9a84c] transition-colors truncate">+91 7365850429</p>
                    </div>
                  </a>

                  <a href="mailto:mdbrestrocafe@gmail.com"
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#1a2035] transition-colors group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.25)' }}>
                      <FiMail size={14} style={{ color: '#c9a84c' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium">Email Us</p>
                      <p className="font-bold text-white text-xs sm:text-sm group-hover:text-[#c9a84c] transition-colors truncate">mdbrestrocafe@gmail.com</p>
                    </div>
                  </a>
                </div>

                <div className="border-t border-[#1e2535] pt-3 sm:pt-4">
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2.5 sm:mb-3">Follow Us</p>
                  <div className="flex gap-2">
                    {[{ Icon: FiInstagram, label: 'Instagram', href: 'https://www.instagram.com/mdb.restrocafe/' }, { Icon: FiFacebook, label: 'Facebook', href: 'https://www.facebook.com/people/MDB-Restrocafe/61586971568553/' }].map(({ Icon, label, href }) => (
                      <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                        className="flex items-center justify-center gap-1.5 flex-1 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all text-gray-400 hover:text-[#c9a84c] bg-[#1a2035] hover:bg-[#c9a84c]/10 border border-[#1e2535] hover:border-[#c9a84c]/25">
                        <Icon size={13} /> {label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
