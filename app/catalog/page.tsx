'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'

const categories = ['ВСЕ', 'КУРТКИ', 'БРЮКИ', 'АКСЕССУАРЫ', 'АРХИВ']

const products = [
  {
    id: 1,
    name: 'MULTI-POCKET CARGO PANTS',
    price: '68 000 ₽',
    originalPrice: '85 000 ₽',
    size: 'M-L',
    condition: 'DEADSTOCK',
    category: 'БРЮКИ',
    image: '/images/340-2.jpeg',
    images: ['/images/340-2.jpeg', '/images/326-1.jpeg', '/images/337-2.jpeg'],
    description: 'Уникальные карго брюки с множественными карманами и регулируемыми ремнями.',
    year: '2018',
    material: 'Хлопок, нейлон',
  },
  {
    id: 2,
    name: 'SHEARLING JACKET BEIGE',
    price: '180 000 ₽',
    size: 'S-M',
    condition: 'GRAIL',
    category: 'КУРТКИ',
    image: '/images/337-2.jpeg',
    images: ['/images/337-2.jpeg', '/images/340-2.jpeg'],
    description: 'Дубленка из натуральной овчины бежевого оттенка.',
    year: '2004',
    material: 'Натуральная овчина',
  },
  {
    id: 3,
    name: 'LEATHER SHEARLING BOMBER',
    price: '245 000 ₽',
    size: 'M',
    condition: 'ARCHIVE',
    category: 'КУРТКИ',
    image: '/images/326-1.jpeg',
    images: ['/images/326-1.jpeg', '/images/338-2.jpeg'],
    description: 'Черная кожаная дубленка-бомбер с овчиной.',
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
    category: 'КУРТКИ',
    image: '/images/338-2.jpeg',
    images: ['/images/338-2.jpeg', '/images/326-1.jpeg', '/images/340-2.jpeg'],
    description: 'Кожаная куртка с капюшоном оверсайз кроя.',
    year: '2016',
    material: 'Натуральная кожа',
  },
  {
    id: 5,
    name: 'VINTAGE CARGO PANTS BLACK',
    price: '52 000 ₽',
    size: 'L',
    condition: 'ARCHIVE',
    category: 'БРЮКИ',
    image: '/images/340-2.jpeg',
    images: ['/images/340-2.jpeg'],
    description: 'Винтажные карго брюки в черном цвете.',
    year: '2015',
    material: 'Хлопок',
  },
  {
    id: 6,
    name: 'SHEARLING COAT BROWN',
    price: '320 000 ₽',
    originalPrice: '380 000 ₽',
    size: 'M',
    condition: 'GRAIL',
    category: 'КУРТКИ',
    image: '/images/337-2.jpeg',
    images: ['/images/337-2.jpeg'],
    description: 'Длинная дубленка коричневого оттенка.',
    year: '2008',
    material: 'Натуральная овчина',
  },
  {
    id: 7,
    name: 'BOMBER JACKET DISTRESSED',
    price: '175 000 ₽',
    size: 'S',
    condition: 'ARCHIVE',
    category: 'АРХИВ',
    image: '/images/326-1.jpeg',
    images: ['/images/326-1.jpeg'],
    description: 'Бомбер с эффектом состаривания.',
    year: '2012',
    material: 'Натуральная кожа',
  },
  {
    id: 8,
    name: 'OVERSIZED LEATHER HOODIE',
    price: '210 000 ₽',
    size: 'XL',
    condition: 'DEADSTOCK',
    category: 'КУРТКИ',
    image: '/images/338-2.jpeg',
    images: ['/images/338-2.jpeg'],
    description: 'Оверсайз худи из натуральной кожи.',
    year: '2019',
    material: 'Натуральная кожа',
  },
]

function ProductDetailModal({ product, isOpen, onClose }: { product: typeof products[0]; isOpen: boolean; onClose: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 2)
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-background" onClick={onClose} />
      
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full">
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-[210] p-3 bg-background/90 backdrop-blur-sm hover:bg-background transition-colors border border-border"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col md:grid md:grid-cols-2">
            <div className="relative aspect-[4/5] md:sticky md:top-0 md:h-screen">
              <Image
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover object-center"
              />
              
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
                      <h3 className="text-[10px] tracking-wider text-muted-foreground mb-1">ГОД</h3>
                      <p className="text-sm">{product.year}</p>
                    </div>
                    <div>
                      <h3 className="text-[10px] tracking-wider text-muted-foreground mb-1">РАЗМЕР</h3>
                      <p className="text-sm">{product.size}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] tracking-wider text-muted-foreground mb-1">МАТЕРИАЛ</h3>
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

function ProductCard({ product }: { product: typeof products[0] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative overflow-hidden bg-card cursor-pointer aspect-[4/5] border border-border/20"
      >
        <div className="relative w-full h-full">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover object-center transition-all duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute bottom-0 left-0 right-0 h-1/2 backdrop-blur-[3px]"
                 style={{ 
                   maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                   WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
                 }} 
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 backdrop-blur-[6px]"
               style={{ 
                 maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                 WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
               }} 
          />
        </div>
        
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="secondary" className="text-[8px] px-1.5 py-0.5 tracking-wider backdrop-blur-sm bg-foreground/10 border-0">
            {product.condition}
          </Badge>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
          <h3 className="text-[11px] font-light leading-tight mb-0.5 line-clamp-2">
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
      <ProductDetailModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default function CatalogAllPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('ВСЕ')
  const [showOnSale, setShowOnSale] = useState(false)

  let filteredProducts = activeCategory === 'ВСЕ' 
    ? products 
    : products.filter(p => p.category === activeCategory)
  
  if (showOnSale) {
    filteredProducts = filteredProducts.filter(p => p.originalPrice)
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
                АРХИВ
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
              АРХИВ
            </a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-14 relative z-10">
        {/* Back link and title */}
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm tracking-wider hover:opacity-70 transition-opacity group mb-6">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Назад</span>
          </Link>
          
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-light tracking-wide">Все наличие</h2>
            <span className="text-sm text-muted-foreground">{filteredProducts.length} вещей</span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-[10px] tracking-wider border transition-colors ${
                  activeCategory === category
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent text-foreground border-border hover:border-foreground/50'
                }`}
              >
                {category}
              </button>
            ))}
            <button
              onClick={() => setShowOnSale(!showOnSale)}
              className={`px-4 py-2 text-[10px] tracking-wider border transition-colors ${
                showOnSale
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-foreground border-border hover:border-foreground/50'
              }`}
            >
              СКИДКИ
            </button>
          </div>
        </div>

        {/* Simple 2-column grid */}
        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-2 gap-1 md:gap-2">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
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
            <p className="text-[10px] text-muted-foreground">
              {new Date().getFullYear()} extndd++shelter. save my life.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
