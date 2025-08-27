import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/context/useLanguage";
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
  title: "AgriCalendar - Calendario de Eventos del Sector Avícola",
  description:
    "Descubre los próximos eventos, ferias y congresos del sector avícola mundial. Tu calendario completo de eventos para profesionales de la industria avícola.",
  keywords:
    "eventos avícolas, ferias avicultura, congresos pollo, sector avícola, calendario eventos",
  openGraph: {
    title: "AgriCalendar - Eventos del Sector Avícola",
    description:
      "Tu calendario completo de eventos para profesionales de la industria avícola",
    type: "website",
    locale: "es_ES",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
