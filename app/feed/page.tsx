'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Heart, Share2, Search, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const products = [
  {
    id: 1, name: 'MULTI-POCKET CARGO PANTS', price: '68 000 RUB',
    originalPrice: '85 000 RUB', condition: '~9/10', size: 'M-L',
    image: '/images/340-2.jpeg', images: ['/images/340-2.jpeg', '/images/326-1.jpeg'],
    description: 'Карго с множеством карманов и ремнями в стиле милитари-авангарда.',
    material: 'Хлопок, нейлон', project: 'extndd++shelter', category: 'Низ',
  },
  {
    id: 2, name: 'SHEARLING JACKET BEIGE', price: '180 000 RUB',
    condition: '~9/10', size: 'S-M',
    image: '/images/337-2.jpeg', images: ['/images/337-2.jpeg', '/images/340-2.jpeg'],
    description: 'Дубленка из натуральной овчины бежевого оттенка.',
    material: 'Натуральная овчина', project: 'extndd++shelter', category: 'Верх',
  },
  {
    id: 3, name: 'LEATHER SHEARLING BOMBER', price: '245 000 RUB',
    condition: '~9/10', size: 'M',
    image: '/images/326-1.jpeg', images: ['/images/326-1.jpeg', '/images/338-2.jpeg'],
    description: 'Кожаная дубленка-бомбер с овчиной из архивной коллекции.',
    material: 'Натуральная кожа, овчина', project: 'save my life', category: 'Верх',
  },
  {
    id: 4, name: 'HOODED LEATHER JACKET', price: '195 000 RUB',
    originalPrice: '235 000 RUB', condition: '~9/10', size: 'L',
    image: '/images/338-2.jpeg', images: ['/images/338-2.jpeg', '/images/326-1.jpeg', '/images/340-2.jpeg'],
    description: 'Кожаная куртка с капюшоном оверсайз кроя.',
    material: 'Натуральная кожа', project: 'extndd++shelter', category: 'Верх',
  },
  {
    id: 5, name: 'DISTRESSED COMBAT BOOTS', price: '52 000 RUB',
    condition: 'USED', size: '43',
    image: '/images/340-2.jpeg', images: ['/images/340-2.jpeg'],
    description: 'Боевые ботинки с естественными следами износа.',
    material: 'Натуральная кожа', project: 'extndd++shelter', category: 'Обувь',
  },
  {
    id: 6, name: 'ARCHIVE WOOL OVERCOAT', price: '320 000 RUB',
    originalPrice: '380 000 RUB', condition: '~9/10', size: 'L-XL',
    image: '/images/337-2.jpeg', images: ['/images/337-2.jpeg', '/images/326-1.jpeg'],
    description: 'Архивное шерстяное пальто оверсайз.',
    material: 'Шерсть 100%', project: 'save my life', category: 'Верх',
  },
  {
    id: 7, name: 'SHADOW MASK COAT', price: '175 000 RUB',
    condition: '~9/10', size: 'L',
    image: '/images/338-2.jpeg', images: ['/images/338-2.jpeg'],
    description: 'Темное пальто-маска с высоким воротником.',
    material: 'Шерсть, хлопок', project: 'save my life', category: 'Верх',
  },
  {
    id: 8, name: 'ALPHA INDUSTRIES MA-1', price: '8 900 RUB',
    originalPrice: '12 000 RUB', condition: 'USED', size: 'XL',
    image: '/images/326-1.jpeg', images: ['/images/326-1.jpeg'],
    description: 'Классический бомбер MA-1 в отличном состоянии.',
    material: 'Нейлон', project: 'extndd++shelter', category: 'Верх',
  },
]

type CardSize = 'lg' | 'md' | 'sm'

