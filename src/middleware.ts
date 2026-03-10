export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/goals/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
  ],
};
