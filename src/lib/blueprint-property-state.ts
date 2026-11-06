'use client';

import { useSyncExternalStore } from 'react';

/**
 * The property state the buyer chose, shared by every Buy button on the page so a
 * Florida buyer answers once and a refused buyer sees no live Buy buttons further
 * down. A module-level store read through useSyncExternalStore: SSR-safe (the
 * server snapshot is always '') and survives no reload, which is intended.
 */
let current = '';
const listeners = new Set<() => void>();

export function setPropertyState(next: string) {
  if (next === current) return;
  current = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function usePropertyState(): string {
  return useSyncExternalStore(subscribe, () => current, () => '');
}
