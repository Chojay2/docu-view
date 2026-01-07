"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Database, BarChart3, Code, Bell } from "lucide-react";
import { useEffect, useState } from "react";

// Animated Database Component
const AnimatedDatabase = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full flex items-center justify-center p-4 flex-1">
      <div className="relative w-full flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`absolute transition-all duration-700 ease-in-out ${
              active === i
                ? "opacity-100 scale-110 z-10"
                : "opacity-20 scale-100 z-0"
            }`}
            style={{
              left: `${i * 24}px`,
              top: `${i * 12}px`,
            }}
          >
            <Database
              className={`w-10 h-10 md:w-12 md:h-12 transition-colors duration-500 ${
                active === i
                  ? "text-[var(--color-brand-primary)]"
                  : "text-[var(--color-text-muted)]"
              }`}
            />
          </div>
        ))}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-[var(--color-brand-primary)] whitespace-nowrap">
          5000+
        </div>
      </div>
    </div>
  );
};

// Animated Chart Component
const AnimatedChart = () => {
  const [data, setData] = useState([40, 60, 45, 80, 55, 70]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => prev.map(() => Math.floor(Math.random() * 40) + 40));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full flex items-end justify-center gap-1.5 p-4 flex-1">
      {data.map((height, i) => (
        <div
          key={i}
          className="bg-[var(--color-brand-primary)] rounded-t transition-all duration-700 ease-in-out hover:opacity-80"
          style={{
            width: "24px",
            height: `${height}%`,
            minHeight: "20px",
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
      <div className="absolute top-2 left-2 text-xs font-semibold text-[var(--color-brand-primary)] flex items-center gap-1">
        <div className="w-2 h-2 bg-[var(--color-brand-primary)] rounded-full animate-pulse" />
        Live Data
      </div>
    </div>
  );
};

// Animated API Component
const AnimatedAPI = () => {
  const [lines, setLines] = useState([
    { text: "GET /api/datasets", active: true },
    { text: "POST /api/query", active: false },
    { text: "GET /api/resources", active: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) =>
        prev.map((line, i) => ({
          ...line,
          active: i === (prev.findIndex((l) => l.active) + 1) % prev.length,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full p-4 font-mono text-xs md:text-sm flex-1 flex flex-col justify-center">
      <div className="space-y-2.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`transition-all duration-700 ${
              line.active
                ? "text-[var(--color-brand-primary)] font-semibold scale-105"
                : "text-[var(--color-text-muted)] scale-100"
            }`}
          >
            <span className="text-[var(--color-text-muted)]">$</span>{" "}
            <span className={line.active ? "underline" : ""}>{line.text}</span>
            {line.active && (
              <span className="inline-block w-2 h-4 bg-[var(--color-brand-primary)] ml-1.5 animate-pulse" />
            )}
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-[var(--color-brand-primary)] font-semibold flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-[var(--color-brand-primary)] rounded-full animate-pulse" />
        Real-time
      </div>
    </div>
  );
};

// Animated Code Component for Product Development
const AnimatedCode = () => {
  const [files, setFiles] = useState([
    { name: "app.js", active: true, lines: 3 },
    { name: "api.ts", active: false, lines: 2 },
    { name: "config.json", active: false, lines: 1 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file, i) => ({
          ...file,
          active: i === (prev.findIndex((f) => f.active) + 1) % prev.length,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full p-4 flex-1 flex flex-col justify-center">
      <div className="space-y-2">
        {files.map((file, i) => (
          <div
            key={i}
            className={`transition-all duration-700 rounded-md border ${
              file.active
                ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary-soft)] scale-105"
                : "border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-soft)] scale-100"
            }`}
          >
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Code
                className={`w-3 h-3 transition-colors duration-500 ${
                  file.active
                    ? "text-[var(--color-brand-primary)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              />
              <span
                className={`text-xs font-mono transition-colors duration-500 ${
                  file.active
                    ? "text-[var(--color-brand-primary)] font-semibold"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {file.name}
              </span>
            </div>
            {file.active && (
              <div className="px-2 pb-1.5 space-y-0.5">
                {Array.from({ length: file.lines }).map((_, lineIdx) => (
                  <div
                    key={lineIdx}
                    className="h-1 bg-[var(--color-brand-primary)] rounded animate-pulse"
                    style={{
                      width: `${60 + lineIdx * 20}%`,
                      animationDelay: `${lineIdx * 200}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-[var(--color-brand-primary)] font-semibold flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        Deploy
      </div>
    </div>
  );
};

