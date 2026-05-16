import { NextRequest, NextResponse } from 'next/server';

const locales = ['en-us', 'en-gb', 'en-in', 'de', 'fr', 'es', 'it', 'pt-br', 'ru', 'tr', 'uz'];
const defaultLocale = 'en-us';

// Locale prefix mapping for URL paths
const localePathMap: Record<string, string> = {
  'en-gb': 'uk',
  'en-in': 'in',
  'de': 'de',
  'fr': 'fr',
  'es': 'es',
  'it': 'it',
  'pt-br': 'br',
  'ru': 'ru',
  'tr': 'tr',
  'uz': 'uz',
};

function getLocaleFromPath(pathname: string): string | null {
  const pathPrefix = pathname.split('/')[1];
  for (const [locale, prefix] of Object.entries(localePathMap)) {
    if (pathPrefix === prefix) return locale;
  }
  return null;
}

function getLocaleFromHeaders(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') || '';
  // Parse accept-language and match to supported locales
  for (const locale of locales) {
    if (acceptLanguage.includes(locale.split('-')[0])) return locale;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/build-') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/my-documents') ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/signup') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const localeFromPath = getLocaleFromPath(pathname);

  if (localeFromPath) {
    // Set locale cookie
    const response = NextResponse.next();
    response.cookies.set('i18next', localeFromPath, { path: '/' });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico|robots.txt|sitemap.xml).*)'],
};
