import type { Metadata } from "next";
import { VT323, Orbitron, Roboto_Mono } from "next/font/google";
import "./globals-new.css";

// Font tanımlamaları
const vt323 = VT323({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
});

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const robotoMono = Roboto_Mono({ 
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Cosmic Oracle",
  description: "Siberpunk hikaye oluşturucu - Yapay zeka destekli hikaye oluşturucu",
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#0d011f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${vt323.variable} ${orbitron.variable} ${robotoMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0d011f" />
      </head>
      <body>{children}</body>
    </html>
  );
}