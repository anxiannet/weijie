import {NextResponse, type NextRequest} from 'next/server';
import {createAuthRouteClient, redirectTo, toAuthMessage} from '../auth-utils';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  const errorDescription = requestUrl.searchParams.get('error_description');

  if (errorDescription) {
    return redirectTo(request, `/auth?error=${encodeURIComponent(toAuthMessage(errorDescription))}`);
  }

  if (!code) {
    return redirectTo(request, '/auth?error=确认链接无效或已过期，请重新注册或重新发送确认邮件。');
  }

  const response = NextResponse.redirect(new URL(next, request.url), {status: 303});
  const supabase = createAuthRouteClient(request, response);

  if (!supabase) {
    return redirectTo(request, '/auth?error=config');
  }

  const {error} = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectTo(request, `/auth?error=${encodeURIComponent(toAuthMessage(error.message))}`);
  }

  return response;
}
