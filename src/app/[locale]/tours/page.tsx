import type { Metadata } from 'next';
import { LocaleProvider } from '@/context/LocaleContext';
import { Locale } from '@/i18n/translations';
import ToursContent from './ToursContent';

const SEO_COPY: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Desert Experiences & Pricing | Families Tours — Agafay, Morocco',
    description: 'Camel treks, quad adventures, and luxury desert camps in the Agafay desert near Marrakech. See pricing, duration, and what’s included in every experience.',
  },
  fr: {
    title: 'Expériences et Tarifs | Families Tours — Agafay, Maroc',
    description: 'Balades à dos de chameau, aventures en quad et camps de luxe dans le désert d’Agafay près de Marrakech. Découvrez les tarifs, durées et ce qui est inclus.',
  },
  es: {
    title: 'Experiencias y Precios | Families Tours — Agafay, Marruecos',
    description: 'Paseos en camello, aventuras en quad y campamentos de lujo en el desierto de Agafay cerca de Marrakech. Consulta precios, duración y qué incluye cada experiencia.',
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
      canonical: `https://familiestours.com/${locale}/tours`,
      languages: {
        en: 'https://familiestours.com/en/tours',
        fr: 'https://familiestours.com/fr/tours',
        es: 'https://familiestours.com/es/tours',
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `https://familiestours.com/${locale}/tours`,
      locale,
    },
  };
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
