import nodemailer from "nodemailer";

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "Missing SMTP environment variables. Check .env.example.",
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailOptions) {
  const from = process.env.MAIL_FROM || "noreply@bepluslabs.com";
  const transport = getTransport();

  await transport.sendMail({
    from: `"BePlus Labs" <${from}>`,
    to: Array.isArray(to) ? to.join(", ") : to,
    replyTo,
    subject,
    html,
  });
}

export async function sendNotification({
  subject,
  html,
  replyTo,
}: Omit<SendEmailOptions, "to">) {
  const to = process.env.MAIL_TO;
  if (!to) throw new Error("Missing MAIL_TO environment variable.");
  await sendEmail({ to, subject, html, replyTo });
}
