import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileQuickActions from '@/components/MobileQuickActions';
import LenisProvider from '@/components/LenisProvider';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SUSRUTHA Ayurvedhik Hospital | Authentic Kerala Ayurveda',
  description: 'Research-backed 40-bed authentic Kerala Ayurveda hospital campus in Trivandrum. Specialized treatments for spine, joint, skin, stroke, and lifestyle disorders.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-[#120A0B] text-[#FDFBF7] font-body selection:bg-ochre/30 selection:text-white">
        <LenisProvider>
          <Header />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
          <Footer />
          <MobileQuickActions />
        </LenisProvider>
      </body>
    </html>
  );
}

