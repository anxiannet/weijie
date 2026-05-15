'use client';

import {useState, useTransition} from 'react';
import Image from 'next/image';
import {ImagePlus, Loader2, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

type ListingImageUploadProps = {
  initialImageUrls?: string[];
};

export function ListingImageUpload({initialImageUrls = []}: ListingImageUploadProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const uploadFile = (file: File) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/uploads/listing-image', {
          method: 'POST',
          body: formData,
        });
        const uploadResult = await uploadResponse.json().catch(() => null);

        if (!uploadResponse.ok) {
          throw new Error(uploadResult?.error || '图片上传失败');
        }

        setImageUrls((current) => [...current, uploadResult.publicUrl]);
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : '图片上传失败');
      }
    });
  };

  return (
    <div className="space-y-4">
      {imageUrls.map((url) => (
        <input key={url} type="hidden" name="image_urls" value={url} />
      ))}

      <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/40 p-6 text-center transition-colors hover:bg-muted">
        {isPending ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : <ImagePlus className="h-6 w-6 text-muted-foreground" />}
        <span className="mt-3 text-sm font-medium">上传房源图片</span>
        <span className="mt-1 text-xs text-muted-foreground">支持 JPG、PNG、WebP，单张不超过 4MB</span>
        <Input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={isPending}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) uploadFile(file);
            event.currentTarget.value = '';
          }}
        />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {imageUrls.map((url) => (
            <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
              <Image src={url} alt="房源图片" fill unoptimized className="object-cover" sizes="160px" />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={() => setImageUrls((current) => current.filter((item) => item !== url))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
