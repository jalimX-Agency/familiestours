'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { images } from '@/lib/images';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = ['All', 'Camels', 'Adventure', 'Camp', 'Nature'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof images.gallery[0] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.camp})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-amber-400/50"></span>
            <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase">Visual Journey</span>
            <span className="w-8 h-[1px] bg-amber-400/50"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            Desert <span className="font-serif italic text-amber-400">Gallery</span>
          </h1>
          
          <p className="text-white/50 font-light">
            Glimpses of the magic that awaits your family
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-20 lg:top-24 z-30 bg-black/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 text-sm tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-amber-400 text-black' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <span className="hidden md:block text-white/30 text-sm">
            {filteredImages.length} photos
          </span>
        </div>
      </section>

      {/* Gallery Grid - Masonry Style */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredImages.map((image, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(image, idx)}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden"
              >
                <div className={`${idx % 5 === 0 ? 'row-span-2' : ''}`}>
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full object-cover transition-all duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end p-6 opacity-0 group-hover:opacity-100">
                  <div>
                    <p className="text-white font-light">{image.alt}</p>
                    <p className="text-amber-400/60 text-xs uppercase tracking-wider mt-1">{image.category}</p>
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
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation */}
          <button 
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
            className="absolute left-4 lg:left-8 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
            className="absolute right-4 lg:right-8 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image Container */}
          <div 
            className="max-w-5xl max-h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="max-w-full max-h-[75vh] object-contain"
            />
            
            {/* Caption */}
            <div className="mt-4 text-center">
              <p className="text-white font-light text-lg">{selectedImage.alt}</p>
              <p className="text-amber-400/60 text-xs uppercase tracking-widest mt-1">{selectedImage.category}</p>
            </div>
            
            {/* Counter */}
            <p className="text-center text-white/30 text-sm mt-4">
              {selectedIndex + 1} / {filteredImages.length}
            </p>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Ready to Create Your Own <span className="font-serif italic text-amber-400">Desert Memories?</span>
          </h2>
          <p className="text-white/50 mb-10 max-w-2xl mx-auto">
            These moments are waiting for your family. Let us craft your perfect desert experience.
          </p>
          <a 
            href="/contact"
            className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium tracking-wider uppercase text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-500"
          >
            Start Your Journey
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
