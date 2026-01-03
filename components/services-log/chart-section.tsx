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

export type ChartDataItem = {
  name: string;
  ناموفق: number;
  موفق: number;
};

export type ChartSectionProps = {
  title: string;
  dailyData: ChartDataItem[];
  monthlyData: ChartDataItem[];
  yearlyData: ChartDataItem[];
};

export function ChartSection({
  title,
  dailyData,
  monthlyData,
  yearlyData,
}: ChartSectionProps) {
  const [timeFilter, setTimeFilter] = useState<"روزانه" | "ماهانه" | "سالانه">(
    "روزانه"
  );
  const [statusSelection, setStatusSelection] = useState<string[]>([]);

  const handleTimeFilterChange = (value: string) => {
    if (value === "روزانه" || value === "ماهانه" || value === "سالانه") {
      setTimeFilter(value);
    }
  };

  const data = (() => {
    switch (timeFilter) {
      case "ماهانه":
        return monthlyData;
      case "سالانه":
        return yearlyData;
      default:
        return dailyData;
    }
  })();

  const isUnsuccessfulSelected = statusSelection.includes("ناموفق");
  const isSuccessfulSelected = statusSelection.includes("موفق");
  const showBoth = statusSelection.length === 0;

  const handleStatusChange = (values: string[]) => {
    if (values.length === 0) {
      setStatusSelection([]);
    } else {
      setStatusSelection([values[values.length - 1]]);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div
        className="rounded-lg border-[0.8px] border-[#354152] bg-[#151C28] p-3 text-white text-sm"
        style={{ direction: "rtl" }}
      >
        <p className="font-medium mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-1.5">
              <span
                className="flex items-center gap-1"
                style={{ color: entry.color }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></span>
                {entry.name}
              </span>
              <span>{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#151C28] rounded-xl p-6 shadow-lg border border-[#354152]">
      <h2 className="text-xl font-bold mb-6 text-center text-white">{title}</h2>
      <div className="bg-[#1C2533] rounded-xl p-6 border-[0.8px] border-[#354152]">
        {/* Time Filter */}
        <div className="flex justify-center mb-6">
          <ToggleGroup
            type="single"
            value={timeFilter}
            onValueChange={handleTimeFilterChange}
            className="flex bg-[#2A3547] p-[3px] gap-[3px] rounded-[55px]"
          >
            {(["روزانه", "ماهانه", "سالانه"] as const).map((value) => (
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

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 0, right: 60, left: 60, bottom: 0 }}
            >
              <CartesianGrid stroke="#4B5563" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis hide domain={[0, "auto"]} />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              {(showBoth || isSuccessfulSelected) && (
                <Area
                  type="monotone"
                  dataKey="موفق"
                  stroke="#2A9D90"
                  strokeWidth={2}
                  fill="none"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#2A9D90",
                    strokeWidth: 0,
                    stroke: "#151C28",
                  }}
                />
              )}
              {(showBoth || isUnsuccessfulSelected) && (
                <Area
                  type="monotone"
                  dataKey="ناموفق"
                  stroke="#E76E50"
                  strokeWidth={2}
                  fill="none"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#E76E50",
                    strokeWidth: 0,
                    stroke: "#151C28",
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Filter */}
        <div className="flex justify-center mt-6">
          <ToggleGroup
            type="multiple"
            value={statusSelection}
            onValueChange={handleStatusChange}
            className="flex bg-[#2A3547] p-[3px] gap-[3px] rounded-[55px]"
          >
            <ToggleGroupItem
              value="ناموفق"
              className={`
                px-4 py-2 text-sm font-medium rounded-[52px]
                data-[state=on]:bg-[#000000] data-[state=on]:text-white
                bg-transparent text-gray-300 hover:bg-[#252E3F]
                focus-visible:outline-none ring-0 transition-all
                flex items-center space-x-2 rtl:space-x-reverse
              `}
            >
              <span className="inline-block w-3 h-3 rounded-full bg-[#E76E50]"></span>
              ناموفق
            </ToggleGroupItem>
            <ToggleGroupItem
              value="موفق"
              className={`
                px-4 py-2 text-sm font-medium rounded-[52px]
                data-[state=on]:bg-[#000000] data-[state=on]:text-white
                bg-transparent text-gray-300 hover:bg-[#252E3F]
                focus-visible:outline-none ring-0 transition-all
                flex items-center space-x-2 rtl:space-x-reverse
              `}
            >
              <span className="inline-block w-3 h-3 rounded-full bg-[#2A9D90]"></span>
              موفق
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
