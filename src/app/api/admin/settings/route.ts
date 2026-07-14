import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  companyName: "RD Engineering",
  phone: "8883389766",
  email: "info@rdengineering.in",
  whatsapp: "8883389766",
  address: "No. 12, Industrial Area, Chennai, Tamil Nadu",
  mapLink: "https://maps.google.com",
  logoUrl: "",
  heroTitle: "Premium Engineering Solutions",
  heroSubtitle: "Building the infrastructure of tomorrow with precision fabrication and industrial expertise.",
  stat1_label: "Projects Completed",
  stat1_value: "150+",
  stat2_label: "Experienced Engineers",
  stat2_value: "45+",
  stat3_label: "Corporate Clients",
  stat3_value: "80+",
  stat4_label: "Years of Excellence",
  stat4_value: "15+",
  facebook: "https://facebook.com/rdengineering",
  linkedin: "https://linkedin.com/company/rdengineering",
  instagram: "https://instagram.com/rdengineering",
};

export async function GET() {
  try {
    const dbSettings = await prisma.setting.findMany();
    
    // Convert array to key-value map
    const settingsMap: Record<string, string> = {};
    dbSettings.forEach((item: any) => {
      settingsMap[item.key] = item.value;
    });

    // Merge with defaults
    const finalSettings = { ...DEFAULT_SETTINGS, ...settingsMap };
    return NextResponse.json(finalSettings);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error loading settings", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // body should be a key-value record
    const updates = Object.entries(body);
    
    // Execute upserts in transaction
    const results = await prisma.$transaction(
      updates.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    );

    // Reconstruct the response map
    const responseMap: Record<string, string> = {};
    results.forEach((item: any) => {
      responseMap[item.key] = item.value;
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: { ...DEFAULT_SETTINGS, ...responseMap },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating settings", error: error.message },
      { status: 500 }
    );
  }
}
