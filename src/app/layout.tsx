import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Families Tours | Luxury Desert Experiences in Morocco",
  description: "Discover authentic Moroccan desert experiences with Families Tours. Camel treks, quad adventures, and luxury desert camps. Free transport included.",
  keywords: ["Morocco", "desert tours", "camel trek", "quad biking", "Merzouga", "Sahara", "family tours", "luxury travel"],
  authors: [{ name: "Families Tours" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Families Tours | Luxury Desert Experiences",
    description: "Authentic Moroccan desert experiences with free transport. Camel treks, quad adventures, and more.",
    url: "https://familiestours.com",
    siteName: "Families Tours",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
