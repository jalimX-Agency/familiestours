import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tourPackages as defaultPackages } from '@/lib/images';

export async function GET(req: NextRequest) {
  try {
    let tours = await db.tourPackage.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Seed default packages if DB is empty
    if (tours.length === 0) {
      for (const p of defaultPackages) {
        await db.tourPackage.create({
          data: {
            slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: p.title,
            subtitle: p.subtitle,
            price: p.price,
            duration: p.duration,
            difficulty: p.difficulty,
            groupSize: p.groupSize,
            highlight: p.highlight || false,
            signature: (p as any).signature || false,
            description: p.description,
            mainImage: p.image,
            gallery: p.gallery || [],
            features: p.features || [],
          },
        });
      }
      tours = await db.tourPackage.findMany({
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json({ success: true, tours });
  } catch (error: any) {
    console.error('Error loading tours:', error);
    // Fallback to static defaults
    return NextResponse.json({ success: true, tours: defaultPackages, fallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      subtitle,
      price,
      duration,
      difficulty,
      groupSize,
      description,
      mainImage,
      gallery,
      features,
      highlight,
      signature,
    } = body;

    if (!title || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Title and price are required' },
        { status: 400 }
      );
    }

    const slug = (body.slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newTour = await db.tourPackage.create({
      data: {
        slug,
        title,
        subtitle: subtitle || '',
        price: parseFloat(price),
        duration: duration || '4-5 hours',
        difficulty: difficulty || 'Easy',
        groupSize: groupSize || 'Up to 12 guests',
        description: description || '',
        mainImage: mainImage || 'https://cdn.familiestours.com/tours/camel.jpg',
        gallery: Array.isArray(gallery) ? gallery : [],
        features: Array.isArray(features)
          ? features
          : typeof features === 'string'
          ? features.split('\n').map((f: string) => f.trim()).filter(Boolean)
          : [],
        highlight: Boolean(highlight),
        signature: Boolean(signature),
      },
    });

    return NextResponse.json({ success: true, tour: newTour }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create tour package' },
      { status: 500 }
    );
  }
}
