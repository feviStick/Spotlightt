export type CityStatus = 'active' | 'upcoming';

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  slug: string;
  status: CityStatus;
  heroImage: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  themeColor: string;
  description: string;
  registrationFee: number;
  icon: string;
  accentGradient: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  cityId: string;
  mapUrl: string;
  parkingAvailable: boolean;
  image: string;
}

export interface TicketTier {
  id: 'general' | 'vip' | 'premium';
  name: string;
  price: number;
  perks: string[];
  available: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  cityId: string;
  venueId: string;
  host: string;
  guestArtists: string[];
  startDate: string; // ISO
  endDate: string; // ISO
  registrationOpens: string;
  registrationCloses: string;
  poster: string;
  trailerImage?: string;
  ticketPrice: number; // base / general
  vipPrice: number;
  premiumPrice: number;
  registrationFee: number;
  maxAudience: number;
  maxPerformers: number;
  remainingSeats: number;
  status: 'upcoming' | 'live' | 'completed' | 'sold_out';
  featured: boolean;
  timeline?: { time: string; activity: string }[];
  likesCount?: number;
}

export interface PerformerRegistration {
  id: string;
  eventId: string;
  categoryId: string;
  name: string;
  email: string;
  phone: string;
  instagram: string;
  age: string;
  city: string;
  title: string;
  language: string;
  experience: string;
  description: string;
  duration: number; // minutes
  applicationStatus: 'pending' | 'approved' | 'rejected';
  paymentStatus: 'paid' | 'pending';
  transactionId: string;
  createdAt: string;
  assignedSlot?: string;
  certificateUrl?: string;
}

export interface AudienceBooking {
  id: string;
  bookingRef: string;
  eventId: string;
  ticketType: 'general' | 'vip' | 'premium';
  quantity: number;
  coupon?: string;
  pricePerTicket: number;
  subtotal: number;
  discount: number;
  amount: number;
  name: string;
  email: string;
  phone: string;
  paymentMethod: 'upi' | 'card' | 'netbanking';
  paymentStatus: 'paid' | 'refunded';
  transactionId: string;
  qrData: string;
  status: 'confirmed' | 'checked_in' | 'cancelled';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  review: string;
  image: string;
  eventType: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'performer' | 'audience' | 'booking';
  order: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: string;
  city: string;
  date: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}
