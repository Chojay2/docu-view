'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { apiClient, DatasetResource } from '@/lib/api';
import { formatFileSize } from '@/lib/utils';

interface DownloadButtonProps {
  resource: DatasetResource;
}

export function DownloadButton({ resource }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { url, type } = await apiClient.getResourceDownloadUrl(resource.id);
      if (type === 'file') {
        window.open(url, '_blank');
      } else {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-text-on-brand rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span>
        Download {resource.fileFormat?.toUpperCase() || 'File'}
        {resource.size && ` (${formatFileSize(Number(resource.size))})`}
      </span>
    </button>
  );
}

