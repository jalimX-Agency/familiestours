'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { images, tourPackages } from '@/lib/images';
import { ArrowRight, Clock, Users, Signal, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function ToursPage() {
  const [expandedPackage, setExpandedPackage] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'adventure' | 'luxury' | 'family'>('all');

  const filteredPackages = tourPackages.filter(pkg => {
    if (filter === 'all') return true;
    if (filter === 'luxury') return pkg.luxury;
    if (filter === 'family') return !pkg.luxury;
    return true;
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.quadFamily})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-amber-400/50"></span>
            <span className="text-amber-400/80 text-xs tracking-[0.3em] uppercase">Curated Collection</span>
            <span className="w-8 h-[1px] bg-amber-400/50"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-6">
            Desert <span className="font-serif italic text-amber-400">Experiences</span>
          </h1>
          
          <p className="text-lg text-white/50 max-w-2xl mx-auto font-light">
            Each experience is meticulously crafted to offer your family an authentic journey 
            into the heart of Moroccan desert culture.
          </p>
        </div>
      </section>

      {/* Transport Banner */}
      <div className="bg-gradient-to-r from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 border-y border-emerald-500/20 py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
          <span className="text-emerald-400 font-medium">✦ Complimentary Hotel Transport Included in All Experiences</span>
          <span className="hidden sm:inline text-emerald-400/40">|</span>
          <span className="text-emerald-400/60 text-sm">Pickup & drop-off from your accommodation</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <section className="border-b border-white/10 sticky top-20 lg:top-24 bg-black/95 backdrop-blur-xl z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex gap-1 overflow-x-auto py-1">
            {[
              { key: 'all', label: 'All Experiences' },
              { key: 'family', label: 'Family Adventures' },
              { key: 'luxury', label: 'Luxury & Private' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`px-6 py-4 text-sm tracking-wider uppercase whitespace-nowrap transition-all duration-300 border-b-2 ${
                  filter === tab.key 
                    ? 'text-amber-400 border-amber-400' 
                    : 'text-white/40 border-transparent hover:text-white/70 hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="space-y-16 lg:space-y-24">
            {filteredPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                id={pkg.id.toString()}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  pkg.id % 2 === 0 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative group ${pkg.id % 2 === 0 ? 'lg:order-2' : ''}`}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-full aspect-[4/3] lg:aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Price Overlay on Image */}
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-white/50 text-xs tracking-wider uppercase mb-1">Starting from</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-amber-400 text-4xl lg:text-5xl font-light">{pkg.price}</span>
                            <span className="text-white/50 text-lg">MAD / person</span>
                          </div>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex gap-2">
                          {pkg.signature && (
                            <span className="px-3 py-1 bg-amber-400 text-black text-xs tracking-wider uppercase font-medium">
                              Signature
                            </span>
                          )}
                          {pkg.luxury && (
                            <span className="px-3 py-1 bg-zinc-800 text-white text-xs tracking-wider uppercase border border-white/10">
                              Luxury
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="absolute -bottom-4 -right-4 w-full h-full border border-amber-400/10 -z-10 hidden lg:block"></div>
                </div>

                {/* Content */}
                <div className={`${pkg.id % 2 === 0 ? 'lg:order-1' : ''}`}>
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 text-white/40 text-xs tracking-wider uppercase">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {pkg.duration}
                    </span>
                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                    <span className="flex items-center gap-2">
                      <Signal className="w-4 h-4" />
                      {pkg.difficulty}
                    </span>
                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {pkg.groupSize}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl lg:text-4xl font-light mb-3">
                    {pkg.title}
                  </h2>
                  <p className="text-amber-400/80 text-lg font-light italic mb-6">{pkg.subtitle}</p>

                  {/* Description */}
                  <p className="text-white/60 leading-relaxed mb-8">
                    {pkg.description}
                  </p>

                  {/* Features - Expandable */}
                  <div className="mb-8">
                    <button
                      onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
                      className="flex items-center justify-between w-full py-3 border-t border-b border-white/10 hover:border-amber-400/30 transition-colors duration-300 group"
                    >
                      <span className="text-sm tracking-wider uppercase text-white/70 group-hover:text-amber-400 transition-colors">
                        What&apos;s Included
                      </span>
                      {expandedPackage === pkg.id ? (
                        <ChevronUp className="w-4 h-4 text-amber-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    
                    {expandedPackage === pkg.id && (
                      <div className="pt-6 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {pkg.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span className="text-white/60 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Link 
                    href="/contact"
                    state={{ selectedPackage: pkg.id }}
                    className="group inline-flex items-center gap-4 px-8 py-4 bg-transparent border border-amber-400/50 text-amber-400 tracking-wider uppercase text-sm hover:bg-amber-400 hover:text-black transition-all duration-500"
                  >
                    Book This Experience
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Experience CTA */}
      <section className="py-32 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Something <span className="font-serif italic text-amber-400">Unique</span> in Mind?
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
            Every family is unique. Let us create a bespoke desert experience tailored precisely to your dreams and desires.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-medium tracking-wider uppercase text-sm hover:bg-amber-400 transition-colors duration-500"
          >
            Request Custom Experience
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
