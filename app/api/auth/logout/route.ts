
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch(
      "https://localhost:5001/api/v1/auth/logout",
      {
        method: "POST",

        credentials: "include",
      }
    );

    const nextResponse =
      NextResponse.json({
        success: true,
      });

    // forward clear-cookie
    const cookies =
      response.headers.getSetCookie();

    cookies.forEach((cookie) => {
      nextResponse.headers.append(
        "Set-Cookie",
        cookie
      );
    });

    return nextResponse;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message:
          "Logout failed",
      },
      {
        status: 500,
      }
    );
  }
}