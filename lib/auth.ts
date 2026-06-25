export function getAccessToken() {
  const token =
    localStorage.getItem(
      "access_token"
    );

  const expiresAt =
    localStorage.getItem(
      "expires_at"
    );

  // không có token
  if (
    !token ||
    !expiresAt
  ) {
    return null;
  }

  // token hết hạn
  if (
    Date.now() >
    Number(expiresAt) * 1000
  ) {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "expires_at"
    );

    return null;
  }

  return token;
}