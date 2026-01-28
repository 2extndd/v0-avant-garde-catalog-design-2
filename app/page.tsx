'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { Menu, X, ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ensureUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

import { ProductDetailModal } from '@/components/ProductDetailModal'
import { CartModal } from '@/components/CartModal'
import { countItems, loadCart } from '@/lib/cart'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { sanitizeHtml } from '@/lib/sanitize'

// normalize external URLs


export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  originalPrice?: string;
  size?: string;
  material?: string;
  year?: string;
  condition: string;
  image: string;
  images?: string[];
  status?: string;
  is_featured?: boolean;
  layout_index?: number;
}


interface ProductCardProps {
  product: Product;
  className?: string;
  isLarge?: boolean;
  onOpen: () => void;
  imageFit?: "cover" | "contain";
}

function ProductCard({ product, className = '', isLarge = false, onOpen, imageFit = "cover" }: ProductCardProps) {
  // Always use object-cover for proportional fill without distortion
  return (
    <div
      onClick={onOpen}
      className={`group relative overflow-hidden bg-card cursor-pointer border border-border/60 ${className}`}
    >
      <div className="relative w-full h-full bg-black/5 dark:bg-[#050505]">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover object-center transition-all duration-700 group-hover:scale-[1.02]"
        />
        {/* Hover overlay with blur - Dark Mode Only */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 backdrop-blur-[3px]"
            style={{
              maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
            }}
          />
        </div>
        {/* Bottom gradient overlay - Dark Mode Only */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent hidden dark:block" />
        {/* Bottom blur that fades - Dark Mode Only */}
        <div className="absolute bottom-0 left-0 right-0 backdrop-blur-[6px] h-[17%] hidden dark:block"
          style={{
            maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
          }}
        />
        {/* Light Mode: No gradient, just clean image */}
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Badge variant="secondary" className="text-[9px] px-2 py-0.5 tracking-wider backdrop-blur-md bg-foreground/10 dark:bg-white/10 border-0 text-foreground dark:text-white">
          {product.condition}
        </Badge>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className={`font-light leading-tight mb-1 ${isLarge ? 'text-xl' : 'text-sm'} text-foreground dark:text-white dark:drop-shadow-md`}>
            {product.name}
          </h3>
          {/* Size badge if needed */}

          <p className={`font-light ${isLarge ? 'text-xl' : 'text-xs'} text-foreground dark:text-white dark:drop-shadow-md`}>
            {product.price}
          </p>
        </div>
      </div>
    </div>
  )
}

function SmallProductCard({ product, onOpen, className = "" }: { product: Product; onOpen: () => void; className?: string }) {
  return (
    <div
      onClick={onOpen}
      className={`group relative overflow-hidden bg-card cursor-pointer border border-border/60 ${className || 'aspect-[4/5]'}`}
    >
      <div className="relative w-full h-full bg-black/5 dark:bg-black/5">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover object-top transition-all duration-700 group-hover:scale-[1.02]"
        />
        {/* Hover overlay with blur - Dark Mode Only */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 backdrop-blur-[3px]"
            style={{
              maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
            }}
          />
        </div>

        {/* Bottom gradient overlay - Dark Mode Only */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent hidden dark:block" />
      </div>

      <div className="absolute top-3 left-3 z-10">
        <Badge variant="secondary" className="text-[7px] px-1.5 py-0.5 tracking-wider backdrop-blur-md bg-foreground/10 dark:bg-white/10 border-0 text-foreground dark:text-white">
          {product.condition}
        </Badge>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
        <h3 className="text-[10px] font-light leading-tight mb-0.5 line-clamp-2 text-foreground dark:text-white dark:drop-shadow-md">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5">
          {product.originalPrice && (
            <p className="text-[9px] text-muted-foreground/70 line-through">
              {product.originalPrice}
            </p>
          )}
          <p className="text-[10px] font-light text-foreground dark:text-white dark:drop-shadow-md">
            {product.price}
          </p>
        </div>
      </div>
    </div>
  )
}

// Placeholder for disabled/empty blocks
function BlockPlaceholder({
  title,
  description,
  showImage = true,
  className = ""
}: {
  title: string;
  description: string;
  showImage?: boolean;
  className?: string;
}) {
  return (
    <div className={`border border-dashed border-border/40 rounded-lg p-8 text-center bg-card/30 ${className}`}>
      {showImage && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <h3 className="text-sm font-medium mb-2 text-muted-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground/70 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      <p className="text-[10px] text-muted-foreground/50 mt-3">
        Бот: @exsiteupdaterbot
      </p>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-xs tracking-widest text-muted-foreground">LOADING...</div>
      </div>
    }>
      <CatalogPageInner />
    </Suspense>
  )
}

function CatalogPageInner() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const slugBase = (() => {
    // Expected: /:number/:name
    const parts = (pathname || '').split('/').filter(Boolean)
    if (parts.length >= 2 && /^\d+$/.test(parts[0])) return `/${parts[0]}/${parts[1]}`
    return ''
  })()

  // When the site is served under a path prefix (e.g. https://domain.tld/1234/name/...),
  // static files referenced as absolute paths (/images/...) will incorrectly resolve to
  // https://domain.tld/images/... . We need them to resolve under slugBase.
  const withSlugBase = (p: string | undefined | null): string => {
    if (!p) return ''
    const s = String(p)
    if (/^https?:\/\//i.test(s)) return s

    // IMPORTANT: Do NOT prefix /images/* with slugBase.
    // Absolute paths (/images/...) are served from the domain root and should be cached as static.
    // Prefixing forces requests through middleware rewrites, which can slow down asset delivery.
    return s
  }

  const catalogHref = slugBase ? `${slugBase}/catalog` : '/catalog'
  const homeHref = slugBase || '/'
  const [menuOpen, setMenuOpen] = useState(false) // reserved
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingConfig, setLoadingConfig] = useState(true)
  const loading = loadingProducts || loadingConfig
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null)
  const [feedProducts, setFeedProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const [config, setConfig] = useState<Record<string, string>>({})

  useEffect(() => {
    // Keep cart badge in sync
    try {
      setCartCount(countItems(loadCart(slugBase)))
    } catch { }

    const onCartChanged = () => {
      try {
        setCartCount(countItems(loadCart(slugBase)))
      } catch { }
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
    // Get slug from path (format: /1234/save) or from query params
    const parts = (pathname || '').split('/').filter(Boolean)

    let slug: string | null = null
    // Check if path is /number/name format
    if (parts.length >= 2 && /^\d+$/.test(parts[0])) {
      slug = `${parts[0]}/${parts[1]}`
    } else {
      // Fallback to query params
      slug = searchParams?.get('slug')
    }

    // Build query string - public mode only supports slug.
    // IMPORTANT: user_id is intentionally NOT supported (security).
    const queryParam = slug ? `slug=${encodeURIComponent(slug)}` : ''

    if (!queryParam) {
      setCatalogError('catalog_not_found')
      setLoadingProducts(false)
      setLoadingConfig(false)
      return
    }

    // Fetch Products with no-store to avoid stale data
    fetch(`/api/products?${queryParam}`, { cache: 'no-store' })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const normalized = data.map((p: any) => {
            const images = Array.isArray(p.images) ? p.images.map((x: any) => withSlugBase(x)) : []
            return {
              ...p,
              image: withSlugBase(p.image),
              images,
            }
          })
          setProducts(normalized)
          const featured = normalized.find((p: any) => p.is_featured === true)
          setFeaturedProduct(featured || null)
          setFeedProducts(normalized.filter((p: any) => !p.is_featured && p.status !== 'SOLD' && p.status !== 'ARCHIVE'))
        }
      })
      .catch(err => console.error('Failed to fetch products', err))
      .finally(() => setLoadingProducts(false))

    // Fetch Config with no-store
    fetch(`/api/config?${queryParam}`, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.error || 'catalog_not_found')
          })
        }
        return res.json()
      })
      .then(data => {
        if (data.error) {
          setCatalogError(data.error)
        } else {
          setConfig(data)
        }
      })
      .catch(err => {
        console.error('Config error:', err)
        setCatalogError(err.message || 'catalog_not_found')
      })
      .finally(() => setLoadingConfig(false)) // Sync loading state
  }, [pathname, searchParams])

  // Restore Modal State from URL
  useEffect(() => {
    if (!products.length) return

    try {
      const productId = searchParams?.get('product')
      if (productId) {
        const found = products.find(p => p.id === parseInt(productId))
        if (found) {
          setSelectedProduct(found)
        }
      }
    } catch (e) {
      console.error("Failed to parse URL for product modal", e)
    }
  }, [products, searchParams])

  const archiveProducts = products.filter(p => p.layout_index === 6 || p.status === 'SOLD' || p.status === 'ARCHIVE')

  // Sync Theme (match /catalog behavior)
  useEffect(() => {
    // IMPORTANT: html class controls the global CSS variables.
    // If we keep `dark` on <html>, overscroll can reveal a dark backdrop in light theme.
    const root = document.documentElement
    if (config.theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    }
  }, [config.theme])

  // Block visibility flags (from config)
  const heroEnabled = config.hero_enabled !== '0'
  const mainBlockEnabled = config.main_block_enabled !== '0'
  const secondaryEnabled = config.secondary_enabled !== '0'
  const archiveEnabled = config.archive_enabled !== '0'

  // Check if ALL blocks are disabled
  const allBlocksDisabled = !heroEnabled && !mainBlockEnabled && !secondaryEnabled && !archiveEnabled

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryRef.current) {
      const scrollAmount = 300
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Prevent hydration mismatch / flash of stale content
  // Show nothing or loader until hydrated and fetched
  if (loading) {
    // Keep the same viewport geometry as the hero section to avoid visible squeeze/jump
    // when switching from loader to real content.
    return (
      <div className="min-h-screen bg-background text-foreground">
        <section className="relative h-[100svh] w-full">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-xs tracking-widest text-muted-foreground">LOADING...</div>
          </div>
        </section>
      </div>
    )
  }

  // Show error page if catalog doesn't exist or not registered
  if (catalogError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Каталог не найден</h1>
            <p className="text-muted-foreground mb-6">
              {catalogError === 'catalog_not_registered'
                ? 'Этот каталог был удален или еще не зарегистрирован.'
                : 'Каталог с таким адресом не существует.'}
            </p>
            <div className="text-xs text-muted-foreground">
              <p>Если вы владелец каталога, создайте его через Telegram бот @exsiteupdaterbot</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isLight = config.theme === 'light'

  return (
    <div className={`min-h-screen bg-background text-foreground relative ${isLight ? 'light' : ''}`}>
      {/* Animated Background Rays */}
      <div className="animated-rays">
        <div className="ray ray-1" />
        <div className="ray ray-2" />
        <div className="ray ray-3" />
        <div className="ray ray-4" />
        <div className="ray ray-5" />
        <div className="ray ray-6" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 xl:px-32">
          <div className="grid grid-cols-12 items-center h-14">
            <div className="col-span-2 lg:col-span-3">
              {/* Mobile menu reserved for future; keep icon for now */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
            <div className="col-span-8 lg:col-span-6 flex justify-center">

            {config.project_name && (
              <a href={homeHref} className="hover:opacity-70 transition-opacity">
                <h1 className="text-sm font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase">
                  {config.project_name}
                </h1>
              </a>
            )}
            </div>

            <div className="col-span-2 lg:col-span-3 flex justify-end">
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
        </div>
      </header>

      {/* Hero Section - Full screen image (Block 1) */}
      {heroEnabled && config.hero_image ? (
        <section className="relative h-[100svh] w-full">
          {/* Keep hero geometry stable to avoid visible stretch/layout shift */}
          <div className="absolute inset-0">
            <Image
              src={`${withSlugBase(config.hero_image)}`}
              alt="Hero"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
              unoptimized
              onError={(e) => {
                console.error('Hero image failed to load', { src: (e.target as any)?.src, hero_image: config.hero_image, slugBase })
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 ${isLight ? 'hidden' : ''} dark:block`} />
          </div>

          {(config.hero_text_enabled !== '0') && (
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24">
              <div className="text-center px-4">
                <p
                  className={`text-[10px] md:text-xs tracking-[0.3em] mb-2 md:mb-4 whitespace-nowrap md:whitespace-normal ${isLight ? 'text-foreground' : 'text-muted-foreground'}`}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(config.hero_text || "") }}
                />
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* Main Content */}
      <main className={`relative z-10 ${!heroEnabled ? 'pt-24 md:pt-28' : ''}`}>
        {mainBlockEnabled && (
          <>
            {/* All Stock Link - Restored Above Grid */}
            <section className={`container mx-auto px-4 xl:px-32 relative z-10 mb-4 ${heroEnabled ? 'pt-12 md:pt-16' : ''}`}>
              <Link
                href={catalogHref}
                className="inline-block text-[10px] md:text-xs tracking-widest hover:opacity-70 transition-opacity uppercase"
              >
                <span className="border-b border-foreground/60 pb-0.5">ВСЕ НАЛИЧИЕ</span>
                <span className="ml-1">→</span>
              </Link>
            </section>

            {/* Main Product Grid - Block 2 */}
            <section className="container mx-auto px-4 xl:px-32 relative z-10 mb-2">
              {(() => {
                const p1 = products.find(p => p.layout_index === 1);
                const p2 = products.find(p => p.layout_index === 2);
                const p3 = products.find(p => p.layout_index === 3);
                const hasSlots = p1 || p2 || p3;

                if (!hasSlots) {
                  return (
                    <BlockPlaceholder
                      title="Витрина товаров пуста"
                      description="Добавьте товары через бота и назначьте их на слоты витрины в разделе 'Оформление главной страницы'"
                    />
                  );
                }

                return (
                  <div className="grid grid-cols-3 md:grid-cols-12 gap-2">
                    {/* Product 1 - Large (2 cols, 2 rows on mobile) */}
                    {p1 && (
                      <ProductCard
                        product={p1}
                        className="col-span-2 row-span-2 md:col-span-6 md:row-span-2 w-full aspect-[4/5]"
                        isLarge={true}
                        onOpen={() => {
                          setSelectedProduct(p1)
                          router.push(`${homeHref}?product=${p1.id}`)
                        }}
                      />
                    )}

                    {/* Product 2 - Small top right on mobile - Slot 2 */}
                    {p2 && (
                      <div className="col-span-1 md:col-span-3 md:row-span-1 aspect-[4/5]">
                        <SmallProductCard product={p2} onOpen={() => setSelectedProduct(p2)} className="h-full" />
                      </div>
                    )}

                    {/* Product 3 - Small bottom right on mobile - Slot 3 */}
                    {p3 && (
                      <div className="col-span-1 md:col-span-3 md:row-span-1 aspect-[4/5]">
                        <SmallProductCard product={p3} onOpen={() => setSelectedProduct(p3)} className="h-full" />
                      </div>
                    )}

                    {/* Text Block - Slot 4 (Desktop: 6 cols, fills remaining space in row 2 under Products 2+3) */}
                    <div className={`hidden md:flex md:col-span-6 md:row-span-1 items-center justify-center relative overflow-hidden group w-full h-full ${config.main_text_enabled === '1'
                      ? (config.main_text_type === 'image' ? 'bg-black' : 'border border-border/60 bg-card')
                      : 'hidden'
                      }`}>
                      {config.main_text_enabled === '1' && (
                        config.main_text_type === 'image' && config.main_text_image ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={config.main_text_image}
                              alt="Feature"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          config.main_text_content && (
                            <div className="text-center w-full relative z-10 p-8">
                              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(config.main_text_content || config.main_text || "") }} />
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* Text Block - Slot 4 (Mobile only - below products) */}
            {config.main_text_enabled === '1' && (
              <section className="md:hidden px-4 container mx-auto relative z-10">
                <div className={`w-full aspect-[16/7] flex items-center justify-center relative overflow-hidden ${config.main_text_type === 'image' ? 'bg-black' : 'border border-border/60 bg-card'
                  }`}>
                  {config.main_text_type === 'image' && config.main_text_image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={config.main_text_image}
                        alt="Feature"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    config.main_text_content && (
                      <div className="text-center w-full relative z-10 p-4">
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(config.main_text_content || config.main_text || "") }} />
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

          </>
        )}

        {/* Grid 2x2 for remaining products - Feed Section */}
        <section className={`px-4 xl:px-32 container mx-auto relative z-10 ${!mainBlockEnabled && !heroEnabled ? 'pt-8' : ''}`}>
          <div className={`flex items-center justify-center pb-4 ${mainBlockEnabled ? 'pt-8 md:pt-12' : 'pt-4'}`}>
            <h3 className="text-[10px] md:text-xs tracking-[0.2em] font-light uppercase text-foreground">
              НОВОЕ ПОСТУПЛЕНИЕ & ОБНОВЛЕНИЯ
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
            {feedProducts.slice(0, (!heroEnabled && !mainBlockEnabled) ? 24 : 12).map((product, idx) => (
              <ProductCard
                key={idx}
                product={product}
                className="aspect-[4/5]"
                isLarge={false}
                onOpen={() => {
                  setSelectedProduct(product)
                  router.push(`${homeHref}?product=${product.id}`)
                }}
              />
            ))}
          </div>
        </section>

        {/* Bottom View All Button */}
        <section className="container mx-auto px-4 xl:px-32 relative z-10 mt-2 mb-12 md:mb-16">
          <Link
            href={catalogHref}
            className="block w-full py-4 border border-border text-center text-xs tracking-widest hover:bg-foreground hover:text-background transition-colors"
          >
            СМОТРЕТЬ ВСЕ
          </Link>
        </section>

        {/* Secondary Banner (Block 3) */}
        {secondaryEnabled && config.secondary_image ? (
          <section className="w-full relative mb-12 md:mb-16 z-10">
            <div className="container mx-auto px-4 xl:px-32">
              <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden">
                <Image
                  src={`${withSlugBase(config.secondary_image)}`}
                  alt="Banner"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent hidden dark:block" />
              </div>
              {config.secondary_text && (
                <p className="text-center text-sm text-muted-foreground mt-2 tracking-wide">
                  {config.secondary_text}
                </p>
              )}
            </div>
          </section>
        ) : null}

        {/* Horizontal Gallery (Archive - Block 4) */}
        {archiveEnabled && (
          <section className="pb-12 md:pb-16 relative z-10">
            <div className="container mx-auto px-4 xl:px-32 mb-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="text-xs tracking-[0.2em] font-light uppercase text-foreground/70">АРХИВ</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollGallery('left')}
                    className="hidden md:flex bg-transparent h-7 w-7 rounded-none border-border/50"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollGallery('right')}
                    className="hidden md:flex bg-transparent h-7 w-7 rounded-none border-border/50"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="container mx-auto">
              <div
                ref={galleryRef}
                className="flex gap-2 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {archiveProducts.map((product, idx) => (
                  <div key={product.id} className="shrink-0 w-[calc(50vw-1rem)] md:w-[calc(25vw-1rem)] lg:w-[calc(20vw-1rem)] snap-start cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <div className="relative overflow-hidden group aspect-[4/5] flex flex-col items-center justify-center text-center p-6 border border-border/60 bg-card data-[fit=square]:[&_img]:object-top data-[fit=normal]:[&_img]:object-center">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover object-top opacity-80 hover:opacity-100 transition-opacity"
                        onLoadingComplete={(img) => {
                          // Full support: 4x5 and 1x1
                          // 1x1 should stick to top edge (object-top), 4x5/other fill frame
                          const w = img.naturalWidth || 0
                          const h = img.naturalHeight || 0
                          if (!w || !h) return
                          const ratio = w / h
                          const isSquare = Math.abs(ratio - 1) < 0.03
                          // set object position by toggling a data attribute on parent
                          const parent = img.parentElement
                          if (parent) {
                            parent.setAttribute('data-fit', isSquare ? 'square' : 'normal')
                          }
                        }}
                      />
                      <div className="absolute top-3 left-3 z-10">
                        <Badge variant="secondary" className="text-[7px] px-1.5 py-0.5 tracking-wider backdrop-blur-sm bg-foreground/10 border-0">
                          {product.condition || 'ARCHIVE'}
                        </Badge>
                      </div>
                      {/* Bottom gradient overlay (dark mode only) */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent hidden dark:block" />
                      {/* Bottom blur that fades (dark mode) */}
                      <div className="absolute bottom-0 left-0 right-0 backdrop-blur-[6px] h-[17%] hidden dark:block"
                        style={{
                          maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
                        }}
                      />

                      <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
                        <h4 className="text-[10px] font-light leading-tight mb-0.5 line-clamp-2">
                          {product.name}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
                {archiveProducts.length === 0 && (
                  <div className="w-full px-4">
                    <BlockPlaceholder
                      title="Архив пуст"
                      description="Товары или посты, которые Вы добавили в архив, будут отображаться здесь"
                      showImage={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
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
              <div className="flex flex-col items-end gap-2">
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
              </div>
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
            // Don't scroll to top when closing modal; keep user's position.
            router.replace(homeHref, { scroll: false })
          }}
          onSelect={(p) => {
            setSelectedProduct(p)
            // Keep scroll position while browsing items in modal.
            router.replace(`${homeHref}?product=${p.id}`, { scroll: false })
          }}
          config={config}
        />
      )}
    </div>
  )
}
