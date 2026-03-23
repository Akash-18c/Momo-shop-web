import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTag, FiCheck, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import api, { cachedGet } from '../services/api';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', street: '', city: '', pincode: '' });
  const [coupon, setCoupon]               = useState('');
  const [discount, setDiscount]           = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [loading, setLoading]             = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCoupons, setShowCoupons]     = useState(false);

  useEffect(() => {
    cachedGet('/coupons/public')
      .then(r => setAvailableCoupons(r.data))
      .catch(() => {});
  }, []);

  const handleApplyCoupon = async (code = coupon) => {
    const c = (code || coupon).trim().toUpperCase();
    if (!c) return;
    try {
      const res = await api.post('/coupons/apply', { code: c, orderAmount: total });
      setDiscount(res.data.discount);
      setCouponApplied(c);
      setCoupon(c);
      setShowCoupons(false);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.message || 'Invalid coupon');
    }
  };

  const removeCoupon = () => { setCouponApplied(''); setDiscount(0); setCoupon(''); };

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.street || !form.city) return toast.error('Please fill all fields');
    if (items.length === 0) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const orderItems = items.map(i => ({ food: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.image }));
      const res = await api.post('/orders', { items: orderItems, address: form, paymentMethod: 'COD', couponCode: couponApplied });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const finalTotal = total - discount;

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-5 sm:mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">

        {/* Left */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {/* Delivery */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">📍 Delivery Details</h2>
            <div className="space-y-3">
              {[
                { key: 'name',    placeholder: 'Full Name',       type: 'text' },
                { key: 'phone',   placeholder: 'Phone Number',    type: 'tel'  },
                { key: 'street',  placeholder: 'Street Address',  type: 'text' },
                { key: 'city',    placeholder: 'City',            type: 'text' },
                { key: 'pincode', placeholder: 'Pincode',         type: 'text' },
              ].map(f => (
                <input key={f.key} type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="input" />
              ))}
            </div>
          </div>

          {/* Coupon */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">🎟️ Apply Coupon</h2>

            {couponApplied ? (
              <div className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <FiCheck size={13} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-400">{couponApplied} applied!</p>
                    <p className="text-xs text-gray-500">You save ₹{discount.toFixed(2)}</p>
                  </div>
                </div>
                <button onClick={removeCoupon} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <FiX size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                  placeholder="Enter coupon code"
                  className="input flex-1 font-mono tracking-wider" />
                <button onClick={() => handleApplyCoupon()}
                  className="btn-primary px-5 py-3 text-sm flex items-center gap-1 flex-shrink-0">
                  <FiTag size={14} /> Apply
                </button>
              </div>
            )}

            {/* Available coupons toggle */}
            {availableCoupons.length > 0 && !couponApplied && (
              <div className="mt-3">
                <button onClick={() => setShowCoupons(v => !v)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-opacity">
                  {showCoupons ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                  {showCoupons ? 'Hide' : 'View'} available coupons ({availableCoupons.length})
                </button>

                <AnimatePresence>
                  {showCoupons && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-2 overflow-hidden">
                      {availableCoupons.map(c => {
                        const eligible = total >= (c.minOrder || 0);
                        return (
                          <div key={c._id}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${eligible ? 'cursor-pointer hover:border-primary/50' : 'opacity-50 cursor-not-allowed'}`}
                            style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.2)' }}
                            onClick={() => eligible && handleApplyCoupon(c.code)}>
                            <div className="flex items-center gap-3">
                              <div className="px-2 py-1 rounded-lg font-black text-xs tracking-widest"
                                style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}>
                                {c.code}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                  {c.discountType === 'percentage' ? `${c.discount}% OFF` : `₹${c.discount} OFF`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {c.minOrder > 0 ? `Min order ₹${c.minOrder}` : 'No minimum order'}
                                  {!eligible && ` · Add ₹${(c.minOrder - total).toFixed(0)} more`}
                                </p>
                              </div>
                            </div>
                            {eligible && (
                              <span className="text-xs font-bold text-primary">Tap to apply</span>
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-3">💳 Payment Method</h2>
            <div className="flex items-center gap-3 p-3 border-2 border-primary rounded-xl bg-primary/5">
              <div className="w-4 h-4 rounded-full bg-primary" />
              <span className="font-medium">Cash on Delivery (COD)</span>
            </div>
          </div>
        </motion.div>

        {/* Right — Order Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">🛒 Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <img src={item.image || 'https://via.placeholder.com/48?text=F'} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span><span>₹{total.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({couponApplied})</span><span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Delivery</span><span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-black text-lg border-t border-gray-100 dark:border-gray-800 pt-2">
                <span>Total</span><span className="text-primary">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleOrder} disabled={loading || items.length === 0}
              className="btn-primary w-full mt-4 text-center disabled:opacity-60">
              {loading ? 'Placing Order...' : '🎉 Place Order'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
