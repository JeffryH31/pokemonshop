import { motion } from 'framer-motion'
import { MessageCircle, Clock, MapPin, Star, Shield, TrendingUp } from 'lucide-react'
import { BRAND, CONTACT, WA_LINK } from '../lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
}

const IgIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
  </svg>
)

const MILESTONES = [
  {
    year: 'Awal 2023',
    icon: '🚀',
    title: 'Wonderplays Lahir',
    desc: 'Wonderplays pertama kali hadir melalui platform TikTok dan langsung aktif berjualan secara Live setiap harinya.',
  },
  {
    year: '2023',
    icon: '📦',
    title: 'Puluhan Ribu Packs Terjual',
    desc: 'Kepercayaan pelanggan terus tumbuh. Puluhan ribu Packs dan ribuan Sealed Product berhasil terjual tanpa satu pun masalah.',
  },
  {
    year: '2024',
    icon: '🌟',
    title: 'Ratusan Pelanggan Setia',
    desc: 'Lebih dari ratusan pelanggan dari seluruh Indonesia mempercayakan koleksinya kepada Wonderplays.',
  },
  {
    year: '2025+',
    icon: '💻',
    title: 'Go Digital — Platform Web',
    desc: 'Sebagai bentuk dukungan terhadap perkembangan teknologi, Wonderplays kini hadir dalam platform digital yang lebih modern.',
  },
]

