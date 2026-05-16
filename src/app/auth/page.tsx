import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {hasSupabaseConfig} from '@/lib/env';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {getSafeRedirectPath} from './auth-utils';
import {AuthForms} from './AuthForms';

export const dynamic = 'force-dynamic';

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const message = Array.isArray(params.message) ? params.message[0] : params.message;
  const nextPath = getSafeRedirectPath(params.next);
  const supabase = await createSupabaseServerClient();
  const {
    data: {user},
  } = supabase ? await supabase.auth.getUser() : {data: {user: null}};

  if (user) {
    redirect(nextPath);
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">返回首页</Link>
        </Button>
        <div className="mx-auto max-w-xl">
          <AuthForms canSubmit={hasSupabaseConfig()} redirectTo={nextPath} />
        </div>

        {(error || message || !hasSupabaseConfig()) && (
          <Card className="mt-6">
            <CardContent className="p-5 text-sm leading-6">
              {!hasSupabaseConfig() && <p>当前缺少 Supabase 环境变量，认证功能需要部署配置后使用。</p>}
              {error && <p className="text-destructive">{decodeURIComponent(error)}</p>}
              {message && <p className="text-primary">{decodeURIComponent(message)}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
