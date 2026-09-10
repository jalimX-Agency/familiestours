import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LocaleProvider } from '@/context/LocaleContext';
import { db } from '@/lib/db';
import { Locale } from '@/i18n/translations';
import { Clock } from 'lucide-react';

const SEO_COPY: Record<Locale, { title: string; description: string; eyebrow: string; heading1: string; heading2: string; subtitle: string; empty: string }> = {
  en: {
    title: 'Blog | Families Tours — Agafay Desert Travel Guides',
    description: 'Practical guides to the Agafay desert near Marrakech: when to go, what to book, and how to plan your family desert trip.',
    eyebrow: 'The Journal',
    heading1: 'Desert',
    heading2: 'Guides',
    subtitle: 'Practical, honest guides to planning your Agafay desert experience.',
    empty: 'No articles yet — check back soon.',
  },
  fr: {
    title: 'Blog | Families Tours — Guides de voyage désert d’Agafay',
    description: 'Guides pratiques sur le désert d’Agafay près de Marrakech : quand partir, quoi réserver et comment organiser votre voyage en famille.',
    eyebrow: 'Le Journal',
    heading1: 'Guides du',
    heading2: 'Désert',
    subtitle: 'Des guides pratiques et honnêtes pour organiser votre expérience à Agafay.',
    empty: 'Aucun article pour le moment — revenez bientôt.',
  },
  es: {
    title: 'Blog | Families Tours — Guías de viaje al desierto de Agafay',
    description: 'Guías prácticas sobre el desierto de Agafay cerca de Marrakech: cuándo ir, qué reservar y cómo planificar tu viaje en familia.',
    eyebrow: 'El Diario',
    heading1: 'Guías del',
    heading2: 'Desierto',
    subtitle: 'Guías prácticas y honestas para planificar tu experiencia en Agafay.',
    empty: 'Todavía no hay artículos — vuelve pronto.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) || 'en';
  const copy = SEO_COPY[locale] || SEO_COPY.en;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `https://www.familiestours.com/${locale}/blog`,
      languages: {
        en: 'https://www.familiestours.com/en/blog',
        fr: 'https://www.familiestours.com/fr/blog',
        es: 'https://www.familiestours.com/es/blog',
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `https://www.familiestours.com/${locale}/blog`,
      locale,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) || 'en';
  const copy = SEO_COPY[locale] || SEO_COPY.en;

  const posts = await db.blogPost.findMany({
    where: { locale, published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <LocaleProvider defaultLoc={locale}>
    <main className="min-h-screen dark:bg-[#0c0d0f] bg-[#faf8f5] dark:text-zinc-100 text-stone-900 transition-colors duration-300">
      <Navbar />

      {/* Header */}
      <section className="pt-32 lg:pt-44 pb-16 lg:pb-20 dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <span className="font-mono text-amber-500 text-xs tracking-[0.3em] uppercase block mb-3">{copy.eyebrow}</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-5 dark:text-white text-stone-900">
            <span className="font-display font-semibold tracking-tight">{copy.heading1}</span>{' '}
            <span className="font-serif italic text-amber-500">{copy.heading2}</span>
          </h1>
          <p className="dark:text-zinc-400 text-stone-600 text-lg font-light max-w-xl mx-auto">{copy.subtitle}</p>
        </div>
      </section>

      {/* Post Grid */}
      <section className="pb-24 dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          {posts.length === 0 ? (
            <p className="text-center dark:text-zinc-500 text-stone-500 py-20">{copy.empty}</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group flex flex-col rounded-xl overflow-hidden dark:bg-zinc-900/60 bg-white border dark:border-white/10 border-stone-200/90 shadow-md shadow-stone-900/5 hover:shadow-2xl hover:border-amber-500/40 transition-all duration-500"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.heroImage}
                      alt={post.heroImageAlt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="font-mono px-3 py-1 bg-black/70 text-amber-400 text-[10px] tracking-wider uppercase border border-amber-500/30 rounded-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-medium mb-3 leading-snug dark:text-white text-stone-900 group-hover:text-amber-500 transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="dark:text-zinc-400 text-stone-600 text-sm leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="font-mono flex items-center gap-2 dark:text-zinc-500 text-stone-500 text-xs tracking-wider uppercase">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readingTime} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
    </LocaleProvider>
  );
}