/*
 * Grid system: 6 columns, rows are a fixed base unit (60px).
 * Large card  = 2 cols, 4 base rows
 * Medium card = 1 col,  4 base rows
 * Small card  = 1 col,  2 base rows
 *
 * Pattern traced from the screenshot (each block = 8 base rows):
 * Block A:
 *   Large  @ col 1, row 1, span 2x4
 *   Med    @ col 3, row 1, span 1x4
 *   Small  @ col 4, row 1, span 1x2
 *   Small  @ col 5, row 1, span 1x2
 *   Small  @ col 6, row 1, span 1x2
 *   Small  @ col 4, row 3, span 1x2
 *   Small  @ col 5, row 3, span 1x2
 *   Small  @ col 6, row 3, span 1x2
 *   Small  @ col 1, row 5, span 1x2
 *   Small  @ col 2, row 5, span 1x2
 *   Small  @ col 3, row 5, span 1x2
 *   Med    @ col 4, row 5, span 1x4
 *   Large  @ col 5, row 5, span 2x4
 *   Small  @ col 1, row 7, span 1x2
 *   Small  @ col 2, row 7, span 1x2
 *   Small  @ col 3, row 7, span 1x2
 *
 * Block B:
 *   Med    @ col 1, row 1, span 1x4
 *   Small  @ col 2, row 1, span 1x2
 *   Small  @ col 3, row 1, span 1x2
 *   Large  @ col 4, row 1, span 2x4
 *   Small  @ col 6, row 1, span 1x2
 *   Small  @ col 2, row 3, span 1x2
 *   Small  @ col 3, row 3, span 1x2
 *   Small  @ col 6, row 3, span 1x2
 *   Small  @ col 1, row 5, span 1x2
 *   Small  @ col 2, row 5, span 1x2
 *   Small  @ col 3, row 5, span 1x2
 *   Small  @ col 4, row 5, span 1x2
 *   Med    @ col 5, row 5, span 1x4
 *   Small  @ col 6, row 5, span 1x2
 *   Small  @ col 1, row 7, span 1x2
 *   Small  @ col 2, row 7, span 1x2
 *   Small  @ col 3, row 7, span 1x2
 *   Small  @ col 4, row 7, span 1x2
 *   Small  @ col 6, row 7, span 1x2
 */

interface Slot {
  size: CardSize
  col: number
  span: number
  row: number
  rspan: number
}

const BLOCK_A: Slot[] = [
  { size: 'lg', col: 1, span: 2, row: 1, rspan: 4 },
  { size: 'md', col: 3, span: 1, row: 1, rspan: 4 },
  { size: 'sm', col: 4, span: 1, row: 1, rspan: 2 },
  { size: 'sm', col: 5, span: 1, row: 1, rspan: 2 },
  { size: 'sm', col: 6, span: 1, row: 1, rspan: 2 },
  { size: 'sm', col: 4, span: 1, row: 3, rspan: 2 },
  { size: 'sm', col: 5, span: 1, row: 3, rspan: 2 },
  { size: 'sm', col: 6, span: 1, row: 3, rspan: 2 },
  { size: 'sm', col: 1, span: 1, row: 5, rspan: 2 },
  { size: 'sm', col: 2, span: 1, row: 5, rspan: 2 },
  { size: 'sm', col: 3, span: 1, row: 5, rspan: 2 },
  { size: 'md', col: 4, span: 1, row: 5, rspan: 4 },
  { size: 'lg', col: 5, span: 2, row: 5, rspan: 4 },
  { size: 'sm', col: 1, span: 1, row: 7, rspan: 2 },
  { size: 'sm', col: 2, span: 1, row: 7, rspan: 2 },
  { size: 'sm', col: 3, span: 1, row: 7, rspan: 2 },
]

const BLOCK_B: Slot[] = [
  { size: 'md', col: 1, span: 1, row: 1, rspan: 4 },
  { size: 'sm', col: 2, span: 1, row: 1, rspan: 2 },
  { size: 'sm', col: 3, span: 1, row: 1, rspan: 2 },
  { size: 'lg', col: 4, span: 2, row: 1, rspan: 4 },
  { size: 'sm', col: 6, span: 1, row: 1, rspan: 2 },
  { size: 'sm', col: 2, span: 1, row: 3, rspan: 2 },
  { size: 'sm', col: 3, span: 1, row: 3, rspan: 2 },
  { size: 'sm', col: 6, span: 1, row: 3, rspan: 2 },
  { size: 'sm', col: 1, span: 1, row: 5, rspan: 2 },
  { size: 'sm', col: 2, span: 1, row: 5, rspan: 2 },
  { size: 'sm', col: 3, span: 1, row: 5, rspan: 2 },
  { size: 'sm', col: 4, span: 1, row: 5, rspan: 2 },
  { size: 'md', col: 5, span: 1, row: 5, rspan: 4 },
  { size: 'sm', col: 6, span: 1, row: 5, rspan: 2 },
  { size: 'sm', col: 1, span: 1, row: 7, rspan: 2 },
  { size: 'sm', col: 2, span: 1, row: 7, rspan: 2 },
  { size: 'sm', col: 3, span: 1, row: 7, rspan: 2 },
  { size: 'sm', col: 4, span: 1, row: 7, rspan: 2 },
  { size: 'sm', col: 6, span: 1, row: 7, rspan: 2 },
]

