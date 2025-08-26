/**
 * @jest-environment jsdom
 */

import { pushEvent } from '@/lib/gtm';

// Mock window.dataLayer
const mockDataLayer: any[] = [];
Object.defineProperty(window, 'dataLayer', {
  value: mockDataLayer,
  writable: true,
});

describe('GTM Event Tracking', () => {
  beforeEach(() => {
    // Clear dataLayer before each test
    mockDataLayer.length = 0;
  });

  it('should push Start_Booking event to dataLayer', () => {
    const eventParams = {
      step: 1,
      step_name: 'ContactInfo',
      page: '/book',
      appointment_type: 'unknown'
    };

    pushEvent('Start_Booking', eventParams);

    expect(mockDataLayer).toHaveLength(1);
    expect(mockDataLayer[0]).toEqual({
      event: 'Start_Booking',
      ...eventParams
    });
  });

  it('should push Start_Booking event with continue_click action', () => {
    const eventParams = {
      step: 1,
      action: 'continue_click',
      page: '/book',
      appointment_type: 'unknown'
    };

    pushEvent('Start_Booking', eventParams);

    expect(mockDataLayer).toHaveLength(1);
    expect(mockDataLayer[0]).toEqual({
      event: 'Start_Booking',
      ...eventParams
    });
  });

  it('should handle events without parameters', () => {
    pushEvent('Test_Event');

    expect(mockDataLayer).toHaveLength(1);
    expect(mockDataLayer[0]).toEqual({
      event: 'Test_Event'
    });
  });

  it('should push Paid_Booking event with schedule data', () => {
    const eventParams = {
      step: 3,
      step_name: 'Schedule',
      page: '/book',
      appointment_type: 'Home Appraisal',
      location: '123 Main St, Orlando, FL',
      schedule_date: '2025-08-25',
      schedule_time: '10:00 AM'
    };

    pushEvent('Paid_Booking', eventParams);

    expect(mockDataLayer).toHaveLength(1);
    expect(mockDataLayer[0]).toEqual({
      event: 'Paid_Booking',
      ...eventParams
    });
  });

  it('should not crash in SSR environment', () => {
    // Mock server environment
    const originalWindow = global.window;
    delete (global as any).window;

    expect(() => {
      pushEvent('Start_Booking', { step: 1 });
    }).not.toThrow();

    // Restore window
    global.window = originalWindow;
  });
});
