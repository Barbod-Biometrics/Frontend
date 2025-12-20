"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ChartDataItem = {
  name: string;
  ناموفق: number;
  موفق: number;
};

type ChartSectionProps = {
  data: ChartDataItem[];
};

export function ChartSection({ data }: ChartSectionProps) {
  const [timeFilter, setTimeFilter] = useState("روزانه");
  // Use string[] for multiple, but we'll enforce 0 or 1
  const [statusSelection, setStatusSelection] = useState<string[]>([]);

  // Determine visibility
  const isUnsuccessfulSelected = statusSelection.includes("ناموفق");
  const isSuccessfulSelected = statusSelection.includes("موفق");
  const showBoth = statusSelection.length === 0;

  // Custom handler to allow only 0 or 1 selection
  const handleStatusChange = (values: string[]) => {
    if (values.length === 0) {
      setStatusSelection([]);
    } else {
      // Only keep the latest selected value (acts like single, but allows deselect)
      setStatusSelection([values[values.length - 1]]);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-center">
        نمودار وضعیت کل درخواست های اخیر
      </h2>

      {/* Time Filter */}
      <div className="flex justify-center mb-6">
        <ToggleGroup
          type="single"
          value={timeFilter}
          onValueChange={setTimeFilter}
          className="bg-gray-700 p-[3px] gap-[3px]"
        >
          {(["روزانه", "ماهانه", "سالانه"] as const).map((value) => (
            <ToggleGroupItem
              key={value}
              value={value}
              className="px-4 py-2 text-sm font-medium
                          rounded-full
                          hover:rounded-full
                          data-[state=on]:rounded-full
                          data-[state=on]:bg-black
                          data-[state=on]:text-white
                          bg-gray-700
                          text-gray-300
                          hover:bg-gray-600
                          transition-all
                          flex items-center space-x-2 rtl:space-x-reverse"
            >
              {value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid stroke="#4B5563" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={[0, "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "0.5rem",
              }}
              itemStyle={{ color: "#FFFFFF" }}
              cursor={false}
            />
            {/* Show lines based on selection */}
            {(showBoth || isUnsuccessfulSelected) && (
              <Area
                type="monotone"
                dataKey="ناموفق"
                stroke="#E76E50"
                strokeWidth={2}
                fill="none"
                dot={false}
                activeDot={false}
              />
            )}
            {(showBoth || isSuccessfulSelected) && (
              <Area
                type="monotone"
                dataKey="موفق"
                stroke="#2A9D90"
                strokeWidth={2}
                fill="none"
                dot={false}
                activeDot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Status Filter - NOW SUPPORTS DESELECTION! */}
      <div className="flex justify-center mt-6">
        <ToggleGroup
          type="multiple" // ← Key: allow multiple (but we limit to 0 or 1)
          value={statusSelection}
          onValueChange={handleStatusChange}
          className="bg-gray-700 p-[3px] gap-[3px]"
        >
          <ToggleGroupItem
            value="ناموفق"
            className="px-4 py-2 text-sm font-medium
                          rounded-full
                          hover:rounded-full
                          data-[state=on]:rounded-full
                          data-[state=on]:bg-black
                          data-[state=on]:text-white
                          bg-gray-700
                          text-gray-300
                          hover:bg-gray-600
                          transition-all
                          flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span className="inline-block w-3 h-3 rounded-full bg-[#E76E50]"></span>
            ناموفق
          </ToggleGroupItem>
          <ToggleGroupItem
            value="موفق"
            className="px-4 py-2 text-sm font-medium
                          rounded-full
                          hover:rounded-full
                          data-[state=on]:rounded-full
                          data-[state=on]:bg-black
                          data-[state=on]:text-white
                          bg-gray-700
                          text-gray-300
                          hover:bg-gray-600
                          transition-all
                          flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span className="inline-block w-3 h-3 rounded-full bg-[#2A9D90]"></span>
            موفق
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
