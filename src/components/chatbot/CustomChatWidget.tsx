"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, MessageCircle, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  hasLink?: boolean;
  linkUrl?: string;
  linkText?: string;
}

const CONVERSATION_STARTERS = [
  "Get Instant Quote",
  "Pricing & Turnaround", 
  "Coverage"
];

const BOT_RESPONSES = {
  "get instant quote": {
    text: "Great! I can help you get an instant quote in under 5 minutes.",
    linkUrl: "https://www.roihomesvc.com/book",
    linkText: "Start Your Appraisal Quote →"
  },
  "pricing & turnaround": {
    text: "Our appraisals start at $595 with typical turnaround of 3-5 business days. Fast-track options available!",
    linkUrl: "https://www.roihomesvc.com/book",
    linkText: "Get Your Quote →"
  },
  "coverage": {
    text: "We provide certified appraisals throughout Central Florida including Orlando, Winter Park, and surrounding areas.",
    linkUrl: "https://www.roihomesvc.com/book",
    linkText: "Schedule Your Appraisal →"
  },
  "default": {
    text: "I'd be happy to help! For detailed questions, let me connect you with Rod Haugabrooks who can provide expert guidance.",
    linkUrl: "https://www.roihomesvc.com/book",
    linkText: "Schedule a Consultation →"
  }
};

export default function CustomChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInactivityMessage, setShowInactivityMessage] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: "Hi, I'm Jordan from ROI Home Services! 👋 Tap Get Instant Quote to start:",
      isBot: true,
      timestamp: new Date(),
      hasLink: true,
      linkUrl: "https://www.roihomesvc.com/book",
      linkText: "Get Instant Quote →"
    };
    setMessages([welcomeMessage]);
  }, []);

  // 60-second inactivity trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInactivityMessage(true);
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  // Exit-intent simulation (when user scrolls to top quickly)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      if (window.scrollY < lastScrollY && window.scrollY < 100) {
        // User scrolled up quickly - simulate exit intent
        if (!isOpen && !showInactivityMessage) {
          setShowInactivityMessage(true);
        }
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, showInactivityMessage]);

  const handleStarterClick = (starter: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: starter,
      isBot: false,
      timestamp: new Date()
    };

    // Get bot response
    const responseKey = starter.toLowerCase();
    const response = BOT_RESPONSES[responseKey as keyof typeof BOT_RESPONSES] || BOT_RESPONSES.default;
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      isBot: true,
      timestamp: new Date(),
      hasLink: true,
      linkUrl: response.linkUrl,
      linkText: response.linkText
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
  };

  const openChat = () => {
    setIsOpen(true);
    setShowInactivityMessage(false);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={openChat}
            className="h-14 w-14 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            aria-label="Open chat with Jordan Pierce"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          {/* Callout Message */}
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 max-w-xs border border-gray-200">
            <p className="text-sm text-gray-700">
              Need an appraisal? Get an instant quote, schedule & pay in minutes.
            </p>
            <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
      )}

      {/* Inactivity Message */}
      {showInactivityMessage && !isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-sky-500 text-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex justify-between items-start">
            <p className="text-sm">
              Still there? Need help getting an instant quote?
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInactivityMessage(false)}
              className="text-white hover:bg-sky-600 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={openChat}
            className="mt-2 bg-white text-sky-500 hover:bg-gray-100 text-xs px-3 py-1 h-auto"
          >
            Get Quote →
          </Button>
        </div>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <CardHeader className="bg-sky-500 text-white rounded-t-lg p-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Jordan Pierce</CardTitle>
              <p className="text-sky-100 text-sm">ROI Home Services</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeChat}
              className="text-white hover:bg-sky-600 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-sky-500 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  {message.hasLink && message.linkUrl && (
                    <a
                      href={message.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs bg-sky-500 text-white px-2 py-1 rounded hover:bg-sky-600 transition-colors"
                    >
                      {message.linkText}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </CardContent>

          {/* Conversation Starters */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2">
              {CONVERSATION_STARTERS.map((starter) => (
                <Button
                  key={starter}
                  variant="outline"
                  size="sm"
                  onClick={() => handleStarterClick(starter)}
                  className="w-full justify-start text-left h-auto py-2 text-xs"
                >
                  {starter}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
