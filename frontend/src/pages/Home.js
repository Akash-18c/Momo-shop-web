import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiTruck, FiStar, FiPhone, FiZoomIn, FiClock, FiShield, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api, { cachedGet } from '../services/api';
import FoodCard from '../components/FoodCard';
import { FoodCardSkeleton } from '../components/Skeletons';

/* ─── constants ─────────────────────────────────────────────── */
const CATEGORIES = [
  { name: 'Momo',         emoji: '🥟', bg: 'from-amber-500  to-orange-600'  },
  { name: 'Spring Rolls', emoji: '🌯', bg: 'from-emerald-500 to-green-600'  },
  { name: 'Wings',        emoji: '🍗', bg: 'from-yellow-500  to-amber-600'  },
  { name: 'Fries',        emoji: '🍟', bg: 'from-amber-400   to-yellow-500' },
  { name: 'Burger',       emoji: '🍔', bg: 'from-orange-500  to-red-600'    },
  { name: 'Desserts',     emoji: '🍰', bg: 'from-pink-500    to-rose-600'   },
  { name: 'Beverages',    emoji: '🥤', bg: 'from-blue-500    to-cyan-600'   },
];

const FEATURES = [
  { icon: FiTruck,  title: 'Free Delivery',    desc: 'On all orders above ₹299',      glow: 'rgba(201,168,76,0.25)'  },
  { icon: FiClock,  title: '30 Min Delivery',  desc: 'Lightning fast to your door',   glow: 'rgba(99,202,183,0.2)'   },
  { icon: FiStar,   title: '4.8 ★ Rated',      desc: '2000+ happy customers',         glow: 'rgba(250,204,21,0.2)'   },
  { icon: FiShield, title: '100% Fresh',        desc: 'Premium quality ingredients',   glow: 'rgba(167,139,250,0.2)'  },
];

const HERO_EMOJIS = ['🥟', '🍔', '🍗', '🍟'];

/* ─── animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

/* ─── helpers ────────────────────────────────────────────────── */
const GoldText = ({ children }) => (
  <span style={{
    background: 'linear-gradient(90deg,#c9a84c,#f0d060,#c9a84c)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'goldShimmer 4s linear infinite',
  }}>{children}</span>
);

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3"
    style={{ color: '#c9a84c' }}>{children}</p>
);

