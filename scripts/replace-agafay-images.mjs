/**
 * replace-agafay-images.mjs
 * Downloads real Agafay Desert images from Wikimedia Commons
 * and uploads them to Cloudflare R2, replacing the old sandy desert images.
 *
 * Usage: node scripts/replace-agafay-images.mjs
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env vars from .env file
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

/**
 * Real Agafay Desert images from Wikimedia Commons (CC BY-SA 4.0)
 * Agafay is a ROCKY desert near Marrakech - NO sand dunes.
 */
const AGAFAY_IMAGES = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Agafay_desert.jpg',
    destKey: 'tours/hero.jpg',
    label: 'Hero - Agafay desert wide landscape',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Agafay_desert_%28cropped%29.jpg',
    destKey: 'tours/camel-caravan.jpg',
    label: 'Camel caravan - Agafay cropped view',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Camel_Agafay_Desert_3-10-22.jpg',
    destKey: 'tours/camel.jpg',
    label: 'Camel - single camel Agafay',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Camels_Agafay_Desert_3-10-22.jpg',
    destKey: 'tours/quad-family.jpg',
    label: 'Quad family - Camels Agafay group',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Camel_riding_Agafay_Desert_3-10-22.jpg',
    destKey: 'tours/quad.jpg',
    label: 'Quad - Camel ride Agafay',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Dromedaries_in_the_Agafay_Desert%2C_Morocco%2C_20250125_1751_7271.jpg',
    destKey: 'tours/sunrise.jpg',
    label: 'Sunrise - dromedaries golden hour Agafay',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Agafay_Desert%2C_Morocco%2C_20250125_1751_7274.jpg',
    destKey: 'tours/safari4x4.jpg',
    label: 'Safari 4x4 - Agafay landscape terrain',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Agafay_Desert%2C_Morocco%2C_20250125_1752_7275.jpg',
    destKey: 'tours/family.jpg',
    label: 'Family - Agafay desert landscape',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Agafay_Desert%2C_Morocco%2C_20250125_1800_7282.jpg',
    destKey: 'tours/camp.jpg',
    label: 'Camp - Agafay at sunset',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Agafay_Desert%2C_Morocco%2C_20250125_1802_7284.jpg',
    destKey: 'tours/tent.jpg',
    label: 'Tent - Agafay shelter at dusk',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Agafay_Desert%2C_Morocco%2C_20250125_1802_7285.jpg',
    destKey: 'gallery/gallery-camels-1.jpg',
    label: 'Gallery - Agafay rocky landscape',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Agafay_Desert%2C_Morocco%2C_20250125_1819_7292.jpg',
    destKey: 'gallery/gallery-agafay-1.jpg',
    label: 'Gallery - Agafay afternoon panorama',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Agafay_Desert%2C_Morocco%2C_20250125_1847_7294.jpg',
    destKey: 'gallery/gallery-agafay-2.jpg',
    label: 'Gallery - Agafay evening terrain',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Agafay_Desert%2C_Morocco%2C_20250125_1848_7298.jpg',
    destKey: 'gallery/gallery-agafay-3.jpg',
    label: 'Gallery - Agafay rocky hills dusk',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Agafay_Desert%2C_Morocco%2C_20250125_1848_7301.jpg',
    destKey: 'gallery/gallery-agafay-4.jpg',
    label: 'Gallery - Agafay twilight',
  },
];

async function downloadImage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'FamiliesTours/1.0 (https://familiestours.com; contact@familiestours.com)',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToR2(buffer, key) {
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'image/jpeg',
    CacheControl: 'public, max-age=31536000',
  }));
}

async function main() {
  console.log('\n🏜️  Agafay Desert Image Migration');
  console.log('📸 Real photos from Wikimedia Commons (CC BY-SA 4.0)\n');

  let success = 0;
  let failed = 0;

  for (const img of AGAFAY_IMAGES) {
    process.stdout.write(`  ⬇️  ${img.label}... `);
    try {
      const buffer = await downloadImage(img.url);
      await uploadToR2(buffer, img.destKey);
      console.log(`✅ (${(buffer.length / 1024).toFixed(0)} KB)`);
      success++;
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✨ Done! ${success} uploaded, ${failed} failed.`);
  console.log('🌍 Live at: https://cdn.familiestours.com/tours/');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
