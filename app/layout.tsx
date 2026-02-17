import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script"

const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap' });

export const metadata: Metadata = {
  title: 'ImageConvertly - Fast & Free Image Converter',
  description: 'Convert images between formats with ease. Support for JPG, PNG, WEBP, AVIF, GIF, BMP, TIFF and more. Fast, secure, and completely free.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
  
      <body className={inter.className}>
        {children}
        <Toaster />

        <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6058601145704080"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
      </body>
    </html>
  );
}
