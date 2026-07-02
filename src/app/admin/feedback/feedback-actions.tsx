"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, CheckCheck, Eye, X } from "lucide-react";
import { markFeedbackRead, deleteFeedback } from "@/lib/admin-actions";

const CATEGORY_LABELS: Record<string, string> = {
  bug: "Bug Report",
  feature: "Feature Request",
  improvement: "Improvement",
  general: "General",
};

type FeedbackItem = {
  id: number;
  name: string;
  email: string;
  category: string;
  productSlug: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
};

export function FeedbackActions({
  item,
}: {
  item: FeedbackItem;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent"
          title="View details"
        >
          <Eye className="size-3" />
        </button>
        {!item.read && (
          <form action={markFeedbackRead.bind(null, item.id)}>
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent"
              title="Mark as read"
            >
              <CheckCheck className="size-3" /> Read
            </button>
          </form>
        )}
        <form
          action={deleteFeedback.bind(null, item.id)}
          onSubmit={(e) => {
            if (!confirm("Delete this feedback?")) {
              e.preventDefault();
            }
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="size-3" />
          </button>
        </form>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="relative w-full max-w-lg rounded-xl border bg-card p-6 text-left shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>

              <h2 className="text-lg font-semibold text-foreground">
                Feedback Details
              </h2>

              <div className="mt-5 space-y-5">
                <div className="grid gap-4">
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      From
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                    {item.productSlug && (
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                        {item.productSlug}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Message
                  </p>
                  <div className="mt-1.5 whitespace-pre-wrap rounded-lg border bg-card p-4 text-sm leading-relaxed text-foreground">
                    {item.message}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
