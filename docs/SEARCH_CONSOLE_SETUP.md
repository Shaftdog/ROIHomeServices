# Google Search Console Setup Guide

## Overview
This guide walks you through setting up Google Search Console for roihomesvc.com to monitor SEO performance, submit sitemaps, and track search visibility.

## Step 1: Access Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account (use the same account as Google Analytics/Ads if possible)

## Step 2: Add Property

1. Click **"Add property"** in the dropdown at the top left
2. Choose **"URL prefix"** method
3. Enter: `https://www.roihomesvc.com`
4. Click **Continue**

## Step 3: Verify Ownership

### Option A: HTML Meta Tag (Recommended)
1. Select **"HTML tag"** verification method
2. Copy the verification code (looks like: `google1234567890abcdef`)
3. Add to Vercel environment variables:
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=google1234567890abcdef
   ```
4. Redeploy the site
5. Return to Search Console and click **Verify**

### Option B: DNS TXT Record
1. Select **"Domain name provider"** verification
2. Copy the TXT record value
3. Add to your DNS settings at your domain registrar
4. Wait for DNS propagation (up to 48 hours)
5. Return to Search Console and click **Verify**

### Option C: Google Analytics (If Already Set Up)
1. Select **"Google Analytics"** verification
2. Ensure GA4 is properly installed on the site
3. Click **Verify**

## Step 4: Submit Sitemap

Once verified:

1. Go to **Sitemaps** in the left menu
2. Enter: `sitemap.xml`
3. Click **Submit**

The sitemap is automatically generated at:
- https://www.roihomesvc.com/sitemap.xml

It includes:
- All static pages (home, about, contact, book, etc.)
- All service pages (9 services)
- All sector pages (5 sectors)
- All solution pages (7 solutions)
- All location pages (10 Florida cities)
- Total: 64+ URLs

## Step 5: Request Indexing (Optional)

For faster indexing of key pages:

1. Go to **URL Inspection** in the left menu
2. Enter the URL of important pages:
   - `https://www.roihomesvc.com/`
   - `https://www.roihomesvc.com/services/appraisal`
   - `https://www.roihomesvc.com/book`
   - `https://www.roihomesvc.com/contact`
3. Click **Request Indexing** for each

## Step 6: Configure Settings

### Users & Permissions
1. Go to **Settings** > **Users and permissions**
2. Add team members with appropriate access levels:
   - **Owner**: Full access
   - **Full**: Can view all data and take most actions
   - **Restricted**: View-only access

### International Targeting
1. Go to **Settings** > **International Targeting**
2. Set target country: **United States**

### Associations
1. Link to Google Analytics 4 property
2. Link to Google Ads account (if applicable)

## Step 7: Monitor Performance

Key reports to check weekly:

### Performance Report
- **Queries**: What search terms bring traffic
- **Pages**: Which pages get the most clicks
- **Countries**: Geographic traffic distribution
- **Devices**: Mobile vs desktop performance

### Coverage Report
- Monitor for indexing issues
- Check for crawl errors
- Verify all pages are indexed

### Core Web Vitals
- Check LCP, FID, CLS scores
- Identify pages needing performance optimization

## Verification Checklist

- [ ] Property added and verified
- [ ] Sitemap submitted
- [ ] Key pages requested for indexing
- [ ] Team members added with correct permissions
- [ ] Linked to Google Analytics
- [ ] International targeting set to US
- [ ] Initial Performance report reviewed

## Environment Variable

Add this to your Vercel project settings:

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code-here
```

After adding, redeploy the site for changes to take effect.

## Troubleshooting

### Sitemap Not Found
- Verify sitemap is accessible at https://www.roihomesvc.com/sitemap.xml
- Check for any server errors in the deployment logs

### Verification Failed
- Ensure environment variable is set correctly
- Clear Vercel cache and redeploy
- Wait a few minutes and retry verification

### Pages Not Indexed
- Check robots.txt isn't blocking the page
- Use URL Inspection to diagnose issues
- Request indexing manually for important pages

## Related Files

- `/src/app/sitemap.ts` - Dynamic sitemap generation
- `/src/app/robots.ts` - Robots.txt configuration
- `/src/app/layout.tsx` - Google verification meta tag
