import { Link } from 'react-router-dom'
import { Package, Shield, Clock } from 'lucide-react'
import { CONTACT, WA_LINK } from '../../lib/constants'

// Social icons
const WaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const IgIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-[#2a2a38] mt-auto">

      {/* Trust badges */}
      <div className="border-b border-[#1e1e2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Package size={20} className="text-[#e5b13a]" />,
                title: 'Packing Tebal & Aman',
                desc: 'Setiap produk dikemas rapi dengan packing tebal untuk keamanan pengiriman.',
              },
              {
                icon: <Shield size={20} className="text-[#e5b13a]" />,
                title: 'Produk 100% Asli & Bergaransi',
                desc: 'Kami menjamin keaslian setiap produk yang kami jual. Tanpa kompromi.',
              },
              {
                icon: <Clock size={20} className="text-[#e5b13a]" />,
                title: 'Buka Setiap Hari',
                desc: 'Layanan kami tersedia setiap hari pukul 12.00 – 24.00 WIB.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e5b13a11] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0ece4]">{item.title}</p>
                  <p className="text-xs text-[#a09a8e] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#e5b13a] flex items-center justify-center shadow-md shadow-[#e5b13a22]">
                <span className="text-[#0a0a0f] font-bold text-sm font-display">W</span>
              </div>
              <span className="font-display font-bold text-[#f0ece4] text-base">Wonderplays</span>
            </div>
            <p className="text-xs text-[#a09a8e] leading-relaxed mb-4">
              Wonderful Place for All Collectors.<br />
              Terpercaya sejak 2023.
            </p>
            {/* Jam buka */}
            <div className="flex items-center gap-1.5 mb-4">
              <Clock size={11} className="text-[#e5b13a]" />
              <span className="text-xs text-[#a09a8e] font-medium">Buka Setiap Hari 12.00 – 24.00 WIB</span>
            </div>
            {/* Social links */}
            <div className="space-y-2">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#25D366] hover:text-[#4ade80] transition-colors"
              >
                <span className="w-5 h-5 rounded-md bg-[#25D366] flex items-center justify-center shrink-0 text-white">
                  <WaIcon />
                </span>
                {CONTACT.waDisplay}
              </a>
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#e1306c] hover:text-[#f472b6] transition-colors"
              >
                <span className="w-5 h-5 rounded-md bg-gradient-to-br from-[#f09433] via-[#e1306c] to-[#833ab4] flex items-center justify-center shrink-0 text-white">
                  <IgIcon />
                </span>
                {CONTACT.instagram}
              </a>
              <a
                href={CONTACT.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#f0ece4] hover:text-[#a09a8e] transition-colors"
              >
                <span className="w-5 h-5 rounded-md bg-[#010101] border border-[#2a2a38] flex items-center justify-center shrink-0 text-white">
                  <TikTokIcon />
                </span>
                {CONTACT.tiktok}
              </a>
            </div>
          </div>

          {/* Jelajahi */}
          <div>
            <h4 className="text-xs font-semibold text-[#a09a8e] uppercase tracking-widest mb-3">Jelajahi</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Beranda' },
                { to: '/cards', label: 'Toko' },
                { to: '/favourites', label: 'Favorit Saya' },
                { to: '/about', label: 'Tentang Kami' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-[#a09a8e] hover:text-[#a09a8e] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h4 className="text-xs font-semibold text-[#a09a8e] uppercase tracking-widest mb-3">Informasi</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-[#a09a8e] hover:text-[#a09a8e] transition-colors">
                  Tentang Kami
                </Link>
              </li>
              {['Kebijakan Pengiriman', 'Kebijakan Pengembalian', 'Kebijakan Privasi'].map((label) => (
                <li key={label}>
                  <span className="text-sm text-[#a09a8e] cursor-not-allowed">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1e1e2a] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#a09a8e]">© {new Date().getFullYear()} Wonderplays. Hak cipta dilindungi.</p>
          <p className="text-xs text-[#a09a8e]">Pokémon adalah merek dagang Nintendo / Creatures Inc. / GAME FREAK inc. Wonderplays tidak berafiliasi dengan perusahaan apapun.</p>
        </div>
      </div>
    </footer>
  )
}

