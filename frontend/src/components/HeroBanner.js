import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';

const slideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } },
  exit:  { opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } },
};

export default function HeroBanner({ slides = [], interval = 4000 }) {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const timerRef              = useRef(null);
  const touchStartX           = useRef(null);
  const total                 = slides.length;

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), interval);
  }, [total, interval]);

  useEffect(() => {
    if (!paused) startTimer();
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [paused, startTimer]);

  const goTo = useCallback((idx) => {
    setCurrent((idx + total) % total);
    startTimer();
  }, [total, startTimer]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    touchStartX.current = null;
  };

  if (!slides.length) return null;
  const slide = slides[current];

  return (
    <div
      className="relative overflow-hidden bg-black select-none"
      style={{ height: 'clamp(220px, 52vw, 620px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
          {/* subtle bottom gradient for dots visibility */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

          {/* CTA pill — bottom left, small, non-intrusive */}
          <div className="absolute bottom-10 sm:bottom-14 left-4 sm:left-8 flex items-center gap-2">
            <Link
              to={slide.ctaLink || '/menu'}
              className="inline-flex items-center gap-1.5 font-bold rounded-full text-[#1a0e00] text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 shadow-lg active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)' }}
            >
              {slide.cta || 'Order Now'} <FiArrowRight size={12} />
            </Link>
            {slide.phone && (
              <a
                href={`tel:${slide.phone}`}
                className="inline-flex items-center gap-1.5 font-semibold rounded-full text-white text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all"
              >
                📞 {slide.phone}
              </a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      <button
        onClick={() => goTo(current - 1)}
        aria-label="Previous"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20
                   w-9 h-9 sm:w-11 sm:h-11 rounded-full
                   bg-black/40 backdrop-blur-sm border border-white/20 text-white
                   flex items-center justify-center
                   hover:bg-[#c9a84c] hover:border-[#c9a84c] transition-all duration-200"
      >
        <FiChevronLeft size={18} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => goTo(current + 1)}
        aria-label="Next"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20
                   w-9 h-9 sm:w-11 sm:h-11 rounded-full
                   bg-black/40 backdrop-blur-sm border border-white/20 text-white
                   flex items-center justify-center
                   hover:bg-[#c9a84c] hover:border-[#c9a84c] transition-all duration-200"
      >
        <FiChevronRight size={18} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width:  i === current ? '24px' : '7px',
              height: '7px',
              background: i === current ? '#c9a84c' : 'rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-20">
          <motion.div
            key={`p-${current}`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: interval / 1000, ease: 'linear' }}
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #c9a84c, #f0d060)' }}
          />
        </div>
      )}
    </div>
  );
}
