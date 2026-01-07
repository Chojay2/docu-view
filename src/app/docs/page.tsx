"use client";

import Link from "next/link";
import { BookOpen, Code, Map, Database, ExternalLink } from "lucide-react";

const tutorials = [
  {
    title: "Using the API with Postman",
    description: "Learn how to explore and test our API using Postman",
    icon: Code,
    href: "/docs/postman",
  },
  {
    title: "Using the API with Python",
    description: "Get started with Python to access and analyze datasets",
    icon: Code,
    href: "/docs/python",
  },
  {
    title: "Using the API with JavaScript",
    description: "Build web applications using our JavaScript API client",
    icon: Code,
    href: "/docs/javascript",
  },
  {
    title: "Using GIS data in QGIS",
    description: "Import and visualize geospatial data in QGIS",
    icon: Map,
    href: "/docs/qgis",
  },
  {
    title: "Loading GeoTIFF/DEM data",
    description: "Work with elevation and raster data formats",
    icon: Map,
    href: "/docs/geotiff",
  },
];

const topDatasets = [
  {
    title: "Air Quality Index",
    description: "Real-time air quality measurements across regions",
    category: "Environment",
  },
  {
    title: "Traffic Count Data",
    description: "Vehicle traffic counts and patterns",
    category: "Transport",
  },
  {
    title: "Population Census",
    description: "Demographic and population statistics",
    category: "Economy",
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-bg-surface-soft">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <BookOpen className="w-16 h-16 text-brand-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Documentation & Tutorials
          </h1>
          <p className="text-xl text-text-muted  mx-auto">
            Learn how to access, use, and build with our datasets
          </p>
        </div>

        {/* How to Access Data */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            How to Access Data
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => {
              const Icon = tutorial.icon;
              return (
                <Link
                  key={tutorial.title}
                  href={tutorial.href}
                  className="block bg-bg-surface rounded-lg border border-border-subtle p-6 hover:shadow-card transition-shadow"
                >
                  <Icon className="w-8 h-8 text-brand-primary mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {tutorial.title}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {tutorial.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Start Here */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            Start Here
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-bg-surface rounded-lg border border-border-subtle p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-brand-primary" />
                Top 10 Datasets for Research
              </h3>
              <ul className="space-y-3">
                {topDatasets.map((dataset, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary-soft text-brand-primary flex items-center justify-center text-xs font-semibold">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-text-primary">
                        {dataset.title}
                      </p>
                      <p className="text-sm text-text-muted">
                        {dataset.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/datasets"
                className="mt-4 inline-block text-brand-primary hover:underline text-sm"
              >
                Browse all datasets →
              </Link>
            </div>

            <div className="bg-bg-surface rounded-lg border border-border-subtle p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Quick Start Tutorials
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">
                    Build your first dashboard in 30 minutes
                  </h4>
                  <p className="text-sm text-text-muted mb-2">
                    Using our air quality API, create a real-time dashboard with
                    charts and visualizations.
                  </p>
                  <Link
                    href="/docs/dashboard-tutorial"
                    className="text-sm text-brand-primary hover:underline flex items-center gap-1"
                  >
                    Read tutorial
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-2">
                    Load DEM data into QGIS and 3D visualize
                  </h4>
                  <p className="text-sm text-text-muted mb-2">
                    Import elevation data and create stunning 3D visualizations
                    in QGIS and Three.js.
                  </p>
                  <Link
                    href="/docs/qgis-3d"
                    className="text-sm text-brand-primary hover:underline flex items-center gap-1"
                  >
                    Read tutorial
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            API Reference
          </h2>
          <div className="bg-bg-surface rounded-lg border border-border-subtle p-6">
            <p className="text-text-muted mb-4">
              Full API documentation is available via Swagger UI:
            </p>
            <a
              href={`${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
              }/api/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-text-on-brand rounded-lg hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              Open API Documentation
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
