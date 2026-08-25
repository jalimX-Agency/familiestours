import { LocaleProvider } from '@/context/LocaleContext';
import { locales, Locale } from '@/i18n/translations';
import WhatsAppWidget from '@/components/layout/WhatsAppWidget';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) || 'en';

  return (
    <LocaleProvider defaultLoc={locale}>
      {children}
      <WhatsAppWidget />
    </LocaleProvider>
  );
}
