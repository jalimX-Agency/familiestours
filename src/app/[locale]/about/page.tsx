'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { images } from '@/lib/images';
import { useLocale, LocaleProvider } from '@/context/LocaleContext';
import { Heart, Globe, Award, Users, Sparkles, TreePine } from 'lucide-react';

function AboutContent() {
  const { t } = useLocale();

  const values = [
    { icon: <Heart className="w-8 h-8" />, ...t.about.values[0] },
    { icon: <Globe className="w-8 h-8" />, ...t.about.values[1] },
    { icon: <Award className="w-8 h-8" />, ...t.about.values[2] },
    { icon: <Users className="w-8 h-8" />, ...t.about.values[3] },
    { icon: <Sparkles className="w-8 h-8" />, ...t.about.values[4] },
    { icon: <TreePine className="w-8 h-8" />, ...t.about.values[5] },
  ];

  return (
    <main className="min-h-screen dark:bg-[#0c0d0f] bg-[#faf8f5] dark:text-zinc-100 text-stone-900 transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[460px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.camelCaravan})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-amber-400"></span>
            <span className="text-amber-400 text-xs tracking-[0.35em] uppercase font-semibold drop-shadow-sm">{t.about.since}</span>
            <span className="w-8 h-[1px] bg-amber-400"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-6 text-white drop-shadow-md">
            Our <span className="font-serif italic text-amber-400">Story</span>
          </h1>
          
          <p className="text-lg text-white/90 max-w-2xl mx-auto font-light drop-shadow-sm">
            {t.about.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28 dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl border dark:border-white/10 border-stone-200">
                <img 
                  src={images.family} 
                  alt="Happy family in Agafay desert"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 w-full h-full border border-amber-500/20 rounded-2xl -z-10 hidden lg:block"></div>
              
              <div className="absolute -right-4 top-1/4 dark:bg-zinc-900/95 bg-white/95 backdrop-blur-md dark:border border border-stone-200 dark:border-white/10 p-6 rounded-xl shadow-xl hidden md:block">
                <div className="text-4xl font-light text-amber-500 mb-1">15+</div>
                <div className="dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase font-semibold">{t.about.yearsOfExperienceLabel}</div>
              </div>
            </div>

            <div>
              <span className="text-amber-500 font-semibold text-xs tracking-[0.3em] uppercase block mb-4">{t.about.theBeginning}</span>
              
              <h2 className="text-3xl lg:text-4xl font-light mb-6 leading-tight dark:text-white text-stone-900">
                {t.about.storyTitle}
              </h2>
              
              <div className="space-y-5 dark:text-zinc-300 text-stone-600 leading-relaxed text-base">
                <p>{t.about.storyP1}</p>
                <p>{t.about.storyP2}</p>
                <p>{t.about.storyP3}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Divider */}
      <section className="py-20 relative overflow-hidden dark:bg-[#121418] bg-stone-100/80 border-y dark:border-white/5 border-stone-200/80">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-amber-500/40 text-6xl font-serif block mb-4">&ldquo;</span>
          <blockquote className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed dark:text-zinc-200 text-stone-800 italic">
            {t.about.founderQuote}
          </blockquote>
          <p className="mt-6 text-amber-500 font-semibold text-xs tracking-widest uppercase">{t.about.founderName}</p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-semibold text-xs tracking-[0.3em] uppercase block mb-3">{t.about.guidesUs}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light dark:text-white text-stone-900">
              {t.about.coreValues.split(' ')[0]} <span className="font-serif italic text-amber-500">{t.about.coreValues.split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <div 
                key={idx} 
                className="dark:bg-zinc-900/60 bg-white p-8 lg:p-10 rounded-xl dark:border dark:border-white/10 border border-stone-200/90 shadow-sm hover:shadow-xl dark:hover:border-amber-500/40 hover:border-amber-500/40 transition-all duration-300 group"
              >
                <div className="text-amber-500 mb-5 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-medium mb-3 dark:text-zinc-100 text-stone-900 group-hover:text-amber-500 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="dark:text-zinc-400 text-stone-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-20 dark:bg-[#0c0d0f] bg-[#faf8f5] border-t dark:border-white/5 border-stone-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl dark:bg-zinc-900/40 bg-white border dark:border-white/10 border-stone-200/80 shadow-sm">
              <div className="text-4xl lg:text-5xl font-light text-amber-500 mb-2">{t.about.yearsOfExperience}</div>
              <div className="dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase font-semibold">{t.about.yearsOfExperienceLabel}</div>
            </div>
            <div className="text-center p-6 rounded-xl dark:bg-zinc-900/40 bg-white border dark:border-white/10 border-stone-200/80 shadow-sm">
              <div className="text-4xl lg:text-5xl font-light text-amber-500 mb-2">{t.about.happyGuests}</div>
              <div className="dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase font-semibold">{t.about.happyGuestsLabel}</div>
            </div>
            <div className="text-center p-6 rounded-xl dark:bg-zinc-900/40 bg-white border dark:border-white/10 border-stone-200/80 shadow-sm">
              <div className="text-4xl lg:text-5xl font-light text-amber-500 mb-2">{t.about.familyOwned}</div>
              <div className="dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase font-semibold">{t.about.familyOwnedLabel}</div>
            </div>
            <div className="text-center p-6 rounded-xl dark:bg-zinc-900/40 bg-white border dark:border-white/10 border-stone-200/80 shadow-sm">
              <div className="text-4xl lg:text-5xl font-light text-amber-500 mb-2">{t.about.averageRating}</div>
              <div className="dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase font-semibold">{t.about.averageRatingLabel}</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as any) || 'en';
  
  return (
    <LocaleProvider defaultLoc={locale}>
      <AboutContent />
    </LocaleProvider>
  );
}
