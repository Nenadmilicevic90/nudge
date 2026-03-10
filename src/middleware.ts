import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/dashboard", "/goals", "/profile", "/onboarding"];
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/goals/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
