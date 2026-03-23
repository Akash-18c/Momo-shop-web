import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { FiShoppingBag, FiDollarSign, FiTrendingUp, FiClock, FiPackage, FiMessageSquare, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useNotifs } from './AdminLayout';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function LiveClock({ t }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dd = time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
      style={{ background: t.card, border: '1px solid rgba(201,168,76,0.22)', boxShadow: '0 0 20px rgba(201,168,76,0.07)' }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
        <FiClock size={14} style={{ color: '#c9a84c' }} />
      </div>
      <div>
        <p className="text-sm font-black tracking-wider leading-none" style={{ color: '#f0d060', fontVariantNumeric: 'tabular-nums' }}>{hh}</p>
        <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(201,168,76,0.6)' }}>{dd}</p>
      </div>
    </div>
  );
}

const statusColors = {
  Placed: '#3b82f6', Confirmed: '#8b5cf6', Preparing: '#f59e0b',
  'Out for Delivery': '#10b981', Delivered: '#22c55e', Cancelled: '#ef4444',
};

function DayHistoryTable({ stats, t }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [dayOrders, setDayOrders]       = useState([]);
  const [loadingDay, setLoadingDay]     = useState(false);
  const [showOrders, setShowOrders]     = useState(false);

  const rows = stats?.dailySales?.slice().reverse() || [];

  const fetchDayOrders = async (dateStr) => {
    setLoadingDay(true);
    setShowOrders(true);
    try {
      const res = await api.get('/orders/admin/all');
      setDayOrders((res.data || []).filter(
        o => new Date(o.createdAt).toISOString().split('T')[0] === dateStr
      ));
    } catch {}
    finally { setLoadingDay(false); }
  };

  const handleRowClick = (dateId) => {
    if (selectedDate === dateId) { setSelectedDate(''); setShowOrders(false); setDayOrders([]); }
    else { setSelectedDate(dateId); fetchDayOrders(dateId); }
  };

  const handleDatePick = (e) => {
    const val = e.target.value;
    if (!val) { setSelectedDate(''); setShowOrders(false); setDayOrders([]); return; }
    setSelectedDate(val);
    fetchDayOrders(val);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="rounded-2xl p-3 sm:p-6"
      style={{ background: t.card, border: `1px solid ${t.border}` }}>

      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div>
          <h2 className="font-black text-base" style={{ color: t.text }}>30-Day Sales History</h2>
          <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>Click any row or pick a date to see that day's orders</p>
        </div>
        <div className="relative flex items-center">
          <FiCalendar size={13} className="absolute left-3 pointer-events-none" style={{ color: t.textMuted }} />
          <input type="date" value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={handleDatePick}
            className="text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none"
            style={{
              background: t.bg, border: `1px solid ${t.border}`, color: t.text,
              colorScheme: t.text === '#ffffff' ? 'dark' : 'light',
            }} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${t.border}` }}>
              {['Date', 'Orders', 'Revenue', 'Avg Order', ''].map((h, i) => (
                <th key={i} className={`py-3 px-4 font-semibold ${i > 0 ? 'text-right' : 'text-left'}`}
                  style={{ color: t.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? rows.map((d, i) => {
              const isSel = selectedDate === d._id;
              return (
                <tr key={i} onClick={() => handleRowClick(d._id)}
                  className="cursor-pointer transition-colors"
                  style={{
                    borderBottom: `1px solid ${t.border}`,
                    background: isSel ? 'rgba(201,168,76,0.07)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = t.navHover; }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}>
                  <td className="py-3 px-4 font-medium" style={{ color: isSel ? '#c9a84c' : t.text }}>
                    {new Date(d._id + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold" style={{ color: t.text }}>{d.orders}</td>
                  <td className="py-3 px-4 text-right font-bold" style={{ color: '#c9a84c' }}>₹{d.revenue.toFixed(0)}</td>
                  <td className="py-3 px-4 text-right" style={{ color: t.textMuted }}>₹{d.avgOrder.toFixed(0)}</td>
                  <td className="py-3 px-4 text-right" style={{ color: t.textMuted }}>
                    {isSel ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan="5" className="py-8 text-center" style={{ color: t.textMuted }}>No sales data available</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showOrders && selectedDate && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl overflow-hidden"
          style={{ background: 'rgba(201,168,76,0.04)', border: `1px solid ${t.border}` }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${t.border}` }}>
            <p className="text-sm font-bold" style={{ color: t.text }}>
              Orders on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <button onClick={() => { setShowOrders(false); setSelectedDate(''); setDayOrders([]); }}
              className="text-xs transition-colors" style={{ color: t.textMuted }}>✕ Close</button>
          </div>

          {loadingDay ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
            </div>
          ) : dayOrders.length === 0 ? (
            <p className="text-center text-sm py-8" style={{ color: t.textMuted }}>No orders on this date</p>
          ) : (
            <div style={{ borderTop: `1px solid ${t.border}` }}>
              {dayOrders.map((o, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between gap-4 flex-wrap"
                  style={{ borderBottom: `1px solid ${t.border}` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black" style={{ color: t.textMuted }}>#{o._id.slice(-6).toUpperCase()}</span>
                    <span className="text-sm font-medium" style={{ color: t.text }}>{o.user?.name || 'Customer'}</span>
                    <span className="text-xs" style={{ color: t.textMuted }}>
                      {new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: o.status === 'Delivered' ? 'rgba(34,197,94,0.15)' : o.status === 'Cancelled' ? 'rgba(239,68,68,0.15)' : 'rgba(201,168,76,0.15)',
                        color:      o.status === 'Delivered' ? '#22c55e'              : o.status === 'Cancelled' ? '#ef4444'              : '#c9a84c',
                      }}>
                      {o.status}
                    </span>
                    <span className="font-black text-sm" style={{ color: '#c9a84c' }}>₹{o.totalAmount.toFixed(0)}</span>
                  </div>
                </div>
              ))}
              <div className="px-4 py-3 flex justify-between text-xs font-bold">
                <span style={{ color: t.textMuted }}>{dayOrders.length} orders total</span>
                <span style={{ color: '#c9a84c' }}>₹{dayOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.totalAmount, 0).toFixed(0)} revenue</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const { orders, messages, t, dark } = useNotifs();

  const fetchStats = useCallback(async () => {
    try { const r = await api.get('/orders/admin/stats'); setStats(r.data); } catch {}
  }, []);

  useEffect(() => { fetchStats().finally(() => setLoading(false)); }, [fetchStats]);

  const gridColor  = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const tickColor  = t.textMuted;
  const tooltipBg  = dark ? '#1a1a2e' : '#ffffff';
  const tooltipTxt = t.text;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: tooltipBg, titleColor: tooltipTxt, bodyColor: tickColor, borderColor: t.border, borderWidth: 1 },
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 10 } } },
      y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 10 } }, beginAtZero: true },
    },
  };

  const lineData = {
    labels: stats?.dailySales?.map(d =>
      new Date(d._id).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    ) || [],
    datasets: [{
      data: stats?.dailySales?.map(d => d.revenue) || [],
      borderColor: '#c9a84c', backgroundColor: 'rgba(201,168,76,0.08)',
      fill: true, tension: 0.4, pointBackgroundColor: '#c9a84c', pointRadius: 3, pointHoverRadius: 5,
    }],
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3"
          style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: t.textMuted }}>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black" style={{ color: t.text, fontFamily: 'Poppins,sans-serif' }}>Dashboard</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: t.textMuted }}>Real-time analytics & insights</p>
        </div>
        <LiveClock t={t} />
      </div>

      {/* Live Activity Banner */}
      {(orders > 0 || messages > 0) && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.22)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-bold text-red-400">Live Activity</span>
          </div>
          {orders > 0 && (
            <Link to="/admin/orders"
              className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl hover:scale-105 transition-transform"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
              <FiPackage size={12} />
              {orders} new order{orders > 1 ? 's' : ''}
            </Link>
          )}
          {messages > 0 && (
            <Link to="/admin/messages"
              className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl hover:scale-105 transition-transform"
              style={{ background: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>
              <FiMessageSquare size={12} />
              {messages} unread message{messages > 1 ? 's' : ''}
            </Link>
          )}
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {[
          { icon: FiShoppingBag, label: 'Total Orders',    value: stats?.totalOrders || 0,                     grad: 'from-blue-600 to-blue-500',     shadow: 'shadow-blue-900/40'   },
          { icon: FiDollarSign,  label: 'Total Revenue',   value: `₹${(stats?.totalRevenue || 0).toFixed(0)}`, grad: 'from-green-600 to-emerald-500', shadow: 'shadow-green-900/40'  },
          { icon: FiTrendingUp,  label: "Today's Revenue", value: `₹${(stats?.todayRevenue || 0).toFixed(0)}`, grad: 'from-yellow-500 to-amber-500',  shadow: 'shadow-yellow-900/40' },
          { icon: FiPackage,     label: "Today's Orders",  value: stats?.todayOrders || 0,                     grad: 'from-purple-600 to-violet-500', shadow: 'shadow-purple-900/40' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-3 sm:p-5 transition-all"
            style={{ background: t.card, border: `1px solid ${t.border}` }}
            onMouseEnter={e => e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${c.grad} flex items-center justify-center text-white shadow-lg ${c.shadow} mb-2 sm:mb-4`}>
              <c.icon size={15} />
            </div>
            <p className="text-base sm:text-2xl font-black mb-0.5 truncate" style={{ color: t.text }}>{c.value}</p>
            <p className="text-[10px] sm:text-xs font-medium leading-tight" style={{ color: t.textMuted }}>{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Status Breakdown */}
      {stats?.statusBreakdown?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-3 sm:p-6"
          style={{ background: t.card, border: `1px solid ${t.border}` }}>
          <h2 className="font-black text-sm sm:text-base mb-3" style={{ color: t.text }}>Order Status Breakdown</h2>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            {stats.statusBreakdown.map((s, i) => (
              <div key={i} className="rounded-xl p-2 sm:p-3"
                style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: `1px solid ${t.border}` }}>
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColors[s._id] || '#6b7280' }} />
                  <p className="text-[9px] sm:text-xs font-medium truncate" style={{ color: t.textMuted }}>{s._id}</p>
                </div>
                <p className="text-base sm:text-xl font-black" style={{ color: t.text }}>{s.count}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl p-3 sm:p-6"
        style={{ background: t.card, border: `1px solid ${t.border}` }}>
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <h2 className="font-black text-sm sm:text-base" style={{ color: t.text }}>Revenue Trend</h2>
            <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>Last 30 days</p>
          </div>
          <div className="w-3 h-3 rounded-full" style={{ background: '#c9a84c' }} />
        </div>
        <div style={{ height: '180px' }}>
          {stats?.dailySales?.length > 0
            ? <Line data={lineData} options={chartOptions} />
            : <div className="flex items-center justify-center h-full text-sm" style={{ color: t.textMuted }}>No data yet</div>}
        </div>
      </motion.div>

      {/* 30-Day History Table */}
      <DayHistoryTable stats={stats} t={t} />

      {/* Top Selling Items */}
      {stats?.popularItems?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: t.card, border: `1px solid ${t.border}` }}>

          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5"
            style={{
              borderBottom: `1px solid ${t.border}`,
              background: dark
                ? 'linear-gradient(135deg,#0f0d00,rgba(26,20,0,0.5),transparent)'
                : 'linear-gradient(135deg,rgba(201,168,76,0.06),transparent)',
            }}>
            <div>
              <h2 className="font-black text-sm sm:text-base" style={{ color: t.text, fontFamily: 'Poppins,sans-serif' }}>Top Selling Items</h2>
              <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>Ranked by units sold</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold px-2 sm:px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>
              <FiTrendingUp size={11} /> {stats.popularItems.length} items
            </div>
          </div>

          <div className="p-3 sm:p-5 space-y-2">
            {stats.popularItems.map((item, i) => {
              const pct = Math.round((item.count / (stats.popularItems[0]?.count || 1)) * 100);
              const RANK_META = [
                { bar: 'linear-gradient(90deg,#f0d060,#c9a84c)', num: 'linear-gradient(135deg,#c9a84c,#f0d060)', numTxt: '#1a0e00', ring: 'rgba(201,168,76,0.35)', glow: '0 0 18px rgba(201,168,76,0.15)', nameTxt: '#f0d060', label: 'BEST SELLER' },
                { bar: 'linear-gradient(90deg,#e2e8f0,#94a3b8)', num: 'linear-gradient(135deg,#94a3b8,#cbd5e1)', numTxt: '#0f172a', ring: 'rgba(148,163,184,0.3)',  glow: '0 0 12px rgba(148,163,184,0.08)', nameTxt: '#cbd5e1', label: '2ND PLACE'  },
                { bar: 'linear-gradient(90deg,#fb923c,#b45214)', num: 'linear-gradient(135deg,#b45214,#fb923c)', numTxt: '#fff',    ring: 'rgba(180,82,20,0.3)',   glow: '0 0 12px rgba(180,82,20,0.08)',   nameTxt: '#fb923c', label: '3RD PLACE'  },
              ];
              const m = RANK_META[i] || {
                bar: 'linear-gradient(90deg,#c9a84c,#f0d060)',
                num: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                numTxt: t.textMuted, ring: t.border, glow: 'none', nameTxt: t.text, label: '',
              };
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 + i * 0.06 }}
                  className="flex items-center gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-2xl border transition-all"
                  style={{
                    background: i < 3
                      ? (dark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)')
                      : (dark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)'),
                    borderColor: i < 3 ? m.ring : t.border,
                    boxShadow: i < 3 ? m.glow : 'none',
                  }}>

                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0"
                    style={{ background: i < 3 ? m.num : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                      color: i < 3 ? m.numTxt : t.textMuted,
                      border: `1.5px solid ${m.ring}`, boxShadow: i < 3 ? `0 2px 8px ${m.ring}` : 'none' }}>
                    {i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <p className="text-xs sm:text-sm font-bold truncate" style={{ color: i < 3 ? m.nameTxt : t.text }}>{item._id}</p>
                      {i < 3 && (
                        <span className="hidden sm:inline text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-widest flex-shrink-0"
                          style={{ background: m.ring, color: m.nameTxt }}>
                          {m.label}
                        </span>
                      )}
                    </div>
                    <div className="h-1 sm:h-1.5 rounded-full overflow-hidden"
                      style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' }}>
                      <motion.div className="h-full rounded-full"
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.8 + i * 0.06, duration: 0.7, ease: 'easeOut' }}
                        style={{ background: m.bar }} />
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm sm:text-base font-black" style={{ color: i < 3 ? m.nameTxt : '#c9a84c' }}>{item.count}</p>
                    <p className="text-[10px]" style={{ color: t.textMuted }}>sold</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mx-3 sm:mx-5 mb-3 sm:mb-5 p-3 rounded-xl flex items-center justify-between"
            style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <span className="text-xs" style={{ color: t.textMuted }}>Total units sold</span>
            <span className="text-sm font-black" style={{ color: '#c9a84c' }}>
              {stats.popularItems.reduce((s, x) => s + x.count, 0)} items
            </span>
          </div>
        </motion.div>
      )}

    </div>
  );
}
