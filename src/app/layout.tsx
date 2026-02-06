import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoGenAI - Enterprise ESG Analytics",
  description: "Real-time carbon footprint tracking for Generative AI",
};

import AppShell from '@/components/layout/AppShell';
import Providers from '@/components/Providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-navy-900`}
      >
        <Providers>
            <AppShell>
               {children}
            </AppShell>
        </Providers>
      </body>
    </html>
  );
}
