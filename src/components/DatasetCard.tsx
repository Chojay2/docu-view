"use client";

import Link from "next/link";
import { Dataset } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Tag, Calendar, Database } from "lucide-react";

interface DatasetCardProps {
  dataset: Dataset;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <Link
      href={`/datasets/${dataset.slug}`}
      className="block bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-subtle)] p-6 hover:shadow-[var(--shadow-card)] transition-shadow"
    >
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
        {dataset.title}
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {dataset.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-brand-primary-soft)] text-[var(--color-brand-primary)] text-xs"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1">
          <Database className="w-4 h-4" />
          {dataset.dataFormat.join(", ")}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(dataset.updatedAt)}
        </span>
      </div>
    </Link>
  );
}
