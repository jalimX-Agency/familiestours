'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { images, tourPackages } from '@/lib/images';
import { useLocale, LocaleProvider } from '@/context/LocaleContext';
import { ArrowRight, Clock, Users, Signal, Check, ChevronDown, ChevronUp } from 'lucide-react';

function ToursContent() {
  const { locale, t } = useLocale();
  const [expandedPackage, setExpandedPackage] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'adventure' | 'luxury' | 'family'>('all');

  const filteredPackages = tourPackages.filter(pkg => {
    if (filter === 'all') return true;
    if (filter === 'luxury') return pkg.luxury;
    if (filter === 'family') return !pkg.luxury;
    return true;
  });

  return (
    <main className="min-h-screen dark:bg-black bg-white dark:text-white text-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.quadFamily})` }}
        >
          <div className="absolute inset-0 dark:bg-gradient-to-b bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
          <div className="absolute inset-0 dark:bg-gradient-to-r bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-amber-500/50"></span>
            <span className="text-amber-500/80 text-xs tracking-[0.3em] uppercase">{t.tours.pageTitle}</span>
            <span className="w-8 h-[1px] bg-amber-500/50"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-6">
            Desert <span className="font-serif italic text-amber-500">Experiences</span>
          </h1>
          
          <p className="text-lg dark:text-white/50 text-white/70 max-w-2xl mx-auto font-light">
            {t.tours.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Transport Banner */}
      <div className="dark:bg-gradient-to-r bg-gradient-to-r dark:from-emerald-900/30 from-emerald-50 dark:via-emerald-800/20 via-emerald-100 dark:to-emerald-900/30 to-emerald-50 dark:border-y border-y dark:border-emerald-500/20 border-emerald-200 py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">{t.tours.transportIncluded}</span>
          <span className="hidden sm:inline dark:text-emerald-400/40 text-emerald-300">|</span>
          <span className="dark:text-emerald-400/60 text-emerald-700 text-sm">{t.tours.transportDetail}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <section className="dark:border-b border-b dark:border-white/10 sticky top-20 lg:top-24 dark:bg-black/95 bg-white/95 backdrop-blur-xl z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex gap-1 overflow-x-auto py-1">
            {[
              { key: 'all', label: t.tours.allExperiences },
              { key: 'family', label: t.tours.familyAdventures },
              { key: 'luxury', label: t.tours.luxuryPrivate },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`px-6 py-4 text-sm tracking-wider uppercase whitespace-nowrap transition-all duration-300 border-b-2 ${
                  filter === tab.key 
                    ? 'text-amber-500 border-amber-500' 
                    : 'dark:text-white/40 text-gray-500 border-transparent hover:dark:text-white/70 hover:text-gray-700'
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
                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${pkg.id % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={`relative group ${pkg.id % 2 === 0 ? 'lg:order-2' : ''}`}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-full aspect-[4/3] lg:aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-white/50 text-xs tracking-wider uppercase mb-1">{t.tours.startingFrom}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-amber-500 text-4xl lg:text-5xl font-light">{pkg.price}</span>
                            <span className="text-white/50 text-lg">{t.tours.perPerson}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {pkg.signature && (
                            <span className="px-3 py-1 bg-amber-500 text-black text-xs tracking-wider uppercase font-medium">
                              {t.tours.signature}
                            </span>
                          )}
                          {pkg.luxury && (
                            <span className="px-3 py-1 dark:bg-zinc-800 bg-zinc-700 text-white text-xs tracking-wider uppercase dark:border border border-white/10">
                              {t.tours.luxury}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`absolute -bottom-4 -${pkg.id % 2 === 0 ? 'left' : 'right'}-4 w-full h-full border border-amber-500/10 -z-10 hidden lg:block`}></div>
                </div>

                <div className={`${pkg.id % 2 === 0 ? 'lg:order-1' : ''}`}>
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 dark:text-white/40 text-gray-500 text-xs tracking-wider uppercase mb-6">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{pkg.duration}</span>
                    <span className="w-1 h-1 dark:bg-white/20 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-2"><Signal className="w-4 h-4" />{pkg.difficulty}</span>
                    <span className="w-1 h-1 dark:bg-white/20 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" />{pkg.groupSize}</span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-light mb-3">
                    {pkg.id === 1 ? t.packageNames.camelDinner : 
                     pkg.id === 2 ? t.packageNames.quadDinner : 
                     pkg.id === 3 ? t.packageNames.ultimateCombo : 
                     pkg.id === 4 ? t.packageNames.sunriseBreakfast : 
                     t.packageNames.safari4x4}
                  </h2>
                  <p className="text-amber-500/80 text-lg font-light italic mb-6">{pkg.subtitle}</p>

                  <p className="dark:text-white/60 text-gray-600 leading-relaxed mb-8">
                    {pkg.description}
                  </p>

                  <div className="mb-8">
                    <button
                      onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
                      className="flex items-center justify-between w-full py-3 dark:border-t dark:border-b border-t border-b dark:border-white/10 border-gray-200 hover:border-amber-500/30 transition-colors duration-300 group"
                    >
                      <span className="text-sm tracking-wider uppercase dark:text-white/70 text-gray-700 group-hover:text-amber-500 transition-colors">
                        {t.tours.whatsIncluded}
                      </span>
                      {expandedPackage === pkg.id ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {expandedPackage === pkg.id && (
                      <div className="pt-6 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {pkg.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="dark:text-white/60 text-gray-600 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link 
                    href={`/${locale}/contact`}
                    className="group inline-flex items-center gap-4 px-8 py-4 bg-transparent border border-amber-500/50 text-amber-500 tracking-wider uppercase text-sm hover:bg-amber-500 hover:text-black transition-all duration-500"
                  >
                    {t.tours.bookThisExperience}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Experience CTA */}
      <section className="py-32 dark:bg-zinc-950 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            {t.tours.customTitle.split(' ')[0]} <span className="font-serif italic text-amber-500">{t.tours.customTitle.split(' ').slice(1).join(' ')}</span>?
          </h2>
          <p className="dark:text-white/50 text-gray-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.tours.customSubtitle}
          </p>
          <Link 
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-4 px-10 py-5 dark:bg-white bg-gray-900 text-black dark:text-black text-white font-medium tracking-wider uppercase text-sm dark:hover:bg-amber-500 hover:bg-amber-500 transition-colors duration-500"
          >
            {t.tours.requestCustom}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as any) || 'en';
  
  return (
    <LocaleProvider defaultLoc={locale}>
      <ToursContent />
    </LocaleProvider>
  );
}
