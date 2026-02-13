'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { X, Heart, RotateCcw, ChevronLeft, ChevronRight, ChevronUp, Sparkles, Info, Layers, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const products = [
  {
    id: 1, name: 'MULTI-POCKET CARGO PANTS', price: '68 000 RUB',
    originalPrice: '85 000 RUB', condition: 'DEADSTOCK', size: 'M-L',
    image: '/images/340-2.jpeg', images: ['/images/340-2.jpeg', '/images/326-1.jpeg'],
    description: 'Карго с множеством карманов и ремнями в стиле милитари-авангарда.',
    material: 'Хлопок, нейлон', project: 'extndd++shelter', category: 'Низ',
  },
  {
    id: 2, name: 'SHEARLING JACKET BEIGE', price: '180 000 RUB',
    condition: 'GRAIL', size: 'S-M',
    image: '/images/337-2.jpeg', images: ['/images/337-2.jpeg', '/images/340-2.jpeg'],
    description: 'Дубленка из натуральной овчины. Архивная вещь из коллекции начала 2000-х.',
    material: 'Натуральная овчина', project: 'extndd++shelter', category: 'Верх',
  },
  {
    id: 3, name: 'LEATHER SHEARLING BOMBER', price: '245 000 RUB',
    condition: '~9/10', size: 'M',
    image: '/images/326-1.jpeg', images: ['/images/326-1.jpeg', '/images/338-2.jpeg'],
    description: 'Кожаная дубленка-бомбер с овчиной. Культовая модель.',
    material: 'Натуральная кожа, овчина', project: 'save my life', category: 'Верх',
  },
  {
    id: 4, name: 'HOODED LEATHER JACKET', price: '195 000 RUB',
    originalPrice: '235 000 RUB', condition: '~9/10', size: 'L',
    image: '/images/338-2.jpeg', images: ['/images/338-2.jpeg', '/images/326-1.jpeg', '/images/340-2.jpeg'],
    description: 'Кожаная куртка с капюшоном оверсайз кроя.',
    material: 'Натуральная кожа', project: 'extndd++shelter', category: 'Верх',
  },
]

