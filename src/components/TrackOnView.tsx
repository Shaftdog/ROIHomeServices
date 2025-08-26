'use client';

import { useEffect } from 'react';
import { pushEvent } from '@/lib/gtm';

interface TrackOnViewProps {
  name: string;
  params?: Record<string, any>;
}

export default function TrackOnView({ name, params }: TrackOnViewProps) {
  useEffect(() => {
    pushEvent(name, params);
  }, [name, params]);

  return null;
}
