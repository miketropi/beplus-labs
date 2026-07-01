"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Paintbrush,
  Menu,
  Sparkles,
  Search,
  ImageOff,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  paintbrush: Paintbrush,
  menu: Menu,
  sparkles: Sparkles,
  search: Search,
};

interface ProductCoverImageProps {
  src: string;
  alt: string;
  iconName: string;
}

export function ProductCoverImage({
  src,
  alt,
  iconName,
}: ProductCoverImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const Icon = ICON_MAP[iconName];

  if (errored || !src) {
    return (
      <div className="flex aspect-4/3 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 via-brand-50 to-brand-200 dark:from-brand-950 dark:via-brand-900 dark:to-brand-950">
        {Icon ? (
          <Icon className="size-10 text-brand-400/60 dark:text-brand-600/60" />
        ) : (
          <ImageOff className="size-10 text-muted-foreground/40" />
        )}
      </div>
    );
  }

  return (
    <div className="aspect-4/3 overflow-hidden rounded-lg bg-gradient-to-br from-brand-100 via-brand-50 to-brand-200 dark:from-brand-950 dark:via-brand-900 dark:to-brand-950">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        className={cn(
          "h-full w-full object-cover object-top transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        unoptimized
      />
    </div>
  );
}