const VALUES = [
  {
    icon: <Shield size={20} className="text-[#e5b13a]" />,
    title: 'Kejujuran',
    desc: 'Kami sangat menjunjung tinggi nilai kejujuran dalam setiap transaksi. Tidak ada informasi yang disembunyikan.',
  },
  {
    icon: <Star size={20} className="text-[#e5b13a]" />,
    title: 'Etika Bisnis',
    desc: 'Setiap keputusan bisnis kami selalu didasarkan pada etika yang baik demi kepercayaan jangka panjang.',
  },
  {
    icon: <TrendingUp size={20} className="text-[#e5b13a]" />,
    title: 'Tanggung Jawab',
    desc: 'Kami bertanggung jawab penuh terhadap setiap produk dan pelayanan yang kami berikan kepada semua customer.',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Hero */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center mb-14"
      >
        {/* Logo besar */}
        <div className="w-20 h-20 rounded-2xl bg-[#e5b13a] flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[#e5b13a22]">
          <span className="text-[#0a0a0f] font-bold text-4xl font-display">W</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#f0ece4] mb-3">
          Wonderplays
        </h1>
        <p className="text-[#e5b13a] font-semibold text-lg tracking-wide mb-4">
          Wonderful Place for All Collectors.
        </p>

        {/* Jam buka */}
        <div className="inline-flex items-center gap-2 bg-[#e5b13a11] border border-[#e5b13a33] rounded-full px-4 py-2">
          <Clock size={14} className="text-[#e5b13a]" />
          <span className="text-sm text-[#e5b13a] font-medium">{BRAND.hours}</span>
        </div>
      </motion.div>

      {/* Tentang */}
      <motion.div
        variants={fadeUp}
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-[#16161f] border border-[#2a2a38] rounded-2xl p-7 mb-6"
      >
        <h2 className="font-display text-xl font-bold text-[#f0ece4] mb-4">Tentang Wonderplays</h2>
        <div className="space-y-3 text-sm text-[#a09a8e] leading-relaxed">
          <p>
            <span className="text-[#f0ece4] font-semibold">Wonderplays</span> merupakan Toko Online berbasis Digital yang
            dibuat sebagai bentuk dukungan terhadap teknologi yang semakin berkembang, dengan memberikan pengalaman
            Berbelanja Produk Collectibles yang <span className="text-[#e5b13a] font-medium">Mudah, Murah dan Terpercaya</span> sejak 2023.
          </p>
          <p>
            Wonderplays dibentuk sejak awal 2023 melalui Platform digital TikTok yang kala itu sudah aktif berjualan
            secara Live setiap harinya. Lebih dari <span className="text-[#f0ece4] font-semibold">Ratusan pelanggan</span> serta{' '}
            <span className="text-[#f0ece4] font-semibold">Puluhan Ribu Packs</span> bahkan{' '}
            <span className="text-[#f0ece4] font-semibold">Ribuan Sealed Product</span> sudah terjual, tanpa adanya
            permasalahan yang timbul.
          </p>
          <p>
            Karena kami sangat menjunjung tinggi Nilai <span className="text-[#e5b13a] font-medium">Kejujuran, Etika Bisnis</span>{' '}
            dan <span className="text-[#e5b13a] font-medium">Tanggung Jawab</span> terhadap semua Customer kami.
          </p>
          <p className="text-[#7a7470] text-xs italic">
            Wonderplays tidak berafiliasi dengan perusahaan apapun.
          </p>
        </div>
      </motion.div>

      {/* Nilai-nilai */}
      <motion.div
        variants={fadeUp}
        custom={2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-6"
      >
        <h2 className="font-display text-xl font-bold text-[#f0ece4] mb-4">Nilai yang Kami Pegang</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-[#16161f] border border-[#2a2a38] hover:border-[#e5b13a33] rounded-xl p-5 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#e5b13a11] flex items-center justify-center mb-3">
                {v.icon}
              </div>
              <p className="text-sm font-semibold text-[#f0ece4] mb-1">{v.title}</p>
              <p className="text-xs text-[#7a7470] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Perjalanan */}
      <motion.div
        variants={fadeUp}
        custom={3}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-6"
      >
        <h2 className="font-display text-xl font-bold text-[#f0ece4] mb-4">Perjalanan Kami</h2>
        <div className="space-y-3">
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.title}
              variants={fadeUp}
              custom={i * 0.5}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex gap-4 bg-[#16161f] border border-[#2a2a38] hover:border-[#e5b13a22] rounded-xl p-4 transition-colors"
            >
              <div className="text-2xl shrink-0 mt-0.5">{m.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-[#e5b13a] bg-[#e5b13a11] px-2 py-0.5 rounded-full">{m.year}</span>
                  <p className="text-sm font-semibold text-[#f0ece4]">{m.title}</p>
                </div>
                <p className="text-xs text-[#7a7470] leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Kontak */}
      <motion.div
        variants={fadeUp}
        custom={4}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-[#16161f] border border-[#2a2a38] rounded-2xl p-7 mb-6"
      >
        <h2 className="font-display text-xl font-bold text-[#f0ece4] mb-5">Hubungi Kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* WhatsApp */}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366]/50 rounded-xl p-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0 shadow-md shadow-[#25D36622]">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[#7a7470]">WhatsApp</p>
              <p className="text-sm font-semibold text-[#25D366] group-hover:text-[#4ade80] transition-colors">{CONTACT.waDisplay}</p>
            </div>
          </a>

          {/* Instagram */}
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#e1306c]/10 border border-[#e1306c]/20 hover:border-[#e1306c]/50 rounded-xl p-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f09433] via-[#e1306c] to-[#833ab4] flex items-center justify-center shrink-0 text-white shadow-md">
              <IgIcon />
            </div>
            <div>
              <p className="text-xs text-[#7a7470]">Instagram</p>
              <p className="text-sm font-semibold text-[#f0ece4] group-hover:text-[#e1306c] transition-colors">{CONTACT.instagram}</p>
            </div>
          </a>

          {/* TikTok */}
          <a
            href={CONTACT.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#f0ece4]/5 border border-[#2a2a38] hover:border-[#f0ece4]/20 rounded-xl p-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] flex items-center justify-center shrink-0 text-white shadow-md">
              <TikTokIcon />
            </div>
            <div>
              <p className="text-xs text-[#7a7470]">TikTok</p>
              <p className="text-sm font-semibold text-[#f0ece4] group-hover:text-[#a09a8e] transition-colors">{CONTACT.tiktok}</p>
            </div>
          </a>
        </div>

        {/* Jam buka reminder */}
        <div className="mt-5 flex items-start gap-3 bg-[#e5b13a09] border border-[#e5b13a22] rounded-xl p-4">
          <Clock size={16} className="text-[#e5b13a] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#f0ece4]">Jam Operasional</p>
            <p className="text-xs text-[#a09a8e] mt-0.5">Buka <span className="text-[#e5b13a] font-semibold">Setiap Hari</span> pukul <span className="text-[#e5b13a] font-semibold">12.00 – 24.00 WIB</span>. Pesan di luar jam operasional akan dibalas saat toko buka.</p>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        variants={fadeUp}
        custom={5}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-[#7a7470] text-sm mb-4">Siap mulai koleksimu?</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20c05a] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-[#25D36622] text-sm"
          >
            <MessageCircle size={16} />
            Chat Kami Sekarang
          </a>
          <a
            href="/cards"
            className="inline-flex items-center gap-2 border border-[#2a2a38] hover:border-[#e5b13a44] text-[#f0ece4] font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <MapPin size={16} className="text-[#e5b13a]" />
            Lihat Katalog
          </a>
        </div>
      </motion.div>

    </div>
  )
}
