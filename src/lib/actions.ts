"use server";

import { sendEmail, sendNotification } from "@/lib/mail";
import {
  betaRequestNotification,
  betaConfirmationEmail,
  contactNotification,
  contactConfirmationEmail,
} from "@/lib/email-templates";

type ActionResult = { success?: boolean; error?: string } | null;

export async function submitBetaRequest(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = (formData.get("company") as string) || undefined;
  const products = formData.getAll("products") as string[];
  const description = (formData.get("description") as string) || undefined;

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  try {
    await sendNotification({
      subject: `[Beta] New request from ${name}`,
      html: betaRequestNotification({ name, email, company, products, description }),
      replyTo: email,
    });

    await sendEmail({
      to: email,
      subject: "Thanks for joining the BePlus Labs Beta!",
      html: betaConfirmationEmail(name),
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to send beta email:", err);
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
