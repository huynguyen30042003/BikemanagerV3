import { APP_URL } from "../constants/apiConstants";

export const getCategory = async () => {
  const response = await fetch(
    `${APP_URL}/graphql`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        query: `
        {
          taxonomy(
            where: {
              displayText: "Category"
            }
          ) {
            displayText

            contentItemId

            taxonomy {
              contentItems {
                displayText
              }
            }
          }
        }
      `,
      }),

      next: {
        revalidate: 60,
      },
    },
  );

  const data = await response.json();

  return data.data.taxonomy;
};