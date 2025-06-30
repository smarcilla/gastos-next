import type { Metadata } from "next";
import type { ReactNode } from "react";
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
  title: "Gastos-Next",
  description: "MVP para registrar y analizar gastos",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* 1️⃣ Añadimos ambas variables y la clase tailwind "font-sans" */}
      <body className="font-sans antialiased bg-white text-neutral-900">
        {/* 2️⃣ ¡Renderizamos los hijos! */}
        {children}
      </body>
    </html>
  );
}
