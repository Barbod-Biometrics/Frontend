"use client";

import { useState, type ChangeEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/Button";
import { Input } from "../Input";
import { Typography } from "../ui/Typography";
import {
  FilterIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MoreVertical,
} from "lucide-react";

export type LogEntry = {
  id: number;
  duration: string; // e.g., "0.93s"
  date: string; // e.g., "۱۴۰۳/۲/۲۴" (Persian)
  status: "موفق" | "ناموفق";
  ip: string;
  accuracy: number; // e.g., 0.93
  details: string; // For modal
};

type SortConfig = {
  key: keyof Omit<LogEntry, "details"> | null;
  direction: "asc" | "desc";
};

type FilterConfig = {
  id?: string;
  status?: "موفق" | "ناموفق" | null;
  dateFromStr?: string; // e.g., "۱۴۰۳/۲/۵"
  dateToStr?: string; // e.g., "۱۴۰۳/۲/۱۰"
  durationFrom?: number;
  durationTo?: number;
  accuracyFrom?: number;
  accuracyTo?: number;
};

type ServiceLogsTableProps = {
  logs: LogEntry[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export function ServiceLogsTable({
  logs,
  totalPages,
  currentPage,
  onPageChange,
}: ServiceLogsTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({});
  const [openDetailId, setOpenDetailId] = useState<number | null>(null);

  // Toggle sort
  const requestSort = (key: keyof Omit<LogEntry, "details">) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply filters
  const applyFilters = () => {
    // No parsing needed — we compare Persian date strings directly
    console.log("Applying filters:", filterConfig);
    // TODO: Call real API with filterConfig.dateFromStr/dateToStr
  };

  // Reset filter
  const resetFilter = (column: string) => {
    setFilterConfig((prev) => {
      const newConfig = { ...prev };
      if (column === "id") delete newConfig.id;
      if (column === "status") delete newConfig.status;
      if (column === "date") {
        delete newConfig.dateFromStr;
        delete newConfig.dateToStr;
      }
      return newConfig;
    });
  };

  const renderSortIcon = (key: keyof Omit<LogEntry, "details">) => {
    if (sortConfig.key !== key)
      return <ArrowUpIcon className="h-5 w-5 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="h-5 w-5" />
    ) : (
      <ArrowDownIcon className="h-5 w-5" />
    );
  };

  // Filter & sort logic
  const filteredLogs = logs.filter((log) => {
    if (filterConfig.id && !String(log.id).includes(filterConfig.id))
      return false;
    if (filterConfig.status && log.status !== filterConfig.status) return false;
    if (filterConfig.dateFromStr || filterConfig.dateToStr) {
      // Compare Persian date strings directly (lexicographic order works for YYYY/MM/DD)
      if (filterConfig.dateFromStr && log.date < filterConfig.dateFromStr)
        return false;
      if (filterConfig.dateToStr && log.date > filterConfig.dateToStr)
        return false;
    }
    // Duration and accuracy filters unchanged
    if (
      filterConfig.durationFrom !== undefined ||
      filterConfig.durationTo !== undefined
    ) {
      const durationSeconds = parseFloat(log.duration);
      if (
        filterConfig.durationFrom !== undefined &&
        durationSeconds < filterConfig.durationFrom
      )
        return false;
      if (
        filterConfig.durationTo !== undefined &&
        durationSeconds > filterConfig.durationTo
      )
        return false;
    }
    if (
      filterConfig.accuracyFrom !== undefined ||
      filterConfig.accuracyTo !== undefined
    ) {
      if (
        filterConfig.accuracyFrom !== undefined &&
        log.accuracy < filterConfig.accuracyFrom
      )
        return false;
      if (
        filterConfig.accuracyTo !== undefined &&
        log.accuracy > filterConfig.accuracyTo
      )
        return false;
    }
    return true;
  });

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return (
    <div className="bg-[#151C28] rounded-xl p-6 border border-[#354152]">
      <h2 className="text-xl font-bold mb-6 text-center text-white">
        لیست درخواست ها
      </h2>

      {/*  Inner panel with table */}
      <div className="bg-[#1C2533] rounded-xl p-6 border-[0.8px] border-[#354152]">
        {/*  Table */}
        <div className="overflow-x-auto bg-black rounded-[12px]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#354152]">
                {/* ID */}
                <TableHead className="text-right font-medium text-gray-300 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      ID
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-0 h-5 w-5"
                        onClick={() => requestSort("id")}
                      >
                        {renderSortIcon("id")}
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-0 h-5 w-5"
                        >
                          <FilterIcon className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 p-4">
                        <div className="space-y-4">
                          <Typography
                            variant="body-sm"
                            className="mb-1 text-muted-foreground"
                          >
                            جستجو ID
                          </Typography>
                          <Input
                            placeholder="1"
                            value={filterConfig.id || ""}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setFilterConfig((prev) => ({
                                ...prev,
                                id: e.target.value,
                              }))
                            }
                          />
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resetFilter("id")}
                            >
                              پاک کردن
                            </Button>
                            <Button size="sm" onClick={applyFilters}>
                              اعمال
                            </Button>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>

                {/* وضعیت */}
                <TableHead className="text-right font-medium text-gray-300 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      وضعیت
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-0 h-5 w-5"
                        onClick={() => requestSort("status")}
                      >
                        {renderSortIcon("status")}
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-0 h-5 w-5"
                        >
                          <FilterIcon className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 p-2">
                        <div className="space-y-1">
                          <DropdownMenuItem
                            onClick={() => {
                              setFilterConfig((prev) => ({
                                ...prev,
                                status: "موفق",
                              }));
                              applyFilters();
                            }}
                            className={`cursor-pointer ${
                              filterConfig.status === "موفق"
                                ? "bg-blue-600 text-white"
                                : ""
                            }`}
                          >
                            موفق
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setFilterConfig((prev) => ({
                                ...prev,
                                status: "ناموفق",
                              }));
                              applyFilters();
                            }}
                            className={`cursor-pointer ${
                              filterConfig.status === "ناموفق"
                                ? "bg-red-600 text-white"
                                : ""
                            }`}
                          >
                            ناموفق
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setFilterConfig((prev) => ({
                                ...prev,
                                status: null,
                              }));
                              applyFilters();
                            }}
                            className="cursor-pointer text-gray-400"
                          >
                            همه
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>

                {/* تاریخ — PERSIAN DATE INPUTS */}
                <TableHead className="text-right font-normal text-[16px] text-gray-300 h-[25px] w-[16.66%]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[16px]">تاریخ</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-0 h-5 w-5"
                        onClick={() => requestSort("date")}
                      >
                        {renderSortIcon("date")}
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-0 h-5 w-5"
                        >
                          <FilterIcon className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80 p-4">
                        <div className="space-y-4">
                          <Typography
                            variant="body-sm"
                            className="mb-1 text-muted-foreground"
                          >
                            محدوده تاریخ (۱۴۰۳/۲/۲۴)
                          </Typography>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="text"
                              placeholder="۱۴۰۳/۲/۵"
                              value={filterConfig.dateFromStr || ""}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setFilterConfig((prev) => ({
                                  ...prev,
                                  dateFromStr: e.target.value,
                                }))
                              }
                              className="font-mono text-sm"
                            />
                            <Input
                              type="text"
                              placeholder="۱۴۰۳/۲/۱۰"
                              value={filterConfig.dateToStr || ""}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setFilterConfig((prev) => ({
                                  ...prev,
                                  dateToStr: e.target.value,
                                }))
                              }
                              className="font-mono text-sm"
                            />
                          </div>
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resetFilter("date")}
                            >
                              پاک کردن
                            </Button>
                            <Button size="sm" onClick={applyFilters}>
                              اعمال
                            </Button>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>

                {/* مدت */}
                <TableHead className="text-right font-medium text-gray-300 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      مدت
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-0 h-5 w-5"
                        onClick={() => requestSort("duration")}
                      >
                        {renderSortIcon("duration")}
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-0 h-5 w-5"
                        >
                          <FilterIcon className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80 p-4">
                        <div className="space-y-4">
                          <Typography
                            variant="body-sm"
                            className="mb-1 text-muted-foreground"
                          >
                            محدوده مدت (ثانیه)
                          </Typography>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              placeholder="از"
                              value={filterConfig.durationFrom ?? ""}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setFilterConfig((prev) => ({
                                  ...prev,
                                  durationFrom: e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                                }))
                              }
                            />
                            <Input
                              type="number"
                              placeholder="تا"
                              value={filterConfig.durationTo ?? ""}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setFilterConfig((prev) => ({
                                  ...prev,
                                  durationTo: e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                                }))
                              }
                            />
                          </div>
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resetFilter("duration")}
                            >
                              پاک کردن
                            </Button>
                            <Button size="sm" onClick={applyFilters}>
                              اعمال
                            </Button>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>

                {/* دقت */}
                <TableHead className="text-right font-medium text-gray-300 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      دقت
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-0 h-5 w-5"
                        onClick={() => requestSort("accuracy")}
                      >
                        {renderSortIcon("accuracy")}
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-0 h-5 w-5"
                        >
                          <FilterIcon className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80 p-4">
                        <div className="space-y-4">
                          <Typography
                            variant="body-sm"
                            className="mb-1 text-muted-foreground"
                          >
                            محدوده دقت (0.0 - 1.0)
                          </Typography>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="1"
                              placeholder="از"
                              value={filterConfig.accuracyFrom ?? ""}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setFilterConfig((prev) => ({
                                  ...prev,
                                  accuracyFrom: e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                                }))
                              }
                            />
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="1"
                              placeholder="تا"
                              value={filterConfig.accuracyTo ?? ""}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setFilterConfig((prev) => ({
                                  ...prev,
                                  accuracyTo: e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                                }))
                              }
                            />
                          </div>
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resetFilter("accuracy")}
                            >
                              پاک کردن
                            </Button>
                            <Button size="sm" onClick={applyFilters}>
                              اعمال
                            </Button>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>

                {/* توضیحات بیشتر */}
                <TableHead className="text-right font-medium text-gray-300 py-3">
                  توضیحات بیشتر
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="border-b border-[#354152] hover:bg-[#171c25]"
                >
                  <TableCell className="py-3 text-right">{log.id}</TableCell>
                  <TableCell className="py-3 text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === "موفق"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-right">{log.date}</TableCell>
                  <TableCell className="py-3 text-right">
                    {log.duration}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    {log.accuracy.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <Dialog
                      open={openDetailId === log.id}
                      onOpenChange={(open) =>
                        setOpenDetailId(open ? log.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#151C28] border border-[#354152] max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            جزئیات درخواست
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <pre className="bg-black p-4 rounded-md text-sm text-gray-200 overflow-auto max-h-96 whitespace-pre-wrap">
                            {log.details || "بدون جزئیات"}
                          </pre>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              {"<"}
            </Button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={
                    page === currentPage ? "bg-blue-600 text-white" : ""
                  }
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              {">"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
