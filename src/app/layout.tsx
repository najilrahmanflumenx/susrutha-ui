import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { WhatsAppWidget } from '@/components/navigation/WhatsAppWidget';
import { MobileStickyBar } from '@/components/navigation/MobileStickyBar';

export const metadata: Metadata = {
  title: 'Susrutha | Ancient Wisdom. Modern Healing.',
  description: 'Ultra-luxury modern Ayurvedic healthcare platform combining 55+ years of clinical excellence with personalized wellness journeys.',
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-surface text-text-primary min-h-screen flex flex-col selection:bg-gold selection:text-primary">
        <Navbar />
        <main className="flex-grow pt-24 sm:pt-28">{children}</main>
        <Footer />
        <WhatsAppWidget />
        <MobileStickyBar />
      </body>
    </html>
  );
}
