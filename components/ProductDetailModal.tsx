'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ensureUrl } from '@/lib/utils'
import { addToCart } from '@/lib/cart'
import { Product } from '@/app/page'

interface ProductDetailModalProps {
    product: Product
    products: Product[]
    isOpen: boolean
    onClose: () => void
    onSelect?: (product: Product) => void
    config?: Record<string, string>
}

export function ProductDetailModal({ product, products, isOpen, onClose, onSelect, config = {} }: ProductDetailModalProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Reset image index when product changes
    useEffect(() => {
        setCurrentImageIndex(0)
    }, [product.id])

    const relatedProducts = useMemo(() => {
        if (!products) return []

        // Filter available products (exclude current, sold, archive)
        const available = products.filter(p =>
            p.id !== product.id &&
            p.status !== 'SOLD' &&
            p.status !== 'ARCHIVE' &&
            p.condition !== 'ARCHIVE'
        )

        // Shuffle array
        const shuffled = [...available].sort(() => 0.5 - Math.random())

        return shuffled.slice(0, 2)
    }, [products, product.id])

    // Treat archive as a separate showcase (not item condition):
    // - layout_index === 6 is the dedicated archive slot
    // - status/condition may also mark archive/sold items
    const isArchive = product.layout_index === 6 || product.status === 'ARCHIVE' || product.condition === 'ARCHIVE'

    const slugBase = useMemo(() => {
        // Expected: /:number/:name
        const parts = (pathname || '').split('/').filter(Boolean)
        if (parts.length >= 2 && /^\d+$/.test(parts[0])) return `/${parts[0]}/${parts[1]}`
        return ''
    }, [pathname])

    const withSlugBase = (p: string | undefined | null): string => {
        if (!p) return ''
        const s = String(p)
        if (/^https?:\/\//i.test(s)) return s
        // Do not prefix /images/* (see main page comment): keep static assets at root for best caching.
        return s
    }

    // Ensure images array exists (API/runtime may deliver a string instead of string[])
    // and normalize to tenant-prefixed URLs so modal uses the same cache/proxy path.
    const images = useMemo(() => {
        const raw: any = (product as any).images
        let arr: string[] = []
        if (Array.isArray(raw)) arr = raw
        else if (typeof raw === 'string' && raw) arr = [raw]
        else if (product.image) arr = [product.image]
        return arr.map((x) => withSlugBase(x)).filter(Boolean)
    }, [product, slugBase])

    // Links
    const buyLink = ensureUrl(config.link_direct)
    const askLink = ensureUrl(config.link_telegram)

    const [added, setAdded] = useState(false)
    const [inCart, setInCart] = useState(false)

    // Check if product is in cart
    useEffect(() => {
        if (!isOpen || !slugBase) return
        try {
            const cart = require('@/lib/cart').loadCart(slugBase)
            const exists = cart.items.some((i: any) => i.productId === product.id)
            setInCart(exists)
        } catch (e) {
            setInCart(false)
        }
    }, [isOpen, slugBase, product.id, added])

    // Lock body scroll when modal is open - preserve scroll position
    useEffect(() => {
        if (isOpen) {
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
        }
    }, [isOpen])

    // Preload neighboring images to make arrow navigation instant.
    useEffect(() => {
        if (!isOpen) return
        if (!images || images.length <= 1) return

        const nextIdx = (currentImageIndex + 1) % images.length
        const prevIdx = (currentImageIndex - 1 + images.length) % images.length

        const preload = (src: string | undefined) => {
            if (!src) return
            const img = new window.Image()
            img.decoding = 'async'
            img.loading = 'eager'
            img.src = src
        }

        preload(images[nextIdx])
        preload(images[prevIdx])
    }, [isOpen, images, currentImageIndex])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100]" style={{ height: '100dvh' }}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background" onClick={onClose} />

            {/* Modal Content - Scrollable */}
            <div className="absolute inset-0 overflow-y-auto overscroll-contain" style={{ height: '100dvh' }}>
                <div className="min-h-full">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="fixed top-4 right-4 z-[110] p-2 bg-background/90 backdrop-blur-sm hover:bg-background transition-colors border border-border rounded-sm"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col lg:grid lg:grid-cols-2">
                        {/* Image section */}
                        <div
                            className="relative aspect-[4/5] lg:h-screen w-full bg-background lg:sticky lg:top-0 flex items-center justify-center overflow-hidden touch-pan-y"
                            data-rovodev-swipe="1"
                        >
                            <img
                                src={images[currentImageIndex] || withSlugBase("/placeholder.svg")}
                                alt={product.name}
                                className={`absolute inset-0 h-full w-full ${isArchive ? 'object-cover' : 'object-contain'} object-center select-none`}
                                loading="eager"
                                decoding="async"
                                draggable={false}
                                onTouchStart={(e) => {
                                    if (images.length <= 1) return
                                    const t = e.touches?.[0]
                                    if (!t) return
                                    ;(window as any).__ag_swipe_start_x = t.clientX
                                    ;(window as any).__ag_swipe_active = true
                                }}
                                onTouchEnd={(e) => {
                                    if (images.length <= 1) return
                                    const startX = Number((window as any).__ag_swipe_start_x || 0)
                                    const endX = Number(e.changedTouches?.[0]?.clientX || 0)
                                    const dx = endX - startX
                                    ;(window as any).__ag_swipe_active = false
                                    if (Math.abs(dx) < 50) return
                                    if (dx < 0) {
                                        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                                    } else {
                                        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                                    }
                                }}
                                onMouseDown={(e) => {
                                    if (images.length <= 1) return
                                    ;(window as any).__ag_swipe_start_x = e.clientX
                                    ;(window as any).__ag_swipe_active = true
                                }}
                                onMouseUp={(e) => {
                                    if (images.length <= 1) return
                                    const startX = Number((window as any).__ag_swipe_start_x || 0)
                                    const dx = e.clientX - startX
                                    ;(window as any).__ag_swipe_active = false
                                    if (Math.abs(dx) < 80) return
                                    if (dx < 0) {
                                        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                                    } else {
                                        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                                    }
                                }}
                            />

                            {/* Image selector dots */}
                            {images.length > 1 && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`h-2 rounded-full transition-all ${idx === currentImageIndex
                                                ? 'bg-foreground w-6'
                                                : 'bg-foreground/40 hover:bg-foreground/60 w-2'
                                                }`}
                                            aria-label={`View image ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Image navigation arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors border border-border/40"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors border border-border/40"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Info section */}
                        <div className="bg-background p-6 lg:p-10">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <Badge variant="secondary" className="mb-3 text-[9px] bg-foreground/10 backdrop-blur-sm">
                                        {product.condition || 'USED'}
                                    </Badge>
                                    <h2 className="text-2xl md:text-3xl font-light leading-tight">{product.name}</h2>
                                </div>

                                {/* Link logic */}
                                {(() => {
                                    if (isArchive) return null;

                                    return (
                                        <>
                                            <div className="flex items-baseline gap-3">
                                                {product.originalPrice && (
                                                    <p className="text-base text-muted-foreground line-through">
                                                        {product.originalPrice}
                                                    </p>
                                                )}
                                                <p className="text-3xl md:text-4xl font-light">{product.price}</p>
                                            </div>

                                            <div className="space-y-4 border-t border-border pt-4">
                                                <div>
                                                    <h3 className="text-[10px] tracking-wider text-muted-foreground mb-1">ОПИСАНИЕ</h3>
                                                    <p className="text-sm leading-relaxed">
                                                        {(product.status === 'SOLD')
                                                            ? 'Предмет больше не доступен'
                                                            : (product.description || 'Нет описания')}
                                                    </p>
                                                </div>
                                                <div className="flex gap-8">
                                                    <div>
                                                        <h3 className="text-[10px] tracking-wider text-muted-foreground mb-1">СОСТОЯНИЕ</h3>
                                                        <p className="text-sm">
                                                            {(product.status === 'SOLD')
                                                                ? '—'
                                                                : (product.condition || '—')}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[10px] tracking-wider text-muted-foreground mb-1">РАЗМЕР</h3>
                                                        <p className="text-sm">
                                                            {(product.status === 'SOLD')
                                                                ? '—'
                                                                : (product.size || '—')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm">{product.material}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 pt-4">
                                                <Button
                                                    size="lg"
                                                    className="w-full tracking-wider text-xs"
                                                    onClick={() => {
                                                        if (inCart) {
                                                            // Open cart modal
                                                            window.dispatchEvent(new CustomEvent('ag-open-cart'))
                                                        } else {
                                                            try {
                                                                addToCart(slugBase, product.id, 1)
                                                                setAdded(true)
                                                                setInCart(true)
                                                                setTimeout(() => setAdded(false), 1200)
                                                            } catch (e) {
                                                                console.error('addToCart failed', e)
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {inCart ? 'ПЕРЕЙТИ В КОРЗИНУ' : (added ? 'ДОБАВЛЕНО' : 'ДОБАВИТЬ В КОРЗИНУ')}
                                                </Button>
                                            </div>
                                        </>
                                    );
                                })()}

                                {/* Related Products */}
                                <div className="pt-6 border-t border-border mt-2">
                                    <h3 className="text-[10px] tracking-wider text-muted-foreground mb-4">ВАМ МОЖЕТ ПОНРАВИТЬСЯ</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {relatedProducts.map((relatedProduct, idx) => (
                                            <div
                                                key={relatedProduct.id}
                                                className="relative aspect-[4/5] overflow-hidden bg-card border border-border/30 cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => {
                                                    if (onSelect) {
                                                        onSelect(relatedProduct)
                                                    } else {
                                                        // Fallback: keep current path (including slug) and update ?product=
                                                        const params = new URLSearchParams(searchParams?.toString())
                                                        params.set('product', String(relatedProduct.id))
                                                        const qs = params.toString()
                                                        router.push(qs ? `${pathname}?${qs}` : `${pathname}?product=${relatedProduct.id}`)
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={withSlugBase(relatedProduct.image || "/placeholder.svg")}
                                                    alt={relatedProduct.name}
                                                    className="absolute inset-0 h-full w-full object-cover object-center"
                                                    loading="lazy"
                                                    decoding="async"
                                                    draggable={false}
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent hidden dark:block" />
                                                <div className="absolute bottom-0 left-0 right-0 p-2 z-10 text-foreground dark:text-white">
                                                    <h4 className="text-[9px] font-light leading-tight mb-0.5 line-clamp-2">
                                                        {relatedProduct.name}
                                                    </h4>
                                                    <p className="text-xs font-light">{relatedProduct.price}</p>
                                                <div className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-background/70 backdrop-blur-sm border border-border/40 dark:hidden">
                                                  {idx + 1}/{relatedProducts.length}
                                                </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
