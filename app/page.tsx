'use client'

import React from "react"

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
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 2)
  
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
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
      } else {
        setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
      }
    }
    setTouchStart(null)
  }
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in" style={{ height: '100dvh' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="absolute inset-0 overflow-y-auto overscroll-contain" style={{ height: '100dvh' }}>
        <div className="min-h-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-[110] p-3 glass hover:bg-foreground/10 transition-colors border border-border"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col lg:grid lg:grid-cols-2">
            {/* Image section */}
            <div 
              className="relative aspect-[4/5] lg:h-screen lg:sticky lg:top-0"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover object-center transition-opacity duration-300"
              />
              
              {/* Image selector dots */}
              {product.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 glass hover:bg-foreground/10 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 glass hover:bg-foreground/10 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Info section */}
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
                    <p className="text-base text-muted-foreground line-through">
                      {product.originalPrice}
                    </p>
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
                  <div>
                    <p className="text-sm text-muted-foreground">{product.material}</p>
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
                      <div key={relatedProduct.id} className="relative aspect-[4/5] overflow-hidden bg-card border border-border/40 hover-lift">
                        <Image
                          src={relatedProduct.image || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover object-center"
                        />
                        {/* Dark-only gradient overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent hidden dark:block" />
                        {/* Light theme overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/90 to-transparent dark:hidden" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
                          <h4 className="text-[9px] font-light leading-tight mb-0.5 line-clamp-2 text-foreground dark:text-white">
                            {relatedProduct.name}
                          </h4>
                          <p className="text-xs font-light text-foreground dark:text-white">{relatedProduct.price}</p>
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
      className={`group relative overflow-hidden bg-black/5 dark:bg-[#050505] cursor-pointer border border-border/50 hover-lift ${className}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover object-center transition-all duration-700 group-hover:scale-[1.02]"
        />
        
        {/* Hover overlay with blur - dark only */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 backdrop-blur-[3px]"
               style={{ 
                 maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                 WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
               }} 
          />
        </div>
        
        {/* Dark theme overlays */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 backdrop-blur-[6px] h-[17%] hidden dark:block"
             style={{ 
               maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
               WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
             }} 
        />
        
        {/* Light theme overlays */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/90 to-transparent dark:hidden" />
      </div>
      
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="secondary" className={`tracking-wider glass-subtle border-0 text-foreground dark:text-white ${isLarge ? 'text-[9px] px-2 py-1' : 'text-[7px] px-1.5 py-0.5'}`}>
          {product.condition}
        </Badge>
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 z-10 ${isLarge ? 'p-4' : 'p-3'}`}>
        <h3 className={`font-light leading-tight text-foreground dark:text-white ${isLarge ? 'text-sm mb-1' : 'text-[10px] mb-0.5 line-clamp-2'}`}>
          {product.name}
        </h3>
        <div className={`flex items-baseline ${isLarge ? 'gap-2' : 'gap-1'}`}>
          {product.originalPrice && (
            <p className={`text-muted-foreground/70 line-through ${isLarge ? 'text-xs' : 'text-[8px]'}`}>
              {product.originalPrice}
            </p>
          )}
          <p className={`font-light text-foreground dark:text-white ${isLarge ? 'text-xl' : 'text-xs'}`}>
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
      className="group relative overflow-hidden bg-black/5 dark:bg-[#050505] cursor-pointer aspect-[4/5] border border-border/50 hover-lift"
    >
      <div className="relative w-full h-full">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover object-center transition-all duration-700 group-hover:scale-[1.02]"
        />
        
        {/* Dark theme overlays */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-1/4 backdrop-blur-[6px] hidden dark:block"
             style={{ 
               maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
               WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
             }} 
        />
        
        {/* Light theme overlays */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/90 to-transparent dark:hidden" />
      </div>
      
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="secondary" className="text-[7px] px-1.5 py-0.5 tracking-wider glass-subtle border-0 text-foreground dark:text-white">
          {product.condition}
        </Badge>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <h3 className="text-[10px] font-light leading-tight mb-0.5 line-clamp-2 text-foreground dark:text-white">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5">
          {product.originalPrice && (
            <p className="text-[9px] text-muted-foreground/70 line-through">
              {product.originalPrice}
            </p>
          )}
          <p className="text-sm font-light text-foreground dark:text-white">
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

      {/* Header with glass effect */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 xl:px-32">
          <div className="grid grid-cols-12 items-center h-14">
            <div className="col-span-2 lg:col-span-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 -ml-2"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="col-span-8 lg:col-span-6 flex justify-center">
              <Link href="/" className="hover:opacity-70 transition-opacity">
                <h1 className="text-sm font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase">
                  extndd++shelter
                </h1>
              </Link>
            </div>

            <div className="col-span-2 lg:col-span-3 flex justify-end">
              {/* Cart placeholder */}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-14 lg:hidden animate-fade-in">
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

      {/* Hero Section */}
      <section className="relative h-[100svh] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/338-2.jpeg"
            alt="Hero"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark mode gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 hidden dark:block" />
          {/* Light mode gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 dark:hidden" />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 lg:pb-24">
          <div className="text-center px-4 animate-fade-in-up">
            <p className="text-[10px] lg:text-xs tracking-[0.3em] text-muted-foreground mb-2 lg:mb-4">
              save my life, extndd#
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10">
        {/* All Stock Link */}
        <section className="container mx-auto px-4 xl:px-32 py-6">
          <Link 
            href="/catalog" 
            className="inline-flex items-center gap-2 text-sm tracking-wider hover:opacity-70 transition-opacity underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground group"
          >
            <span>Все наличие</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* Asymmetric Grid */}
        <section className="px-4 xl:px-32 pb-4 container mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-12 gap-2">
            {/* Product 1 - Large */}
            <div className="col-span-2 row-span-2 md:col-span-6 md:row-span-2 animate-fade-in stagger-1">
              <ProductCard 
                product={products[0]} 
                className="aspect-[4/5] h-full" 
                isLarge={true}
                onOpen={() => setSelectedProduct(products[0])}
              />
            </div>

            {/* Product 2 - Small */}
            <div className="col-span-1 md:col-span-3 animate-fade-in stagger-2">
              <SmallProductCard product={products[1]} onOpen={() => setSelectedProduct(products[1])} />
            </div>

            {/* Product 3 - Small */}
            <div className="col-span-1 md:col-span-3 animate-fade-in stagger-3">
              <SmallProductCard product={products[2]} onOpen={() => setSelectedProduct(products[2])} />
            </div>

            {/* Text Block - Desktop only */}
            <div className="hidden md:flex md:col-span-6 glass border border-border/50 items-center justify-center p-8 animate-fade-in stagger-4">
              <div className="text-center w-full">
                <p className="text-4xl lg:text-5xl font-light tracking-[0.35em] mb-4 font-[family-name:var(--font-copperplate)]">EXTNDD</p>
                <p className="text-base lg:text-lg text-muted-foreground tracking-[0.2em]">Авангард</p>
              </div>
            </div>
          </div>
        </section>

        {/* Full width card */}
        <section className="px-4 xl:px-32 pb-4 container mx-auto">
          <ProductCard 
            product={products[3]} 
            className="w-full aspect-[4/5] md:aspect-[21/9] animate-fade-in" 
            isLarge={true}
            onOpen={() => setSelectedProduct(products[3])}
          />
        </section>

        {/* New Arrivals Section */}
        <section className="px-4 xl:px-32 py-4 container mx-auto">
          <h2 className="text-xs tracking-[0.2em] text-center uppercase mb-4">Новое поступления & Обновления</h2>
        </section>

        {/* Grid for products */}
        <section className="px-4 xl:px-32 pb-4 container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {products.map((product, idx) => (
              <div key={product.id} className={`animate-fade-in stagger-${(idx % 6) + 1}`}>
                <ProductCard 
                  product={product}
                  className="aspect-[4/5]"
                  isLarge={false}
                  onOpen={() => setSelectedProduct(product)}
                />
              </div>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="mt-4">
            <Link 
              href="/catalog" 
              className="block w-full py-4 border border-border text-center text-xs tracking-widest hover:bg-foreground hover:text-background transition-colors"
            >
              СМОТРЕТЬ ВСЕ
            </Link>
          </div>
        </section>

        {/* Wide Image Block */}
        <section className="pb-8 container mx-auto px-4 xl:px-32">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <Image
              src="/images/326-1.jpeg"
              alt="Collection"
              fill
              className="object-cover object-center"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent hidden dark:block" />
            {/* Light overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent dark:hidden" />
          </div>
        </section>

        {/* Horizontal Gallery - Archive */}
        <section className="pb-8">
          <div className="container mx-auto px-4 xl:px-32 mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-light tracking-wide">Хронология</h3>
              <div className="flex gap-1">
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
            </div>
          </div>
          
          <div 
            ref={galleryRef}
            className="flex gap-2 overflow-x-auto pb-4 px-4 xl:px-32 scrollbar-hide snap-x snap-mandatory"
          >
            {[...products, ...products].map((product, idx) => (
              <div 
                key={idx} 
                className="shrink-0 w-[calc(50vw-1.5rem)] md:w-[calc(25vw-2rem)] lg:w-[calc(16.666vw-2rem)] snap-start cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-black/5 dark:bg-[#050505] border border-border/50 hover-lift">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover object-top"
                  />
                  {/* Dark theme overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent hidden dark:block" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 backdrop-blur-[4px] hidden dark:block"
                       style={{ 
                         maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                         WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
                       }} 
                  />
                  {/* Light theme overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/90 to-transparent dark:hidden" />
                  
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="secondary" className="text-[7px] px-1.5 py-0.5 tracking-wider glass-subtle border-0 text-foreground dark:text-white">
                      {product.condition}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <h4 className="text-[10px] font-light leading-tight mb-0.5 line-clamp-2 text-foreground dark:text-white">
                      {product.name}
                    </h4>
                    <p className="text-xs font-light text-foreground dark:text-white">{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 lg:mt-12">
        <div className="w-full border-t border-border" />
        
        <div className="py-4">
          <div className="container mx-auto px-4 xl:px-32">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-sm font-[family-name:var(--font-copperplate)] tracking-[0.15em] uppercase mb-1">
                  extndd++shelter
                </h3>
                <p className="text-xs text-muted-foreground">
                  Редкий японский и европейский авангард
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <a href="#" className="text-xs tracking-wider hover:opacity-70 transition-opacity">
                  TELEGRAM
                </a>
                <a href="#" className="text-xs tracking-wider hover:opacity-70 transition-opacity">
                  НАПИСАТЬ О ПОКУПКЕ
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full border-t border-border" />
        <div className="py-6">
          <div className="container mx-auto px-4 xl:px-32">
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
