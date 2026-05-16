import {NextResponse, type NextRequest} from 'next/server';
import {createAuthRouteClient, getSafeRedirectPath, redirectTo, requireAuthString, toAuthMessage} from '../auth-utils';

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
  const {error} = await supabase.auth.signInWithPassword({email, password});

  if (error) {
    return redirectTo(request, `/auth?next=${encodeURIComponent(redirectPath)}&error=${encodeURIComponent(toAuthMessage(error.message))}`);
  }

  return response;
}
