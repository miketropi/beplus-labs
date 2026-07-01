import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(new URL("/admin/login", origin));
  response.cookies.delete("admin_token");
  return response;
}
