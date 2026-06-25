import { APP_URL } from "../constants/apiConstants";

export const getNews = async () => {
  const response = await fetch(
    `${APP_URL}/graphql`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query: `
        {
          news {
            displayText
            published
            contentItemId
            publishedDate
            path
            summary

            content {
              html
            }

            category {
              taxonomyContentItemId

              termContentItems {
                displayText
              }
            }

            tags {
              taxonomyContentItemId

              termContentItems {
                displayText
              }
            }

            thumbnail {
              files {
                path
                url
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

  return data.data.news;
};
export const getNewsById = async (path: string) => {
  const response = await fetch(
    `${APP_URL}/graphql`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            news(
              where: {
                path: "${path}"
              }
            ) {
              displayText
              published
              contentItemId
              publishedDate

              summary

              content {
                html
              }

              category {
                taxonomyContentItemId

                termContentItems {
                  displayText
                }
              }

              tags {
                taxonomyContentItemId

                termContentItems {
                  displayText
                }
              }

              thumbnail {
                files {
                  path
                  url
                }
              }

              path
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
  return data.data.news?.[0] || null;
};
