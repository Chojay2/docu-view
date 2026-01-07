"use client";

import { useAuth } from "@/providers/auth-provider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, Clock, CheckCircle, XCircle } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const { data: pendingDatasets, isLoading } = useQuery({
    queryKey: ["admin", "pending-datasets"],
    queryFn: () => apiClient.getPendingDatasets(),
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-surface-soft)]">
      <div className="bg-white px-8 py-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Admin Dashboard" }]} />
        <div className="flex items-center gap-2 mt-4">
          <Shield className="w-6 h-6 text-[var(--color-brand-primary)]" />
          <h1 className="text-[20px] font-bold text-[var(--color-text-primary)]">
            Admin Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-7xl min-w-0 md:min-w-[800px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-[var(--color-border-subtle)] p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <div className="text-[14px] text-[var(--color-text-muted)]">Pending</div>
                <div className="text-[24px] font-bold text-[var(--color-text-primary)]">
                  {pendingDatasets?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[var(--color-border-subtle)] p-8">
          <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-4">
            Pending Dataset Submissions
          </h2>

          {isLoading ? (
            <div className="text-center py-8 text-[var(--color-text-muted)] text-[14px]">
              Loading...
            </div>
          ) : pendingDatasets?.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-text-muted)] text-[14px]">
              No pending submissions
            </div>
          ) : (
            <div className="space-y-4">
              {pendingDatasets?.map((submission: any) => (
                <div
                  key={submission.id}
                  className="border border-[var(--color-border-subtle)] rounded-lg p-4 hover:bg-[var(--color-bg-surface-soft)] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-[18px] font-medium text-[var(--color-text-primary)] mb-2">
                        {submission.dataset.title}
                      </h3>
                      <p className="text-[14px] text-[var(--color-text-muted)] mb-2">
                        {submission.dataset.description}
                      </p>
                      <div className="flex items-center gap-4 text-[12px] text-[var(--color-text-muted)]">
                        <span>Category: {submission.dataset.category}</span>
                        <span>Submitted by: {submission.submitter?.email}</span>
                        <span>
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link href={`/admin/datasets/${submission.dataset.id}/review`}>
                      <Button size="sm" className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

