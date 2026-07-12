import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteSchema } from "@/lib/validations";
import { sendQuoteEmail, sendConfirmationEmail } from "@/lib/email";
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

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed. Please check your inputs.", errors: parsed.error.errors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // ── 2. Database: Rate Limit + Duplicate Check + Save ───────────────────────
  let quoteId = `no-db-${Date.now()}`;
  let dbSaved = false;

  try {
    // Rate Limiting: max 5 submissions per IP per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const ipCount = await prisma.quote.count({
      where: { ip, createdAt: { gte: oneHourAgo } },
    });

    if (ipCount >= 5) {
      return NextResponse.json(
        { message: "Too many submissions from your IP. Please try again in an hour." },
        { status: 429 }
      );
    }

    // Duplicate Prevention: same email+description within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existing = await prisma.quote.findFirst({
      where: { email: data.email, description: data.description, createdAt: { gte: fiveMinutesAgo } },
    });

    if (existing) {
      return NextResponse.json(
        { message: "We already received this quote request. Please wait a few minutes before submitting again." },
        { status: 409 }
      );
    }

    // Save
    const saved = await prisma.quote.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        service: data.service,
        description: data.description,
        budget: data.budget || null,
        timeline: data.timeline || null,
        browser: userAgent,
        ip,
        status: "pending",
      },
    });

    quoteId = saved.id;
    dbSaved = true;
    console.log(`[Quote API] ✅ Saved to DB. ID: ${quoteId}`);
  } catch (dbErr: any) {
    console.error(`[Quote API] ❌ DB save failed: ${dbErr?.message || dbErr}`);
    console.warn("[Quote API] Continuing without DB save. Check DATABASE_URL in your environment.");
  }

  // ── 3. Notifications (run concurrently, await all) ─────────────────────────
  const [adminEmailResult, confirmEmailResult, waResult] = await Promise.allSettled([
    sendQuoteEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      description: data.description,
      budget: data.budget,
      timeline: data.timeline,
    }),
    sendConfirmationEmail(data.email, data.name, "quote"),
    sendWhatsAppAdminNotification(
      `📋 *New Quote Request*\n\n` +
      `*Name:* ${data.name}\n` +
      `*Email:* ${data.email}\n` +
      `*Phone:* ${data.phone}\n` +
      `*Service:* ${data.service}\n` +
      `*Budget:* ${data.budget || "—"}\n` +
      `*Timeline:* ${data.timeline || "—"}\n\n` +
      `*Details:*\n${data.description.slice(0, 500)}`
    ),
  ]);

  // Log notification results
  console.log(`[Quote API] Admin email: ${adminEmailResult.status === "fulfilled" && adminEmailResult.value.success ? "✅ sent" : "❌ failed"}`);
  console.log(`[Quote API] Customer confirmation: ${confirmEmailResult.status === "fulfilled" && confirmEmailResult.value.success ? "✅ sent" : "❌ failed"}`);
  console.log(`[Quote API] WhatsApp: ${waResult.status === "fulfilled" && waResult.value.success ? "✅ sent" : "❌ not sent"}`);

  // ── 4. Respond ─────────────────────────────────────────────────────────────
  return NextResponse.json(
    {
      message: "Quote request received! We'll send you a detailed quote within 48 hours.",
      id: quoteId,
      saved: dbSaved,
    },
    { status: 201 }
  );
}
