import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/QueryProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import BackToTop from "@/components/BackToTop";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Toaster } from "react-hot-toast";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RD Engineering | Industrial Steel Fabrication & Construction",
    template: "%s | RD Engineering",
  },
  description:
    "RD Engineering — industrial steel fabrication, roofing systems, pipeline work, machining, and structural construction. Established 2010. Serving industrial clients across Tamil Nadu.",
  keywords: [
    "steel fabrication",
    "roof structure",
    "industrial engineering",
    "pipeline work",
    "machining work",
    "puff panel partition",
    "aluminium partition",
    "false ceiling",
    "painting works",
    "RD Engineering",
    "Kadambathur",
    "Tamil Nadu",
    "industrial construction",
  ],
  authors: [{ name: "RD Engineering" }],
  creator: "RD Engineering",
  publisher: "RD Engineering",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "RD Engineering",
    title: "RD Engineering | Industrial Steel Fabrication & Construction",
    description:
      "Premier industrial engineering company in Tamil Nadu. Specializing in steel fabrication, roof structures, and industrial construction.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RD Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RD Engineering | Industrial Steel Fabrication & Construction",
    description:
      "Premier industrial engineering company in Tamil Nadu. Specializing in steel fabrication, roof structures, and industrial construction.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${manrope.variable} font-body antialiased`}
      >
        <QueryProvider>
          <ScrollProgressBar />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <BackToTop />
          <FloatingWhatsApp />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#0A1628",
                color: "#F8FAFC",
                border: "1px solid rgba(212, 175, 55, 0.3)",
              },
              success: {
                iconTheme: {
                  primary: "#D4AF37",
                  secondary: "#0A1628",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#0A1628",
                },
              },
            }}
          />

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EngineeringOrganization",
                name: "RD Engineering",
                description:
                  "Premier industrial engineering company specializing in steel fabrication, roof structures, and industrial construction.",
                url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                telephone: "+918883389766",
                email: "rdengineering1212@gmail.com",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "4/372 Nehru Street, Dr Ambedkar Nagar",
                  addressLocality: "Kadambathur",
                  addressRegion: "Tamil Nadu",
                  addressCountry: "IN",
                },
                founder: {
                  "@type": "Person",
                  name: "RD Engineering",
                },
                foundingDate: "2010",
                areaServed: "Tamil Nadu",
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Engineering Services",
                  itemListElement: [
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Steel Fabrication" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Roof Structure & Sheet Work" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pipeline Work" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Air Line Work" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Machining Work" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Puff Panel Partition" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Aluminium Partition" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "False Ceiling" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Painting Works" } },
                  ],
                },
              }),
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
