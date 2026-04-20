import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartFrost - Control Inteligente para Cadena de Frío",
  description: "Sistema de monitoreo y control de temperatura para equipos de aire acondicionado y refrigeración. Tecnología IoT para cadena de frío.",
  keywords: "aire acondicionado, refrigeración, cadena de frío, IoT, control de temperatura, SmartFrost",
  authors: [{ name: "SmartFrost" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}