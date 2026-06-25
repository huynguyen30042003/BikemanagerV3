import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryStatsProp {
  totalCategory?: number,
  totalMainCategory?: number,
  totalSecondCategory?: number,
  isLoading?: boolean
}

export default function CategoryStats({
  totalCategory,
  totalMainCategory,
  totalSecondCategory,
  isLoading,
}: CategoryStatsProp) {
  const cards = [
    {
      title: "Tổng danh mục",
      value: !isLoading && totalCategory,
      note: "",
    },
    {
      title: "Danh mục chính",
      value: !isLoading && totalMainCategory ,
      note: "",
    },
    {
      title: "Danh mục con",
      value: !isLoading && totalSecondCategory ,
      note: "",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {!isLoading && cards.map(({ title, value, note }) => (
        <Card key={title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value ?? 0}</div>
            {note && (
              <p className="mt-1 text-xs text-muted-foreground">{note}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}