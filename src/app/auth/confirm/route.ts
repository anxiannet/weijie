import type {EmailOtpType} from '@supabase/supabase-js';
import {NextResponse, type NextRequest} from 'next/server';
import {createAuthRouteClient, redirectTo, toAuthMessage} from '../auth-utils';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null;
  const next = requestUrl.searchParams.get('next') || '/';

  if (!tokenHash || !type) {
    return redirectTo(request, '/auth?error=确认链接无效或已过期，请重新注册或重新发送确认邮件。');
  }

  const response = NextResponse.redirect(new URL(next, request.url), {status: 303});
  const supabase = createAuthRouteClient(request, response);

  if (!supabase) {
    return redirectTo(request, '/auth?error=config');
  }

  const {error} = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    return redirectTo(request, `/auth?error=${encodeURIComponent(toAuthMessage(error.message))}`);
  }

  return response;
}
