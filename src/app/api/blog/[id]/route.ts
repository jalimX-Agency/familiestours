import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db.blogPost.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = Array.isArray(body.tags) ? body.tags : [];
    if (body.heroImage !== undefined) updateData.heroImage = body.heroImage;
    if (body.heroImageAlt !== undefined) updateData.heroImageAlt = body.heroImageAlt;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;
    if (body.readingTime !== undefined) updateData.readingTime = Number(body.readingTime);
    if (body.published !== undefined) updateData.published = Boolean(body.published);

    const updatedPost = await db.blogPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update blog post' },
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
    await db.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
