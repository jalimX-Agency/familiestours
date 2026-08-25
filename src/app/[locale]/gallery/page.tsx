'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { images } from '@/lib/images';
import { useLocale, LocaleProvider } from '@/context/LocaleContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

function GalleryContent() {
  const { t, locale } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof images.gallery[0] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const categories = ['All', 'Camels', 'Adventure', 'Camp', 'Nature'];

  const filteredImages = selectedCategory === 'All' 
    ? images.gallery 
    : images.gallery.filter(img => img.category.toLowerCase() === selectedCategory.toLowerCase());

  const openLightbox = (img: typeof images.gallery[0], idx: number) => {
    setSelectedImage(img);
    setSelectedIndex(idx);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    let newIndex = direction === 'next' ? selectedIndex + 1 : selectedIndex - 1;
    if (newIndex < 0) newIndex = filteredImages.length - 1;
    if (newIndex >= filteredImages.length) newIndex = 0;
    setSelectedIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <main className="min-h-screen dark:bg-[#0c0d0f] bg-[#faf8f5] dark:text-zinc-100 text-stone-900 transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[48vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.camp})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-amber-400"></span>
            <span className="text-amber-400 text-xs tracking-[0.35em] uppercase font-semibold drop-shadow-sm">{t.gallery.visualJourney}</span>
            <span className="w-8 h-[1px] bg-amber-400"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-white drop-shadow-md">
            Desert <span className="font-serif italic text-amber-400">Gallery</span>
          </h1>
          
          <p className="text-white/90 font-light max-w-xl mx-auto drop-shadow-sm text-base">
            {t.gallery.glimpses}
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-20 lg:top-24 z-30 dark:bg-zinc-950/95 bg-white/95 backdrop-blur-xl dark:border-b border-b dark:border-white/10 border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 text-xs tracking-wider uppercase whitespace-nowrap rounded-full transition-all duration-300 font-semibold ${
                  selectedCategory === cat 
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' 
                    : 'dark:text-zinc-400 text-stone-600 hover:dark:text-white hover:text-stone-950 dark:hover:bg-white/5 hover:bg-stone-100'
                }`}
              >
                {cat === 'All' ? t.gallery.all : 
                 cat === 'Camels' ? t.gallery.categories.camels :
                 cat === 'Adventure' ? t.gallery.categories.adventure :
                 cat === 'Camp' ? t.gallery.categories.camp :
                 t.gallery.categories.nature}
              </button>
            ))}
          </div>
          
          <span className="hidden md:block dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase font-medium">
            {filteredImages.length} {t.gallery.photos}
          </span>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 lg:py-24 dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
            {filteredImages.map((image, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(image, idx)}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-xl border dark:border-white/10 border-stone-200/80 shadow-md shadow-stone-900/5 hover:shadow-2xl transition-all duration-500"
              >
                <div className={`${idx % 5 === 0 ? 'row-span-2' : ''}`}>
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full object-cover transition-all duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-all duration-300 flex items-end p-5 opacity-0 group-hover:opacity-100">
                  <div>
                    <p className="text-white font-medium text-sm drop-shadow-sm">{image.alt}</p>
                    <p className="text-amber-400 text-xs uppercase tracking-wider mt-1 font-semibold">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 dark:bg-black/95 bg-black/92 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:border-white/50 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
            className="absolute left-4 lg:left-8 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:border-white/50 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
            className="absolute right-4 lg:right-8 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:border-white/50 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div 
            className="max-w-5xl max-h-[80vh] relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl mx-auto"
            />
            
            <div className="mt-4">
              <p className="text-white font-medium text-lg drop-shadow-sm">{selectedImage.alt}</p>
              <p className="text-amber-400 text-xs uppercase tracking-widest mt-1 font-semibold">{selectedImage.category}</p>
            </div>
            
            <p className="text-center text-white/50 text-xs mt-3">
              {selectedIndex + 1} / {filteredImages.length}
            </p>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-24 dark:bg-[#121418] bg-stone-100/80 border-t dark:border-white/5 border-stone-200/80">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-5 dark:text-white text-stone-900">
            {t.gallery.createMemories.split(' ')[0]} Your Own <span className="font-serif italic text-amber-500">{t.gallery.createMemories.split(' ').slice(1).join(' ')}</span>?
          </h2>
          <p className="dark:text-zinc-300 text-stone-600 mb-8 max-w-2xl mx-auto text-base leading-relaxed">
            {t.gallery.galleryCta}
          </p>
          <a 
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-4 px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold tracking-wider uppercase text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-xl shadow-amber-500/25 rounded-sm"
          >
            {t.gallery.startJourney}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as any) || 'en';
  
  return (
    <LocaleProvider defaultLoc={locale}>
      <GalleryContent />
    </LocaleProvider>
  );
}
