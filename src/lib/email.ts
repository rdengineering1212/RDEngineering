import nodemailer from "nodemailer";
import { Resend } from "resend";

// ─── Config ──────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "rdengineering1212@gmail.com";
const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "RD Engineering";

// Resend
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const isResendConfigured =
  !!RESEND_API_KEY &&
  RESEND_API_KEY !== "re_placeholder" &&
  RESEND_API_KEY.startsWith("re_");

const resend = isResendConfigured ? new Resend(RESEND_API_KEY!) : null;

// SMTP
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");

const isSmtpConfigured =
  !!SMTP_USER &&
  !!SMTP_PASS &&
  SMTP_USER !== "placeholder@gmail.com" &&
  SMTP_PASS !== "placeholder" &&
  SMTP_USER.includes("@");

const smtpTransporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { rejectUnauthorized: false },
    })
  : null;

// From address
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || ADMIN_EMAIL;

// ─── Log email config at startup ────────────────────────────────────────────
console.log(`[Email Config] Resend: ${isResendConfigured ? "✅ configured" : "❌ not configured (RESEND_API_KEY missing or placeholder)"}`);
console.log(`[Email Config] SMTP: ${isSmtpConfigured ? `✅ configured (${SMTP_HOST}:${SMTP_PORT} as ${SMTP_USER})` : "❌ not configured (SMTP_USER/SMTP_PASS missing or placeholder)"}`);
if (!isResendConfigured && !isSmtpConfigured) {
  console.error("[Email Config] ⚠️  NO EMAIL PROVIDER IS CONFIGURED. Emails will not be sent. Set RESEND_API_KEY or SMTP_USER+SMTP_PASS in your environment.");
}

// ─── Core Sender ─────────────────────────────────────────────────────────────

type SendMailOptions = { to: string; subject: string; html: string };
type SendMailResult = { provider: string; success: boolean; id?: string; error?: string };

