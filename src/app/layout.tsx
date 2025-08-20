
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Assuming Inter is not strictly required or Geist is preferred for starter
import './globals.css';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { CalendlyModalProvider } from '@/contexts/calendly-modal-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ROI Home Services | Central Florida Appraisals & Consulting',
  description: 'Expert property valuations and advisory services in Central Florida. Fast, data-driven, and professional.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body 
        suppressHydrationWarning={true}
        className="antialiased font-sans bg-background text-foreground flex flex-col min-h-screen"
      >
        <CalendlyModalProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </CalendlyModalProvider>
      </body>
    </html>
  );
}

