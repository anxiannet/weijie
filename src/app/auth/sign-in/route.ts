import {NextResponse, type NextRequest} from 'next/server';
import {createAuthRouteClient, redirectTo, requireAuthString, toAuthMessage} from '../auth-utils';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url), {status: 303});
  const supabase = createAuthRouteClient(request, response);

  if (!supabase) {
    return redirectTo(request, '/auth?error=config');
  }

  const formData = await request.formData();
  const email = requireAuthString(formData, 'email');
  const password = requireAuthString(formData, 'password');
  const {error} = await supabase.auth.signInWithPassword({email, password});

  if (error) {
    return redirectTo(request, `/auth?error=${encodeURIComponent(toAuthMessage(error.message))}`);
  }

  return response;
}
