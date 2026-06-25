import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WARRANTY_STATS = [
  {
    label: "Đang bảo hành",
    className: "bg-green-50 border-green-200",
    value: null,
  },
  {
    label: "Hết bảo hành",
    className: "bg-red-50 border-red-200",
    value: null,
  },
  {
    label: "Đã khiếu nại",
    className: "bg-blue-50 border-blue-200",
    value: null,
  },
] as const;

export function VehicleWarrantyOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng quan bảo hành</CardTitle>
        <CardDescription>Trạng thái bảo hành của các phương tiện</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {WARRANTY_STATS.map(({ label, className }) => (
            <div
              key={label}
              className={`flex items-center justify-between rounded-lg border p-4 ${className}`}
            >
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">—</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}