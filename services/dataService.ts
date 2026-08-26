import { SEED_EVENTS } from '../src/data/seedData';
import {
  appendBooking,
  appendNewsletter,
  appendRegistration,
  getStoredEvents,
  writeStoredEvents,
} from '../storage';

const normalizeEvent = (event: any) => ({
  ...event,
  guestArtists: event.guestArtists ?? event.guest_artists ?? [],
  longDescription: event.longDescription ?? event.long_description ?? event.description,
  categoryId: event.categoryId ?? event.category_id,
  cityId: event.cityId ?? event.city_id,
  venueId: event.venueId ?? event.venue_id,
  startDate: event.startDate ?? event.start_date,
  endDate: event.endDate ?? event.end_date,
  registrationOpens: event.registrationOpens ?? event.registration_opens,
  registrationCloses: event.registrationCloses ?? event.registration_closes,
  ticketPrice: event.ticketPrice ?? event.ticket_price,
  vipPrice: event.vipPrice ?? event.vip_price,
  premiumPrice: event.premiumPrice ?? event.premium_price,
  registrationFee: event.registrationFee ?? event.registration_fee,
  maxAudience: event.maxAudience ?? event.max_audience,
  maxPerformers: event.maxPerformers ?? event.max_performers,
  remainingSeats: event.remainingSeats ?? event.remaining_seats,
  likesCount: event.likesCount ?? event.likes_count ?? 0,
});

const ensureSeedData = () => {
  const events = getStoredEvents();
  if (!events || events.length === 0) {
    writeStoredEvents(SEED_EVENTS.map(normalizeEvent));
  }
};

ensureSeedData();

export const getAllEvents = () => {
  const events = getStoredEvents();
  return (events || []).map(normalizeEvent);
};

export const getEventById = (id: string) => {
  const events = getAllEvents();
  return events.find((event) => event.id === id || event.slug === id) ?? null;
};

export const insertBooking = (booking: any) => {
  appendBooking(booking);
};

export const insertRegistration = (registration: any) => {
  appendRegistration(registration);
};

export const insertNewsletter = (email: string) => {
  const inserted = appendNewsletter(email);
  if (!inserted) {
    throw new Error('Already subscribed');
  }
};
