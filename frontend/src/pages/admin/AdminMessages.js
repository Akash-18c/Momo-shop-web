import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiTrash2, FiCheck, FiClock, FiMessageSquare, FiInbox, FiChevronRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useNotifs } from './AdminLayout';

export default function AdminMessages() {
  const { t, dark, clearMessages } = useNotifs();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchMessages = () =>
    api.get('/messages').then(r => setMessages(r.data)).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchMessages(); clearMessages(); }, []); // eslint-disable-line

  const markRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
      if (selected?._id === id) setSelected(s => ({ ...s, isRead: true }));
    } catch {}
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success('Message deleted');
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) { toast.error(err.message || 'Failed'); }
  };

  const unread = messages.filter(m => !m.isRead).length;

  const avatarGrad = (name) => {
    const g = [
      ['#c9a84c','#f0d060'], ['#6366f1','#8b5cf6'], ['#10b981','#34d399'],
      ['#ef4444','#f87171'], ['#3b82f6','#60a5fa'], ['#f59e0b','#fbbf24'],
    ];
    return g[name.charCodeAt(0) % g.length];
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: t.text, fontFamily: 'Poppins,sans-serif' }}>Messages</h1>
          <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>
            {unread > 0 ? <span style={{ color: '#c9a84c' }}>{unread} unread</span> : 'All caught up'} · {messages.length} total
          </p>
        </div>
        {unread > 0 && (
          <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(201,168,76,0.12)', color: '#f0d060', border: '1px solid rgba(201,168,76,0.3)', boxShadow: '0 0 16px rgba(201,168,76,0.1)' }}>
            <div className="w-2 h-2 rounded-full bg-[#f0d060] animate-pulse" />
            {unread} new message{unread > 1 ? 's' : ''}
          </motion.div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-10 h-10 border-[3px] border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
          <p className="text-xs" style={{ color: t.textMuted }}>Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <FiInbox size={36} style={{ color: 'rgba(201,168,76,0.35)' }} />
          </div>
          <p className="font-bold text-base" style={{ color: t.textMuted }}>No messages yet</p>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>Customer messages will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

          {/* Message List */}
          <div className="lg:col-span-2 space-y-2">
            {messages.map((msg, i) => {
              const [c1, c2] = avatarGrad(msg.name);
              const isSelected = selected?._id === msg._id;
              return (
                <motion.div key={msg._id}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => { setSelected(msg); if (!msg.isRead) markRead(msg._id); }}
                  className="relative rounded-2xl cursor-pointer transition-all overflow-hidden group"
                  style={{
                    background: isSelected
                      ? (dark ? 'linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.04))' : 'rgba(201,168,76,0.08)')
                      : t.card,
                    border: `1px solid ${isSelected ? 'rgba(201,168,76,0.45)' : msg.isRead ? t.border : 'rgba(201,168,76,0.22)'}`,
                    boxShadow: isSelected ? '0 4px 24px rgba(201,168,76,0.1)' : 'none',
                  }}>

                  {!msg.isRead && (
                    <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                      style={{ background: 'linear-gradient(180deg,#c9a84c,#f0d060)' }} />
                  )}

                  <div className="flex items-center gap-3 p-4 pl-5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,${c1}33,${c2}22)`, color: c1, border: `1.5px solid ${c1}44` }}>
                      {msg.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-sm truncate" style={{ color: msg.isRead ? t.textMuted : t.text }}>{msg.name}</p>
                        {!msg.isRead && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#c9a84c' }} />}
                      </div>
                      <p className="text-xs truncate" style={{ color: t.textMuted }}>{msg.subject || msg.message}</p>
                      <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: t.textMuted }}>
                        <FiClock size={9} />
                        {new Date(msg.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={e => { e.stopPropagation(); deleteMsg(msg._id); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        style={{ color: t.textMuted }}
                        onMouseEnter={e => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.background='rgba(239,68,68,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color=t.textMuted; e.currentTarget.style.background='transparent'; }}>
                        <FiTrash2 size={12} />
                      </button>
                      <FiChevronRight size={13} style={{ color: isSelected ? '#c9a84c' : t.textMuted }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (() => {
                const [c1, c2] = avatarGrad(selected.name);
                return (
                  <motion.div key={selected._id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="rounded-2xl overflow-hidden sticky top-6"
                    style={{ border: '1px solid rgba(201,168,76,0.22)', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>

                    <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c,#f0d060,#c9a84c,transparent)' }} />

                    {/* panel header */}
                    <div className="px-6 py-5 flex items-start justify-between gap-4"
                      style={{
                        background: dark
                          ? 'linear-gradient(135deg,#0f0d00,#1c1400 60%,#141420)'
                          : 'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))',
                        borderBottom: `1px solid ${t.border}`,
                      }}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl flex-shrink-0"
                          style={{ background: `linear-gradient(135deg,${c1}33,${c2}22)`, color: c1, border: `2px solid ${c1}55`, boxShadow: `0 0 24px ${c1}22` }}>
                          {selected.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-lg leading-tight" style={{ color: t.text }}>{selected.name}</p>
                          <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: t.textMuted }}>
                            <FiClock size={10} />
                            {new Date(selected.createdAt).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {!selected.isRead && (
                            <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>
                              <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" /> Unread
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!selected.isRead && (
                          <button onClick={() => markRead(selected._id)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                            style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}
                            title="Mark as read">
                            <FiCheck size={15} />
                          </button>
                        )}
                        <button onClick={() => deleteMsg(selected._id)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
                          title="Delete">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 space-y-4" style={{ background: t.card }}>
                      {/* contact chips */}
                      <div className="flex flex-wrap gap-2">
                        <a href={`mailto:${selected.email}`}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                          style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)' }}>
                          <FiMail size={12} /> {selected.email}
                        </a>
                        {selected.phone && (
                          <a href={`tel:${selected.phone}`}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                            style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: t.text, border: `1px solid ${t.border}` }}>
                            <FiPhone size={12} /> {selected.phone}
                          </a>
                        )}
                      </div>

                      {/* subject */}
                      {selected.subject && (
                        <div className="px-4 py-3 rounded-xl"
                          style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: `1px solid ${t.border}` }}>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: t.textMuted }}>Subject</p>
                          <p className="text-sm font-semibold" style={{ color: t.text }}>{selected.subject}</p>
                        </div>
                      )}

                      {/* message body */}
                      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.18)' }}>
                        <div className="px-4 py-3 flex items-center gap-2"
                          style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.04))', borderBottom: '1px solid rgba(201,168,76,0.18)' }}>
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{ background: 'rgba(201,168,76,0.2)' }}>
                            <FiMessageSquare size={11} style={{ color: '#c9a84c' }} />
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#c9a84c' }}>Message</p>
                        </div>
                        <div className="p-5" style={{ background: dark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.02)' }}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: t.text }}>{selected.message}</p>
                        </div>
                      </div>

                      {/* action buttons */}
                      <div className="grid grid-cols-3 gap-2.5 pt-1">
                        <a href={`mailto:${selected.email}`}
                          className="flex flex-col items-center gap-1.5 py-3.5 rounded-2xl text-xs font-bold transition-all hover:scale-105"
                          style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)' }}>
                          <FiMail size={16} /> Email
                        </a>
                        {selected.phone ? (
                          <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(`Hi ${selected.name}, thank you for contacting MDB RESTROCAFE. Regarding your message: "${selected.message}"`)}`}
                            target="_blank" rel="noreferrer"
                            className="flex flex-col items-center gap-1.5 py-3.5 rounded-2xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(37,211,102,0.1)', color: '#25d366', border: '1px solid rgba(37,211,102,0.25)' }}>
                            <FaWhatsapp size={16} /> WhatsApp
                          </a>
                        ) : <div />}
                        {selected.phone ? (
                          <a href={`tel:${selected.phone}`}
                            className="flex flex-col items-center gap-1.5 py-3.5 rounded-2xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' }}>
                            <FiPhone size={16} /> Call
                          </a>
                        ) : <div />}
                      </div>
                    </div>
                  </motion.div>
                );
              })() : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-2xl border-dashed p-20 text-center sticky top-6 flex flex-col items-center justify-center"
                  style={{ border: `2px dashed ${t.border}`, background: dark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)', minHeight: '320px' }}>
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                    style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.12)' }}>
                    <FiMessageSquare size={32} style={{ color: 'rgba(201,168,76,0.25)' }} />
                  </div>
                  <p className="font-bold" style={{ color: t.textMuted }}>Select a message</p>
                  <p className="text-xs mt-1" style={{ color: t.textMuted }}>Click any message from the list to read it</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
