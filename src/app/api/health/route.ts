import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/health
 *
 * Diagnostic endpoint — checks all backend services and returns their status.
 * Visit this URL after deployment to verify everything is working.
 */
export async function GET() {
  const checks: Record<string, { ok: boolean; message: string }> = {};

  // ── 1. Database ─────────────────────────────────────────────────────────────
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { ok: true, message: "Connected to PostgreSQL via Prisma" };
  } catch (err: any) {
    const hint = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")
      ? "DATABASE_URL is missing or points to localhost — set it to your Supabase connection string"
      : err?.message || "Connection failed";
    checks.database = { ok: false, message: hint };
  }

  // ── 2. Email — Resend ───────────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const resendOk =
    !!resendKey && resendKey !== "re_placeholder" && resendKey.startsWith("re_");
  checks.email_resend = {
    ok: resendOk,
    message: resendOk
      ? "RESEND_API_KEY is configured"
      : "RESEND_API_KEY is missing or placeholder — get it at https://resend.com",
  };

  // ── 3. Email — SMTP ─────────────────────────────────────────────────────────
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpOk =
    !!smtpUser &&
    !!smtpPass &&
    smtpUser !== "placeholder@gmail.com" &&
    smtpPass !== "placeholder" &&
    smtpUser.includes("@");
  checks.email_smtp = {
    ok: smtpOk,
    message: smtpOk
      ? `SMTP configured as ${smtpUser} via ${process.env.SMTP_HOST || "smtp.gmail.com"}`
      : "SMTP_USER and/or SMTP_PASS not configured — use Gmail App Password",
  };

  // ── 4. WhatsApp ─────────────────────────────────────────────────────────────
  const waToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const waRecipient = process.env.WHATSAPP_ADMIN_RECIPIENT_NUMBER;
  const waOk =
    !!waToken &&
    waToken !== "your_meta_whatsapp_access_token" &&
    !!waPhoneId &&
    waPhoneId !== "your_whatsapp_phone_number_id";
  checks.whatsapp = {
    ok: waOk,
    message: waOk
      ? `Configured. Phone ID: ${waPhoneId}, Recipient: ${waRecipient || "918883389766"}`
      : "Missing: WHATSAPP_ACCESS_TOKEN and/or WHATSAPP_PHONE_NUMBER_ID — see https://developers.facebook.com/docs/whatsapp/cloud-api/get-started",
  };

  // ── 5. Admin credentials ────────────────────────────────────────────────────
  const jwtOk = !!process.env.JWT_SECRET && process.env.JWT_SECRET !== "dev-jwt-secret-change-in-production";
  checks.admin_jwt = {
    ok: jwtOk,
    message: jwtOk
      ? "JWT_SECRET is set"
      : "JWT_SECRET is missing or using dev default — generate with: openssl rand -hex 32",
  };

  // ── Summary ─────────────────────────────────────────────────────────────────
  const criticalOk = checks.database.ok;
  const emailOk = checks.email_resend.ok || checks.email_smtp.ok;
  const allOk = criticalOk && emailOk && checks.whatsapp.ok && checks.admin_jwt.ok;

  const status = allOk ? 200 : 503;
  const missing = Object.entries(checks)
    .filter(([, v]) => !v.ok)
    .map(([k, v]) => ({ service: k, issue: v.message }));

  return NextResponse.json(
    {
      status: allOk ? "✅ All systems operational" : "⚠️  Some services need configuration",
      timestamp: new Date().toISOString(),
      summary: {
        database: checks.database.ok ? "✅" : "❌",
        email: emailOk ? "✅" : "❌",
        whatsapp: checks.whatsapp.ok ? "✅" : "❌ (optional)",
        admin: checks.admin_jwt.ok ? "✅" : "⚠️",
      },
      details: checks,
      ...(missing.length > 0 && { action_required: missing }),
    },
    { status }
  );
}
