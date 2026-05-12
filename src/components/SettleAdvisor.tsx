
"use client";

import React, { useState } from 'react';
import { smartSettleAdvisor } from '@/ai/flows/smart-settle-advisor-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Send, Loader2, User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function SettleAdvisor() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好！我是维界 AI 助手。我可以帮你解答关于新加坡银行开户、交通卡办理、留学签转换等任何生活问题。你今天想了解什么？'
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await smartSettleAdvisor({ question: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: response.advice }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我现在遇到了一点小麻烦，请稍后再试。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex h-[600px] flex-col border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="font-headline text-xl">智能落户助手</CardTitle>
            <CardDescription>为您提供最专业的本地生活咨询</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden px-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="flex flex-col gap-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex w-full gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white text-muted-foreground'}`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`flex max-w-[80%] flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border text-foreground'}`}>
                    {msg.content.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex w-full gap-3 flex-row">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-white text-muted-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <div className="rounded-2xl bg-card border px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="询问关于银行开户、EZ-Link、电话卡..."
            className="border-none bg-transparent focus-visible:ring-0 shadow-none text-base"
          />
          <Button type="submit" size="icon" disabled={loading} className="rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
