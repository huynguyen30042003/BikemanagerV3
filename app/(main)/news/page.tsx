import NewsContainer from "@/container/NewsContainer";

import { getNews } from "@/shared/api/news.api";
import { getCategory } from "@/shared/api/category.api";

export const revalidate = 60;

const Page = async () => {
  const [newsData, categoryData] =
    await Promise.all([
      getNews(),
      getCategory(),
    ]);

  return (
    <NewsContainer
      newsData={newsData}
      categoryData={categoryData}
    />
  );
};

export default Page;