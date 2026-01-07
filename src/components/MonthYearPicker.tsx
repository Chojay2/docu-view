"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthYearPickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: (date: Date | undefined) => void;
  onEndDateChange?: (date: Date | undefined) => void;
}

export function MonthYearPicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: MonthYearPickerProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <label className="text-[16px] font-medium text-[var(--color-text-primary)]">
          Start Period
        </label>
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal text-[16px]",
                !startDate && "text-[var(--color-text-muted)]"
              )}
            >
              {startDate
                ? `${startDate.toLocaleString("default", {
                    month: "long",
                  })} ${startDate.getFullYear()}`
                : "Select month and year"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                onStartDateChange?.(date);
                setStartOpen(false);
              }}
              captionLayout="dropdown"
              fromYear={1900}
              toYear={new Date().getFullYear() + 10}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-[16px] font-medium text-[var(--color-text-primary)]">
          End Period
        </label>
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal text-[16px]",
                !endDate && "text-[var(--color-text-muted)]"
              )}
            >
              {endDate
                ? `${endDate.toLocaleString("default", {
                    month: "long",
                  })} ${endDate.getFullYear()}`
                : "Select month and year"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                onEndDateChange?.(date);
                setEndOpen(false);
              }}
              captionLayout="dropdown"
              fromYear={1900}
              toYear={new Date().getFullYear() + 10}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {(startDate || endDate) && (
        <Button
          variant="ghost"
          onClick={() => {
            onStartDateChange?.(undefined);
            onEndDateChange?.(undefined);
          }}
          className="w-full text-[14px] text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)]"
        >
          Clear period
        </Button>
      )}
    </div>
  );
}

