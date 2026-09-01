import type { Metadata } from 'next';
import { LocaleProvider } from '@/context/LocaleContext';
import { Locale } from '@/i18n/translations';
import HomeContent from './HomeContent';

const SEO_COPY: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Families Tours | Luxury Desert Experiences in Morocco',
    description: 'Discover authentic Agafay desert experiences with Families Tours. Camel treks, quad adventures, and luxury desert camps near Marrakech. Free transport included.',
  },
  fr: {
    title: 'Families Tours | Excursions de Luxe dans le Désert au Maroc',
    description: 'Découvrez des expériences authentiques dans le désert d’Agafay avec Families Tours. Balades à dos de chameau, aventures en quad et camps de luxe près de Marrakech. Transport gratuit inclus.',
  },
  es: {
    title: 'Families Tours | Experiencias de Lujo en el Desierto de Marruecos',
    description: 'Descubre experiencias auténticas en el desierto de Agafay con Families Tours. Paseos en camello, aventuras en quad y campamentos de lujo cerca de Marrakech. Transporte gratuito incluido.',
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
      canonical: `https://familiestours.com/${locale}`,
      languages: {
        en: 'https://familiestours.com/en',
        fr: 'https://familiestours.com/fr',
        es: 'https://familiestours.com/es',
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `https://familiestours.com/${locale}`,
      locale,
    },
  };
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
