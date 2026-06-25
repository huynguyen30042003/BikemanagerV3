import { NewsItem } from "@/lib/newsData";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface NewsListProps {
  items: NewsItem[];
  selectedId?: string;
}

export default function NewsList({ items, selectedId }: NewsListProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full col-span-2 gap-2">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground">
          Danh Sách Tin Tức
        </h2>
        <p className="text-sm text-muted-foreground mt-1">bài viết</p>
      </div>

      <div className="flex-1 overflow-y-auto cursor-pointer flex flex-col gap-2">
        {items?.map((item) => (
          <button
            key={item?.contentItemId}
            onClick={() => router.push(`/news/${item?.path}`)}
            className={`w-full text-left p-4 border rounded-2xl border-border transition-colors ${
              selectedId === item?.contentItemId
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted text-foreground"
            }`}
          >
            <h3 className="font-semibold line-clamp-2 text-base mb-2">
              {item?.displayText}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {item?.summary}
            </p>
            <div className="flex gap-2 flex-wrap">
              {item?.tags.termContentItems.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                >
                  {tag?.displayText}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {formatDate(item?.publishedDate)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
