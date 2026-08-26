import fs from 'fs';
import path from 'path';
import { SEED_EVENTS } from './src/data/seedData.ts';

const storageDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

const filePath = path.join(storageDir, 'store.json');

const defaultStore = {
  events: [],
  bookings: [],
  registrations: [],
  newsletter: [],
};

const ensureStore = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultStore, null, 2));
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...defaultStore, ...parsed };
  } catch {
    fs.writeFileSync(filePath, JSON.stringify(defaultStore, null, 2));
    return { ...defaultStore };
  }
};

const saveStore = (store: any) => {
  fs.writeFileSync(filePath, JSON.stringify(store, null, 2));
};

const loadStore = () => ensureStore();

export const getStoredEvents = () => {
  const store = loadStore();
  return Array.isArray(store.events) ? store.events : [];
};

export const writeStoredEvents = (events: any[]) => {
  const store = loadStore();
  store.events = events;
  saveStore(store);
};

export const appendBooking = (booking: any) => {
  const store = loadStore();
  store.bookings = [booking, ...store.bookings];
  saveStore(store);
};

export const appendRegistration = (registration: any) => {
  const store = loadStore();
  store.registrations = [registration, ...store.registrations];
  saveStore(store);
};

export const appendNewsletter = (email: string) => {
  const store = loadStore();
  const normalized = String(email).trim().toLowerCase();
  if (store.newsletter.some((item: string) => String(item).trim().toLowerCase() === normalized)) {
    return false;
  }

  store.newsletter = [normalized, ...store.newsletter];
  saveStore(store);
  return true;
};

export const seedStoreFromInitialData = () => {
  const store = loadStore();
  if (store.events.length > 0) return;
  store.events = SEED_EVENTS;
  saveStore(store);
};

seedStoreFromInitialData();
