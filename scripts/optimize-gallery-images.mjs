/**
 * optimize-gallery-images.mjs
 * Downloads the existing gallery/* images from R2 (uploaded as raw,
 * uncompressed camera/Wikimedia originals — 13-18MB each, which was
 * causing Next.js's image optimizer to fail intermittently), resizes
 * and re-compresses them with sharp, and re-uploads them to the same
 * keys so the public URLs stay unchanged.
 *
 * Usage: node scripts/optimize-gallery-images.mjs
 */

import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
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

const MAX_DIMENSION = 2400; // px, long edge
const JPEG_QUALITY = 82;

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function listGalleryKeys() {
  const response = await s3.send(new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
    Prefix: 'gallery/',
  }));
  return (response.Contents || [])
    .map((item) => item.Key)
    .filter((key) => /\.(jpe?g|png|webp)$/i.test(key));
}

async function main() {
  console.log('\n🖼️  Gallery Image Optimization\n');

  const keys = await listGalleryKeys();
  if (keys.length === 0) {
    console.log('No gallery images found under gallery/. Nothing to do.');
    return;
  }

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const key of keys) {
    process.stdout.write(`  ⬇️  ${key}... `);
    try {
      const obj = await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
      const original = await streamToBuffer(obj.Body);
      const originalKB = original.length / 1024;

      if (originalKB < 800) {
        console.log(`⏭️  already small (${originalKB.toFixed(0)} KB), skipped`);
        skipped++;
        continue;
      }

      const optimized = await sharp(original)
        .rotate() // apply EXIF orientation before stripping metadata
        .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer();

      await s3.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: optimized,
        ContentType: 'image/jpeg',
        CacheControl: 'public, max-age=31536000',
      }));

      console.log(`✅ ${originalKB.toFixed(0)} KB → ${(optimized.length / 1024).toFixed(0)} KB`);
      success++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✨ Done! ${success} optimized, ${skipped} skipped, ${failed} failed.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
