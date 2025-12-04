'use client';

import { useState } from 'react';
import { CtaButton } from "@/components/shared/cta-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Clock, MapPin, Send, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InlineWidget } from "react-calendly";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">Get in Touch with ROI Home Services</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto text-balance">
          We&apos;re here to answer your questions and help you with your appraisal and consulting needs.
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
                  100 E Pine St., #110<br />
                  Orlando, FL 32801
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
                  src="https://maps.google.com/maps?q=100%20E%20Pine%20St.%2C%20%23110%2C%20Orlando%2C%20FL%2032801&t=&z=15&ie=UTF8&iwloc=&output=embed"
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div suppressHydrationWarning={true}>
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="Your Name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div suppressHydrationWarning={true}>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Your Email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div suppressHydrationWarning={true}>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Your Phone Number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div suppressHydrationWarning={true}>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input 
                    id="subject" 
                    type="text" 
                    placeholder="Subject of your message" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div suppressHydrationWarning={true}>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Your message..." 
                    rows={5} 
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>Send Message <Send className="ml-2 h-4 w-4" /></>
                  )}
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
              <div className="calendly-embed-container rounded-md overflow-hidden">
                <InlineWidget
                  url={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/rod-23/15min"}
                  styles={{ height: '700px', minWidth: '320px' }}
                  pageSettings={{
                    backgroundColor: 'ffffff',
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: '2563eb',
                    textColor: '1a1a1a'
                  }}
                />
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