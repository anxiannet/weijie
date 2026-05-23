import {NextRequest, NextResponse} from 'next/server';

const ANXIAN_HOSTS = new Set(['anxian.weijie.sg']);

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase();
  const {pathname, search} = request.nextUrl;

  if (!host || !ANXIAN_HOSTS.has(host)) {
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
