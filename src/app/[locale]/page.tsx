'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { images, tourPackages, testimonials } from '@/lib/images';
import { useLocale, LocaleProvider } from '@/context/LocaleContext';
import { ArrowRight, Star, Play } from 'lucide-react';

function HomeContent() {
  const { locale, t } = useLocale();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen dark:bg-black bg-white dark:text-white text-gray-900 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section - Cinematic Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${images.hero})` }}
        >
          <div className="absolute inset-0 dark:bg-gradient-to-b bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
          <div className="absolute inset-0 dark:bg-gradient-to-r bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        </div>
        
        <div className="absolute top-1/4 left-10 w-px h-32 dark:bg-gradient-to-b bg-gradient-to-b from-transparent via-amber-500/50 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-10 w-px h-32 dark:bg-gradient-to-b bg-gradient-to-b from-transparent via-amber-500/50 to-transparent hidden lg:block"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-12 h-[1px] bg-amber-500/50"></span>
            <span className="text-amber-500/80 text-xs tracking-[0.3em] uppercase">{t.hero.location}</span>
            <span className="w-12 h-[1px] bg-amber-500/50"></span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-tight mb-8">
            <span className="block dark:text-white text-white">{t.hero.title1}</span>
            <span className="block font-serif italic text-amber-500 mt-2">{t.hero.title2}</span>
          </h1>
          
          <p className="text-lg md:text-xl dark:text-white/60 text-white/80 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href={`/${locale}/tours`}
              className="group relative px-10 py-4 bg-transparent border border-amber-500/50 text-amber-500 tracking-wider uppercase text-sm hover:bg-amber-500 hover:text-black transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-3">
                {t.hero.discover}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              href={`/${locale}/gallery`}
              className="group px-10 py-4 dark:text-white/70 text-white/90 tracking-wider uppercase text-sm hover:dark:text-white hover:text-white transition-colors duration-300 flex items-center gap-3"
            >
              <Play className="w-4 h-4" />
              {t.hero.viewGallery}
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="dark:text-white/30 text-white/40 text-xs tracking-widest uppercase rotate-90 origin-center translate-y-8">{t.hero.scroll}</span>
          <div className="w-[1px] h-16 dark:bg-gradient-to-b bg-gradient-to-b from-white/30 to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* Featured Experiences Preview */}
      <section className="py-32 dark:bg-black bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-amber-500/80 text-xs tracking-[0.3em] uppercase block mb-4">{t.home.curatedForYou}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light">
                {t.home.signatureExperiences.split(' ')[0]} <span className="font-serif italic text-amber-500">{t.home.signatureExperiences.split(' ').slice(1).join(' ')}</span>
              </h2>
            </div>
            <Link 
              href={`/${locale}/tours`}
              className="group inline-flex items-center gap-3 dark:text-white/60 text-gray-600 hover:text-amber-500 transition-colors duration-300"
            >
              <span className="text-sm tracking-wider uppercase">{t.home.viewAllExperiences}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {tourPackages.slice(0, 3).map((pkg) => (
              <Link 
                key={pkg.id} 
                href={`/${locale}/tours#${pkg.id}`}
                className="group relative overflow-hidden dark:bg-zinc-900/50 bg-gray-50 dark:border border border-gray-100 hover:border-amber-500/30 transition-all duration-500"
              >
                <div className="relative h-72 lg:h-80 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  
                  <div className="absolute top-6 right-6">
                    <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10">
                      <span className="text-amber-500 font-light text-2xl">{pkg.price}</span>
                      <span className="text-white/50 text-xs ml-1">MAD</span>
                    </div>
                  </div>
                  
                  {(pkg.signature || pkg.luxury) && (
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-amber-500 text-black text-xs tracking-wider uppercase font-medium">
                        {pkg.luxury ? 'Luxury' : 'Signature'}
                      </span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl lg:text-3xl font-light mb-2 group-hover:text-amber-500 transition-colors duration-300 text-white">
                      {pkg.id === 1 ? t.packageNames.camelDinner : 
                       pkg.id === 2 ? t.packageNames.quadDinner : 
                       pkg.id === 3 ? t.packageNames.ultimateCombo : 
                       pkg.id === 4 ? t.packageNames.sunriseBreakfast : 
                       t.packageNames.safari4x4}
                    </h3>
                    <p className="text-white/50 text-sm">{pkg.subtitle}</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-6 dark:text-white/40 text-gray-500 text-xs tracking-wider uppercase mb-4">
                    <span>{pkg.duration}</span>
                    <span className="w-1 h-1 dark:bg-white/20 bg-gray-300 rounded-full"></span>
                    <span>{pkg.difficulty}</span>
                  </div>
                  <p className="dark:text-white/60 text-gray-600 text-sm leading-relaxed line-clamp-2">
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
          <span className="text-amber-500/60 text-6xl font-serif">&ldquo;</span>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed dark:text-white/90 text-white -mt-4">
            {t.home.quote.split('—')[0]}
            <br />
            <span className="font-serif italic text-amber-500">{
              t.home.quote.includes('—') ? t.home.quote.split('—')[0].split('.').pop() || '' : ''
            }</span>
          </blockquote>
          <span className="text-amber-500/60 text-6xl font-serif block text-right">&rdquo;</span>
          
          <div className="mt-12 flex items-center justify-center gap-4">
            <span className="w-12 h-[1px] bg-amber-500/30"></span>
            <span className="dark:text-white/40 text-white/60 text-sm tracking-widest uppercase">{t.home.quoteAuthor}</span>
            <span className="w-12 h-[1px] bg-amber-500/30"></span>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-32 dark:bg-zinc-950 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <span className="text-amber-500/80 text-xs tracking-[0.3em] uppercase block mb-4">{t.home.difference}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light">
              {t.home.whyChooseUs.split(' ')[0]} Families Choose <span className="font-serif italic text-amber-500">{t.home.whyChooseUs.split(' ').slice(-2).join(' ')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px dark:bg-white/5 bg-gray-200">
            {t.home.values.map((value, idx) => (
              <div key={idx} className="dark:bg-zinc-950 bg-white p-10 lg:p-12 group dark:hover:bg-zinc-900 hover:bg-gray-100 transition-colors duration-500">
                <span className="text-amber-500/20 text-6xl font-light block mb-6">0{idx + 1}</span>
                <h3 className="text-xl font-light mb-4 group-hover:text-amber-500 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="dark:text-white/50 text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-32 dark:bg-black bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative hidden lg:block">
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={images.family} 
                  alt="Happy family in desert"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-amber-500/20 -z-10"></div>
            </div>
            
            <div>
              <span className="text-amber-500/80 text-xs tracking-[0.3em] uppercase block mb-8">{t.home.guestStories}</span>
              
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
                        <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    
                    <blockquote className="text-xl md:text-2xl font-light leading-relaxed dark:text-white/80 text-gray-700 mb-8 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                        <span className="text-amber-500 font-medium">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium dark:text-white text-gray-900">{testimonial.name}</p>
                        <p className="dark:text-white/50 text-gray-500 text-sm">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 mt-12">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-[2px] transition-all duration-500 ${
                      currentTestimonial === idx ? 'w-12 bg-amber-500' : 'w-6 dark:bg-white/20 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 dark:bg-gradient-to-b bg-gradient-to-b from-zinc-950 to-black from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-amber-500/80 text-xs tracking-[0.3em] uppercase block mb-6">{t.home.beginJourney}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">
            {t.home.ctaTitle.split(' ')[0]} to Create <span className="font-serif italic text-amber-500">{t.home.ctaTitle.split(' ').slice(1).join(' ')}</span>?
          </h2>
          <p className="dark:text-white/50 text-gray-600 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.home.ctaSubtitle}
          </p>
          <Link 
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium tracking-wider uppercase text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-500 shadow-lg shadow-amber-500/25 group"
          >
            {t.home.reserveExperience}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as any) || 'en';
  
  return (
    <LocaleProvider defaultLoc={locale}>
      <HomeContent />
    </LocaleProvider>
  );
}
