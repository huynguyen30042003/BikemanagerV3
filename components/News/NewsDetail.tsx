import { NewsItem } from "@/lib/newsData";
import { formatDate } from "@/lib/utils";
import { Image } from "../ui/image";

interface NewsDetailProps {
  item: NewsItem;
}

export default function NewsDetail({ item }: NewsDetailProps) {
  const file = item?.thumbnail?.files?.[0];
  if (!file) return null;

  const thumbnailUrl = file.url.startsWith("http")
    ? file.url
    : `https://localhost:5001${file.url}`;
  return (
    <article className="flex flex-col py-6">
      {/* Header */}
      <div className="mb-3">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
          {item.displayText}
        </h1>

        <div className="flex flex-col gap-4 text-muted-foreground text-sm">
          <div>
            <p className="font-semibold text-foreground mb-1">Phê duyệt:</p>
            <p>{item.published ? "✓ Đã xuất bản" : "Chưa xuất bản"}</p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">Ngày xuất bản:</p>
            <p>{formatDate(item.publishedDate)}</p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-1">Danh mục:</p>
            <p>{item.category.termContentItems[0]?.displayText}</p>
          </div>

          {item.tags.termContentItems.length > 0 && (
            <div>
              <p className="font-semibold text-foreground mb-2">Thẻ:</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.termContentItems.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {tag.displayText}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-border pt-2 mb-2">
        <p className="text-foreground leading-relaxed">{item.summary}</p>
      </div>
      
      <Image
        src={`https://localhost:5001${thumbnailUrl}`}
        alt={item.displayText}
        className="w-full h-auto rounded"
        width={300}
        height={300}
      />

      {/* HTML Content */}
      <div
        className="prose prose-sm dark:prose-invert max-w-none flex-1 overflow-auto"
        dangerouslySetInnerHTML={{ __html: item.content.html }}
      />
    </article>
  );
}
