import type { Metadata } from 'next';
import { LocaleProvider } from '@/context/LocaleContext';
import { Locale } from '@/i18n/translations';
import AboutContent from './AboutContent';

const SEO_COPY: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Our Story | Families Tours — Agafay Desert, Morocco',
    description: 'From a single camel to thousands of smiles. Meet the family behind Families Tours and our mission to share authentic Agafay desert experiences near Marrakech.',
  },
  fr: {
    title: 'Notre Histoire | Families Tours — Désert d’Agafay, Maroc',
    description: 'D’un seul chameau à des milliers de sourires. Découvrez la famille derrière Families Tours et notre mission dans le désert d’Agafay.',
  },
  es: {
    title: 'Nuestra Historia | Families Tours — Desierto de Agafay, Marruecos',
    description: 'De un solo camello a miles de sonrisas. Conoce a la familia detrás de Families Tours y nuestra misión en el desierto de Agafay.',
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
      canonical: `https://www.familiestours.com/${locale}/about`,
      languages: {
        en: 'https://www.familiestours.com/en/about',
        fr: 'https://www.familiestours.com/fr/about',
        es: 'https://www.familiestours.com/es/about',
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `https://www.familiestours.com/${locale}/about`,
      locale,
    },
  };
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
