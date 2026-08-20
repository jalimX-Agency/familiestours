'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { images, tourPackages, testimonials } from '@/lib/images';
import { ArrowRight, Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section - Cinematic Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${images.hero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-transparent via-amber-400/50 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-10 w-px h-32 bg-gradient-to-b from-transparent via-amber-400/50 to-transparent hidden lg:block"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
          {/* Small Label */}
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-12 h-[1px] bg-amber-400/50"></span>
            <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase">Morocco • Sahara Desert</span>
            <span className="w-12 h-[1px] bg-amber-400/50"></span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-tight mb-8">
            <span className="block">Where Golden Dunes</span>
            <span className="block font-serif italic text-amber-400 mt-2">Meet Family Dreams</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Curated desert experiences that weave together adventure, culture, 
            and unforgettable family moments in the heart of Morocco.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/tours"
              className="group relative px-10 py-4 bg-transparent border border-amber-400/50 text-amber-400 tracking-wider uppercase text-sm hover:bg-amber-400 hover:text-black transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-3">
                Discover Experiences
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              href="/gallery"
              className="group px-10 py-4 text-white/70 tracking-wider uppercase text-sm hover:text-white transition-colors duration-300 flex items-center gap-3"
            >
              <Play className="w-4 h-4" />
              View Gallery
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-white/30 text-xs tracking-widest uppercase rotate-90 origin-center translate-y-8">Scroll</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* Featured Experiences Preview */}
      <section className="py-32 bg-black relative">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase block mb-4">Curated For You</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light">
                Signature <span className="font-serif italic text-amber-400">Experiences</span>
              </h2>
            </div>
            <Link 
              href="/tours"
              className="group inline-flex items-center gap-3 text-white/60 hover:text-amber-400 transition-colors duration-300"
            >
              <span className="text-sm tracking-wider uppercase">View All Experiences</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Experience Cards - Horizontal Scroll on Mobile */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {tourPackages.slice(0, 3).map((pkg, idx) => (
              <Link 
                key={pkg.id} 
                href={`/tours#${pkg.id}`}
                className="group relative overflow-hidden bg-zinc-900/50 border border-white/5 hover:border-amber-400/30 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-72 lg:h-80 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  
                  {/* Price Tag */}
                  <div className="absolute top-6 right-6">
                    <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10">
                      <span className="text-amber-400 font-light text-2xl">{pkg.price}</span>
                      <span className="text-white/50 text-xs ml-1">MAD</span>
                    </div>
                  </div>
                  
                  {/* Badge for signature/luxury */}
                  {(pkg.signature || pkg.luxury) && (
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-amber-400 text-black text-xs tracking-wider uppercase font-medium">
                        {pkg.luxury ? 'Luxury' : 'Signature'}
                      </span>
                    </div>
                  )}
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl lg:text-3xl font-light mb-2 group-hover:text-amber-400 transition-colors duration-300">
                      {pkg.title}
                    </h3>
                    <p className="text-white/50 text-sm">{pkg.subtitle}</p>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-6 text-white/40 text-xs tracking-wider uppercase mb-4">
                    <span>{pkg.duration}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                    <span>{pkg.difficulty}</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                    {pkg.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive Quote Section */}
      <section className="relative py-40 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${images.camp})` }}
        >
          <div className="absolute inset-0 bg-black/80"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-amber-400/60 text-6xl font-serif">&ldquo;</span>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-white/90 -mt-4">
            The desert has a voice for those who listen—
            <br />
            <span className="font-serif italic text-amber-400">it speaks of timelessness, wonder, and the joy of shared moments under infinite stars.</span>
          </blockquote>
          <span className="text-amber-400/60 text-6xl font-serif block text-right">&rdquo;</span>
          
          <div className="mt-12 flex items-center justify-center gap-4">
            <span className="w-12 h-[1px] bg-amber-400/30"></span>
            <span className="text-white/40 text-sm tracking-widest uppercase">Berber Proverb</span>
            <span className="w-12 h-[1px] bg-amber-400/30"></span>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Elegant Grid */}
      <section className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase block mb-4">The Difference</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light">
              Why Families Choose <span className="font-serif italic text-amber-400">Us</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {[
              {
                number: '01',
                title: 'Complimentary Transport',
                description: 'Luxury hotel pickup and return included in every experience',
                icon: '🚐'
              },
              {
                number: '02', 
                title: 'Family-Centered Design',
                description: 'Every activity crafted for multi-generational enjoyment and safety',
                icon: '👨‍👩‍👧‍👦'
              },
              {
                number: '03',
                title: 'Authentic Hospitality',
                description: 'Traditional Berber families welcome you as honored guests',
                icon: '✨'
              },
              {
                number: '04',
                title: 'Local Expertise',
                description: 'Guides who have walked these dunes for generations',
                icon: '🧭'
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-zinc-950 p-10 lg:p-12 group hover:bg-zinc-900 transition-colors duration-500">
                <span className="text-amber-400/20 text-6xl font-light block mb-6">{item.number}</span>
                <h3 className="text-xl font-light mb-4 group-hover:text-amber-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className="relative hidden lg:block">
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={images.family} 
                  alt="Happy family in desert"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              {/* Decorative Frame */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-amber-400/20 -z-10"></div>
            </div>
            
            {/* Right - Testimonial */}
            <div>
              <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase block mb-8">Guest Stories</span>
              
              <div className="relative min-h-[350px]">
                {testimonials.map((testimonial, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ${
                      currentTestimonial === idx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
                    }`}
                  >
                    <div className="flex gap-2 mb-8">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-white/80 mb-8 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                        <span className="text-amber-400 font-medium">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-white/50 text-sm">{testimonial.location}</p>
                        <p className="text-amber-400/60 text-xs mt-1">{testimonial.tour}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Dots */}
              <div className="flex gap-3 mt-12">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-[2px] transition-all duration-500 ${
                      currentTestimonial === idx ? 'w-12 bg-amber-400' : 'w-6 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-b from-zinc-950 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase block mb-6">Begin Your Journey</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">
            Ready to Create <span className="font-serif italic text-amber-400">Timeless Memories?</span>
          </h2>
          <p className="text-white/50 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Let us craft your perfect desert escape. Every detail tailored to your family&apos;s dreams.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium tracking-wider uppercase text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-500 shadow-lg shadow-amber-500/25 group"
          >
            Reserve Your Experience
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