/* ── Detail Modal ── */
function DetailModal({ product, onClose }: { product: typeof products[0]; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0)
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = '' } }, [])

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 overflow-y-auto overscroll-contain" style={{ height: '100dvh' }}>
        <button onClick={onClose} className="fixed top-4 right-4 z-[110] p-3 backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" aria-label="Close">
          <X className="h-5 w-5 text-white" />
        </button>
        <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-full">
          <div className="relative aspect-[4/5] lg:h-screen lg:sticky lg:top-0 flex-shrink-0">
            <Image src={product.images[imgIdx]} alt={product.name} fill className="object-cover" />
            {product.images.length > 1 && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-5' : 'bg-white/30 w-1.5'}`} />
                  ))}
                </div>
                <button onClick={() => setImgIdx(p => (p === 0 ? product.images.length - 1 : p - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-md border border-white/10">
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                <button onClick={() => setImgIdx(p => (p === product.images.length - 1 ? 0 : p + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-md border border-white/10">
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              </>
            )}
          </div>
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
                <div><span className="text-[9px] tracking-wider text-white/40 block mb-0.5">РАЗМЕР</span><span className="text-sm">{product.size}</span></div>
                <div><span className="text-[9px] tracking-wider text-white/40 block mb-0.5">КАТЕГОРИЯ</span><span className="text-sm">{product.category}</span></div>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-6">
              <button className="w-full py-3.5 bg-white text-black text-xs tracking-[0.15em] hover:bg-white/90 transition-colors">НАПИСАТЬ О ПОКУПКЕ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Swipe Card (image only, no info overlay) ── */
function SwipeCard({ product, isTop, stackOffset, onSwipe }: {
  product: typeof products[0]; isTop: boolean; stackOffset: number
  onSwipe: (dir: 'left' | 'right') => void
}) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null)
  const startRef = useRef({ x: 0, y: 0, time: 0 })
  const elRef = useRef<HTMLDivElement>(null)

  const rotation = drag.x * 0.06
  const progress = Math.min(Math.abs(drag.x) / 100, 1)

  const beginDrag = useCallback((cx: number, cy: number) => {
    if (!isTop) return
    setDragging(true)
    startRef.current = { x: cx, y: cy, time: Date.now() }
  }, [isTop])

  const moveDrag = useCallback((cx: number, cy: number) => {
    if (!dragging) return
    setDrag({ x: cx - startRef.current.x, y: (cy - startRef.current.y) * 0.2 })
  }, [dragging])

  const endDrag = useCallback(() => {
    if (!dragging) return
    setDragging(false)
    const vel = Math.abs(drag.x) / Math.max(Date.now() - startRef.current.time, 1)
    if (Math.abs(drag.x) > 80 || vel > 0.5) {
      const dir = drag.x > 0 ? 'right' as const : 'left' as const
      setExiting(dir)
      setTimeout(() => onSwipe(dir), 300)
    } else {
      setDrag({ x: 0, y: 0 })
    }
  }, [dragging, drag.x, onSwipe])

  const triggerSwipe = useCallback((dir: 'left' | 'right') => {
    setDrag({ x: dir === 'right' ? 120 : -120, y: 0 })
    setExiting(dir)
    setTimeout(() => onSwipe(dir), 300)
  }, [onSwipe])

  useEffect(() => {
    const el = elRef.current as HTMLDivElement & { triggerSwipe?: typeof triggerSwipe }
    if (el) el.triggerSwipe = triggerSwipe
  }, [triggerSwipe])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY)
    const onTouchMove = (e: TouchEvent) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)
    const end = () => endDrag()
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', end)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', end)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onMove)
      window.removeEventListener('mouseup', end)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', end)
    }
  }, [dragging, moveDrag, endDrag])

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (Math.abs(drag.x) > 5 || !isTop) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX
    const rx = (clientX - rect.left) / rect.width
    if (rx < 0.35) setPhotoIdx(p => Math.max(0, p - 1))
    else if (rx > 0.65) setPhotoIdx(p => Math.min(product.images.length - 1, p + 1))
  }

  const exitX = exiting === 'right' ? 'calc(50vw + 200px)' : exiting === 'left' ? 'calc(-50vw - 200px)' : '0px'
  const exitRot = exiting === 'right' ? 15 : exiting === 'left' ? -15 : 0
  const scale = isTop ? 1 : Math.max(0.93, 1 - stackOffset * 0.035)
  const yOff = isTop ? 0 : stackOffset * 6

  return (
    <div
      ref={elRef}
      data-card={isTop ? 'top' : 'bg'}
      className="absolute select-none touch-none"
      style={{
        width: 'min(calc(100vw - 2rem), 360px)',
        aspectRatio: '4/5',
        left: '50%',
        top: '48%',
        transform: exiting
          ? `translate(calc(-50% + ${exitX}), calc(-50% + ${yOff}px)) rotate(${exitRot}deg) scale(${scale})`
          : `translate(calc(-50% + ${drag.x}px), calc(-50% + ${drag.y + yOff}px)) rotate(${rotation}deg) scale(${scale})`,
        transition: dragging ? 'none' : 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
        opacity: exiting ? 0 : stackOffset > 2 ? 0 : 1 - stackOffset * 0.15,
        zIndex: 10 - stackOffset,
        filter: isTop ? 'none' : `brightness(${Math.max(0.6, 1 - stackOffset * 0.15)})`,
        cursor: isTop ? 'grab' : 'default',
      }}
      onMouseDown={(e) => { e.preventDefault(); beginDrag(e.clientX, e.clientY) }}
      onTouchStart={(e) => beginDrag(e.touches[0].clientX, e.touches[0].clientY)}
    >
      <div className="relative w-full h-full overflow-hidden border border-white/10 bg-neutral-950" onClick={handleTap}>
        <Image src={product.images[photoIdx] || product.image} alt={product.name} fill className="object-cover pointer-events-none" draggable={false} priority={isTop} />

        {/* Photo progress bars */}
        {product.images.length > 1 && (
          <div className="absolute top-2 left-2.5 right-2.5 flex gap-1 z-10 pointer-events-none">
            {product.images.map((_, i) => (
              <div key={i} className="flex-1 h-[2px] rounded-full bg-white/15 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-200 ${i <= photoIdx ? 'bg-white/70 w-full' : 'w-0'}`} />
              </div>
            ))}
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-6 left-2.5 z-10 pointer-events-none">
          <span className="px-1.5 py-0.5 text-[7px] tracking-wider text-white/80 bg-black/50 backdrop-blur-md border border-white/10">{product.condition}</span>
        </div>

        {/* Swipe overlays */}
        {isTop && progress > 0.15 && (
          <>
            {drag.x > 0 && (
              <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center" style={{ opacity: progress }}>
                <div className="absolute inset-0 border-2 border-emerald-400/30" />
                <div className="px-5 py-2 border-2 border-emerald-400/60 -rotate-12">
                  <span className="text-2xl font-light tracking-[0.2em] text-emerald-400">WANT</span>
                </div>
              </div>
            )}
            {drag.x < 0 && (
              <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center" style={{ opacity: progress }}>
                <div className="absolute inset-0 border-2 border-red-400/30" />
                <div className="px-5 py-2 border-2 border-red-400/60 rotate-12">
                  <span className="text-2xl font-light tracking-[0.2em] text-red-400">SKIP</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ── Main ── */
export default function TinderPage() {
  const [idx, setIdx] = useState(0)
  const [liked, setLiked] = useState<typeof products[0][]>([])
  const [done, setDone] = useState(false)
  const [detail, setDetail] = useState<typeof products[0] | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const canUndo = idx > 0
  const current = products[idx]

  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    if (dir === 'right') setLiked(prev => [...prev, products[idx]])
    setInfoOpen(false)
    if (idx >= products.length - 1) {
      setTimeout(() => setDone(true), 350)
    } else {
      setIdx(prev => prev + 1)
    }
  }, [idx])

  const undo = () => {
    if (!canUndo && !done) return
    if (done) {
      setDone(false)
      setLiked(prev => prev.filter(p => p.id !== products[products.length - 1].id))
      return
    }
    const prev = products[idx - 1]
    setLiked(l => l.filter(p => p.id !== prev.id))
    setIdx(i => i - 1)
  }

  const restart = () => { setIdx(0); setLiked([]); setDone(false); setInfoOpen(false) }

  const triggerSwipe = (dir: 'left' | 'right') => {
    const el = document.querySelector('[data-card="top"]') as HTMLDivElement & { triggerSwipe?: (d: string) => void }
    el?.triggerSwipe?.(dir)
  }

  const visibleCards = done ? [] : products.slice(idx, Math.min(idx + 3, products.length)).reverse()

  return (
    <div className="h-[100dvh] bg-black text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 z-50 relative backdrop-blur-xl bg-black/80 border-b border-white/5" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 h-12">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">
            <span className="text-[10px] font-[family-name:var(--font-copperplate)] tracking-[0.15em]">EXTNDD++SHELTER</span>
          </Link>
          <div className="flex items-center bg-white/5 border border-white/10">
            <Link href="/feed" className="px-3 py-1.5 text-[9px] tracking-wider text-white/40 hover:text-white/60 transition-colors">ЛЕНТА</Link>
            <Link href="/catalog" className="px-3 py-1.5 text-[9px] tracking-wider text-white/40 hover:text-white/60 transition-colors">КАТАЛОГ</Link>
            <div className="px-2.5 py-1.5 bg-white/10 text-white"><Sparkles className="h-3 w-3" /></div>
          </div>
        </div>
      </header>

      {/* Card area */}
      <div className="flex-1 relative overflow-hidden">
        {done ? (
          <div className="absolute inset-0 flex items-center justify-center px-5 animate-fade-in">
            <div className="w-full max-w-sm text-center">
              <p className="text-3xl font-light tracking-[0.2em] mb-1 font-[family-name:var(--font-copperplate)]">FIN</p>
              <p className="text-[10px] text-white/30 tracking-wider mb-6">{liked.length} {'сохранено'}</p>
              {liked.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 mb-6">
                  {liked.map(p => (
                    <div key={p.id} className="relative aspect-[4/5] overflow-hidden border border-white/10 cursor-pointer group" onClick={() => setDetail(p)}>
                      <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[8px] text-white/70 truncate">{p.name}</p>
                        <p className="text-[11px] text-white">{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <button onClick={restart} className="py-3 text-[10px] tracking-[0.2em] border border-white/15 hover:bg-white/5 transition-colors">НАЧАТЬ ЗАНОВО</button>
                <Link href="/catalog" className="py-3 text-[10px] tracking-[0.2em] bg-white text-black text-center hover:bg-white/90 transition-colors block">КАТАЛОГ</Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Counter */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
              <span className="text-[9px] text-white/20 tracking-wider tabular-nums">{idx + 1} / {products.length}</span>
            </div>

            {/* Saved badge */}
            {liked.length > 0 && (
              <div className="absolute top-3 right-4 z-30">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 backdrop-blur-xl border border-white/10">
                  <Heart className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                  <span className="text-[9px] text-white/50 tabular-nums">{liked.length}</span>
                </div>
              </div>
            )}

            {/* Card stack */}
            {visibleCards.map((product) => {
              const offset = product.id === products[idx].id ? 0 : product.id === products[idx + 1]?.id ? 1 : 2
              return (
                <SwipeCard key={product.id} product={product} isTop={offset === 0} stackOffset={offset} onSwipe={handleSwipe} />
              )
            })}
          </>
        )}
      </div>

      {/* ── Info panel BELOW card ── */}
      {!done && current && (
        <div className="flex-shrink-0 z-40 bg-black border-t border-white/5">
          {/* Product info */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[8px] tracking-wider text-white/25 uppercase">{current.project}</span>
                </div>
                <h3 className="text-sm font-light text-white leading-tight truncate">{current.name}</h3>
                <div className="flex items-baseline gap-2 mt-0.5">
                  {current.originalPrice && <span className="text-[10px] text-white/25 line-through">{current.originalPrice}</span>}
                  <span className="text-base text-white font-light">{current.price}</span>
                </div>
              </div>
              <span className="flex-shrink-0 px-1.5 py-0.5 text-[7px] tracking-wider text-white/50 border border-white/10 mt-0.5">{current.condition}</span>
            </div>

            {/* Expandable details */}
            <button onClick={() => setInfoOpen(!infoOpen)} className="text-[9px] tracking-wider text-white/30 flex items-center gap-1 mt-2 hover:text-white/50 transition-colors">
              {infoOpen ? 'СКРЫТЬ' : 'ПОДРОБНЕЕ'}
              <ChevronUp className={`h-3 w-3 transition-transform duration-300 ${infoOpen ? '' : 'rotate-180'}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-out ${infoOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <div className="border border-white/5 p-3 bg-white/[0.02]">
                <p className="text-xs text-white/50 leading-relaxed mb-2">{current.description}</p>
                <div className="flex gap-4 text-[9px] text-white/30 tracking-wider">
                  <span>{'Размер: '}{current.size}</span>
                  <span>{current.material}</span>
                  <span>{current.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="px-4 pb-4 pt-2" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}>
            <div className="flex items-center justify-center gap-3">
              <button onClick={undo} disabled={!canUndo} className="p-2.5 border border-white/8 disabled:opacity-15 hover:bg-white/5 transition-all active:scale-90">
                <RotateCcw className="h-4 w-4 text-white/40" />
              </button>
              <button onClick={() => triggerSwipe('left')} className="p-4 border border-red-400/15 hover:bg-red-500/10 hover:border-red-400/30 transition-all active:scale-90">
                <X className="h-6 w-6 text-red-400" />
              </button>
              <button onClick={() => triggerSwipe('right')} className="p-4 border border-emerald-400/15 hover:bg-emerald-500/10 hover:border-emerald-400/30 transition-all active:scale-90">
                <Heart className="h-6 w-6 text-emerald-400" />
              </button>
              <button onClick={() => setDetail(current)} className="p-2.5 border border-white/8 hover:bg-white/5 transition-all active:scale-90">
                <Info className="h-4 w-4 text-white/40" />
              </button>
            </div>
          </div>
        </div>
      )}

      {detail && <DetailModal product={detail} onClose={() => setDetail(null)} />}
    </div>
  )
}
