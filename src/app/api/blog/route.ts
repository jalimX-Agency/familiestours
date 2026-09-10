import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || undefined;
    const publishedOnly = searchParams.get('publishedOnly') === 'true';
    const slug = searchParams.get('slug') || undefined;

    const posts = await db.blogPost.findMany({
      where: {
        ...(locale ? { locale } : {}),
        ...(publishedOnly ? { published: true } : {}),
        ...(slug ? { slug } : {}),
      },
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error('Error loading blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const {
      slug,
      locale,
      title,
      excerpt,
      content,
      category,
      tags,
      heroImage,
      heroImageAlt,
      metaTitle,
      metaDescription,
      readingTime,
      published,
    } = body;

    if (!slug || !locale || !title || !content) {
      return NextResponse.json(
        { success: false, error: 'slug, locale, title, and content are required' },
        { status: 400 }
      );
    }

    const newPost = await db.blogPost.create({
      data: {
        slug,
        locale,
        title,
        excerpt: excerpt || '',
        content,
        category: category || 'Travel Guide',
        tags: Array.isArray(tags) ? tags : [],
        heroImage: heroImage || '',
        heroImageAlt: heroImageAlt || title,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt || '',
        readingTime: typeof readingTime === 'number' ? readingTime : 5,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
