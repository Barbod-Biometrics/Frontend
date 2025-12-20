import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableDataItem = {
  status: string;
  quantity: number;
  sum: number;
};

type TableSectionProps = {
  data: TableDataItem[];
};

export function TableSection({ data }: TableSectionProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-center">
        خلاصه هزینه ها در ماه اخیر
      </h2>
      {/* Table container with black background and 12px radius */}
      <div className="bg-black rounded-[12px] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700 bg-black">
              <TableHead className="text-right font-medium text-gray-300 py-3">
                وضعیت
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
                className="border-b border-gray-700 hover:bg-gray-900"
              >
                <TableCell className="py-3 text-right">{row.status}</TableCell>
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
  );
}
