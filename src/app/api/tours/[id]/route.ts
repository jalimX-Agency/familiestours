import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tour = await db.tourPackage.findUnique({
      where: { id },
    });

    if (!tour) {
      return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, tour });
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
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty;
    if (body.groupSize !== undefined) updateData.groupSize = body.groupSize;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.mainImage !== undefined) updateData.mainImage = body.mainImage;
    if (body.highlight !== undefined) updateData.highlight = Boolean(body.highlight);
    if (body.signature !== undefined) updateData.signature = Boolean(body.signature);
    if (body.features !== undefined) {
      updateData.features = Array.isArray(body.features)
        ? body.features
        : typeof body.features === 'string'
        ? body.features.split('\n').map((f: string) => f.trim()).filter(Boolean)
        : [];
    }

    const updatedTour = await db.tourPackage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, tour: updatedTour });
  } catch (error: any) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update tour' },
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
    await db.tourPackage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Tour deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete tour' },
      { status: 500 }
    );
  }
}