const GoldBar = () => (
  <div className="w-14 h-[3px] rounded-full mx-auto mt-3"
    style={{ background: 'linear-gradient(90deg,#c9a84c,#f0d060)' }} />
);

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [featured,   setFeatured]  = useState([]);
  const [gallery,    setGallery]   = useState([]);
  const [loadFood,   setLoadFood]  = useState(true);
  const [loadGal,    setLoadGal]   = useState(true);
  const [lightbox,   setLightbox]  = useState(null); // index of open image

  useEffect(() => {
    cachedGet('/foods/featured')
      .then(r => setFeatured(r.data))
      .catch(() => {})
      .finally(() => setLoadFood(false));

    cachedGet('/gallery')
      .then(r => setGallery(r.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoadGal(false));
  }, []);

  return (
    <div style={{ background: '#0B0F1A', color: '#e2e8f0' }} className="min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0a0500 0%,#0B0F1A 40%,#0d0a1a 100%)' }}>

        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle,#c9a84c 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* ambient orbs */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(201,168,76,0.12) 0%,transparent 60%)' }} />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 60%)' }} />

        {/* gold top accent line */}
        <div className="absolute top-0 inset-x-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg,transparent,#c9a84c 35%,#f0d060 50%,#c9a84c 65%,transparent)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — text */}
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6"
                  style={{ color: '#f0d060', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}>
                  🏠 Home Delivery Available
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp}
                className="text-4xl sm:text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-4 sm:mb-6"
                style={{ fontFamily: 'Poppins,sans-serif', color: '#fff' }}>
                Taste Like<br />
                <GoldText>Never Before</GoldText>
              </motion.h1>

              <motion.p variants={fadeUp}
                className="text-sm sm:text-base sm:text-lg leading-relaxed mb-7 sm:mb-10 max-w-lg"
                style={{ color: 'rgba(255,255,255,0.5)' }}>
                Fresh momos, crispy wings, juicy burgers &amp; more — crafted with love
                and delivered piping hot to your door in 30 minutes.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                {/* primary CTA */}
                <Link to="/menu"
                  className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-[#1a0e00] text-sm transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg,#c9a84c,#f0d060)',
                    boxShadow: '0 0 0 0 rgba(201,168,76,0.5), 0 8px 28px rgba(201,168,76,0.4)',
                    animation: 'btnPulse 2.5s ease-in-out infinite',
                  }}>
                  Order Now <FiArrowRight size={15} />
                </Link>

                {/* secondary CTA */}
                <a href="tel:7365850429"
                  className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-2xl text-white text-sm transition-all active:scale-95 hover:border-[#c9a84c]/60"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <FiPhone size={14} /> 7365850429
                </a>
              </motion.div>

              {/* mini stats */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-6 mt-10">
                {[['2000+','Happy Customers'],['30 Min','Avg Delivery'],['4.8★','Rating']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <p className="text-2xl font-black" style={{ color: '#f0d060' }}>{val}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{lbl}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — floating emoji cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {HERO_EMOJIS.map((emoji, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
                  className="aspect-square rounded-3xl flex flex-col items-center justify-center gap-3 text-5xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    backdropFilter: 'blur(12px)',
                    animation: `float ${3.2 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.6}s`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}>
                  {emoji}
                  <span className="text-xs font-bold" style={{ color: 'rgba(201,168,76,0.7)' }}>
                    {CATEGORIES[i].name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* smooth wave into next section */}
        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[60px] block"
            style={{ fill: '#0B0F1A' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. FEATURE CARDS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20" style={{ background: '#0B0F1A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={i} variants={fadeUp}
                className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-300 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                }}
                whileHover={{ y: -6, boxShadow: `0 20px 40px ${f.glow}` }}>
                {/* glow bg on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 30% 30%,${f.glow},transparent 70%)` }} />

                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)' }}>
                    <f.icon size={20} style={{ color: '#c9a84c' }} />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">{f.title}</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. CATEGORIES
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20" style={{ background: '#0d1120' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-10">
            <SectionLabel>What's on the menu?</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Poppins,sans-serif' }}>
              Browse <GoldText>Categories</GoldText>
            </h2>
            <GoldBar />
          </motion.div>

          {/* horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-3 overflow-x-auto pb-3 lg:grid lg:grid-cols-7 lg:overflow-visible scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.name} variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="flex-shrink-0 w-[100px] lg:w-auto">
                <Link to={`/menu?category=${cat.name}`}
                  className="group flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-2xl transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = '1px solid rgba(201,168,76,0.45)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.15)';
                    e.currentTarget.style.background = 'rgba(201,168,76,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}>
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${cat.bg} flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {cat.emoji}
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight"
                    style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. FEATURED / POPULAR ITEMS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24" style={{ background: '#0B0F1A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex items-end justify-between mb-10">
            <div>
              <SectionLabel>Hand-picked for you</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Poppins,sans-serif' }}>
                ⭐ Popular <GoldText>Items</GoldText>
              </h2>
            </div>
            <Link to="/menu"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold group transition-colors"
              style={{ color: '#c9a84c' }}>
              View All <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {loadFood
              ? Array(4).fill(0).map((_, i) => <FoodCardSkeleton key={i} />)
              : featured.map((food, i) => (
                <motion.div key={food._id} variants={fadeUp} initial="hidden" whileInView="show"
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <FoodCard food={food} />
                </motion.div>
              ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link to="/menu"
              className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-2xl text-[#1a0e00] text-sm"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d060)' }}>
              View Full Menu <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. GALLERY PREVIEW
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24" style={{ background: '#0d1120' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-10">
            <SectionLabel>Visual feast</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Poppins,sans-serif' }}>
              Our <GoldText>Gallery</GoldText>
            </h2>
            <GoldBar />
            <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Tap any photo to view full size</p>
          </motion.div>

          {loadGal ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl animate-pulse"
                  style={{ background: 'rgba(255,255,255,0.06)' }} />
              ))}
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <p className="text-5xl mb-3">📸</p>
              <p className="font-medium">No gallery images yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {gallery.map((img, i) => (
                <motion.button
                  key={img._id}
                  variants={fadeUp} initial="hidden" whileInView="show"
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  onClick={() => setLightbox(i)}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer focus:outline-none"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <img
                    src={img.imageUrl} alt={img.caption || 'Gallery'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* dark overlay + zoom icon on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(201,168,76,0.95)', boxShadow: '0 0 16px rgba(201,168,76,0.6)' }}>
                      <FiZoomIn size={15} color="#1a0e00" />
                    </div>
                  </div>
                  {/* gold border glow on hover */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 0 2px rgba(201,168,76,0.6)' }} />
                </motion.button>
              ))}
            </div>
          )}

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mt-8">
            <Link to="/gallery"
              className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-2xl text-sm transition-all active:scale-95"
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.35)',
                color: '#f0d060',
              }}>
              View Full Gallery <FiArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox !== null && gallery[lightbox] && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
            onClick={() => setLightbox(null)}
          >
            {/* close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <FiX size={18} color="#fff" />
            </button>

            {/* prev */}
            {gallery.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + gallery.length) % gallery.length); }}
                className="absolute left-3 sm:left-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)' }}
              >
                <FiChevronLeft size={20} color="#f0d060" />
              </button>
            )}

            {/* next */}
            {gallery.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % gallery.length); }}
                className="absolute right-3 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)' }}
              >
                <FiChevronRight size={20} color="#f0d060" />
              </button>
            )}

            {/* image card */}
            <motion.div
              key={lightbox}
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{    scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              onClick={e => e.stopPropagation()}
              className="relative flex flex-col rounded-2xl overflow-hidden"
              style={{
                maxWidth: 'min(90vw, 780px)',
                maxHeight: '88vh',
                boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.2)',
              }}
            >
              <img
                src={gallery[lightbox].imageUrl}
                alt={gallery[lightbox].caption || 'Gallery'}
                className="block w-full h-full object-contain"
                style={{ maxHeight: gallery[lightbox].caption ? 'calc(88vh - 56px)' : '88vh' }}
              />

              {/* caption + counter bar */}
              <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                style={{ background: 'rgba(11,15,26,0.95)', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
                <p className="text-sm font-semibold text-white truncate pr-4">
                  {gallery[lightbox].caption || 'MDB RESTROCAFE'}
                </p>
                <span className="text-xs font-bold flex-shrink-0 px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(201,168,76,0.15)', color: '#f0d060' }}>
                  {lightbox + 1} / {gallery.length}
                </span>
              </div>
            </motion.div>

            {/* dot indicators */}
            {gallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setLightbox(i); }}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width:  i === lightbox ? '20px' : '6px',
                      height: '6px',
                      background: i === lightbox ? '#f0d060' : 'rgba(255,255,255,0.3)',
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          6. CTA BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0a0500 0%,#1c0f00 50%,#0a0500 100%)' }}>

        {/* dot texture */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle,#c9a84c 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* glow orbs */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(201,168,76,0.18) 0%,transparent 70%)' }} />

        {/* gold lines */}
        <div className="absolute top-0 inset-x-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg,transparent,#c9a84c 35%,#f0d060 50%,#c9a84c 65%,transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg,transparent,#c9a84c 35%,#f0d060 50%,#c9a84c 65%,transparent)' }} />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.p variants={fadeUp}
              className="text-[11px] font-bold uppercase tracking-[0.25em] mb-4"
              style={{ color: '#c9a84c' }}>
              Don't wait — order now
            </motion.p>

            <motion.h2 variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5"
              style={{ fontFamily: 'Poppins,sans-serif' }}>
              Order Your Favourite<br />
              <GoldText>Momo Now 🥟</GoldText>
            </motion.h2>

            <motion.p variants={fadeUp}
              className="text-base leading-relaxed mb-10 max-w-lg mx-auto"
              style={{ color: 'rgba(255,255,255,0.45)' }}>
              Hot, fresh, and delivered in 30 minutes. Use code{' '}
              <span className="font-bold" style={{ color: '#f0d060' }}>FIRST50</span>{' '}
              for 50% off your first order!
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center">
              <Link to="/menu"
                className="inline-flex items-center gap-2 font-bold px-9 py-4 rounded-2xl text-[#1a0e00] text-sm transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg,#c9a84c,#f0d060)',
                  boxShadow: '0 0 0 0 rgba(201,168,76,0.5), 0 10px 32px rgba(201,168,76,0.45)',
                  animation: 'btnPulse 2.5s ease-in-out infinite',
                }}>
                Order Now <FiArrowRight size={15} />
              </Link>
              <a href="tel:7365850429"
                className="inline-flex items-center gap-2 font-bold px-9 py-4 rounded-2xl text-sm transition-all active:scale-95"
                style={{
                  border: '2px solid rgba(201,168,76,0.45)',
                  color: '#f0d060',
                  background: 'rgba(201,168,76,0.07)',
                }}>
                <FiPhone size={14} /> Call Us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
