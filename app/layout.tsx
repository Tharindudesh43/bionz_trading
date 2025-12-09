"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Footer from "@/components/footer";
import { Provider } from "react-redux";
import { store } from "../src/store/store";

import AuthWatcher from "@/app/AuthWatcher";
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
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Changa:wght@200..800&family=Permanent+Marker&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Varela+Round&display=swap" rel="stylesheet"/>
      </head>
      
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
          <AuthWatcher />

          {/* BACKGROUND LAYER */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none min-h-fit"></div>

          {/* MAIN CONTENT */}
          <div className="relative z-10">
            <MainNavaBar />

            {/* IMPORTANT: Add padding-top so content does NOT hide under navbar */}
            <div className="">
              {children}
            </div>

            <WhatsAppFloat />
            <Footer />
          </div>
        </Provider>
      </body>
    </html>
  );
}
