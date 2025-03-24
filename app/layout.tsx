"use client";
import "@ungap/with-resolvers";
import "globalthis/auto";
import { Urbanist } from "next/font/google";
import Navbar from "./_components/UIOverlay/Navbar";
import "./globals.css";
import "./polyfills";
import ActiveComponentProvider from "./providers/ActiveComponentProvider";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  weight: ["400", "500", "600", "700", "800"],
});

// export const metadata: Metadata = {
//   title: "AB Medica",
//   description: "AB Medica",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>AB Medica</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="AB Medica" />
        <meta name="keywords" content="AB Medica" />
        <meta name="author" content="AB Medica" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="notranslate" />
        <meta name="theme-color" content="#012e87" />
        <meta name="msapplication-navbutton-color" content="#012e87" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#012e87" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AB Medica" />
      </head>
      <body className={`${urbanist.className} antialiased min-h-screen h-full w-full bg-red-50`}>
        <ActiveComponentProvider>
          <Navbar />
          {children}
        </ActiveComponentProvider>
      </body>
    </html>
  );
}
