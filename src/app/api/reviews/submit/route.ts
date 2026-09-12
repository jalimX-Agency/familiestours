import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Public endpoint for customer-submitted reviews. Always creates as
// unpublished — an admin must approve it from /admin before it appears
// on the site or counts toward the aggregate rating.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author, location, rating, tour, text, honeypot } = body;

    // Simple spam trap: a hidden field real users never fill in.
    if (honeypot) {
      return NextResponse.json({ success: true }); // silently drop, no error to the bot
    }

    if (!author || !text || !tour) {
      return NextResponse.json(
        { success: false, error: 'Name, experience, and review text are required' },
        { status: 400 }
      );
    }

    const parsedRating = typeof rating === 'number' ? rating : parseInt(rating, 10);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (String(text).length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Review text is too long' },
        { status: 400 }
      );
    }

    const initials = String(author)
      .trim()
      .split(/\s+/)
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const review = await db.review.create({
      data: {
        author: String(author).slice(0, 100),
        location: (location ? String(location) : 'Verified Guest').slice(0, 100),
        rating: parsedRating,
        tour: String(tour).slice(0, 150),
        text: String(text).slice(0, 2000),
        avatar: initials,
        published: false,
      },
    });

    return NextResponse.json({ success: true, review: { id: review.id } }, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}
