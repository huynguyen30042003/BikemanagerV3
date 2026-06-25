import {
  NextRequest,
  NextResponse,
} from "next/server";

export function proxy(
  req: NextRequest
) {

  const token =
    req.cookies.get(
      "refresh_token"
    )?.value;
    
  const isAuthPage =
    req.nextUrl.pathname ===
    "/login";

  // chưa login
  if (!token && !isAuthPage) {

    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // đã login
  if (token && isAuthPage) {

    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
  ],
};