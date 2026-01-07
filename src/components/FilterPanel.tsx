'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface FilterPanelProps {
  categories?: string[];
  formats?: string[];
  tags?: string[];
  selectedCategory?: string;
  selectedFormat?: string;
  selectedTags?: string[];
  onCategoryChange?: (category: string | undefined) => void;
  onFormatChange?: (format: string | undefined) => void;
  onTagChange?: (tags: string[]) => void;
}

export function FilterPanel({
  categories = [],
  formats = [],
  tags = [],
  selectedCategory,
  selectedFormat,
  selectedTags = [],
  onCategoryChange,
  onFormatChange,
  onTagChange,
}: FilterPanelProps) {
  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagChange?.(newTags);
  };

  return (
    <div className="bg-bg-surface-soft rounded-lg border border-border-subtle p-4 space-y-6">
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Category
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category}
                  onChange={() =>
                    onCategoryChange?.(
                      selectedCategory === category ? undefined : category,
                    )
                  }
                  className="w-4 h-4 text-brand-primary"
                />
                <span className="text-sm text-text-primary">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {formats.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Format
          </h3>
          <div className="space-y-2">
            {formats.map((format) => (
              <label
                key={format}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="format"
                  checked={selectedFormat === format}
                  onChange={() =>
                    onFormatChange?.(
                      selectedFormat === format ? undefined : format,
                    )
                  }
                  className="w-4 h-4 text-brand-primary"
                />
                <span className="text-sm text-text-primary">{format}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-brand-primary text-text-on-brand'
                    : 'bg-bg-surface text-text-primary border border-border-subtle'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {(selectedCategory || selectedFormat || selectedTags.length > 0) && (
        <button
          onClick={() => {
            onCategoryChange?.(undefined);
            onFormatChange?.(undefined);
            onTagChange?.([]);
          }}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary"
        >
          <X className="w-4 h-4" />
          Clear filters
        </button>
      )}
    </div>
  );
}

