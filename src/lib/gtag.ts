// Enhanced Google Analytics 4 utility functions for GTM integration with Consent Mode V2

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId?: string, config?: any) => void;
    dataLayer: any[];
  }
}

// GA4 Measurement ID (if using direct GA4 instead of GTM)
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Extract UTM parameters and attribution data
export const getAttributionData = () => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmTerm = urlParams.get('utm_term');
  const utmContent = urlParams.get('utm_content');
  const gclid = urlParams.get('gclid');
  
  return {
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_term: utmTerm,
    utm_content: utmContent,
    gclid: gclid,
    traffic_source: utmSource || (gclid ? 'google-ads' : 'direct'),
    is_paid_traffic: !!(gclid || (utmSource && utmMedium === 'cpc')),
    page_referrer: typeof document !== 'undefined' ? document.referrer : null
  };
};

// Send custom event to GA4 via GTM dataLayer with enhanced attribution
export const sendGTMEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    const attributionData = getAttributionData();
    
    window.dataLayer.push({
      event: eventName,
      ...attributionData,
      ...parameters,
    });
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('GTM Event Sent:', {
        event: eventName,
        attribution: attributionData,
        parameters,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Track Google Ads conversions specifically
export const trackAdsConversion = (conversionId: string, value?: number, currency: string = 'USD') => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    const attributionData = getAttributionData();
    
    window.dataLayer.push({
      event: 'ads_conversion',
      conversion_id: conversionId,
      conversion_value: value || 0,
      currency: currency,
      ...attributionData
    });
  }
};

// Send purchase event to GA4
export const sendPurchaseEvent = (orderData: {
  transactionId: string;
  value: number;
  currency?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    category?: string;
    quantity?: number;
    price?: number;
  }>;
}) => {
  sendGTMEvent('New_Order', {
    transaction_id: orderData.transactionId,
    value: orderData.value,
    currency: orderData.currency || 'USD',
    items: orderData.items || [],
    // Additional ecommerce parameters
    ecommerce: {
      transaction_id: orderData.transactionId,
      value: orderData.value,
      currency: orderData.currency || 'USD',
      items: orderData.items || [],
    },
  });
  
  // Also send to console for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('GA4 Purchase Event Sent:', {
      event: 'New_Order',
      transaction_id: orderData.transactionId,
      value: orderData.value,
      currency: orderData.currency || 'USD',
      items: orderData.items,
    });
  }
};

// Generic event tracking
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  sendGTMEvent(eventName, parameters);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('GA4 Event Sent:', { event: eventName, ...parameters });
  }
};

// Page view tracking (if needed)
export const trackPageView = (url: string, title?: string) => {
  sendGTMEvent('page_view', {
    page_location: url,
    page_title: title || document.title,
  });
};

// Booking-specific events
export const trackBookingStep = (stepName: string, stepNumber: number) => {
  trackEvent('booking_step_completed', {
    step_name: stepName,
    step_number: stepNumber,
  });
};

export const trackAppraisalScheduled = (appointmentData: {
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  value: number;
}) => {
  trackEvent('appraisal_scheduled', {
    appointment_date: appointmentData.appointmentDate,
    appointment_time: appointmentData.appointmentTime,
    service_type: appointmentData.serviceType,
    value: appointmentData.value,
  });
};
