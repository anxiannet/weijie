import {NextResponse, type NextRequest} from 'next/server';
import {createServerClient} from '@supabase/ssr';

const protectedPathPatterns = [
  /^\/favorites(?:\/|$)/,
  /^\/listings\/new(?:\/|$)/,
  /^\/listings\/[^/]+\/edit(?:\/|$)/,
];

function isProtectedPath(pathname: string) {
  return protectedPathPatterns.some((pattern) => pattern.test(pathname));
}

function getSafeNextPath(request: NextRequest) {
  return `${request.nextUrl.pathname}${request.nextUrl.search}`;
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({request});
  }

  let response = NextResponse.next({request});

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({name, value}) => request.cookies.set(name, value));
        response = NextResponse.next({request});
        cookiesToSet.forEach(({name, value, options}) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth';
    redirectUrl.search = '';
    redirectUrl.searchParams.set('next', getSafeNextPath(request));
    redirectUrl.searchParams.set('message', '登录后可以继续操作');
    return NextResponse.redirect(redirectUrl);
  }

  if (user && request.nextUrl.pathname === '/auth') {
    const nextPath = request.nextUrl.searchParams.get('next');
    const targetPath = nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//') && !nextPath.startsWith('/auth') ? nextPath : '/';
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
