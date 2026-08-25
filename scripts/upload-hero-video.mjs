import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const content = readFileSync(join(__dirname, '..', '.env'), 'utf8');
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    process.env[k] = v;
  }
}
loadEnv();

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || 'familiestours';
const MEDIA = 'C:\\Users\\pc\\Documents\\JalimX\\clients\\families tours\\media';

async function upload(filePath, key, contentType) {
  const buf = readFileSync(filePath);
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buf,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000',
  }));
  console.log(`✅ Uploaded: ${key} (${Math.round(buf.length / 1024)} KB)`);
}

console.log('🎬 Uploading hero video and poster to R2...\n');

await upload(join(MEDIA, 'hero-compressed.mp4'), 'videos/hero.mp4', 'video/mp4');
await upload(join(MEDIA, 'hero-poster.jpg'), 'videos/hero-poster.jpg', 'image/jpeg');

console.log('\n✨ Done! Videos live at:');
console.log('   https://cdn.familiestours.com/videos/hero.mp4');
console.log('   https://cdn.familiestours.com/videos/hero-poster.jpg');
