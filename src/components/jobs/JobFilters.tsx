import { RotateCcw, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SalaryFilterOption {
  value: string;
  label: string;
}

interface JobFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  jobType: string;
  onJobTypeChange: (value: string) => void;
  experienceLevel: string;
  onExperienceLevelChange: (value: string) => void;
  salaryRange: string;
  onSalaryRangeChange: (value: string) => void;
  jobTypes: string[];
  salaryOptions: SalaryFilterOption[];
  onReset: () => void;
  hasActiveFilters: boolean;
}

export default function JobFilters({
  searchQuery,
  onSearchChange,
  jobType,
  onJobTypeChange,
  experienceLevel,
  onExperienceLevelChange,
  salaryRange,
  onSalaryRangeChange,
  jobTypes,
  salaryOptions,
  onReset,
  hasActiveFilters,
}: JobFiltersProps) {
  return (
    <div className="mb-12 rounded-[var(--radius-bento)] border border-border/80 bg-white p-4 shadow-[var(--shadow-card)] sm:p-5 lg:p-6">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(250px,1.6fr)_repeat(3,minmax(145px,1fr))_auto] lg:items-end">
        <label className="block md:col-span-2 lg:col-span-1">
          <span className="mb-2 block text-sm font-semibold text-foreground">Search opportunities</span>
          <span className="relative block">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
            <Input
              type="search"
              aria-label="Search jobs"
              placeholder="Job title, company or keyword"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-12 bg-background pl-11 pr-10 text-base"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Job type</span>
          <Select value={jobType} onValueChange={onJobTypeChange}>
            <SelectTrigger className="h-12 bg-background"><SelectValue placeholder="Job type" /></SelectTrigger>
            <SelectContent className="z-50 bg-background">
              <SelectItem value="all">All job types</SelectItem>
              {jobTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Experience</span>
          <Select value={experienceLevel} onValueChange={onExperienceLevelChange}>
            <SelectTrigger className="h-12 bg-background"><SelectValue placeholder="Experience" /></SelectTrigger>
            <SelectContent className="z-50 bg-background">
              <SelectItem value="all">All experience</SelectItem>
              <SelectItem value="entry">Entry level (0–2 years)</SelectItem>
              <SelectItem value="mid">Mid level (3–5 years)</SelectItem>
              <SelectItem value="senior">Senior level (6+ years)</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Salary</span>
          <Select value={salaryRange} onValueChange={onSalaryRangeChange}>
            <SelectTrigger className="h-12 bg-background"><SelectValue placeholder="Salary" /></SelectTrigger>
            <SelectContent className="z-50 bg-background">
              <SelectItem value="all">All salaries</SelectItem>
              {salaryOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>

        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="h-12 w-full whitespace-nowrap md:col-span-2 lg:col-span-1 lg:w-auto"
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </Button>
      </div>
    </div>
  );
}
