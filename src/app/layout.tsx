import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NextUIProvider } from "@nextui-org/react";
import { Inter, Noto_Serif } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "DineSphere Admin",
  description: "Powered by EWB IT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>NBM</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="https://restaurants-portal.s3.us-east-1.amazonaws.com/DineSphere.png"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={`${inter.className} ${notoSerif.variable}`}>
        <SessionProvider>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
