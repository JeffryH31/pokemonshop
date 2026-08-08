import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { WA_LINK } from '../lib/constants'

const WHY_ITEMS = [
  {
    emoji: '🛡️',
    title: 'Produk 100% Asli & Bergaransi',
    desc: 'Setiap produk yang kami jual dijamin keasliannya. Foto asli barang, bukan foto editan atau hasil download.',
  },
  {
    emoji: '💬',
    title: 'Order Langsung via WhatsApp',
    desc: 'Chat langsung dengan Owner dan Admin yang sudah Expert dalam dunia Collectibles. Tanya, nego, langsung deal — semua dalam satu chat.',
  },
  {
    emoji: '🚚',
    title: 'Pengiriman Seluruh Indonesia',
    desc: 'Packing tebal, rapi dan aman ke seluruh Indonesia. Ongkir flat Rp 25.000 per Kilogram — tidak ada biaya kejutan.',
  },
  {
    emoji: '💰',
    title: 'Harga Mengikuti Pasar',
    desc: 'Harga selalu diperbarui berdasarkan referensi last-sold dan kondisi pasar terkini. Selalu fair dan kompetitif.',
  },
]

const HOW_STEPS = [
  {
    step: '1',
    title: 'Pilih Kartu yang Kamu Inginkan',
    desc: 'Jelajahi katalog kami, filter berdasarkan kategori untuk menemukan produk yang kamu cari.',
  },
  {
    step: '2',
    title: 'Chat via WhatsApp',
    desc: 'Klik tombol WhatsApp dan hubungi kami. Admin akan konfirmasi ketersediaan, harga, dan detail pengiriman.',
  },
  {
    step: '3',
    title: 'Bayar & Kartu Dikirim',
    desc: 'Setelah transfer, kartu langsung kami packing rapi dan kirim dengan aman — bisa pakai tracking nomor resi.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function WhyShopSection() {
  return (
    <section className="border-t border-[#1e1e2a] bg-[#0a0a0f]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Kenapa Belanja */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[#f0ece4]">
              Kenapa Belanja di <span className="text-[#e5b13a]">Wonderplays</span>?
            </h2>
            <p className="text-sm text-[#c2bcb0] mt-1">
              Aman, terpercaya, dan mudah — khusus untuk para kolektor sejati.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WHY_ITEMS.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="flex items-start gap-4 bg-[#16161f] border border-[#2a2a38] hover:border-[#e5b13a33] rounded-2xl p-5 transition-colors group"
              >
                <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-[#f0ece4] group-hover:text-[#e5b13a] transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#c2bcb0] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cara Order */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[#f0ece4]">Cara Order</h2>
            <p className="text-sm text-[#c2bcb0] mt-1">3 langkah simpel dan kartu kamu segera dikirim.</p>
          </motion.div>

          <div className="space-y-3">
            {HOW_STEPS.map((step) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="flex items-start gap-5 bg-[#16161f] border border-[#2a2a38] hover:border-[#e5b13a33] rounded-2xl p-5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#e5b13a] flex items-center justify-center shrink-0 shadow-md shadow-[#e5b13a33]">
                  <span className="text-[#0a0a0f] font-bold text-base font-display">{step.step}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0ece4] group-hover:text-[#e5b13a] transition-colors">
                    {step.title}
                  </p>
                  <p className="text-xs text-[#c2bcb0] mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-6">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20c05a] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-[#25D36622] text-sm"
            >
              <MessageCircle size={16} />
              Order Sekarang via WhatsApp
            </a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

