import { NewsItem } from "@/lib/newsData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface RecentlyNewsProps {
  item: NewsItem;
}

const RecentlyNews = ({ item }: RecentlyNewsProps) => {
  const router = useRouter();
  const imageUrl = item?.thumbnail?.files?.[0]?.url
    ? `https://localhost:5001${item.thumbnail.files[0].url}`
    : "/fallback.png"; // ảnh mặc định

  return (
    <div
      className="col-span-3 flex flex-col cursor-pointer"
      onClick={() => router.push(`/news/${item?.path}`)}
    >
      <div className="relative w-full h-100">
        <Image
          src={imageUrl}
          alt={item?.displayText || "thumbnail"}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <h3 className="w-full mt-2 font-semibold line-clamp-2 text-[20px] mb-2">
        {item?.displayText}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
        {item?.summary}
      </p>
    </div>
  );
};

export default RecentlyNews;
