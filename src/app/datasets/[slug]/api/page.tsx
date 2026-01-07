'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { CodeSnippet } from '@/components/CodeSnippet';
import Link from 'next/link';
import { ArrowLeft, Code } from 'lucide-react';

export default function DatasetApiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data: dataset } = useQuery({
    queryKey: ['dataset', slug],
    queryFn: () => apiClient.getDatasetBySlug(slug),
  });

  if (!dataset) {
    return (
      <div className="min-h-screen bg-bg-surface-soft flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const baseUrl = `${apiBaseUrl}/datasets/${dataset.id}`;

  return (
    <div className="min-h-screen bg-bg-surface-soft">
      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/datasets/${slug}`}
          className="inline-flex items-center gap-2 text-brand-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dataset
        </Link>

        <div className="bg-bg-surface rounded-lg border border-border-subtle p-8">
          <div className="flex items-center gap-2 mb-6">
            <Code className="w-6 h-6 text-brand-primary" />
            <h1 className="text-3xl font-bold text-text-primary">
              API Documentation
            </h1>
          </div>
          <p className="text-text-muted mb-8">
            {dataset.title}
          </p>

          <div className="space-y-8">
            {/* Get Dataset */}
            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Get Dataset
              </h2>
              <p className="text-text-muted mb-4">
                Retrieve dataset metadata and information.
              </p>
              <CodeSnippet
                language="curl"
                code={`curl "${baseUrl}"`}
              />
              <CodeSnippet
                language="javascript"
                code={`const res = await fetch("${baseUrl}");
const dataset = await res.json();
console.log(dataset);`}
              />
              <CodeSnippet
                language="python"
                code={`import requests

r = requests.get("${baseUrl}")
dataset = r.json()
print(dataset)`}
              />
            </section>

            {/* Get Sample Data */}
            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Get Sample Data
              </h2>
              <p className="text-text-muted mb-4">
                Retrieve a preview of the dataset (first 50 rows by default).
              </p>
              <CodeSnippet
                language="curl"
                code={`curl "${baseUrl}/sample?limit=50"`}
              />
              <CodeSnippet
                language="javascript"
                code={`const res = await fetch("${baseUrl}/sample?limit=50");
const sample = await res.json();
console.log(sample);`}
              />
              <CodeSnippet
                language="python"
                code={`import requests

r = requests.get("${baseUrl}/sample", params={"limit": 50})
sample = r.json()
print(sample)`}
              />
            </section>

            {/* Query Data */}
            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Query Data
              </h2>
              <p className="text-text-muted mb-4">
                Query dataset with pagination and optional filters.
              </p>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Query Parameters
                </h3>
                <ul className="list-disc list-inside space-y-1 text-text-muted">
                  <li>
                    <code className="bg-bg-surface-soft px-2 py-1 rounded">
                      limit
                    </code>{' '}
                    - Number of results (default: 50, max: 1000)
                  </li>
                  <li>
                    <code className="bg-bg-surface-soft px-2 py-1 rounded">
                      offset
                    </code>{' '}
                    - Number of results to skip (default: 0)
                  </li>
                  <li>
                    <code className="bg-bg-surface-soft px-2 py-1 rounded">
                      filter
                    </code>{' '}
                    - JSON string of column filters
                  </li>
                </ul>
              </div>
              <CodeSnippet
                language="curl"
                code={`curl "${baseUrl}/query?limit=10&offset=0"`}
              />
              <CodeSnippet
                language="javascript"
                code={`const res = await fetch(
  "${baseUrl}/query?limit=10&offset=0"
);
const data = await res.json();
console.log(data);`}
              />
              <CodeSnippet
                language="python"
                code={`import requests

r = requests.get(
  "${baseUrl}/query",
  params={"limit": 10, "offset": 0}
)
data = r.json()
print(data)`}
              />
            </section>

            {/* Get Resources */}
            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Get Resources
              </h2>
              <p className="text-text-muted mb-4">
                List all resources (files, APIs) associated with this dataset.
              </p>
              <CodeSnippet
                language="curl"
                code={`curl "${baseUrl}/resources"`}
              />
              <CodeSnippet
                language="javascript"
                code={`const res = await fetch("${baseUrl}/resources");
const resources = await res.json();
console.log(resources);`}
              />
              <CodeSnippet
                language="python"
                code={`import requests

r = requests.get("${baseUrl}/resources")
resources = r.json()
print(resources)`}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

