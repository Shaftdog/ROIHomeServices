
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { CalendlyModalProvider } from '@/contexts/calendly-modal-context';
import ConsentManager from '@/components/consent/ConsentManager';
import TrackingDebugger from '@/components/debug/TrackingDebugger';
import { OrganizationSchema, LocalBusinessSchema, WebSiteSchema } from '@/components/seo/JsonLd';

// Initialize global error handlers
if (typeof window === 'undefined') {
  import('@/lib/error-handlers').then(({ setupGlobalErrorHandlers }) => {
    setupGlobalErrorHandlers();
  });
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.roihomesvc.com'),
  title: {
    default: 'ROI Home Services | Central Florida Appraisals & Consulting',
    template: '%s | ROI Home Services',
  },
  description: 'Expert property valuations and advisory services in Central Florida. Fast, data-driven, and professional.',
  keywords: [
    'real estate appraisal',
    'property valuation',
    'Central Florida',
    'Orlando appraisal',
    'home appraisal',
    'commercial appraisal',
    'rent survey',
    'expert testimony',
    'USPAP',
  ],
  authors: [{ name: 'ROI Home Services' }],
  creator: 'ROI Home Services',
  publisher: 'ROI Home Services',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.roihomesvc.com',
    siteName: 'ROI Home Services',
    title: 'ROI Home Services | Central Florida Appraisals & Consulting',
    description: 'Expert property valuations and advisory services in Central Florida. Fast, data-driven, and professional.',
    images: [
      {
        url: '/og/default-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'ROI Home Services - Property Valuations & Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROI Home Services | Central Florida Appraisals & Consulting',
    description: 'Expert property valuations and advisory services in Central Florida. Fast, data-driven, and professional.',
    images: ['/og/default-1200x630.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://www.roihomesvc.com/feed.xml',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Google Consent Mode V2 - Initialize before GTM */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Set default consent state (all denied until user consents)
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'functionality_storage': 'granted',
                'personalization_storage': 'denied',
                'security_storage': 'granted',
                'wait_for_update': 500
              });
            `,
          }}
        />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PLG3HLD8');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Metricool Tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"c455d2d96b56fd657e476c197085e036"})});`,
          }}
        />
        {/* End Metricool Tracking */}
      </head>
      <body 
        suppressHydrationWarning={true}
        className="antialiased font-sans bg-background text-foreground flex flex-col min-h-screen"
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-PLG3HLD8"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <CalendlyModalProvider>
          <OrganizationSchema />
          <LocalBusinessSchema />
          <WebSiteSchema />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
          <ConsentManager />
          <TrackingDebugger />
        </CalendlyModalProvider>
      </body>
    </html>
  );
}

