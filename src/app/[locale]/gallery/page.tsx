import type { Metadata } from 'next';
import { LocaleProvider } from '@/context/LocaleContext';
import { Locale } from '@/i18n/translations';
import GalleryContent from './GalleryContent';

const SEO_COPY: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Photo Gallery | Families Tours — Agafay Desert, Morocco',
    description: 'Browse real photos from our Agafay desert experiences near Marrakech: camel treks, desert camps, and unforgettable family moments.',
  },
  fr: {
    title: 'Galerie Photos | Families Tours — Désert d’Agafay, Maroc',
    description: 'Parcourez de vraies photos de nos expériences dans le désert d’Agafay près de Marrakech : balades à dos de chameau, camps désertiques et moments familiaux inoubliables.',
  },
  es: {
    title: 'Galería de Fotos | Families Tours — Desierto de Agafay, Marruecos',
    description: 'Explora fotos reales de nuestras experiencias en el desierto de Agafay cerca de Marrakech: paseos en camello, campamentos y momentos familiares inolvidables.',
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
      canonical: `https://familiestours.com/${locale}/gallery`,
      languages: {
        en: 'https://familiestours.com/en/gallery',
        fr: 'https://familiestours.com/fr/gallery',
        es: 'https://familiestours.com/es/gallery',
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `https://familiestours.com/${locale}/gallery`,
      locale,
    },
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as any) || 'en';

  return (
    <LocaleProvider defaultLoc={locale}>
      <GalleryContent />
    </LocaleProvider>
  );
}
