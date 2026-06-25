import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  SEARCH_BY_OPTIONS,
  PRICE_STEP,
  DEFAULT_MAX_PRICE,
} from "@/constants/Vehiclespage.constants";

interface VehicleFilterBarProps {
  searchInput: string;
  searchBy: string;
  priceRange: number[];
  onSearch: (value: string) => void;
  onSearchByChange: (value: string) => void;
  onPriceRangeChange: (value: number[]) => void;
}

export function VehicleFilterBar({
  searchInput,
  searchBy,
  priceRange,
  onSearch,
  onSearchByChange,
  onPriceRangeChange,
}: VehicleFilterBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tìm kiếm và bộ lọc</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-0 bottom-0 m-auto text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Tìm kiếm theo model, biển số hoặc VIN..."
            className="pl-10"
            value={searchInput}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Search By */}
        <Select value={searchBy} onValueChange={onSearchByChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            {SEARCH_BY_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Range */}
        <div className="flex w-[30%] flex-col gap-2">
          <div className="flex gap-4">
            <Label>Price</Label>
            <div className="flex flex-1 justify-between">
              <span className="text-sm text-muted-foreground">
                {priceRange[0].toLocaleString("vi-VN")}
              </span>
              <span className="text-sm text-muted-foreground">
                {priceRange[1].toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            min={0}
            max={DEFAULT_MAX_PRICE}
            step={PRICE_STEP}
          />
        </div>
      </CardContent>
    </Card>
  );
}
