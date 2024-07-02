import type { Metadata } from "next";
import { Inter, Josefin_Sans, Comfortaa, Fira_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-serif",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fira = Fira_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Yash Kadam",
  description: "Portfolio of Yash Kadam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          josefinSans.variable,
          comfortaa.variable,
          fira.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
