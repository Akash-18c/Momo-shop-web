import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import api, { cachedGet } from '../services/api';
import FoodCard from '../components/FoodCard';
import { FoodCardSkeleton } from '../components/Skeletons';

const CATEGORIES = ['All', 'Momo', 'Spring Rolls', 'Wings', 'Fries', 'Burger', 'Desserts', 'Beverages'];

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'All';

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      if (vegOnly) params.isVeg = true;
      // Use cachedGet only for unfiltered requests (cache key is just '/foods')
      const hasFilter = category !== 'All' || search || vegOnly;
      const res = hasFilter
        ? await api.get('/foods', { params })
        : await cachedGet('/foods');
      setFoods(res.data);
    } catch { setFoods([]); }
    finally { setLoading(false); }
  }, [category, search, vegOnly]);

  useEffect(() => {
    const t = setTimeout(fetchFoods, 300);
    return () => clearTimeout(t);
  }, [fetchFoods]);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] mb-1" style={{ color: '#c9a84c' }}>Fresh & Delicious</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-1" style={{fontFamily:'Poppins,sans-serif'}}>
          Our <span style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d060)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Menu</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Fresh, delicious food made with love</p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search food..."
            className="input pl-9 pr-8 py-2.5 text-sm" />
          {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"><FiX size={14} /></button>}
        </div>
        <button onClick={() => setVegOnly(v => !v)}
          className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 rounded-xl border-2 font-semibold text-xs sm:text-sm transition-all flex-shrink-0 ${vegOnly ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
          <span className="hidden sm:inline">Veg Only</span>
          <span className="sm:hidden">Veg</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-5 sm:mb-8 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
            className={`flex-shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${category === cat
              ? 'text-[#1a0e00] shadow-lg'
              : 'bg-white dark:bg-[#111120] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#1e1e30]'}`}
            style={category === cat ? { background: 'linear-gradient(135deg,#c9a84c,#f0d060)' } : {}}>
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">{foods.length} items found</p>}

      {/* Grid — 2 cols on mobile, 3 on md, 4 on xl */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        {loading ? Array(8).fill(0).map((_, i) => <FoodCardSkeleton key={i} />) :
          foods.length === 0 ? (
            <div className="col-span-full text-center py-16 sm:py-20 text-gray-400">
              <p className="text-4xl sm:text-5xl mb-3">🍽️</p>
              <p className="font-medium text-base sm:text-lg">No items found</p>
              <p className="text-xs sm:text-sm mt-1">Try a different search or category</p>
            </div>
          ) : foods.map((food, i) => (
            <motion.div key={food._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <FoodCard food={food} />
            </motion.div>
          ))
        }
      </div>
    </div>
  );
}
