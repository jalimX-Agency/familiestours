import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/translations';

const BASE_URL = 'https://familiestours.com';
const ROUTES = ['', '/tours', '/about', '/gallery', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ROUTES.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: now,
      changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}${route}`])
        ),
      },
    }))
  );
}
