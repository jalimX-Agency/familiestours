/**
 * fix-about-page-images.mjs
 * Replaces two bad images used on the About page (and, for family.jpg,
 * also the homepage):
 *   - tours/camel-caravan.jpg: was "Agafay desert (cropped).jpg" - an
 *     oddly cropped panorama sliver with no camels visible despite the
 *     filename, used as the About page hero background.
 *   - tours/family.jpg: was a shot with visible tire litter scattered
 *     across the foreground, and 23.7MB unoptimized. Used in the About
 *     page's "growth" trail panel and the homepage testimonials image.
 * Both replaced with clean, litter-free Wikimedia Commons Agafay
 * Desert photos (CC BY-SA 4.0), resized/compressed with sharp.
 *
 * Usage: node scripts/fix-about-page-images.mjs
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

const REPLACEMENTS = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Agafay_desert.jpg',
    destKey: 'tours/camel-caravan.jpg',
    label: 'About hero — winding road through Agafay hills',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Agafay_Desert%2C_Morocco%2C_20250125_1802_7285.jpg',
    destKey: 'tours/family.jpg',
    label: 'About "growth" panel / homepage — desert camp settlement overlook',
  },
];

async function downloadImage(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'FamiliesTours/1.0 (https://familiestours.com; contact@familiestours.com)' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  console.log('\n🏜️  Fixing bad About-page images\n');

  let success = 0;
  let failed = 0;

  for (const img of REPLACEMENTS) {
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

      console.log(`✅ ${(original.length / 1024).toFixed(0)} KB → ${(optimized.length / 1024).toFixed(0)} KB`);
      success++;
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✨ Done! ${success} fixed, ${failed} failed.`);
  console.log('⚠️  Remember: the Cloudflare CDN caches these URLs for a year — purge cache after this.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
