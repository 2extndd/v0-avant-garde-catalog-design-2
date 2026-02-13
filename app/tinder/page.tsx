'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { X, Heart, ChevronLeft, ChevronRight, RotateCcw, ExternalLink, Sparkles, Layers } from 'lucide-react'
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

/* ─── Detail Modal ─── */
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
          <button onClick={onClose} className="fixed top-4 right-4 z-[110] p-3 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors" aria-label="Close">
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="flex flex-col lg:grid lg:grid-cols-2">
            <div className="relative aspect-[4/5] lg:h-screen lg:sticky lg:top-0">
              <Image src={product.images[imgIdx] || "/placeholder.svg"} alt={product.name} fill className="object-cover object-center" />
              {product.images.length > 1 && (
                <>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {product.images.map((_, idx) => (
                      <button key={idx} onClick={() => setImgIdx(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === imgIdx ? 'bg-white w-6' : 'bg-white/30 w-1.5'}`} aria-label={`Image ${idx + 1}`} />
                    ))}
                  </div>
                  <button onClick={() => setImgIdx(p => (p === 0 ? product.images.length - 1 : p - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-md" aria-label="Previous"><ChevronLeft className="h-5 w-5 text-white" /></button>
                  <button onClick={() => setImgIdx(p => (p === product.images.length - 1 ? 0 : p + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 backdrop-blur-md" aria-label="Next"><ChevronRight className="h-5 w-5 text-white" /></button>
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
                    <div><h3 className="text-[10px] tracking-wider text-white/40 mb-1">СОСТОЯНИЕ</h3><p className="text-sm">{product.condition}</p></div>
                    <div><h3 className="text-[10px] tracking-wider text-white/40 mb-1">РАЗМЕР</h3><p className="text-sm">{product.size}</p></div>
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

/* ─── Swipeable Card ─── */
function SwipeCard({ product, isTop, onSwipe, onOpenDetail }: {
  product: typeof products[0]
  isTop: boolean
  onSwipe: (direction: 'left' | 'right') => void
  onOpenDetail: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [imageIdx, setImageIdx] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)
  const [showOverlay, setShowOverlay] = useState<'like' | 'nope' | null>(null)

  const rotation = offset.x * 0.05
  const swipeProgress = Math.min(Math.abs(offset.x) / 120, 1)

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!isTop) return
    setIsDragging(true)
    setStartPos({ x: clientX, y: clientY })
  }, [isTop])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return
    const dx = clientX - startPos.x
    const dy = clientY - startPos.y
    setOffset({ x: dx, y: dy * 0.2 })
    if (dx > 50) setShowOverlay('like')
    else if (dx < -50) setShowOverlay('nope')
    else setShowOverlay(null)
  }, [isDragging, startPos])

  const handleEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    setShowOverlay(null)
    if (offset.x > 100) {
      setExitDirection('right')
      setTimeout(() => onSwipe('right'), 350)
    } else if (offset.x < -100) {
      setExitDirection('left')
      setTimeout(() => onSwipe('left'), 350)
    } else {
      setOffset({ x: 0, y: 0 })
    }
  }, [isDragging, offset.x, onSwipe])

  const swipeOut = useCallback((direction: 'left' | 'right') => {
    setExitDirection(direction)
    setShowOverlay(direction === 'right' ? 'like' : 'nope')
    setTimeout(() => onSwipe(direction), 350)
  }, [onSwipe])

  useEffect(() => {
    if (!cardRef.current) return
    const el = cardRef.current as HTMLDivElement & { swipeOut?: typeof swipeOut }
    el.swipeOut = swipeOut
  }, [swipeOut])

  const exitTransform = exitDirection === 'left'
    ? 'translate(-120vw, 60px) rotate(-25deg)'
    : exitDirection === 'right'
    ? 'translate(120vw, 60px) rotate(25deg)'
    : undefined

  return (
    <div
      ref={cardRef}
      data-swipe-card={isTop ? 'top' : 'stack'}
      className="absolute select-none"
      style={{
        /* Mobile: full width minus padding, centered. Desktop: fixed 400x500 centered */
        left: '50%',
        top: '50%',
        width: 'min(calc(100vw - 2rem), 400px)',
        aspectRatio: '4/5',
        transform: exitDirection
          ? exitTransform
          : `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) ${!isTop ? 'scale(0.95)' : ''}`,
        transition: isDragging ? 'none' : 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: exitDirection ? 0 : 1,
        zIndex: isTop ? 10 : 5,
        marginTop: isTop ? 0 : '12px',
        filter: isTop ? 'none' : 'brightness(0.6)',
        cursor: isTop ? 'grab' : 'default',
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={() => { if (isDragging) handleEnd() }}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <div className="relative w-full h-full overflow-hidden border border-white/10 bg-black">
        <Image src={product.images[imageIdx] || product.image} alt={product.name} fill className="object-cover object-center pointer-events-none" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

        {/* Image progress */}
        {product.images.length > 1 && (
          <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
            {product.images.map((_, idx) => (
              <div key={idx} className="flex-1 h-[2px] rounded-full overflow-hidden bg-white/20">
                <div className={`h-full rounded-full transition-all duration-300 ${idx <= imageIdx ? 'bg-white w-full' : 'w-0'}`} />
              </div>
            ))}
          </div>
        )}

        {/* Tap zones */}
        {product.images.length > 1 && isTop && (
          <>
            <div className="absolute top-0 left-0 w-1/3 h-1/2 z-10" onClick={(e) => { e.stopPropagation(); setImageIdx(p => (p === 0 ? product.images.length - 1 : p - 1)) }} />
            <div className="absolute top-0 right-0 w-1/3 h-1/2 z-10" onClick={(e) => { e.stopPropagation(); setImageIdx(p => (p === product.images.length - 1 ? 0 : p + 1)) }} />
          </>
        )}

        {/* Swipe overlays with gradient border effect */}
        {showOverlay === 'like' && (
          <div className="absolute inset-0 z-30 pointer-events-none" style={{ opacity: swipeProgress }}>
            <div className="absolute inset-0 border-2 border-green-400/40" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="px-6 py-3 border-2 border-green-400 rotate-[-12deg]">
                <span className="text-3xl font-bold text-green-400 tracking-wider">WANT</span>
              </div>
            </div>
          </div>
        )}
        {showOverlay === 'nope' && (
          <div className="absolute inset-0 z-30 pointer-events-none" style={{ opacity: swipeProgress }}>
            <div className="absolute inset-0 border-2 border-red-400/40" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="px-6 py-3 border-2 border-red-400 rotate-[12deg]">
                <span className="text-3xl font-bold text-red-400 tracking-wider">SKIP</span>
              </div>
            </div>
          </div>
        )}

        {/* Product info */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-[7px] tracking-wider bg-white/10 backdrop-blur-md border-0 text-white">
              {product.condition}
            </Badge>
            <span className="text-[8px] text-white/30 tracking-wider">{product.project}</span>
          </div>
          <h2 className="text-base font-light text-white leading-tight mb-1">{product.name}</h2>
          <div className="flex items-baseline gap-2 mb-2">
            {product.originalPrice && <span className="text-[10px] text-white/30 line-through">{product.originalPrice}</span>}
            <span className="text-lg font-light text-white">{product.price}</span>
          </div>
          <div className="flex items-center gap-3 text-[9px] text-white/35 tracking-wider">
            <span>{product.size}</span>
            <span className="w-px h-2.5 bg-white/15" />
            <span>{product.material}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Tinder Page ─── */
export default function TinderPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [liked, setLiked] = useState<number[]>([])
  const [skipped, setSkipped] = useState<number[]>([])
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [isFinished, setIsFinished] = useState(false)

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const product = products[currentIndex]
    if (direction === 'right') setLiked(prev => [...prev, product.id])
    else setSkipped(prev => [...prev, product.id])
    if (currentIndex >= products.length - 1) setIsFinished(true)
    else setCurrentIndex(prev => prev + 1)
  }, [currentIndex])

  const handleUndo = useCallback(() => {
    if (currentIndex === 0 && !isFinished) return
    if (isFinished) {
      setIsFinished(false)
      const last = products[products.length - 1]
      setLiked(p => p.filter(id => id !== last.id))
      setSkipped(p => p.filter(id => id !== last.id))
    } else {
      const prev = products[currentIndex - 1]
      setLiked(p => p.filter(id => id !== prev.id))
      setSkipped(p => p.filter(id => id !== prev.id))
      setCurrentIndex(p => p - 1)
    }
  }, [currentIndex, isFinished])

  const handleReset = () => {
    setCurrentIndex(0)
    setLiked([])
    setSkipped([])
    setIsFinished(false)
  }

  const triggerSwipe = (direction: 'left' | 'right') => {
    const topCard = document.querySelector('[data-swipe-card="top"]') as HTMLDivElement & { swipeOut?: (d: 'left' | 'right') => void }
    topCard?.swipeOut?.(direction)
  }

  return (
    <div className="h-[100dvh] bg-black text-white overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-black to-neutral-950" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 h-12 pointer-events-auto">
          <Link href="/" className="text-white/70 hover:text-white transition-colors">
            <span className="text-[11px] font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase">extndd</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-white/20 tracking-wider font-mono">{liked.length} SAVED</span>
            <div className="flex items-center gap-px bg-white/5 backdrop-blur-xl border border-white/10">
              <Link href="/feed" className="px-3 py-1.5 text-[9px] tracking-wider text-white/40 hover:text-white/70 transition-colors">
                ЛЕНТА
              </Link>
              <Link href="/catalog" className="px-3 py-1.5 text-[9px] tracking-wider text-white/40 hover:text-white/70 transition-colors">
                КАТАЛОГ
              </Link>
              <div className="px-3 py-1.5 text-[9px] tracking-wider text-white bg-white/10">
                <Sparkles className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Card Stack Area */}
      <div className="absolute inset-0">
        {!isFinished ? (
          <>
            {currentIndex + 1 < products.length && (
              <SwipeCard key={`stack-${products[currentIndex + 1].id}`} product={products[currentIndex + 1]} isTop={false} onSwipe={() => {}} onOpenDetail={() => {}} />
            )}
            <SwipeCard key={`top-${products[currentIndex].id}`} product={products[currentIndex]} isTop={true} onSwipe={handleSwipe} onOpenDetail={() => setSelectedProduct(products[currentIndex])} />
          </>
        ) : (
          /* Finished state */
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 animate-fade-in-up">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 max-w-sm w-full text-center">
              <p className="text-4xl font-light mb-2 font-[family-name:var(--font-copperplate)] tracking-[0.2em]">FIN</p>
              <p className="text-[10px] text-white/30 tracking-wider mb-6">
                {`${liked.length} SAVED / ${skipped.length} SKIPPED`}
              </p>

              {liked.length > 0 && (
                <div className="mb-6">
                  <p className="text-[9px] tracking-wider text-white/20 mb-3">СОХРАНЕННЫЕ</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {liked.map(id => {
                      const p = products.find(pr => pr.id === id)
                      if (!p) return null
                      return (
                        <div key={p.id} className="relative aspect-[4/5] overflow-hidden border border-white/10 cursor-pointer group" onClick={() => setSelectedProduct(p)}>
                          <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <p className="text-[8px] text-white/70 leading-tight truncate">{p.name}</p>
                            <p className="text-[11px] text-white font-light">{p.price}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <button onClick={handleReset} className="w-full py-3 text-[10px] tracking-[0.2em] border border-white/15 bg-white/5 hover:bg-white/10 transition-all text-white">НАЧАТЬ ЗАНОВО</button>
                <Link href="/catalog" className="w-full py-3 text-[10px] tracking-[0.2em] border border-white/15 bg-white/5 hover:bg-white/10 transition-all text-white text-center block">КАТАЛОГ</Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {!isFinished && (
        <div className="fixed bottom-0 left-0 right-0 z-30" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)' }}>
          <div className="flex items-center justify-center gap-4 px-4">
            {/* Undo */}
            <button onClick={handleUndo} disabled={currentIndex === 0} className="p-2.5 border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all hover:bg-white/10 disabled:opacity-15 disabled:cursor-not-allowed">
              <RotateCcw className="h-4 w-4 text-white/50" />
            </button>

            {/* Skip */}
            <button onClick={() => triggerSwipe('left')} className="p-4 border border-red-400/20 bg-red-500/[0.05] backdrop-blur-xl transition-all hover:bg-red-500/10 hover:border-red-400/40 active:scale-90">
              <X className="h-6 w-6 text-red-400" />
            </button>

            {/* Detail */}
            <button onClick={() => setSelectedProduct(products[currentIndex])} className="p-2.5 border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all hover:bg-white/10">
              <ExternalLink className="h-4 w-4 text-white/50" />
            </button>

            {/* Want */}
            <button onClick={() => triggerSwipe('right')} className="p-4 border border-green-400/20 bg-green-500/[0.05] backdrop-blur-xl transition-all hover:bg-green-500/10 hover:border-green-400/40 active:scale-90">
              <Heart className="h-6 w-6 text-green-400" />
            </button>

            {/* Counter */}
            <div className="p-2.5 border border-white/10 bg-white/[0.03] backdrop-blur-xl">
              <span className="text-[9px] text-white/30 tracking-wider font-mono">{currentIndex + 1}/{products.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  )
}
