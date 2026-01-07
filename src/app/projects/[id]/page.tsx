'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { ExternalLink, Database, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => apiClient.getProject(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-surface-soft)] flex items-center justify-center">
        <div className="text-[var(--color-text-muted)]">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-surface-soft)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[20px] font-bold text-[var(--color-text-primary)] mb-2">
            Project not found
          </h1>
          <Link href="/projects" className="text-[var(--color-brand-primary)] hover:underline text-[14px]">
            Browse all projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-surface-soft)]">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.title }
        ]} />

        <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-subtle)] p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-[20px] font-bold text-[var(--color-text-primary)]">
              {project.title}
            </h1>
            <a
              href={project.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] rounded-lg hover:opacity-90 transition-opacity text-[14px]"
            >
              <ExternalLink className="w-4 h-4" />
              View {project.linkType}
            </a>
          </div>

          {project.abstract && (
            <p className="text-[14px] text-[var(--color-text-muted)] mb-6">{project.abstract}</p>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {project.authors.length > 0 && (
              <div>
                <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Authors
                </h3>
                <p className="text-[14px] text-[var(--color-text-primary)]">
                  {project.authors.join(', ')}
                </p>
              </div>
            )}
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created
              </h3>
              <p className="text-[14px] text-[var(--color-text-primary)]">
                {formatDate(project.createdAt)}
              </p>
            </div>
          </div>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[var(--color-brand-primary-soft)] text-[var(--color-brand-primary)] text-[14px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Datasets Used */}
        {project.datasets && project.datasets.length > 0 && (
          <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-subtle)] p-6">
            <h2 className="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Datasets Used
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {project.datasets.map((projectDataset: any) => (
                <Link
                  key={projectDataset.dataset.id}
                  href={`/datasets/${projectDataset.dataset.slug}`}
                  className="block p-4 bg-[var(--color-bg-surface-soft)] rounded-lg border border-[var(--color-border-subtle)] hover:shadow-[var(--shadow-soft)] transition-shadow"
                >
                  <h3 className="font-medium text-[14px] text-[var(--color-text-primary)] mb-2">
                    {projectDataset.dataset.title}
                  </h3>
                  {projectDataset.dataset.description && (
                    <p className="text-[14px] text-[var(--color-text-muted)] line-clamp-2">
                      {projectDataset.dataset.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

