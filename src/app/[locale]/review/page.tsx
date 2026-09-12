import type { Metadata } from 'next';
import { LocaleProvider } from '@/context/LocaleContext';
import { Locale } from '@/i18n/translations';
import ReviewFormContent from './ReviewFormContent';

const SEO_COPY: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Leave a Review | Families Tours — Agafay Desert, Morocco',
    description: 'Share your Agafay desert experience with Families Tours. Your review helps other families discover authentic desert adventures near Marrakech.',
  },
  fr: {
    title: 'Laisser un Avis | Families Tours — Désert d’Agafay, Maroc',
    description: 'Partagez votre expérience dans le désert d’Agafay avec Families Tours. Votre avis aide d’autres familles à découvrir nos aventures désertiques.',
  },
  es: {
    title: 'Dejar una Reseña | Families Tours — Desierto de Agafay, Marruecos',
    description: 'Comparte tu experiencia en el desierto de Agafay con Families Tours. Tu reseña ayuda a otras familias a descubrir nuestras aventuras en el desierto.',
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
      canonical: `https://www.familiestours.com/${locale}/review`,
      languages: {
        en: 'https://www.familiestours.com/en/review',
        fr: 'https://www.familiestours.com/fr/review',
        es: 'https://www.familiestours.com/es/review',
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `https://www.familiestours.com/${locale}/review`,
      locale,
    },
    robots: {
      // A form page with no unique content of its own for search engines -
      // keep it out of the index, but still linkable/shareable directly.
      index: false,
      follow: true,
    },
  };
}

export default async function ReviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) || 'en';

  return (
    <LocaleProvider defaultLoc={locale}>
      <ReviewFormContent />
    </LocaleProvider>
  );
}
