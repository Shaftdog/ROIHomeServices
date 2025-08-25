"use client";

import { useState, useEffect } from 'react';
import ConsentBanner from './ConsentBanner';
import { hasConsent } from '@/lib/consent';

export default function ConsentManager() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Small delay to ensure proper hydration
    const timer = setTimeout(() => {
      if (!hasConsent()) {
        setShowBanner(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleBannerClose = () => {
    setShowBanner(false);
  };

  return (
    <>
      {showBanner && <ConsentBanner onPreferencesClick={handleBannerClose} />}
    </>
  );
}
