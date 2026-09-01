'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { images, tourPackages } from '@/lib/images';
import { useLocale } from '@/context/LocaleContext';
import { ArrowRight, Clock, Users, Signal, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function ToursContent() {
  const { locale, t } = useLocale();
  const [expandedPackage, setExpandedPackage] = useState<string | number | null>(null);
  const [filter, setFilter] = useState<'all' | 'adventure' | 'luxury' | 'family'>('all');
  const [packages, setPackages] = useState<any[]>(tourPackages);

  useState(() => {
    fetch('/api/tours')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.tours) && data.tours.length > 0) {
          setPackages(data.tours);
        }
      })
      .catch(() => {});
  });

  const filteredPackages = packages.filter(pkg => {
    if (filter === 'all') return true;
    if (filter === 'luxury') return pkg.luxury || pkg.highlight;
    if (filter === 'family') return !pkg.luxury;
    return true;
  });

  return (
    <main className="min-h-screen dark:bg-[#0c0d0f] bg-[#faf8f5] dark:text-zinc-100 text-stone-900 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[460px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.quadFamily})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-amber-400"></span>
            <span className="text-amber-400 text-xs tracking-[0.35em] uppercase font-semibold drop-shadow-sm">{t.tours.pageTitle}</span>
            <span className="w-8 h-[1px] bg-amber-400"></span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-6 text-white drop-shadow-md">
            Desert <span className="font-serif italic text-amber-400">Experiences</span>
          </h1>

          <p className="text-lg text-white/90 max-w-2xl mx-auto font-light drop-shadow-sm">
            {t.tours.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Transport Banner */}
      <div className="dark:bg-emerald-950/40 bg-emerald-50/90 dark:border-y border-y dark:border-emerald-500/20 border-emerald-200/80 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{t.tours.transportIncluded}</span>
          <span className="hidden sm:inline text-emerald-300 dark:text-emerald-500/40">|</span>
          <span className="dark:text-emerald-300/80 text-emerald-800 text-sm font-medium">{t.tours.transportDetail}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <section className="dark:border-b border-b dark:border-white/10 border-stone-200 sticky top-20 lg:top-24 dark:bg-zinc-950/95 bg-white/95 backdrop-blur-xl z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex gap-2 overflow-x-auto py-1">
            {[
              { key: 'all', label: t.tours.allExperiences },
              { key: 'family', label: t.tours.familyAdventures },
              { key: 'luxury', label: t.tours.luxuryPrivate },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`px-6 py-4 text-sm tracking-wider uppercase whitespace-nowrap transition-all duration-300 border-b-2 font-medium ${
                  filter === tab.key
                    ? 'text-amber-500 border-amber-500 font-semibold'
                    : 'dark:text-zinc-400 text-stone-500 border-transparent hover:dark:text-white hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 lg:py-28 dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="space-y-16 lg:space-y-24">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                id={pkg.id.toString()}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-14 items-center p-6 lg:p-10 rounded-2xl dark:bg-zinc-900/60 bg-white dark:border dark:border-white/10 border border-stone-200/90 shadow-lg shadow-stone-900/5 hover:shadow-2xl hover:border-amber-500/30 transition-all duration-500 ${
                  pkg.id % 2 === 0 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`relative group overflow-hidden rounded-xl ${pkg.id % 2 === 0 ? 'lg:order-2' : ''}`}>
                  <div className="relative overflow-hidden aspect-[4/3] lg:aspect-[4/3]">
                    <img
                      src={pkg.mainImage || pkg.image || 'https://cdn.familiestours.com/tours/camel.jpg'}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-white/70 text-xs tracking-wider uppercase mb-1 font-medium">{t.tours.startingFrom}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-amber-400 text-4xl lg:text-5xl font-light">{pkg.price}</span>
                            <span className="text-white/80 text-base font-medium">{t.tours.perPerson}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {pkg.signature && (
                            <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs tracking-wider uppercase font-bold rounded-sm shadow-md">
                              {t.tours.signature}
                            </span>
                          )}
                          {(pkg.luxury || pkg.highlight) && (
                            <span className="px-3 py-1 bg-black/80 text-amber-400 text-xs tracking-wider uppercase border border-amber-500/40 rounded-sm shadow-md font-semibold">
                              {pkg.luxury ? t.tours.luxury : 'Featured'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${pkg.id % 2 === 0 ? 'lg:order-1' : ''}`}>
                  <div className="flex flex-wrap items-center gap-4 dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase mb-4 font-medium">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500" />{pkg.duration}</span>
                    <span className="w-1 h-1 dark:bg-zinc-600 bg-stone-300 rounded-full"></span>
                    <span className="flex items-center gap-1.5"><Signal className="w-4 h-4 text-amber-500" />{pkg.difficulty}</span>
                    <span className="w-1 h-1 dark:bg-zinc-600 bg-stone-300 rounded-full"></span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-amber-500" />{pkg.groupSize}</span>
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-light mb-2 dark:text-white text-stone-900">
                    {pkg.title}
                  </h2>
                  <p className="text-amber-500 text-base font-normal italic mb-5">{pkg.subtitle}</p>

                  <p className="dark:text-zinc-300 text-stone-600 leading-relaxed mb-6 text-sm">
                    {pkg.description}
                  </p>

                  <div className="mb-6">
                    <button
                      onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
                      className="flex items-center justify-between w-full py-3 dark:border-t dark:border-b border-t border-b dark:border-white/10 border-stone-200 hover:border-amber-500/40 transition-colors duration-300 group"
                    >
                      <span className="text-xs tracking-wider uppercase font-semibold dark:text-zinc-300 text-stone-700 group-hover:text-amber-500 transition-colors">
                        {t.tours.whatsIncluded}
                      </span>
                      {expandedPackage === pkg.id ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {expandedPackage === pkg.id && (
                      <div className="pt-5 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {pkg.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="dark:text-zinc-300 text-stone-600 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/${locale}/contact`}
                    className="group inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold tracking-wider uppercase text-xs hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-md shadow-amber-500/25 rounded-sm"
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
      <section className="py-28 dark:bg-[#121418] bg-stone-100/80 border-t dark:border-white/5 border-stone-200/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-5 dark:text-white text-stone-900">
            {t.tours.customTitle.split(' ')[0]} <span className="font-serif italic text-amber-500">{t.tours.customTitle.split(' ').slice(1).join(' ')}</span>?
          </h2>
          <p className="dark:text-zinc-300 text-stone-600 text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.tours.customSubtitle}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-4 px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold tracking-wider uppercase text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-xl shadow-amber-500/25 rounded-sm"
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
