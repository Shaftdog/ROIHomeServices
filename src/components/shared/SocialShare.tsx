'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        size="icon"
        aria-label="Share on Facebook"
        onClick={() => openShareWindow(shareLinks.facebook)}
        className="hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
      >
        <Facebook className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Share on Twitter"
        onClick={() => openShareWindow(shareLinks.twitter)}
        className="hover:bg-black hover:text-white hover:border-black transition-colors"
      >
        <Twitter className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Share on LinkedIn"
        onClick={() => openShareWindow(shareLinks.linkedin)}
        className="hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
      >
        <Linkedin className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        onClick={handleCopyLink}
        className={`gap-2 transition-colors ${copied ? 'bg-green-50 border-green-500 text-green-600' : ''}`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  );
}
