import {NextResponse, type NextRequest} from 'next/server';
import {createAuthRouteClient, getSafeRedirectPath, getSiteUrl, redirectTo, requireAuthString, toAuthMessage} from '../auth-utils';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const redirectPath = getSafeRedirectPath(formData.get('redirect_to'));
  const response = NextResponse.redirect(new URL(redirectPath, request.url), {status: 303});
  const supabase = createAuthRouteClient(request, response);

  if (!supabase) {
    return redirectTo(request, '/auth?error=config');
  }

  const email = requireAuthString(formData, 'email');
  const password = requireAuthString(formData, 'password');
  const displayName = requireAuthString(formData, 'display_name');
  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl(request)}/auth/callback`,
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    return redirectTo(request, `/auth?next=${encodeURIComponent(redirectPath)}&error=${encodeURIComponent(toAuthMessage(error.message))}`);
  }

  if (data.session) {
    return response;
  }

  return redirectTo(
    request,
    `/auth?next=${encodeURIComponent(redirectPath)}&message=${encodeURIComponent('账户已创建。请在 Supabase 关闭邮箱确认后，即可注册后直接登录。')}`
  );
}
