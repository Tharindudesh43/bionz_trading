"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Footer from "@/components/footer";
import MainNavaBar from "@/components/MainNavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Changa:wght@200..800&family=Permanent+Marker&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Varela+Round&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none min-h-fit"></div>
        <div className="relative z-10">
          <MainNavaBar />
          <div className="">{children}</div>
          <WhatsAppFloat />
          <Footer />
        </div>
      </body>
    </html>
  );
}
  