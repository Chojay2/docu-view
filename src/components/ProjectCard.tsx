"use client";

import Link from "next/link";
import { Project } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { ExternalLink, Users } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block bg-bg-surface rounded-lg border border-border-subtle p-6 hover:shadow-card transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-text-primary">
          {project.title}
        </h3>
        <ExternalLink className="w-4 h-4 text-text-muted flex-shrink-0" />
      </div>
      {project.abstract && (
        <p className="text-sm text-text-muted mb-4 line-clamp-3">
          {project.abstract}
        </p>
      )}
      {project.authors.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-xs text-text-muted">
          <Users className="w-4 h-4" />
          <span>{project.authors.join(", ")}</span>
        </div>
      )}
      <div className="text-xs text-text-muted">
        {formatDate(project.createdAt)}
      </div>
    </Link>
  );
}