export async function sendMail(opts: SendMailOptions): Promise<SendMailResult> {
  const { to, subject, html } = opts;

  if (!isResendConfigured && !isSmtpConfigured) {
    const msg = "No email provider configured. Set RESEND_API_KEY or SMTP credentials.";
    console.warn(`[Email] SKIPPING email to ${to}: ${msg}`);
    return { provider: "none", success: false, error: msg };
  }

  // Try Resend first
  if (isResendConfigured && resend) {
    try {
      console.log(`[Email] Sending via Resend → ${to} | Subject: ${subject}`);
      const result = await resend.emails.send({
        from: `${COMPANY_NAME} <${RESEND_FROM}>`,
        to,
        subject,
        html,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      console.log(`[Email] ✅ Resend success → ${to} | id: ${result.data?.id}`);
      return { provider: "resend", success: true, id: result.data?.id };
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.error(`[Email] ❌ Resend failed → ${to}: ${errMsg}`);

      if (!isSmtpConfigured) {
        console.warn(`[Email] SMTP not configured either — cannot fallback. Email NOT sent to ${to}`);
        return { provider: "resend", success: false, error: errMsg };
      }
      console.warn(`[Email] Falling back to SMTP for ${to}...`);
    }
  }

  // SMTP (primary if Resend not configured, or fallback)
  if (isSmtpConfigured && smtpTransporter) {
    try {
      console.log(`[Email] Sending via SMTP (${SMTP_HOST}) → ${to} | Subject: ${subject}`);
      const info = await smtpTransporter.sendMail({
        from: `"${COMPANY_NAME}" <${SMTP_FROM}>`,
        to,
        subject,
        html,
      });
      console.log(`[Email] ✅ SMTP success → ${to} | messageId: ${info.messageId}`);
      return { provider: "smtp", success: true, id: info.messageId };
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.error(`[Email] ❌ SMTP failed → ${to}: ${errMsg}`);
      return { provider: "smtp", success: false, error: errMsg };
    }
  }

  return { provider: "none", success: false, error: "No provider available" };
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function emailShell(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#0A1628;padding:32px 40px;text-align:center;">
              <div style="display:inline-block;background:#D4AF37;border-radius:8px;padding:8px 16px;margin-bottom:12px;">
                <span style="color:#0A1628;font-size:22px;font-weight:900;letter-spacing:2px;">RD</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">RD Engineering</h1>
              <p style="margin:6px 0 0;color:#D4AF37;font-size:12px;letter-spacing:2px;text-transform:uppercase;">${title}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0A1628;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#94A3B8;font-size:12px;line-height:1.6;">
                4/372 Nehru Street, Dr Ambedkar Nagar, Kadambathur, Tamil Nadu 631209<br/>
                <a href="tel:+918883389766" style="color:#D4AF37;text-decoration:none;">+91 8883389766</a> &nbsp;|&nbsp;
                <a href="mailto:rdengineering1212@gmail.com" style="color:#D4AF37;text-decoration:none;">rdengineering1212@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function infoRow(label: string, value: string, isLink?: string): string {
  const val = isLink
    ? `<a href="${isLink}" style="color:#D4AF37;text-decoration:none;">${value}</a>`
    : `<span style="color:#334155;">${value}</span>`;
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;vertical-align:top;width:130px;">
        <strong style="color:#0A1628;font-size:13px;">${label}</strong>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;vertical-align:top;font-size:14px;">
        ${val}
      </td>
    </tr>
  `;
}

// ─── Admin Notification Emails ────────────────────────────────────────────────

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
}) {
  const rows = [
    infoRow("Name", data.name),
    infoRow("Email", data.email, `mailto:${data.email}`),
    data.phone ? infoRow("Phone", data.phone, `tel:${data.phone}`) : "",
    data.company ? infoRow("Company", data.company) : "",
    data.service ? infoRow("Service", data.service) : "",
  ].join("");

  const body = `
    <h2 style="margin:0 0 20px;color:#0A1628;font-size:18px;font-weight:700;">New Contact Inquiry</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
    <div style="margin-top:24px;background:#F8FAFC;border-left:4px solid #D4AF37;border-radius:0 8px 8px 0;padding:20px;">
      <h3 style="margin:0 0 10px;color:#0A1628;font-size:14px;font-weight:700;">Message:</h3>
      <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;white-space:pre-line;">${data.message}</p>
    </div>
    <div style="margin-top:24px;background:#FFFBEB;border:1px solid #FCD34D;border-radius:8px;padding:16px;">
      <p style="margin:0;color:#92400E;font-size:13px;">
        ⚡ <strong>Action required:</strong> Reply to this email or call <a href="tel:${data.phone || "+918883389766"}" style="color:#D4AF37;">${data.phone || "+91 8883389766"}</a> to follow up.
      </p>
    </div>
  `;

  return sendMail({
    to: ADMIN_EMAIL,
    subject: `[RD Engineering] New Inquiry from ${data.name}`,
    html: emailShell("New Contact Inquiry", body),
  });
}

export async function sendQuoteEmail(data: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  description: string;
  budget?: string;
  timeline?: string;
}) {
  const rows = [
    infoRow("Name", data.name),
    infoRow("Email", data.email, `mailto:${data.email}`),
    infoRow("Phone", data.phone, `tel:${data.phone}`),
    infoRow("Service", data.service),
    data.company ? infoRow("Company", data.company) : "",
    data.budget ? infoRow("Budget", data.budget) : "",
    data.timeline ? infoRow("Timeline", data.timeline) : "",
  ].join("");

  const body = `
    <h2 style="margin:0 0 20px;color:#0A1628;font-size:18px;font-weight:700;">New Quote Request</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
    <div style="margin-top:24px;background:#F8FAFC;border-left:4px solid #D4AF37;border-radius:0 8px 8px 0;padding:20px;">
      <h3 style="margin:0 0 10px;color:#0A1628;font-size:14px;font-weight:700;">Project Requirements:</h3>
      <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;white-space:pre-line;">${data.description}</p>
    </div>
    <div style="margin-top:24px;background:#FFFBEB;border:1px solid #FCD34D;border-radius:8px;padding:16px;">
      <p style="margin:0;color:#92400E;font-size:13px;">
        ⚡ <strong>Action required:</strong> Prepare a quote and reply within 48 hours.
      </p>
    </div>
  `;

  return sendMail({
    to: ADMIN_EMAIL,
    subject: `[RD Engineering] Quote Request — ${data.service} from ${data.name}`,
    html: emailShell("New Quote Request", body),
  });
}

export async function sendCareerEmail(data: {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  qualification: string;
  coverLetter?: string;
}) {
  const rows = [
    infoRow("Name", data.name),
    infoRow("Email", data.email, `mailto:${data.email}`),
    infoRow("Phone", data.phone, `tel:${data.phone}`),
    infoRow("Position", data.position),
    infoRow("Experience", data.experience),
    infoRow("Qualification", data.qualification),
  ].join("");

  const body = `
    <h2 style="margin:0 0 20px;color:#0A1628;font-size:18px;font-weight:700;">New Job Application</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
    ${data.coverLetter ? `
    <div style="margin-top:24px;background:#F8FAFC;border-left:4px solid #D4AF37;border-radius:0 8px 8px 0;padding:20px;">
      <h3 style="margin:0 0 10px;color:#0A1628;font-size:14px;font-weight:700;">Cover Letter:</h3>
      <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;white-space:pre-line;">${data.coverLetter}</p>
    </div>` : ""}
  `;

  return sendMail({
    to: ADMIN_EMAIL,
    subject: `[RD Engineering] Application — ${data.position} from ${data.name}`,
    html: emailShell("Job Application", body),
  });
}

// ─── Customer Confirmation Email ──────────────────────────────────────────────

export async function sendConfirmationEmail(
  email: string,
  name: string,
  type: "contact" | "quote" | "career"
) {
  const config = {
    contact: {
      heading: "Thank You For Reaching Out",
      message: "We have received your inquiry and will get back to you within <strong>24 hours</strong>.",
      emoji: "✉️",
    },
    quote: {
      heading: "Quote Request Received",
      message: "Our team will review your requirements and send you a detailed quotation within <strong>48 hours</strong>.",
      emoji: "📋",
    },
    career: {
      heading: "Application Received",
      message: "We have received your application and will review it carefully. We will contact you if your profile matches our requirements.",
      emoji: "👔",
    },
  }[type];

  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:48px;margin-bottom:12px;">${config.emoji}</div>
      <h2 style="margin:0;color:#0A1628;font-size:22px;font-weight:700;">${config.heading}</h2>
    </div>
    <p style="color:#334155;font-size:15px;line-height:1.7;margin:0 0 16px;">Dear <strong>${name}</strong>,</p>
    <p style="color:#334155;font-size:15px;line-height:1.7;margin:0 0 24px;">${config.message}</p>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;color:#0A1628;font-size:14px;font-weight:700;">Need immediate assistance?</p>
      <p style="margin:0;color:#334155;font-size:14px;">
        📞 Call us: <a href="tel:+918883389766" style="color:#D4AF37;font-weight:600;">+91 8883389766</a><br/>
        📧 Email: <a href="mailto:rdengineering1212@gmail.com" style="color:#D4AF37;">rdengineering1212@gmail.com</a><br/>
        💬 WhatsApp: <a href="https://wa.me/918883389766" style="color:#D4AF37;">wa.me/918883389766</a>
      </p>
    </div>
    <p style="color:#64748B;font-size:14px;line-height:1.6;margin:0;">
      Best regards,<br/>
      <strong style="color:#0A1628;">RD Engineering Team</strong><br/>
      <span style="color:#94A3B8;font-size:12px;">Tamil Nadu's Premier Industrial Engineering Partner</span>
    </p>
  `;

  return sendMail({
    to: email,
    subject: `[RD Engineering] ${config.heading}`,
    html: emailShell(config.heading, body),
  });
}
