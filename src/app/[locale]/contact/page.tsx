import type { Metadata } from 'next';
import { LocaleProvider } from '@/context/LocaleContext';
import { Locale } from '@/i18n/translations';
import ContactContent from './ContactContent';

const SEO_COPY: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Contact & Book | Families Tours — Agafay Desert, Morocco',
    description: 'Reserve your Agafay desert experience near Marrakech. Fast booking, free hotel pickup, and a team available 24/7 on WhatsApp.',
  },
  fr: {
    title: 'Contact et Réservation | Families Tours — Désert d’Agafay, Maroc',
    description: 'Réservez votre expérience dans le désert d’Agafay près de Marrakech. Réservation rapide, transfert d’hôtel gratuit, équipe disponible 24/7 sur WhatsApp.',
  },
  es: {
    title: 'Contacto y Reserva | Families Tours — Desierto de Agafay, Marruecos',
    description: 'Reserva tu experiencia en el desierto de Agafay cerca de Marrakech. Reserva rápida, traslado de hotel gratuito y equipo disponible 24/7 por WhatsApp.',
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
      canonical: `https://familiestours.com/${locale}/contact`,
      languages: {
        en: 'https://familiestours.com/en/contact',
        fr: 'https://familiestours.com/fr/contact',
        es: 'https://familiestours.com/es/contact',
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `https://familiestours.com/${locale}/contact`,
      locale,
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) || 'en';

  return (
    <LocaleProvider defaultLoc={locale}>
      <ContactContent />
    </LocaleProvider>
  );
}
