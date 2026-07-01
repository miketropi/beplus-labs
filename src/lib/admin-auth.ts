"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_token";
const TOKEN_EXPIRY = 60 * 60 * 24; // 24 hours

export async function login(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string } | null> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return { error: "Server misconfiguration" };

  const password = formData.get("password") as string;
  if (password !== secret) {
    return { error: "Invalid password" };
  }

  const token = Buffer.from(`${secret}:${Date.now()}`).toString("base64");
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_EXPIRY,
    path: "/admin",
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function isAuthenticated(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const storedSecret = decoded.split(":")[0];
    return storedSecret === secret;
  } catch {
    return false;
  }
}
