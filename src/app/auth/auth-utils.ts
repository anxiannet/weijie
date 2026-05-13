import {NextResponse, type NextRequest} from 'next/server';
import {createServerClient} from '@supabase/ssr';
import {appEnv} from '@/lib/env';
import type {Database} from '@/lib/supabase/database.types';

export function requireAuthString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`缺少字段：${key}`);
  }
  return value.trim();
}

export function toAuthMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes('security purposes') && normalized.includes('request this after')) {
    const seconds = message.match(/after\s+(\d+)\s+seconds?/i)?.[1];
    return seconds ? `请求过于频繁，请 ${seconds} 秒后再试。` : '请求过于频繁，请稍后再试。';
  }

  if (normalized.includes('email link is invalid') || normalized.includes('expired')) {
    return '确认链接无效或已过期，请重新注册或重新发送确认邮件。';
  }

  if (normalized.includes('rate limit')) {
    return '注册邮件发送过于频繁，请稍后再试，或在 Supabase 配置自定义 SMTP 后继续测试。';
  }

  if (normalized.includes('invalid login credentials')) {
    return '邮箱或密码不正确。';
  }

  if (normalized.includes('email not confirmed')) {
    return '邮箱尚未确认。请在 Supabase 关闭邮箱确认，或先手动确认该用户。';
  }

  if (normalized.includes('already registered') || normalized.includes('already exists')) {
    return '这个邮箱已经注册，请直接登录。';
  }

  return message;
}

export function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url), {status: 303});
}

export function createAuthRouteClient(request: NextRequest, response: NextResponse) {
  if (!appEnv.supabaseUrl || !appEnv.supabaseAnonKey) {
    return null;
  }

  return createServerClient<Database>(appEnv.supabaseUrl, appEnv.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({name, value, options}) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

export function getSiteUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return configuredUrl ? configuredUrl.replace(/\/$/, '') : new URL(request.url).origin;
}
