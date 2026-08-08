import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import { useFavouritesStore } from '../store/favouritesStore'
import CardGrid from '../components/cards/CardGrid'

export default function FavouritesPage() {
  const { items, clear } = useFavouritesStore()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Heart size={20} className="text-[#e5b13a]" fill="#e5b13a" />
            <div>
              <h1 className="font-display text-2xl font-bold text-[#f0ece4]">Favorit Saya</h1>
              <p className="text-xs text-[#a09a8e] mt-0.5">
                {items.length > 0 ? `${items.length} kartu tersimpan` : 'Belum ada kartu favorit'}
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="flex items-center gap-1.5 text-sm text-[#a09a8e] hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              Hapus Semua
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1c1c28] flex items-center justify-center">
              <Heart size={26} className="text-[#a09a8e]" />
            </div>
            <p className="text-[#a09a8e] text-sm max-w-xs">
              Kamu belum menyimpan kartu apa pun. Tekan ikon hati pada kartu untuk menambahkannya ke favorit.
            </p>
            <Link
              to="/cards"
              className="text-sm bg-[#e5b13a] text-[#0a0a0f] hover:bg-[#f0c547] font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Jelajahi Koleksi
            </Link>
          </div>
        ) : (
          <CardGrid cards={items} />
        )}
      </motion.div>
    </div>
  )
}

