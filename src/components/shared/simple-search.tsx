"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SimpleSearchProps {
  placeholder?: string;
  className?: string;
}

export function SimpleSearch({ 
  placeholder = "Search our site...", 
  className 
}: SimpleSearchProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // For now, redirect to Google site search
      // In a real app, you might have internal search
      const searchUrl = `https://www.google.com/search?q=site:roihomesvc.com ${encodeURIComponent(query.trim())}`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="flex gap-2 max-w-md">
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
          aria-label="Search"
        />
        <Button 
          type="submit" 
          variant="outline" 
          size="icon"
          disabled={!query.trim()}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