// Animated Insights Component
const AnimatedInsights = () => {
  const [trends, setTrends] = useState([
    {
      label: "Growth",
      value: 85,
      active: true,
      color: "var(--color-brand-secondary)",
    },
    {
      label: "Trend",
      value: 65,
      active: false,
      color: "var(--color-brand-primary)",
    },
    {
      label: "Market",
      value: 45,
      active: false,
      color: "var(--color-text-muted)",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrends((prev) =>
        prev.map((trend, i) => ({
          ...trend,
          active: i === (prev.findIndex((t) => t.active) + 1) % prev.length,
          value:
            i === (prev.findIndex((t) => t.active) + 1) % prev.length
              ? Math.floor(Math.random() * 30) + 60
              : trend.value,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full p-4 flex flex-col justify-center flex-1">
      <div className="space-y-3 w-full">
        {trends.map((trend, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-semibold transition-colors duration-500 ${
                  trend.active
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {trend.label}
              </span>
              <span
                className={`font-bold transition-colors duration-500 ${
                  trend.active
                    ? "text-[var(--color-brand-secondary)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {trend.value}%
              </span>
            </div>
            <div className="relative h-2 bg-[var(--color-bg-surface-soft)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  trend.active ? "opacity-100" : "opacity-50"
                }`}
                style={{
                  width: `${trend.value}%`,
                  backgroundColor: trend.active
                    ? trend.color
                    : "var(--color-text-muted)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2">
        <BarChart3
          className={`w-6 h-6 transition-colors duration-500 ${
            trends.some((t) => t.active)
              ? "text-[var(--color-brand-secondary)]"
              : "text-[var(--color-text-muted)]"
          }`}
        />
      </div>
    </div>
  );
};

// Animated Notification Component
const AnimatedNotification = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Dataset updated", active: true },
    { id: 2, text: "New version available", active: false },
    { id: 3, text: "Schema changed", active: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) =>
        prev.map((notif, i) => ({
          ...notif,
          active: i === (prev.findIndex((n) => n.active) + 1) % prev.length,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center p-4 flex-1">
      <div className="relative mb-4">
        <Bell className="w-10 h-10 md:w-12 md:h-12 text-[var(--color-brand-primary)] transition-transform duration-300 hover:scale-110" />
        <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full animate-pulse" />
      </div>
      <div className="w-full space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`text-xs px-3 py-1.5 rounded-full transition-all duration-700 text-center ${
              notif.active
                ? "bg-[var(--color-brand-primary-soft)] text-[var(--color-brand-primary)] font-semibold scale-105 shadow-sm"
                : "bg-[var(--color-bg-surface-soft)] text-[var(--color-text-muted)] scale-100"
            }`}
          >
            {notif.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export function CreateWithConfidence() {
  return (
    <section className=" px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2e2e2e]/90 mb-4">
            Create with confidence
          </h2>
          <p className="text-xl text-[#2e2e2e]/70 font-medium">
            Find the right data to drive your vision
          </p>
        </div>

        <BentoGrid className="md:grid-cols-2 lg:grid-cols-6">
          <BentoGridItem
            title="Explore and embed live charts and tables"
            description="Understand the data with interactive visualisations updated in real-time"
            header={<AnimatedChart />}
            className="md:col-span-2"
          />
          <BentoGridItem
            title="Make better decisions with free government data"
            description="Access 5000+ datasets from over 70 government agencies – all available for free"
            header={<AnimatedDatabase />}
            className="md:col-span-2"
          />

          <BentoGridItem
            title="Use data at scale with APIs"
            description="Automate access to real-time and historical data"
            header={<AnimatedAPI />}
            className="md:col-span-2"
          />

          <BentoGridItem
            title="Accelerate your product development"
            description="Prototype, validate, and deploy new solutions faster with instant access to standardized, high-quality open data"
            header={<AnimatedCode />}
            className="md:col-span-2"
          />

          <BentoGridItem
            title="Unlock new insights and opportunities"
            description="Reveal trends, identify gaps in the market, and discover opportunities by exploring rich government datasets"
            header={<AnimatedInsights />}
            className="md:col-span-2"
          />

          <BentoGridItem
            title="Subscribe to the datasets you use"
            description="Be notified when datasets are updated or changed"
            header={<AnimatedNotification />}
            className="md:col-span-2"
          />
        </BentoGrid>
      </div>
    </section>
  );
}
