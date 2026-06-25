import { getNewsById } from "@/shared/api/news.api";
import NewsDetail from "@/components/News/NewsDetail";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;

  const news = await getNewsById(slug);

  if (!news) {
    notFound();
  }

  return (
    <div className="container flex flex-col mt-3 gap-y-4">
      <NewsDetail item={news} />
    </div>
  );
};

export default Page;