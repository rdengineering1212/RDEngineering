import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = process.env.ADMIN_PASSWORD_HASH || hashPassword("admin123");
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "rdengineering1212@gmail.com",
      password: adminPassword,
      role: "admin",
    },
  });

  // Seed services
  const services = [
    { title: "Steel Fabrication", slug: "steel-fabrication", description: "Custom steel structures, beams, columns, and industrial frameworks fabricated to exact specifications.", icon: "Building2", benefits: ["High strength-to-weight ratio", "Custom designs", "Rapid installation"], applications: ["Factory buildings", "Industrial sheds", "Mezzanine floors"], process: ["Requirement Analysis", "Design", "Fabrication", "Erection"], featured: true, order: 1 },
    { title: "Roof Structure & Sheet Work", slug: "roof-structure-sheet-work", description: "Complete industrial roofing solutions including PEB structures and metal sheet roofing.", icon: "Warehouse", benefits: ["Weather-resistant", "Energy-efficient", "Quick installation"], applications: ["Factory roofs", "Warehouse roofing", "Commercial roofs"], process: ["Assessment", "Design", "Installation", "Finishing"], featured: true, order: 2 },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }

  // Seed clients
  const clients = [
    { name: "L.S Automotive India Pvt Ltd", industry: "Automotive", featured: true, order: 1 },
    { name: "Daeseung Autoparts India Pvt Ltd", industry: "Automotive", featured: true, order: 2 },
    { name: "Duck Woo Auto India Pvt Ltd", industry: "Automotive", featured: true, order: 3 },
    { name: "Competition Team Technology India Pvt Ltd", industry: "Technology", featured: true, order: 4 },
    { name: "VTK Industries", industry: "Manufacturing", featured: true, order: 5 },
    { name: "ILGAHNG Automotive India Pvt Ltd", industry: "Automotive", featured: true, order: 6 },
    { name: "IHD Industries Pvt Ltd", industry: "Manufacturing", featured: true, order: 7 },
  ];

  for (const client of clients) {
    await prisma.client.create({ data: client });
  }

  // Seed FAQs
  const faqs = [
    { question: "What services does RD Engineering offer?", answer: "We offer 9 service categories including Steel Fabrication, Roof Structure, Pipeline Work, Air Line Work, Machining Work, Puff Panel Partition, Aluminium Partition, False Ceiling, and Painting Works.", category: "General", order: 1 },
    { question: "How do I request a quote?", answer: "You can request a quote through our online form, call us at +91 8883389766, or email us.", category: "Services", order: 2 },
    { question: "What industries do you serve?", answer: "We primarily serve automotive, manufacturing, and industrial sectors.", category: "General", order: 3 },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
