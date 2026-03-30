'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function CartButton() {
  const { count, openCart } = useCart()

  return (
    <button
      onClick={openCart}
      aria-label={`Open cart, ${count} item${count !== 1 ? 's' : ''}`}
      className="relative p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
    >
      <ShoppingBag className="w-5 h-5" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold leading-none px-1"
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