const BLOCK_ROWS = 8
const BLOCKS = [BLOCK_A, BLOCK_B]

/* -- Detail Modal -- */
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
          <div className="relative aspect-[4/5] lg:h-screen lg:sticky lg:top-0 flex-shrink-0">
            <Image src={product.images[imgIdx]} alt={product.name} fill className="object-cover" />
            {product.images.length > 1 && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-5' : 'bg-white/30 w-1.5'}`} />
                  ))}
                </div>
                <button onClick={() => setImgIdx(p => (p === 0 ? product.images.length - 1 : p - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-md border border-white/10" aria-label="Prev">
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                <button onClick={() => setImgIdx(p => (p === product.images.length - 1 ? 0 : p + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-md border border-white/10" aria-label="Next">
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
            <div className="pt-6">
              <button className="w-full py-3.5 bg-white text-black text-xs tracking-[0.15em] hover:bg-white/90 transition-colors">НАПИСАТЬ О ПОКУПКЕ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -- Feed Card -- */
function FeedCard({ product, size, onDetail, delay }: {
  product: typeof products[0]; size: CardSize; onDetail: () => void; delay: number
}) {
  const [liked, setLiked] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.05 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isLarge = size === 'lg'

  return (
    <div
      ref={ref}
      className="group cursor-pointer h-full flex flex-col"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {/* Photo */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-950 flex-1 min-h-0" onClick={onDetail}>
        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" sizes={isLarge ? '33vw' : '17vw'} />

        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex gap-1">
          <span className="px-1.5 py-0.5 text-[7px] tracking-wider text-white/90 bg-black/60 backdrop-blur-sm border border-white/10">{product.condition}</span>
          {product.originalPrice && (
            <span className="px-1.5 py-0.5 text-[7px] tracking-wider text-white/90 bg-black/60 backdrop-blur-sm border border-white/10">SALE</span>
          )}
        </div>

        {/* Hover actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button onClick={(e) => { e.stopPropagation(); setLiked(!liked) }} className={`p-1.5 backdrop-blur-xl border transition-colors ${liked ? 'bg-white/20 border-white/30' : 'bg-black/40 border-white/10 hover:bg-white/10'}`}>
            <Heart className={`h-3 w-3 ${liked ? 'fill-white text-white' : 'text-white/80'}`} />
          </button>
          <button onClick={(e) => e.stopPropagation()} className="p-1.5 bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors">
            <Share2 className="h-3 w-3 text-white/80" />
          </button>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
      </div>

      {/* Info below */}
      <div className="pt-2 pb-1 flex-shrink-0" onClick={onDetail}>
        {isLarge && (
          <p className="text-[8px] tracking-[0.15em] text-white/25 mb-1 font-[family-name:var(--font-copperplate)]">
            {'[CREATED BY EXTNDD]'}
          </p>
        )}
        {isLarge && (
          <p className="text-[7px] tracking-wider text-white/20 uppercase mb-0.5">{product.project}</p>
        )}
        <h3 className={`tracking-wider text-white/80 leading-tight mb-0.5 group-hover:text-white transition-colors line-clamp-1 ${isLarge ? 'text-[11px]' : 'text-[8px]'}`}>
          {!isLarge && <span className="text-white/20 mr-1">{product.project}</span>}
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5">
          {product.originalPrice && <span className={`text-white/25 line-through ${isLarge ? 'text-[9px]' : 'text-[7px]'}`}>{product.originalPrice}</span>}
          <span className={`text-white font-light ${isLarge ? 'text-sm' : 'text-[10px]'}`}>{product.price}</span>
        </div>
      </div>
    </div>
  )
}

/* -- Main Page -- */
export default function FeedPage() {
  const [detail, setDetail] = useState<typeof products[0] | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [batchCount, setBatchCount] = useState(2)
  const loaderRef = useRef<HTMLDivElement>(null)

  const filtered = searchQuery
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.project.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products

  // Build desktop grid items from alternating blocks
  const gridItems = useCallback(() => {
    const items: { product: typeof products[0]; size: CardSize; col: number; span: number; row: number; rspan: number; idx: number }[] = []
    let productIdx = 0
    for (let b = 0; b < batchCount; b++) {
      const block = BLOCKS[b % BLOCKS.length]
      const rowOffset = b * BLOCK_ROWS
      for (const slot of block) {
        items.push({
          product: filtered[productIdx % filtered.length],
          size: slot.size,
          col: slot.col,
          span: slot.span,
          row: slot.row + rowOffset,
          rspan: slot.rspan,
          idx: productIdx,
        })
        productIdx++
      }
    }
    return items
  }, [batchCount, filtered])

  // Infinite scroll
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setBatchCount(p => p + 1)
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const items = gridItems()
  const totalRows = batchCount * BLOCK_ROWS

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/[0.06]" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-3 md:px-6 h-11 md:h-12">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">
            <span className="text-[9px] md:text-[11px] font-[family-name:var(--font-copperplate)] tracking-[0.15em]">EXTNDD</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-1.5 hover:bg-white/5 transition-colors rounded">
              <Search className={`h-3.5 w-3.5 transition-colors ${searchOpen ? 'text-white' : 'text-white/40'}`} />
            </button>
            <nav className="flex items-center bg-white/[0.04] border border-white/[0.08]">
              <span className="px-3 py-1.5 text-[9px] tracking-[0.12em] text-white bg-white/10">ЛЕНТА</span>
              <Link href="/catalog" className="px-3 py-1.5 text-[9px] tracking-[0.12em] text-white/30 hover:text-white/60 transition-colors">КАТАЛОГ</Link>
              <Link href="/tinder" className="px-2.5 py-1.5 text-white/30 hover:text-white/60 transition-colors border-l border-white/[0.06]">
                <Sparkles className="h-3 w-3" />
              </Link>
            </nav>
          </div>
        </div>
        {/* Search expand */}
        <div className={`overflow-hidden transition-all duration-300 ease-out ${searchOpen ? 'max-h-11 opacity-100 border-t border-white/[0.06]' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-2.5">
            <input
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              className="w-full bg-transparent text-xs text-white placeholder:text-white/20 focus:outline-none"
              autoFocus={searchOpen}
            />
          </div>
        </div>
      </header>

      <main className="transition-[padding] duration-300" style={{ paddingTop: searchOpen ? '5.75rem' : '3.5rem' }}>
        {/* Desktop: 6-column grid with fixed base row height */}
        <div className="hidden md:block max-w-[1400px] mx-auto px-4 py-4">
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: `repeat(${totalRows}, 60px)`,
            }}
          >
            {items.map((item, i) => (
              <div
                key={`${item.idx}-${item.row}-${item.col}`}
                style={{
                  gridColumn: `${item.col} / span ${item.span}`,
                  gridRow: `${item.row} / span ${item.rspan}`,
                }}
              >
                <FeedCard
                  product={item.product}
                  size={item.size}
                  onDetail={() => setDetail(item.product)}
                  delay={(i % 16) * 30}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: 2-column grid with mixed sizes */}
        <div className="md:hidden px-1.5 py-2">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridAutoRows: '80px',
              gridAutoFlow: 'dense',
            }}
          >
            {filtered.concat(filtered).concat(filtered).slice(0, batchCount * 8).map((p, i) => {
              // Every 5th card is large (spans 2 cols)
              const isLarge = i % 7 === 0
              // Every 3rd card is medium (spans 2 rows)
              const isMed = !isLarge && i % 3 === 0
              const size: CardSize = isLarge ? 'lg' : isMed ? 'md' : 'sm'
              return (
                <div
                  key={`m-${i}`}
                  style={{
                    gridColumn: isLarge ? 'span 2' : 'span 1',
                    gridRow: (isLarge || isMed) ? 'span 4' : 'span 2',
                  }}
                >
                  <FeedCard
                    product={p}
                    size={size}
                    onDetail={() => setDetail(p)}
                    delay={(i % 8) * 40}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Infinite scroll trigger */}
        <div ref={loaderRef} className="h-16 flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white/10 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1 h-1 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </main>

      {detail && <DetailModal product={detail} onClose={() => setDetail(null)} />}
    </div>
  )
}
