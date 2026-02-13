'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ChevronUp, Heart, Share2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'

const products = [
  {
    id: 1,
    name: 'MULTI-POCKET CARGO PANTS',
    price: '68 000 ₽',
    originalPrice: '85 000 ₽',
    size: 'M-L',
    condition: 'DEADSTOCK',
    image: '/images/340-2.jpeg',
    images: ['/images/340-2.jpeg', '/images/326-1.jpeg', '/images/337-2.jpeg'],
    description: 'Уникальные карго брюки с множественными карманами и регулируемыми ремнями. Редкая находка в идеальном состоянии.',
    material: 'Хлопок, нейлон',
  },
  {
    id: 2,
    name: 'SHEARLING JACKET BEIGE',
    price: '180 000 ₽',
    size: 'S-M',
    condition: 'GRAIL',
    image: '/images/337-2.jpeg',
    images: ['/images/337-2.jpeg', '/images/340-2.jpeg'],
    description: 'Дубленка из натуральной овчины бежевого оттенка. Архивная вещь из коллекции начала 2000-х.',
    material: 'Натуральная овчина',
  },
  {
    id: 3,
    name: 'LEATHER SHEARLING BOMBER',
    price: '245 000 ₽',
    size: 'M',
    condition: 'ARCHIVE',
    image: '/images/326-1.jpeg',
    images: ['/images/326-1.jpeg', '/images/338-2.jpeg'],
    description: 'Черная кожаная дубленка-бомбер с овчиной. Культовая модель из архивной коллекции.',
    material: 'Натуральная кожа, овчина',
  },
  {
    id: 4,
    name: 'HOODED LEATHER JACKET',
    price: '195 000 ₽',
    originalPrice: '235 000 ₽',
    size: 'L',
    condition: 'DEADSTOCK',
    image: '/images/338-2.jpeg',
    images: ['/images/338-2.jpeg', '/images/326-1.jpeg', '/images/340-2.jpeg'],
    description: 'Кожаная куртка с капюшоном оверсайз кроя. Deadstock в идеальном состоянии.',
    material: 'Натуральная кожа',
  },
]

