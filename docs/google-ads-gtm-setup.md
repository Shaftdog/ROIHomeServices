# Google Ads & GTM Configuration Guide

## Overview
This guide will help you configure Google Tag Manager (GTM) to properly track Google Ads conversions and attribution for the ROI Home Services website.

## Current Setup
- **GTM Container ID**: `GTM-PLG3HLD8`
- **Landing Page**: Central Florida (`/landing-pages/central-florida/`)
- **Tracking Events**: Enhanced with attribution data

## Required GTM Configuration

### 1. Link Google Ads Account to GTM

1. **In Google Tag Manager:**
   - Go to Admin → Container Settings
   - Link your Google Ads account
   - Enable "Import conversions from Google Ads"

2. **In Google Ads:**
   - Go to Tools & Settings → Linked accounts
   - Link your GTM account
   - Enable auto-tagging (adds `gclid` parameter)

### 2. Set Up Google Ads Conversion Tracking

#### Step 1: Create Conversion Action in Google Ads
1. Go to Tools & Settings → Conversions
2. Click "+" to create new conversion
3. Choose "Website" as conversion source
4. Set up conversion details:
   - **Conversion name**: "Central Florida CTA Click"
   - **Category**: "Lead"
   - **Value**: $250 (or use dynamic values)
   - **Count**: "One" (per click session)
   - **Attribution model**: "Data-driven" or "Last click"

#### Step 2: Import Conversion to GTM
1. In GTM, go to Tags → New
2. Choose "Google Ads Conversion Tracking"
3. Configure:
   - **Conversion ID**: Your Google Ads conversion ID (format: AW-XXXXXXXXXX)
   - **Conversion Label**: From your conversion action
   - **Conversion Value**: Use variable `{{conversion_value}}` or static 250
   - **Currency**: USD

#### Step 3: Set Up Trigger
1. Create new trigger: "CTA Click Trigger"
2. Trigger type: "Custom Event"
3. Event name: `ads_conversion`
4. This fires when our landing page pushes the `ads_conversion` event

### 3. Configure Enhanced Conversions

1. **In your conversion tag:**
   - Enable "Enhanced Conversions"
   - Choose "Automatic" or "Manual" implementation
   - For manual: use customer data variables (email, phone, address)

2. **Benefits:**
   - Better attribution without cookies
   - Works even when `ad_storage` is denied
   - Improves conversion accuracy by 5-15%

### 4. Set Up Google Analytics 4 Integration

#### Create GA4 Configuration Tag
1. Tag type: "Google Analytics: GA4 Configuration"
2. Measurement ID: Your GA4 property ID
3. Enable "Enhanced Conversions" here too
4. Trigger: "All Pages"

#### Create GA4 Event Tags
1. **CTA Click Event:**
   - Tag type: "Google Analytics: GA4 Event"
   - Event name: `cta_click`
   - Parameters:
     - `event_category`: `{{event_category}}`
     - `event_label`: `{{event_label}}`
     - `conversion_value`: `{{conversion_value}}`
     - `traffic_source`: `{{traffic_source}}`
     - `is_paid_traffic`: `{{is_paid_traffic}}`

2. **Page View Event:**
   - Tag type: "Google Analytics: GA4 Event"
   - Event name: `page_view`
   - Enhanced measurement enabled

### 5. Create Custom Variables

#### Attribution Variables
Create these built-in variables in GTM:

1. **URL Variables:**
   - `utm_source` → URL parameter: `utm_source`
   - `utm_medium` → URL parameter: `utm_medium`
   - `utm_campaign` → URL parameter: `utm_campaign`
   - `gclid` → URL parameter: `gclid`

2. **Data Layer Variables:**
   - `conversion_value` → Data Layer Variable: `conversion_value`
   - `traffic_source` → Data Layer Variable: `traffic_source`
   - `is_paid_traffic` → Data Layer Variable: `is_paid_traffic`
   - `landing_page` → Data Layer Variable: `landing_page`

### 6. Set Up Audiences for Remarketing

1. **In Google Ads:**
   - Create audience: "Central Florida Landing Page Visitors"
   - Source: Google Analytics
   - Conditions: Page contains `/landing-pages/central-florida/`

2. **In GTM:**
   - Ensure remarketing is enabled in GA4 configuration
   - Add remarketing parameters to all page view events

### 7. Configure Cross-Domain Tracking (if needed)

If you have multiple domains:
1. Enable cross-domain tracking in GA4 configuration
2. Add domains to the cross-domain tracking list
3. Ensure consistent GTM container across domains

## Testing Your Setup

### 1. Use GTM Preview Mode
1. In GTM, click "Preview"
2. Enter your landing page URL with UTM parameters:
   ```
   https://www.roihomesvc.com/landing-pages/central-florida/?utm_source=google&utm_medium=cpc&utm_campaign=test&gclid=test123
   ```
3. Verify all tags fire correctly
4. Check data layer events are captured

### 2. Test Google Ads Conversion
1. Click CTA buttons on the landing page
2. Check GTM preview shows conversion tag fired
3. Verify conversion appears in Google Ads (may take 24-48 hours)

### 3. Verify Enhanced Conversions
1. In Google Ads, go to your conversion action
2. Check "Enhanced conversions" status shows "Eligible"
3. Monitor conversion rate improvements over 2-4 weeks

## Key Events Being Tracked

Our enhanced tracking sends these events to the data layer:

1. **`page_view`** - Landing page visits with attribution
2. **`cta_click`** - CTA button clicks with conversion value
3. **`ads_conversion`** - Specific conversion event for Google Ads
4. **`scroll_50_percent`** - Engagement tracking
5. **`engagement_time`** - Time-based engagement (30+ seconds)
6. **`form_submit`** - Form submissions (if forms added)

## Attribution Data Included

Each event includes:
- UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, etc.)
- `gclid` for Google Ads attribution
- `traffic_source` (derived from UTM/gclid)
- `is_paid_traffic` boolean flag
- Conversion values and currency

## Troubleshooting

### Common Issues:
1. **Conversions not showing**: Check conversion tag fires in GTM preview
2. **Attribution missing**: Verify auto-tagging enabled in Google Ads
3. **Enhanced conversions not working**: Check customer data variables
4. **Consent mode blocking**: Review consent settings and modeling setup

### Debug Steps:
1. Use GTM Preview mode
2. Check browser developer tools → Console for errors
3. Verify data layer events in GTM debug panel
4. Test with Google Ads Preview tool
5. Monitor Google Ads conversion reporting

## Next Steps

1. **Immediate**: Configure the GTM tags as described above
2. **Week 1**: Monitor conversion tracking and debug issues
3. **Week 2-4**: Analyze attribution improvements and optimize
4. **Ongoing**: Use conversion data to optimize ad campaigns

## Support

For additional help:
- Google Ads Help Center: Conversion tracking
- Google Tag Manager Help: Enhanced conversions
- Google Analytics Help: GA4 setup

---

**Last Updated**: January 2025
**GTM Container**: GTM-PLG3HLD8
**Landing Page**: Central Florida Appraisals
