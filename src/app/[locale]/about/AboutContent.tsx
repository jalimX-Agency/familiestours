'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, type Variants } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { images } from '@/lib/images';
import { useLocale } from '@/context/LocaleContext';
import { Heart, Globe, Award, Users, Sparkles, TreePine } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function TrailSection({ t }: { t: any }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const panels = [
    { image: images.camel, text: t.about.storyP1 },
    { image: images.family, text: t.about.storyP2 },
    { image: images.camp, text: t.about.storyP3 },
  ];

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(panels.length - 1) * 100}%`]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(panels.length - 1, Math.round(v * (panels.length - 1))));
  });

  return (
    <section ref={trackRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <motion.div className="flex h-full" style={{ x }}>
          {panels.map((panel, idx) => (
            <div key={idx} className="relative w-screen h-full flex-shrink-0 flex items-end lg:items-center">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${panel.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent"></div>
              </div>

              <div className="relative z-10 max-w-2xl px-6 lg:px-20 pb-20 lg:pb-0">
                <span className="font-mono text-amber-400 text-sm tracking-widest">
                  {String(idx + 1).padStart(2, '0')} / {String(panels.length).padStart(2, '0')}
                </span>
                <p className="mt-4 text-lg md:text-xl text-white/95 leading-relaxed drop-shadow-md">
                  {panel.text}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Fixed heading + progress, overlaid on the moving track */}
        <div className="absolute top-24 lg:top-32 left-6 lg:left-20 z-20 max-w-sm pointer-events-none">
          <span className="font-mono text-amber-400 text-xs tracking-[0.3em] uppercase block mb-3">{t.about.theBeginning}</span>
          <h2 className="font-display font-semibold tracking-tight text-3xl lg:text-4xl text-white drop-shadow-md leading-tight">
            {t.about.storyTitle}
          </h2>
        </div>

        <div className="absolute bottom-8 left-6 lg:left-20 z-20 flex items-center gap-2">
          {panels.map((_, idx) => (
            <div
              key={idx}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                idx === active ? 'w-10 bg-amber-400' : 'w-4 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutContent() {
  const { t } = useLocale();

  const values = [
    { icon: <Heart className="w-8 h-8" />, ...t.about.values[0] },
    { icon: <Globe className="w-7 h-7" />, ...t.about.values[1] },
    { icon: <Award className="w-7 h-7" />, ...t.about.values[2] },
    { icon: <Users className="w-7 h-7" />, ...t.about.values[3] },
    { icon: <Sparkles className="w-7 h-7" />, ...t.about.values[4] },
    { icon: <TreePine className="w-7 h-7" />, ...t.about.values[5] },
  ];

  const stats = [
    { value: t.about.yearsOfExperience, label: t.about.yearsOfExperienceLabel },
    { value: t.about.happyGuests, label: t.about.happyGuestsLabel },
    { value: t.about.familyOwned, label: t.about.familyOwnedLabel },
    { value: t.about.averageRating, label: t.about.averageRatingLabel },
  ];

  return (
    <main className="min-h-screen dark:bg-[#0c0d0f] bg-[#faf8f5] dark:text-zinc-100 text-stone-900 transition-colors duration-300">
      <Navbar />

      {/* Hero — asymmetric split, off-grid ghost year */}
      <section className="relative min-h-[85vh] lg:min-h-screen flex flex-col lg:flex-row overflow-hidden dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 lg:pl-20 lg:pr-12 pt-32 lg:pt-0 pb-16 lg:pb-0 order-2 lg:order-1">
          <span
            aria-hidden
            className="font-display select-none pointer-events-none absolute -left-4 lg:left-4 top-8 lg:top-1/2 lg:-translate-y-1/2 text-[7rem] lg:text-[13rem] leading-none font-semibold text-amber-500/10 dark:text-amber-500/[0.08] tracking-tight"
          >
            2009
          </span>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-amber-400"></span>
              <span className="font-mono text-amber-500 text-xs tracking-[0.35em] uppercase font-semibold">{t.about.since}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-6 dark:text-white text-stone-900">
              <span className="block font-display font-semibold tracking-tight">{t.about.pageTitle.split(' ')[0]}</span>
              <span className="block font-serif italic text-amber-500 -mt-1">{t.about.pageTitle.split(' ').slice(1).join(' ')}</span>
            </h1>

            <p className="text-lg dark:text-zinc-300 text-stone-600 max-w-md font-light leading-relaxed">
              {t.about.pageSubtitle}
            </p>
          </motion.div>
        </div>

        <div className="relative flex-1 lg:max-w-[46%] h-[45vh] lg:h-auto order-1 lg:order-2">
          <img
            src={images.camelCaravan}
            alt="Camel caravan in the Agafay desert"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent to-black/10 dark:to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] dark:from-[#0c0d0f] via-transparent to-transparent lg:hidden"></div>
        </div>
      </section>

      {/* The Trail — horizontal-scroll founding story */}
      <TrailSection t={t} />

      {/* Quote Divider */}
      <section className="py-20 relative overflow-hidden dark:bg-[#121418] bg-stone-100/80 border-y dark:border-white/5 border-stone-200/80">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-amber-500/40 text-6xl font-serif block mb-4">&ldquo;</span>
          <blockquote className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed dark:text-zinc-200 text-stone-800 italic">
            {t.about.founderQuote}
          </blockquote>
          <p className="mt-6 font-mono text-amber-500 font-semibold text-xs tracking-widest uppercase">{t.about.founderName}</p>
        </div>
      </section>

      {/* Values — deliberately unbalanced grid, one tile oversized */}
      <section className="py-20 lg:py-28 dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="font-mono text-amber-500 font-semibold text-xs tracking-[0.3em] uppercase block mb-3">{t.about.guidesUs}</span>
            <h2 className="font-display font-semibold tracking-tight text-3xl md:text-4xl lg:text-5xl dark:text-white text-stone-900">
              {t.about.coreValues.split(' ')[0]} <span className="font-serif italic text-amber-500 font-normal tracking-normal">{t.about.coreValues.split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <div
                key={idx}
                className={`group p-8 lg:p-10 rounded-xl border transition-all duration-300 ${
                  idx === 0
                    ? 'lg:col-span-2 lg:row-span-1 bg-gradient-to-br from-amber-500/10 to-transparent dark:border-amber-500/25 border-amber-300/60 hover:border-amber-500/50 flex flex-col justify-center'
                    : 'dark:bg-zinc-900/60 bg-white dark:border-white/10 border-stone-200/90 shadow-sm hover:shadow-xl dark:hover:border-amber-500/40 hover:border-amber-500/40'
                }`}
              >
                <div className={`text-amber-500 mb-5 group-hover:scale-110 transition-transform duration-300 ${idx === 0 ? 'w-10 h-10' : ''}`}>
                  {value.icon}
                </div>
                <h3 className={`font-medium mb-3 dark:text-zinc-100 text-stone-900 group-hover:text-amber-500 transition-colors duration-300 ${idx === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>
                  {value.title}
                </h3>
                <p className={`dark:text-zinc-400 text-stone-600 leading-relaxed ${idx === 0 ? 'text-base max-w-md' : 'text-sm'}`}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers — inline mono strip instead of four identical boxes */}
      <section className="py-16 dark:bg-[#121418] bg-stone-100/70 border-t dark:border-white/5 border-stone-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-x-12 gap-y-8 justify-between">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-baseline gap-3">
                <span className="font-mono text-4xl lg:text-5xl font-light text-amber-500">{stat.value}</span>
                <span className="dark:text-zinc-500 text-stone-500 text-xs tracking-wider uppercase font-semibold max-w-[8rem]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
