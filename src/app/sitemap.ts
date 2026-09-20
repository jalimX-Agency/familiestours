import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/translations';
import { db } from '@/lib/db';

const BASE_URL = 'https://www.familiestours.com';
const ROUTES = ['', '/tours', '/about', '/gallery', '/contact', '/blog'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date('2026-09-20');

  const staticEntries: MetadataRoute.Sitemap = ROUTES.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: now,
      changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}${route}`])),
          'x-default': `${BASE_URL}/en${route}`,
        },
      },
    }))
  );

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      select: { slug: true, locale: true, updatedAt: true },
    });

    blogEntries = posts.map((post) => {
      const languages: Record<string, string> = Object.fromEntries(
        posts
          .filter((p) => p.slug === post.slug)
          .map((p) => [p.locale, `${BASE_URL}/${p.locale}/blog/${p.slug}`])
      );
      if (languages.en) languages['x-default'] = languages.en;
      return {
        url: `${BASE_URL}/${post.locale}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: { languages },
      };
    });
  } catch {
    // DB unavailable at build time - ship the static routes only
  }

  return [...staticEntries, ...blogEntries];
}
