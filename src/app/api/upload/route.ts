import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2, getPresignedUploadUrl, listR2Objects } from '@/lib/r2';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle FormData direct file upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const category = (formData.get('category') as string) || 'General';
      const altText = (formData.get('altText') as string) || '';

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        );
      }

      const fileExtension = file.name.split('.').pop() || 'jpg';
      const key = `tours/${Date.now()}-${uuidv4()}.${fileExtension}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { url } = await uploadToR2({
        key,
        body: buffer,
        contentType: file.type,
        metadata: {
          originalName: file.name,
          category,
        },
      });

      // Save record in database if database is configured
      try {
        await db.galleryImage.create({
          data: {
            key,
            url,
            altText: altText || file.name,
            category,
          },
        });
      } catch (dbErr) {
        console.warn('Could not save image to database:', dbErr);
      }

      return NextResponse.json({
        success: true,
        key,
        url,
      });
    }

    // Handle JSON request for presigned upload URL
    const body = await req.json();
    const { filename, fileType, category = 'General' } = body;

    if (!filename || !fileType) {
      return NextResponse.json(
        { success: false, error: 'filename and fileType are required' },
        { status: 400 }
      );
    }

    const fileExtension = filename.split('.').pop() || 'jpg';
    const key = `uploads/${Date.now()}-${uuidv4()}.${fileExtension}`;

    const { uploadUrl, publicUrl } = await getPresignedUploadUrl(
      key,
      fileType,
      3600
    );

    return NextResponse.json({
      success: true,
      uploadUrl,
      publicUrl,
      key,
      category,
    });
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
    const prefix = searchParams.get('prefix') || undefined;

    const objects = await listR2Objects(prefix);
    return NextResponse.json({ success: true, count: objects.length, objects });
  } catch (error: any) {
    console.error('Error listing R2 objects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list objects from Cloudflare R2',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
