import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2, deleteFromR2, listR2Objects } from '@/lib/r2';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const category = (formData.get('category') as string) || 'General';
      const altText = (formData.get('altText') as string) || '';

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
      }

      const fileExtension = file.name.split('.').pop() || 'jpg';
      const key = `gallery/${category.toLowerCase()}/${Date.now()}-${uuidv4()}.${fileExtension}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { url } = await uploadToR2({
        key,
        body: buffer,
        contentType: file.type,
        metadata: { originalName: file.name, category },
      });

      try {
        await db.galleryImage.create({
          data: { key, url, altText: altText || file.name, category },
        });
      } catch (dbErr) {
        console.warn('Could not save image to database:', dbErr);
      }

      return NextResponse.json({ success: true, key, url });
    }

    return NextResponse.json({ success: false, error: 'Unsupported content type' }, { status: 400 });
  } catch (error: any) {
    console.error('R2 upload API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process upload',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;

    // Try DB first — much faster than listing from R2
    try {
      const dbImages = await db.galleryImage.findMany({
        where: category ? { category } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 500,
      });

      if (dbImages.length > 0) {
        const objects = dbImages.map((img) => ({
          key: img.key,
          url: img.url,
          size: 0,
          category: img.category,
          altText: img.altText,
          id: img.id,
          lastModified: img.updatedAt,
        }));
        return NextResponse.json({ success: true, count: objects.length, objects, source: 'db' });
      }
    } catch {
      // DB not available — fall through to R2
    }

    // Fallback: list from R2 directly
    const prefix = category ? `gallery/${category.toLowerCase()}/` : undefined;
    const r2Objects = await listR2Objects(prefix);
    const objects = r2Objects.map(obj => {
      const parts = obj.key.split('/');
      let cat = 'Gallery';
      if (parts.length >= 3 && parts[0] === 'gallery') {
        const rawCat = parts[1];
        cat = rawCat.charAt(0).toUpperCase() + rawCat.slice(1).toLowerCase();
      }
      return { ...obj, category: cat };
    });
    return NextResponse.json({ success: true, count: objects.length, objects, source: 'r2' });
  } catch (error: any) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list images',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, id } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: 'Image key is required' }, { status: 400 });
    }

    // Delete from R2 storage
    const deleted = await deleteFromR2(key);

    // Remove from DB (by id or key)
    try {
      if (id) {
        await db.galleryImage.delete({ where: { id } });
      } else {
        await db.galleryImage.delete({ where: { key } });
      }
    } catch {
      // Image may not be in DB — ok
    }

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Failed to delete from R2 storage' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete image',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
