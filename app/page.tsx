'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, X, ChevronRight, ChevronLeft } from 'lucide-react'
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
    year: '2018',
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
    year: '2004',
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
    year: '2010',
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
    year: '2016',
    material: 'Натуральная кожа',
  },
]

function ProductDetailModal({ product, isOpen, onClose }: { product: typeof products[0]; isOpen: boolean; onClose: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 2)
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100]" style={{ height: '100dvh' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background" onClick={onClose} />
      
      {/* Modal Content - Scrollable */}
      <div className="absolute inset-0 overflow-y-auto overscroll-contain" style={{ height: '100dvh' }}>
        <div className="min-h-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="fixed top-16 md:top-4 right-4 z-[110] p-3 bg-background/90 backdrop-blur-sm hover:bg-background transition-colors border border-border"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col md:grid md:grid-cols-2">
            {/* Image section */}
            <div className="relative aspect-[4/5] md:sticky md:top-0 md:h-screen">
              <Image
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover object-center"
              />
              
              {/* Image selector dots */}
              {product.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentImageIndex 
                          ? 'bg-foreground w-6' 
                          : 'bg-foreground/40 hover:bg-foreground/60 w-2'
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Image navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Info section */}
            <div className="bg-background p-6 md:p-10">
              <div className="flex flex-col gap-4">
                <div>
                  <Badge variant="secondary" className="mb-3 text-[9px] bg-foreground/10 backdrop-blur-sm">
                    {product.condition}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-light leading-tight">{product.name}</h2>
                </div>

                <div className="flex items-baseline gap-3">
                  {product.originalPrice && (
                    <p className="text-base text-muted-foreground line-through">
                      {product.originalPrice}
                    </p>
                  )}
                  <p className="text-3xl md:text-4xl font-light">{product.price}</p>
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
                  <div>
                    <p className="text-sm">{product.material}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <Button size="lg" className="w-full tracking-wider text-xs">
                    СВЯЗАТЬСЯ В TELEGRAM
                  </Button>
                  <Button size="lg" variant="outline" className="w-full tracking-wider text-xs bg-transparent">
                    ЗАДАТЬ ВОПРОС
                  </Button>
                </div>

                {/* Related Products */}
                <div className="pt-6 border-t border-border mt-2">
                  <h3 className="text-[10px] tracking-wider text-muted-foreground mb-4">ВАМ МОЖЕТ ПОНРАВИТЬСЯ</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {relatedProducts.map((relatedProduct) => (
                      <div key={relatedProduct.id} className="relative aspect-[4/5] overflow-hidden bg-card border border-border/30">
                        <Image
                          src={relatedProduct.image || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover object-center"
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
                          <h4 className="text-[9px] font-light leading-tight mb-0.5 line-clamp-2">
                            {relatedProduct.name}
                          </h4>
                          <p className="text-xs font-light">{relatedProduct.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, className = '', isLarge = false, onOpen }: { product: typeof products[0]; className?: string; isLarge?: boolean; onOpen: () => void }) {
  return (
    <div 
      onClick={onOpen}
        className={`group relative overflow-hidden bg-card cursor-pointer border border-border/60 ${className}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover object-center transition-all duration-700 group-hover:scale-[1.02]"
        />
        {/* Hover overlay with blur */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 backdrop-blur-[3px]"
               style={{ 
                 maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                 WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
               }} 
          />
        </div>
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        {/* Bottom blur that fades */}
        <div className="absolute bottom-0 left-0 right-0 backdrop-blur-[6px] h-[17%]"
             style={{ 
               maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
               WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
             }} 
        />
      </div>
      
      <div className="absolute top-3 left-3 z-10">
        <Badge variant="secondary" className={`tracking-wider backdrop-blur-sm bg-foreground/10 border-0 ${isLarge ? 'text-[9px]' : 'text-[7px] px-1.5 py-0.5'}`}>
          {product.condition}
        </Badge>
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 z-10 ${isLarge ? 'p-3' : 'p-2'}`}>
        <h3 className={`font-light leading-tight ${isLarge ? 'text-sm mb-1' : 'text-[9px] mb-0.5 line-clamp-2'}`}>
          {product.name}
        </h3>
        <div className={`flex items-baseline ${isLarge ? 'gap-2' : 'gap-1'}`}>
          {product.originalPrice && (
            <p className={`text-muted-foreground/70 line-through ${isLarge ? 'text-xs' : 'text-[8px]'}`}>
              {product.originalPrice}
            </p>
          )}
          <p className={`font-light ${isLarge ? 'text-xl' : 'text-xs'}`}>
            {product.price}
          </p>
        </div>
      </div>
    </div>
  )
}

function SmallProductCard({ product, onOpen }: { product: typeof products[0]; onOpen: () => void }) {
  return (
    <div 
      onClick={onOpen}
        className="group relative overflow-hidden bg-card cursor-pointer aspect-[4/5] border border-border/60"
    >
      <div className="relative w-full h-full">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover object-center transition-all duration-700 group-hover:scale-[1.02]"
        />
        {/* Hover overlay with blur */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 backdrop-blur-[3px]"
               style={{ 
                 maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                 WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
               }} 
          />
        </div>
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        {/* Bottom blur that fades */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 backdrop-blur-[6px]"
             style={{ 
               maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
               WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
             }} 
        />
      </div>
      
      <div className="absolute top-3 left-3 z-10">
        <Badge variant="secondary" className="text-[7px] px-1.5 py-0.5 tracking-wider backdrop-blur-sm bg-foreground/10 border-0">
          {product.condition}
        </Badge>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
        <h3 className="text-[10px] font-light leading-tight mb-0.5 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5">
          {product.originalPrice && (
            <p className="text-[9px] text-muted-foreground/70 line-through">
              {product.originalPrice}
            </p>
          )}
          <p className="text-sm font-light">
            {product.price}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryRef.current) {
      const scrollAmount = 300
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
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
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <h1 className="text-sm font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase">
              extndd++shelter
            </h1>

            <nav className="hidden lg:flex items-center gap-8">
              <a href="#" className="text-xs tracking-wider hover:opacity-70 transition-opacity">
                TELEGRAM
              </a>
              <a href="#" className="text-xs tracking-wider hover:opacity-70 transition-opacity">
                НАПИСАТЬ О ПОКУПКЕ
              </a>
            </nav>

            <div className="lg:hidden w-5" />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-14 lg:hidden">
          <nav className="flex flex-col gap-6 p-6">
            <a href="#" className="text-base tracking-wider" onClick={() => setMenuOpen(false)}>
              TELEGRAM
            </a>
            <a href="#" className="text-base tracking-wider" onClick={() => setMenuOpen(false)}>
              НАПИСАТЬ О ПОКУПКЕ
            </a>
          </nav>
        </div>
      )}

      {/* Hero Section - Full screen image */}
      <section className="relative h-screen w-full">
        <Image
          src="/images/338-2.jpeg"
          alt="Hero"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24">
          <div className="text-center px-4">
            <p className="text-[10px] md:text-xs tracking-[0.3em] text-muted-foreground mb-2 md:mb-4">
              save my life, extndd#
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10">
        {/* All Stock Link */}
        <section className="container mx-auto px-4 py-6">
          <Link 
            href="/catalog" 
            className="inline-flex items-center text-sm tracking-wider hover:opacity-70 transition-opacity underline underline-offset-4"
          >
            Все наличие
          </Link>
        </section>

        {/* Asymmetric Grid - Mobile: 1 large + 2 small stacked */}
        <section className="px-4 pb-4 container mx-auto relative z-10">
          <div className="grid grid-cols-3 md:grid-cols-12 gap-1 md:gap-2">
            {/* Product 1 - Large (2 cols, 2 rows on mobile) */}
            <ProductCard 
              product={products[0]} 
              className="col-span-2 row-span-2 md:col-span-6 md:row-span-2 aspect-[4/5]" 
              isLarge={true}
              onOpen={() => setSelectedProduct(products[0])}
            />

            {/* Product 2 - Small top right on mobile */}
            <div className="md:col-span-3 md:row-span-1">
              <SmallProductCard product={products[1]} onOpen={() => setSelectedProduct(products[1])} />
            </div>

            {/* Product 3 - Small bottom right on mobile */}
            <div className="md:col-span-3 md:row-span-1">
              <SmallProductCard product={products[2]} onOpen={() => setSelectedProduct(products[2])} />
            </div>

            {/* Text Block - Desktop only - spans 6 columns like cards above */}
            <div className="hidden md:flex md:col-span-6 md:row-span-1 border border-border/60 bg-card/50 backdrop-blur-sm items-center justify-center p-8">
              <div className="text-center w-full">
                <p className="text-5xl font-light tracking-[0.35em] mb-4 font-[family-name:var(--font-copperplate)]">EXTNDD</p>
                <p className="text-lg text-muted-foreground tracking-[0.2em]">Авангард</p>
              </div>
            </div>
          </div>
        </section>

        {/* Full width card */}
        <section className="px-4 pb-4 container mx-auto relative z-10">
          <ProductCard 
            product={products[3]} 
            className="w-full aspect-[4/5] md:aspect-[21/9]" 
            isLarge={true}
            onOpen={() => setSelectedProduct(products[3])}
          />
        </section>

        {/* New Arrivals Section */}
        <section className="px-4 pb-1 container mx-auto relative z-10">
          <h2 className="text-xs tracking-[0.2em] text-center uppercase mb-3">Новое поступления & Обновления</h2>
        </section>

        {/* Grid 2x2 for remaining products */}
        <section className="px-4 pb-4 container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
            {products.map((product, idx) => (
              <ProductCard 
                key={idx}
                product={product}
                className="aspect-[4/5]"
                isLarge={false}
                onOpen={() => setSelectedProduct(product)}
              />
            ))}
          </div>
          
          {/* View All Button */}
          <div className="mt-3 mb-4">
            <Link 
              href="/catalog" 
              className="block w-full py-4 border border-border text-center text-xs tracking-widest hover:bg-foreground hover:text-background transition-colors"
            >
              СМОТРЕТЬ ВСЕ
            </Link>
          </div>
        </section>

        {/* Wide Image Block */}
        <section className="pb-8 container mx-auto px-4 relative z-10">
          <div className="relative w-full aspect-[21/9] overflow-hidden">
            <Image
              src="/images/326-1.jpeg"
              alt="Collection"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
        </section>

        {/* Horizontal Gallery */}
        <section className="pb-8 relative z-10">
          <div className="container mx-auto px-4 mb-2 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-light tracking-wide">Хронология</h3>
                {/* Desktop left arrow at header level */}
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => scrollGallery('left')}
                  className="hidden md:flex bg-transparent h-7 w-7"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-1 md:hidden">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => scrollGallery('left')}
                  className="bg-transparent h-7 w-7"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => scrollGallery('right')}
                  className="bg-transparent h-7 w-7"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              {/* Desktop right arrow at header level */}
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => scrollGallery('right')}
                className="hidden md:flex bg-transparent h-7 w-7"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div 
            ref={galleryRef}
            className="md:hidden flex gap-2 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...products, ...products, ...products].map((product, idx) => (
              <div key={idx} className="shrink-0 w-[calc(50vw-1rem)] snap-start cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <div className="relative aspect-[4/5] overflow-hidden bg-card border border-border/60">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 backdrop-blur-[4px]"
                       style={{ 
                         maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                         WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
                       }} 
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="secondary" className="text-[7px] px-1.5 py-0.5 tracking-wider backdrop-blur-sm bg-foreground/10 border-0">
                      {product.condition}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
                    <h4 className="text-[10px] font-light leading-tight mb-0.5 line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-xs font-light">{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop 6 column grid */}
          <div className="hidden md:block container mx-auto px-4">
            <div className="grid grid-cols-6 gap-2">
              {[...products, ...products.slice(0, 2)].map((product, idx) => (
                <div key={idx} className="relative aspect-[4/5] overflow-hidden bg-card border border-border/60 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 backdrop-blur-[4px]"
                       style={{ 
                         maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                         WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
                       }} 
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="secondary" className="text-[9px] px-2 py-1 tracking-wider backdrop-blur-sm bg-foreground/10 border-0">
                      {product.condition}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <h4 className="text-xs font-light leading-tight mb-1 line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-sm font-light">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-sm font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase mb-2">
                extndd++shelter
              </h3>
              <p className="text-xs text-muted-foreground">
                Редкий японский и европейский авангард
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-xs tracking-wider hover:opacity-70 transition-opacity">
                TELEGRAM
              </a>
              <a href="#" className="text-xs tracking-wider hover:opacity-70 transition-opacity">
                INSTAGRAM
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
              powered by extnddOS v.3<br />
              build by @extndd<br />
              all rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          isOpen={true} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  )
}
