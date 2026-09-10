/**
 * seed-blog.mjs
 * One-time seed for the initial 3 blog posts (EN/FR/ES).
 * Safe to re-run: upserts on the (slug, locale) unique key.
 *
 * Usage: node scripts/seed-blog.mjs
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = process.env.BLOG_SEED_DIR;

if (!CONTENT_DIR) {
  console.error('Set BLOG_SEED_DIR to the directory containing blog-content-{en,fr,es}.json');
  process.exit(1);
}

const db = new PrismaClient();

async function main() {
  const locales = ['en', 'fr', 'es'];
  let count = 0;

  for (const locale of locales) {
    const filePath = join(CONTENT_DIR, `blog-content-${locale}.json`);
    const data = JSON.parse(readFileSync(filePath, 'utf8'));

    for (const key of Object.keys(data)) {
      const post = data[key];
      await db.blogPost.upsert({
        where: { slug_locale: { slug: post.slug, locale } },
        update: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          heroImage: post.heroImage,
          heroImageAlt: post.heroImageAlt,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          readingTime: post.readingTime,
        },
        create: {
          slug: post.slug,
          locale,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          heroImage: post.heroImage,
          heroImageAlt: post.heroImageAlt,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          readingTime: post.readingTime,
          published: true,
        },
      });
      count++;
      console.log(`  ✅ ${locale}/${post.slug}`);
    }
  }

  console.log(`\n✨ Seeded ${count} blog post versions.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
