import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/students",
  "/subscription-plans",
  "/reports",
  "/settings",
  "/subscriptions",
  "/top-students"
];

export async function middleware(req: NextRequest) {
  const isProtected = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/students/:path*",
    "/subscription-plans/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/subscriptions/:path*",
    "/top-students/:path*"
  ]
};
