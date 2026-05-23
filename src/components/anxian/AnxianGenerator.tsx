'use client';

import Image from 'next/image';
import {useEffect, useMemo, useState} from 'react';
import {AnxianImageUpload} from '@/components/anxian/AnxianImageUpload';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {buildPreviewDataUrl} from '@/lib/anxian/renderPreview';
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PreviewResult | null>(null);

  const missingRequired = useMemo(() => {
    return template.fields.filter((field) => field.required && !values[field.name]?.trim());
  }, [template.fields, values]);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!result?.preview) {
        setPreviewImage(null);
        return;
      }

      setIsRenderingPreview(true);
      const dataUrl = await buildPreviewDataUrl({
        title: result.preview.title,
        lines: result.preview.lines,
        watermark: result.preview.watermark,
        imageUrl: uploadedImage,
      });

      if (!cancelled) {
        setPreviewImage(dataUrl);
        setIsRenderingPreview(false);
      }
    }

    void render();

    return () => {
      cancelled = true;
    };
  }, [result, uploadedImage]);

  async function generatePreview() {
    setIsGenerating(true);
    setPreviewImage(null);
    setResult(null);

    try {
      const anonymousId = getAnonymousId();
      const response = await fetch('/api/anxian/preview', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          anonymousId,
          templateSlug: template.slug,
          inputPayload: {
            ...values,
            hasUploadedImage: Boolean(uploadedImage),
          },
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

  async function trackEvent(eventName: 'checkout_click' | 'share_click', properties?: Record<string, unknown>) {
    try {
      await fetch('/api/anxian/track', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          anonymousId: getAnonymousId(),
          eventName,
          templateSlug: template.slug,
          generationId: result?.generationId,
          properties: {
            priceCents: template.priceCents,
            hasUploadedImage: Boolean(uploadedImage),
            ...properties,
          },
        }),
      });
    } catch {
      // Analytics must never block UX.
    }
  }

  async function downloadPreview() {
    if (!previewImage) return;

    const link = document.createElement('a');
    link.href = previewImage;
    link.download = `anxian-preview-${template.slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await trackEvent('share_click', {action: 'download_preview'});
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-white/10 bg-white/5 text-white">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <div className="text-sm uppercase tracking-widest text-white/40">上传图片</div>
            <AnxianImageUpload value={uploadedImage} onChange={setUploadedImage} />
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
              disabled={isGenerating || isRenderingPreview || missingRequired.length > 0}
              onClick={generatePreview}
            >
              {isGenerating || isRenderingPreview ? '生成中...' : '生成低清预览'}
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
            {previewImage ? (
              <div className="relative aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 shadow-2xl">
                <Image
                  src={previewImage}
                  alt="Anxian preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="text-center text-white/35">
                <div className="text-2xl font-bold">免费低清预览</div>
                <div className="mt-2 text-sm">上传图片并填写左侧内容后生成</div>
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

            {previewImage ? (
              <Button
                variant="secondary"
                className="w-full bg-white/10 text-white hover:bg-white/20"
                onClick={downloadPreview}
              >
                下载低清水印图
              </Button>
            ) : null}

            {result?.ok ? (
              <Button
                className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
                onClick={() => trackEvent('checkout_click')}
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
