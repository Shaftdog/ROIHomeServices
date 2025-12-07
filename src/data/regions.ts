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
  introSentence: string;
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
    introSentence: 'We specialize in the unique value drivers of the Central Florida market, including theme park proximity, short-term rental zoning compliance, and the rapid suburban growth of master-planned communities like Celebration, Lake Nona, and Horizon West.',
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
    description: `The Tampa Bay real estate market is one of the most diverse and complex in Florida, requiring an appraiser who understands the distinct nuances between "The Burg" and the mainland. At ROI Home Services, we provide precise valuations that account for the specific micro-markets driving value in this region.

In Hillsborough County, we regularly appraise historic properties in neighborhoods like Hyde Park and Seminole Heights, where preservation guidelines and renovation quality significantly impact value. We navigate the booming condo market of Channelside and Water Street, analyzing HOA fees and view amenities that automated models often miss.

Across the bridge in Pinellas County, our team is experienced with the unique challenges of coastal valuation. Whether it's a luxury waterfront estate on Snell Isle, a beach condo in Clearwater, or a mid-century home in St. Petersburg, we carefully analyze flood zone implications (FEMA Zones AE & VE) and insurability issues that are critical for lenders and buyers today. We also cover the rapidly growing suburban corridors of Pasco County, including the master-planned communities of Wesley Chapel and Land O' Lakes.`,
    introSentence: 'We specialize in Tampa Bay\'s diverse micro-markets, from historic bungalows in Hyde Park to waterfront estates on Snell Isle, with deep expertise in coastal flood zone analysis and new construction in Wesley Chapel.',
    localFlavorAngle: 'Historic preservation in Hyde Park and Seminole Heights, coastal flood zone analysis (FEMA AE/VE), Channelside condo market, Snell Isle waterfront estates, Wesley Chapel master-planned communities',
    keyCities: ['Tampa', 'St. Petersburg', 'Clearwater', 'Sarasota', 'Bradenton', 'Venice', 'Lakewood Ranch', 'Wesley Chapel'],
    nearbyRegions: ['central-florida', 'nature-coast', 'paradise-coast'],
    faqs: [
      {
        question: 'What is the cost of a home appraisal in the Tampa Bay area?',
        answer: 'In Hillsborough, Pinellas, and Pasco counties, standard residential appraisals start at $250. Waterfront properties on Tampa Bay or complex estates in South Tampa neighborhoods like Hyde Park may require a custom quote based on property size and complexity.',
      },
      {
        question: 'Do you perform appraisals for historic homes in Tampa?',
        answer: 'Yes, ROI Home Services regularly appraises historic properties in Tampa neighborhoods like Hyde Park, Seminole Heights, and Ybor City. We understand how preservation guidelines, period-appropriate renovations, and historic designation impact property values.',
      },
      {
        question: 'Can you appraise waterfront properties in St. Petersburg?',
        answer: 'Absolutely. We specialize in waterfront valuations throughout Pinellas County, including bayfront estates on Snell Isle, canal-front homes in Gulfport, and beachfront condos in Clearwater and St. Pete Beach. We analyze flood zone implications, seawall condition, and dock utility.',
      },
      {
        question: 'What areas do you cover in the Tampa Bay region?',
        answer: 'We serve all five counties in the Tampa Bay metro: Hillsborough (Tampa, Brandon), Pinellas (St. Petersburg, Clearwater), Pasco (Wesley Chapel, New Port Richey), Manatee (Bradenton, Lakewood Ranch), and Sarasota (Sarasota, Venice).',
      },
      {
        question: 'Do you appraise new construction in Wesley Chapel?',
        answer: 'Yes, we provide valuations for new construction throughout Pasco County, including the master-planned communities of Wesley Chapel and Land O Lakes. We understand CDD fees, builder premiums, and how to properly adjust for community amenities.',
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
    introSentence: 'We specialize in South Florida\'s unique market dynamics, including high-rise condo valuations, luxury waterfront estates, and the international buyer considerations that define Miami-Dade, Broward, and Palm Beach counties.',
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
    introSentence: 'We specialize in Northeast Florida\'s diverse property types, from historic St. Augustine estates to Jacksonville beach communities, with expertise in military relocation appraisals and coastal storm exposure considerations.',
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
    description: `The Space Coast is more than just a beach destination; it is a unique economic hub driven by the aerospace and defense sectors. ROI Home Services delivers data-driven appraisals that reflect the strong housing demand generated by major employers in Cape Canaveral and Melbourne.

Our team understands the distinct valuation differences between the mainland and the barrier islands. We provide expert analysis for the master-planned growth in Viera and Suntree, where accurately adjusting for community amenities, CDD fees, and builder premiums is essential. Conversely, for properties on Merritt Island and along the Indian River Lagoon, we deeply analyze water frontage type (deep water vs. canal), dock utility, and riparian rights.

We also serve the revitalizing markets of Titusville and Cocoa, providing crucial "As-Is" and "After-Repair" values for investors renovating older housing stock for the influx of space-industry professionals. Whether you need a valuation for a riverfront estate or a standard suburban home in Palm Bay, our reports meet the highest standards of accuracy and compliance.`,
    introSentence: 'We specialize in Brevard County\'s aerospace-driven market, from Indian River Lagoon waterfront estates to Viera master-planned communities, with expertise in barrier island flood zones and the housing demand near SpaceX and Blue Origin.',
    localFlavorAngle: 'Aerospace employment (SpaceX, Blue Origin, L3Harris), Viera master-planned communities, Indian River Lagoon waterfront, barrier island flood zones, Merritt Island dock utility and riparian rights',
    keyCities: ['Melbourne', 'Titusville', 'Cocoa Beach', 'Viera', 'Palm Bay', 'Rockledge', 'Merritt Island'],
    nearbyRegions: ['central-florida', 'first-coast', 'treasure-coast'],
    faqs: [
      {
        question: 'What is the cost of a home appraisal in the Space Coast area?',
        answer: 'In Brevard County and the Space Coast, standard residential appraisals start at $250. Waterfront properties on the Indian River Lagoon or complex estates on Merritt Island may require a custom quote based on property complexity and water frontage.',
      },
      {
        question: 'Do you appraise properties near Kennedy Space Center?',
        answer: 'Yes, we provide appraisals throughout the Kennedy Space Center corridor, including Titusville, Merritt Island, and Cape Canaveral. We understand how proximity to aerospace employers like SpaceX and Blue Origin impacts housing demand and values.',
      },
      {
        question: 'Can you appraise waterfront homes on the Indian River Lagoon?',
        answer: 'Absolutely. We specialize in Indian River Lagoon waterfront valuations, analyzing water frontage type (deep water vs. canal), dock utility, seawall condition, riparian rights, and flood zone implications for properties in Merritt Island, Cocoa Beach, and Melbourne.',
      },
      {
        question: 'Do you provide ARV appraisals for investors in Titusville?',
        answer: 'Yes, we provide both "As-Is" and "After-Repair Value" (ARV) appraisals for investors in Titusville, Cocoa, and throughout Brevard County. We understand the revitalizing markets attracting fix-and-flip investors serving the space industry workforce.',
      },
      {
        question: 'What is the turnaround time for appraisals on the Space Coast?',
        answer: 'Standard turnaround for Space Coast residential appraisals is 3-5 business days. We offer 24-48 hour rush service for time-sensitive matters like estate settlements, bail bonds, and closing deadlines.',
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
    introSentence: 'We specialize in the Treasure Coast\'s retirement-focused market, including 55+ communities, golf course estates, and the gated subdivisions that define Port St. Lucie, Stuart, and Vero Beach.',
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
    introSentence: 'We specialize in Southwest Florida\'s luxury market, including Naples estates, Marco Island waterfront, and the seasonal rental dynamics that define Collier and Lee counties.',
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
    introSentence: 'We specialize in the Nature Coast\'s unique property types, including spring-front homes in Crystal River, gulf-access waterfront in Homosassa, and the rural acreage that defines Citrus, Hernando, and Levy counties.',
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
    introSentence: 'We specialize in the Forgotten Coast\'s unique market, including vacation rentals on St. George Island, historic waterfront in Apalachicola, and hurricane recovery valuations throughout Franklin and Gulf counties.',
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
    introSentence: 'We specialize in the Emerald Coast\'s vacation property market, including short-term rental income analysis in Destin, luxury 30A beachfront estates, and the high-demand condo market throughout Okaloosa and Walton counties.',
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
    introSentence: 'We specialize in the Florida Heartland\'s agricultural and rural properties, including cattle ranches in Okeechobee, citrus groves in Highlands County, and the large-lot residential estates throughout this affordable region.',
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
    introSentence: 'We specialize in North-Central Florida\'s diverse markets, from student investment properties near University of Florida to world-class equestrian estates in Ocala horse country.',
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
    introSentence: 'We specialize in the Florida Panhandle\'s unique markets, including military relocation appraisals near NAS Pensacola, state government housing in Tallahassee, and the rural inland properties throughout this diverse region.',
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
