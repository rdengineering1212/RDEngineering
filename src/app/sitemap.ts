import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const routes = [
    "", "/about", "/services", "/services/steel-fabrication", "/services/roof-structure-sheet-work",
    "/services/pipeline-work", "/services/air-line-work", "/services/machining-work",
    "/services/puff-panel-partition", "/services/aluminium-partition", "/services/false-ceiling",
    "/services/painting-works", "/projects", "/clients", "/machinery", "/team",
    "/careers", "/blog", "/faq", "/contact", "/quote", "/privacy-policy", "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
