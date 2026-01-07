"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { MonthYearPicker } from "@/components/MonthYearPicker";

interface DatasetFiltersProps {
  categories?: string[];
  formats?: string[];
  agencies?: string[];
  selectedCategory?: string;
  selectedFormats?: string[];
  selectedAgencies?: string[];
  selectedPeriod?: {
    month?: number;
    year?: number;
    endMonth?: number;
    endYear?: number;
  };
  sortBy?: string;
  onCategoryChange?: (category: string | undefined) => void;
  onFormatChange?: (formats: string[]) => void;
  onAgencyChange?: (agencies: string[]) => void;
  onPeriodChange?: (
    period:
      | {
          month?: number;
          year?: number;
          endMonth?: number;
          endYear?: number;
        }
      | undefined
  ) => void;
  onSortChange?: (sort: string) => void;
}

export function DatasetFilters({
  categories = [],
  formats = [],
  agencies = [],
  selectedCategory,
  selectedFormats = [],
  selectedAgencies = [],
  selectedPeriod,
  sortBy = "relevance",
  onCategoryChange,
  onFormatChange,
  onAgencyChange,
  onPeriodChange,
  onSortChange,
}: DatasetFiltersProps) {
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({
    topics: false,
    period: false,
    format: false,
    agencies: false,
    sort: false,
  });

  const [formatSearch, setFormatSearch] = useState("");
  const [agencySearch, setAgencySearch] = useState("");

  const handleFormatToggle = (format: string) => {
    const newFormats = selectedFormats.includes(format)
      ? selectedFormats.filter((f) => f !== format)
      : [...selectedFormats, format];
    onFormatChange?.(newFormats);
  };

  const handleAgencyToggle = (agency: string) => {
    const newAgencies = selectedAgencies.includes(agency)
      ? selectedAgencies.filter((a) => a !== agency)
      : [...selectedAgencies, agency];
    onAgencyChange?.(newAgencies);
  };

  const filteredFormats = formats.filter((f) =>
    f.toLowerCase().includes(formatSearch.toLowerCase())
  );
  const filteredAgencies = agencies.filter((a) =>
    a.toLowerCase().includes(agencySearch.toLowerCase())
  );

  const startDate =
    selectedPeriod?.year && selectedPeriod?.month
      ? new Date(selectedPeriod.year, selectedPeriod.month - 1)
      : undefined;
  const endDate =
    selectedPeriod?.endYear && selectedPeriod?.endMonth
      ? new Date(selectedPeriod.endYear, selectedPeriod.endMonth - 1)
      : undefined;

  return (
    <ButtonGroup orientation="horizontal" className="gap-2 flex-wrap">
      {/* Topics (Category) */}
      <Popover
        open={openPopovers.topics}
        onOpenChange={(open) =>
          setOpenPopovers((prev) => ({ ...prev, topics: open }))
        }
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-[16px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)]"
          >
            Topics
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                openPopovers.topics && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-white" align="start">
          <div className="space-y-2">
            <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-3">
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange?.(
                      selectedCategory === category ? undefined : category
                    );
                    setOpenPopovers((prev) => ({ ...prev, topics: false }));
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[16px] transition-colors",
                    selectedCategory === category
                      ? "bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]"
                      : "bg-[var(--color-bg-surface-soft)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-brand-primary-soft)]"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Period */}
      <Popover
        open={openPopovers.period}
        onOpenChange={(open) =>
          setOpenPopovers((prev) => ({ ...prev, period: open }))
        }
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-[16px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)]"
          >
            Period
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                openPopovers.period && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <MonthYearPicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(date) => {
              if (date) {
                onPeriodChange?.({
                  month: date.getMonth() + 1,
                  year: date.getFullYear(),
                  endMonth: selectedPeriod?.endMonth,
                  endYear: selectedPeriod?.endYear,
                });
              } else {
                onPeriodChange?.({
                  endMonth: selectedPeriod?.endMonth,
                  endYear: selectedPeriod?.endYear,
                });
              }
            }}
            onEndDateChange={(date) => {
              if (date) {
                onPeriodChange?.({
                  month: selectedPeriod?.month,
                  year: selectedPeriod?.year,
                  endMonth: date.getMonth() + 1,
                  endYear: date.getFullYear(),
                });
              } else {
                onPeriodChange?.({
                  month: selectedPeriod?.month,
                  year: selectedPeriod?.year,
                });
              }
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Format */}
      <Popover
        open={openPopovers.format}
        onOpenChange={(open) =>
          setOpenPopovers((prev) => ({ ...prev, format: open }))
        }
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-[16px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)]"
          >
            Format
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                openPopovers.format && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-white" align="start">
          <div className="space-y-2">
            <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-3">
              Format
            </h3>
            <input
              type="text"
              placeholder="Search formats..."
              value={formatSearch}
              onChange={(e) => setFormatSearch(e.target.value)}
              className="w-full px-3 py-2 text-[16px] border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] mb-3"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredFormats.map((format) => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox
                    id={`format-${format}`}
                    checked={selectedFormats.includes(format)}
                    onCheckedChange={() => handleFormatToggle(format)}
                  />
                  <label
                    htmlFor={`format-${format}`}
                    className="text-[16px] text-[var(--color-text-primary)] cursor-pointer"
                  >
                    {format}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Agencies */}
      <Popover
        open={openPopovers.agencies}
        onOpenChange={(open) =>
          setOpenPopovers((prev) => ({ ...prev, agencies: open }))
        }
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-[16px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)]"
          >
            Agencies
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                openPopovers.agencies && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-white" align="start">
          <div className="space-y-2">
            <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-3">
              Agencies
            </h3>
            <input
              type="text"
              placeholder="Search agencies..."
              value={agencySearch}
              onChange={(e) => setAgencySearch(e.target.value)}
              className="w-full px-3 py-2 text-[16px] border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] mb-3"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredAgencies.map((agency) => (
                <div key={agency} className="flex items-center space-x-2">
                  <Checkbox
                    id={`agency-${agency}`}
                    checked={selectedAgencies.includes(agency)}
                    onCheckedChange={() => handleAgencyToggle(agency)}
                  />
                  <label
                    htmlFor={`agency-${agency}`}
                    className="text-[16px] text-[var(--color-text-primary)] cursor-pointer"
                  >
                    {agency}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Sort */}
      <Popover
        open={openPopovers.sort}
        onOpenChange={(open) =>
          setOpenPopovers((prev) => ({ ...prev, sort: open }))
        }
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-[16px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)]"
          >
            Sort
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                openPopovers.sort && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4 bg-white" align="start">
          <div className="space-y-2">
            <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-3">
              Sort By
            </h3>
            {[
              { value: "relevance", label: "Relevance" },
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              { value: "title", label: "Title A-Z" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer py-2"
                onClick={() => {
                  onSortChange?.(option.value);
                  setOpenPopovers((prev) => ({ ...prev, sort: false }));
                }}
              >
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={() => {
                    onSortChange?.(option.value);
                    setOpenPopovers((prev) => ({ ...prev, sort: false }));
                  }}
                  className="w-4 h-4 text-[var(--color-brand-primary)]"
                />
                <span className="text-[16px] text-[var(--color-text-primary)]">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  );
}
