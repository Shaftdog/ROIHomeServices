"use client";

import { useEffect } from "react";

import { getAttributionData, sendGTMEvent } from "@/lib/gtag";
import { pushEvent } from "@/lib/gtm";

/**
 * SAL-39 / SAL-48 — Deal Screen funnel page-view event.
 *
 * The landing page is a server component, so we fire the page-view from this
 * small client child on mount. Mirrors the `/book` page-view pattern: enhanced
 * `page_view` with attribution + a legacy `pushEvent` for backwards-compat.
 */
export default function DealScreenPageAnalytics() {
  useEffect(() => {
    const attributionData = getAttributionData();

    sendGTMEvent("page_view", {
      page_type: "deal_screen",
      page_location: window.location.href,
      page_title: document.title,
      page_path: "/deal-screen",
      step_name: "deal_screen_page_view",
      conversion_value: 5,
      currency: "USD",
      ...attributionData,
    });

    // Funnel-specific view event (parallels `booking_page_view`).
    sendGTMEvent("deal_screen_page_view", {
      page_type: "deal_screen",
      conversion_value: 5,
      currency: "USD",
      ...attributionData,
    });

    // Legacy event for backwards compatibility.
    pushEvent("page_view", {
      page: "/deal-screen",
      page_type: "deal_screen",
    });
  }, []);

  return null;
}
