
export interface Offering {
  id: string;
  title: string;
  category: 'service' | 'sector' | 'solution';
  blurb: string;
  href: string;
}
