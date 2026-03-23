import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook } from 'react-icons/fi';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
  { to: '/orders', label: 'My Orders' },
];

const categories = ['Momo', 'Spring Rolls', 'Wings', 'Fries', 'Burger', 'Desserts', 'Beverages'];

const socials = [
  { Icon: FiInstagram, href: 'https://www.instagram.com/mdb.restrocafe/', label: 'Instagram' },
  { Icon: FiFacebook,  href: 'https://www.facebook.com/people/MDB-Restrocafe/61586971568553/', label: 'Facebook' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0d0a05' }} className="text-gray-400">
      <div className="h-[2px]" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c 40%,#f0d060 60%,transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d060)' }}>
                <span className="text-[#1a0e00] font-black text-xs">MDB</span>
              </div>
              <div>
                <p className="font-black text-white text-sm leading-tight" style={{ fontFamily: 'Poppins,sans-serif' }}>MDB RESTROCAFE</p>
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#c9a84c' }}>Love at First Bite</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4 max-w-xs">
              Serving the most delicious momos, burgers, wings and more. Fresh ingredients, bold flavors, fast delivery.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-gray-400 hover:text-[#c9a84c]"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                  <Icon size={13} /> {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-xs text-gray-500 hover:text-[#c9a84c] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: '#c9a84c' }} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map(c => (
                <li key={c}>
                  <Link to={`/menu?category=${c}`} className="text-xs text-gray-500 hover:text-[#c9a84c] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: '#c9a84c' }} />
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {[
                { Icon: FiPhone,  label: 'Phone',    value: '7365850429',           href: 'tel:7365850429' },
                { Icon: FiMail,   label: 'Email',    value: 'mdbrestrocafe@gmail.com', href: 'mailto:mdbrestrocafe@gmail.com' },
                { Icon: FiMapPin, label: 'Location', value: 'Egra, West Bengal',    href: null },
              ].map(({ Icon, label, value, href }) => (
                <li key={label}>
                  {href
                    ? <a href={href} className="flex items-start gap-2.5 group">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all group-hover:scale-110"
                          style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)' }}>
                          <Icon size={12} style={{ color: '#c9a84c' }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] text-gray-600 uppercase tracking-wider">{label}</p>
                          <p className="text-xs text-gray-300 font-semibold group-hover:text-[#c9a84c] transition-colors break-all">{value}</p>
                        </div>
                      </a>
                    : <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)' }}>
                          <Icon size={12} style={{ color: '#c9a84c' }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] text-gray-600 uppercase tracking-wider">{label}</p>
                          <p className="text-xs text-gray-300 font-semibold">{value}</p>
                        </div>
                      </div>
                  }
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-gray-600">© 2026 MDB RESTROCAFE. All rights reserved.</p>
          <p className="text-[11px] text-gray-600">Made with <span style={{ color: '#ef4444' }}>❤️</span> for food lovers</p>
        </div>
      </div>
    </footer>
  );
}
