import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZoomIn, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api, { cachedGet } from '../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function Gallery() {
  const [images,   setImages]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [lightbox, setLightbox] = useState(null); // numeric index

  useEffect(() => {
    cachedGet('/gallery')
      .then(r => setImages(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const prev = (e) => { e.stopPropagation(); setLightbox(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setLightbox(i => (i + 1) % images.length); };

  // keyboard nav
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % images.length);
      if (e.key === 'Escape')     setLightbox(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, images.length]);

  return (
    <div style={{ background: '#0B0F1A', minHeight: '100vh', color: '#e2e8f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="text-center mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3"
            style={{ color: '#c9a84c' }}>Visual Feast</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2"
            style={{ fontFamily: 'Poppins,sans-serif' }}>
            Our{' '}
            <span style={{
              background: 'linear-gradient(90deg,#c9a84c,#f0d060,#c9a84c)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Gallery</span>
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            A visual feast from MDB RESTROCAFE · Tap any photo to view full size
          </p>
          <div className="w-14 h-[3px] rounded-full mx-auto mt-4"
            style={{ background: 'linear-gradient(90deg,#c9a84c,#f0d060)' }} />
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl animate-pulse"
                style={{ background: 'rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-24" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <p className="text-6xl mb-4">📸</p>
            <p className="font-semibold text-lg">No images yet</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {images.map((img, i) => (
              <motion.button
                key={img._id}
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ delay: Math.min(i * 0.04, 0.4) }}
                onClick={() => setLightbox(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                className="relative aspect-square rounded-xl overflow-hidden group focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <img
                  src={img.imageUrl} alt={img.caption || 'Gallery'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                  style={{ background: 'rgba(0,0,0,0.52)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.95)', boxShadow: '0 0 14px rgba(201,168,76,0.55)' }}>
                    <FiZoomIn size={14} color="#1a0e00" />
                  </div>
                </div>
                {/* gold border glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 0 2px rgba(201,168,76,0.55)' }} />
              </motion.button>
            ))}
          </div>
        )}

        {/* count */}
        {!loading && images.length > 0 && (
          <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {images.length} photo{images.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && images[lightbox] && (
          <motion.div
            key="lb-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-10"
            style={{ background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(14px)' }}
            onClick={() => setLightbox(null)}
          >
            {/* close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <FiX size={16} color="#fff" />
            </button>

            {/* prev */}
            {images.length > 1 && (
              <button onClick={prev}
                className="absolute left-3 sm:left-5 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(201,168,76,0.14)', border: '1px solid rgba(201,168,76,0.35)' }}>
                <FiChevronLeft size={20} color="#f0d060" />
              </button>
            )}

            {/* next */}
            {images.length > 1 && (
              <button onClick={next}
                className="absolute right-3 sm:right-5 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(201,168,76,0.14)', border: '1px solid rgba(201,168,76,0.35)' }}>
                <FiChevronRight size={20} color="#f0d060" />
              </button>
            )}

            {/* image card */}
            <motion.div
              key={lightbox}
              initial={{ scale: 0.87, opacity: 0, y: 18 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{    scale: 0.87, opacity: 0, y: 18 }}
              transition={{ type: 'spring', stiffness: 290, damping: 26 }}
              onClick={e => e.stopPropagation()}
              className="relative flex flex-col rounded-2xl overflow-hidden"
              style={{
                maxWidth: 'min(88vw, 820px)',
                maxHeight: '86vh',
                boxShadow: '0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(201,168,76,0.22)',
              }}
            >
              <img
                src={images[lightbox].imageUrl}
                alt={images[lightbox].caption || 'Gallery'}
                className="block w-full object-contain"
                style={{ maxHeight: images[lightbox].caption ? 'calc(86vh - 52px)' : '86vh' }}
              />

              {/* caption + counter */}
              <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                style={{ background: 'rgba(11,15,26,0.97)', borderTop: '1px solid rgba(201,168,76,0.14)' }}>
                <p className="text-sm font-semibold text-white truncate pr-4">
                  {images[lightbox].caption || 'MDB RESTROCAFE'}
                </p>
                <span className="text-xs font-bold flex-shrink-0 px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(201,168,76,0.14)', color: '#f0d060' }}>
                  {lightbox + 1} / {images.length}
                </span>
              </div>
            </motion.div>

            {/* dot indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 flex-wrap justify-center max-w-xs">
                {images.map((_, i) => (
                  <button key={i}
                    onClick={e => { e.stopPropagation(); setLightbox(i); }}
                    className="rounded-full transition-all duration-200 flex-shrink-0"
                    style={{
                      width:  i === lightbox ? '18px' : '6px',
                      height: '6px',
                      background: i === lightbox ? '#f0d060' : 'rgba(255,255,255,0.28)',
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
