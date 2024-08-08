import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const middleware = auth((req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;

  if (nextUrl.pathname !== "/" && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/patients/:path*",
    "/facilities/:path*",
    "/stats/:path*",
    "/visit/:path*",
    "/profile/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
