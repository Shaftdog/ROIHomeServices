"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Settings, Shield, BarChart3, Target, User } from 'lucide-react';
import {
  hasConsent,
  acceptAllCookies,
  rejectAllCookies,
  saveConsent,
  getConsentPreferences,
  type ConsentCategories,
} from '@/lib/consent';

interface ConsentBannerProps {
  onPreferencesClick?: () => void;
}

export default function ConsentBanner({ onPreferencesClick }: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentCategories>({
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
  });

  useEffect(() => {
    // Show banner if no consent has been given
    if (!hasConsent()) {
      setIsVisible(true);
    }
    
    // Load current preferences
    setPreferences(getConsentPreferences());
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setIsVisible(false);
  };

  const handleCategoryChange = (category: keyof ConsentCategories, granted: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: granted ? 'granted' : 'denied',
    }));
  };

  const handleClose = () => {
    // If user closes without action, apply current preferences (default deny)
    saveConsent(preferences);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-primary">Cookie Preferences</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            <p className="text-muted-foreground">
              We use cookies to enhance your experience, analyze site traffic, and provide personalized content. 
              You can choose which types of cookies to allow.
            </p>

            {/* Quick Actions */}
            {!showDetails && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAcceptAll} className="flex-1">
                  Accept All Cookies
                </Button>
                <Button onClick={handleRejectAll} variant="outline" className="flex-1">
                  Reject Non-Essential
                </Button>
                <Button 
                  onClick={() => setShowDetails(true)} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Customize
                </Button>
              </div>
            )}

            {/* Detailed Preferences */}
            {showDetails && (
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Customize Your Preferences</h3>
                
                {/* Essential Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Essential Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Required for basic site functionality and security
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-green-600 font-medium">Always On</div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Analytics Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Help us understand how visitors use our website
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics_storage === 'granted'}
                        onChange={(e) => handleCategoryChange('analytics_storage', e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">Allow</span>
                    </label>
                  </div>
                </div>

                {/* Advertising Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-orange-600" />
                      <div>
                        <h4 className="font-medium">Advertising Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Used to show relevant ads and measure campaign effectiveness
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.ad_storage === 'granted' && preferences.ad_user_data === 'granted'}
                        onChange={(e) => {
                          handleCategoryChange('ad_storage', e.target.checked);
                          handleCategoryChange('ad_user_data', e.target.checked);
                          handleCategoryChange('ad_personalization', e.target.checked);
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">Allow</span>
                    </label>
                  </div>
                </div>

                {/* Personalization Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Personalization Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Remember your preferences and provide personalized content
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.personalization_storage === 'granted'}
                        onChange={(e) => handleCategoryChange('personalization_storage', e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">Allow</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button onClick={handleSavePreferences} className="flex-1">
                    Save Preferences
                  </Button>
                  <Button 
                    onClick={() => setShowDetails(false)} 
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}

            {/* Footer Links */}
            <div className="text-xs text-muted-foreground pt-4 border-t">
              <p>
                Learn more about how we use cookies in our{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                . You can change these settings at any time using the Cookie Preferences link in our footer.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
