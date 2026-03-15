import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Voon Creative AI - Dashboard",
  description: "Next-generation AI Campaign Asset Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased bg-black min-h-screen selection:bg-blue-500/30 selection:text-blue-200`}
      >
        {children}
      </body>
    </html>
  );
}

