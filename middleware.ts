import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const userId = request.cookies.get("userId")?.value;

  if (!userId) {
    const newId = uuidv4();
    response.cookies.set("userId", newId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 рік
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
