'use client'

import { Suspense, useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Menu, X, ArrowLeft, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { ProductDetailModal } from '@/components/ProductDetailModal'
import { CartModal } from '@/components/CartModal'
import { countItems, loadCart } from '@/lib/cart'

// Reusing Product interface from home page for consistency
export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  size: string;
  condition: string;
  image: string;
  images: string[];
  description: string;
  year: string;
  material: string;
  status: string;
  // Category might not be in DB yet, falling back to 'ВСЕ' logic or inferring
  category?: string;
}

// Temporary categories - in future could be DB driven or inferred
const categories = ['ВСЕ', 'КУРТКИ', 'БРЮКИ', 'АКСЕССУАРЫ', 'АРХИВ']

export default function CatalogAllPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-xs tracking-widest text-muted-foreground">LOADING...</div>
      </div>
    }>
      <CatalogAllPageInner />
    </Suspense>
  )
}

function CatalogAllPageInner() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const slugBase = (() => {
    const parts = (pathname || '').split('/').filter(Boolean)
    // /:number/:name/catalog
    if (parts.length >= 2 && /^\d+$/.test(parts[0])) return `/${parts[0]}/${parts[1]}`
    return ''
  })()

  const homeHref = slugBase || '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState('ВСЕ')
  const [showOnSale, setShowOnSale] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const [config, setConfig] = useState<Record<string, string>>({})

  useEffect(() => {
    // Keep cart badge in sync
    try {
      setCartCount(countItems(loadCart(slugBase)))
    } catch {}

    const onCartChanged = () => {
      try {
        setCartCount(countItems(loadCart(slugBase)))
      } catch {}
    }
    const onOpenCart = () => setCartOpen(true)
    window.addEventListener('storage', onCartChanged)
    window.addEventListener('ag-cart-changed', onCartChanged as any)
    window.addEventListener('ag-open-cart', onOpenCart as any)
    return () => {
      window.removeEventListener('storage', onCartChanged)
      window.removeEventListener('ag-cart-changed', onCartChanged as any)
      window.removeEventListener('ag-open-cart', onOpenCart as any)
    }
  }, [slugBase])

  useEffect(() => {
    // Resolve slug/user_id from current URL (multi-tenant)
    const parts = (pathname || '').split('/').filter(Boolean)

    let slug: string | null = null
    // /:number/:name/catalog
    if (parts.length >= 3 && /^\d+$/.test(parts[0]) && parts[2] === 'catalog') {
      slug = `${parts[0]}/${parts[1]}`
    } else {
      slug = searchParams?.get('slug')
    }

    const userId = searchParams?.get('user_id')
    const queryParam = slug ? `slug=${encodeURIComponent(slug)}` : ''

    if (!queryParam) {
      setError('Каталог не найден')
      setLoading(false)
      return
    }

    // Fetch Config
    fetch(`/api/config?${queryParam}`, { cache: 'no-store' })
      .then(res => res.ok ? res.json() : {})
      .then(data => setConfig(data))
      .catch(console.error)

    fetch(`/api/products?${queryParam}`, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error('API Error')
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          // Keep URLs exactly as API returns (e.g. /images/uploads/u1/...).
          // This avoids routing through tenant-prefixed paths and keeps caching behavior stable.
          setProducts(data.filter((p: any) => p.status !== 'ARCHIVE' && p.condition !== 'ARCHIVE'))
        }
      })
      .catch(err => {
        console.error('Failed to fetch products', err)
        setError('Не удалось загрузить товары. Попробуйте обновить страницу.')
      })
      .finally(() => setLoading(false))
  }, [pathname, searchParams])

  // Sync Theme
  useEffect(() => {
    if (config.theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }, [config.theme])

  // Basic client-side filtering
  // Note: Since DB doesn't have 'category' column yet in the schema we saw, 
  // we might need to rely on 'All' or infer from name/description. 
  // For now, if category is missing, we treat it as 'ВСЕ' effectively unless we match strings.
  const [sortMode, setSortMode] = useState<'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | 'default'>('default')

  // --- Components ---
  const FilterButton = ({ active, onClick, label, icon: Icon }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-wider border transition-all ${active
        ? 'bg-foreground text-background border-foreground'
        : 'bg-transparent text-foreground border-border hover:border-foreground/50'
        }`}
    >
      {Icon && <Icon className="h-3 w-3" />}
      <span>{label}</span>
    </button>
  )

  // --- Filtering & Sorting ---
  let filteredProducts = [...products]

  // 1. Category
  if (activeCategory !== 'ВСЕ') {
    filteredProducts = filteredProducts.filter(p => {
      const text = (p.name + ' ' + p.description).toUpperCase()
      if (activeCategory === 'КУРТКИ') return text.includes('JACKET') || text.includes('COAT') || text.includes('BOMBER') || text.includes('КУРТКА') || text.includes('ПУХОВИК')
      if (activeCategory === 'БРЮКИ') return text.includes('PANTS') || text.includes('JEANS') || text.includes('TROUSERS') || text.includes('БРЮКИ') || text.includes('ДЖИНСЫ')
      if (activeCategory === 'АКСЕССУАРЫ') return text.includes('BAG') || text.includes('HAT') || text.includes('GLOVES') || text.includes('СУМКА') || text.includes('РЕМЕНЬ')
      if (activeCategory === 'АРХИВ') return p.status === 'SOLD' || p.condition === 'ARCHIVE'
      return true
    })
  }

  // 2. Sale
  if (showOnSale) {
    filteredProducts = filteredProducts.filter(p => p.originalPrice)
  }

  // 3. Sorting
  filteredProducts.sort((a: any, b: any) => {
    if (sortMode === 'price_asc') return (a.priceValue || 0) - (b.priceValue || 0)
    if (sortMode === 'price_desc') return (b.priceValue || 0) - (a.priceValue || 0)
    if (sortMode === 'date_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    // Default: date_desc (Newest first) - using updatedAt to reflect "updates"
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  })

  // --- Components ---
  const ProductCard = ({ product }: { product: Product }) => (
    <div
      onClick={() => {
        setSelectedProduct(product)
        router.push(`${slugBase ? `${slugBase}/catalog` : '/catalog'}?product=${product.id}`)
      }}
      className="block group relative overflow-hidden bg-card cursor-pointer aspect-[4/5] border border-border/20"
    >
      <div className="relative w-full h-full bg-black/5 dark:bg-black/5">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover object-center transition-all duration-700 group-hover:scale-[1.02]"
        />
        {/* Hover overlay - Dark Mode Only */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 backdrop-blur-[3px]"
            style={{
              maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
            }}
          />
        </div>

        {/* Bottom gradient overlay - Dark Mode Only */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="absolute top-2 left-2 z-10">
        <Badge variant="secondary" className="text-[8px] px-1.5 py-0.5 tracking-wider backdrop-blur-md bg-black/60 dark:bg-white/10 border-0 text-white">
          {product.condition || 'USED'}
        </Badge>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
        <h3 className="text-[11px] font-light leading-tight mb-0.5 line-clamp-2 text-white drop-shadow-md">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5">
          {product.originalPrice && (
            <p className="text-[9px] text-muted-foreground/70 line-through">
              {product.originalPrice}
            </p>
          )}
          <p className="text-sm font-light text-white drop-shadow-md">
            {product.price}
          </p>
        </div>
      </div>
    </div>
  )

  // normalize external URLs
  const ensureUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    if (url.startsWith('t.me/')) return `https://${url}`
    if (url.startsWith('@')) return `https://t.me/${url.slice(1)}`
    return `https://t.me/${url}`
  }

  return (
    <div className={`min-h-screen bg-background text-foreground relative ${config.theme === 'light' ? 'light' : ''}`}>
      {/* ... Header ... */}
      <div className="animated-rays"><div className="ray ray-1" /><div className="ray ray-2" /><div className="ray ray-3" /></div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 xl:px-32">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {config.project_name ? (
              <a href={homeHref} className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 hover:opacity-70 transition-opacity">
                <h1 className="text-sm font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase">
                  {config.project_name}
                </h1>
              </a>
            ) : (
              <a href={homeHref} className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 hover:opacity-70 transition-opacity">
                <h1 className="text-sm font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase">
                  CATALOG
                </h1>
              </a>
            )}

            {(config.link_telegram || config.link_direct) && (
              <nav className="hidden lg:flex items-center gap-8">
                {config.link_telegram && (
                  <a href={ensureUrl(config.link_telegram)} target="_blank" rel="noopener noreferrer" className="text-xs tracking-wider hover:opacity-70 transition-opacity">
                    TELEGRAM
                  </a>
                )}
                {config.link_direct && (
                  <a href={ensureUrl(config.link_direct)} target="_blank" rel="noopener noreferrer" className="text-xs tracking-wider hover:opacity-70 transition-opacity">
                    НАПИСАТЬ О ПОКУПКЕ
                  </a>
                )}
              </nav>
            )}

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:opacity-70 transition-opacity"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (config.link_telegram || config.link_direct) && (
        <div className="fixed inset-0 z-40 bg-background pt-14 lg:hidden">
          <nav className="flex flex-col gap-6 p-6">
            {config.link_telegram && (
              <a href={ensureUrl(config.link_telegram)} target="_blank" rel="noopener noreferrer" className="text-base tracking-wider" onClick={() => setMenuOpen(false)}>
                TELEGRAM
              </a>
            )}
            {config.link_direct && (
              <a href={ensureUrl(config.link_direct)} target="_blank" rel="noopener noreferrer" className="text-base tracking-wider" onClick={() => setMenuOpen(false)}>
                НАПИСАТЬ О ПОКУПКЕ
              </a>
            )}
          </nav>
        </div>
      )}

      <main className="pt-20 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <Link href={homeHref} className="inline-flex items-center gap-2 text-xs tracking-wider hover:opacity-70 transition-opacity mb-8">
            <ArrowLeft className="h-3 w-3" />
            <span>НАЗАД</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-2">КАТАЛОГ</h2>
              <p className="text-xs text-muted-foreground tracking-wider">{filteredProducts.length} позиций</p>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
              {/* Categories */}
              {/* Categories removed as requested */}

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest mr-1">Фильтры:</span>

                {/* Price Sort */}
                <FilterButton
                  active={sortMode.includes('price')}
                  label={sortMode === 'price_asc' ? 'ЦЕНА ↑' : sortMode === 'price_desc' ? 'ЦЕНА ↓' : 'ЦЕНА'}
                  onClick={() => setSortMode(prev => prev === 'price_asc' ? 'price_desc' : 'price_asc')}
                />

                {/* Date Sort */}
                <FilterButton
                  active={sortMode.includes('date')}
                  label={sortMode === 'date_asc' ? 'ДАТА ↑' : 'ОБНОВЛЕНИЕ'}
                  onClick={() => setSortMode(prev => prev === 'date_desc' ? 'date_asc' : 'date_desc')}
                />

                {/* Sale Toggle */}
                <FilterButton
                  active={showOnSale}
                  label="% SALE"
                  onClick={() => setShowOnSale(!showOnSale)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Загрузка...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 md:gap-2 pb-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 md:mt-12">
        {/* Top border - full width, no container */}
        <div className="w-full border-t border-border" />
        
        <div className="py-3 md:py-4">
          <div className="container mx-auto px-4 xl:px-32">
            <div className="flex items-center justify-between">
              <div>
                {config.project_name && (
                  config.link_telegram ? (
                    <a href={ensureUrl(config.link_telegram)} target="_blank" rel="noopener noreferrer" className="block hover:opacity-70 transition-opacity">
                      <h3 className="text-sm font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase mb-1">
                        {config.project_name}
                      </h3>
                    </a>
                  ) : (
                    <h3 className="text-sm font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase mb-1">
                      {config.project_name}
                    </h3>
                  )
                )}
                {config.project_description && config.link_telegram && (
                  <a href={ensureUrl(config.link_telegram)} target="_blank" rel="noopener noreferrer" className="block hover:opacity-70 transition-opacity">
                    <p className="text-xs text-muted-foreground">
                      {config.project_description}
                    </p>
                  </a>
                )}
                {config.project_description && !config.link_telegram && (
                  <p className="text-xs text-muted-foreground">
                    {config.project_description}
                  </p>
                )}
              </div>
              {config.link_telegram && (
                <div>
                  <a href={ensureUrl(config.link_telegram)} target="_blank" rel="noopener noreferrer" className="text-xs tracking-wider hover:opacity-70 transition-opacity">
                    TELEGRAM
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Full-width separator line between footer content and credits */}
        <div className="w-full border-t border-border" />
        
        <div className="py-4 md:py-6">
          <div className="container mx-auto px-4 xl:px-32">
            <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
              powered by extnddOS v.3<br />
              build by @extndd<br />
              all rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart */}
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        products={products}
        slugBase={slugBase}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          products={products}
          isOpen={true}
          onClose={() => {
            setSelectedProduct(null)
            router.push(slugBase ? `${slugBase}/catalog` : '/catalog')
          }}
          onSelect={(p) => {
            setSelectedProduct(p)
            router.push(`${slugBase ? `${slugBase}/catalog` : '/catalog'}?product=${p.id}`)
          }}
        />
      )}
    </div>
  )
}
