"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";

// Sample data for the chart - replace with your actual data
const chartData = [
  { name: "سه شنبه", ناموفق: 4000, موفق: 2400 },
  { name: "چهارشنبه", ناموفق: 3000, موفق: 2210 },
  { name: "پنج شنبه", ناموفق: 2000, موفق: 2290 },
  { name: "جمعه", ناموفق: 2780, موفق: 2000 },
  { name: "شنبه", ناموفق: 1890, موفق: 2181 },
  { name: "یکشنبه", ناموفق: 2390, موفق: 2500 },
];

// Sample data for the table - replace with your actual data
const tableData = [
  { وضعیت: "موفق", تعداد: 200, مجموع: 200000 },
  { وضعیت: "ناموفق", تعداد: 50, مجموع: 25000 },
  { وضعیت: "مجموع کل", تعداد: 250, مجموع: 225000 }, // Total row
];

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState("روزانه"); // 'روزانه', 'ماهانه', 'سالانه'
  const [visibleLines, setVisibleLines] = useState({
    موفق: true,
    ناموفق: true,
  });

  // Toggle function for line visibility
  const toggleLine = (key: "موفق" | "ناموفق") => {
    setVisibleLines((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header Section - Already Implemented */}
      {/* <Header /> */}

      {/* Main Content */}
      <div className="space-y-8">
        {/* Chart Section */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-center">
            نمودار وضعیت کل درخواست های اخیر
          </h2>

          {/* Time Filter Buttons */}
          <div className="flex justify-center space-x-2 mb-6 rtl:space-x-reverse">
            <button
              onClick={() => setTimeFilter("روزانه")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                timeFilter === "روزانه"
                  ? "bg-black text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              روزانه
            </button>
            <button
              onClick={() => setTimeFilter("ماهانه")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                timeFilter === "ماهانه"
                  ? "bg-black text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              ماهانه
            </button>
            <button
              onClick={() => setTimeFilter("سالانه")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                timeFilter === "سالانه"
                  ? "bg-black text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              سالانه
            </button>
          </div>

          {/* Line Visibility Toggle Buttons (Replaces Legend) */}
          <div className="flex justify-center space-x-2 mb-6 rtl:space-x-reverse">
            <button
              onClick={() => toggleLine("ناموفق")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                visibleLines.ناموفق
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  visibleLines.ناموفق ? "bg-red-400" : "bg-red-400 opacity-50"
                }`}
              ></span>
              ناموفق
            </button>
            <button
              onClick={() => toggleLine("موفق")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                visibleLines.موفق
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  visibleLines.موفق ? "bg-green-400" : "bg-green-400 opacity-50"
                }`}
              ></span>
              موفق
            </button>
          </div>

          {/* Chart Container */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "0.5rem",
                  }}
                  itemStyle={{ color: "#FFFFFF" }}
                />
                {/* Conditionally render lines based on state */}
                {visibleLines.ناموفق && (
                  <Line
                    type="monotone"
                    dataKey="ناموفق"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {visibleLines.موفق && (
                  <Line
                    type="monotone"
                    dataKey="موفق"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-center">
            خلاصه هزینه ها در ماه اخیر
          </h2>

          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-700">
                <TableHead className="text-right font-medium">وضعیت</TableHead>
                <TableHead className="text-right font-medium">تعداد</TableHead>
                <TableHead className="text-right font-medium">مجموع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow
                  key={index}
                  className={`${
                    index === tableData.length - 1
                      ? "bg-gray-700 font-bold"
                      : "hover:bg-gray-700"
                  } border-b border-gray-700`}
                >
                  <TableCell className="py-3">{row.وضعیت}</TableCell>
                  <TableCell className="py-3">{row.تعداد}</TableCell>
                  <TableCell className="py-3">
                    {row.مجموع.toLocaleString()}
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
