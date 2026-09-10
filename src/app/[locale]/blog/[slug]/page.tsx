import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LocaleProvider } from '@/context/LocaleContext';
import { db } from '@/lib/db';
import { Locale } from '@/i18n/translations';
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react';

const UI_COPY: Record<Locale, { backToBlog: string; ctaTitle: string; ctaSubtitle: string; ctaButton: string; readMore: string; moreGuides: string }> = {
  en: {
    backToBlog: 'Back to all guides',
    ctaTitle: 'Ready to Experience Agafay Yourself?',
    ctaSubtitle: 'Camel treks, quad adventures, and desert camps near Marrakech — free hotel pickup included.',
    ctaButton: 'View Our Experiences',
    readMore: 'Read more',
    moreGuides: 'More Desert Guides',
  },
  fr: {
    backToBlog: 'Retour à tous les guides',
    ctaTitle: 'Prêt à vivre Agafay vous-même ?',
    ctaSubtitle: 'Balades à dos de chameau, aventures en quad et camps désertiques près de Marrakech — transfert gratuit inclus.',
    ctaButton: 'Voir nos expériences',
    readMore: 'Lire la suite',
    moreGuides: 'Plus de guides du désert',
  },
  es: {
    backToBlog: 'Volver a todas las guías',
    ctaTitle: '¿Listo para vivir Agafay en persona?',
    ctaSubtitle: 'Paseos en camello, aventuras en quad y campamentos en el desierto cerca de Marrakech — traslado gratuito incluido.',
    ctaButton: 'Ver nuestras experiencias',
    readMore: 'Leer más',
    moreGuides: 'Más guías del desierto',
  },
};

async function getPost(slug: string, locale: string) {
  return db.blogPost.findUnique({ where: { slug_locale: { slug, locale } } });
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam as Locale) || 'en';
  const post = await getPost(slug, locale);

  if (!post) {
    return { title: 'Not Found' };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `https://www.familiestours.com/${locale}/blog/${slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://www.familiestours.com/${locale}/blog/${slug}`,
      locale,
      type: 'article',
      images: [{ url: post.heroImage, width: 1200, height: 630, alt: post.heroImageAlt }],
      publishedTime: post.publishedAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.heroImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam as Locale) || 'en';
  const ui = UI_COPY[locale] || UI_COPY.en;

  const post = await getPost(slug, locale);
  if (!post) notFound();

  const otherPosts = await db.blogPost.findMany({
    where: { locale, published: true, slug: { not: slug } },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: post.heroImage,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Families Tours',
      url: 'https://www.familiestours.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Families Tours',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.familiestours.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.familiestours.com/${locale}/blog/${slug}`,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.familiestours.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `https://www.familiestours.com/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.familiestours.com/${locale}/blog/${slug}` },
    ],
  };

  return (
    <LocaleProvider defaultLoc={locale}>
    <main className="min-h-screen dark:bg-[#0c0d0f] bg-[#faf8f5] dark:text-zinc-100 text-stone-900 transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Navbar />

      {/* Hero */}
      <section className="relative h-[45vh] min-h-[360px] flex items-end overflow-hidden">
        <img
          src={post.heroImage}
          alt={post.heroImageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 pb-10 w-full">
          <span className="font-mono inline-block px-3 py-1 bg-black/70 text-amber-400 text-[10px] tracking-wider uppercase border border-amber-500/30 rounded-sm mb-4">
            {post.category}
          </span>
          <h1 className="font-display font-semibold tracking-tight text-2xl md:text-3xl lg:text-4xl text-white drop-shadow-md leading-tight mb-3">
            {post.title}
          </h1>
          <div className="font-mono flex items-center gap-2 text-white/80 text-xs tracking-wider uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readingTime} min</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-20 dark:bg-[#0c0d0f] bg-[#faf8f5]">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm font-medium mb-10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {ui.backToBlog}
          </Link>

          <div
            className="dark:text-zinc-300 text-stone-700 leading-relaxed text-[17px]
              [&_h2]:font-display [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-2xl [&_h2]:lg:text-3xl [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:dark:text-white [&_h2]:text-stone-900
              [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:dark:text-white [&_h3]:text-stone-900
              [&_p]:mb-5
              [&_ul]:mb-5 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5
              [&_li]:leading-relaxed
              [&_a]:text-amber-500 [&_a]:font-medium [&_a]:hover:text-amber-400 [&_a]:underline [&_a]:underline-offset-2
              [&_strong]:font-semibold [&_strong]:dark:text-white [&_strong]:text-stone-900
              [&_em]:font-serif [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 dark:bg-[#121418] bg-stone-100/80 border-y dark:border-white/5 border-stone-200/80">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-semibold tracking-tight text-2xl md:text-3xl mb-4 dark:text-white text-stone-900">
            {ui.ctaTitle}
          </h2>
          <p className="dark:text-zinc-300 text-stone-600 mb-8 max-w-xl mx-auto">{ui.ctaSubtitle}</p>
          <Link
            href={`/${locale}/tours`}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold tracking-wider uppercase text-sm hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-xl shadow-amber-500/25 rounded-sm"
          >
            {ui.ctaButton}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Other posts */}
      {otherPosts.length > 0 && (
        <section className="py-20 dark:bg-[#0c0d0f] bg-[#faf8f5]">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <h2 className="font-mono text-amber-500 text-xs tracking-[0.3em] uppercase mb-8">{ui.moreGuides}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {otherPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/blog/${p.slug}`}
                  className="group flex flex-col rounded-xl overflow-hidden dark:bg-zinc-900/60 bg-white border dark:border-white/10 border-stone-200/90 shadow-md hover:shadow-xl hover:border-amber-500/40 transition-all duration-500"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={p.heroImage} alt={p.heroImageAlt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-medium mb-2 dark:text-white text-stone-900 group-hover:text-amber-500 transition-colors">{p.title}</h3>
                    <span className="text-amber-500 text-sm font-medium inline-flex items-center gap-1">
                      {ui.readMore} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
    </LocaleProvider>
  );
}
