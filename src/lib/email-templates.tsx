type FeedbackFormData = {
  name: string;
  email: string;
  category: string;
  productSlug?: string;
  message: string;
};

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function wrap(html: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0;background:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:32px 24px 8px;">
              <h1 style="margin:0;font-size:20px;color:#111;letter-spacing:-0.3px;">
                BePlus <span style="color:#6B8C0D;">Labs</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 24px;">
              ${html}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #eee;">
              <p style="margin:0;font-size:12px;color:#888;">
                BePlus Labs &middot; Open-source WordPress tools
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function feedbackNotification(data: FeedbackFormData) {
  return wrap(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#111;">New Feedback</h2>
    <table cellpadding="0" cellspacing="0" style="font-size:14px;color:#333;line-height:1.6;">
      <tr><td style="padding:4px 0;"><strong>Category</strong></td><td style="padding:4px 0;padding-left:12px;">${data.category}</td></tr>
      <tr><td style="padding:4px 0;"><strong>Name</strong></td><td style="padding:4px 0;padding-left:12px;">${data.name}</td></tr>
      <tr><td style="padding:4px 0;"><strong>Email</strong></td><td style="padding:4px 0;padding-left:12px;"><a href="mailto:${data.email}" style="color:#6B8C0D;">${data.email}</a></td></tr>
      ${data.productSlug ? `<tr><td style="padding:4px 0;"><strong>Product</strong></td><td style="padding:4px 0;padding-left:12px;">${data.productSlug}</td></tr>` : ""}
    </table>
    <h3 style="margin:20px 0 8px;font-size:14px;color:#111;">Message</h3>
    <div style="margin:0;padding:12px;background:#f9f9f9;border-radius:6px;font-size:14px;color:#333;line-height:1.6;white-space:pre-wrap;">${data.message}</div>
  `);
}

export function feedbackConfirmationEmail(name: string) {
  return wrap(`
    <h2 style="margin:0 0 12px;font-size:18px;color:#111;">Thanks for your feedback!</h2>
    <p style="margin:0 0 12px;font-size:14px;color:#333;line-height:1.6;">Hi ${name},</p>
    <p style="margin:0 0 12px;font-size:14px;color:#333;line-height:1.6;">
      We've received your feedback and our team will review it. Your input helps shape the direction of our products.
    </p>
    <p style="margin:0;font-size:14px;color:#333;">— The BePlus Labs Team</p>
  `);
}

export function contactNotification(data: ContactFormData) {
  return wrap(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#111;">New Contact Message</h2>
    <table cellpadding="0" cellspacing="0" style="font-size:14px;color:#333;line-height:1.6;">
      <tr><td style="padding:4px 0;"><strong>Name</strong></td><td style="padding:4px 0;padding-left:12px;">${data.name}</td></tr>
      <tr><td style="padding:4px 0;"><strong>Email</strong></td><td style="padding:4px 0;padding-left:12px;"><a href="mailto:${data.email}" style="color:#6B8C0D;">${data.email}</a></td></tr>
      <tr><td style="padding:4px 0;"><strong>Subject</strong></td><td style="padding:4px 0;padding-left:12px;">${data.subject}</td></tr>
    </table>
    <h3 style="margin:20px 0 8px;font-size:14px;color:#111;">Message</h3>
    <p style="margin:0;padding:12px;background:#f9f9f9;border-radius:6px;font-size:14px;color:#333;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
  `);
}

type DownloadData = {
  name: string;
  email: string;
  productName: string;
  releaseTag: string;
  downloadUrl: string;
};

export function downloadLinkEmail(data: DownloadData) {
  return wrap(`
    <h2 style="margin:0 0 12px;font-size:18px;color:#111;">Your download is ready!</h2>
    <p style="margin:0 0 12px;font-size:14px;color:#333;line-height:1.6;">Hi ${data.name},</p>
    <p style="margin:0 0 4px;font-size:14px;color:#333;line-height:1.6;">
      Thank you for your interest in <strong>${data.productName}</strong>.
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#333;line-height:1.6;">
      Click the button below to download version ${data.releaseTag}:
    </p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td align="center" style="background:#CFFE25;border-radius:8px;padding:12px 24px;">
          <a href="${data.downloadUrl}" style="color:#111;font-size:14px;font-weight:600;text-decoration:none;display:inline-block;">
            Download ${data.productName} ${data.releaseTag}
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 12px;font-size:14px;color:#333;line-height:1.6;">
      If the button doesn't work, copy and paste this URL into your browser:
    </p>
    <p style="margin:0 0 16px;font-size:12px;color:#888;word-break:break-all;">${data.downloadUrl}</p>
    <p style="margin:0;font-size:14px;color:#333;">— The BePlus Labs Team</p>
  `);
}

export function downloadNotification(data: DownloadData & { ip?: string }) {
  return wrap(`
    <h2 style="margin:0 0 16px;font-size:18px;color:#111;">New Download</h2>
    <table cellpadding="0" cellspacing="0" style="font-size:14px;color:#333;line-height:1.6;">
      <tr><td style="padding:4px 0;"><strong>Product</strong></td><td style="padding:4px 0;padding-left:12px;">${data.productName} (${data.releaseTag})</td></tr>
      <tr><td style="padding:4px 0;"><strong>Name</strong></td><td style="padding:4px 0;padding-left:12px;">${data.name}</td></tr>
      <tr><td style="padding:4px 0;"><strong>Email</strong></td><td style="padding:4px 0;padding-left:12px;"><a href="mailto:${data.email}" style="color:#6B8C0D;">${data.email}</a></td></tr>
      ${data.ip ? `<tr><td style="padding:4px 0;"><strong>IP</strong></td><td style="padding:4px 0;padding-left:12px;">${data.ip}</td></tr>` : ""}
    </table>
  `);
}

export function contactConfirmationEmail(name: string) {
  return wrap(`
    <h2 style="margin:0 0 12px;font-size:18px;color:#111;">We received your message</h2>
    <p style="margin:0 0 12px;font-size:14px;color:#333;line-height:1.6;">Hi ${name},</p>
    <p style="margin:0 0 12px;font-size:14px;color:#333;line-height:1.6;">
      Thanks for reaching out! We've received your message and will get back to you as soon as possible — typically within 24 hours.
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#333;line-height:1.6;">
      In the meantime, check out our <a href="https://bepluslabs.com/changelog" style="color:#6B8C0D;">changelog</a> to see what we're working on.
    </p>
    <p style="margin:0;font-size:14px;color:#333;">— The BePlus Labs Team</p>
  `);
}
