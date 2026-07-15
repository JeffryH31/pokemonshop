import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Zap, Shield } from 'lucide-react'
import { useCards } from '../hooks/useCatalog'
import CardGrid from '../components/cards/CardGrid'
import { CardSkeleton } from '../components/ui/Skeleton'

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
  const { data: secretRares, isLoading: loadingSecret } = useCards({
    per_page: 5,
    rarity: 'Secret Rare',
  })

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0a0f] border-b border-[#2a2a38]">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#e5b13a] opacity-[0.04] blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#a78bfa] opacity-[0.04] blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#e5b13a] bg-[#e5b13a11] border border-[#e5b13a33] px-3 py-1.5 rounded-full mb-6 tracking-widest uppercase">
                <Zap size={10} />
                Authentic Pokémon TCG
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#f0ece4] leading-tight"
            >
              Collect the{' '}
              <span className="text-[#e5b13a]">Rarest</span>{' '}
              Cards
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-[#a09a8e] text-lg leading-relaxed max-w-lg"
            >
              From Base Set commons to Secret Rare holos — find every card in pristine condition, authenticated and shipped with care.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <Link
                to="/cards"
                className="inline-flex items-center gap-2 bg-[#e5b13a] text-[#0a0a0f] font-semibold px-6 py-3 rounded-xl hover:bg-[#f0c547] transition-colors shadow-lg shadow-[#e5b13a22] text-sm"
              >
                Shop All Cards
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/cards?rarity=Secret+Rare"
                className="inline-flex items-center gap-2 bg-transparent text-[#f0ece4] border border-[#2a2a38] hover:border-[#e5b13a44] px-6 py-3 rounded-xl transition-colors text-sm"
              >
                View Secret Rares
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-[#2a2a38]"
            >
              {[
                { value: '1,000+', label: 'Cards Available' },
                { value: '6', label: 'Rarity Tiers' },
                { value: '100%', label: 'Authentic' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-[#e5b13a] font-display">{stat.value}</p>
                  <p className="text-xs text-[#5a5550] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rarity Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-[#f0ece4]">Shop by Rarity</h2>
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

      {/* Secret Rares */}
      {(secretRares?.data?.length ?? 0) > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#1e1e2a]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-[#f0ece4]">
                <span className="text-[#e5b13a]">Secret</span> Rares
              </h2>
              <p className="text-xs text-[#5a5550] mt-1">The rarest cards in the collection</p>
            </div>
            <Link
              to="/cards?rarity=Secret+Rare"
              className="flex items-center gap-1 text-sm text-[#e5b13a] hover:text-[#f0c547] transition-colors"
            >
              View all <ArrowRight size={14} />
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

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#1e1e2a]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-[#f0ece4]">New Arrivals</h2>
            <p className="text-xs text-[#5a5550] mt-1">Fresh cards added to our collection</p>
          </div>
          <Link
            to="/cards?sort=newest"
            className="flex items-center gap-1 text-sm text-[#e5b13a] hover:text-[#f0c547] transition-colors"
          >
            View all <ArrowRight size={14} />
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

      {/* Feature banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#1e1e2a]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <Shield size={22} className="text-[#e5b13a]" />,
              title: 'Condition Guaranteed',
              desc: 'Every card graded and verified before listing. What you see is what you get.',
            },
            {
              icon: <Zap size={22} className="text-[#e5b13a]" />,
              title: 'Same-Day Shipping',
              desc: 'Orders placed before 2PM ship the same day, packaged with care.',
            },
            {
              icon: <Star size={22} className="text-[#e5b13a]" />,
              title: 'Rare Finds',
              desc: 'Secret Rares and out-of-print sets sourced from collections worldwide.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#16161f] border border-[#2a2a38] rounded-xl p-5 flex gap-4 hover:border-[#e5b13a22] transition-colors"
            >
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
    </div>
  )
}
