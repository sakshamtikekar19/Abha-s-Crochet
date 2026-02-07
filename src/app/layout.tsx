import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Great_Vibes } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: "Abha's Crochet | Stitched with Love",
  description:
    'Discover our collection of premium crochet products, each piece crafted with patience, care, and the finest yarns.',
  keywords: 'handmade crochet, crochet bags, crochet flowers, custom crochet, premium yarn',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${greatVibes.variable}`}>
      <body className="font-body">
        <Navbar />
        <main className="pt-20 min-h-screen bg-[image:linear-gradient(rgba(250,248,245,0.9),rgba(250,248,245,0.9)),url('/logo.png')] bg-[length:280px_280px] bg-center bg-no-repeat bg-fixed">
        {children}
      </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
