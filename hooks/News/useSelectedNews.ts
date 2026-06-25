import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSelectedNews = (newsData: any[]) => {
  const [selectedId, setSelectedId] = useState<string>(
    newsData[0]?.contentItemId || "",
  );

  const selectedNews = newsData.find(
    (item) => item.contentItemId === selectedId,
  );

  return { selectedId, setSelectedId, selectedNews };
};
