import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { careerSchema } from "@/lib/validations";
import { sendCareerEmail, sendConfirmationEmail } from "@/lib/email";
import { sendWhatsAppAdminNotification } from "@/lib/whatsapp";

// Simple retry helper (fewer retries to avoid long waits)
async function retry<T>(fn: () => Promise<T>, retries = 2, delay = 500): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}

export async function POST(req: Request) {
  try {
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const body = await req.json();
    const validated = careerSchema.parse(body);

    let careerId = `temp-${Date.now()}`;

    // Try database operations - but don't fail the request if DB is unavailable
    try {
      // Rate Limiting: max 5 applications per IP per hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const ipCount = await prisma.career.count({
        where: { ip, createdAt: { gte: oneHourAgo } },
      });

      if (ipCount >= 5) {
        return NextResponse.json(
          { message: "Too many applications. Please try again later." },
          { status: 429 }
        );
      }

      // Duplicate Prevention: same email + position within 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const existing = await prisma.career.findFirst({
        where: {
          email: validated.email,
          position: validated.position,
          createdAt: { gte: fiveMinutesAgo },
        },
      });

      if (existing) {
        return NextResponse.json(
          {
            message:
              "We already received this application. Please wait a few minutes before submitting again.",
          },
          { status: 409 }
        );
      }

      // Save to Database
      const career = await prisma.career.create({
        data: {
          name: validated.name,
          email: validated.email,
          phone: validated.phone,
          position: validated.position,
          experience: validated.experience,
          qualification: validated.qualification,
          coverLetter: validated.coverLetter || null,
          status: "new",
        },
      });
      careerId = career.id;
    } catch (dbError: any) {
      console.error(
        "[Careers API] Database error (continuing without DB):",
        dbError?.message || dbError
      );
    }

    // Send notifications asynchronously - don't block the HTTP response
    (async () => {
      try {
        await Promise.all([
          retry(() =>
            sendCareerEmail({
              name: validated.name,
              email: validated.email,
              phone: validated.phone,
              position: validated.position,
              experience: validated.experience,
              qualification: validated.qualification,
              coverLetter: validated.coverLetter,
            })
          ),
          retry(() => sendConfirmationEmail(validated.email, validated.name, "career")),
        ]);
      } catch (emailError) {
        console.error("[Careers API] Email notification failed:", emailError);
      }

      try {
        const alertMessage = `New Job Application:\nName: ${validated.name}\nPosition: ${validated.position}\nEmail: ${validated.email}\nPhone: ${validated.phone}`;
        await sendWhatsAppAdminNotification(alertMessage);
      } catch (waError) {
        console.error("[Careers API] WhatsApp notification failed:", waError);
      }
    })();

    return NextResponse.json(
      { message: "Application submitted successfully", id: careerId },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { message: "Please check your inputs and try again.", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("[Careers API] Unexpected error:", error);
    return NextResponse.json(
      { message: "Failed to process your request. Please call us at +91 8883389766." },
      { status: 500 }
    );
  }
}
