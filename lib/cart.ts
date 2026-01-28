export type ProductLike = {
  id: number
  name: string
  price: string
  image?: string
  images?: string[]
}

export type CartItem = {
  productId: number
  qty: number
}

export type CartState = {
  items: CartItem[]
}

const STORAGE_PREFIX = 'ag_cart_v1:'

export function getTenantKey(slugBase: string): string {
  // slugBase for path routing is like "/1234/name". Use it as stable tenant key.
  const key = (slugBase || '').trim() || '/'
  return `${STORAGE_PREFIX}${key}`
}

export function loadCart(slugBase: string): CartState {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const raw = window.localStorage.getItem(getTenantKey(slugBase))
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.items)) return { items: [] }
    const items = parsed.items
      .map((x: any) => ({ productId: Number(x.productId), qty: Math.max(1, Number(x.qty || 1)) }))
      .filter((x: any) => Number.isFinite(x.productId) && x.productId > 0)
    return { items }
  } catch {
    return { items: [] }
  }
}

export function saveCart(slugBase: string, cart: CartState): void {
  if (typeof window === 'undefined') return
  try {
    const key = getTenantKey(slugBase)
    window.localStorage.setItem(key, JSON.stringify(cart))
    // Notify other components in this tab (and allow cross-component updates)
    window.dispatchEvent(new CustomEvent('ag-cart-changed', { detail: { key } }))
  } catch {
    // ignore (quota, private mode)
  }
}

export function addToCart(slugBase: string, productId: number, qty = 1): CartState {
  const cart = loadCart(slugBase)
  const pid = Number(productId)
  if (!pid) return cart
  const q = Math.max(1, Number(qty || 1))
  const idx = cart.items.findIndex(i => i.productId === pid)
  if (idx >= 0) {
    cart.items[idx] = { ...cart.items[idx], qty: cart.items[idx].qty + q }
  } else {
    cart.items.push({ productId: pid, qty: q })
  }
  saveCart(slugBase, cart)
  return cart
}

export function removeFromCart(slugBase: string, productId: number): CartState {
  const cart = loadCart(slugBase)
  const pid = Number(productId)
  cart.items = cart.items.filter(i => i.productId !== pid)
  saveCart(slugBase, cart)
  return cart
}

export function setQty(slugBase: string, productId: number, qty: number): CartState {
  const cart = loadCart(slugBase)
  const pid = Number(productId)
  const q = Math.max(1, Number(qty || 1))
  cart.items = cart.items.map(i => (i.productId === pid ? { ...i, qty: q } : i))
  saveCart(slugBase, cart)
  return cart
}

export function clearCart(slugBase: string): void {
  saveCart(slugBase, { items: [] })
}

export function countItems(cart: CartState): number {
  return cart.items.reduce((sum, i) => sum + (Number(i.qty) || 0), 0)
}

export function cartProducts<T extends ProductLike>(cart: CartState, products: T[]): Array<{ product: T; qty: number }> {
  const byId = new Map(products.map(p => [p.id, p]))
  return cart.items
    .map(i => ({ product: byId.get(i.productId), qty: i.qty }))
    .filter((x): x is { product: T; qty: number } => Boolean(x.product))
}

export function parsePriceToNumber(price: string | undefined | null): number {
  const s = String(price || '')
  const n = parseInt(s.replace(/\D/g, ''), 10)
  return Number.isFinite(n) ? n : 0
}
