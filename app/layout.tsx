"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import { SnackbarProvider } from "notistack";

import AuthWatcher from "@/app/AuthWatcher";

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
        <Provider store={store}>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <AuthWatcher />
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none min-h-fit"></div>
            <div className="relative z-10">
              <div className="">{children}</div>
            </div>
          </SnackbarProvider>
        </Provider>
      </body>
    </html>
  );
}
