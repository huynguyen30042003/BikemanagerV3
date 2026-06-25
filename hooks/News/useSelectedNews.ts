import { useState } from "react";

export const useSelectedNews = (newsData: any[]) => {
  const [selectedId, setSelectedId] = useState<string>(
    newsData[0]?.contentItemId || "",
  );

  const selectedNews = newsData.find(
    (item) => item.contentItemId === selectedId,
  );

  return { selectedId, setSelectedId, selectedNews };
};
