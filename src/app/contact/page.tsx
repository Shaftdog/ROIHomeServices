
import { CtaButton } from "@/components/shared/cta-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Clock, MapPin, Send, CalendarDays } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">Get in Touch with ROI Home Services</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto text-balance">
          We're here to answer your questions and help you with your appraisal and consulting needs.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column: Contact Info & Map */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-accent shrink-0" />
                <a href="tel:407-759-3611" className="text-muted-foreground hover:text-accent">407-759-3611</a>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-accent shrink-0" />
                <span className="text-muted-foreground">Monday - Friday, 9 AM - 5 PM</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-accent shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  941 West Morse Boulevard, Suite 100<br />
                  Winter Park, Florida 32789
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Our Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-light-gray rounded-md overflow-hidden" data-ai-hint="map location office">
                <iframe
                  src="https://maps.google.com/maps?q=941%20West%20Morse%20Boulevard%2C%20Suite%20100%2C%20Winter%20Park%2C%20FL%2032789&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border:0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ROI Home Services Location"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Contact Form & Calendly */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div suppressHydrationWarning={true}>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="Your Name" />
                  </div>
                  <div suppressHydrationWarning={true}>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your Email" />
                  </div>
                </div>
                <div suppressHydrationWarning={true}>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input id="phone" type="tel" placeholder="Your Phone Number" />
                </div>
                <div suppressHydrationWarning={true}>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" type="text" placeholder="Subject of your message" />
                </div>
                <div suppressHydrationWarning={true}>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message..." rows={5} />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                  Send Message <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <CalendarDays className="mr-3 h-6 w-6 text-accent"/>Schedule Your Free Consultation Directly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] md:h-[800px] bg-light-gray rounded-md flex items-center justify-center" data-ai-hint="calendly embed form">
                <p className="text-muted-foreground text-center p-4">
                  [Placeholder for Full-width Embedded Calendly Widget for 'Free Consult – 15 min']
                </p>
              </div>
              <div className="mt-6 text-center">
                <CtaButton calendlyEventType="On-site Appraisal" variant="highlight">
                  Or Book an Appraisal Instead
                </CtaButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
