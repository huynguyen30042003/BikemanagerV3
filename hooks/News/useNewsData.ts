import { NewsItem } from "@/lib/newsData";
import { useEffect, useState } from "react";
import { getNews, getNewsById } from "@/shared/api/news.api";

import { useQuery } from "@tanstack/react-query";

export const useGetNews = () => {
  return useQuery({
    queryKey: ["News"],

    queryFn: () => getNews(),

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });
};

export const useGetNewsById = ( path: string) => {
  return useQuery({
    queryKey: ["News", path],

    queryFn: () => getNewsById( path),

    enabled: !!path,

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });
};
