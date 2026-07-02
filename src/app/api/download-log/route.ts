import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, sendNotification } from "@/lib/mail";
import {
  downloadLinkEmail,
  downloadNotification,
} from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, productSlug, productName, releaseTag, downloadUrl } =
      body;

    if (!email || !productSlug || !productName || !releaseTag || !downloadUrl) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      null;
    const userAgent = request.headers.get("user-agent") ?? null;
    const referer = request.headers.get("referer") ?? null;

    await prisma.downloadLog.create({
      data: {
        email,
        productSlug,
        productName,
        releaseTag,
        downloadUrl,
        ip,
        userAgent,
        referer,
      },
    });

    await sendEmail({
      to: email,
      subject: `Your download for ${productName} is ready — BePlus Labs`,
      html: downloadLinkEmail({
        name: name || email.split("@")[0],
        email,
        productName,
        releaseTag,
        downloadUrl,
      }),
    });

    await sendNotification({
      subject: `[Download] ${productName} ${releaseTag} — ${name || email}`,
      html: downloadNotification({
        name: name || email.split("@")[0],
        email,
        productName,
        releaseTag,
        downloadUrl,
        ip: ip ?? undefined,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Download log API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
