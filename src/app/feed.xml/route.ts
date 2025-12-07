import { marketReports } from '@/data/market-reports';

const SITE_URL = 'https://www.roihomesvc.com';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseDate(dateStr: string): Date {
  // Parse dates like "December 5, 2025" or "November 15, 2024"
  return new Date(dateStr);
}

export async function GET() {
  // Sort reports by date, most recent first
  const sortedReports = [...marketReports].sort((a, b) => {
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  const rssItems = sortedReports.map((report) => {
    const pubDate = parseDate(report.date).toUTCString();
    const link = `${SITE_URL}/insights/market-reports/${report.slug}`;

    return `
    <item>
      <title>${escapeXml(report.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(report.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>info@roihomesvc.com (${escapeXml(report.author)})</author>
      <category>${escapeXml(report.propertyType)}</category>
      <category>${escapeXml(report.region)}</category>
    </item>`;
  }).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ROI Home Services - Market Insights</title>
    <link>${SITE_URL}/insights</link>
    <description>Expert advice on Central Florida real estate, property valuations, and market trends from ROI Home Services.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og/default-1200x630.jpg</url>
      <title>ROI Home Services</title>
      <link>${SITE_URL}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
