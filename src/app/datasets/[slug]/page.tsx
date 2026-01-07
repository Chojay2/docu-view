"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { DataPreview } from "@/components/DataPreview";
import { DownloadButton } from "@/components/DownloadButton";
import { CodeSnippet } from "@/components/CodeSnippet";
import { formatDate } from "@/lib/utils";
import {
  Tag,
  Calendar,
  Database,
  FileText,
  ExternalLink,
  Code,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function DatasetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data: dataset, isLoading } = useQuery({
    queryKey: ["dataset", slug],
    queryFn: () => apiClient.getDatasetBySlug(slug),
  });

  const { data: sampleData } = useQuery({
    queryKey: ["dataset-sample", dataset?.id],
    queryFn: () => apiClient.getDatasetSample(dataset!.id, 50),
    enabled: !!dataset,
  });

  // Get related datasets (same category) - must be called before any conditional returns
  const { data: relatedDatasets } = useQuery({
    queryKey: ["datasets", "related", dataset?.category, dataset?.id],
    queryFn: () =>
      apiClient.getDatasets({ category: dataset!.category, limit: 27 }),
    enabled: !!dataset && !!dataset.category,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-surface-soft)] flex items-center justify-center">
        <div className="text-[var(--color-text-muted)]">Loading dataset...</div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-surface-soft)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[20px] font-bold text-[var(--color-text-primary)] mb-2">
            Dataset not found
          </h1>
          <Link
            href="/datasets"
            className="text-[var(--color-brand-primary)] hover:underline text-[14px]"
          >
            Browse all datasets
          </Link>
        </div>
      </div>
    );
  }

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const datasetUrl = `${apiBaseUrl}/datasets/${dataset.id}`;
  const queryUrl = `${datasetUrl}/query?limit=10`;

  const relatedDatasetsList =
    relatedDatasets?.data.filter((d) => d.id !== dataset.id).slice(0, 27) || [];

  return (
    <div className="min-h-screen bg-[var(--color-bg-surface-soft)]">
      <div className="flex">
        {/* Left Sidebar - Fixed Width */}
        <aside className="w-80 border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] sticky top-0 h-screen overflow-y-auto">
          <div className="p-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Datasets", href: "/datasets" },
                { label: dataset.title },
              ]}
            />
          </div>
        </aside>

        {/* Main Content Area - Flex Grow */}
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-brand-primary-soft)] text-[var(--color-brand-primary)] text-[14px] font-medium mb-4">
              {dataset.category}
            </span>
            <h1 className="text-[20px] font-bold text-[var(--color-text-primary)] mb-4">
              {dataset.title}
            </h1>
            {dataset.description && (
              <p className="text-[14px] text-[var(--color-text-muted)] mb-6">
                {dataset.description}
                {dataset.sourceOrg && (
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
            {dataset.resources && dataset.resources.length > 0 ? (
              <button
                onClick={() => {
                  // Handle download - could open a modal or download directly
                  const firstResource = dataset.resources?.[0];
                  if (firstResource?.storageUrl) {
                    window.open(firstResource.storageUrl, "_blank");
                  }
                }}
                className="px-6 py-3 bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] rounded-lg hover:opacity-90 transition-opacity text-[14px] font-medium"
              >
                Download files ({dataset.resources.length})
              </button>
            ) : (
              <button
                disabled
                className="px-6 py-3 bg-[var(--color-bg-surface-soft)] text-[var(--color-text-muted)] rounded-lg cursor-not-allowed text-[14px] font-medium"
              >
                Download files (0)
              </button>
            )}
            {dataset.sourceOrg && (
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
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Sub-column: Related Datasets */}
            <div>
              <h2 className="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">
                Related datasets
              </h2>
              <div className="space-y-1 border border-[var(--color-border-subtle)] rounded-lg bg-[var(--color-bg-surface)]">
                {relatedDatasetsList.length > 0 ? (
                  relatedDatasetsList.map((relatedDataset) => (
                    <div
                      key={relatedDataset.id}
                      className="p-3 border-b border-[var(--color-border-subtle)] last:border-b-0 hover:bg-[var(--color-bg-surface-soft)] transition-colors"
                    >
                      <Link
                        href={`/datasets/${relatedDataset.slug}`}
                        className="block"
                      >
                        <h3 className="text-[14px] font-medium text-[var(--color-text-primary)] mb-1">
                          {relatedDataset.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[12px] text-[var(--color-text-muted)]">
                          <span className="flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            {relatedDataset.dataFormat[0] || "CSV"}
                          </span>
                          <span>•</span>
                          <span>{formatDate(relatedDataset.updatedAt)}</span>
                          {relatedDataset.temporalCoverageStart && (
                            <>
                              <span>•</span>
                              <span>
                                {new Date(
                                  relatedDataset.temporalCoverageStart
                                ).getFullYear()}
                                {relatedDataset.temporalCoverageEnd &&
                                  ` - ${new Date(
                                    relatedDataset.temporalCoverageEnd
                                  ).getFullYear()}`}
                              </span>
                            </>
                          )}
                        </div>
                      </Link>
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
              <h2 className="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4">
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
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/datasets/${slug}/api`}
                  className="px-4 py-2 border border-[var(--color-border-subtle)] rounded-lg hover:bg-[var(--color-bg-surface-soft)] transition-colors text-[14px] flex items-center gap-2"
                >
                  View API docs
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            {dataset.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-brand-primary-soft)] text-[var(--color-brand-primary)] text-[14px]"
              >
                <Tag className="w-4 h-4" />
                {tag}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2">
                Category
              </h3>
              <p className="text-[14px] text-[var(--color-text-primary)]">
                {dataset.category}
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2">
                License
              </h3>
              <p className="text-[14px] text-[var(--color-text-primary)]">
                {dataset.license}
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2">
                Source Organization
              </h3>
              <p className="text-[14px] text-[var(--color-text-primary)]">
                {dataset.sourceOrg}
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2">
                Update Frequency
              </h3>
              <p className="text-[14px] text-[var(--color-text-primary)]">
                {dataset.updateFrequency}
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2">
                Last Updated
              </h3>
              <p className="text-[14px] text-[var(--color-text-primary)] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(dataset.updatedAt)}
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-text-muted)] mb-2">
                Data Formats
              </h3>
              <div className="flex flex-wrap gap-2">
                {dataset.dataFormat.map((format) => (
                  <span
                    key={format}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--color-bg-surface-soft)] text-[var(--color-text-primary)] text-[14px]"
                  >
                    <Database className="w-4 h-4" />
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* </div> */}
        </main>
      </div>
    </div>
  );
}
