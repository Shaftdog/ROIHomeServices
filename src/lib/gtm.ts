// GTM helper for safe event tracking
export function pushEvent(name: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  // Initialize dataLayer if it doesn't exist
  (window as any).dataLayer = (window as any).dataLayer || [];
  
  // Push event to dataLayer
  (window as any).dataLayer.push({ 
    event: name, 
    ...(params || {}) 
  });
  
  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('GTM Event Pushed:', { event: name, ...params });
  }
}
