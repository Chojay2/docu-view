"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ProjectListItem } from "@/components/ProjectListItem";
import { ProjectFilters } from "@/components/ProjectFilters";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CodeSnippet } from "@/components/CodeSnippet";
import { formatDate, cn } from "@/lib/utils";
import { ExternalLink, Database, Users, Calendar, Tag } from "lucide-react";
import Link from "next/link";

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") || "1");
  const selectedId = searchParams.get("project") || undefined;
  const tags = searchParams.getAll("tag");
  const authors = searchParams.getAll("author");
  const sort = searchParams.get("sort") || "newest";

  const { data, isLoading } = useQuery({
    queryKey: ["projects", { page, tags, authors, sort }],
    queryFn: () => apiClient.getProjects({ page, limit: 20 }),
  });

  // Get all projects for filter options
  const { data: allProjects } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: () => apiClient.getProjects({ limit: 1000 }),
  });

  // Get selected project details
  const { data: selectedProject, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", selectedId],
    queryFn: () => apiClient.getProject(selectedId!),
    enabled: !!selectedId,
  });

  const allTags = Array.from(
    new Set(allProjects?.data.flatMap((p) => p.tags) || [])
  ).sort();
  const allAuthors = Array.from(
    new Set(allProjects?.data.flatMap((p) => p.authors) || [])
  ).sort();

  const handleProjectSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("project", id);
    router.push(`/projects?${params.toString()}`);
  };

  const updateTags = (newTags: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    newTags.forEach((t) => params.append("tag", t));
    params.delete("page");
    router.push(`/projects?${params.toString()}`);
  };

  const updateAuthors = (newAuthors: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("author");
    newAuthors.forEach((a) => params.append("author", a));
    params.delete("page");
    router.push(`/projects?${params.toString()}`);
  };

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete("page");
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="bg-white px-8">
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="">
          <div className="flex items-center justify-between border-b-[1.5px] border-black/10 pb-6">
            <div>
              <h1 className="text-[18px] font-bold text-[var(--color-text-primary)] mb-4">
                Projects & Research
              </h1>
              <ProjectFilters
                tags={allTags}
                authors={allAuthors}
                selectedTags={tags}
                selectedAuthors={authors}
                sortBy={sort}
                onTagChange={updateTags}
                onAuthorChange={updateAuthors}
                onSortChange={(s) => updateSearchParams({ sort: s })}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-h-[calc(100vh-200px)] bg-[var(--color-bg-surface-soft)]">
        {/* Left Sidebar - Project List */}
        <aside className="w-110 border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] sticky top-8 h-[calc(100vh-120px)]">
          <div className="p-6 h-full flex flex-col">
            {/* Project Collections List */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]/40 mb-3">
                {data?.pagination.total || 0} Projects
              </h3>
              <div className="flex-1 space-y-1 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8 text-[var(--color-text-muted)] text-[14px]">
                    Loading...
                  </div>
                ) : data?.data.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-text-muted)] text-[14px]">
                    No projects found
                  </div>
                ) : (
                  data?.data.map((project) => (
                    <ProjectListItem
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectSelect(project.id)}
                      isSelected={selectedId === project.id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side - Project Detail View */}
        <main className="flex-1 p-8 overflow-y-auto bg-white m-6 rounded-lg">
          {selectedId ? (
            isLoadingProject ? (
              <div className="text-center py-12 text-[var(--color-text-muted)]">
                Loading project...
              </div>
            ) : selectedProject ? (
              <>
                {/* Header Section */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-[18px] font-bold text-[var(--color-text-primary)]">
                      {selectedProject.title}
                    </h1>
                    <a
                      href={selectedProject.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] rounded-lg hover:opacity-90 transition-opacity text-[14px]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View {selectedProject.linkType}
                    </a>
                  </div>

                  {selectedProject.abstract && (
                    <p className="text-[14px] text-[var(--color-text-muted)] mb-6">
                      {selectedProject.abstract}
                    </p>
                  )}
                </div>

                {/* Metadata */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {selectedProject.authors.length > 0 && (
                    <div>
                      <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Authors
                      </h3>
                      <p className="text-[14px] text-[var(--color-text-primary)]">
                        {selectedProject.authors.join(", ")}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created
                    </h3>
                    <p className="text-[14px] text-[var(--color-text-primary)]">
                      {formatDate(selectedProject.createdAt)}
                    </p>
                  </div>
                </div>

                {selectedProject.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[var(--color-brand-primary-soft)] text-[var(--color-brand-primary)] text-[14px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Datasets Used */}
                {selectedProject.datasets &&
                  selectedProject.datasets.length > 0 && (
                    <div>
                      <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Datasets Used
                      </h2>
                      <div className="space-y-1 border border-[var(--color-border-subtle)] rounded-lg bg-[var(--color-bg-surface)]">
                        {selectedProject.datasets.map((projectDataset: any) => (
                          <div
                            key={projectDataset.dataset.id}
                            className="p-3 border-b border-[var(--color-border-subtle)] last:border-b-0 hover:bg-[var(--color-bg-surface-soft)] transition-colors"
                          >
                            <Link
                              href={`/datasets?dataset=${projectDataset.dataset.slug}`}
                              className="block"
                            >
                              <h3 className="text-[14px] font-medium text-[var(--color-text-primary)] mb-1">
                                {projectDataset.dataset.title}
                              </h3>
                              {projectDataset.dataset.description && (
                                <p className="text-[14px] text-[var(--color-text-muted)] line-clamp-2">
                                  {projectDataset.dataset.description}
                                </p>
                              )}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-[var(--color-text-muted)] mb-4">
                  Project not found
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-muted)] text-[16px]">
                Select a project from the list to view details
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-6 bg-white">
        <div className="bg-white px-8">
          <div className="mb-6">
            <Breadcrumbs />
          </div>
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ProjectsPageContent />
    </Suspense>
  );
}
