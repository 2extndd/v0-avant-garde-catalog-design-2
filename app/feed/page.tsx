'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ChevronUp, Heart, Share2, Layers, Sparkles, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const products = [
  {
    id: 1, name: 'MULTI-POCKET CARGO PANTS', price: '68 000 RUB',
    originalPrice: '85 000 RUB', condition: 'DEADSTOCK', size: 'M-L',
    image: '/images/340-2.jpeg', images: ['/images/340-2.jpeg', '/images/326-1.jpeg'],
    description: 'Карго с множеством карманов и ремнями в стиле милитари-авангарда. Уникальный экземпляр в идеальном состоянии.',
    material: 'Хлопок, нейлон', project: 'extndd++shelter', category: 'Низ',
  },
  {
    id: 2, name: 'SHEARLING JACKET BEIGE', price: '180 000 RUB',
    condition: 'GRAIL', size: 'S-M',
    image: '/images/337-2.jpeg', images: ['/images/337-2.jpeg', '/images/340-2.jpeg'],
    description: 'Дубленка из натуральной овчины бежевого оттенка. Архивная вещь из коллекции начала 2000-х.',
    material: 'Натуральная овчина', project: 'extndd++shelter', category: 'Верх',
  },
  {
    id: 3, name: 'LEATHER SHEARLING BOMBER', price: '245 000 RUB',
    condition: '~9/10', size: 'M',
    image: '/images/326-1.jpeg', images: ['/images/326-1.jpeg', '/images/338-2.jpeg'],
    description: 'Кожаная дубленка-бомбер с овчиной. Культовая модель из архивной коллекции.',
    material: 'Натуральная кожа, овчина', project: 'save my life', category: 'Верх',
  },
  {
    id: 4, name: 'HOODED LEATHER JACKET', price: '195 000 RUB',
    originalPrice: '235 000 RUB', condition: '~9/10', size: 'L',
    image: '/images/338-2.jpeg', images: ['/images/338-2.jpeg', '/images/326-1.jpeg', '/images/340-2.jpeg'],
    description: 'Кожаная куртка с капюшоном оверсайз кроя. Deadstock в идеальном состоянии.',
    material: 'Натуральная кожа', project: 'extndd++shelter', category: 'Верх',
  },
]

