"use client";
import { useState } from "react";
import { ChartSection } from "../../../components/services-log/chart-section";
import { ServiceLogsTable } from "../../../components/services-log/log-table-section";
import type { LogEntry } from "../../../components/services-log/log-table-section";

const sampleLogs: LogEntry[] = [
  {
    id: 1,
    ip: "192.168.1.10",
    status: "موفق",
    date: "۱۴۰۳/۲/۵",
    duration: "0.45",
    accuracy: 0.92,
    details: '{"request":"ok"}',
  },
  {
    id: 2,
    ip: "192.168.1.11",
    status: "ناموفق",
    date: "۱۴۰۳/۲/۶",
    duration: "1.12",
    accuracy: 0.55,
    details: '{"error":"face not found"}',
  },
  {
    id: 3,
    ip: "10.0.0.5",
    status: "موفق",
    date: "۱۴۰۳/۲/۱۰",
    duration: "0.78",
    accuracy: 0.88,
    details: '{"request":"ok"}',
  },
  {
    id: 4,
    ip: "10.0.0.8",
    status: "موفق",
    date: "۱۴۰۳/۲/۱۲",
    duration: "0.33",
    accuracy: 0.99,
    details: '{"request":"ok"}',
  },
  {
    id: 5,
    ip: "172.16.0.1",
    status: "ناموفق",
    date: "۱۴۰۳/۲/۱۳",
    duration: "2.05",
    accuracy: 0.12,
    details: '{"error":"timeout"}',
  },
  {
    id: 6,
    ip: "172.16.0.2",
    status: "موفق",
    date: "۱۴۰۳/۲/۱۵",
    duration: "0.99",
    accuracy: 0.74,
    details: '{"request":"ok"}',
  },
];

// Daily data
const dailyData = [
  { name: "سه‌شنبه", موفق: 2400, ناموفق: 400 },
  { name: "چهارشنبه", موفق: 2210, ناموفق: 300 },
  { name: "پنج‌شنبه", موفق: 2290, ناموفق: 200 },
  { name: "جمعه", موفق: 2000, ناموفق: 278 },
  { name: "شنبه", موفق: 2180, ناموفق: 2180 },
  { name: "یکشنبه", موفق: 2500, ناموفق: 239 },
];

// Monthly data
const monthlyData = [
  { name: "فروردین", موفق: 7000, ناموفق: 1200 },
  { name: "اردیبهشت", موفق: 6800, ناموفق: 950 },
  { name: "خرداد", موفق: 7200, ناموفق: 1100 },
  { name: "تیر", موفق: 6500, ناموفق: 800 },
  { name: "مرداد", موفق: 7100, ناموفق: 1050 },
  { name: "شهریور", موفق: 6900, ناموفق: 900 },
];

// Yearly data
const yearlyData = [
  { name: "1402", موفق: 48000, ناموفق: 8500 },
  { name: "1403", موفق: 52000, ناموفق: 9200 },
  { name: "1404", موفق: 52000, ناموفق: 7000 },
  { name: "1405", موفق: 52000, ناموفق: 9200 },
];

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(sampleLogs.length / pageSize);
  const paginated = sampleLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-8  p-6">
      <ChartSection
        title="نمودار وضعیت کل درخواست های OCR"
        dailyData={dailyData}
        monthlyData={monthlyData}
        yearlyData={yearlyData}
      />

      <ServiceLogsTable
        logs={paginated}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
