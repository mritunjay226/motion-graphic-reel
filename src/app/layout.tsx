import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vox Reel Engine — 2.5D Motion Graphic Video Studio",
  description: "High-retention 2.5D documentary video generation SaaS. Create viral motion graphic reels in under 60 seconds with cinema-grade narration, dynamic paper cutouts, and 1-click social dispatch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={` ${inter.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@700;900&family=Inter:wght@400;600;800;900&family=Montserrat:wght@700;900&family=Outfit:wght@600;800;900&family=Oswald:wght@600;700&family=Permanent+Marker&family=Space+Grotesk:wght@700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 font-sans">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
