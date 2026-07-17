import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Zap, Shield } from 'lucide-react'
import { useCards } from '../hooks/useCatalog'
import CardGrid from '../components/cards/CardGrid'
import { CardSkeleton } from '../components/ui/Skeleton'
import WhyShopSection from '../components/WhyShopSection'

// ── Video hero background
// Pakai YouTube embed nocookie agar tidak muncul iklan/branding YouTube
// ID video: cuplikan Pokemon TCG opening yang bisa diganti dengan video Wonderplays sendiri
// Untuk ganti: ubah ID "UaJjpLBg46Q" dengan video ID YouTube/TikTok Wonderplays
const YT_ID = 'WswHFpnIGB8' // Pokemon TCG Battle Festival highlight — bisa diganti
const YT_SRC = `https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1`

const RARITIES = [
  { label: 'Secret Rare', color: '#e5b13a', bg: '#e5b13a11' },
  { label: 'Ultra Rare', color: '#f97316', bg: '#f9731611' },
  { label: 'Rare Holo', color: '#a78bfa', bg: '#a78bfa11' },
  { label: 'Rare', color: '#60a5fa', bg: '#60a5fa11' },
  { label: 'Uncommon', color: '#4ade80', bg: '#4ade8011' },
  { label: 'Common', color: '#a09a8e', bg: '#a09a8e11' },
]

export default function HomePage() {
  const { data: newArrivals, isLoading: loadingNew } = useCards({ per_page: 10, sort: 'newest' })
  const { data: secretRares, isLoading: loadingSecret } = useCards({ per_page: 5, rarity: 'Secret Rare' })

  return (
    <div>
      {/* ── VIDEO BACKGROUND HERO ── */}
      <section className="relative h-[88vh] min-h-[580px] max-h-[900px] overflow-hidden">

        {/* YouTube iframe — scale up biar tidak ada letterbox hitam */}
        <div
          className="absolute pointer-events-none"
          style={{
            // Paksa 16:9 cover seluruh section, scale agar tidak ada sisa hitam
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'max(100%, calc(100vh * 16 / 9))',
            height: 'max(100%, calc(100vw * 9 / 16))',
          }}
        >
          <iframe
            className="w-full h-full"
            src={YT_SRC}
            title="Wonderplays video background"
            allow="autoplay; encrypted-media"
            style={{ border: 'none' }}
          />
        </div>

        {/* Layer 1 — overlay gelap merata */}
        <div className="absolute inset-0 bg-[#0a0a0f]/60 pointer-events-none" />

        {/* Layer 2 — gradient bawah lebih gelap (supaya stats tidak tertutup) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent pointer-events-none" />

        {/* Layer 3 — gradient kiri biar teks lebih terbaca */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 via-[#0a0a0f]/20 to-transparent pointer-events-none" />

        {/* Konten hero — z-20 agar di atas semua overlay */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">


              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
              >
                Wonderful Place{' '}
                <span className="text-[#e5b13a]">for All Collectors</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 text-white/75 text-base sm:text-lg leading-relaxed max-w-lg"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
              >
                Wonderplays — toko Collectibles digital yang Mudah, Murah, dan Terpercaya sejak 2023.
                Ribuan produk terjual, ratusan pelanggan puas.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3 mt-8"
              >
                <Link
                  to="/cards"
                  className="inline-flex items-center gap-2 bg-[#e5b13a] text-[#0a0a0f] font-semibold px-6 py-3 rounded-xl hover:bg-[#f0c547] transition-colors shadow-xl shadow-[#e5b13a33] text-sm"
                >
                  Lihat Semua Kartu
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white border border-white/25 hover:border-white/50 hover:bg-black/60 px-6 py-3 rounded-xl transition-all text-sm"
                >
                  Tentang Wonderplays
                </Link>
              </motion.div>

              {/* Stats — z-20, background gelap agar tetap terbaca */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-8 mt-10 pt-7 border-t border-white/15"
              >
                {[
                  { value: 'Sejak 2023', label: 'Terpercaya' },
                  { value: '100+', label: 'Pelanggan Puas' },
                  { value: '10.000+', label: 'Packs Terjual' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      className="text-2xl font-bold text-[#e5b13a] font-display"
                      style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs text-white/55 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom fade seamless ke halaman */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none z-20" />
      </section>

      {/* Kategori Kelangkaan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-[#f0ece4]">Belanja Berdasarkan Kelangkaan</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {RARITIES.map((r) => (
            <Link
              key={r.label}
              to={`/cards?rarity=${encodeURIComponent(r.label)}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#2a2a38] hover:border-opacity-60 transition-all duration-200 hover:scale-105 group"
              style={{ borderColor: `${r.color}33`, background: r.bg }}
            >
              <Star size={20} style={{ color: r.color }} />
              <span className="text-xs font-semibold text-center leading-tight" style={{ color: r.color }}>
                {r.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Secret Rare */}
      {(secretRares?.data?.length ?? 0) > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#1e1e2a]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-[#f0ece4]">
                <span className="text-[#e5b13a]">Secret</span> Rare
              </h2>
              <p className="text-xs text-[#5a5550] mt-1">Kartu paling langka dalam koleksi kami</p>
            </div>
            <Link to="/cards?rarity=Secret+Rare" className="flex items-center gap-1 text-sm text-[#e5b13a] hover:text-[#f0c547] transition-colors">
              Lihat semua <ArrowRight size={14} />
            </Link>
          </div>
          {loadingSecret ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <CardGrid cards={secretRares!.data} />
          )}
        </section>
      )}

      {/* Kartu Terbaru */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#1e1e2a]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-[#f0ece4]">Kartu Terbaru</h2>
            <p className="text-xs text-[#5a5550] mt-1">Koleksi baru yang baru ditambahkan</p>
          </div>
          <Link to="/cards?sort=newest" className="flex items-center gap-1 text-sm text-[#e5b13a] hover:text-[#f0c547] transition-colors">
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>
        {loadingNew ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <CardGrid cards={newArrivals?.data ?? []} />
        )}
      </section>

      {/* Banner fitur */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#1e1e2a]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <Shield size={22} className="text-[#e5b13a]" />,
              title: 'Produk 100% Asli & Bergaransi',
              desc: 'Setiap kartu diverifikasi sebelum dijual. Foto asli barang, keaslian terjamin tanpa kompromi.',
            },
            {
              icon: <Zap size={22} className="text-[#e5b13a]" />,
              title: 'Packing Tebal & Pengiriman Aman',
              desc: 'Dikemas rapi dengan packing tebal ke seluruh Indonesia. Ongkir flat Rp 25.000/kg.',
            },
            {
              icon: <Star size={22} className="text-[#e5b13a]" />,
              title: 'Terpercaya Sejak 2023',
              desc: 'Lebih dari ratusan pelanggan dan ribuan produk Sealed terjual tanpa masalah.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5 flex gap-4 hover:border-[#e5b13a22] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#e5b13a11] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#f0ece4]">{item.title}</h3>
                <p className="text-xs text-[#5a5550] mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kenapa Belanja + Cara Order */}
      <WhyShopSection />
    </div>
  )
}
