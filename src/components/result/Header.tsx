"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DownloadIcon } from "lucide-react";

interface HeaderProps {
  dateRange: string;
  setDateRange: (value: string) => void;
  handleDownload: (format: string) => void;
}

export function Header({
  dateRange,
  setDateRange,
  handleDownload,
}: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
        Student Results Dashboard
      </h1>
      <div className="flex space-x-2">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-700">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
            <SelectItem value="This Year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => handleDownload("pdf")}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <DownloadIcon className="w-4 h-4 mr-2" />
          PDF
        </Button>
      </div>
    </div>
  );
}
