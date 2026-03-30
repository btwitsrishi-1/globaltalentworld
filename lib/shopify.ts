/**
 * Shopify Storefront API client
 *
 * Set these env vars in .env.local:
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-public-storefront-token
 *
 * Until you connect a real store the shop runs entirely on the mock products
 * defined in lib/shop-products.ts — checkout redirects to the Shopify-hosted
 * checkout URL which handles all credit card processing (Stripe-powered,
 * fully PCI-compliant, no extra config needed).
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? ''
const TOKEN  = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? ''
const API_URL = `https://${DOMAIN}/api/2024-01/graphql.json`

export type ShopifyLineItem = {
  variantId: string
  quantity: number
}

export type ShopifyCheckout = {
  id: string
  webUrl: string
  lineItems: { edges: Array<{ node: { title: string; quantity: number } }> }
}

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new Error('Shopify env vars not set. Add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local')
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data as T
}

/** Create a new Shopify checkout and return the hosted URL */
export async function createCheckout(lineItems: ShopifyLineItem[]): Promise<string> {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout { id webUrl }
        checkoutUserErrors { message field }
      }
    }
  `
  const data = await shopifyFetch<{
    checkoutCreate: {
      checkout: { id: string; webUrl: string }
      checkoutUserErrors: { message: string }[]
    }
  }>(query, {
    input: {
      lineItems: lineItems.map(({ variantId, quantity }) => ({ variantId, quantity })),
    },
  })

  const errs = data.checkoutCreate.checkoutUserErrors
  if (errs.length) throw new Error(errs[0].message)
  return data.checkoutCreate.checkout.webUrl
}
