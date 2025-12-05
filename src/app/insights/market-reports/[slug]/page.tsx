import type { Metadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Share2,
  MapPin,
  Calendar,
  FileText,
  ChevronRight,
} from "lucide-react";
import {
  marketReports,
  getMarketReportBySlug,
  propertyTypeLabels,
  regionLabels,
  reportTypeLabels,
} from "@/data/market-reports";
import { SocialShare } from "@/components/shared/SocialShare";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return marketReports.map((report) => ({
    slug: report.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const report = getMarketReportBySlug(slug);

  if (!report) {
    return {
      title: 'Report Not Found',
    };
  }

  return {
    title: `${report.title} | ROI Home Services`,
    description: report.excerpt,
    alternates: {
      canonical: `https://www.roihomesvc.com/insights/market-reports/${slug}`,
    },
    openGraph: {
      title: report.title,
      description: report.excerpt,
      url: `https://www.roihomesvc.com/insights/market-reports/${slug}`,
      images: [{ url: report.imageUrl }],
      type: 'article',
      publishedTime: report.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: report.title,
      description: report.excerpt,
      images: [report.imageUrl],
    },
  };
}

export default async function MarketReportPage({ params }: PageProps) {
  const { slug } = await params;
  const report = getMarketReportBySlug(slug);

  if (!report) {
    notFound();
  }

  // Get related reports (same property type or region, excluding current)
  const relatedReports = marketReports
    .filter(
      (r) =>
        r.slug !== slug &&
        (r.propertyType === report.propertyType || r.region === report.region)
    )
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/insights" className="hover:text-accent">
          Insights
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/insights/market-reports" className="hover:text-accent">
          Market Reports
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground truncate max-w-[200px]">{report.title}</span>
      </nav>

      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
              {reportTypeLabels[report.reportType]}
            </span>
            <span className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {regionLabels[report.region]}
            </span>
            <span className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-full">
              {propertyTypeLabels[report.propertyType]}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-balance">
            {report.title}
          </h1>

          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://picsum.photos/seed/roiteam/100/100"
                  alt={report.author}
                  data-ai-hint="research team avatar"
                />
                <AvatarFallback>ROI</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{report.author}</p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {report.date}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-10 rounded-xl overflow-hidden" data-ai-hint={report.imageHint}>
          <Image
            src={report.imageUrl}
            alt={report.title}
            width={900}
            height={500}
            className="w-full object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: report.content }}
        />

        <Separator className="my-10" />

        {/* Social Share */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-3 flex items-center">
            <Share2 className="mr-2 h-5 w-5 text-accent" />
            Share this report
          </h3>
          <SocialShare
            url={`https://www.roihomesvc.com/insights/market-reports/${slug}`}
            title={report.title}
            description={report.excerpt}
          />
        </div>

        {/* Related Reports */}
        {relatedReports.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-accent" />
              Related Reports
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedReports.map((related) => (
                <Card key={related.slug} className="overflow-hidden hover-lift">
                  <div className="relative aspect-video">
                    <Image
                      src={related.imageUrl}
                      alt={related.title}
                      fill
                      className="object-cover"
                      data-ai-hint={related.imageHint}
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <span className="text-xs text-accent font-medium">
                      {reportTypeLabels[related.reportType]}
                    </span>
                    <Link href={`/insights/market-reports/${related.slug}`}>
                      <CardTitle className="text-sm hover:text-accent transition-colors line-clamp-2">
                        {related.title}
                      </CardTitle>
                    </Link>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">{related.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-accent to-highlight rounded-xl p-8 text-center text-accent-foreground">
          <h3 className="text-2xl font-bold mb-3 text-highlight-foreground">
            Need a Professional Appraisal?
          </h3>
          <p className="text-highlight-foreground/90 mb-6 max-w-xl mx-auto">
            Get an accurate property valuation from our experienced Central Florida appraisers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-highlight-foreground text-highlight hover:bg-highlight-foreground/90"
            >
              <Link href="/book">Book an Appraisal</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-highlight-foreground/30 text-highlight-foreground hover:bg-highlight-foreground/10"
            >
              <Link href="/insights/market-reports">View All Reports</Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
