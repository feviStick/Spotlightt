import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  City,
  Category,
  Venue,
  EventItem,
  PerformerRegistration,
  AudienceBooking,
  Testimonial,
  FAQItem,
  GalleryItem,
  Coupon,
} from '../types';
import {
  SEED_CITIES,
  SEED_CATEGORIES,
  SEED_VENUES,
  SEED_EVENTS,
  SEED_TESTIMONIALS,
  SEED_FAQS,
  SEED_GALLERY,
  VALID_COUPONS,
} from '../data/seedData';
import confetti from 'canvas-confetti';

interface BookingResult {
  ok: boolean;
  booking?: AudienceBooking;
  error?: string;
}

interface RegistrationResult {
  ok: boolean;
  registration?: PerformerRegistration;
  error?: string;
}

interface SpotlightContextType {
  cities: City[];
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  categories: Category[];
  venues: Venue[];
  events: EventItem[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  gallery: GalleryItem[];
  coupons: Coupon[];
  bookings: AudienceBooking[];
  registrations: PerformerRegistration[];
  
  // Audio atmosphere
  ambientAudioPlaying: boolean;
  toggleAmbientAudio: () => void;

  // Selected modals
  selectedEventForModal: EventItem | null;
  setSelectedEventForModal: (event: EventItem | null) => void;
  selectedCategoryForModal: Category | null;
  setSelectedCategoryForModal: (category: Category | null) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // Core actions
  bookTicket: (data: {
    eventId: string;
    ticketType: 'general' | 'vip' | 'premium';
    quantity: number;
    coupon?: string;
    name: string;
    email: string;
    phone: string;
    paymentMethod: 'upi' | 'card' | 'netbanking';
  }) => Promise<BookingResult>;

  registerPerformer: (data: {
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
    duration: number;
  }) => Promise<RegistrationResult>;

  likeEvent: (eventId: string) => void;
  applyCoupon: (code: string, subtotal: number) => { valid: boolean; discountPercent: number; discountAmount: number; message: string };

  // Admin actions
  adminApprovePerformer: (registrationId: string) => void;
  adminRejectPerformer: (registrationId: string) => void;
  adminCheckInBooking: (bookingRefOrId: string) => { success: boolean; message: string; booking?: AudienceBooking };
  adminAddEvent: (newEvent: Omit<EventItem, 'id' | 'remainingSeats' | 'likesCount' | 'status'>) => void;
  adminUpdateEventSeats: (eventId: string, remainingSeats: number) => void;
  adminStats: {
    totalRevenue: number;
    totalBookings: number;
    totalPerformerRegistrations: number;
    activeEventsCount: number;
  };
}

const SpotlightContext = createContext<SpotlightContextType | undefined>(undefined);

const normalizeBooking = (booking: any): AudienceBooking => ({
  ...booking,
  bookingRef: booking.bookingRef ?? booking.booking_ref,
  eventId: booking.eventId ?? booking.event_id,
  ticketType: booking.ticketType ?? booking.ticket_type,
  pricePerTicket: booking.pricePerTicket ?? booking.price_per_ticket,
  paymentMethod: booking.paymentMethod ?? booking.payment_method,
  paymentStatus: booking.paymentStatus ?? booking.payment_status,
  transactionId: booking.transactionId ?? booking.transaction_id,
  qrData: booking.qrData ?? booking.qr_data,
  createdAt: booking.createdAt ?? booking.created_at,
});

const normalizeRegistration = (registration: any): PerformerRegistration => ({
  ...registration,
  eventId: registration.eventId ?? registration.event_id,
  categoryId: registration.categoryId ?? registration.category_id,
  applicationStatus: registration.applicationStatus ?? registration.application_status,
  paymentStatus: registration.paymentStatus ?? registration.payment_status,
  transactionId: registration.transactionId ?? registration.transaction_id,
  assignedSlot: registration.assignedSlot ?? registration.assigned_slot,
  certificateUrl: registration.certificateUrl ?? registration.certificate_url,
  createdAt: registration.createdAt ?? registration.created_at,
});

export const SpotlightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cities
  const [cities, setCities] = useState<City[]>(SEED_CITIES);
  const [selectedCity, setSelectedCity] = useState<City>(SEED_CITIES[0]);

  // Categories & Venues
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [venues] = useState<Venue[]>(SEED_VENUES);

