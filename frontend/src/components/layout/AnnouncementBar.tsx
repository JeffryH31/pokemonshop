export default function AnnouncementBar() {
  const items = [
    '✦ Free shipping on orders over $150',
    '✦ New sets added weekly',
    '✦ Mint condition guaranteed',
    '✦ Secure checkout with JWT auth',
    '✦ Authentic Pokémon TCG singles',
    '✦ Fast & safe delivery worldwide',
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
