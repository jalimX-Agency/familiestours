import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'fr', 'es'];
const defaultLocale = 'en';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore API routes, admin routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect root or unlocalized path to default locale
  const redirectUrl = new URL(
    `/${defaultLocale}${pathname === '/' ? '' : pathname}`,
    request.url
  );
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ['/((?!api|admin|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
