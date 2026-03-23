import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
  { to: '/orders', label: 'My Orders' },
];

const categories = ['Momo', 'Spring Rolls', 'Wings', 'Fries', 'Burger', 'Desserts', 'Beverages'];

const contacts = [
  { icon: FiPhone, label: 'Phone', value: '7365850429', href: 'tel:7365850429' },
  { icon: FiMail,  label: 'Email', value: 'mdbrestrocafe@gmail.com', href: 'mailto:mdbrestrocafe@gmail.com' },
  { icon: FiMapPin,label: 'Location', value: 'MDB RESTROCAFE, Egra, West Bengal', href: null },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0d0a05' }} className="text-gray-400">
      {/* gold top line */}
      <div className="h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, #c9a84c 40%, #f0d060 60%, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d060)' }}>
                <span className="text-[#1a0e00] font-black text-sm">MDB</span>
              </div>
              <div>
                <p className="font-black text-white text-sm leading-tight" style={{ fontFamily: 'Poppins,sans-serif' }}>MDB RESTROCAFE</p>
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#c9a84c' }}>Love at First Bite</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Serving the most delicious momos, burgers, wings and more. Fresh ingredients, bold flavors, fast delivery.
            </p>
            <div className="flex gap-2">
              {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 transition-all duration-200 hover:text-[#c9a84c]"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to}
                    className="text-sm text-gray-500 hover:text-[#c9a84c] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: '#c9a84c' }} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Categories</h4>
            <ul className="space-y-2.5">
              {categories.map(c => (
                <li key={c}>
                  <Link to={`/menu?category=${c}`}
                    className="text-sm text-gray-500 hover:text-[#c9a84c] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: '#c9a84c' }} />
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Contact Us</h4>
            <ul className="space-y-4">
              {contacts.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  {href
                    ? <a href={href} className="flex items-start gap-3 group">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                          style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)' }}>
                          <Icon size={13} style={{ color: '#c9a84c' }} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</p>
                          <p className="text-sm text-gray-300 font-semibold group-hover:text-[#c9a84c] transition-colors">{value}</p>
                        </div>
                      </a>
                    : <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)' }}>
                          <Icon size={13} style={{ color: '#c9a84c' }} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</p>
                          <p className="text-sm text-gray-300 font-semibold">{value}</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2026 MDB RESTROCAFE. All rights reserved.</p>
          <p className="text-xs text-gray-600">Made with <span style={{ color: '#ef4444', fontSize: '14px' }}>❤️</span> for food lovers</p>
        </div>
      </div>
    </footer>
  );
}
