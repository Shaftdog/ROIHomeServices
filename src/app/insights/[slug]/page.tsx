
import Image from "next/image";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AvatarProps } from "@/components/ui/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Linkedin, Share2, MessageCircle, Send } from "lucide-react";

// This is a placeholder page. In a real app, you'd fetch data based on the slug.
export default function InsightPostPage({ params }: { params: { slug: string } }) {
  const post = { // Placeholder data
    title: "Understanding ARV: A Key Metric for Property Investors",
    date: "June 28, 2024",
    author: "ROI Home Services Team",
    authorImageUrl: "https://picsum.photos/seed/author/100/100",
    authorImageHint: "author headshot",
    imageUrl: "https://picsum.photos/seed/arvpost/800/450",
    imageHint: "investment property analysis",
    content: `
      <p>For real estate investors, particularly those involved in fix-and-flip projects or rental property acquisition, understanding After Repair Value (ARV) is paramount. ARV is an estimate of a property's value after all necessary repairs and renovations have been completed. It's a forward-looking valuation that helps investors determine the potential profitability of a project.</p>
      <h2 class="text-2xl font-semibold my-4">Why is ARV Important?</h2>
      <p>ARV serves several critical functions for investors:</p>
      <ul class="list-disc list-inside space-y-2 my-4 pl-4">
        <li><strong>Profitability Assessment:</strong> By comparing the total acquisition and renovation costs to the ARV, investors can estimate their potential profit margin.</li>
        <li><strong>Funding Decisions:</strong> Lenders, especially hard money lenders, often base their loan amounts on a percentage of the ARV (Loan-to-Value or LTV). A solid ARV appraisal is crucial for securing financing.</li>
        <li><strong>Offer Strategy:</strong> Knowing the potential ARV helps investors formulate competitive yet prudent offers on distressed properties.</li>
        <li><strong>Risk Management:</strong> An accurate ARV helps mitigate the risk of over-investing in a property or overpaying for it.</li>
      </ul>
      <h2 class="text-2xl font-semibold my-4">How is ARV Calculated?</h2>
      <p>Calculating ARV involves a professional appraiser assessing the property's current condition and then evaluating comparable properties (comps) that have recently sold in the area in renovated condition. The appraiser considers:</p>
      <ul class="list-disc list-inside space-y-2 my-4 pl-4">
        <li>The scope and quality of planned renovations.</li>
        <li>The current real estate market conditions.</li>
        <li>The features and conditions of recently sold, renovated comparable properties.</li>
      </ul>
      <p>Adjustments are made to the comps to account for differences between them and the subject property (post-renovation). This results in an estimated market value for the property once the proposed improvements are complete.</p>
      <p>At ROI Home Services, we specialize in providing accurate and timely ARV appraisals for investors throughout Central Florida. Our deep market knowledge and understanding of renovation impacts ensure you have the reliable data needed to make confident investment decisions. Contact us today to discuss your next project!</p>
    `,
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-balance">{post.title}</h1>
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.authorImageUrl} alt={post.author} data-ai-hint={post.authorImageHint} />
                <AvatarFallback>{post.author.substring(0,1)}</AvatarFallback>
              </Avatar>
              <span>By {post.author}</span>
            </div>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </header>

        <div className="mb-8" data-ai-hint={post.imageHint}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={800}
            height={450}
            className="rounded-lg shadow-lg w-full object-cover"
            priority // For LCP
          />
        </div>

        <div
          className="prose prose-lg dark:prose-invert max-w-none leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <Separator className="my-10" />

        {/* Social Share Placeholder */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-3 flex items-center"><Share2 className="mr-2 h-5 w-5 text-accent" />Share this post</h3>
          <div className="flex space-x-3">
            <Button variant="outline" size="icon" aria-label="Share on Facebook"><Facebook className="h-5 w-5" /></Button>
            <Button variant="outline" size="icon" aria-label="Share on Twitter"><Twitter className="h-5 w-5" /></Button>
            <Button variant="outline" size="icon" aria-label="Share on LinkedIn"><Linkedin className="h-5 w-5" /></Button>
          </div>
        </div>

        {/* Comments Section Placeholder */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 flex items-center"><MessageCircle className="mr-2 h-5 w-5 text-accent"/>Comments (3 - Placeholder)</h3>
          <div className="space-y-6">
            {[1,2,3].map(i => (
                 <div key={i} className="p-4 border rounded-lg bg-muted/20">
                    <div className="flex items-center mb-2">
                        <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={`https://picsum.photos/seed/commenter${i}/40/40`} data-ai-hint="person avatar" />
                            <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm">User {i}</span>
                        <span className="text-xs text-muted-foreground ml-2">• 2 days ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">This is a placeholder comment. Great article, very insightful!</p>
                 </div>
            ))}
            <div className="mt-6">
                <Input placeholder="Write a comment..." className="mb-2" />
                <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">Post Comment <Send className="ml-2 h-4 w-4"/></Button>
            </div>
          </div>
        </div>

        {/* Subscribe Form Placeholder */}
        <div className="bg-light-gray p-8 rounded-lg text-center">
          <h3 className="text-2xl font-semibold mb-3">Stay Updated</h3>
          <p className="text-muted-foreground mb-4">Get the latest insights and market news directly to your inbox.</p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <Input type="email" placeholder="Enter your email" className="flex-grow"/>
            <Button type="submit" variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">Subscribe</Button>
          </div>
        </div>

      </article>
    </div>
  );
}

// In a real app, you would generate static paths if using SSG:
// export async function generateStaticParams() {
//   // Fetch all insight slugs
//   // const posts = await fetch('...').then((res) => res.json())
//   // return posts.map((post) => ({ slug: post.slug }))
//   return [{ slug: 'example-post-1' }, { slug: 'example-post-2' }]
// }

