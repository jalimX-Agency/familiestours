'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { images, tourPackages, testimonials } from '@/lib/images';
import { useLocale } from '@/context/LocaleContext';
import { ArrowRight, Star, Play } from 'lucide-react';

const heroTextVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function HomeContent() {
  const { locale, t } = useLocale();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [livePackages, setLivePackages] = useState<any[]>(tourPackages);
  const [liveReviews, setLiveReviews] = useState<any[]>(testimonials);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const videoScale = useTransform(heroProgress, [0, 1], [1, 1.18]);
  const videoBlur = useTransform(heroProgress, [0, 1], [0, 6]);
  const videoFilter = useTransform(videoBlur, (v) => `blur(${v}px)`);
  const overlayOpacity = useTransform(heroProgress, [0, 1], [0.15, 0.65]);

  useEffect(() => {
    fetch('/api/tours')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.tours) && data.tours.length > 0) {
          setLivePackages(data.tours);
        }
      })
      .catch(() => {});

    fetch('/api/reviews?publishedOnly=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setLiveReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (liveReviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % liveReviews.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [liveReviews.length]);

  return (
    <main className="min-h-screen dark:bg-[#0c0d0f] bg-[#faf8f5] dark:text-zinc-100 text-stone-900 overflow-x-hidden transition-colors duration-300">
      <Navbar />

      {/* Hero Section - Cinematic Full Screen with Clear Video */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background - scales up and softens as you scroll past the hero */}
        <motion.div className="absolute inset-0" style={{ scale: videoScale, filter: videoFilter }}>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={`${process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.familiestours.com'}/videos/hero-poster.jpg`}
          >
            <source
              src={`${process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.familiestours.com'}/videos/hero.mp4`}
              type="video/mp4"
            />
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${images.hero})` }}
            />
          </video>
        </motion.div>
        {/* Overlays: subtle at rest, deepen as the video scales/blurs on scroll */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }}></motion.div>

        <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-10 w-px h-32 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent hidden lg:block"></div>

        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          variants={heroTextVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={heroItemVariants} className="inline-flex items-center gap-3 mb-6">
            <span className="w-12 h-[1px] bg-amber-400"></span>
            <span className="font-mono text-amber-400 text-xs tracking-[0.35em] uppercase font-medium drop-shadow-sm">{t.hero.location}</span>
            <span className="w-12 h-[1px] bg-amber-400"></span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
            <motion.span
              variants={heroItemVariants}
              className="block text-white font-display font-semibold tracking-tight"
            >
              {t.hero.title1}
            </motion.span>
            <motion.span
              variants={heroItemVariants}
              className="block font-serif italic text-amber-400 mt-2"
            >
              {t.hero.title2}
            </motion.span>
          </h1>

          <motion.p
            variants={heroItemVariants}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={`/${locale}/tours`}
              className="group relative px-10 py-4 bg-amber-500 text-black font-semibold tracking-wider uppercase text-sm hover:bg-amber-400 transition-all duration-300 shadow-xl shadow-amber-500/25 rounded-sm"
            >
              <span className="relative z-10 flex items-center gap-3">
                {t.hero.discover}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href={`/${locale}/gallery`}
              className="group px-10 py-4 text-white/95 border border-white/30 backdrop-blur-sm tracking-wider uppercase text-sm hover:bg-white/15 hover:text-white transition-all duration-300 flex items-center gap-3 rounded-sm"
            >
              <Play className="w-4 h-4 text-amber-400" />
              {t.hero.viewGallery}
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none">
          <span className="font-mono text-white/60 text-xs tracking-widest uppercase rotate-90 origin-center translate-y-8 drop-shadow-sm">{t.hero.scroll}</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* Featured Experiences Preview */}
      <section className="py-28 lg:py-36 dark:bg-[#0c0d0f] bg-[#faf8f5] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-amber-500 font-semibold text-xs tracking-[0.3em] uppercase block mb-3">{t.home.curatedForYou}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light dark:text-white text-stone-900">
                {t.home.signatureExperiences.split(' ')[0]} <span className="font-serif italic text-amber-500">{t.home.signatureExperiences.split(' ').slice(1).join(' ')}</span>
              </h2>
            </div>
            <Link
              href={`/${locale}/tours`}
              className="group inline-flex items-center gap-3 dark:text-zinc-400 text-stone-600 hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-300 font-medium"
            >
              <span className="text-sm tracking-wider uppercase">{t.home.viewAllExperiences}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {livePackages.slice(0, 3).map((pkg) => (
              <Link
                key={pkg.id}
                href={`/${locale}/tours#${pkg.id}`}
                className="group relative overflow-hidden rounded-xl dark:bg-zinc-900/70 bg-white dark:border dark:border-white/10 border border-stone-200 shadow-lg shadow-stone-900/5 hover:shadow-2xl hover:border-amber-500/50 hover:-translate-y-1.5 transition-all duration-500 flex flex-col"
              >
                <div className="relative h-72 lg:h-80 overflow-hidden">
                  <img
                    src={pkg.mainImage || pkg.image || 'https://cdn.familiestours.com/tours/camel.jpg'}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

                  <div className="absolute top-5 right-5">
                    <div className="px-4 py-1.5 bg-black/70 backdrop-blur-md border border-white/15 rounded-md shadow-md">
                      <span className="font-mono text-amber-400 font-semibold text-2xl">{pkg.price}</span>
                      <span className="text-white/70 text-xs ml-1 font-medium">MAD</span>
                    </div>
                  </div>

                  {(pkg.signature || pkg.luxury) && (
                    <div className="absolute top-5 left-5">
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs tracking-wider uppercase font-bold rounded-sm shadow-sm">
                        {pkg.luxury ? 'Luxury' : 'Signature'}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-light mb-1 group-hover:text-amber-400 transition-colors duration-300 text-white drop-shadow-sm">
                      {pkg.title}
                    </h3>
                    <p className="text-white/75 text-sm font-light">{pkg.subtitle}</p>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-4 dark:text-zinc-400 text-stone-500 text-xs tracking-wider uppercase mb-3 font-medium">
                    <span>{pkg.duration}</span>
                    <span className="w-1 h-1 dark:bg-zinc-600 bg-stone-300 rounded-full"></span>
                    <span>{pkg.difficulty}</span>
                  </div>
                  <p className="dark:text-zinc-300 text-stone-600 text-sm leading-relaxed line-clamp-2">
                    {pkg.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive Quote Section */}
      <section className="relative py-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${images.camp})` }}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-amber-400/80 text-6xl font-serif">&ldquo;</span>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-white drop-shadow-md -mt-4">
            {t.home.quote.split('—')[0]}
            <br />
            <span className="font-serif italic text-amber-400">{
              t.home.quote.includes('—') ? t.home.quote.split('—')[0].split('.').pop() || '' : ''
            }</span>
          </blockquote>
          <span className="text-amber-400/80 text-6xl font-serif block text-right">&rdquo;</span>

          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="w-12 h-[1px] bg-amber-400/50"></span>
            <span className="text-white/80 text-sm tracking-widest uppercase font-medium">{t.home.quoteAuthor}</span>
            <span className="w-12 h-[1px] bg-amber-400/50"></span>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-28 lg:py-36 dark:bg-[#121418] bg-stone-100/70 border-y dark:border-white/5 border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-semibold text-xs tracking-[0.3em] uppercase block mb-3">{t.home.difference}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light dark:text-white text-stone-900">
              {t.home.whyChooseUs.split(' ')[0]} Families Choose <span className="font-serif italic text-amber-500">{t.home.whyChooseUs.split(' ').slice(-2).join(' ')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.home.values.map((value, idx) => (
              <div
                key={idx}
                className="dark:bg-zinc-900/60 bg-white p-8 lg:p-10 rounded-xl dark:border dark:border-white/10 border border-stone-200/80 shadow-sm hover:shadow-xl dark:hover:border-amber-500/40 hover:border-amber-500/40 transition-all duration-300 group"
              >
                <span className="text-amber-500/30 text-5xl font-light block mb-4 group-hover:text-amber-500/60 transition-colors">0{idx + 1}</span>
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

      {/* Testimonials Carousel */}
      <section className="py-28 lg:py-36 dark:bg-[#0c0d0f] bg-[#faf8f5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative hidden lg:block">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl border dark:border-white/10 border-stone-200">
                <img
                  src={images.family}
                  alt="Happy family in Agafay desert"
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 w-full h-full border border-amber-500/30 rounded-2xl -z-10"></div>
            </div>

            <div>
              <span className="text-amber-500 font-semibold text-xs tracking-[0.3em] uppercase block mb-6">{t.home.guestStories}</span>

              <div className="relative min-h-[320px]">
                {liveReviews.map((testimonial, idx) => (
                  <div
                    key={testimonial.id || idx}
                    className={`absolute inset-0 transition-all duration-700 ${
                      currentTestimonial === idx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
                    }`}
                  >
                    <div className="flex gap-1.5 mb-6">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <blockquote className="text-xl md:text-2xl font-light leading-relaxed dark:text-zinc-200 text-stone-800 mb-6 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shadow-inner font-mono">
                        <span className="text-amber-500 font-bold">{testimonial.avatar || (testimonial.author || testimonial.name || 'FT').slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold dark:text-white text-stone-900">{testimonial.author || testimonial.name}</p>
                        <p className="dark:text-zinc-400 text-stone-500 text-sm">{testimonial.location} {testimonial.tour ? `• ${testimonial.tour}` : ''}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-10">
                {liveReviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-[3px] rounded-full transition-all duration-500 ${
                      currentTestimonial === idx ? 'w-12 bg-amber-500' : 'w-6 dark:bg-white/20 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 lg:py-36 dark:bg-gradient-to-b dark:from-[#121418] dark:to-[#070809] bg-gradient-to-b from-stone-100 to-amber-50/40 border-t dark:border-white/5 border-stone-200/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-amber-500 font-semibold text-xs tracking-[0.3em] uppercase block mb-4">{t.home.beginJourney}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 dark:text-white text-stone-900">
            {t.home.ctaTitle.split(' ')[0]} to Create <span className="font-serif italic text-amber-500">{t.home.ctaTitle.split(' ').slice(1).join(' ')}</span>?
          </h2>
          <p className="dark:text-zinc-300 text-stone-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.home.ctaSubtitle}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold tracking-wider uppercase text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-xl shadow-amber-500/30 group rounded-sm"
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
