import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { BackHomeLink } from "@/components/shared/back-home-link";
import { SimpleSearch } from "@/components/shared/simple-search";
import { Home, Phone, Calendar, Search, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | ROI Home Services",
  description: "The page you're looking for doesn't exist. Find what you need with our helpful navigation.",
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Header */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-8xl font-bold text-muted-foreground/30 mb-4">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center justify-center gap-2">
            <Search className="h-5 w-5" />
            Search Our Site
          </h3>
          <SimpleSearch 
            placeholder="Search for services, insights, or information..."
            className="flex justify-center"
          />
        </div>

        {/* Quick Navigation */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Popular Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/offerings">
                <Home className="h-5 w-5" />
                <span className="font-medium">Our Services</span>
                <span className="text-sm text-muted-foreground">
                  Appraisals & Consulting
                </span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/book">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Book Appraisal</span>
                <span className="text-sm text-muted-foreground">
                  Schedule Today
                </span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/contact">
                <Phone className="h-5 w-5" />
                <span className="font-medium">Contact Us</span>
                <span className="text-sm text-muted-foreground">
                  Get in Touch
                </span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/insights">
                <ArrowRight className="h-5 w-5" />
                <span className="font-medium">Market Insights</span>
                <span className="text-sm text-muted-foreground">
                  Latest Updates
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <BackHomeLink />
          <BackHomeLink 
            variant="link" 
            className="text-sm"
          >
            Or browse our homepage
          </BackHomeLink>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Still can&apos;t find what you&apos;re looking for?{" "}
            <Link 
              href="/contact" 
              className="text-accent hover:text-accent/80 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              Contact our team
            </Link>{" "}
            and we&apos;ll help you find the right information.
          </p>
        </div>
      </div>
    </div>
  );
}
