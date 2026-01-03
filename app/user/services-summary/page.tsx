import { ChartSection } from "../../../components/services-log/chart-section";
import { TableSection } from "../../../components/services-log/table-section";

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

const tableData = [
  { service: "OCR", quantity: 200, sum: 200000 },
  { service: "liveness detection", quantity: 50, sum: 25000 },
  { service: "همه", quantity: 250, sum: 225000 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8  p-6">
      <ChartSection
        title="نمودار خلاصه کل درخواست های اخیر"
        dailyData={dailyData}
        monthlyData={monthlyData}
        yearlyData={yearlyData}
      />
      <TableSection data={tableData} />
    </div>
  );
}
