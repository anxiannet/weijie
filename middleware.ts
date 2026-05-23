import {NextRequest, NextResponse} from 'next/server';

const ANXIAN_HOSTS = new Set(['anxian.weijie.sg']);

function normalizeHost(value: string | null) {
  return value?.split(',')[0]?.split(':')[0]?.trim().toLowerCase();
}

function getRequestHost(request: NextRequest) {
  const host = normalizeHost(request.headers.get('host'));
  const forwardedHost = normalizeHost(request.headers.get('x-forwarded-host'));

  if (forwardedHost && ANXIAN_HOSTS.has(forwardedHost)) {
    return forwardedHost;
  }

  return host;
}

export function middleware(request: NextRequest) {
  const requestHost = getRequestHost(request);
  const {pathname, search} = request.nextUrl;

  if (!requestHost || !ANXIAN_HOSTS.has(requestHost)) {
    return NextResponse.next();
  }

  // Keep diagnostics outside the rewrite path so it can verify whether the
  // custom domain reached this deployment even when the anxian rewrite fails.
  if (pathname === '/diagnostics' || pathname.startsWith('/diagnostics/')) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|css|js|map|txt|xml)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname === '') {
    const url = request.nextUrl.clone();
    url.pathname = '/anxian';
    url.search = search;
    return NextResponse.rewrite(url);
  }

  if (!pathname.startsWith('/anxian')) {
    const url = request.nextUrl.clone();
    url.pathname = `/anxian${pathname}`;
    url.search = search;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
