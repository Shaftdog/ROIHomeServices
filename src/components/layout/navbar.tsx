
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNavLinks = [
  { href: "/case-studies", label: "Case Studies" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About Us" },
];

const offeringsDropdownLinks = [
  { href: "/offerings", label: "All Offerings" },
  { href: "/offerings#services", label: "Services" },
  { href: "/offerings#sectors", label: "Sectors" },
  { href: "/offerings#solutions", label: "Solutions" },
  { href: "/offerings#clients", label: "Clients" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial hash
    handleHashChange();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const NavLink = ({ href, label, className, onClick }: { href: string, label: string, className?: string, onClick?: () => void }) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "text-sm font-medium transition-colors hover:text-accent",
          isActive ? "text-accent" : "text-foreground/70",
          className
        )}
      >
        {label}
      </Link>
    );
  };
  
  const isOfferingsActive = (pathname.startsWith("/offerings") || pathname.startsWith("/services") || pathname.startsWith("/sectors") || pathname.startsWith("/solutions"));

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-background"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logo.png"
            alt="ROI Home Services Logo"
            width={40}
            height={40}
            className="h-10 w-10" 
            priority
          />
          <span className="font-semibold text-lg text-foreground">ROI Home Services</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(
                "text-sm font-medium transition-colors hover:text-accent flex items-center px-1",
                 isOfferingsActive ? "text-accent" : "text-foreground/70",
                 "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              )}>
                Offerings <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {offeringsDropdownLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className={cn( 
                      (pathname === link.href.split('#')[0] && (link.href.includes('#') ? hash === link.href.split('#')[1] : true) ) 
                      ? "font-semibold text-accent" : ""
                  )}>
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {mainNavLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background p-6">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                  <Image
                    src="/Logo.png"
                    alt="ROI Home Services Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                  <span className="font-semibold text-md text-foreground">ROI Home Services</span>
                </Link>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col space-y-1">
                {/* Offerings section for mobile */}
                <div className="text-lg font-medium text-foreground/80 py-2">Offerings</div>
                {offeringsDropdownLinks.map((link) => (
                   <SheetClose key={link.href} asChild>
                     <Link
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          "text-lg font-medium transition-colors hover:text-accent pl-4 py-2 block",
                          (pathname === link.href.split('#')[0] && (link.href.includes('#') ? hash === link.href.split('#')[1] : true) )
                            ? "text-accent"
                            : "text-foreground/70"
                        )}
                      >
                        {link.label}
                      </Link>
                   </SheetClose>
                ))}
                {mainNavLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <NavLink href={link.href} label={link.label} className="text-lg py-2" onClick={closeMobileMenu} />
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
