"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface ProjectListItemProps {
  project: {
    id: string;
    title: string;
    authors: string[];
    createdAt: string;
    tags?: string[];
  };
  onClick?: () => void;
  isSelected?: boolean;
}

export function ProjectListItem({
  project,
  onClick,
  isSelected,
}: ProjectListItemProps) {
  const content = (
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <h3 className="text-[18px] font-medium text-[var(--color-text-primary)] mb-1 truncate">
          {project.title}
        </h3>
        <div className="flex items-center gap-2 text-[14px] text-[black]/80">
          {project.authors.length > 0 && (
            <>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {project.authors[0]}
                {project.authors.length > 1 &&
                  ` +${project.authors.length - 1}`}
              </span>
              <span>•</span>
            </>
          )}
          <span>{formatDate(project.createdAt)}</span>
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
      href={`/projects/${project.id}`}
      className="block p-4 hover:bg-black/5 rounded-md transition-colors"
    >
      {content}
    </Link>
  );
}
