import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'
import { WA_LINK } from '../lib/constants'

export default function WhatsAppPopup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const alreadyDismissed = sessionStorage.getItem('wa-popup-dismissed')
    if (alreadyDismissed) return
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
    sessionStorage.setItem('wa-popup-dismissed', '1')
  }

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="fixed bottom-24 right-5 z-50 w-[300px] sm:w-[340px]"
          role="dialog"
          aria-label="Hubungi Wonderplays via WhatsApp"
        >
          <div className="relative bg-[#16161f] border border-[#e5b13a33] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
            {/* Gold top accent */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#e5b13a] to-transparent" />

            <div className="p-4">
              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-[#c2bcb0] hover:text-[#f0ece4] hover:bg-[#2a2a38] transition-all cursor-pointer"
                aria-label="Tutup"
              >
                <X size={13} />
              </button>

              {/* Header */}
              <div className="flex items-start gap-3 pr-6">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#f0ece4] leading-snug">Ada yang ingin kamu cari? 🤔</p>
                  <p className="text-xs text-[#c2bcb0] mt-1 leading-relaxed">
                    Punya pertanyaan soal produk?{' '}
                    <span className="text-[#e5b13a] font-semibold">Langsung tanya kami via WhatsApp!</span>
                    <br />
                    <span className="text-[#c2bcb0]">Owner & Admin siap membantu.</span>
                  </p>
                </div>
              </div>

              {/* CTA */}
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="mt-4 flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20c05a] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-md shadow-[#25D36622]"
              >
                <MessageCircle size={15} />
                Chat Wonderplays Sekarang
              </a>

              <p className="text-[10px] text-[#c2bcb0] text-center mt-2">
                Buka setiap hari 12.00 – 24.00 WIB
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

