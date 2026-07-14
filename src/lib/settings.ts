import { prisma } from "./prisma";

export async function getSettings() {
  const defaults: Record<string, string> = {
    companyName: "RD Engineering",
    companyEmail: "rdengineering1212@gmail.com",
    companyPhone: "8883389766",
    companyWhatsapp: "918883389766",
    companyAddress: "No.4/372, Nehru Street, Ambedkar Nagar, Kadambathur, Tiruvallur, Tamil Nadu 631209",
    googleMapsLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.5451631527715!2d79.82772591482229!3d13.128522690753066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5291deb1eb4cff%3A0xb76184061c882d4c!2sRD+ENGINEERING!5e0!3m2!1sen!2sin!4v1783763063456",
    facebookLink: "https://facebook.com/rdengineering",
    linkedinLink: "https://linkedin.com/company/rdengineering",
    instagramLink: "https://instagram.com/rdengineering",
    heroTitle: "Engineering Precision. Building Excellence.",
    heroSubtitle: "Delivering high-quality steel fabrication, industrial construction, roofing, pipeline systems, and structural engineering solutions — with precision, reliability, and uncompromising workmanship.",
    heroYear: "2010",
    statProjects: "500+",
    statServices: "9",
    statClients: "50+",
    statYears: "15+",
    aboutTitle: "Built on Consistent Delivery",
    aboutText: "RD Engineering was established in 2010 with a straightforward objective — to deliver reliable steel fabrication and industrial construction services to clients who value precision and accountability. Over 15 years, we have grown steadily, adding capabilities in roofing systems, pipeline work, air line installation, machining, partitioning, and finishing works.",
    footerText: "Your trusted partner in industrial engineering solutions.",
    seoTitle: "RD Engineering - Industrial Steel Fabrication & Construction Services",
    seoDescription: "RD Engineering delivers premier industrial engineering, steel fabrication, PEB structures, pipeline installation, and industrial roofing in Tamil Nadu.",
  };

  try {
    const dbSettings = await prisma.setting.findMany();
    const settingsObj: Record<string, string> = { ...defaults };
    dbSettings.forEach((s: any) => {
      // Map admin settings keys to public website keys
      if (s.key === "phone") settingsObj["companyPhone"] = s.value;
      else if (s.key === "email") settingsObj["companyEmail"] = s.value;
      else if (s.key === "whatsapp") settingsObj["companyWhatsapp"] = s.value;
      else if (s.key === "address") settingsObj["companyAddress"] = s.value;
      else if (s.key === "mapLink") settingsObj["googleMapsLink"] = s.value;
      else if (s.key === "facebook") settingsObj["facebookLink"] = s.value;
      else if (s.key === "linkedin") settingsObj["linkedinLink"] = s.value;
      else if (s.key === "instagram") settingsObj["instagramLink"] = s.value;
      else if (s.key === "stat1_value") {
        settingsObj["statYears"] = s.value;
        // Also extract numeric year if possible or fallback to 2010
        const yearsNum = parseInt(s.value) || 15;
        settingsObj["heroYear"] = String(new Date().getFullYear() - yearsNum);
      }
      else if (s.key === "stat2_value") settingsObj["statProjects"] = s.value;
      else if (s.key === "stat3_value") settingsObj["statClients"] = s.value;
      else if (s.key === "stat4_value") settingsObj["statServices"] = s.value;
      else settingsObj[s.key] = s.value;
    });

    // Ensure googleMapsLink is a valid embed URL, otherwise fallback to the real RD Engineering location
    const mapUrl = settingsObj["googleMapsLink"] || "";
    if (!mapUrl.includes("/embed") || mapUrl.includes("maps.app.goo.gl")) {
      settingsObj["googleMapsLink"] = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.5451631527715!2d79.82772591482229!3d13.128522690753066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5291deb1eb4cff%3A0xb76184061c882d4c!2sRD+ENGINEERING!5e0!3m2!1sen!2sin!4v1783763063456";
    }

    return settingsObj;
  } catch (error) {
    console.error("Prisma setting fetch failed. Using defaults:", error);
    return defaults;
  }
}
