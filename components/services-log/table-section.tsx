"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type TableDataItem = {
  service: string;
  quantity: number;
  sum: number;
};

type TableSectionProps = {
  data: TableDataItem[];
};

export function TableSection({ data }: TableSectionProps) {
  const [timeFilter, setTimeFilter] = useState<"ماه اخیر" | "سال اخیر">(
    "ماه اخیر"
  );

  //  Safe handler
  const handleTimeFilterChange = (value: string) => {
    if (value === "ماه اخیر" || value === "سال اخیر") {
      setTimeFilter(value);
    }
  };

  return (
    <div className="bg-[#151C28] rounded-xl p-6 border border-[#354152]">
      <h2 className="text-xl font-bold mb-6 text-center text-white">
        خلاصه هزینه ها
      </h2>

      {/*  Inner panel with time filter + table */}
      <div className="bg-[#1C2533] rounded-xl p-6 border-[0.8px] border-[#354152]">
        {/*  Time Filter Toggle Group */}
        <div className="flex justify-center mb-6">
          <ToggleGroup
            type="single"
            value={timeFilter}
            onValueChange={handleTimeFilterChange}
            className="flex bg-[#2A3547] p-[3px] gap-[3px] rounded-[55px]"
          >
            {(["ماه اخیر", "سال اخیر"] as const).map((value) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className={`
                  px-4 py-2 text-sm font-medium rounded-[52px]
                  data-[state=on]:bg-[#000000] data-[state=on]:text-white
                  bg-transparent text-gray-300 hover:bg-[#252E3F]
                  focus-visible:outline-none ring-0 transition-all
                `}
              >
                {value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/*  Table */}
        <div className="overflow-x-auto bg-black rounded-[12px]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#354152]">
                <TableHead className="text-right font-medium text-gray-300 py-3">
                  سرویس
                </TableHead>
                <TableHead className="text-right font-medium text-gray-300 py-3">
                  تعداد
                </TableHead>
                <TableHead className="text-right font-medium text-gray-300 py-3">
                  مجموع
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  className={`border-b border-[#354152] hover:bg-[#171c25]
                    ${index === data.length - 1 ? "font-bold" : "font-normal"}`}
                >
                  <TableCell className="py-3 text-right">
                    {row.service}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    {row.quantity}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    {row.sum.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
