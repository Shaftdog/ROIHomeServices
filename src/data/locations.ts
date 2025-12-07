export interface Location {
  slug: string;
  city: string;
  county: string;
  region: string;
  regionSlug: string;
  description: string;
  keywords: string[];
  nearbyAreas: string[];
  zipCodes: string[];
}

export const locations: Location[] = [
  {
    slug: 'orlando',
    city: 'Orlando',
    county: 'Orange County',
    region: 'Central Florida',
    regionSlug: 'central-florida',
    description: 'Orlando is the heart of Central Florida, home to world-famous theme parks, a thriving real estate market, and diverse neighborhoods from downtown urban living to suburban family communities.',
    keywords: ['Orlando appraisal', 'Orange County home valuation', 'Orlando property assessment', 'Central Florida appraiser'],
    nearbyAreas: ['Winter Park', 'Maitland', 'Altamonte Springs', 'Kissimmee', 'Lake Nona'],
    zipCodes: ['32801', '32803', '32804', '32806', '32807', '32808', '32809', '32810', '32811', '32812', '32817', '32818', '32819', '32820', '32821', '32822', '32824', '32825', '32826', '32827', '32828', '32829', '32830', '32831', '32832', '32833', '32834', '32835', '32836', '32837', '32839']
  },
  {
    slug: 'winter-park',
    city: 'Winter Park',
    county: 'Orange County',
    region: 'Central Florida',
    regionSlug: 'central-florida',
    description: 'Winter Park is an upscale suburb of Orlando known for its historic charm, brick-lined streets, chain of lakes, and prestigious Rollins College. The area features luxury homes, historic estates, and family-friendly neighborhoods.',
    keywords: ['Winter Park appraisal', 'Winter Park home valuation', 'Winter Park luxury appraisal', 'Orange County appraiser'],
    nearbyAreas: ['Orlando', 'Maitland', 'Casselberry', 'Oviedo'],
    zipCodes: ['32789', '32790', '32792', '32793']
  },
  {
    slug: 'tampa',
    city: 'Tampa',
    county: 'Hillsborough County',
    region: 'Tampa Bay',
    regionSlug: 'tampa-bay',
    description: 'Tampa is a major Gulf Coast city with a diverse economy, waterfront properties, historic Ybor City, and growing neighborhoods from South Tampa luxury to suburban New Tampa.',
    keywords: ['Tampa appraisal', 'Hillsborough County home valuation', 'Tampa Bay property assessment', 'Tampa appraiser'],
    nearbyAreas: ['St. Petersburg', 'Clearwater', 'Brandon', 'Temple Terrace', 'Wesley Chapel'],
    zipCodes: ['33602', '33603', '33604', '33605', '33606', '33607', '33609', '33610', '33611', '33612', '33613', '33614', '33615', '33616', '33617', '33618', '33619', '33620', '33621', '33624', '33625', '33626', '33629', '33634', '33635', '33647']
  },
  {
    slug: 'jacksonville',
    city: 'Jacksonville',
    county: 'Duval County',
    region: 'Northeast Florida',
    regionSlug: 'first-coast',
    description: 'Jacksonville is Florida\'s largest city by area, offering diverse real estate from historic riverside neighborhoods to beach communities in Jacksonville Beach, Neptune Beach, and Atlantic Beach.',
    keywords: ['Jacksonville appraisal', 'Duval County home valuation', 'Northeast Florida appraiser', 'Jacksonville property assessment'],
    nearbyAreas: ['St. Augustine', 'Ponte Vedra Beach', 'Orange Park', 'Fleming Island'],
    zipCodes: ['32202', '32204', '32205', '32206', '32207', '32208', '32209', '32210', '32211', '32212', '32214', '32216', '32217', '32218', '32219', '32220', '32221', '32222', '32223', '32224', '32225', '32226', '32227', '32228', '32233', '32234', '32244', '32246', '32250', '32254', '32256', '32257', '32258', '32266', '32277']
  },
  {
    slug: 'miami',
    city: 'Miami',
    county: 'Miami-Dade County',
    region: 'South Florida',
    regionSlug: 'south-florida',
    description: 'Miami is an international gateway city known for luxury waterfront properties, Art Deco architecture, diverse neighborhoods from Brickell to Coral Gables, and a dynamic real estate market.',
    keywords: ['Miami appraisal', 'Miami-Dade home valuation', 'South Florida appraiser', 'Miami luxury appraisal'],
    nearbyAreas: ['Miami Beach', 'Coral Gables', 'Coconut Grove', 'Brickell', 'Doral'],
    zipCodes: ['33125', '33126', '33127', '33128', '33129', '33130', '33131', '33132', '33133', '33134', '33135', '33136', '33137', '33138', '33139', '33140', '33141', '33142', '33143', '33144', '33145', '33146', '33147', '33149', '33150', '33155', '33156', '33157', '33158', '33160', '33161', '33162', '33165', '33166', '33167', '33168', '33169', '33170', '33172', '33173', '33174', '33175', '33176', '33177', '33178', '33179', '33180', '33181', '33182', '33183', '33184', '33185', '33186', '33187', '33189', '33190', '33193', '33194', '33196']
  },
  {
    slug: 'kissimmee',
    city: 'Kissimmee',
    county: 'Osceola County',
    region: 'Central Florida',
    regionSlug: 'central-florida',
    description: 'Kissimmee is located in Osceola County near Walt Disney World, featuring a mix of vacation homes, family communities, and growing suburban developments. It\'s a popular area for investment properties and short-term rentals.',
    keywords: ['Kissimmee appraisal', 'Osceola County home valuation', 'vacation home appraisal', 'short-term rental valuation'],
    nearbyAreas: ['Orlando', 'Celebration', 'St. Cloud', 'Poinciana'],
    zipCodes: ['34741', '34742', '34743', '34744', '34746', '34747', '34758']
  },
  {
    slug: 'lakeland',
    city: 'Lakeland',
    county: 'Polk County',
    region: 'Central Florida',
    regionSlug: 'central-florida',
    description: 'Lakeland sits between Tampa and Orlando, known for its historic downtown, numerous lakes, and growing suburban development. The area offers affordable housing and easy access to both major cities.',
    keywords: ['Lakeland appraisal', 'Polk County home valuation', 'Lakeland property assessment', 'Central Florida appraiser'],
    nearbyAreas: ['Winter Haven', 'Bartow', 'Auburndale', 'Plant City'],
    zipCodes: ['33801', '33803', '33805', '33809', '33810', '33811', '33812', '33813', '33815']
  },
  {
    slug: 'st-petersburg',
    city: 'St. Petersburg',
    county: 'Pinellas County',
    region: 'Tampa Bay',
    regionSlug: 'tampa-bay',
    description: 'St. Petersburg offers waterfront living on Tampa Bay and the Gulf, with a vibrant arts scene, historic neighborhoods, and beautiful beaches. The city features diverse real estate from downtown condos to beachfront properties.',
    keywords: ['St. Petersburg appraisal', 'Pinellas County home valuation', 'waterfront property appraisal', 'St. Pete appraiser'],
    nearbyAreas: ['Tampa', 'Clearwater', 'Gulfport', 'Treasure Island'],
    zipCodes: ['33701', '33702', '33703', '33704', '33705', '33706', '33707', '33710', '33711', '33712', '33713', '33714', '33715', '33716']
  },
  {
    slug: 'daytona-beach',
    city: 'Daytona Beach',
    county: 'Volusia County',
    region: 'Central Florida',
    regionSlug: 'central-florida',
    description: 'Daytona Beach is famous for its hard-packed beach and motorsports, offering oceanfront condos, beachside homes, and mainland family neighborhoods. The area attracts both permanent residents and vacation property investors.',
    keywords: ['Daytona Beach appraisal', 'Volusia County home valuation', 'beachfront property appraisal', 'Daytona appraiser'],
    nearbyAreas: ['Port Orange', 'Ormond Beach', 'New Smyrna Beach', 'DeLand'],
    zipCodes: ['32114', '32117', '32118', '32119', '32124', '32127', '32128', '32129']
  },
  {
    slug: 'fort-lauderdale',
    city: 'Fort Lauderdale',
    county: 'Broward County',
    region: 'South Florida',
    regionSlug: 'south-florida',
    description: 'Fort Lauderdale is known as the "Venice of America" for its extensive canal system, offering luxury waterfront properties, vibrant Las Olas Boulevard, and proximity to the beach.',
    keywords: ['Fort Lauderdale appraisal', 'Broward County home valuation', 'waterfront property appraisal', 'Fort Lauderdale appraiser'],
    nearbyAreas: ['Hollywood', 'Pompano Beach', 'Plantation', 'Coral Springs', 'Boca Raton'],
    zipCodes: ['33301', '33304', '33305', '33306', '33308', '33309', '33311', '33312', '33313', '33314', '33315', '33316', '33317', '33319', '33321', '33322', '33323', '33324', '33325', '33326', '33327', '33328', '33330', '33331', '33332', '33334', '33351']
  }
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find(loc => loc.slug === slug);
}

export function getAllLocationSlugs(): string[] {
  return locations.map(loc => loc.slug);
}

export function getLocationsByRegionSlug(regionSlug: string): Location[] {
  return locations.filter(loc => loc.regionSlug === regionSlug);
}
