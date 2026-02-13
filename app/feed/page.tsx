'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ChevronUp, Heart, Share2, Layers, Sparkles, ExternalLink } from 'lucide-react'
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
    project: 'EXTNDD++SHELTER',
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
    project: 'EXTNDD++SHELTER',
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
    project: 'EXTNDD++SHELTER',
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
    project: 'EXTNDD++SHELTER',
    image: '/images/338-2.jpeg',
    images: ['/images/338-2.jpeg', '/images/326-1.jpeg', '/images/340-2.jpeg'],
    description: 'Кожаная куртка с капюшоном оверсайз кроя. Deadstock в идеальном состоянии.',
    material: 'Натуральная кожа',
  },
]

/* ─── Product Detail Modal ─── */
function ProductDetailModal({ product, onClose }: { product: typeof products[0]; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />
      <div className="absolute inset-0 overflow-y-auto overscroll-contain" style={{ height: '100dvh' }}>
        <div className="min-h-full">
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-[110] p-3 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="flex flex-col lg:grid lg:grid-cols-2">
            <div className="relative aspect-[4/5] lg:h-screen lg:sticky lg:top-0">
              <Image src={product.images[imgIdx] || "/placeholder.svg"} alt={product.name} fill className="object-cover object-center transition-opacity duration-300" />
              {product.images.length > 1 && (
                <>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {product.images.map((_, idx) => (
                      <button key={idx} onClick={() => setImgIdx(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === imgIdx ? 'bg-white w-6' : 'bg-white/30 w-1.5'}`} aria-label={`Image ${idx + 1}`} />
                    ))}
                  </div>
                  <button onClick={() => setImgIdx(p => (p === 0 ? product.images.length - 1 : p - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-md" aria-label="Previous">
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <button onClick={() => setImgIdx(p => (p === product.images.length - 1 ? 0 : p + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-md" aria-label="Next">
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </>
              )}
            </div>
            <div className="bg-black p-6 lg:p-10 animate-fade-in-up text-white">
              <div className="flex flex-col gap-4">
                <div>
                  <Badge variant="secondary" className="mb-3 text-[9px] tracking-wider bg-white/10 border-0 text-white">{product.condition}</Badge>
                  <h2 className="text-2xl lg:text-3xl font-light leading-tight">{product.name}</h2>
                </div>
                <div className="flex items-baseline gap-3">
                  {product.originalPrice && <p className="text-base text-white/40 line-through">{product.originalPrice}</p>}
                  <p className="text-3xl lg:text-4xl font-light">{product.price}</p>
                </div>
                <div className="space-y-4 border-t border-white/10 pt-4">
                  <div>
                    <h3 className="text-[10px] tracking-wider text-white/40 mb-1">ОПИСАНИЕ</h3>
                    <p className="text-sm leading-relaxed text-white/80">{product.description}</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <h3 className="text-[10px] tracking-wider text-white/40 mb-1">СОСТОЯНИЕ</h3>
                      <p className="text-sm">{product.condition}</p>
                    </div>
                    <div>
                      <h3 className="text-[10px] tracking-wider text-white/40 mb-1">РАЗМЕР</h3>
                      <p className="text-sm">{product.size}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <button className="w-full py-3.5 text-xs tracking-[0.15em] bg-white text-black hover:bg-white/90 transition-colors">СВЯЗАТЬСЯ В TELEGRAM</button>
                  <button className="w-full py-3.5 text-xs tracking-[0.15em] border border-white/20 text-white hover:bg-white/5 transition-colors">ЗАДАТЬ ВОПРОС</button>
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
function FeedCard({ product, isActive, onOpenDetail }: { product: typeof products[0]; isActive: boolean; onOpenDetail: () => void }) {
  const [liked, setLiked] = useState(false)
  const [imageIdx, setImageIdx] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="relative w-full h-full snap-start snap-always flex items-center justify-center bg-black">
      {/* Desktop: centered 4:5 card / Mobile: full screen */}
      <div className="relative w-full h-full md:w-auto md:h-[calc(100dvh-2rem)] md:aspect-[4/5] md:mx-auto overflow-hidden">
        {/* Image */}
        <Image
          src={product.images[imageIdx] || product.image}
          alt={product.name}
          fill
          className="object-cover object-center transition-opacity duration-500"
          priority={isActive}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

        {/* Image progress bars */}
        {product.images.length > 1 && (
          <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
            {product.images.map((_, idx) => (
              <div key={idx} className="flex-1 h-[2px] rounded-full overflow-hidden bg-white/20">
                <div className={`h-full rounded-full transition-all duration-300 ${idx <= imageIdx ? 'bg-white w-full' : 'w-0'}`} />
              </div>
            ))}
          </div>
        )}

        {/* Tap zones for image cycling */}
        {product.images.length > 1 && (
          <>
            <div className="absolute top-0 left-0 w-1/3 h-2/3 z-10" onClick={() => setImageIdx(p => (p === 0 ? product.images.length - 1 : p - 1))} />
            <div className="absolute top-0 right-0 w-1/3 h-2/3 z-10" onClick={() => setImageIdx(p => (p === product.images.length - 1 ? 0 : p + 1))} />
          </>
        )}

        {/* Project name - top left */}
        <div className="absolute top-10 left-4 z-20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/10 backdrop-blur-md flex items-center justify-center">
              <span className="text-[7px] font-bold text-white">E</span>
            </div>
            <span className="text-[10px] tracking-wider text-white/70 font-light">{product.project}</span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="absolute right-3 bottom-52 md:bottom-56 flex flex-col items-center gap-4 z-20">
          <button onClick={(e) => { e.stopPropagation(); setLiked(!liked) }} className="flex flex-col items-center gap-1 transition-transform active:scale-90">
            <div className={`p-2.5 bg-black/20 backdrop-blur-md border border-white/10 transition-all ${liked ? 'bg-red-500/20 border-red-400/30' : ''}`}>
              <Heart className={`h-5 w-5 transition-all ${liked ? 'fill-red-400 text-red-400 scale-110' : 'text-white'}`} />
            </div>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onOpenDetail() }} className="flex flex-col items-center gap-1 transition-transform active:scale-90">
            <div className="p-2.5 bg-black/20 backdrop-blur-md border border-white/10">
              <ExternalLink className="h-5 w-5 text-white" />
            </div>
          </button>
          <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1 transition-transform active:scale-90">
            <div className="p-2.5 bg-black/20 backdrop-blur-md border border-white/10">
              <Share2 className="h-5 w-5 text-white" />
            </div>
          </button>
        </div>

        {/* Bottom info panel */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6">
          <Badge variant="secondary" className="mb-2 text-[8px] tracking-wider bg-white/10 backdrop-blur-md border-0 text-white">
            {product.condition}
          </Badge>
          <h2 className="text-lg font-light text-white leading-tight mb-1">{product.name}</h2>
          <div className="flex items-baseline gap-2 mb-2">
            {product.originalPrice && <span className="text-xs text-white/40 line-through">{product.originalPrice}</span>}
            <span className="text-xl font-light text-white">{product.price}</span>
          </div>

          {/* Expandable description */}
          <button onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo) }} className="text-white/50 text-[10px] tracking-wider flex items-center gap-1 mb-3">
            {showInfo ? 'СКРЫТЬ' : 'ПОДРОБНЕЕ'}
            <ChevronUp className={`h-3 w-3 transition-transform duration-300 ${showInfo ? 'rotate-0' : 'rotate-180'}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-400 ease-out ${showInfo ? 'max-h-48 opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-4">
              <p className="text-sm text-white/70 leading-relaxed mb-3">{product.description}</p>
              <div className="flex gap-6 text-[10px] text-white/40 tracking-wider">
                <span>Размер: {product.size}</span>
                <span>{product.material}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button onClick={(e) => { e.stopPropagation(); onOpenDetail() }} className="w-full py-3 text-[10px] tracking-[0.2em] text-white border border-white/15 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
            НАПИСАТЬ О ПОКУПКЕ
          </button>
        </div>
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
    setActiveIndex(Math.round(scrollTop / h))
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div className="h-[100dvh] bg-black text-white overflow-hidden relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 h-12 pointer-events-auto">
          <Link href="/" className="text-white/70 hover:text-white transition-colors">
            <span className="text-[11px] font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase">extndd</span>
          </Link>

          {/* Mode switcher */}
          <div className="flex items-center gap-px bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="px-3 py-1.5 text-[9px] tracking-wider text-white bg-white/10">
              ЛЕНТА
            </div>
            <Link href="/catalog" className="px-3 py-1.5 text-[9px] tracking-wider text-white/40 hover:text-white/70 transition-colors">
              КАТАЛОГ
            </Link>
            <Link href="/tinder" className="px-3 py-1.5 text-[9px] tracking-wider text-white/40 hover:text-white/70 transition-colors">
              <Sparkles className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Progress - left side (desktop only) */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-2">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => containerRef.current?.scrollTo({ top: idx * (containerRef.current?.clientHeight ?? 0), behavior: 'smooth' })}
            className={`w-[3px] rounded-full transition-all duration-500 ${idx === activeIndex ? 'h-8 bg-white' : 'h-2 bg-white/20 hover:bg-white/40'}`}
            aria-label={`Go to item ${idx + 1}`}
          />
        ))}
      </div>

      {/* Feed */}
      <div ref={containerRef} className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {products.map((product, idx) => (
          <div key={product.id} className="h-[100dvh] w-full">
            <FeedCard product={product} isActive={idx === activeIndex} onOpenDetail={() => setSelectedProduct(product)} />
          </div>
        ))}
      </div>

      {/* Counter - bottom center */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="px-3 py-1 bg-black/30 backdrop-blur-xl border border-white/10">
          <span className="text-[9px] text-white/40 tracking-wider font-mono">{activeIndex + 1} / {products.length}</span>
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  )
}
