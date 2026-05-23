'use client';

import Image from 'next/image';
import {useRef} from 'react';
import {Button} from '@/components/ui/button';

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export function AnxianImageUpload({value, onChange}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function onFileChange(file: File | null) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => onFileChange(event.target.files?.[0] || null)}
      />

      {value ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-black/30">
          <Image src={value} alt="upload preview" fill unoptimized className="object-cover" />
        </div>
      ) : (
        <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/20 px-6 text-center text-white/40">
          上传头像 / 房源图 / 战队图标
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          className="bg-white/10 text-white hover:bg-white/20"
          onClick={() => inputRef.current?.click()}
        >
          选择图片
        </Button>

        {value ? (
          <Button
            type="button"
            variant="ghost"
            className="text-white/60 hover:bg-white/10 hover:text-white"
            onClick={() => onChange(null)}
          >
            移除
          </Button>
        ) : null}
      </div>
    </div>
  );
}
