/**
 * Shop page — temporarily disabled.
 * All code is preserved below; re-enable by:
 *   1. Adding NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN + NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local
 *   2. Updating variantIds in lib/shop-products.ts
 *   3. Uncommenting the Shop link in components/layout/navbar.tsx
 *   4. Restoring the ShopPage export at the bottom of this file
 */

import { redirect } from 'next/navigation'

export default function ShopPage() {
  redirect('/')
}

/* ─── DISABLED SHOP PAGE — restore when ready ───────────────────────────────

'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { FallingPattern } from '@/components/ui/falling-pattern'
import { ProductCard } from '@/components/shop/product-card'
import { CartDrawer } from '@/components/shop/cart-drawer'
import { CartButton } from '@/components/shop/cart-button'
import { CartProvider } from '@/lib/cart-context'
import { PRODUCTS } from '@/lib/shop-products'
import { ShoppingBag, Shield, RefreshCw, Headphones } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: Shield,      label: 'Secure Payments',    sub: 'Shopify & Stripe encrypted' },
  { icon: RefreshCw,   label: '30-Day Guarantee',   sub: 'Full refund, no questions' },
  { icon: Headphones,  label: '24/7 Support',        sub: 'Real humans, fast replies' },
  { icon: ShoppingBag, label: 'Instant Access',      sub: 'Delivered within minutes' },
]

function ShopContent() {
  return (
    <main className="min-h-screen bg-[#060608] text-white flex flex-col relative overflow-hidden">
      <FallingPattern
        className="fixed inset-0 z-0 opacity-20 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)]"
        color="rgba(59,130,246,0.8)"
        backgroundColor="transparent"
        duration={120}
        blurIntensity="0.5em"
        density={1}
      />

      <CustomCursor />
      <Navbar />

      <div className="fixed top-4 right-4 z-40 md:hidden">
        <CartButton />
      </div>

      <section className="relative pt-36 pb-20 px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm mb-8"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50">
              GTW Store
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Invest in your{' '}
            <span className="text-gradient">career</span>
          </h1>

          <p className="text-white/40 text-lg sm:text-xl font-light max-w-xl mx-auto leading-relaxed">
            Premium tools and expert guidance to help exceptional talent go further, faster.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:flex justify-center mt-8"
          >
            <CartButton />
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      <section className="relative z-10 border-t border-white/[0.05] bg-white/[0.01] px-6 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-blue-400" />
              </div>
              <p className="text-white text-sm font-medium">{label}</p>
              <p className="text-white/35 text-xs leading-snug">{sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-10 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/20 text-xs leading-relaxed">
            All payments are processed securely through{' '}
            <span className="text-white/40 font-medium">Shopify Checkout</span>
            {' '}— supporting Visa, Mastercard, American Express, Apple Pay, Google Pay, and Shop Pay.
            Your card details are never stored on our servers.
            256-bit SSL encryption on every transaction.
          </p>
        </div>
      </section>

      <CartDrawer />
      <Footer />
    </main>
  )
}

export default function ShopPage() {
  return (
    <CartProvider>
      <ShopContent />
    </CartProvider>
  )
}

─────────────────────────────────────────────────────────────────────────────*/
