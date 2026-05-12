
"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Bookmark } from 'lucide-react';

interface NotionCardProps {
  title: string;
  description?: string;
  imageUrl: string;
  badge?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
  isBookmarked?: boolean;
  onBookmark?: (e: React.MouseEvent) => void;
  className?: string;
}

export function NotionCard({
  title,
  description,
  imageUrl,
  badge,
  footer,
  onClick,
  isBookmarked,
  onBookmark,
  className,
}: NotionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md cursor-pointer",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {badge && (
          <div className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-semibold text-primary-foreground backdrop-blur-sm">
            {badge}
          </div>
        )}
        {onBookmark && (
          <button
            onClick={onBookmark}
            className={cn(
              "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/50 backdrop-blur-md transition-colors hover:bg-white/80",
              isBookmarked ? "text-accent" : "text-muted-foreground"
            )}
          >
            <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-headline text-lg font-bold leading-tight text-foreground line-clamp-1 mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {description}
          </p>
        )}
        <div className="mt-auto pt-2 border-t border-border/50">
          {footer}
        </div>
      </div>
    </div>
  );
}
