import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except login)
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET;

  if (!token || !secret) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const storedSecret = decoded.split(":")[0];
    if (storedSecret !== secret) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