/* ── Detail Modal ── */
function DetailModal({ product, onClose }: { product: typeof products[0]; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0)
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = '' } }, [])

  return (
    <div className="fixed inset-0 z-[100]" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 overflow-y-auto overscroll-contain" style={{ height: '100dvh' }}>
        <button onClick={onClose} className="fixed top-4 right-4 z-[110] p-3 backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" aria-label="Close">
          <X className="h-5 w-5 text-white" />
        </button>
        <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-full">
          {/* Image */}
          <div className="relative aspect-[4/5] lg:h-screen lg:sticky lg:top-0 flex-shrink-0">
            <Image src={product.images[imgIdx]} alt={product.name} fill className="object-cover transition-opacity duration-300" />
            {product.images.length > 1 && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-5' : 'bg-white/30 w-1.5'}`} />
                  ))}
                </div>
                <button onClick={() => setImgIdx(p => (p === 0 ? product.images.length - 1 : p - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-md border border-white/10" aria-label="Previous">
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                <button onClick={() => setImgIdx(p => (p === product.images.length - 1 ? 0 : p + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-md border border-white/10" aria-label="Next">
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              </>
            )}
          </div>
          {/* Info */}
          <div className="p-6 lg:p-10 bg-black text-white">
            <span className="inline-block px-2 py-0.5 border border-white/20 text-[9px] tracking-wider text-white/60 mb-3">{product.condition}</span>
            <h2 className="text-2xl lg:text-3xl font-light leading-tight mb-2">{product.name}</h2>
            <div className="flex items-baseline gap-2 mb-5">
              {product.originalPrice && <span className="text-sm text-white/40 line-through">{product.originalPrice}</span>}
              <span className="text-2xl font-light">{product.price}</span>
            </div>
            <div className="border-t border-white/10 pt-4 space-y-4">
              <div>
                <span className="text-[9px] tracking-wider text-white/40 block mb-1">ОПИСАНИЕ</span>
                <p className="text-sm leading-relaxed text-white/70">{product.description}</p>
              </div>
              <div className="flex gap-8">
                <div>
                  <span className="text-[9px] tracking-wider text-white/40 block mb-0.5">СОСТОЯНИЕ</span>
                  <span className="text-sm">{product.condition}</span>
                </div>
                <div>
                  <span className="text-[9px] tracking-wider text-white/40 block mb-0.5">РАЗМЕР</span>
                  <span className="text-sm">{product.size}</span>
                </div>
                <div>
                  <span className="text-[9px] tracking-wider text-white/40 block mb-0.5">КАТЕГОРИЯ</span>
                  <span className="text-sm">{product.category}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-6">
              <button className="w-full py-3.5 bg-white text-black text-xs tracking-[0.15em] hover:bg-white/90 transition-colors">НАПИСАТЬ О ПОКУПКЕ</button>
              <button className="w-full py-3.5 border border-white/20 text-xs tracking-[0.15em] hover:bg-white/5 transition-colors">ЗАДАТЬ ВОПРОС</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Feed Card ── */
function FeedCard({ product, isActive, onDetail }: { product: typeof products[0]; isActive: boolean; onDetail: () => void }) {
  const [liked, setLiked] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {/* Desktop: 4:5 centered card / Mobile: full bleed */}
      <div className="relative w-full h-full md:w-auto md:h-[calc(100dvh-3rem)] md:aspect-[4/5] overflow-hidden">
        <Image
          src={product.images[photoIdx] || product.image}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-500"
          priority={isActive}
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

        {/* Progress bars */}
        {product.images.length > 1 && (
          <div className="absolute top-2 left-3 right-3 flex gap-1 z-20">
            {product.images.map((_, i) => (
              <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden bg-white/15">
                <div className={`h-full rounded-full transition-all duration-300 ${i <= photoIdx ? 'bg-white/80 w-full' : 'w-0'}`} />
              </div>
            ))}
          </div>
        )}

        {/* Tap zones */}
        {product.images.length > 1 && (
          <>
            <button className="absolute top-0 left-0 w-1/3 h-3/5 z-10" onClick={() => setPhotoIdx(p => Math.max(0, p - 1))} aria-label="Previous photo" />
            <button className="absolute top-0 right-0 w-1/3 h-3/5 z-10" onClick={() => setPhotoIdx(p => Math.min(product.images.length - 1, p + 1))} aria-label="Next photo" />
          </>
        )}

        {/* Project name */}
        <div className="absolute top-7 left-3 z-20 flex items-center gap-2">
          <div className="w-5 h-5 bg-white/10 backdrop-blur-md flex items-center justify-center text-[7px] font-bold text-white/80">E</div>
          <span className="text-[9px] tracking-wider text-white/50 uppercase">{product.project}</span>
        </div>

        {/* Side actions */}
        <div className="absolute right-3 bottom-48 md:bottom-52 flex flex-col items-center gap-3 z-20">
          <button onClick={(e) => { e.stopPropagation(); setLiked(!liked) }} className="group transition-transform active:scale-90">
            <div className={`p-2.5 backdrop-blur-xl border transition-all ${liked ? 'bg-white/15 border-white/25' : 'bg-black/20 border-white/10'}`}>
              <Heart className={`h-5 w-5 transition-all duration-300 ${liked ? 'fill-white text-white' : 'text-white/80'}`} />
            </div>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDetail() }} className="transition-transform active:scale-90">
            <div className="p-2.5 bg-black/20 backdrop-blur-xl border border-white/10">
              <ExternalLink className="h-5 w-5 text-white/80" />
            </div>
          </button>
          <button className="transition-transform active:scale-90">
            <div className="p-2.5 bg-black/20 backdrop-blur-xl border border-white/10">
              <Share2 className="h-5 w-5 text-white/80" />
            </div>
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-14 z-20 p-4 pb-5">
          <span className="inline-block px-1.5 py-0.5 border border-white/20 text-[8px] tracking-wider text-white/60 mb-2">{product.condition}</span>
          <h2 className="text-base md:text-lg font-light text-white leading-tight mb-0.5">{product.name}</h2>
          <div className="flex items-baseline gap-2 mb-2">
            {product.originalPrice && <span className="text-[10px] text-white/40 line-through">{product.originalPrice}</span>}
            <span className="text-lg text-white">{product.price}</span>
          </div>

          {/* Expand toggle */}
          <button onClick={() => setInfoOpen(!infoOpen)} className="text-[9px] tracking-wider text-white/40 flex items-center gap-1 mb-2 hover:text-white/60 transition-colors">
            {infoOpen ? 'СКРЫТЬ' : 'ПОДРОБНЕЕ'}
            <ChevronUp className={`h-3 w-3 transition-transform duration-300 ${infoOpen ? '' : 'rotate-180'}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-400 ease-out ${infoOpen ? 'max-h-40 opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-3">
              <p className="text-xs text-white/60 leading-relaxed mb-2">{product.description}</p>
              <div className="flex gap-4 text-[9px] text-white/40 tracking-wider">
                <span>Размер: {product.size}</span>
                <span>{product.material}</span>
              </div>
            </div>
          </div>

          <button onClick={onDetail} className="w-full py-2.5 text-[9px] tracking-[0.2em] text-white border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all">
            НАПИСАТЬ О ПОКУПКЕ
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main ── */
export default function FeedPage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [detail, setDetail] = useState<typeof products[0] | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const onScroll = useCallback(() => {
    if (!scrollRef.current) return
    const idx = Math.round(scrollRef.current.scrollTop / scrollRef.current.clientHeight)
    setActiveIdx(idx)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <div className="h-[100dvh] bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 h-12 pointer-events-auto">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">
            <span className="text-[10px] font-[family-name:var(--font-copperplate)] tracking-[0.15em]">EXTNDD++SHELTER</span>
          </Link>
          <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="px-3 py-1.5 text-[9px] tracking-wider text-white bg-white/10">ЛЕНТА</div>
            <Link href="/catalog" className="px-3 py-1.5 text-[9px] tracking-wider text-white/40 hover:text-white/60 transition-colors">КАТАЛОГ</Link>
            <Link href="/tinder" className="px-2.5 py-1.5 text-white/40 hover:text-white/60 transition-colors">
              <Sparkles className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop progress dots */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-1.5">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollRef.current?.scrollTo({ top: i * (scrollRef.current?.clientHeight ?? 0), behavior: 'smooth' })}
            className={`w-[3px] rounded-full transition-all duration-500 ${i === activeIdx ? 'h-6 bg-white' : 'h-1.5 bg-white/20 hover:bg-white/40'}`}
            aria-label={`Go to ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll container */}
      <div ref={scrollRef} className="h-full overflow-y-auto snap-y snap-mandatory" style={{ scrollbarWidth: 'none' }}>
        {products.map((p, i) => (
          <div key={p.id} className="h-[100dvh] w-full snap-start snap-always">
            <FeedCard product={p} isActive={i === activeIdx} onDetail={() => setDetail(p)} />
          </div>
        ))}
      </div>

      {/* Counter */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="px-2.5 py-1 bg-black/30 backdrop-blur-xl border border-white/10">
          <span className="text-[9px] text-white/40 tracking-wider tabular-nums">{activeIdx + 1} / {products.length}</span>
        </div>
      </div>

      {detail && <DetailModal product={detail} onClose={() => setDetail(null)} />}
    </div>
  )
}
