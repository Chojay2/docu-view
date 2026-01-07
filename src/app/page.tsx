"use client";

import { SearchBar } from "@/components/SearchBar";
import { DatasetCard } from "@/components/DatasetCard";
import { ProjectCard } from "@/components/ProjectCard";
import { TopNav } from "@/components/TopNav";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import {
  Database,
  FolderKanban,
  BookOpen,
  Leaf,
  Heart,
  TrendingUp,
  Car,
  GraduationCap,
  FlaskConical,
} from "lucide-react";
import Link from "next/link";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { CreateWithConfidence } from "@/components/CreateWithConfidence";

const categories = [
  { name: "Environment", icon: Leaf, color: "#22c55e" }, // green
  { name: "Health", icon: Heart, color: "#ef4444" }, // red
  { name: "Economy", icon: TrendingUp, color: "#3b82f6" }, // blue
  { name: "Transport", icon: Car, color: "#f59e0b" }, // orange
  { name: "Education", icon: GraduationCap, color: "#a855f7" }, // purple
  { name: "Research", icon: FlaskConical, color: "#6366f1" }, // indigo
];

export default function Home() {
  const { data: datasetsData } = useQuery({
    queryKey: ["datasets", "featured"],
    queryFn: () => apiClient.getDatasets({ limit: 6 }),
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects", "featured"],
    queryFn: () => apiClient.getProjects({ limit: 3 }),
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className=" ">
        <div className="relative w-screen overflow-hidden">
          <div className="absolute inset-0 pointer-events-none ">
            <div
              className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #3D5CF5 10%, transparent 70%)",
                left: "5%",
                top: "10%",
              }}
            />
            <div
              className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #E6FF6A 10%, transparent 70%)",
                left: "50%",
                top: "20%",
              }}
            />
            <div
              className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #22c55e 10%, transparent 70%)",
                left: "85%",
                top: "15%",
              }}
            />
          </div>
          <div className="text-center mb-6 min-h-screen flex flex-col items-center  bg-white w-full p-8">
            {/* <BackgroundRippleEffect rows={8} cols={27} cellSize={56} /> */}
            <h1 className="text-[60px] font-bold  mb-4 text-[#2e2e2e]/90 leading-wide mt-[10%]">
              Gelephu Mindfulness City's <br />{" "}
              <span className="text-[#2e2e2e]/40">Open Data Portal</span>
            </h1>
            <p className="text-xl mb-8 mx-auto text-[#2e2e2e]/90 font-semibold mt-8">
              Discover datasets, projects, and research built using open data
            </p>
            <SearchBar />
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 my-4 max-w-[400px] md:max-w-[800px] justify-center ">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.name}
                      href={`/datasets?category=${encodeURIComponent(
                        category.name
                      )}`}
                      className="bg-[var(--color-bg-surface)] rounded-lg border-1 border-black/40 px-4 flex gap-2 items-center justify-center py-2 hover:shadow-[var(--shadow-card)] transition-shadow text-center w-content"
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: category.color }}
                      />
                      <span className="text-md font-semibold text-black ">
                        {category.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Trusted by Section */}
            <div className="w-full mt-16 py-12 bg-white">
              <div className="text-center mb-8">
                <p className="text-[18px] text-[#3b82f6] font-medium">
                  For people who are working on
                </p>
              </div>
              <div className="relative overflow-hidden">
                <div className="flex animate-scroll">
                  {/* First set of logos */}
                  {[...Array(2)].map((_, setIndex) => (
                    <div
                      key={setIndex}
                      className="flex items-center gap-12 px-8 shrink-0"
                    >
                      {[
                        { name: "Artificial Intelligence", initials: "AI" },
                        { name: "Technology", initials: "TC" },
                        { name: "Research and Academia", initials: "RA" },
                        {
                          name: "Healthcare and Public Health",
                          initials: "HC",
                        },
                        { name: "Education and EdTech", initials: "ED" },
                        { name: "Finance and FinTech", initials: "FN" },
                        { name: "Transportation and Mobility", initials: "TR" },
                        {
                          name: "Government Services and Planning",
                          initials: "GV",
                        },
                        { name: "Media and Journalism", initials: "MD" },
                        { name: "Agriculture and Agritech", initials: "AG" },
                        {
                          name: "Environment and Climate Science",
                          initials: "EN",
                        },
                        {
                          name: "Urban Planning and Smart Cities",
                          initials: "UP",
                        },
                        { name: "Energy and Utilities", initials: "EG" },
                        { name: "Telecommunications", initials: "TM" },
                        {
                          name: "Insurance and Risk Assessment",
                          initials: "IN",
                        },
                        { name: "Tourism and Travel", initials: "TRV" },
                        { name: "E-commerce and Marketplaces", initials: "EC" },
                        { name: "Supply Chain and Logistics", initials: "LG" },
                        {
                          name: "Real Estate and Property Tech",
                          initials: "RE",
                        },
                        {
                          name: "Disaster Management and Safety",
                          initials: "DM",
                        },
                        {
                          name: "Water and Resource Management",
                          initials: "WR",
                        },
                        {
                          name: "Nonprofits and Social Development",
                          initials: "NP",
                        },
                      ].map((company, index) => (
                        <div
                          key={`${setIndex}-${index}`}
                          className="flex items-center justify-center shrink-0"
                        >
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <span className="font-bold text-[24px] text-black/40 ">
                                {company.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create with Confidence Section */}
        <CreateWithConfidence />

        {/* Featured Datasets */}
        <div className="my-[8%] mx-[10%] rounded-lg border border-[var(--color-border-subtle)] p-16 bg-black/5 relative overflow-hidden">
          {/* Colorful Blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #3D5CF5 0%, transparent 70%)",
                left: "10%",
                top: "20%",
              }}
            />
            <div
              className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #E6FF6A 0%, transparent 70%)",
                left: "40%",
                top: "30%",
              }}
            />
            <div
              className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #22c55e 0%, transparent 70%)",
                left: "70%",
                top: "25%",
              }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col items-center gap-2 justify-between mb-12">
              <h2 className="text-4xl font-semibold">Featured Datasets</h2>
              <h2 className="text-[16px]font-semibold text-black/40">
                Discover datasets, projects, and research built using open data
              </h2>
              <Link
                href="/datasets"
                className=" hover:underline text-[#3b82f6]"
              >
                View all →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasetsData?.data.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[var(--color-text-on-brand)]">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="text-[var(--color-text-on-brand)] hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {projectsData?.data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Start Building Section */}
        <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border-subtle)] p-8 text-center">
          <BookOpen className="w-12 h-12 text-[var(--color-brand-primary)] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
            Start Building
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6 mx-auto">
            Learn how to access and use our datasets with our comprehensive
            tutorials and documentation.
          </p>
          <Link
            href="/docs"
            className="inline-block px-6 py-3 bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] rounded-lg hover:opacity-90 transition-opacity"
          >
            View Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}
