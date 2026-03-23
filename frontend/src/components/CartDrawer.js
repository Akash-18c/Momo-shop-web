import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, removeItem, updateQty, total, count, isOpen, setIsOpen } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => { setIsOpen(false); navigate('/checkout'); };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full xs:max-w-sm sm:max-w-sm bg-white dark:bg-gray-900 z-50 flex flex-col shadow-2xl"
            style={{ maxWidth: 'min(100vw, 400px)' }}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <FiShoppingBag className="text-primary" size={20} />
                <h2 className="font-bold text-lg">Your Cart</h2>
                {count > 0 && <span className="badge bg-primary/10 text-primary">{count} items</span>}
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><FiX size={20} /></button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
                <FiShoppingBag size={64} className="opacity-20" />
                <p className="font-medium">Your cart is empty</p>
                <button onClick={() => { setIsOpen(false); navigate('/menu'); }} className="btn-primary text-sm">Browse Menu</button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.map(item => (
                    <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <img src={item.image || 'https://via.placeholder.com/60x60?text=Food'} alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.name}</p>
                        <p className="text-primary font-bold text-sm">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item._id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                          <FiMinus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQty(item._id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-600 transition-colors">
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 size={14} /></button>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} className="btn-primary w-full text-center">
                    Proceed to Checkout → ₹{total.toFixed(2)}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
