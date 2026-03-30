'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingBag, Trash2, CreditCard, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/shop-products'
import { createCheckout } from '@/lib/shopify'

export function CartDrawer() {
  const { items, count, total, isOpen, closeCart, removeItem, updateQuantity } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setError(null)
    setIsCheckingOut(true)
    try {
      const lineItems = items.map(i => ({
        variantId: i.product.variantId,
        quantity: i.quantity,
      }))
      const checkoutUrl = await createCheckout(lineItems)
      // Redirect to Shopify-hosted checkout (full credit card support)
      window.location.href = checkoutUrl
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Checkout failed'
      // Friendly message when env vars are not yet configured
      if (msg.includes('env vars not set')) {
        setError(
          'Connect your Shopify store to enable checkout. Add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local'
        )
      } else {
        setError(msg)
      }
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md flex flex-col bg-[#0a0a0f] border-l border-white/[0.07] shadow-2xl"
            aria-label="Shopping cart"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
                <h2 className="text-white font-semibold text-base">Your Cart</h2>
                {count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag className="w-12 h-12 text-white/10" />
                  <p className="text-white/30 text-sm">Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(({ product, quantity }) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="64px" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium leading-snug truncate">
                          {product.name}
                        </p>
                        <p className="text-blue-400 text-sm font-semibold mt-0.5">
                          {formatPrice(product.price)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] border border-white/[0.08] p-1">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors rounded"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-sm w-5 text-center tabular-nums">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors rounded"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(product.id)}
                            className="p-1.5 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <p className="text-white/50 text-sm font-medium self-start tabular-nums">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer — total + checkout */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/[0.06] space-y-4">
                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Order summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/40">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/40">
                    <span>Shipping &amp; taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between font-semibold text-white pt-2 border-t border-white/[0.06]">
                    <span>Total</span>
                    <span className="tabular-nums">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full btn-embossed-primary flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirecting to checkout…
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Checkout · {formatPrice(total)}
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay'].map(m => (
                    <span key={m} className="text-[10px] text-white/20 font-medium">
                      {m}
                    </span>
                  ))}
                </div>
                <p className="text-center text-[11px] text-white/20">
                  Secured by Shopify · 256-bit SSL encryption
                </p>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
