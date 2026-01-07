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

interface ProjectFiltersProps {
  tags?: string[];
  authors?: string[];
  selectedTags?: string[];
  selectedAuthors?: string[];
  selectedPeriod?: {
    month?: number;
    year?: number;
    endMonth?: number;
    endYear?: number;
  };
  sortBy?: string;
  onTagChange?: (tags: string[]) => void;
  onAuthorChange?: (authors: string[]) => void;
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

export function ProjectFilters({
  tags = [],
  authors = [],
  selectedTags = [],
  selectedAuthors = [],
  selectedPeriod,
  sortBy = "newest",
  onTagChange,
  onAuthorChange,
  onPeriodChange,
  onSortChange,
}: ProjectFiltersProps) {
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({
    tags: false,
    authors: false,
    period: false,
    sort: false,
  });

  const [tagSearch, setTagSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagChange?.(newTags);
  };

  const handleAuthorToggle = (author: string) => {
    const newAuthors = selectedAuthors.includes(author)
      ? selectedAuthors.filter((a) => a !== author)
      : [...selectedAuthors, author];
    onAuthorChange?.(newAuthors);
  };

  const filteredTags = tags.filter((t) =>
    t.toLowerCase().includes(tagSearch.toLowerCase())
  );
  const filteredAuthors = authors.filter((a) =>
    a.toLowerCase().includes(authorSearch.toLowerCase())
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
      {/* Tags */}
      <Popover
        open={openPopovers.tags}
        onOpenChange={(open) =>
          setOpenPopovers((prev) => ({ ...prev, tags: open }))
        }
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-[16px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)]"
          >
            Tags
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                openPopovers.tags && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-white" align="start">
          <div className="space-y-2">
            <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-3">
              Tags
            </h3>
            <input
              type="text"
              placeholder="Search tags..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="w-full px-3 py-2 text-[16px] border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] mb-3"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className="text-[16px] text-[var(--color-text-primary)] cursor-pointer"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Authors */}
      <Popover
        open={openPopovers.authors}
        onOpenChange={(open) =>
          setOpenPopovers((prev) => ({ ...prev, authors: open }))
        }
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-[16px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)]"
          >
            Authors
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                openPopovers.authors && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-white" align="start">
          <div className="space-y-2">
            <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-3">
              Authors
            </h3>
            <input
              type="text"
              placeholder="Search authors..."
              value={authorSearch}
              onChange={(e) => setAuthorSearch(e.target.value)}
              className="w-full px-3 py-2 text-[16px] border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] mb-3"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredAuthors.map((author) => (
                <div key={author} className="flex items-center space-x-2">
                  <Checkbox
                    id={`author-${author}`}
                    checked={selectedAuthors.includes(author)}
                    onCheckedChange={() => handleAuthorToggle(author)}
                  />
                  <label
                    htmlFor={`author-${author}`}
                    className="text-[16px] text-[var(--color-text-primary)] cursor-pointer"
                  >
                    {author}
                  </label>
                </div>
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
