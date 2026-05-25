export type ViewType = 
  | 'home' 
  | 'rooms' 
  | 'services' 
  | 'dining' 
  | 'contact' 
  | 'privacy' 
  | 'dashboard'
  | 'enquiry';

export type LanguageType = 'EN' | 'HI';

export interface Room {
  id: string;
  name: string;
  nameHI: string;
  category: 'Deluxe' | 'Suite' | 'Presidential' | 'Club';
  priceINR: number;
  capacityMax: number;
  sizeSqFt: number;
  viewType: string;
  viewTypeHI: string;
  description: string;
  descriptionHI: string;
  amenities: string[];
  amenitiesHI: string[];
  images: string[];
  featured: boolean;
}

export interface Service {
  id: string;
  name: string;
  nameHI: string;
  description: string;
  descriptionHI: string;
  timing: string;
  icon: string;
  image: string;
  features: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  nameHI: string;
  category: 'Appetizer' | 'Main Heritage' | 'Beverage' | 'Dessert';
  priceINR: number;
  description: string;
  descriptionHI: string;
  isVeg: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  bookedAt: string;
}

export interface UserSession {
  fullName: string;
  email: string;
  phone: string;
  isRegistered: boolean;
  avatarSeed: string;
}

export interface EnquirySubmission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'Received' | 'Concierge Assigned';
}
