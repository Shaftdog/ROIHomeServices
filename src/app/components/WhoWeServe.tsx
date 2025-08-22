
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPlaceholder } from "@/components/shared/icon-placeholder";
import type { Client } from "@/types/clients";
import * as LucideIcons from 'lucide-react';
import Link from "next/link";

export default function WhoWeServe() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch('/data/clients.json')
      .then(res => res.json())
      .then((data: Client[]) => {
        setClients(data);
      });
  }, []);

  return (
    <section id="who-we-serve" className="py-16 md:py-24 bg-light-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Who We Serve</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map((item) => {
            // @ts-expect-error - Dynamic icon access from lucide-react
            const Icon = LucideIcons[item.icon] || LucideIcons.Users;
            return (
              <Link key={item.id} href={item.href} className="block">
                <Card className="hover-lift bg-white dark:bg-card text-center h-full">
                  <CardHeader>
                    <IconPlaceholder icon={Icon} label={`${item.title} Icon`} className="mb-4 mx-auto" />
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
