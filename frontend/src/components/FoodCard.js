import { motion } from 'framer-motion';
import { FiPlus, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function FoodCard({ food }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(food);
    toast.success(`${food.name} added!`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="rounded-xl sm:rounded-2xl overflow-hidden group transition-all duration-300 h-full flex flex-col"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(201,168,76,0.35)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5)'; }}
      onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '70%' }}>
        <img
          src={food.image || `https://via.placeholder.com/300x200/1a1a2e/ffffff?text=${encodeURIComponent(food.name)}`}
          alt={food.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg/Non-veg badge */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5">
          <span className={`inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg backdrop-blur-sm border ${food.isVeg ? 'bg-green-500/90 text-white border-green-400/50' : 'bg-red-500/90 text-white border-red-400/50'}`}>
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white" />
            <span className="hidden sm:inline">{food.isVeg ? 'VEG' : 'NON-VEG'}</span>
            <span className="sm:hidden">{food.isVeg ? 'V' : 'NV'}</span>
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 flex items-center gap-0.5 sm:gap-1 bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
          <FiStar size={8} className="fill-yellow-400 text-yellow-400 sm:hidden" />
          <FiStar size={10} className="fill-yellow-400 text-yellow-400 hidden sm:block" />
          {food.rating?.toFixed(1) || '4.0'}
        </div>

        {/* Out of stock */}
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-black/65 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white font-black text-xs sm:text-sm bg-red-600 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <span className="text-[9px] sm:text-[10px] font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg uppercase tracking-wider self-start">{food.category}</span>
        <h3 className="font-black mt-1 sm:mt-2 text-gray-900 dark:text-white truncate text-[13px] sm:text-[15px]">{food.name}</h3>
        {food.description && (
          <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-2 leading-relaxed hidden sm:block">{food.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3.5">
          <span className="text-base sm:text-xl font-black text-gray-900 dark:text-white">₹{food.price}</span>
          <button
            onClick={handleAdd}
            disabled={!food.isAvailable}
            className="flex items-center gap-1 sm:gap-1.5 text-[#1a0e00] px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)', boxShadow: '0 4px 12px rgba(201,168,76,0.3)' }}>
            <FiPlus size={12} className="sm:hidden" />
            <FiPlus size={14} className="hidden sm:block" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
