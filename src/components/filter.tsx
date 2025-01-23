"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  title: string;
  options: FilterOption[];
}

interface FilterPopoverProps {
  filterGroups: FilterGroup[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export function FilterPopover({ filterGroups, onFilterChange }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters = filterGroups.reduce((acc, group) => {
      acc[group.title] = "";
      return acc;
    }, {} as Record<string, string>);
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    setOpen(false);
  };

  const handleFilterChange = (groupTitle: string, value: string) => {
    setFilters(prev => ({ ...prev, [groupTitle]: value }));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-aamYellow">
          <Image src="/filter.png" alt="" width={14} height={14} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:mr-4" align="start">
        <div className="grid gap-4">
          {filterGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h4 className="font-medium leading-none">{group.title}</h4>
              <RadioGroup
                value={filters[group.title] || ""}
                onValueChange={(value) =>
                  handleFilterChange(group.title, value)
                }
                className="grid gap-2 pt-2"
              >
                {group.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Separator />
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleApplyFilters}
              className="bg-aamYellow text-black hover:bg-aamYellowLight"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
