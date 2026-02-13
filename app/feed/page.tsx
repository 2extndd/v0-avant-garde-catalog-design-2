'use client'

import { useState, useRef, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Heart, Share2, Search, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const products = [
  {
    id: 1, name: 'MULTI-POCKET CARGO PANTS', price: '68 000 RUB',
    originalPrice: '85 000 RUB', condition: 'DEADSTOCK', size: 'M-L',
    image: '/images/340-2.jpeg', images: ['/images/340-2.jpeg', '/images/326-1.jpeg'],
    description: 'Карго с множеством карманов и ремнями в стиле милитари-авангарда.',
    material: 'Хлопок, нейлон', project: 'extndd++shelter', category: 'Низ',
    featured: true,
  },
  {
    id: 2, name: 'SHEARLING JACKET BEIGE', price: '180 000 RUB',
    condition: 'GRAIL', size: 'S-M',
    image: '/images/337-2.jpeg', images: ['/images/337-2.jpeg', '/images/340-2.jpeg'],
    description: 'Дубленка из натуральной овчины бежевого оттенка.',
    material: 'Натуральная овчина', project: 'extndd++shelter', category: 'Верх',
    featured: false,
  },
  {
    id: 3, name: 'LEATHER SHEARLING BOMBER', price: '245 000 RUB',
    condition: '~9/10', size: 'M',
    image: '/images/326-1.jpeg', images: ['/images/326-1.jpeg', '/images/338-2.jpeg'],
    description: 'Кожаная дубленка-бомбер с овчиной из архивной коллекции.',
    material: 'Натуральная кожа, овчина', project: 'save my life', category: 'Верх',
    featured: false,
  },
  {
    id: 4, name: 'HOODED LEATHER JACKET', price: '195 000 RUB',
    originalPrice: '235 000 RUB', condition: '~9/10', size: 'L',
    image: '/images/338-2.jpeg', images: ['/images/338-2.jpeg', '/images/326-1.jpeg', '/images/340-2.jpeg'],
    description: 'Кожаная куртка с капюшоном оверсайз кроя.',
    material: 'Натуральная кожа', project: 'extndd++shelter', category: 'Верх',
    featured: true,
  },
  {
    id: 5, name: 'DISTRESSED COMBAT BOOTS', price: '52 000 RUB',
    condition: 'USED', size: '43',
    image: '/images/340-2.jpeg', images: ['/images/340-2.jpeg'],
    description: 'Боевые ботинки с естественными следами износа.',
    material: 'Натуральная кожа', project: 'extndd++shelter', category: 'Обувь',
    featured: false,
  },
  {
    id: 6, name: 'ARCHIVE WOOL OVERCOAT', price: '320 000 RUB',
    originalPrice: '380 000 RUB', condition: '~9/10', size: 'L-XL',
    image: '/images/337-2.jpeg', images: ['/images/337-2.jpeg', '/images/326-1.jpeg'],
    description: 'Архивное шерстяное пальто оверсайз.',
    material: 'Шерсть 100%', project: 'save my life', category: 'Верх',
    featured: false,
  },
  {
    id: 7, name: 'SHADOW MASK COAT', price: '175 000 RUB',
    condition: '~9/10', size: 'L',
    image: '/images/338-2.jpeg', images: ['/images/338-2.jpeg'],
    description: 'Темное пальто-маска с высоким воротником.',
    material: 'Шерсть, хлопок', project: 'save my life', category: 'Верх',
    featured: false,
  },
  {
    id: 8, name: 'ALPHA INDUSTRIES MA-1', price: '8 900 RUB',
    condition: 'USED', size: 'XL',
    image: '/images/326-1.jpeg', images: ['/images/326-1.jpeg'],
    description: 'Классический бомбер MA-1 в отличном состоянии.',
    material: 'Нейлон', project: 'extndd++shelter', category: 'Верх',
    featured: false,
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

/* ── Masonry Feed Card ── */
function FeedCard({ product, onDetail, index }: { product: typeof products[0]; onDetail: () => void; index: number }) {
  const [liked, setLiked] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="group cursor-pointer break-inside-avoid mb-3 md:mb-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: `opacity 0.5s cubic-bezier(0.25,0.46,0.45,0.94) ${index * 60}ms, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94) ${index * 60}ms`,
      }}
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-950 border border-white/[0.06]" onClick={onDetail}>
        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out" />

        {/* Badge */}
        <div className="absolute top-2 left-2 md:top-2.5 md:left-2.5 z-10">
          <span className="px-1.5 py-0.5 text-[7px] md:text-[8px] tracking-wider text-white/90 bg-black/50 backdrop-blur-md border border-white/10">{product.condition}</span>
        </div>

        {/* Hover actions - desktop */}
        <div className="hidden md:flex absolute top-2.5 right-2.5 flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
            className={`p-1.5 backdrop-blur-xl border transition-all ${liked ? 'bg-white/15 border-white/25' : 'bg-black/30 border-white/10 hover:bg-black/50'}`}
          >
            <Heart className={`h-3 w-3 ${liked ? 'fill-white text-white' : 'text-white/80'}`} />
          </button>
          <button onClick={(e) => e.stopPropagation()} className="p-1.5 bg-black/30 backdrop-blur-xl border border-white/10 hover:bg-black/50 transition-all">
            <Share2 className="h-3 w-3 text-white/80" />
          </button>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 pointer-events-none" />

        {/* Sale badge */}
        {product.originalPrice && (
          <div className="absolute top-2 right-2 md:top-auto md:bottom-2 md:right-2.5 z-10 md:opacity-100">
            <span className="px-1.5 py-0.5 text-[7px] tracking-wider text-white bg-white/10 backdrop-blur-md border border-white/10">SALE</span>
          </div>
        )}
      </div>

      {/* Info below */}
      <div className="pt-1.5 pb-1 md:pt-2.5 md:pb-2" onClick={onDetail}>
        <span className="text-[7px] md:text-[8px] tracking-wider text-white/20 uppercase block mb-0.5">{product.project}</span>
        <h3 className="text-[10px] md:text-[11px] tracking-wider text-white/80 leading-tight mb-0.5 group-hover:text-white transition-colors line-clamp-2">{product.name}</h3>
        <div className="flex items-baseline gap-1.5">
          {product.originalPrice && <span className="text-[9px] md:text-[10px] text-white/25 line-through">{product.originalPrice}</span>}
          <span className="text-xs md:text-sm text-white font-light">{product.price}</span>
        </div>
      </div>
    </div>
  )
}

