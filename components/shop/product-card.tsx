'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CheckCircle, ShoppingCart, Star, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'
import { formatPrice, type Product } from '@/lib/shop-products'

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col rounded-3xl overflow-hidden border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.14] transition-all duration-500 hover:shadow-2xl hover:shadow-black/40"
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/90 backdrop-blur-sm text-white text-[11px] font-semibold tracking-wide">
          <Star className="w-3 h-3 fill-white" />
          {product.badge}
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/40 to-transparent" />

        {/* Accent glow */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          product.accent,
        )} />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-5">
        {/* Title + tagline */}
        <div>
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-blue-400/60 mb-1.5">
            {product.tagline}
          </p>
          <h3 className="text-xl font-bold text-white leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-white/40 text-sm leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Features list */}
        <ul className="space-y-2">
          {product.features.map(f => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-white/55">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-2xl font-bold text-white">
              {formatPrice(product.price)}
            </span>
            <span className="text-white/30 text-xs ml-1">USD</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            className={cn(
              'relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden',
              added
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : 'btn-embossed-primary text-white',
            )}
          >
            <motion.span
              key={added ? 'added' : 'add'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              {added ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </motion.span>
          </motion.button>
        </div>

        {/* Trust signal */}
        <p className="flex items-center gap-1.5 text-[11px] text-white/25">
          <Zap className="w-3 h-3 text-yellow-400/50" />
          Secure checkout via Shopify · Credit cards accepted
        </p>
      </div>
    </motion.article>
  )
}
