import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/translations';
import { db } from '@/lib/db';

const BASE_URL = 'https://www.familiestours.com';
const ROUTES = ['', '/tours', '/about', '/gallery', '/contact', '/blog'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = ROUTES.flatMap((route) =>
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

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      select: { slug: true, locale: true, updatedAt: true },
    });

    blogEntries = posts.map((post) => ({
      url: `${BASE_URL}/${post.locale}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable at build time - ship the static routes only
  }

  return [...staticEntries, ...blogEntries];
}
