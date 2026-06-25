import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VehicleKpiCardsProps {
  totalStock?: number;
  totalSellingPrice?: number;
  isLoading: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  })
    .format(value)
    .split(" ")[0];

export function VehicleKpiCards({
  totalStock,
  totalSellingPrice,
  isLoading,
}: VehicleKpiCardsProps) {
  const cards = [
    {
      title: "Tổng phương tiện",
      value: !isLoading && totalStock,
      note: "",
    },
    {
      title: "Giá trị tổng",
      value: !isLoading && totalSellingPrice && formatCurrency(totalSellingPrice),
      note: "Tổng giá trị",
    },
    {
      title: "Số km trung bình",
      value: null,
      note: "KM đã đi",
    },
    {
      title: "Tỷ lệ hoạt động",
      value: null,
      note: "Phương tiện hoạt động",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ title, value, note }) => (
        <Card key={title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value ?? "—"}</div>
            {note && (
              <p className="mt-1 text-xs text-muted-foreground">{note}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}