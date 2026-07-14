import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { sendContactEmail, sendConfirmationEmail } from "@/lib/email";
import { sendWhatsAppAdminNotification } from "@/lib/whatsapp";

export async function POST(req: Request) {
  const userAgent = req.headers.get("user-agent") || "Unknown";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  // ── 1. Parse & Validate ────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON in request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed. Please check your inputs.", errors: parsed.error.errors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // ── 2. Database: Rate Limit + Duplicate Check + Save ───────────────────────
  let contactId = `no-db-${Date.now()}`;
  let dbSaved = false;

  try {
    // Rate Limiting: max 5 submissions per IP per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const ipCount = await prisma.contact.count({
      where: { ip, createdAt: { gte: oneHourAgo } },
    });

    if (ipCount >= 5) {
      return NextResponse.json(
        { message: "Too many submissions from your IP. Please try again in an hour." },
        { status: 429 }
      );
    }

    // Duplicate Prevention: same email+message within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existing = await prisma.contact.findFirst({
      where: { email: data.email, message: data.message, createdAt: { gte: fiveMinutesAgo } },
    });

    if (existing) {
      return NextResponse.json(
        { message: "We already received this message. Please wait a few minutes before sending again." },
        { status: 409 }
      );
    }

    // Save
    const saved = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service || null,
        message: data.message,
        browser: userAgent,
        ip,
        status: "unread",
      },
    });

    contactId = saved.id;
    dbSaved = true;
    console.log(`[Contact API] ✅ Saved to DB. ID: ${contactId}`);
  } catch (dbErr: any) {
    console.error(`[Contact API] ❌ DB save failed:`, dbErr);
    return NextResponse.json(
      { message: "Failed to process your request. Please try again later." },
      { status: 500 }
    );
  }

  // ── 3. Notifications (run concurrently, await all) ─────────────────────────
  const [adminEmailResult, confirmEmailResult, waResult] = await Promise.allSettled([
    sendContactEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      message: data.message,
    }),
    sendConfirmationEmail(data.email, data.name, "contact"),
    sendWhatsAppAdminNotification(
      `🔔 *New Contact Inquiry*\n\n` +
      `*Name:* ${data.name}\n` +
      `*Email:* ${data.email}\n` +
      `*Phone:* ${data.phone || "—"}\n` +
      `*Service:* ${data.service || "General"}\n\n` +
      `*Message:*\n${data.message.slice(0, 500)}`
    ),
  ]);

  // Log notification results
  console.log(`[Contact API] Admin email: ${adminEmailResult.status === "fulfilled" && adminEmailResult.value.success ? "✅ sent" : "❌ failed"}`);
  console.log(`[Contact API] Customer confirmation: ${confirmEmailResult.status === "fulfilled" && confirmEmailResult.value.success ? "✅ sent" : "❌ failed"}`);
  console.log(`[Contact API] WhatsApp: ${waResult.status === "fulfilled" && waResult.value.success ? "✅ sent" : "❌ not sent"}`);

  // ── 4. Respond ─────────────────────────────────────────────────────────────
  return NextResponse.json(
    {
      message: "Message received! We'll get back to you within 24 hours.",
      id: contactId,
      saved: dbSaved,
    },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
