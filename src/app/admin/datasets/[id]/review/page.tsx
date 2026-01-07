"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { useState } from "react";

export default function ReviewDatasetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ProtectedRoute requireAdmin>
      <ReviewDatasetContent params={params} />
    </ProtectedRoute>
  );
}

function ReviewDatasetContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: dataset, isLoading } = useQuery({
    queryKey: ["dataset", id],
    queryFn: () => apiClient.getDataset(id),
  });

  const handleApprove = async () => {
    setLoading(true);
    try {
      await apiClient.approveDataset(id, adminNotes);
      router.push("/admin/dashboard?approved=true");
    } catch (error) {
      alert("Failed to approve dataset");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!adminNotes.trim()) {
      alert("Please provide rejection notes");
      return;
    }
    setLoading(true);
    try {
      await apiClient.rejectDataset(id, adminNotes);
      router.push("/admin/dashboard?rejected=true");
    } catch (error) {
      alert("Failed to reject dataset");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!dataset) {
    return <div className="min-h-screen flex items-center justify-center">Dataset not found</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-surface-soft)]">
      <div className="bg-white px-8 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Review Dataset" },
          ]}
        />
        <h1 className="text-[20px] font-bold text-[var(--color-text-primary)] mt-4">
          Review Dataset Submission
        </h1>
      </div>

      <div className="max-w-4xl min-w-0 md:min-w-[600px] mx-auto px-8 py-8">
        <div className="bg-white rounded-lg border border-[var(--color-border-subtle)] p-8 space-y-6">
          <div>
            <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-2">
              {dataset.title}
            </h2>
            <p className="text-[14px] text-[var(--color-text-muted)]">{dataset.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[14px]">
            <div>
              <strong>Category:</strong> {dataset.category}
            </div>
            <div>
              <strong>Source Organization:</strong> {dataset.sourceOrg}
            </div>
            <div>
              <strong>License:</strong> {dataset.license}
            </div>
            <div>
              <strong>Update Frequency:</strong> {dataset.updateFrequency}
            </div>
          </div>

          {dataset.resources && dataset.resources.length > 0 && (
            <div>
              <Label className="text-[14px] mb-2 block">Resources</Label>
              <div className="space-y-2">
                {dataset.resources.map((resource: any) => (
                  <div
                    key={resource.id}
                    className="flex items-center gap-2 p-2 bg-[var(--color-bg-surface-soft)] rounded"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-[14px]">{resource.storageUrl || resource.apiEndpoint}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="adminNotes" className="text-[14px] mb-2 block">
              Admin Notes
            </Label>
            <textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-md text-[14px]"
              rows={4}
              placeholder="Add notes about this submission..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={loading}
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {loading ? "Processing..." : "Approve"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

