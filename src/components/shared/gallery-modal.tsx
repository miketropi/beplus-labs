"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function GalleryModal({ images }: { images: string[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  const open = useCallback((i: number) => setSelected(i), []);
  const close = useCallback(() => setSelected(null), []);

  const prev = useCallback(() => {
    setSelected((s) => (s !== null ? (s - 1 + images.length) % images.length : null));
  }, [images.length]);

  const next = useCallback(() => {
    setSelected((s) => (s !== null ? (s + 1) % images.length : null));
  }, [images.length]);

  useEffect(() => {
    if (selected === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [selected, close, prev, next]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => open(i)}
            className="group overflow-hidden rounded-xl border bg-card transition-all hover:border-brand-bright/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <img
              src={url}
              alt={`Screenshot ${i + 1}`}
              className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selected]}
                alt={`Screenshot ${selected + 1}`}
                className="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
              />

              <button
                onClick={close}
                className="absolute -top-3 -right-3 flex size-8 items-center justify-center rounded-full bg-background text-muted-foreground shadow-md transition-colors hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background"
                    aria-label="Next"
                  >
                    <ChevronRight className="size-5" />
                  </button>

                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-white/70">
                    {selected + 1} / {images.length}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
