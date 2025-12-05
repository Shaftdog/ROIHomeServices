import type { Metadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, MapPin, FileText, ArrowLeft } from "lucide-react";
import {
  marketReports,
  propertyTypeLabels,
  regionLabels,
  reportTypeLabels,
  type MarketReport,
} from "@/data/market-reports";

export const metadata: Metadata = {
  title: 'Market Reports | Central Florida Real Estate Insights',
  description: 'Comprehensive Central Florida real estate market reports covering residential, commercial, investment, and vacation rental properties across Orlando, Tampa Bay, and Space Coast.',
  alternates: {
    canonical: 'https://www.roihomesvc.com/insights/market-reports',
  },
  openGraph: {
    title: 'Market Reports | ROI Home Services',
    description: 'Central Florida real estate market reports and analysis.',
    url: 'https://www.roihomesvc.com/insights/market-reports',
  },
};

function ReportCard({ report }: { report: MarketReport }) {
  return (
    <Card className="overflow-hidden shadow-lg hover-lift flex flex-col">
      <div className="relative aspect-video">
        <Image
          src={report.imageUrl}
          alt={report.title}
          fill
          className="object-cover"
          data-ai-hint={report.imageHint}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded">
            {reportTypeLabels[report.reportType]}
          </span>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {regionLabels[report.region]}
          </span>
          <span>•</span>
          <span>{propertyTypeLabels[report.propertyType]}</span>
        </div>
        <Link href={`/insights/market-reports/${report.slug}`}>
          <CardTitle className="text-xl hover:text-accent transition-colors line-clamp-2">
            {report.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <p className="text-sm text-muted-foreground">{report.date}</p>
        <p className="text-muted-foreground leading-relaxed line-clamp-3 mt-2">
          {report.excerpt}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="text-accent p-0">
          <Link href={`/insights/market-reports/${report.slug}`}>Read Full Report →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ReportGrid({ reports }: { reports: MarketReport[] }) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No reports found for this category.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <ReportCard key={report.slug} report={report} />
      ))}
    </div>
  );
}

export default function MarketReportsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Back Link */}
      <Link
        href="/insights"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Insights
      </Link>

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Market Reports</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          In-depth analysis and insights on Central Florida real estate markets. Stay informed with our latest research on property values, market trends, and investment opportunities.
        </p>
      </header>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reports by topic..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger value="all" className="text-sm">
              All Reports
            </TabsTrigger>

            {/* Property Type Tabs */}
            <TabsTrigger value="residential" className="text-sm">
              Residential
            </TabsTrigger>
            <TabsTrigger value="commercial" className="text-sm">
              Commercial
            </TabsTrigger>
            <TabsTrigger value="investment" className="text-sm">
              Investment
            </TabsTrigger>
            <TabsTrigger value="multi-family" className="text-sm">
              Multi-Family
            </TabsTrigger>
            <TabsTrigger value="vacation-rental" className="text-sm">
              Vacation Rental
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Region Sub-tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-muted-foreground flex items-center mr-2">
              <MapPin className="h-4 w-4 mr-1" /> Region:
            </span>
            <Button variant="outline" size="sm" className="text-xs">
              All Regions
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Central Florida
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Orlando Metro
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Tampa Bay
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Space Coast
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Lake County
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Osceola County
            </Button>
          </div>
        </div>

        {/* Report Type Badges */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-muted-foreground flex items-center mr-2">
              <FileText className="h-4 w-4 mr-1" /> Type:
            </span>
            <Button variant="outline" size="sm" className="text-xs">
              All Types
            </Button>
            <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Market Trends
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Quarterly Updates
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Investment Analysis
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Appraisal Insights
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value="all">
          <ReportGrid reports={marketReports} />
        </TabsContent>

        <TabsContent value="residential">
          <ReportGrid reports={marketReports.filter(r => r.propertyType === 'residential')} />
        </TabsContent>

        <TabsContent value="commercial">
          <ReportGrid reports={marketReports.filter(r => r.propertyType === 'commercial')} />
        </TabsContent>

        <TabsContent value="investment">
          <ReportGrid reports={marketReports.filter(r => r.propertyType === 'investment')} />
        </TabsContent>

        <TabsContent value="multi-family">
          <ReportGrid reports={marketReports.filter(r => r.propertyType === 'multi-family')} />
        </TabsContent>

        <TabsContent value="vacation-rental">
          <ReportGrid reports={marketReports.filter(r => r.propertyType === 'vacation-rental')} />
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-br from-accent to-highlight rounded-2xl p-8 md:p-12 text-center text-accent-foreground">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-highlight-foreground">
          Need a Property Appraisal?
        </h2>
        <p className="text-highlight-foreground/90 max-w-2xl mx-auto mb-6">
          Our market reports are backed by hands-on appraisal experience across Central Florida. Get an accurate, professional appraisal from our licensed team.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-highlight-foreground text-highlight hover:bg-highlight-foreground/90"
        >
          <Link href="/book">Schedule an Appraisal</Link>
        </Button>
      </div>
    </div>
  );
}
