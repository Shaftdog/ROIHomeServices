export interface RegionFAQ {
  question: string;
  answer: string;
}

export interface Region {
  slug: string;
  name: string;
  vernacularName: string;
  counties: string[];
  description: string;
  localFlavorAngle: string;
  keyCities: string[];
  nearbyRegions: string[];
  faqs: RegionFAQ[];
}

export const regions: Region[] = [
  {
    slug: 'central-florida',
    name: 'Central Florida',
    vernacularName: 'Central FL',
    counties: ['Orange', 'Osceola', 'Seminole', 'Lake', 'Polk', 'Sumter', 'Volusia', 'Marion'],
    description: `Central Florida is the heart of the Sunshine State, home to world-renowned theme parks including Walt Disney World, Universal Orlando, and SeaWorld. This region has experienced explosive growth over the past two decades, transforming from quiet citrus groves into thriving master-planned communities and suburban developments.

The real estate market in Central Florida is uniquely influenced by the tourism industry, with significant demand for vacation rental properties, short-term rental investments, and homes near major attractions. Communities like Celebration, Lake Nona, and Horizon West represent the cutting edge of planned residential development, while historic neighborhoods in Winter Park and downtown Orlando offer charm and walkability.

Our certified appraisers understand the nuances of valuing properties in this dynamic market—from vacation homes near Disney to equestrian estates in Ocala, from lakefront properties in Clermont to urban condos in downtown Orlando. Whether you're dealing with estate settlements, divorce proceedings, tax appeals, or investment analysis, we provide accurate, defensible valuations backed by deep local market knowledge.`,
    localFlavorAngle: 'Theme park proximity (Disney, Universal, SeaWorld), rapid suburban growth, vacation home investments, short-term rental properties, master-planned communities',
    keyCities: ['Orlando', 'Kissimmee', 'Sanford', 'Clermont', 'Winter Park', 'Lakeland', 'Daytona Beach', 'Ocala', 'The Villages', 'Deland'],
    nearbyRegions: ['space-coast', 'nature-coast', 'tampa-bay', 'north-central-florida'],
    faqs: [
      {
        question: 'Who provides appraisals near Disney World?',
        answer: 'ROI Home Services provides certified real estate appraisals throughout the Disney World area, including Kissimmee, Celebration, and the Orlando tourist corridor. Our appraisers have extensive experience valuing vacation rental properties, short-term rental investments, and residential homes near major theme parks.',
      },
      {
        question: 'How much does a home appraisal cost in Orlando?',
        answer: 'Standard residential appraisals in Orlando and Central Florida start at $250 for typical single-family homes. Complex properties, luxury homes, or properties requiring detailed analysis may cost more. We provide instant quotes through our online booking system with transparent, upfront pricing.',
      },
      {
        question: 'What is the turnaround time for appraisals in Central Florida?',
        answer: 'Our standard turnaround for residential appraisals in Central Florida is 3-5 business days. We also offer expedited service with 24-48 hour rush options available for time-sensitive matters like estate settlements, bail bonds, or urgent legal proceedings.',
      },
      {
        question: 'Do you appraise vacation rental properties in Kissimmee?',
        answer: 'Yes, we specialize in vacation rental and short-term rental property appraisals throughout Kissimmee and the greater Orlando area. Our appraisers understand the unique factors affecting vacation property values, including rental income potential, proximity to attractions, and HOA regulations.',
      },
      {
        question: 'What counties do you serve in Central Florida?',
        answer: 'We serve all eight counties in the Central Florida region: Orange, Osceola, Seminole, Lake, Polk, Sumter, Volusia, and Marion counties. This includes major cities like Orlando, Kissimmee, Winter Park, Lakeland, Daytona Beach, Ocala, and The Villages.',
      },
    ],
  },
  {
    slug: 'tampa-bay',
    name: 'Tampa Bay',
    vernacularName: 'Sun Coast',
    counties: ['Hillsborough', 'Pinellas', 'Pasco', 'Manatee', 'Sarasota'],
    description: `The Tampa Bay region, also known as the Sun Coast, encompasses Florida's vibrant Gulf Coast metropolitan area. From the urban energy of downtown Tampa to the beaches of St. Petersburg and the cultural richness of Sarasota, this region offers diverse real estate opportunities.

Our appraisers provide expert valuations for waterfront properties, planned unit developments (PUDs), and coastal zoning considerations throughout the Tampa Bay area.`,
    localFlavorAngle: 'Waterfront properties, planned unit developments (PUDs), coastal zoning, downtown urban revival, barrier island properties',
    keyCities: ['Tampa', 'St. Petersburg', 'Clearwater', 'Sarasota', 'Bradenton', 'Venice', 'Lakewood Ranch', 'Wesley Chapel'],
    nearbyRegions: ['central-florida', 'nature-coast', 'paradise-coast'],
    faqs: [
      {
        question: 'Do you provide waterfront appraisals in Tampa Bay?',
        answer: 'Yes, ROI Home Services specializes in waterfront property appraisals throughout Tampa Bay, including canal-front homes, bayfront estates, and Gulf beach properties in Pinellas and Manatee counties.',
      },
      {
        question: 'What areas do you cover in the Tampa Bay region?',
        answer: 'We serve Hillsborough, Pinellas, Pasco, Manatee, and Sarasota counties, including Tampa, St. Petersburg, Clearwater, Sarasota, Bradenton, and surrounding communities.',
      },
    ],
  },
  {
    slug: 'south-florida',
    name: 'South Florida',
    vernacularName: 'Gold Coast',
    counties: ['Miami-Dade', 'Broward', 'Palm Beach'],
    description: `South Florida's Gold Coast represents one of the most dynamic and valuable real estate markets in the United States. From Miami's international luxury market to Fort Lauderdale's waterways and Palm Beach's prestigious estates, this region demands specialized appraisal expertise.

Our certified appraisers understand the complexities of condo associations, high-value luxury estates, and the unique factors affecting South Florida property values.`,
    localFlavorAngle: 'Condo associations, high-value luxury estates, international buyers, waterfront living, Art Deco architecture',
    keyCities: ['Miami', 'Fort Lauderdale', 'West Palm Beach', 'Boca Raton', 'Coral Gables', 'Miami Beach', 'Hollywood', 'Pompano Beach'],
    nearbyRegions: ['treasure-coast', 'florida-heartland'],
    faqs: [
      {
        question: 'Do you appraise luxury properties in Miami?',
        answer: 'Yes, ROI Home Services provides certified appraisals for luxury estates, waterfront properties, and high-rise condos throughout Miami-Dade County. Our appraisers have experience with high-value properties and understand the unique South Florida market.',
      },
      {
        question: 'Can you appraise condos in Fort Lauderdale?',
        answer: 'We provide condo appraisals throughout Broward County, including Fort Lauderdale, Hollywood, and Pompano Beach. We understand condo association factors, special assessments, and waterfront premiums.',
      },
    ],
  },
  {
    slug: 'first-coast',
    name: 'First Coast',
    vernacularName: 'First Coast',
    counties: ['Duval', 'Nassau', 'St. Johns', 'Clay', 'Baker'],
    description: `The First Coast region encompasses Northeast Florida, anchored by Jacksonville—Florida's largest city by area. This region blends historic charm in St. Augustine with modern development in Jacksonville's urban core and beach communities.

Our appraisers provide expert valuations for historic homes, coastal properties, and the diverse neighborhoods throughout the First Coast.`,
    localFlavorAngle: 'Historic homes, coastal storm exposure, military housing, beach communities, St. Augustine heritage properties',
    keyCities: ['Jacksonville', 'St. Augustine', 'Fernandina Beach', 'Ponte Vedra Beach', 'Orange Park', 'Fleming Island'],
    nearbyRegions: ['north-central-florida', 'space-coast'],
    faqs: [
      {
        question: 'Do you provide appraisals in Jacksonville?',
        answer: 'Yes, we serve all of Duval County including Jacksonville, the beaches (Jacksonville Beach, Neptune Beach, Atlantic Beach), and surrounding areas like Orange Park and Fleming Island.',
      },
      {
        question: 'Can you appraise historic homes in St. Augustine?',
        answer: 'Our appraisers have experience valuing historic properties in St. Augustine and throughout St. Johns County, understanding the unique considerations for heritage homes.',
      },
    ],
  },
  {
    slug: 'space-coast',
    name: 'Space Coast',
    vernacularName: 'Space Coast',
    counties: ['Brevard'],
    description: `The Space Coast is defined by its aerospace heritage and barrier island communities. Home to Kennedy Space Center and a thriving commercial space industry, this region offers unique real estate opportunities from beachfront condos to mainland family neighborhoods.

Our appraisers understand the economic drivers of this market, including aerospace employment and the tourism industry.`,
    localFlavorAngle: 'Aerospace employment hubs, barrier islands, beachfront properties, space industry growth, Cocoa Beach tourism',
    keyCities: ['Melbourne', 'Titusville', 'Cocoa Beach', 'Viera', 'Palm Bay', 'Rockledge', 'Merritt Island'],
    nearbyRegions: ['central-florida', 'first-coast', 'treasure-coast'],
    faqs: [
      {
        question: 'Do you appraise properties near Kennedy Space Center?',
        answer: 'Yes, we provide appraisals throughout Brevard County, including properties near Kennedy Space Center in Titusville and Merritt Island.',
      },
      {
        question: 'What is the turnaround time for appraisals on the Space Coast?',
        answer: 'Standard turnaround for Space Coast appraisals is 3-5 business days. Rush service is available for time-sensitive matters.',
      },
    ],
  },
  {
    slug: 'treasure-coast',
    name: 'Treasure Coast',
    vernacularName: 'Treasure Coast',
    counties: ['Martin', 'St. Lucie', 'Indian River'],
    description: `The Treasure Coast offers a more relaxed pace than South Florida while maintaining excellent amenities. Known for retiree communities, gated subdivisions, and beautiful beaches, this region attracts those seeking quality of life.

Our appraisers specialize in retirement community properties, golf course homes, and waterfront estates throughout the Treasure Coast.`,
    localFlavorAngle: 'Retiree communities, gated subdivisions, golf course properties, Indian River citrus heritage',
    keyCities: ['Port St. Lucie', 'Stuart', 'Vero Beach', 'Fort Pierce', 'Sebastian', 'Jensen Beach'],
    nearbyRegions: ['space-coast', 'south-florida', 'florida-heartland'],
    faqs: [
      {
        question: 'Do you appraise properties in gated communities?',
        answer: 'Yes, we have extensive experience appraising properties in gated and deed-restricted communities throughout the Treasure Coast, including golf course homes and 55+ communities.',
      },
    ],
  },
  {
    slug: 'paradise-coast',
    name: 'Paradise Coast',
    vernacularName: 'Paradise Coast',
    counties: ['Collier', 'Lee'],
    description: `The Paradise Coast encompasses Southwest Florida's premier destinations, including Naples and Marco Island. Known for high-end seasonal rentals, golf communities, and luxury waterfront living, this region demands specialized appraisal expertise.

Our appraisers understand the seasonal market dynamics and luxury property valuations unique to this area.`,
    localFlavorAngle: 'High-end seasonal rentals, golf communities, luxury waterfront, Naples prestige, Marco Island exclusivity',
    keyCities: ['Naples', 'Marco Island', 'Bonita Springs', 'Fort Myers', 'Cape Coral', 'Estero'],
    nearbyRegions: ['tampa-bay', 'florida-heartland'],
    faqs: [
      {
        question: 'Do you appraise luxury homes in Naples?',
        answer: 'Yes, ROI Home Services provides certified appraisals for luxury estates, golf course properties, and waterfront homes throughout Naples and Collier County.',
      },
    ],
  },
  {
    slug: 'nature-coast',
    name: 'Nature Coast',
    vernacularName: 'Nature Coast',
    counties: ['Citrus', 'Hernando', 'Levy'],
    description: `The Nature Coast offers Florida's most pristine natural environment, with crystal-clear springs, gulf access, and rural character. This region features diverse properties from waterfront homes to rural acreage.

Our appraisers understand flood zone considerations, rural property valuations, and the unique appeal of Nature Coast living.`,
    localFlavorAngle: 'Rural acreage, waterfront springs and gulf access, flood zone considerations, natural Florida lifestyle',
    keyCities: ['Crystal River', 'Inverness', 'Spring Hill', 'Brooksville', 'Homosassa', 'Weeki Wachee'],
    nearbyRegions: ['central-florida', 'tampa-bay', 'north-central-florida'],
    faqs: [
      {
        question: 'Do you appraise waterfront properties on the Nature Coast?',
        answer: 'Yes, we provide appraisals for riverfront, spring-front, and gulf-access properties throughout Citrus and Hernando counties.',
      },
    ],
  },
  {
    slug: 'forgotten-coast',
    name: 'Forgotten Coast',
    vernacularName: 'Forgotten Coast',
    counties: ['Franklin', 'Gulf', 'Wakulla'],
    description: `The Forgotten Coast remains one of Florida's best-kept secrets, offering pristine beaches and small-town charm. This region features vacation rentals, fishing communities, and properties recovering from recent hurricane impacts.

Our appraisers understand the unique market dynamics of this remote but beautiful coastal region.`,
    localFlavorAngle: 'Vacation rentals, hurricane recovery zones, pristine beaches, small-town coastal living',
    keyCities: ['Apalachicola', 'Port St. Joe', 'Carrabelle', 'Mexico Beach', 'St. George Island'],
    nearbyRegions: ['emerald-coast', 'panhandle', 'north-central-florida'],
    faqs: [
      {
        question: 'Do you appraise vacation rentals on the Forgotten Coast?',
        answer: 'Yes, we provide appraisals for vacation rental properties in Apalachicola, St. George Island, Port St. Joe, and throughout Franklin and Gulf counties.',
      },
    ],
  },
  {
    slug: 'emerald-coast',
    name: 'Emerald Coast',
    vernacularName: 'Emerald Coast',
    counties: ['Okaloosa', 'Walton', 'Santa Rosa'],
    description: `The Emerald Coast is famous for its stunning white-sand beaches and emerald-green waters. This region is a hotspot for short-term rental investments, vacation condos, and beachfront properties.

Our appraisers specialize in STR (short-term rental) investment analyses and understand the vacation property market dynamics.`,
    localFlavorAngle: 'Short-term rental (STR) investment analyses, vacation condos, beachfront properties, 30A luxury',
    keyCities: ['Destin', 'Fort Walton Beach', 'Pensacola Beach', 'Santa Rosa Beach', 'Niceville', 'Crestview', 'Panama City Beach'],
    nearbyRegions: ['panhandle', 'forgotten-coast'],
    faqs: [
      {
        question: 'Do you appraise short-term rental properties in Destin?',
        answer: 'Yes, we specialize in STR and vacation rental appraisals throughout Destin, 30A, and the Emerald Coast, understanding rental income potential and market dynamics.',
      },
    ],
  },
  {
    slug: 'florida-heartland',
    name: 'Florida Heartland',
    vernacularName: 'FL Heartland',
    counties: ['Highlands', 'Okeechobee', 'Glades', 'Hendry', 'DeSoto', 'Hardee'],
    description: `The Florida Heartland represents the state's agricultural core, featuring large lots, rural residential properties, and working ranches. This region offers affordable living and wide-open spaces.

Our appraisers understand agricultural land valuations, rural residential properties, and the unique factors affecting Heartland real estate.`,
    localFlavorAngle: 'Agricultural land, rural residential, large lots, cattle ranches, citrus groves',
    keyCities: ['Sebring', 'Okeechobee', 'Arcadia', 'Clewiston', 'LaBelle', 'Avon Park'],
    nearbyRegions: ['central-florida', 'treasure-coast', 'paradise-coast', 'south-florida'],
    faqs: [
      {
        question: 'Do you appraise agricultural land in the Florida Heartland?',
        answer: 'Yes, we provide appraisals for agricultural properties, ranches, citrus groves, and rural residential properties throughout the Florida Heartland counties.',
      },
    ],
  },
  {
    slug: 'north-central-florida',
    name: 'North-Central Florida',
    vernacularName: 'North-Central FL',
    counties: ['Alachua', 'Marion', 'Putnam', 'Bradford', 'Union', 'Gilchrist', 'Columbia', 'Suwannee', 'Lafayette', 'Dixie'],
    description: `North-Central Florida blends university town energy in Gainesville with horse farm country in Ocala. This region offers diverse properties from student housing to equestrian estates.

Our appraisers understand university housing markets, horse farm valuations, and the rural properties throughout this region.`,
    localFlavorAngle: 'University housing (UF), horse farms, equestrian estates, springs recreation, rural Florida',
    keyCities: ['Gainesville', 'Ocala', 'Palatka', 'Lake City', 'Live Oak', 'Alachua'],
    nearbyRegions: ['central-florida', 'first-coast', 'nature-coast', 'forgotten-coast'],
    faqs: [
      {
        question: 'Do you appraise student housing near University of Florida?',
        answer: 'Yes, we provide appraisals for student housing, investment properties, and residential homes throughout Gainesville and Alachua County.',
      },
      {
        question: 'Can you appraise horse farms in Ocala?',
        answer: 'Our appraisers have experience valuing equestrian properties, horse farms, and agricultural estates throughout Marion County and the Ocala area.',
      },
    ],
  },
  {
    slug: 'panhandle',
    name: 'Florida Panhandle',
    vernacularName: 'Panhandle',
    counties: ['Escambia', 'Bay', 'Jackson', 'Holmes', 'Washington', 'Calhoun', 'Liberty', 'Gadsden', 'Leon', 'Jefferson', 'Madison', 'Taylor', 'Hamilton'],
    description: `The Florida Panhandle stretches from Pensacola to Tallahassee, offering diverse real estate from military housing near naval bases to rural inland markets. This region combines Southern charm with Florida sunshine.

Our appraisers understand military housing considerations, state capital dynamics, and the rural markets throughout the Panhandle.`,
    localFlavorAngle: 'Military housing (bases), state capital (Tallahassee), rural inland markets, Southern influence',
    keyCities: ['Pensacola', 'Panama City', 'Tallahassee', 'Marianna', 'Quincy', 'Chipley', 'Perry'],
    nearbyRegions: ['emerald-coast', 'forgotten-coast', 'north-central-florida'],
    faqs: [
      {
        question: 'Do you provide appraisals near military bases in Pensacola?',
        answer: 'Yes, we serve the Pensacola area including properties near NAS Pensacola and other military installations in Escambia County.',
      },
      {
        question: 'Do you appraise properties in Tallahassee?',
        answer: 'We provide appraisals throughout Leon County and the Tallahassee area, understanding the state capital market dynamics.',
      },
    ],
  },
];

export function getRegionBySlug(slug: string): Region | undefined {
  return regions.find((region) => region.slug === slug);
}

export function getAllRegionSlugs(): string[] {
  return regions.map((region) => region.slug);
}

export function getRegionsByNearby(regionSlug: string): Region[] {
  const region = getRegionBySlug(regionSlug);
  if (!region) return [];
  return region.nearbyRegions
    .map((slug) => getRegionBySlug(slug))
    .filter((r): r is Region => r !== undefined);
}
