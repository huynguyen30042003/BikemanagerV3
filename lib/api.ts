import { getAccessToken } from "./auth";

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token =
    getAccessToken();

  const response =
    await fetch(url, {
      ...options,

      headers: {
        ...options.headers,

        Authorization:
          `Bearer ${token}`,
      },
    });

  // token hết hạn
  if (
    response.status === 401
  ) {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "expires_at"
    );

    window.location.href =
      "/login";
  }

  return response;
}