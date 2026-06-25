interface CategoryProp {
  setSelectCategory: (
    selectCategory: string,
  ) => void;

  selectCategory: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoryData: any[];
}

const Category = ({
  setSelectCategory,
  selectCategory,
  categoryData,
}: CategoryProp) => {
  return (
    <div className="container flex justify-start gap-3">
      {categoryData?.length > 0 &&
        categoryData?.[0]?.taxonomy?.contentItems?.map(
          (item: {
            displayText: string;
          }) => (
            <div
              key={item?.displayText}
              onClick={() =>
                setSelectCategory(
                  item?.displayText,
                )
              }
              className={
                selectCategory ===
                item?.displayText
                  ? "cursor-pointer font-bold"
                  : "cursor-pointer"
              }
            >
              {item?.displayText}
            </div>
          ),
        )}
    </div>
  );
};

export default Category;