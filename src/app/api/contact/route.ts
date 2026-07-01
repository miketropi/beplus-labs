import { NextResponse } from "next/server";
import { sendNotification, sendEmail } from "@/lib/mail";
import {
  contactNotification,
  contactConfirmationEmail,
} from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    await sendNotification({
      subject: `[Contact] ${subject} — ${name}`,
      html: contactNotification({ name, email, subject, message }),
      replyTo: email,
    });

    await sendEmail({
      to: email,
      subject: "We received your message — BePlus Labs",
      html: contactConfirmationEmail(name),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
