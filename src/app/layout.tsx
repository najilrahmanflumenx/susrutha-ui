import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileQuickActions from '@/components/MobileQuickActions';

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
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-sus-cream text-sus-ink font-body">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileQuickActions />
      </body>
    </html>
  );
}
