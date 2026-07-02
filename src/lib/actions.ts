"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail, sendNotification } from "@/lib/mail";
import {
  feedbackNotification,
  feedbackConfirmationEmail,
  contactNotification,
  contactConfirmationEmail,
} from "@/lib/email-templates";
import { revalidatePath } from "next/cache";

type ActionResult = { success?: boolean; error?: string } | null;

export async function submitFeedback(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const category = formData.get("category") as string;
  const productSlug = formData.get("productSlug") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  try {
    await prisma.feedback.create({
      data: {
        name,
        email,
        category: category as "bug" | "feature" | "improvement" | "general",
        productSlug: productSlug || null,
        message,
      },
    });

    await sendNotification({
      subject: `[Feedback] ${category} from ${name}${productSlug ? ` — ${productSlug}` : ""}`,
      html: feedbackNotification({ name, email, category, productSlug, message }),
      replyTo: email,
    });

    await sendEmail({
      to: email,
      subject: "We received your feedback — BePlus Labs",
      html: feedbackConfirmationEmail(name),
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    console.error("Failed to submit feedback:", err);
    return { error: "Something went wrong. Please try again later." };
  }
}

export async function submitContactForm(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { error: "All fields are required." };
  }

  try {
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

    return { success: true };
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return { error: "Something went wrong. Please try again later." };
  }
}
