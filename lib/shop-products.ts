/**
 * Mock product catalogue.
 *
 * variantId must be a real Shopify GID once you connect your store:
 *   "gid://shopify/ProductVariant/XXXXXXXXXXXXXXX"
 *
 * Until then, the cart works locally and clicking "Checkout" will
 * surface a clear message asking the merchant to add their store credentials.
 */

export type Product = {
  id: string
  variantId: string   // Shopify Storefront GID
  name: string
  tagline: string
  description: string
  price: number       // USD cents
  badge?: string
  image: string       // Unsplash URL
  features: string[]
  accent: string      // Tailwind gradient classes for the card
}

export const PRODUCTS: Product[] = [
  {
    id: 'gtw-pro-membership',
    variantId: 'gid://shopify/ProductVariant/1',
    name: 'GTW Pro Membership',
    tagline: 'Unlock the global talent network',
    description:
      'Annual Pro membership giving you priority job matching, AI-powered resume review, exclusive recruiter introductions, and unlimited community posts. Stand out in a world of exceptional talent.',
    price: 9900,       // $99.00
    badge: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    features: [
      'Priority job matching algorithm',
      'AI-powered resume & portfolio review',
      'Direct recruiter introductions',
      'Unlimited community posts & DMs',
      'Early access to exclusive listings',
      'Verified talent badge on profile',
    ],
    accent: 'from-blue-500/20 via-blue-600/10 to-transparent',
  },
  {
    id: 'gtw-career-coaching',
    variantId: 'gid://shopify/ProductVariant/2',
    name: 'Career Coaching Session',
    tagline: '1-on-1 with a senior talent strategist',
    description:
      "60-minute live video session with a GTW talent strategist. We'll audit your positioning, craft your narrative, and build a 90-day action plan to land the role you want — anywhere in the world.",
    price: 24900,      // $249.00
    badge: 'High-Impact',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    features: [
      '60-min 1-on-1 video session',
      'Full profile & resume audit',
      'Personal positioning strategy',
      '90-day career action plan',
      'Follow-up email Q&A (48hr)',
      'Recording of the session',
    ],
    accent: 'from-emerald-500/20 via-emerald-600/10 to-transparent',
  },
]

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(cents / 100)
}
