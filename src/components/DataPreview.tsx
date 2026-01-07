'use client';

import { Dataset } from '@/lib/api';
import { Table, MapPin } from 'lucide-react';

interface DataPreviewProps {
  dataset: Dataset;
  sampleData?: any;
}

export function DataPreview({ dataset, sampleData }: DataPreviewProps) {
  const isGeospatial = dataset.dataFormat.some((format) =>
    ['geojson', 'geotiff', 'shapefile', 'shp'].includes(format.toLowerCase()),
  );

  if (isGeospatial) {
    return (
      <div className="bg-bg-surface-soft rounded-lg border border-border-subtle p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-semibold text-text-primary">
            Geospatial Preview
          </h3>
        </div>
        <div className="bg-bg-surface rounded-lg border border-border-subtle h-64 flex items-center justify-center">
          <p className="text-text-muted">
            Map preview will be displayed here
          </p>
        </div>
        {dataset.spatialCoverage && (
          <div className="mt-4 text-sm text-text-muted">
            Coverage: {JSON.stringify(dataset.spatialCoverage)}
          </div>
        )}
      </div>
    );
  }

  // Tabular preview
  const schema = dataset.previewSchema || {};
  const columns = Object.keys(schema);
  const sampleRows = sampleData?.sample || [];

  return (
    <div className="bg-bg-surface-soft rounded-lg border border-border-subtle p-6">
      <div className="flex items-center gap-2 mb-4">
        <Table className="w-5 h-5 text-brand-primary" />
        <h3 className="text-lg font-semibold text-text-primary">
          Data Preview
        </h3>
      </div>
      {columns.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-surface border-b border-border-subtle">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left text-sm font-semibold text-text-primary"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRows.length > 0 ? (
                sampleRows.map((row: any, idx: number) => (
                  <tr
                    key={idx}
                    className="border-b border-border-subtle hover:bg-bg-surface-soft"
                  >
                    {columns.map((col) => (
                      <td
                        key={col}
                        className="px-4 py-2 text-sm text-text-primary"
                      >
                        {row[col] !== undefined ? String(row[col]) : '-'}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-text-muted"
                  >
                    No sample data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-text-muted">No schema information available</p>
      )}
    </div>
  );
}