/* ── Main Feed Page ── */
export default function FeedPage() {
  const [detail, setDetail] = useState<typeof products[0] | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadedCount, setLoadedCount] = useState(products.length)
  const loaderRef = useRef<HTMLDivElement>(null)

  const filtered = searchQuery
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.project.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products

  // Simulate infinite scroll by cycling products
  const displayProducts = Array.from({ length: loadedCount }, (_, i) => ({
    ...filtered[i % filtered.length],
    _key: i,
  }))

  // Infinite scroll observer
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoadedCount(prev => prev + 4)
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/[0.06]" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-3 md:px-5 h-11 md:h-12">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">
            <span className="text-[9px] md:text-[10px] font-[family-name:var(--font-copperplate)] tracking-[0.15em]">EXTNDD++SHELTER</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-1.5 hover:bg-white/5 transition-colors">
              <Search className={`h-3.5 w-3.5 transition-colors ${searchOpen ? 'text-white' : 'text-white/40'}`} />
            </button>

            <div className="flex items-center bg-white/5 border border-white/[0.08]">
              <div className="px-2.5 md:px-3 py-1.5 text-[8px] md:text-[9px] tracking-wider text-white bg-white/10">ЛЕНТА</div>
              <Link href="/catalog" className="px-2.5 md:px-3 py-1.5 text-[8px] md:text-[9px] tracking-wider text-white/30 hover:text-white/60 transition-colors">КАТАЛОГ</Link>
              <Link href="/tinder" className="px-2 py-1.5 text-white/30 hover:text-white/60 transition-colors">
                <Sparkles className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-11 border-t border-white/[0.06]' : 'max-h-0'}`}>
          <div className="px-4 py-2.5">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию..."
              className="w-full bg-transparent text-xs text-white placeholder:text-white/20 focus:outline-none"
            />
          </div>
        </div>
      </header>

      {/* Masonry Feed - both mobile and desktop */}
      <main className="pt-12 md:pt-14 px-2 md:px-5" style={{ paddingTop: searchOpen ? '5.75rem' : undefined, transition: 'padding-top 0.3s ease' }}>
        <div className="max-w-[1400px] mx-auto py-3 md:py-5 columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-4">
          {displayProducts.map((p, i) => (
            <FeedCard
              key={p._key}
              product={p}
              onDetail={() => setDetail(p)}
              index={i}
            />
          ))}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={loaderRef} className="h-20 flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white/20 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </main>

      {detail && <DetailModal product={detail} onClose={() => setDetail(null)} />}
    </div>
  )
}
