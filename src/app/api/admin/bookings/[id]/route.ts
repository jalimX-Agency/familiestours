import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, totalPrice, message } = body;

    const updatedBooking = await db.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(totalPrice !== undefined && { totalPrice: parseFloat(totalPrice) }),
        ...(message !== undefined && { message }),
      },
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;

    await db.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Booking deleted' });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
