import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';
import BabyDecorative3D from '../components/BabyDecorative3D';
import { fetchSettings } from '../lib/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Kiddy Closet — Modern Baby Clothing Catalogue | Little Styles, Big Smiles',
  description:
    'Discover handcrafted luxury baby boy and girl clothing. Age-wise transparent pricing, organic fabrics, and personal concierge enquiries directly on WhatsApp.',
  keywords: [
    'baby clothing',
    'baby fashion catalogue',
    'baby boy rompers',
    'baby girl frocks',
    'newborn organic clothes',
    'baby partywear',
    'kiddy closet',
  ],
  openGraph: {
    title: 'Kiddy Closet — Modern Baby Clothing Catalogue',
    description: 'Little Styles, Big Smiles — Handcrafted Luxury Baby Fashion',
    url: 'https://kiddycloset.com',
    siteName: 'Kiddy Closet',
    images: [
      {
        url: '/images/hero-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Kiddy Closet Baby Fashion',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await fetchSettings();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col relative selection:bg-baby-pink selection:text-charcoal-900">
        <BabyDecorative3D />
        <Navbar whatsappNumber={settings.whatsappNumber} />
        <main className="flex-grow relative z-10">{children}</main>
        <Footer
          whatsappNumber={settings.whatsappNumber}
          email={settings.email}
          phone={settings.phone}
          address={settings.address}
        />
        <WhatsAppFloatingButton
          whatsappNumber={settings.whatsappNumber}
          businessName={settings.businessName}
        />
      </body>
    </html>
  );
}
