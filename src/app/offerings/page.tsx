
"use client";

import type { Offering } from '@/types/offerings';
import type { Client } from '@/types/clients';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function OfferingsPage() {
  const [allOfferings, setAllOfferings] = useState<Offering[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    fetch('/data/offerings.json')
      .then(res => res.json())
      .then((data: Offering[]) => {
        setAllOfferings(data);
      });
    
    fetch('/data/clients.json')
      .then(res => res.json())
      .then((data: Client[]) => {
        setAllClients(data);
      });

    const hash = window.location.hash.replace('#', '');
    if (hash && ['services', 'sectors', 'solutions', 'clients'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const filteredOfferings = useMemo(() => {
    if (!searchTerm) {
      return allOfferings;
    }
    return allOfferings.filter(offering =>
      offering.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.blurb.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allOfferings, searchTerm]);

  const filteredClients = useMemo(() => {
    if (!searchTerm) {
      return allClients;
    }
    return allClients.filter(client =>
      client.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allClients, searchTerm]);

  const services = useMemo(() => filteredOfferings.filter(o => o.category === 'service'), [filteredOfferings]);
  const sectors = useMemo(() => filteredOfferings.filter(o => o.category === 'sector'), [filteredOfferings]);
  const solutions = useMemo(() => filteredOfferings.filter(o => o.category === 'solution'), [filteredOfferings]);

  const renderOfferings = (items: Offering[]) => {
    if (items.length === 0 && searchTerm) {
        return <p className="text-muted-foreground col-span-full text-center py-8">No offerings found matching your search term.</p>;
    }
    if (items.length === 0) {
        return <p className="text-muted-foreground col-span-full text-center py-8">No offerings available in this category.</p>;
    }
    return items.map(offering => (
      <Card key={offering.id} className="hover-lift group">
        <Link href={offering.href} className="block h-full">
          <CardHeader>
            <CardTitle className="text-xl group-hover:text-accent transition-colors">{offering.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{offering.blurb}</p>
          </CardContent>
        </Link>
      </Card>
    ));
  };
  
  const renderClients = (items: Client[]) => {
    if (items.length === 0 && searchTerm) {
        return <p className="text-muted-foreground col-span-full text-center py-8">No clients found matching your search term.</p>;
    }
    if (items.length === 0) {
        return <p className="text-muted-foreground col-span-full text-center py-8">No clients available in this category.</p>;
    }
    return items.map(client => {
      // @ts-ignore
      const Icon = LucideIcons[client.icon] || LucideIcons.Users;
      return (
          <Link key={client.id} href={client.href} className="block h-full">
            <Card className="hover-lift group text-center h-full">
              <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Icon className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{client.title}</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-muted-foreground">{client.description}</p>
              </CardContent>
            </Card>
          </Link>
      );
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">Our Offerings</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto text-balance">
          Explore our comprehensive range of appraisal services, sector expertise, and specialized solutions.
        </p>
      </header>

      <div className="mb-8 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search all offerings..."
            className="w-full pl-10 pr-4 py-2 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search offerings"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto md:h-12">
          <TabsTrigger value="services" className="py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Services</TabsTrigger>
          <TabsTrigger value="sectors" className="py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Sectors</TabsTrigger>
          <TabsTrigger value="solutions" className="py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Solutions</TabsTrigger>
          <TabsTrigger value="clients" className="py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Clients</TabsTrigger>
        </TabsList>
        <TabsContent value="services">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderOfferings(services)}
          </div>
        </TabsContent>
        <TabsContent value="sectors">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderOfferings(sectors)}
          </div>
        </TabsContent>
        <TabsContent value="solutions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderOfferings(solutions)}
          </div>
        </TabsContent>
        <TabsContent value="clients">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderClients(filteredClients)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
