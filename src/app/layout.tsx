import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from 'next/image';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
  <body className={`${geistSans.variable} ${geistMono.variable}`}>
    <header className="main-header">
      <Image
        src="/icons/wallet.svg"
        alt="Wallet Icon"
        width={32}
        height={32}
        className="main-header-icon"
      />
      <span className="main-header-title">BANCO</span>
    </header>

    <main>
      {children}
    </main>
  </body>
</html>

  );
}
