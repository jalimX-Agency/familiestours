import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonials as defaultReviews } from '@/lib/images';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    let reviews = await db.review.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: 'asc' },
    });

    // Seed default reviews if DB is empty
    if (reviews.length === 0) {
      for (const r of defaultReviews) {
        await db.review.create({
          data: {
            author: r.name,
            location: r.location,
            rating: r.rating || 5,
            tour: r.tour,
            text: r.text,
            avatar: r.avatar,
            published: true,
          },
        });
      }
      reviews = await db.review.findMany({
        where: publishedOnly ? { published: true } : undefined,
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    console.error('Error loading reviews:', error);
    // Fallback
    const fallbackReviews = defaultReviews.map((r, i) => ({
      id: `fallback-${i}`,
      author: r.name,
      location: r.location,
      rating: r.rating,
      tour: r.tour,
      text: r.text,
      avatar: r.avatar,
      published: true,
      createdAt: new Date().toISOString(),
    }));
    return NextResponse.json({ success: true, reviews: fallbackReviews, fallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author, location, rating, tour, text, avatar, published } = body;

    if (!author || !text) {
      return NextResponse.json(
        { success: false, error: 'Author name and review text are required' },
        { status: 400 }
      );
    }

    const initials =
      avatar ||
      author
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const newReview = await db.review.create({
      data: {
        author,
        location: location || 'Morocco Traveler',
        rating: typeof rating === 'number' ? Math.max(1, Math.min(5, rating)) : 5,
        tour: tour || 'Agafay Desert Experience',
        text,
        avatar: initials,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create review' },
      { status: 500 }
    );
  }
}
