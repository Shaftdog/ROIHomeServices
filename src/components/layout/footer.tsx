
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ConsentBanner from "@/components/consent/ConsentBanner";

const serviceRegions = [
  { name: 'Central Florida', slug: 'central-florida' },
  { name: 'Tampa Bay', slug: 'tampa-bay' },
  { name: 'South Florida', slug: 'south-florida' },
  { name: 'First Coast', slug: 'first-coast' },
  { name: 'Space Coast', slug: 'space-coast' },
  { name: 'Treasure Coast', slug: 'treasure-coast' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  const handleCookiePreferencesClick = () => {
    setShowConsentBanner(true);
  };

  const handleBannerClose = () => {
    setShowConsentBanner(false);
  };

  return (
    <>
    <footer className="bg-deep-charcoal text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-1">
             <Link href="/" className="inline-block mb-4">
              <Image
                src="/Logo.png"
                alt="ROI Home Services Logo"
                width={80}
                height={80}
              />
            </Link>
            <p className="text-sm text-slate-300">
              Your partner in property valuation, market insights, and strategic real estate solutions.
            </p>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-medium mb-2 text-slate-200">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link href="/offerings" className="text-sm text-slate-300 hover:text-highlight transition-colors">Offerings</Link></li>
              <li><Link href="/about" className="text-sm text-slate-300 hover:text-highlight transition-colors">About Us</Link></li>
               <li><Link href="/case-studies" className="text-sm text-slate-300 hover:text-highlight transition-colors">Case Studies</Link></li>
              <li><Link href="/insights" className="text-sm text-slate-300 hover:text-highlight transition-colors">Insights</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-300 hover:text-highlight transition-colors">Contact</Link></li>
              <li><Link href="/feed.xml" className="text-sm text-slate-300 hover:text-highlight transition-colors">RSS Feed</Link></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="text-lg font-medium mb-2 text-slate-200">Service Regions</h4>
            <ul className="space-y-1">
              {serviceRegions.map((region) => (
                <li key={region.slug}>
                  <Link
                    href={`/florida-appraisals/${region.slug}`}
                    className="text-sm text-slate-300 hover:text-highlight transition-colors"
                  >
                    {region.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/florida-appraisals"
                  className="text-sm text-highlight hover:text-highlight/80 transition-colors font-medium"
                >
                  View All Regions
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="text-lg font-medium mb-2 text-slate-200">Legal</h4>
            <ul className="space-y-1">
              <li><Link href="/privacy" className="text-sm text-slate-300 hover:text-highlight transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-300 hover:text-highlight transition-colors">Terms of Service</Link></li>
              <li><Link href="/accessibility" className="text-sm text-slate-300 hover:text-highlight transition-colors">Accessibility Statement</Link></li>
              <li>
                <button
                  onClick={handleCookiePreferencesClick}
                  className="text-sm text-slate-300 hover:text-highlight transition-colors cursor-pointer text-left"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>
           <div className="md:col-span-1">
            <h4 className="text-lg font-medium mb-2 text-slate-200">Contact Us</h4>
            <address className="not-italic text-sm text-slate-300 space-y-1">
              <p>100 E Pine St., #110</p>
              <p>Orlando, FL 32801</p>
              <p>
                <a href="tel:407-759-3611" className="hover:text-highlight transition-colors">
                  407-759-3611
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-slate-700 text-center">
          <p className="text-sm text-slate-400">
            © {currentYear} ROI Home Services. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
    {showConsentBanner && (
      <ConsentBanner onPreferencesClick={handleBannerClose} />
    )}
    </>
  );
}