/* ─── Fullscreen Product Detail Modal ─── */
function ProductDetailModal({ product, onClose }: { product: typeof products[0]; onClose: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 bg-background" onClick={onClose} />
      <div className="absolute inset-0 overflow-y-auto overscroll-contain" style={{ height: '100dvh' }}>
        <div className="min-h-full">
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-[110] p-3 glass hover:bg-foreground/10 transition-colors border border-border"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col lg:grid lg:grid-cols-2">
            <div className="relative aspect-[4/5] lg:h-screen lg:sticky lg:top-0">
              <Image
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover object-center transition-opacity duration-300"
              />
              {product.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`}
                      aria-label={`Image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(p => (p === 0 ? product.images.length - 1 : p - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 glass"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(p => (p === product.images.length - 1 ? 0 : p + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 glass"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="bg-background p-6 lg:p-10 animate-fade-in-up">
              <div className="flex flex-col gap-4">
                <div>
                  <Badge variant="secondary" className="mb-3 text-[9px] tracking-wider glass-subtle border-0">
                    {product.condition}
                  </Badge>
                  <h2 className="text-2xl lg:text-3xl font-light leading-tight">{product.name}</h2>
                </div>
                <div className="flex items-baseline gap-3">
                  {product.originalPrice && (
                    <p className="text-base text-muted-foreground line-through">{product.originalPrice}</p>
                  )}
                  <p className="text-3xl lg:text-4xl font-light">{product.price}</p>
                </div>
                <div className="space-y-4 border-t border-border pt-4">
                  <div>
                    <h3 className="text-[10px] tracking-wider text-muted-foreground mb-1">ОПИСАНИЕ</h3>
                    <p className="text-sm leading-relaxed">{product.description}</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <h3 className="text-[10px] tracking-wider text-muted-foreground mb-1">СОСТОЯНИЕ</h3>
                      <p className="text-sm">{product.condition}</p>
                    </div>
                    <div>
                      <h3 className="text-[10px] tracking-wider text-muted-foreground mb-1">РАЗМЕР</h3>
                      <p className="text-sm">{product.size}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <Button size="lg" className="w-full tracking-wider text-xs">СВЯЗАТЬСЯ В TELEGRAM</Button>
                  <Button size="lg" variant="outline" className="w-full tracking-wider text-xs bg-transparent">ЗАДАТЬ ВОПРОС</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Single Feed Card ─── */
function FeedCard({
  product,
  isActive,
  onOpenDetail,
}: {
  product: typeof products[0]
  isActive: boolean
  onOpenDetail: () => void
}) {
  const [liked, setLiked] = useState(false)
  const [imageIdx, setImageIdx] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="relative w-full h-full snap-start snap-always">
      {/* Background image */}
      <Image
        src={product.images[imageIdx] || product.image}
        alt={product.name}
        fill
        className="object-cover object-center transition-opacity duration-500"
        priority={isActive}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

      {/* Image dots */}
      {product.images.length > 1 && (
        <div className="absolute top-[calc(env(safe-area-inset-top)+4.5rem)] left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setImageIdx(idx)}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                idx === imageIdx ? 'bg-white w-8' : 'bg-white/30 w-4'
              }`}
              aria-label={`Image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Left/Right tap zones for image cycling */}
      {product.images.length > 1 && (
        <>
          <div
            className="absolute top-0 left-0 w-1/3 h-2/3 z-10"
            onClick={() => setImageIdx(p => (p === 0 ? product.images.length - 1 : p - 1))}
          />
          <div
            className="absolute top-0 right-0 w-1/3 h-2/3 z-10"
            onClick={() => setImageIdx(p => (p === product.images.length - 1 ? 0 : p + 1))}
          />
        </>
      )}

      {/* Right side action bar */}
      <div className="absolute right-4 bottom-48 flex flex-col items-center gap-5 z-20">
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
          className="flex flex-col items-center gap-1 transition-transform active:scale-90"
        >
          <div className={`p-3 rounded-full glass border border-white/10 transition-colors ${liked ? 'bg-red-500/30' : ''}`}>
            <Heart className={`h-5 w-5 transition-colors ${liked ? 'fill-red-400 text-red-400' : 'text-white'}`} />
          </div>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onOpenDetail() }}
          className="flex flex-col items-center gap-1 transition-transform active:scale-90"
        >
          <div className="p-3 rounded-full glass border border-white/10">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
        </button>

        <button
          onClick={(e) => { e.stopPropagation() }}
          className="flex flex-col items-center gap-1 transition-transform active:scale-90"
        >
          <div className="p-3 rounded-full glass border border-white/10">
            <Share2 className="h-5 w-5 text-white" />
          </div>
        </button>
      </div>

      {/* Bottom info panel */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-5 pb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2 text-[8px] tracking-wider bg-white/10 backdrop-blur-md border-0 text-white">
              {product.condition}
            </Badge>
            <h2 className="text-lg font-light text-white leading-tight mb-1">{product.name}</h2>

            <div className="flex items-baseline gap-2 mb-2">
              {product.originalPrice && (
                <span className="text-xs text-white/50 line-through">{product.originalPrice}</span>
              )}
              <span className="text-xl font-light text-white">{product.price}</span>
            </div>

            {/* Expandable description */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo) }}
              className="text-white/60 text-xs tracking-wider flex items-center gap-1"
            >
              {showInfo ? 'СКРЫТЬ' : 'ПОДРОБНЕЕ'}
              <ChevronUp className={`h-3 w-3 transition-transform ${showInfo ? 'rotate-0' : 'rotate-180'}`} />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${showInfo ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="glass rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/80 leading-relaxed mb-3">{product.description}</p>
                <div className="flex gap-6 text-xs text-white/60">
                  <span>Размер: {product.size}</span>
                  <span>{product.material}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onOpenDetail() }}
          className="mt-4 w-full py-3.5 text-xs tracking-[0.15em] text-white border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/15 transition-all"
        >
          НАПИСАТЬ О ПОКУПКЕ
        </button>
      </div>
    </div>
  )
}

/* ─── Main Feed Page ─── */
export default function FeedPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const h = containerRef.current.clientHeight
    const idx = Math.round(scrollTop / h)
    setActiveIndex(idx)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div className="h-[100dvh] bg-black text-white overflow-hidden relative">
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-5 h-14 pointer-events-auto">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">
            <span className="text-xs font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase">
              extndd
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/tinder"
              className="px-3 py-1.5 text-[10px] tracking-wider text-white/60 hover:text-white border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:bg-white/10"
            >
              TINDER
            </Link>
            <Link
              href="/catalog"
              className="px-3 py-1.5 text-[10px] tracking-wider text-white/60 hover:text-white border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:bg-white/10"
            >
              КАТАЛОГ
            </Link>
          </div>
        </div>
      </header>

      {/* Progress dots - left side */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 hidden md:flex">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              containerRef.current?.scrollTo({ top: idx * (containerRef.current?.clientHeight ?? 0), behavior: 'smooth' })
            }}
            className={`w-1 rounded-full transition-all duration-300 ${
              idx === activeIndex ? 'h-8 bg-white' : 'h-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to item ${idx + 1}`}
          />
        ))}
      </div>

      {/* Feed Container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((product, idx) => (
          <div key={product.id} className="h-[100dvh] w-full">
            <FeedCard
              product={product}
              isActive={idx === activeIndex}
              onOpenDetail={() => setSelectedProduct(product)}
            />
          </div>
        ))}
      </div>

      {/* Counter */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="px-3 py-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
          <span className="text-[10px] text-white/50 tracking-wider">
            {activeIndex + 1} / {products.length}
          </span>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  )
}
