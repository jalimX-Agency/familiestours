/**
 * restore-agafay-images.mjs
 * Restores the tour package ("Experiences") images to real Agafay Desert
 * photos (rocky/stony plateau near Marrakech — NOT sand dunes) from
 * Wikimedia Commons (CC BY-SA 4.0), correcting a prior mistake where
 * these were swapped for generic Sahara/Dubai-style sand dune stock
 * photos. This time each image is resized/compressed with sharp before
 * upload, fixing the original problem (13-18MB raw files) without
 * sacrificing terrain accuracy.
 *
 * Usage: node scripts/restore-agafay-images.mjs
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
 * Real Agafay Desert images from Wikimedia Commons (CC BY-SA 4.0).
 * Agafay is a ROCKY desert near Marrakech - NO sand dunes.
 */
const AGAFAY_IMAGES = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Camel_Agafay_Desert_3-10-22.jpg',
    destKey: 'tours/camel.jpg',
    label: 'Camel Trek & Dinner — single camel, Agafay',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Camel_riding_Agafay_Desert_3-10-22.jpg',
    destKey: 'tours/quad.jpg',
    label: 'Quad Adventure & Dinner — Agafay rocky terrain',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Camels_Agafay_Desert_3-10-22.jpg',
    destKey: 'tours/quad-family.jpg',
    label: 'Ultimate Desert Combo — camel group, Agafay',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Dromedaries_in_the_Agafay_Desert%2C_Morocco%2C_20250125_1751_7271.jpg',
    destKey: 'tours/sunrise.jpg',
    label: 'Golden Sunrise Experience — dromedaries golden hour, Agafay',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Agafay_Desert%2C_Morocco%2C_20250125_1751_7274.jpg',
    destKey: 'tours/safari4x4.jpg',
    label: 'Royal 4x4 Safari — Agafay rocky landscape terrain',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Agafay_Desert%2C_Morocco%2C_20250125_1800_7282.jpg',
    destKey: 'tours/camp.jpg',
    label: 'Desert camp — Agafay at sunset',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Agafay_Desert%2C_Morocco%2C_20250125_1802_7284.jpg',
    destKey: 'tours/tent.jpg',
    label: 'Luxury tent accommodation — Agafay shelter at dusk',
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
  console.log('\n🏜️  Restoring authentic (rocky, sand-free) Agafay Desert images\n');

  let success = 0;
  let failed = 0;

  for (const img of AGAFAY_IMAGES) {
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
      await new Promise((r) => setTimeout(r, 1500)); // pace requests, avoid Wikimedia 429s
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✨ Done! ${success} restored, ${failed} failed.`);
  console.log('⚠️  Remember: the Cloudflare CDN caches these URLs for a year — purge cache after this.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
