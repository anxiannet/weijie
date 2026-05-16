'use client';

import {useState} from 'react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {SubmitButton} from './SubmitButton';

type AuthFormsProps = {
  canSubmit: boolean;
  redirectTo: string;
};

export function AuthForms({canSubmit, redirectTo}: AuthFormsProps) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const isSignIn = mode === 'sign-in';

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <Badge variant={isSignIn ? 'default' : 'outline'} className="w-fit rounded-md">
            {isSignIn ? '登录' : '注册'}
          </Badge>
          <div className="grid grid-cols-2 rounded-md border bg-muted p-1">
            <Button
              type="button"
              size="sm"
              variant={isSignIn ? 'default' : 'ghost'}
              className="h-8 rounded"
              onClick={() => setMode('sign-in')}
            >
              登录
            </Button>
            <Button
              type="button"
              size="sm"
              variant={isSignIn ? 'ghost' : 'default'}
              className="h-8 rounded"
              onClick={() => setMode('sign-up')}
            >
              注册
            </Button>
          </div>
        </div>
        <CardTitle className="font-headline text-3xl">
          {isSignIn ? '进入维界账户' : '创建发布与收藏账户'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSignIn ? (
          <form action="/auth/sign-in" method="post" className="space-y-4">
            <input type="hidden" name="redirect_to" value={redirectTo} />
            <div className="space-y-2">
              <Label htmlFor="signin-email">邮箱</Label>
              <Input id="signin-email" name="email" type="text" inputMode="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">密码</Label>
              <Input id="signin-password" name="password" type="password" required minLength={8} />
            </div>
            <SubmitButton className="w-full" disabled={!canSubmit} idleText="登录" pendingText="登录中..." />
          </form>
        ) : (
          <form action="/auth/sign-up" method="post" className="space-y-4">
            <input type="hidden" name="redirect_to" value={redirectTo} />
            <div className="space-y-2">
              <Label htmlFor="display-name">显示名称</Label>
              <Input id="display-name" name="display_name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">邮箱</Label>
              <Input id="signup-email" name="email" type="text" inputMode="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">密码</Label>
              <Input id="signup-password" name="password" type="password" required minLength={8} />
            </div>
            <SubmitButton className="w-full" variant="secondary" disabled={!canSubmit} idleText="注册" pendingText="提交中..." />
          </form>
        )}
      </CardContent>
    </Card>
  );
}
