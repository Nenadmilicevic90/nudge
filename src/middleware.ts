import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("nudge_session")?.value;
  const user = token ? await verifySession(token) : null;
  const isLoggedIn = !!user;

  const protectedRoutes = ["/dashboard", "/goals", "/profile", "/onboarding"];
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    isLoggedIn &&
    (pathname.startsWith("/auth/login") ||
      pathname.startsWith("/auth/register"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

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
