// Google Consent Mode V2 implementation
// This file handles consent management and Google Consent Mode integration

// Declare global gtag function
declare global {
  interface Window {
    gtag: (command: string, targetId?: string, config?: any) => void;
    dataLayer: any[];
  }
}

// Consent categories
export type ConsentCategories = {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  functionality_storage: 'granted' | 'denied';
  personalization_storage: 'granted' | 'denied';
  security_storage: 'granted' | 'denied';
};

// Default consent state (all denied except necessary)
export const defaultConsent: ConsentCategories = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted', // Usually granted for essential functionality
  personalization_storage: 'denied',
  security_storage: 'granted', // Usually granted for security
};

// Consent storage key
const CONSENT_STORAGE_KEY = 'roi_consent_preferences';
const CONSENT_VERSION = '1.0';

// Initialize Google Consent Mode V2
export const initializeConsentMode = () => {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  window.gtag = window.gtag || function() {
    window.dataLayer.push(arguments);
  };

  // Set default consent state
  window.gtag('consent', 'default', {
    ...defaultConsent,
    wait_for_update: 500, // Wait 500ms for consent banner
  });

  // Load saved preferences
  const savedConsent = getSavedConsent();
  if (savedConsent) {
    updateConsentMode(savedConsent.preferences);
  }
};

// Get saved consent from localStorage
export const getSavedConsent = (): { preferences: ConsentCategories; timestamp: number; version: string } | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error reading consent preferences:', error);
  }
  return null;
};

// Save consent preferences
export const saveConsent = (preferences: ConsentCategories) => {
  if (typeof window === 'undefined') return;
  
  try {
    const consentData = {
      preferences,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    
    // Update Google Consent Mode
    updateConsentMode(preferences);
    
    // Send consent event to GTM/GA4
    window.gtag('event', 'consent_update', {
      consent_preferences: preferences,
    });
    
  } catch (error) {
    console.error('Error saving consent preferences:', error);
  }
};

// Update Google Consent Mode
export const updateConsentMode = (preferences: ConsentCategories) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('consent', 'update', preferences);
};

// Check if consent has been given
export const hasConsent = (): boolean => {
  const saved = getSavedConsent();
  return saved !== null;
};

// Get current consent preferences
export const getConsentPreferences = (): ConsentCategories => {
  const saved = getSavedConsent();
  return saved?.preferences || defaultConsent;
};

// Accept all cookies
export const acceptAllCookies = () => {
  const allGranted: ConsentCategories = {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    functionality_storage: 'granted',
    personalization_storage: 'granted',
    security_storage: 'granted',
  };
  saveConsent(allGranted);
};

// Reject all non-essential cookies
export const rejectAllCookies = () => {
  saveConsent(defaultConsent);
};

// Update specific consent category
export const updateConsentCategory = (category: keyof ConsentCategories, value: 'granted' | 'denied') => {
  const current = getConsentPreferences();
  const updated = {
    ...current,
    [category]: value,
  };
  saveConsent(updated);
};

// Clear all consent data (for testing/reset)
export const clearConsent = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  updateConsentMode(defaultConsent);
};

// Check if specific category is granted
export const isCategoryGranted = (category: keyof ConsentCategories): boolean => {
  const preferences = getConsentPreferences();
  return preferences[category] === 'granted';
};

// Get consent summary for display
export const getConsentSummary = () => {
  const preferences = getConsentPreferences();
  const saved = getSavedConsent();
  
  return {
    hasConsented: hasConsent(),
    timestamp: saved?.timestamp || null,
    version: saved?.version || null,
    categories: {
      analytics: preferences.analytics_storage === 'granted',
      advertising: preferences.ad_storage === 'granted',
      personalization: preferences.personalization_storage === 'granted',
      functionality: preferences.functionality_storage === 'granted',
    },
    preferences,
  };
};

// Initialize consent mode when module loads (client-side only)
if (typeof window !== 'undefined') {
  initializeConsentMode();
}
