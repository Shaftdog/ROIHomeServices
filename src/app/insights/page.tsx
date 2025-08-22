
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Rss } from "lucide-react";

const placeholderPosts = [
  {
    slug: "central-florida-market-update-q2-2025",
    title: "Central Florida Market Update - Q2 2025",
    date: "July 15, 2024",
    excerpt: "Dive into the latest trends shaping the Central Florida real estate market. We cover price movements, inventory levels, and key economic indicators impacting buyers and sellers in the second quarter of 2025.",
    imageUrl: "https://picsum.photos/seed/market/400/250",
    imageHint: "market analysis chart"
  },
  {
    slug: "top-5-things-to-know-before-your-appraisal",
    title: "Top 5 Things to Know Before Your Appraisal",
    date: "July 10, 2024",
    excerpt: "Preparing for a property appraisal? Discover five essential tips to ensure a smooth process and help accurately reflect your home's true value. From minor repairs to important documentation, we've got you covered.",
    imageUrl: "https://picsum.photos/seed/appraisalprep/400/250",
    imageHint: "home checklist notes"
  },
  {
    slug: "how-to-challenge-a-low-appraisal",
    title: "How to Challenge a Low Appraisal",
    date: "July 5, 2024",
    excerpt: "Received an appraisal lower than expected? Don't panic. This guide walks you through the steps to understand your report, identify potential errors, and effectively request a reconsideration of value.",
    imageUrl: "https://picsum.photos/seed/lowappraisal/400/250",
    imageHint: "document review magnifying glass"
  },
  {
    slug: "understanding-arv-for-property-investors",
    title: "Understanding ARV: A Key Metric for Property Investors",
    date: "June 28, 2024",
    excerpt: "What is After Repair Value (ARV) and why is it crucial for real estate investors? Learn how ARV is calculated and how it can help you make smarter investment decisions for fix-and-flip projects.",
    imageUrl: "https://picsum.photos/seed/arv/400/250",
    imageHint: "construction blueprint calculator"
  }
];

export default function InsightsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">Market Insights & Appraisal Know-How</h1>
        <p className="text-lg text-muted-foreground mt-2">Your source for expert advice and updates on the Central Florida property market.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Insights Posts Section */}
        <div className="lg:col-span-8">
          <div className="grid md:grid-cols-1 gap-8">
            {placeholderPosts.map((post) => (
              <Card key={post.slug} className="overflow-hidden shadow-lg hover-lift flex flex-col md:flex-row">
                <div className="md:w-1/3 relative">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="object-cover w-full h-48 md:h-full"
                    data-ai-hint={post.imageHint}
                  />
                </div>
                <div className="md:w-2/3 flex flex-col">
                  <CardHeader>
                    <Link href={`/insights/${post.slug}`}>
                      <CardTitle className="text-2xl hover:text-accent transition-colors">{post.title}</CardTitle>
                    </Link>
                    <p className="text-sm text-muted-foreground">{post.date}</p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" asChild className="text-accent p-0">
                      <Link href={`/insights/${post.slug}`}>Read More →</Link>
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
          {/* Pagination Placeholder */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">[Pagination placeholder]</p>
            <div className="flex justify-center gap-2 mt-2">
                <Button variant="outline">Previous</Button>
                <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <aside className="lg:col-span-4 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Search className="mr-2 h-5 w-5"/>Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex w-full items-center space-x-2">
                <Input type="text" placeholder="Search articles..." />
                <Button type="submit" variant="default">Go</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-accent">Appraisal Tips (10)</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-accent">Market Updates (5)</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-accent">Investor Insights (8)</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-accent">Home Improvement (3)</Link></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {placeholderPosts.slice(0, 3).map(post => (
                  <li key={post.slug}>
                    <Link href={`/insights/${post.slug}`} className="font-medium hover:text-accent text-sm leading-snug">{post.title}</Link>
                    <p className="text-xs text-muted-foreground">{post.date}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent to-highlight text-accent-foreground p-6">
            <CardHeader className="p-0 mb-3">
              <Rss className="h-8 w-8 mb-2 text-highlight-foreground/80" />
              <CardTitle className="text-2xl text-highlight-foreground">Get Expert Insights Delivered</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-highlight-foreground/90 mb-4">Subscribe to our newsletter for the latest market trends and appraisal advice.</p>
              <div className="flex flex-col space-y-2">
                <Input type="email" placeholder="Email Address" className="bg-white/20 placeholder:text-white/60 text-white border-white/30 focus:bg-white/30 focus:ring-white/50" />
                <Button type="submit" variant="default" className="bg-highlight-foreground text-highlight hover:bg-highlight-foreground/90">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

