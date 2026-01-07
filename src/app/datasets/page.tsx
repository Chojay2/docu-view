"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { SearchBar } from "@/components/SearchBar";
import { DatasetFilters } from "@/components/DatasetFilters";
import { DatasetListItem } from "@/components/DatasetListItem";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CodeSnippet } from "@/components/CodeSnippet";
import { formatDate, cn } from "@/lib/utils";
import { Tag, Calendar, Database, ExternalLink } from "lucide-react";

export default function DatasetsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;
  const format = searchParams.get("format") || undefined;
  const formats = searchParams.getAll("format");
  const tag = searchParams.getAll("tag");
  const organization = searchParams.get("organization") || undefined;
  const selectedAgencies = searchParams.getAll("organization");
  const sort = searchParams.get("sort") || "relevance";
  const page = parseInt(searchParams.get("page") || "1");
  const selectedSlug = searchParams.get("dataset") || undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["datasets", { q, category, format, tag, page }],
    queryFn: () =>
      apiClient.getDatasets({
        q,
        category,
        format,
        tag: tag.length > 0 ? tag : undefined,
        page,
        limit: 20,
      }),
  });

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete("page"); // Reset to page 1 when filters change
    router.push(`/datasets?${params.toString()}`);
  };

  // Extract unique categories, formats, and organizations from all datasets
  const { data: allData } = useQuery({
    queryKey: ["datasets", "all"],
    queryFn: () => apiClient.getDatasets({ limit: 1000 }),
  });

  const categories = Array.from(
    new Set(allData?.data.map((d) => d.category) || [])
  ).sort();
  const allFormats = Array.from(
    new Set(allData?.data.flatMap((d) => d.dataFormat) || [])
  ).sort();
  // Dummy agencies list for now
  const allAgencies = [
    "ACRA",
    "Ministry of Health",
    "Ministry of Environment",
    "Ministry of Economy",
    "Transport Authority",
    "Education Department",
    "Research Institute",
  ];

  const updateFormats = (newFormats: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("format");
    newFormats.forEach((f) => params.append("format", f));
    params.delete("page");
    router.push(`/datasets?${params.toString()}`);
  };

  const updateAgencies = (newAgencies: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("organization");
    newAgencies.forEach((a) => params.append("organization", a));
    params.delete("page");
    router.push(`/datasets?${params.toString()}`);
  };

  // Get selected dataset details
  const { data: selectedDataset, isLoading: isLoadingDataset } = useQuery({
    queryKey: ["dataset", selectedSlug],
    queryFn: () => apiClient.getDatasetBySlug(selectedSlug!),
    enabled: !!selectedSlug,
  });

  // Get related datasets (same category)
  const { data: relatedDatasets } = useQuery({
    queryKey: [
      "datasets",
      "related",
      selectedDataset?.category,
      selectedDataset?.id,
    ],
    queryFn: () =>
      apiClient.getDatasets({ category: selectedDataset!.category, limit: 27 }),
    enabled: !!selectedDataset && !!selectedDataset.category,
  });

  const relatedDatasetsList =
    relatedDatasets?.data
      .filter((d) => d.id !== selectedDataset?.id)
      .slice(0, 27) || [];

  const handleDatasetSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("dataset", slug);
    router.push(`/datasets?${params.toString()}`);
  };

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const queryUrl = selectedDataset
    ? `${apiBaseUrl}/datasets/${selectedDataset.id}/query?limit=10`
    : "";

  return (
    <div className="min-h-screen  p-6 bg-white">
      <div className="bg-white px-8">
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="">
          <div className="flex items-center justify-between border-b-[1.5px] border-black/10 pb-6">
            <div>
              <DatasetFilters
                categories={categories}
                formats={allFormats}
                agencies={allAgencies}
                selectedCategory={category}
                selectedFormats={formats}
                selectedAgencies={selectedAgencies}
                sortBy={sort}
                onCategoryChange={(cat) =>
                  updateSearchParams({ category: cat })
                }
                onFormatChange={updateFormats}
                onAgencyChange={updateAgencies}
                onSortChange={(s) => updateSearchParams({ sort: s })}
              />
            </div>
            <SearchBar />
          </div>
        </div>
      </div>
      <div className="flex  min-h-[calc(100vh-200px)] bg-[var(--color-bg-surface-soft)]">
        {/* Left Sidebar - Dataset List */}
        <aside className="w-110 border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] sticky top-8 h-[calc(100vh-120px)]">
          <div className="p-6 h-full flex flex-col">
            {/* Dataset Collections List */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]/40 mb-3">
                {data?.pagination.total} Datasets Collections
              </h3>
              <div className="flex-1 space-y-1 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8 text-[var(--color-text-muted)] text-[14px]">
                    Loading...
                  </div>
                ) : data?.data.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-text-muted)] text-[14px]">
                    No datasets found
                  </div>
                ) : (
                  data?.data.map((dataset) => (
                    <DatasetListItem
                      key={dataset.id}
                      dataset={dataset}
                      onClick={() => handleDatasetSelect(dataset.slug)}
                      isSelected={selectedSlug === dataset.slug}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side - Dataset Detail View */}
        <main className="flex-1 p-8 overflow-y-auto bg-white m-6 rounded-lg">
          {selectedSlug ? (
            isLoadingDataset ? (
              <div className="text-center py-12 text-[var(--color-text-muted)]">
                Loading dataset...
              </div>
            ) : selectedDataset ? (
              <>
                {/* Header Section */}
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-brand-primary-soft)] text-[var(--color-brand-primary)] text-[14px] font-medium mb-4">
                    {selectedDataset.category}
                  </span>
                  <h1 className="text-[18px] font-bold text-[var(--color-text-primary)] mb-4">
                    {selectedDataset.title}
                  </h1>
                  {selectedDataset.description && (
                    <p className="text-[14px] text-[var(--color-text-muted)] mb-6">
                      {selectedDataset.description}
                      {selectedDataset.sourceOrg && (
                        <>
                          {" "}
                          <a
                            href={`#`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-brand-primary)] hover:underline"
                          >
                            Learn more
                          </a>
                        </>
                      )}
                    </p>
                  )}
                </div>

                {/* CTA Section */}
                <div className="flex items-center gap-4 mb-8">
                  {selectedDataset.resources &&
                  selectedDataset.resources.length > 0 ? (
                    <button
                      onClick={() => {
                        const firstResource = selectedDataset.resources?.[0];
                        if (firstResource?.storageUrl) {
                          window.open(firstResource.storageUrl, "_blank");
                        }
                      }}
                      className="px-6 py-3 bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] rounded-lg hover:opacity-90 transition-opacity text-[14px] font-medium"
                    >
                      Download files ({selectedDataset.resources.length})
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-6 py-3 bg-[var(--color-bg-surface-soft)] text-[var(--color-text-muted)] rounded-lg cursor-not-allowed text-[14px] font-medium"
                    >
                      Download files (0)
                    </button>
                  )}
                  {selectedDataset.sourceOrg && (
                    <a
                      href={`#`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 border border-[var(--color-border-subtle)] rounded-lg hover:bg-[var(--color-bg-surface-soft)] transition-colors text-[14px]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      External Link
                    </a>
                  )}
                </div>

                {/* Two Sub-columns */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  {/* Left Sub-column: Related Datasets */}
                  <div>
                    <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-4">
                      Related datasets
                    </h2>
                    <div className="space-y-1 border border-[var(--color-border-subtle)] rounded-lg bg-[var(--color-bg-surface)]">
                      {relatedDatasetsList.length > 0 ? (
                        relatedDatasetsList.map((relatedDataset) => (
                          <div
                            key={relatedDataset.id}
                            onClick={() =>
                              handleDatasetSelect(relatedDataset.slug)
                            }
                            className="p-3 border-b border-[var(--color-border-subtle)] last:border-b-0 hover:bg-[var(--color-bg-surface-soft)] transition-colors cursor-pointer"
                          >
                            <h3 className="text-[18px] font-medium text-[var(--color-text-primary)] mb-1">
                              {relatedDataset.title}
                            </h3>
                            <div className="flex items-center gap-3 text-[12px] text-[var(--color-text-muted)]">
                              <span className="flex items-center gap-1">
                                <Database className="w-3 h-3" />
                                {relatedDataset.dataFormat[0] || "CSV"}
                              </span>
                              <span>•</span>
                              <span>
                                {formatDate(relatedDataset.updatedAt)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-[14px] text-[var(--color-text-muted)]">
                          No related datasets found
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Sub-column: Developer Snippet */}
                  <div>
                    <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-4">
                      Sample OpenAPI query
                    </h2>
                    <CodeSnippet
                      language="python"
                      title="Python"
                      code={`import requests

r = requests.get("${queryUrl}")
data = r.json()
print(data)`}
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {selectedDataset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-brand-primary-soft)] text-[var(--color-brand-primary)] text-[14px]"
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2">
                      Category
                    </h3>
                    <p className="text-[14px] text-[var(--color-text-primary)]">
                      {selectedDataset.category}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2">
                      License
                    </h3>
                    <p className="text-[14px] text-[var(--color-text-primary)]">
                      {selectedDataset.license}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2">
                      Source Organization
                    </h3>
                    <p className="text-[14px] text-[var(--color-text-primary)]">
                      {selectedDataset.sourceOrg}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2">
                      Last Updated
                    </h3>
                    <p className="text-[14px] text-[var(--color-text-primary)] flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedDataset.updatedAt)}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-[var(--color-text-muted)] mb-4">
                  Dataset not found
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-muted)] text-[16px]">
                Select a dataset from the list to view details
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
