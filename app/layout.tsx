import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/UIOverlay/Navbar";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AB Medica",
  description: "AB Medica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.className} antialiased min-h-screen h-full w-full bg-red-50`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
