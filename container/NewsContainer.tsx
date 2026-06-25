"use client";

import { useState } from "react";

import Category from "@/components/Common/Category";
import NewsList from "@/components/News/NewsList";
import RecentlyNews from "@/components/News/RecentlyNews";

interface NewsContainerProps {
  newsData: any[];
  categoryData: any
}

const NewsContainer = ({
  newsData,categoryData
}: NewsContainerProps) => {
  const [selectCategory, setSelectCategory] =
    useState<string>("");

  const filteredNews = newsData?.filter((prep) =>
    selectCategory === ""
      ? true
      : prep?.category?.termContentItems?.some(
          (term: any) =>
            term.displayText === selectCategory,
        ),
  );

  return (
    <div className="flex flex-col mt-3 gap-y-4">
      <Category
        categoryData={categoryData}
        selectCategory={selectCategory}
        setSelectCategory={setSelectCategory}
      />

      <div className="grid grid-cols-5 gap-4">
        <RecentlyNews item={filteredNews?.[0]} />

        <NewsList items={filteredNews?.slice(1)} />
      </div>
    </div>
  );
};

export default NewsContainer;