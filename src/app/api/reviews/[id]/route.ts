import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await db.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: any = {};
    if (body.author !== undefined) updateData.author = body.author;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.rating !== undefined) updateData.rating = Math.max(1, Math.min(5, parseInt(body.rating)));
    if (body.tour !== undefined) updateData.tour = body.tour;
    if (body.text !== undefined) updateData.text = body.text;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.published !== undefined) updateData.published = Boolean(body.published);

    const updatedReview = await db.review.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}
