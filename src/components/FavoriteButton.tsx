'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {Heart} from 'lucide-react';
import {Button} from '@/components/ui/button';
import type {ButtonProps} from '@/components/ui/button';

type FavoriteButtonProps = {
  listingId: string;
  initialIsFavorited: boolean;
  className?: string;
  showLabel?: boolean;
  refreshOnComplete?: boolean;
  size?: ButtonProps['size'];
  favoritedVariant?: ButtonProps['variant'];
  unfavoritedVariant?: ButtonProps['variant'];
};

export function FavoriteButton({
  listingId,
  initialIsFavorited,
  className,
  showLabel = false,
  refreshOnComplete = false,
  size = 'icon',
  favoritedVariant = 'outline',
  unfavoritedVariant = 'outline',
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, startTransition] = useTransition();

  function toggleFavorite() {
    const nextIsFavorited = !isFavorited;

    setIsFavorited(nextIsFavorited);
    startTransition(() => {
      void fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({listingId, isFavorited}),
      })
        .then((response) => {
          if (response.status === 401) {
            router.push('/auth?message=登录后可以收藏房源');
            return;
          }

          if (!response.ok) {
            throw new Error('收藏失败');
          }

          if (refreshOnComplete) {
            router.refresh();
          }
        })
        .catch(() => {
          setIsFavorited(isFavorited);
        });
    });
  }

  return (
    <Button
      type="button"
      variant={isFavorited ? favoritedVariant : unfavoritedVariant}
      size={size}
      className={className}
      disabled={isPending}
      aria-label={isFavorited ? '取消收藏' : '收藏房源'}
      onClick={toggleFavorite}
    >
      <Heart className={isFavorited ? 'h-4 w-4 fill-red-500 text-red-500' : 'h-4 w-4'} />
      {showLabel && (isFavorited ? '已收藏' : '收藏房源')}
    </Button>
  );
}
