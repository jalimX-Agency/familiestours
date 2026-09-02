import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from "@/components/layout/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://familiestours.com"),
  title: "Families Tours | Luxury Desert Experiences in Morocco",
  description: "Discover authentic Agafay desert experiences with Families Tours. Camel treks, quad adventures, and luxury desert camps near Marrakech. Free transport included.",
  keywords: ["Morocco", "Agafay desert", "Marrakech desert tours", "camel trek", "quad biking", "Atlas Mountains", "family tours", "luxury travel"],
  authors: [{ name: "Families Tours" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Families Tours | Luxury Desert Experiences",
    description: "Authentic Agafay desert experiences near Marrakech with free transport. Camel treks, quad adventures, and more.",
    url: "https://familiestours.com",
    siteName: "Families Tours",
    type: "website",
    images: [
      {
        url: "https://cdn.familiestours.com/tours/camel.jpg",
        width: 1200,
        height: 630,
        alt: "Camel trek in the Agafay desert near Marrakech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Families Tours | Luxury Desert Experiences",
    description: "Authentic Agafay desert experiences near Marrakech with free transport. Camel treks, quad adventures, and more.",
    images: ["https://cdn.familiestours.com/tours/camel.jpg"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Families Tours",
  description: "Family-owned desert tour operator offering camel treks, quad adventures, and luxury camps in the Agafay desert near Marrakech, Morocco.",
  url: "https://familiestours.com",
  logo: "https://familiestours.com/logo.png",
  image: "https://cdn.familiestours.com/tours/camel.jpg",
  telephone: "+212631024326",
  email: "info@familiestours.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marrakech",
    addressCountry: "MA",
  },
  areaServed: {
    "@type": "Place",
    name: "Agafay Desert, Marrakech, Morocco",
  },
  priceRange: "150 MAD - 900 MAD",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
