'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cartProducts, clearCart, countItems, loadCart, parsePriceToNumber, removeFromCart, type CartState, type ProductLike } from '@/lib/cart'

type Props = {
  isOpen: boolean
  onClose: () => void
  products: ProductLike[]
  slugBase: string
}

export function CartModal({ isOpen, onClose, products, slugBase }: Props) {
  const [cart, setCart] = useState<CartState>({ items: [] })
  const [step, setStep] = useState<'cart' | 'checkout' | 'done'>('cart')
  const [buyerTelegram, setBuyerTelegram] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setCart(loadCart(slugBase))
    setStep('cart')
    setError(null)
  }, [isOpen, slugBase])

  // Lock scroll (same pattern as product modal)
  useEffect(() => {
    if (!isOpen) return
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  const items = useMemo(() => cartProducts(cart, products), [cart, products])
  const total = useMemo(() => {
    return items.reduce((sum, it) => sum + parsePriceToNumber(it.product.price) * it.qty, 0)
  }, [items])

  const count = useMemo(() => countItems(cart), [cart])

  if (!isOpen) return null

  const tenantSlug = slugBase.replace(/^\//, '')
  const queryParam = tenantSlug && tenantSlug !== '' ? `slug=${encodeURIComponent(tenantSlug)}` : ''

  const buildOrdersUrl = (base: string) => {
    const b = (base || '').trim()
    const prefix = b && b !== '/' ? b : ''
    const qs = queryParam ? `?${queryParam}` : ''
    return `${prefix}/api/orders${qs}`
  }

  const submitOrder = async () => {
    setSubmitting(true)
    setError(null)
    try {
      // Some deployments mount the app under a tenant path prefix (/:number/:name).
      // In that case the API routes are also accessible under that prefix.
      // We try root first, then fallback to prefixed.
      const tryUrls = [buildOrdersUrl(''), buildOrdersUrl(slugBase)]
      let res: Response | null = null
      let data: any = null

      for (const url of tryUrls) {
        try {
          res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              buyerTelegram,
              items: cart.items.map(i => ({ productId: i.productId, qty: i.qty })),
            }),
          })
          data = await res.json().catch(() => null)
          // If endpoint exists and responded with JSON, stop here.
          if (data !== null) break
        } catch {
          // try next
        }
      }

      if (!res) throw new Error('order_request_failed')
      if (!data || !res.ok || !data?.ok) {
        const errMsg = data?.error || (!res.ok ? `http_${res.status}` : 'order_failed')
        const details = data?.details || data?.message || ''
        console.error('Order submission failed:', { status: res.status, error: errMsg, details, data })
        setError(details ? `${errMsg}: ${details}` : errMsg)
        return
      }

      clearCart(slugBase)
      setCart({ items: [] })
      setStep('done')
      return
    } catch (e: any) {
      setError(String(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[120]" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-background border-l border-border overflow-y-auto">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Корзина</div>
            <div className="text-xs text-muted-foreground">{count} шт.</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-muted/30 rounded-sm">
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === 'cart' && (
          <div className="p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-sm text-muted-foreground">Корзина пуста</div>
            ) : (
              <>
                <div className="space-y-3">
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="flex gap-3 items-start border border-border/50 p-3">
                      <img
                        src={(product.images?.[0] || product.image || '/placeholder.svg') as any}
                        alt={product.name}
                        className="h-20 w-16 object-cover bg-muted/10"
                      />
                      <div className="flex-1">
                        <div className="text-[11px] tracking-wide uppercase leading-tight">{product.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{product.price}</div>
                        <div className="text-xs text-muted-foreground mt-1">Кол-во: {qty}</div>
                      </div>
                      <button
                        className="p-2 hover:bg-muted/30 rounded-sm"
                        onClick={() => setCart(removeFromCart(slugBase, product.id))}
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Итого</span>
                    <span className="font-light">{total.toLocaleString('ru-RU')} ₽</span>
                  </div>

                  <div className="mt-4">
                    <Button
                      size="lg"
                      className="w-full tracking-wider text-xs"
                      disabled={items.length === 0}
                      onClick={() => setStep('checkout')}
                    >
                      КУПИТЬ
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'checkout' && (
          <div className="p-5 space-y-4">
            <div className="text-sm">
              Укажите ваш ник в Telegram для связи (например, <span className="text-muted-foreground">@username</span>).
            </div>
            <input
              value={buyerTelegram}
              onChange={(e) => setBuyerTelegram(e.target.value)}
              placeholder="@username"
              className="w-full h-11 px-3 text-sm bg-background border border-border outline-none"
            />
            {error && <div className="text-xs text-red-500">Ошибка: {error}</div>}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('cart')} disabled={submitting}>
                Назад
              </Button>
              <Button className="flex-1" onClick={submitOrder} disabled={submitting || !buyerTelegram.trim() || cart.items.length === 0}>
                {submitting ? 'Отправка…' : 'Отправить'}
              </Button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="p-5 space-y-3">
            <div className="text-sm">Заявка отправлена.</div>
            <div className="text-xs text-muted-foreground">Администратор свяжется с вами в Telegram.</div>
            <Button className="w-full" onClick={onClose}>Ок</Button>
          </div>
        )}
      </div>
    </div>
  )
}
