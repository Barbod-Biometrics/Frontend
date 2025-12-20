import { ChartSection } from "../../../components/services-log/chart-section";
import { TableSection } from "../../../components/services-log/table-section";

// Sample data
const chartData = [
  { name: "سه شنبه", ناموفق: 4000, موفق: 2400 },
  { name: "چهارشنبه", ناموفق: 3000, موفق: 2210 },
  { name: "پنج شنبه", ناموفق: 2000, موفق: 2290 },
  { name: "جمعه", ناموفق: 2780, موفق: 2000 },
  { name: "شنبه", ناموفق: 1890, موفق: 2181 },
  { name: "یکشنبه", ناموفق: 2390, موفق: 2500 },
];

const tableData = [
  { status: "OCR", quantity: 200, sum: 200000 },
  { status: "liveness detection", quantity: 50, sum: 25000 },
  { status: "مجموع کل", quantity: 250, sum: 225000 },
];

export default function DashboardPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-900 text-white p-6 pr-[220px]"
    >
      <div className="space-y-8">
        <ChartSection data={chartData} />
        <TableSection data={tableData} />
      </div>
    </div>
  );
}
