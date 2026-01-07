"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const paths = pathname.split("/").filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

    paths.forEach((path, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/");
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      crumbs.push({ label, href: index < paths.length - 1 ? href : undefined });
    });

    return crumbs;
  })();

  return (
    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {index === 0 ? (
              <Link
                href={item.href || "/"}
                className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            ) : (
              <>
                <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                {isLast ? (
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}

