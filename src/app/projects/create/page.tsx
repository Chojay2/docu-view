"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient, Dataset } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function CreateProjectPage() {
  return (
    <ProtectedRoute>
      <CreateProjectContent />
    </ProtectedRoute>
  );
}

function CreateProjectContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    linkType: "github",
    linkUrl: "",
    authors: "",
    tags: "",
  });
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: datasetsData } = useQuery({
    queryKey: ["datasets", "all"],
    queryFn: () => apiClient.getDatasets({ limit: 1000 }),
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiClient.createProject({
        title: formData.title,
        abstract: formData.abstract,
        linkType: formData.linkType,
        linkUrl: formData.linkUrl,
        authors: formData.authors.split(",").map((a) => a.trim()).filter(Boolean),
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        datasetsUsed: selectedDatasets,
      });
      router.push("/projects?success=created");
    } catch (err: any) {
      setError(err.message || "Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDataset = (datasetId: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(datasetId)
        ? prev.filter((id) => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-surface-soft)]">
      <div className="bg-white px-8 py-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Create Project" }]} />
        <h1 className="text-[20px] font-bold text-[var(--color-text-primary)] mt-4">
          Create Project
        </h1>
      </div>

      <div className="max-w-4xl min-w-0 md:min-w-[600px] mx-auto px-8 py-8">
        <div className="bg-white rounded-lg border border-[var(--color-border-subtle)] p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-[14px] text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-[14px]">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="abstract" className="text-[14px]">Abstract</Label>
              <textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) => handleInputChange("abstract", e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-md text-[14px]"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkType" className="text-[14px]">Link Type *</Label>
                <select
                  id="linkType"
                  value={formData.linkType}
                  onChange={(e) => handleInputChange("linkType", e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-md text-[14px]"
                >
                  <option value="github">GitHub</option>
                  <option value="demo">Demo</option>
                  <option value="paper">Paper</option>
                  <option value="website">Website</option>
                </select>
              </div>

              <div>
                <Label htmlFor="linkUrl" className="text-[14px]">Link URL *</Label>
                <Input
                  id="linkUrl"
                  type="url"
                  value={formData.linkUrl}
                  onChange={(e) => handleInputChange("linkUrl", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="authors" className="text-[14px]">Authors (comma-separated) *</Label>
              <Input
                id="authors"
                value={formData.authors}
                onChange={(e) => handleInputChange("authors", e.target.value)}
                required
                className="mt-1"
                placeholder="Author 1, Author 2"
              />
            </div>

            <div>
              <Label htmlFor="tags" className="text-[14px]">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                className="mt-1"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div>
              <Label className="text-[14px] mb-2 block">Link Datasets (Optional)</Label>
              <div className="border border-[var(--color-border-subtle)] rounded-md p-4 max-h-64 overflow-y-auto">
                {datasetsData?.data.map((dataset: Dataset) => (
                  <label
                    key={dataset.id}
                    className="flex items-center space-x-2 p-2 hover:bg-[var(--color-bg-surface-soft)] rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDatasets.includes(dataset.id)}
                      onChange={() => toggleDataset(dataset.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-[14px] text-[var(--color-text-primary)]">
                      {dataset.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]"
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

