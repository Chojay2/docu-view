"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatasetListItemProps {
  dataset: {
    id: string;
    slug: string;
    title: string;
    category: string;
    dataFormat: string[];
    updatedAt: string;
    sourceOrg?: string;
  };
  onClick?: () => void;
  isSelected?: boolean;
}

export function DatasetListItem({
  dataset,
  onClick,
  isSelected,
}: DatasetListItemProps) {
  const content = (
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <h3 className="text-[18px] font-medium text-[var(--color-text-primary)] mb-1 truncate">
          {dataset.title}
        </h3>
        <div className="flex items-center gap-2 text-[14px] text-[black]/80">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            {dataset.dataFormat[0] || "CSV"}
          </span>
          <span>•</span>
          <span>{formatDate(dataset.updatedAt)}</span>
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "block p-4 hover:bg-black/5 rounded-md transition-colors cursor-pointer",
          isSelected && "bg-[var(--color-brand-primary-soft)]"
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/datasets/${dataset.slug}`}
      className="block p-4 hover:bg-black/5 rounded-md transition-colors"
    >
      {content}
    </Link>
  );
}
