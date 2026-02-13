'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { X, Heart, ChevronLeft, ChevronRight, RotateCcw, MessageCircle, ExternalLink } from 'lucide-react'
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

/* ─── Swipeable Card Component ─── */
function SwipeCard({
  product,
  isTop,
  onSwipe,
  onOpenDetail,
}: {
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

  const rotation = offset.x * 0.06
  const opacity = Math.max(0, 1 - Math.abs(offset.x) / 600)

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!isTop) return
    setIsDragging(true)
    setStartPos({ x: clientX, y: clientY })
  }, [isTop])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return
    const dx = clientX - startPos.x
    const dy = clientY - startPos.y
    setOffset({ x: dx, y: dy * 0.3 })

    if (dx > 60) setShowOverlay('like')
    else if (dx < -60) setShowOverlay('nope')
    else setShowOverlay(null)
  }, [isDragging, startPos])

  const handleEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    setShowOverlay(null)

    const threshold = 120
    if (offset.x > threshold) {
      setExitDirection('right')
      setTimeout(() => onSwipe('right'), 300)
    } else if (offset.x < -threshold) {
      setExitDirection('left')
      setTimeout(() => onSwipe('left'), 300)
    } else {
      setOffset({ x: 0, y: 0 })
    }
  }, [isDragging, offset.x, onSwipe])

  // Programmatic swipe
  const swipeOut = useCallback((direction: 'left' | 'right') => {
    setExitDirection(direction)
    setTimeout(() => onSwipe(direction), 300)
  }, [onSwipe])

  // Expose swipeOut via ref-like pattern
  useEffect(() => {
    if (!cardRef.current) return
    const el = cardRef.current as HTMLDivElement & { swipeOut?: typeof swipeOut }
    el.swipeOut = swipeOut
  }, [swipeOut])

  const exitTransform = exitDirection === 'left'
    ? 'translate(-150vw, 100px) rotate(-30deg)'
    : exitDirection === 'right'
    ? 'translate(150vw, 100px) rotate(30deg)'
    : undefined

  return (
    <div
      ref={cardRef}
      data-swipe-card={isTop ? 'top' : 'stack'}
      className="absolute inset-4 md:inset-x-auto md:w-[420px] md:h-[600px] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 cursor-grab active:cursor-grabbing select-none"
      style={{
        transform: exitDirection
          ? exitTransform
          : `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        opacity: exitDirection ? 0 : 1,
        zIndex: isTop ? 10 : 5,
        top: isTop ? undefined : 'calc(50% + 8px)',
        scale: isTop ? undefined : '0.95',
        filter: isTop ? 'none' : 'brightness(0.7)',
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
        {/* Image */}
        <Image
          src={product.images[imageIdx] || product.image}
          alt={product.name}
          fill
          className="object-cover object-center pointer-events-none"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />

        {/* Image progress bar */}
        {product.images.length > 1 && (
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
            {product.images.map((_, idx) => (
              <div key={idx} className="flex-1 h-[2px] rounded-full overflow-hidden bg-white/20">
                <div className={`h-full rounded-full transition-all duration-300 ${idx <= imageIdx ? 'bg-white w-full' : 'w-0'}`} />
              </div>
            ))}
          </div>
        )}

        {/* Tap zones for image cycling */}
        {product.images.length > 1 && isTop && (
          <>
            <div
              className="absolute top-0 left-0 w-1/3 h-1/2 z-10"
              onClick={(e) => { e.stopPropagation(); setImageIdx(p => (p === 0 ? product.images.length - 1 : p - 1)) }}
            />
            <div
              className="absolute top-0 right-0 w-1/3 h-1/2 z-10"
              onClick={(e) => { e.stopPropagation(); setImageIdx(p => (p === product.images.length - 1 ? 0 : p + 1)) }}
            />
          </>
        )}

        {/* Swipe indicators */}
        {showOverlay === 'like' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-scale-in">
            <div className="px-8 py-4 border-[3px] border-green-400 rounded-lg rotate-[-20deg]">
              <span className="text-4xl font-bold text-green-400 tracking-wider">WANT</span>
            </div>
          </div>
        )}
        {showOverlay === 'nope' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-scale-in">
            <div className="px-8 py-4 border-[3px] border-red-400 rounded-lg rotate-[20deg]">
              <span className="text-4xl font-bold text-red-400 tracking-wider">SKIP</span>
            </div>
          </div>
        )}

        {/* Product info */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
          <Badge variant="secondary" className="mb-2 text-[8px] tracking-wider bg-white/10 backdrop-blur-md border-0 text-white">
            {product.condition}
          </Badge>

          <h2 className="text-xl font-light text-white leading-tight mb-1">{product.name}</h2>

          <div className="flex items-baseline gap-2 mb-3">
            {product.originalPrice && (
              <span className="text-xs text-white/40 line-through">{product.originalPrice}</span>
            )}
            <span className="text-2xl font-light text-white">{product.price}</span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-white/50 tracking-wider">
            <span>РАЗМЕР: {product.size}</span>
            <span className="w-px h-3 bg-white/20" />
            <span>{product.material}</span>
          </div>

          {/* Quick detail button */}
          <button
            onClick={(e) => { e.stopPropagation(); onOpenDetail() }}
            className="mt-3 flex items-center gap-1.5 text-[10px] text-white/50 tracking-wider hover:text-white/80 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            ПОДРОБНЕЕ
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Product Detail Modal ─── */
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
                className="object-cover object-center"
              />
              {product.images.length > 1 && (
                <>
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

/* ─── Main Tinder Page ─── */
export default function TinderPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [liked, setLiked] = useState<number[]>([])
  const [skipped, setSkipped] = useState<number[]>([])
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [isFinished, setIsFinished] = useState(false)

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const product = products[currentIndex]
    if (direction === 'right') {
      setLiked(prev => [...prev, product.id])
    } else {
      setSkipped(prev => [...prev, product.id])
    }

    if (currentIndex >= products.length - 1) {
      setIsFinished(true)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex])

  const handleUndo = useCallback(() => {
    if (currentIndex === 0 && !isFinished) return
    if (isFinished) {
      setIsFinished(false)
      const lastProduct = products[products.length - 1]
      setLiked(prev => prev.filter(id => id !== lastProduct.id))
      setSkipped(prev => prev.filter(id => id !== lastProduct.id))
    } else {
      const prevProduct = products[currentIndex - 1]
      setLiked(prev => prev.filter(id => id !== prevProduct.id))
      setSkipped(prev => prev.filter(id => id !== prevProduct.id))
      setCurrentIndex(prev => prev - 1)
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
    if (topCard?.swipeOut) {
      topCard.swipeOut(direction)
    }
  }

  return (
    <div className="h-[100dvh] bg-black text-white overflow-hidden relative">
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-neutral-900" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-5 h-14 pointer-events-auto">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">
            <span className="text-xs font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase">
              extndd
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/30 tracking-wider">
              {liked.length} SAVED
            </span>
            <div className="flex items-center gap-1">
              <Link
                href="/feed"
                className="px-3 py-1.5 text-[10px] tracking-wider text-white/60 hover:text-white border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:bg-white/10"
              >
                ЛЕНТА
              </Link>
              <Link
                href="/catalog"
                className="px-3 py-1.5 text-[10px] tracking-wider text-white/60 hover:text-white border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:bg-white/10"
              >
                КАТАЛОГ
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Card Stack */}
      <div className="absolute inset-0">
        {!isFinished ? (
          <>
            {/* Next card (underneath) */}
            {currentIndex + 1 < products.length && (
              <SwipeCard
                key={products[currentIndex + 1].id}
                product={products[currentIndex + 1]}
                isTop={false}
                onSwipe={() => {}}
                onOpenDetail={() => {}}
              />
            )}
            {/* Current card (on top) */}
            <SwipeCard
              key={products[currentIndex].id}
              product={products[currentIndex]}
              isTop={true}
              onSwipe={handleSwipe}
              onOpenDetail={() => setSelectedProduct(products[currentIndex])}
            />
          </>
        ) : (
          /* Finished state */
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 animate-fade-in-up">
            <div className="glass border border-white/10 p-8 max-w-sm w-full text-center">
              <p className="text-5xl font-light mb-4 font-[family-name:var(--font-copperplate)] tracking-wider">FIN</p>
              <p className="text-sm text-white/50 mb-6 leading-relaxed">
                {'Вы просмотрели все вещи.'}<br />
                {`Сохранено: ${liked.length} из ${products.length}`}
              </p>

              {liked.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] tracking-wider text-white/30 mb-3">СОХРАНЕННЫЕ</p>
                  <div className="grid grid-cols-2 gap-2">
                    {liked.map(id => {
                      const p = products.find(pr => pr.id === id)
                      if (!p) return null
                      return (
                        <div
                          key={p.id}
                          className="relative aspect-[4/5] overflow-hidden border border-white/10 cursor-pointer hover-lift"
                          onClick={() => setSelectedProduct(p)}
                        >
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <p className="text-[9px] text-white/80 leading-tight">{p.name}</p>
                            <p className="text-xs text-white font-light">{p.price}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleReset}
                  className="w-full py-3 text-xs tracking-[0.15em] border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/15 transition-all text-white"
                >
                  НАЧАТЬ ЗАНОВО
                </button>
                <Link
                  href="/catalog"
                  className="w-full py-3 text-xs tracking-[0.15em] border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/15 transition-all text-white text-center block"
                >
                  ПЕРЕЙТИ В КАТАЛОГ
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {!isFinished && (
        <div className="fixed bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-6" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={currentIndex === 0}
            className="p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-4 w-4 text-white/60" />
          </button>

          {/* Skip (left swipe) */}
          <button
            onClick={() => triggerSwipe('left')}
            className="p-5 rounded-full border-2 border-red-400/30 bg-red-500/5 backdrop-blur-xl transition-all hover:bg-red-500/15 hover:border-red-400/50 active:scale-90"
          >
            <X className="h-7 w-7 text-red-400" />
          </button>

          {/* Telegram */}
          <button
            onClick={() => setSelectedProduct(products[currentIndex])}
            className="p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4 text-white/60" />
          </button>

          {/* Want (right swipe) */}
          <button
            onClick={() => triggerSwipe('right')}
            className="p-5 rounded-full border-2 border-green-400/30 bg-green-500/5 backdrop-blur-xl transition-all hover:bg-green-500/15 hover:border-green-400/50 active:scale-90"
          >
            <Heart className="h-7 w-7 text-green-400" />
          </button>

          {/* Counter */}
          <div className="p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
            <span className="text-[10px] text-white/40 tracking-wider font-mono">
              {currentIndex + 1}/{products.length}
            </span>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  )
}
