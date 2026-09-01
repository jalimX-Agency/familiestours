/**
 * replace-experience-images.mjs
 * Replaces the tour package ("Experiences") images with curated,
 * high-quality free-license photos from Pexels, resized/compressed
 * with sharp, uploaded to the same R2 keys the site already reads
 * from (src/lib/images.ts) — so no code or DB changes are needed.
 *
 * Usage: node scripts/replace-experience-images.mjs
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = join(__dirname, '..', '.env');
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnv();

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'familiestours';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const MAX_DIMENSION = 2400;
const JPEG_QUALITY = 82;

/**
 * Curated Pexels photos (free license) matched to each experience.
 * https://www.pexels.com/license/ — free to use, no attribution required.
 */
const EXPERIENCE_IMAGES = [
  {
    url: 'https://images.pexels.com/photos/18166240/pexels-photo-18166240.jpeg?cs=srgb&fm=jpg',
    destKey: 'tours/camel.jpg',
    label: 'Camel Trek & Dinner — camel caravan at sunset (Mo Eid)',
  },
  {
    url: 'https://images.pexels.com/photos/33663359/pexels-photo-33663359.jpeg?cs=srgb&fm=jpg',
    destKey: 'tours/quad.jpg',
    label: 'Quad Adventure & Dinner — ATVs riding across desert (Mert Çelik)',
  },
  {
    url: 'https://images.pexels.com/photos/20734784/pexels-photo-20734784.jpeg?cs=srgb&fm=jpg',
    destKey: 'tours/quad-family.jpg',
    label: 'Ultimate Desert Combo — couple on quad in the dunes (Denon Studio)',
  },
  {
    url: 'https://images.pexels.com/photos/35666328/pexels-photo-35666328.jpeg?cs=srgb&fm=jpg',
    destKey: 'tours/camp.jpg',
    label: 'Desert camp — traditional Berber tents (Moussa Idrissi)',
  },
  {
    url: 'https://images.pexels.com/photos/30710164/pexels-photo-30710164.jpeg?cs=srgb&fm=jpg',
    destKey: 'tours/sunrise.jpg',
    label: 'Golden Sunrise Experience — sunrise over the Saharan dunes (Stijn Dijkstra)',
  },
  {
    url: 'https://images.pexels.com/photos/13252308/pexels-photo-13252308.jpeg?cs=srgb&fm=jpg',
    destKey: 'tours/safari4x4.jpg',
    label: 'Royal 4x4 Safari — off-road vehicle on sand dunes (jdgromov)',
  },
  {
    url: 'https://images.pexels.com/photos/13869948/pexels-photo-13869948.jpeg?cs=srgb&fm=jpg',
    destKey: 'tours/tent.jpg',
    label: 'Luxury tent accommodation — interior (Matheus Bertelli)',
  },
];

async function downloadImage(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'FamiliesTours/1.0 (https://familiestours.com)' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  console.log('\n🏜️  Experience Image Replacement (Pexels, free license)\n');

  let success = 0;
  let failed = 0;

  for (const img of EXPERIENCE_IMAGES) {
    process.stdout.write(`  ⬇️  ${img.label}... `);
    try {
      const original = await downloadImage(img.url);
      const optimized = await sharp(original)
        .rotate()
        .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer();

      await s3.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: img.destKey,
        Body: optimized,
        ContentType: 'image/jpeg',
        CacheControl: 'public, max-age=31536000',
      }));

      console.log(`✅ (${(optimized.length / 1024).toFixed(0)} KB)`);
      success++;
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✨ Done! ${success} uploaded, ${failed} failed.`);
  console.log('⚠️  Remember: the Cloudflare CDN in front of R2 caches these URLs for a year.');
  console.log('    Purge the cache for the affected tours/*.jpg URLs so the new images go live.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
