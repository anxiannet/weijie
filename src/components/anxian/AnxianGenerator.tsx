'use client';

import {useMemo, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import type {AnxianTemplate} from '@/lib/anxian/templates';
import {formatSgd} from '@/lib/anxian/templates';

type PreviewResult = {
  ok: boolean;
  generationId?: string;
  preview?: {
    title: string;
    lines: string[];
    watermark: string;
  };
  error?: string;
};

function getAnonymousId() {
  const key = 'anxian_anonymous_id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}

export function AnxianGenerator({template}: {template: AnxianTemplate}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PreviewResult | null>(null);

  const missingRequired = useMemo(() => {
    return template.fields.filter((field) => field.required && !values[field.name]?.trim());
  }, [template.fields, values]);

  async function generatePreview() {
    setIsGenerating(true);
    setResult(null);

    try {
      const anonymousId = getAnonymousId();
      const response = await fetch('/api/anxian/preview', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          anonymousId,
          templateSlug: template.slug,
          inputPayload: values,
        }),
      });

      const data = (await response.json()) as PreviewResult;
      setResult(data);
    } catch (error) {
      setResult({ok: false, error: error instanceof Error ? error.message : '生成失败'});
    } finally {
      setIsGenerating(false);
    }
  }

  async function trackCheckoutClick() {
    try {
      await fetch('/api/anxian/track', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          anonymousId: getAnonymousId(),
          eventName: 'checkout_click',
          templateSlug: template.slug,
          generationId: result?.generationId,
          properties: {priceCents: template.priceCents},
        }),
      });
    } catch {
      // Analytics must never block checkout UX.
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-white/10 bg-white/5 text-white">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <div className="text-sm uppercase tracking-widest text-white/40">上传图片</div>
            <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/20 px-6 text-center text-white/40">
              第一版先用文本生成低清预览；图片上传在下一步接入 anx_uploads。
            </div>
          </div>

          <div className="grid gap-4">
            {template.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm text-white/60">
                  {field.label}
                  {field.required ? <span className="ml-1 text-emerald-300">*</span> : null}
                </label>

                {field.type === 'textarea' ? (
                  <Textarea
                    value={values[field.name] || ''}
                    onChange={(event) =>
                      setValues((current) => ({...current, [field.name]: event.target.value}))
                    }
                    placeholder={field.placeholder}
                    className="min-h-[120px] border-white/10 bg-black/20 text-white placeholder:text-white/25"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={values[field.name] || ''}
                    onChange={(event) =>
                      setValues((current) => ({...current, [field.name]: event.target.value}))
                    }
                    className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                  >
                    <option value="">请选择</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option} className="bg-[#071412]">
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={values[field.name] || ''}
                    onChange={(event) =>
                      setValues((current) => ({...current, [field.name]: event.target.value}))
                    }
                    placeholder={field.placeholder}
                    className="border-white/10 bg-black/20 text-white placeholder:text-white/25"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
            <Button
              className="bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50"
              disabled={isGenerating || missingRequired.length > 0}
              onClick={generatePreview}
            >
              {isGenerating ? '生成中...' : '生成低清预览'}
            </Button>

            <div className="text-sm text-white/50">
              免费预览带水印 · 高清无水印 {formatSgd(template.priceCents)}
            </div>
          </div>

          {missingRequired.length > 0 ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100/80">
              请先填写：{missingRequired.map((field) => field.label).join('、')}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="overflow-hidden border-white/10 bg-white/5 text-white">
          <div className="flex aspect-[4/5] items-center justify-center bg-[linear-gradient(135deg,#0f766e22,#000)] p-6">
            {result?.ok && result.preview ? (
              <div className="w-full rounded-3xl border border-white/15 bg-black/45 p-6 shadow-2xl backdrop-blur">
                <div className="mb-5 text-sm uppercase tracking-[0.3em] text-emerald-300/70">
                  ANXIAN PREVIEW
                </div>
                <h2 className="text-3xl font-black leading-tight">{result.preview.title}</h2>
                <div className="mt-6 space-y-3 text-lg text-white/80">
                  {result.preview.lines.map((line) => (
                    <div key={line} className="rounded-2xl bg-white/10 px-4 py-3">
                      {line}
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-right text-xs text-white/35">
                  {result.preview.watermark}
                </div>
              </div>
            ) : (
              <div className="text-center text-white/35">
                <div className="text-2xl font-bold">免费低清预览</div>
                <div className="mt-2 text-sm">填写左侧内容后生成</div>
              </div>
            )}
          </div>

          <CardContent className="space-y-4 p-6">
            <div>
              <div className="text-sm uppercase tracking-widest text-white/40">Preview</div>
              <div className="mt-2 text-2xl font-bold">
                {result?.ok ? '预览已生成' : '等待生成'}
              </div>
            </div>

            {result?.ok ? (
              <Button
                className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
                onClick={trackCheckoutClick}
              >
                下载高清无水印 · {formatSgd(template.priceCents)}
              </Button>
            ) : null}

            {result?.ok === false ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100/80">
                {result.error || '生成失败，请稍后再试。'}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5 text-white">
          <CardContent className="space-y-3 p-6">
            <div className="text-sm uppercase tracking-widest text-emerald-300/70">商业模型</div>
            <div className="text-2xl font-black text-emerald-300">Preview → Pay → HD</div>
            <p className="text-sm text-white/60">
              免费阶段只生成低清带水印预览；用户确认要高清版后再进入付费与高清生成，避免 API 被白嫖。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