  // Events (with localStorage persistence)
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('spotlightt_events');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SEED_EVENTS;
  });

  // Bookings (with localStorage persistence)
  const [bookings, setBookings] = useState<AudienceBooking[]>(() => {
    try {
      const saved = localStorage.getItem('spotlightt_bookings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'b-demo-1',
        bookingRef: 'SPT849201',
        eventId: 'e1',
        ticketType: 'vip',
        quantity: 2,
        pricePerTicket: 999,
        subtotal: 1998,
        discount: 200,
        amount: 1798,
        name: 'Arjun Mehra',
        email: 'arjun.mehra@example.com',
        phone: '+91 98765 43210',
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        transactionId: 'MOCK_UPI_99218274',
        qrData: JSON.stringify({ ref: 'SPT849201', eventId: 'e1', name: 'Arjun Mehra', tickets: 2 }),
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ];
  });

  // Performer Registrations
  const [registrations, setRegistrations] = useState<PerformerRegistration[]>(() => {
    try {
      const saved = localStorage.getItem('spotlightt_registrations');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'p-demo-1',
        eventId: 'e1',
        categoryId: 'comedy',
        name: 'Devansh Singhal',
        email: 'devansh.comedy@gmail.com',
        phone: '+91 98123 45678',
        instagram: '@devansh_jokes',
        age: '24',
        city: 'Chandigarh',
        title: 'The Great Indian Tech Job',
        language: 'Hindi / Hinglish',
        experience: 'Intermediate (12 open mics)',
        description: 'Observational comedy about corporate appraisals, sector 17 shopping, and punjabi parents.',
        duration: 6,
        applicationStatus: 'approved',
        paymentStatus: 'paid',
        transactionId: 'MOCK_REG_838271',
        assignedSlot: 'Slot #3 · 20:35 PM',
        certificateUrl: 'https://spotlightt.co/certificates/devansh-singhal-e1',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ];
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(SEED_TESTIMONIALS);
  const [faqs, setFaqs] = useState<FAQItem[]>(SEED_FAQS);
  const [gallery, setGallery] = useState<GalleryItem[]>(SEED_GALLERY);
  const [coupons] = useState<Coupon[]>(VALID_COUPONS);

  useEffect(() => {
    let active = true;

    fetch('/api/overview')
      .then(async response => {
        if (!response.ok) throw new Error('Overview request failed');
        return response.json();
      })
      .then(overview => {
        if (!active) return;
        if (Array.isArray(overview.cities)) setCities(overview.cities);
        if (Array.isArray(overview.categories)) setCategories(overview.categories);
        if (Array.isArray(overview.events)) setEvents(overview.events);
        if (Array.isArray(overview.testimonials)) setTestimonials(overview.testimonials);
        if (Array.isArray(overview.faqs)) setFaqs(overview.faqs);
        if (Array.isArray(overview.gallery)) setGallery(overview.gallery);
      })
      .catch(error => console.warn('Using local Spotlightt data:', error));

    return () => {
      active = false;
    };
  }, []);

  // Modals & UI
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventItem | null>(null);
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<Category | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('spotlightt_events', JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('spotlightt_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('spotlightt_registrations', JSON.stringify(registrations));
    } catch (e) {
      console.error(e);
    }
  }, [registrations]);

  // Ambient Audio (Web Audio API subtle pleasant theater warm ambient pad)
  const [ambientAudioPlaying, setAmbientAudioPlaying] = useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const oscillatorRefs = React.useRef<{ osc1?: OscillatorNode; osc2?: OscillatorNode; gain?: GainNode }>({});

  const toggleAmbientAudio = useCallback(() => {
    if (ambientAudioPlaying) {
      if (oscillatorRefs.current.gain) {
        oscillatorRefs.current.gain.gain.setTargetAtTime(0, audioContextRef.current?.currentTime || 0, 0.5);
      }
      setTimeout(() => {
        try {
          oscillatorRefs.current.osc1?.stop();
          oscillatorRefs.current.osc2?.stop();
        } catch {}
      }, 600);
      setAmbientAudioPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 2);

        // Warm stage chord (root + fifth warm sine waves)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(146.83, ctx.currentTime); // D3

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(220.00, ctx.currentTime); // A3

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        oscillatorRefs.current = { osc1, osc2, gain: gainNode };
        setAmbientAudioPlaying(true);
      } catch (err) {
        console.warn('Audio could not start automatically', err);
      }
    }
  }, [ambientAudioPlaying]);

  // Coupon check
  const applyCoupon = useCallback((code: string, subtotal: number) => {
    const cleanCode = code.trim().toUpperCase();
    const found = VALID_COUPONS.find(c => c.code === cleanCode);
    if (found) {
      const discountAmount = Math.round((subtotal * found.discountPercent) / 100);
      return {
        valid: true,
        discountPercent: found.discountPercent,
        discountAmount,
        message: `Promo Applied! Saved ${found.discountPercent}% (₹${discountAmount})`,
      };
    }
    return {
      valid: false,
      discountPercent: 0,
      discountAmount: 0,
      message: 'Invalid promo code. Try SPOTLIGHT10 or FIRSTSHOW20',
    };
  }, []);

  // Book ticket action
  const bookTicket = useCallback(async (data: {
    eventId: string;
    ticketType: 'general' | 'vip' | 'premium';
    quantity: number;
    coupon?: string;
    name: string;
    email: string;
    phone: string;
    paymentMethod: 'upi' | 'card' | 'netbanking';
  }): Promise<BookingResult> => {
    const targetEvent = events.find(e => e.id === data.eventId);
    if (!targetEvent) {
      return { ok: false, error: 'Event not found' };
    }

    if (data.quantity > targetEvent.remainingSeats) {
      return { ok: false, error: `Only ${targetEvent.remainingSeats} seats remain for this performance.` };
    }

    const pricePerTicket =
      data.ticketType === 'premium'
        ? targetEvent.premiumPrice
        : data.ticketType === 'vip'
        ? targetEvent.vipPrice
        : targetEvent.ticketPrice;

    const subtotal = pricePerTicket * data.quantity;
    let discount = 0;
    if (data.coupon) {
      const couponCheck = applyCoupon(data.coupon, subtotal);
      if (couponCheck.valid) {
        discount = couponCheck.discountAmount;
      }
    }
    const finalAmount = Math.max(0, subtotal - discount);

    const bookingRef = `SPT${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: AudienceBooking = {
      id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bookingRef,
      eventId: targetEvent.id,
      ticketType: data.ticketType,
      quantity: data.quantity,
      coupon: data.coupon,
      pricePerTicket,
      subtotal,
      discount,
      amount: finalAmount,
      name: data.name,
      email: data.email,
      phone: data.phone,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'paid',
      transactionId: `TXN_${Date.now().toString(36).toUpperCase()}_${Math.floor(Math.random() * 9999)}`,
      qrData: JSON.stringify({
        ref: bookingRef,
        event: targetEvent.title,
        eventId: targetEvent.id,
        name: data.name,
        qty: data.quantity,
        tier: data.ticketType.toUpperCase(),
        date: targetEvent.startDate,
        venue: targetEvent.venueId,
      }),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || !result.ok || !result.booking) {
      return { ok: false, error: result.message || 'Booking could not be completed.' };
    }

    const savedBooking = normalizeBooking(result.booking);

    // Update state after the backend confirms the booking.
    setBookings(prev => [savedBooking, ...prev]);
    setEvents(prev =>
      prev.map(ev =>
        ev.id === targetEvent.id
          ? { ...ev, remainingSeats: Math.max(0, ev.remainingSeats - data.quantity) }
          : ev
      )
    );

    // Golden confetti trigger
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5C518', '#FFE58C', '#FFFFFF', '#A855F7'],
      });
    } catch {}

    return { ok: true, booking: savedBooking };
  }, [events, applyCoupon]);

  // Register performer action
  const registerPerformer = useCallback(async (data: {
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
    duration: number;
  }): Promise<RegistrationResult> => {
    const targetEvent = events.find(e => e.id === data.eventId);
    if (!targetEvent) {
      return { ok: false, error: 'Event not found' };
    }

    // Check duplicate
    const alreadyRegistered = registrations.some(
      r => r.eventId === data.eventId && r.email.toLowerCase() === data.email.toLowerCase()
    );
    if (alreadyRegistered) {
      return { ok: false, error: 'You have already registered for this event with this email address.' };
    }

    const regId = `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newRegistration: PerformerRegistration = {
      id: regId,
      eventId: targetEvent.id,
      categoryId: data.categoryId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      instagram: data.instagram,
      age: data.age,
      city: data.city,
      title: data.title,
      language: data.language,
      experience: data.experience,
      description: data.description,
      duration: data.duration,
      applicationStatus: 'approved', // Auto-approved in demo for instant satisfaction
      paymentStatus: 'paid',
      transactionId: `REG_${Date.now().toString(36).toUpperCase()}_${Math.floor(1000 + Math.random() * 9000)}`,
      assignedSlot: `Slot #${registrations.filter(r => r.eventId === targetEvent.id).length + 1} (Tentative)`,
      certificateUrl: `https://thespotlightt.co/certificates/${regId}`,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch('/api/performers/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || !result.ok || !result.registration) {
      return { ok: false, error: result.message || 'Registration could not be completed.' };
    }

    const savedRegistration = normalizeRegistration(result.registration);
    setRegistrations(prev => [savedRegistration, ...prev]);

    // Confetti
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#F5C518', '#38BDF8', '#A855F7', '#10B981'],
      });
    } catch {}

    return { ok: true, registration: savedRegistration };
  }, [events, registrations]);

  // Like event
  const likeEvent = useCallback((eventId: string) => {
    setEvents(prev =>
      prev.map(ev =>
        ev.id === eventId ? { ...ev, likesCount: (ev.likesCount || 0) + 1 } : ev
      )
    );
  }, []);

  // Admin actions
  const adminApprovePerformer = useCallback((registrationId: string) => {
    setRegistrations(prev =>
      prev.map(r =>
        r.id === registrationId ? { ...r, applicationStatus: 'approved' } : r
      )
    );
  }, []);

  const adminRejectPerformer = useCallback((registrationId: string) => {
    setRegistrations(prev =>
      prev.map(r =>
        r.id === registrationId ? { ...r, applicationStatus: 'rejected' } : r
      )
    );
  }, []);

  const adminCheckInBooking = useCallback((bookingRefOrId: string) => {
    const clean = bookingRefOrId.trim().toUpperCase();
    const found = bookings.find(b => b.bookingRef.toUpperCase() === clean || b.id === clean);
    if (!found) {
      return { success: false, message: 'Ticket reference not found in database.' };
    }
    if (found.status === 'checked_in') {
      return { success: false, message: `Ticket ${found.bookingRef} was ALREADY checked in!`, booking: found };
    }
    setBookings(prev =>
      prev.map(b => (b.id === found.id ? { ...b, status: 'checked_in' } : b))
    );
    return { success: true, message: `Access granted for ${found.name} (${found.quantity} tickets - ${found.ticketType.toUpperCase()})`, booking: found };
  }, [bookings]);

  const adminAddEvent = useCallback((newEvent: Omit<EventItem, 'id' | 'remainingSeats' | 'likesCount' | 'status'>) => {
    const created: EventItem = {
      ...newEvent,
      id: `e-${Date.now()}`,
      remainingSeats: newEvent.maxAudience,
      status: 'upcoming',
      likesCount: 1,
    };
    setEvents(prev => [created, ...prev]);
  }, []);

  const adminUpdateEventSeats = useCallback((eventId: string, remainingSeats: number) => {
    setEvents(prev =>
      prev.map(ev =>
        ev.id === eventId ? { ...ev, remainingSeats } : ev
      )
    );
  }, []);

  // Admin stats calculation
  const adminStats = useMemo(() => {
    const totalRevenue = bookings.reduce((acc, b) => acc + (b.paymentStatus === 'paid' ? b.amount : 0), 0);
    const totalBookings = bookings.length;
    const totalPerformerRegistrations = registrations.length;
    const activeEventsCount = events.filter(e => e.status === 'upcoming' || e.status === 'live').length;
    return {
      totalRevenue,
      totalBookings,
      totalPerformerRegistrations,
      activeEventsCount,
    };
  }, [bookings, registrations, events]);

  const value = useMemo(
    () => ({
      cities,
      selectedCity,
      setSelectedCity,
      categories,
      venues,
      events,
      testimonials,
      faqs,
      gallery,
      coupons,
      bookings,
      registrations,
      ambientAudioPlaying,
      toggleAmbientAudio,
      selectedEventForModal,
      setSelectedEventForModal,
      selectedCategoryForModal,
      setSelectedCategoryForModal,
      isAdminOpen,
      setIsAdminOpen,
      bookTicket,
      registerPerformer,
      likeEvent,
      applyCoupon,
      adminApprovePerformer,
      adminRejectPerformer,
      adminCheckInBooking,
      adminAddEvent,
      adminUpdateEventSeats,
      adminStats,
    }),
    [
      cities,
      selectedCity,
      categories,
      venues,
      events,
      testimonials,
      faqs,
      gallery,
      coupons,
      bookings,
      registrations,
      ambientAudioPlaying,
      toggleAmbientAudio,
      selectedEventForModal,
      selectedCategoryForModal,
      isAdminOpen,
      bookTicket,
      registerPerformer,
      likeEvent,
      applyCoupon,
      adminApprovePerformer,
      adminRejectPerformer,
      adminCheckInBooking,
      adminAddEvent,
      adminUpdateEventSeats,
      adminStats,
    ]
  );

  return <SpotlightContext.Provider value={value}>{children}</SpotlightContext.Provider>;
};

export const useSpotlight = () => {
  const context = useContext(SpotlightContext);
  if (!context) {
    throw new Error('useSpotlight must be used within a SpotlightProvider');
  }
  return context;
};
