
export interface AppraisalFormData {
  // Contact details
  name: string;
  email: string;
  phone: string;
  
  // Property details
  address: string;
  zipCode?: string; // Add dedicated ZIP code field
  dateNeeded: string;
  purpose: string;
  requester: string;
  sizeOfHome: number;
  siteInfluences?: string;
  sizeOfLot?: number;
  isLotOverOneAcre?: boolean;
  hasSiteInfluence?: boolean;
  numberOfLivingUnits: string;
  scopeOfInspection: string;
  
  // Schedule details
  appointmentDate?: string;
  appointmentTime?: string;
  
  // Payment details
  quoteAmount?: number | string;
}
