"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";
import { Upload, FileText, CheckCircle2 } from "lucide-react";

export default function UploadDatasetPage() {
  return (
    <ProtectedRoute>
      <UploadDatasetContent />
    </ProtectedRoute>
  );
}

function UploadDatasetContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    license: "CC-BY-4.0",
    sourceOrg: "",
    updateFrequency: "monthly",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        setError("Please select a CSV file");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags") {
          uploadFormData.append(key, JSON.stringify(value.split(",").map((t) => t.trim())));
        } else {
          uploadFormData.append(key, value);
        }
      });
      uploadFormData.append("dataFormat", JSON.stringify(["CSV"]));

      await apiClient.uploadDataset(uploadFormData);
      router.push("/datasets?success=uploaded");
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-surface-soft)]">
      <div className="bg-white px-8 py-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Upload Dataset" }]} />
        <h1 className="text-[20px] font-bold text-[var(--color-text-primary)] mt-4">
          Upload Dataset
        </h1>
      </div>

      <div className="max-w-4xl min-w-0 md:min-w-[600px] mx-auto px-8 py-8">
        <div className="bg-white rounded-lg border border-[var(--color-border-subtle)] p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step >= s
                      ? "bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white"
                      : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? "bg-[var(--color-brand-primary)]" : "bg-[var(--color-border-subtle)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-[14px] text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-4">
                Basic Information
              </h2>
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
                <Label htmlFor="description" className="text-[14px]">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-md text-[14px]"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-[14px]">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-[var(--color-border-subtle)] rounded-md text-[14px]"
                >
                  <option value="">Select category</option>
                  <option value="Arts & Culture">Arts & Culture</option>
                  <option value="Education">Education</option>
                  <option value="Economy">Economy</option>
                  <option value="Environment">Environment</option>
                  <option value="Geospatial">Geospatial</option>
                  <option value="Housing">Housing</option>
                  <option value="Health">Health</option>
                  <option value="Social">Social</option>
                  <option value="Transport">Transport</option>
                  <option value="Real-time APIs">Real-time APIs</option>
                </select>
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
                <Label htmlFor="sourceOrg" className="text-[14px]">Source Organization *</Label>
                <Input
                  id="sourceOrg"
                  value={formData.sourceOrg}
                  onChange={(e) => handleInputChange("sourceOrg", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.category || !formData.sourceOrg}
                  className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Upload File */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-4">
                Upload CSV File
              </h2>
              <div className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-muted)]" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-[var(--color-brand-primary)] hover:underline">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {file && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--color-brand-primary)]" />
                    <span className="text-[14px] text-[var(--color-text-primary)]">{file.name}</span>
                  </div>
                )}
                <p className="text-[12px] text-[var(--color-text-muted)] mt-2">
                  CSV files only, max 100MB
                </p>
              </div>
              <div className="flex justify-between gap-4 mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!file}
                  className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-4">
                Review & Submit
              </h2>
              <div className="bg-[var(--color-bg-surface-soft)] rounded-lg p-4 space-y-2 text-[14px]">
                <div><strong>Title:</strong> {formData.title}</div>
                <div><strong>Category:</strong> {formData.category}</div>
                <div><strong>Source:</strong> {formData.sourceOrg}</div>
                <div><strong>File:</strong> {file?.name}</div>
              </div>
              <p className="text-[14px] text-[var(--color-text-muted)]">
                Your dataset will be submitted for admin approval before being published.
              </p>
              <div className="flex justify-between gap-4 mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]"
                >
                  {loading ? "Submitting..." : "Submit for Approval"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

