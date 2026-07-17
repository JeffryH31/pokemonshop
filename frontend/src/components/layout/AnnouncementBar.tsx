export default function AnnouncementBar() {
  const items = [
    '✦ Wonderplays — Wonderful Place for All Collectors',
    '✦ Buka Setiap Hari 12.00 – 24.00 WIB',
    '✦ Produk 100% Asli & Bergaransi',
    '✦ Pengiriman Seluruh Indonesia • Packing Tebal & Aman',
    '✦ Ongkir Flat Rp 25.000 per Kilogram',
    '✦ Terpercaya Sejak 2023 • Ribuan Produk Terjual',
    '✦ Order Langsung via WhatsApp dengan Owner & Admin',
  ]

  const repeated = [...items, ...items]

  return (
    <div className="bg-[#e5b13a] text-[#0a0a0f] py-2 overflow-hidden">
      <div className="marquee-inner flex gap-12 text-xs font-semibold tracking-widest uppercase">
        {repeated.map((item, i) => (
          <span key={i} className="shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
