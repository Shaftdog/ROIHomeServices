"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAttributionData, sendGTMEvent, trackAdsConversion } from '@/lib/gtag';
import { getConsentSummary } from '@/lib/consent';

interface TrackingEvent {
  event: string;
  timestamp: string;
  data: Record<string, any>;
}

export default function TrackingDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [attributionData, setAttributionData] = useState<Record<string, any>>({});
  const [consentStatus, setConsentStatus] = useState<any>({});

  useEffect(() => {
    // Show debugger only in development or when ?debug=true is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const isDebugMode = process.env.NODE_ENV === 'development' || urlParams.get('debug') === 'true';
    
    if (isDebugMode) {
      setIsVisible(true);
      
      // Get initial data
      setAttributionData(getAttributionData());
      setConsentStatus(getConsentSummary());
      
      // Listen for dataLayer events
      const originalPush = window.dataLayer?.push;
      if (originalPush) {
        window.dataLayer.push = function(...args) {
          // Log the event
          const eventData = args[0];
          if (eventData && typeof eventData === 'object' && eventData.event) {
            setEvents(prev => [...prev.slice(-9), {
              event: eventData.event,
              timestamp: new Date().toISOString(),
              data: eventData
            }]);
          }
          
          // Call original push
          return originalPush.apply(window.dataLayer, args);
        };
      }
    }
  }, []);

  const testCTAClick = () => {
    sendGTMEvent('cta_click', {
      event_category: 'test',
      event_label: 'Debug CTA Test',
      conversion_value: 250,
      currency: 'USD',
      button_text: 'Debug Test Button'
    });
  };

  const testAdsConversion = () => {
    trackAdsConversion('debug_test_conversion', 250, 'USD');
  };

  const testPageView = () => {
    sendGTMEvent('page_view', {
      page_type: 'debug',
      service_area: 'test'
    });
  };

  const clearEvents = () => {
    setEvents([]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="p-4 bg-gray-900 text-white border-gray-700 max-h-96 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Tracking Debugger</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </Button>
        </div>
        
        {/* Attribution Status */}
        <div className="mb-3">
          <h4 className="text-xs font-medium mb-1">Attribution Data</h4>
          <div className="flex flex-wrap gap-1 mb-2">
            {attributionData.gclid && (
              <Badge variant="secondary" className="text-xs">GCLID: ✓</Badge>
            )}
            {attributionData.utm_source && (
              <Badge variant="secondary" className="text-xs">
                {attributionData.utm_source}
              </Badge>
            )}
            {attributionData.is_paid_traffic && (
              <Badge variant="destructive" className="text-xs">Paid Traffic</Badge>
            )}
          </div>
        </div>

        {/* Consent Status */}
        <div className="mb-3">
          <h4 className="text-xs font-medium mb-1">Consent Status</h4>
          <div className="flex flex-wrap gap-1">
            <Badge 
              variant={consentStatus.categories?.analytics ? "default" : "secondary"}
              className="text-xs"
            >
              Analytics: {consentStatus.categories?.analytics ? '✓' : '✗'}
            </Badge>
            <Badge 
              variant={consentStatus.categories?.advertising ? "default" : "secondary"}
              className="text-xs"
            >
              Ads: {consentStatus.categories?.advertising ? '✓' : '✗'}
            </Badge>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="mb-3">
          <h4 className="text-xs font-medium mb-2">Test Events</h4>
          <div className="flex flex-wrap gap-1">
            <Button size="sm" variant="outline" onClick={testCTAClick} className="text-xs">
              CTA Click
            </Button>
            <Button size="sm" variant="outline" onClick={testAdsConversion} className="text-xs">
              Ads Conv
            </Button>
            <Button size="sm" variant="outline" onClick={testPageView} className="text-xs">
              Page View
            </Button>
            <Button size="sm" variant="ghost" onClick={clearEvents} className="text-xs">
              Clear
            </Button>
          </div>
        </div>

        {/* Recent Events */}
        <div>
          <h4 className="text-xs font-medium mb-1">Recent Events ({events.length})</h4>
          <div className="max-h-32 overflow-y-auto text-xs space-y-1">
            {events.length === 0 ? (
              <p className="text-gray-400">No events tracked yet</p>
            ) : (
              events.slice(-5).reverse().map((event, index) => (
                <div key={index} className="bg-gray-800 p-2 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-400">{event.event}</span>
                    <span className="text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {event.data.conversion_value && (
                    <div className="text-green-400">
                      Value: ${event.data.conversion_value}
                    </div>
                  )}
                  {event.data.gclid && (
                    <div className="text-yellow-400">GCLID: {event.data.gclid.substring(0, 10)}...</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
