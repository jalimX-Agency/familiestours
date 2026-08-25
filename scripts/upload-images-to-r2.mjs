import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '6a90918a520d7824341a302cac983d0c';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '22daebbbc72b05fa9f5b6878281dabb4';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '4a71f503f0b1e504d1823608e2d5aeb92a944011953bff75b9ef13a9df2d5a88';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'familiestours';
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || 'https://cdn.familiestours.com/').replace(/\/$/, '');

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const imageSources = [
  { key: 'tours/hero.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/699188f13359.jpg' },
  { key: 'tours/camel.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c2d90656f1b2.jpg' },
  { key: 'tours/quad.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8236d9fe6f52.jpg' },
  { key: 'tours/safari4x4.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/40ff8f0c0e1c.jpg' },
  { key: 'tours/camp.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8fb99c4ca27a.jpg' },
  { key: 'tours/family.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/53f19f3f0722.jpg' },
  { key: 'tours/sunrise.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9f1dfb0535e8.jpg' },
  { key: 'tours/tent.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1da183b5d52d.jpg' },
  { key: 'tours/camel-caravan.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c7fda9914ca7.jpg' },
  { key: 'tours/quad-family.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e66d590d1cad.jpg' },
  { key: 'tours/dinner.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mpt/images-ppt/027a1bb77aa1.jpg' },
  { key: 'gallery/gallery-camels-1.jpg', url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6f7bd0704347.jpg' },
];

async function migrateImages() {
  console.log(`Starting image migration to Cloudflare R2 bucket: ${R2_BUCKET_NAME}...`);
  
  for (const item of imageSources) {
    try {
      console.log(`Downloading ${item.key} from ${item.url}...`);
      const response = await fetch(item.url);
      if (!response.ok) {
        console.warn(`Failed to download ${item.url} (status: ${response.status})`);
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      console.log(`Uploading to R2 as ${item.key}...`);
      await r2.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: item.key,
          Body: buffer,
          ContentType: contentType,
        })
      );

      console.log(`✓ Uploaded: ${R2_PUBLIC_URL}/${item.key}`);
    } catch (err) {
      console.error(`Error migrating ${item.key}:`, err.message);
    }
  }

  console.log('Migration finished successfully!');
}

migrateImages();
