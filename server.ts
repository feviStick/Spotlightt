import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import {
  SEED_CITIES,
  SEED_CATEGORIES,
  SEED_TESTIMONIALS,
  SEED_FAQS,
  SEED_GALLERY,
  VALID_COUPONS,
} from './src/data/seedData.ts';
import { getAllEvents, getEventById, insertBooking, insertNewsletter, insertRegistration } from './services/dataService.ts';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 8787);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'Spotlightt API',
    timestamp: new Date().toISOString(),
    mode: process.env.NODE_ENV ?? 'development',
  });
});

app.get('/api/overview', (_req, res) => {
  res.json({
    cities: SEED_CITIES,
    categories: SEED_CATEGORIES,
    events: getAllEvents(),
    testimonials: SEED_TESTIMONIALS,
    faqs: SEED_FAQS,
    gallery: SEED_GALLERY,
    coupons: VALID_COUPONS,
  });
});

app.get('/api/events', (_req, res) => {
  const events = getAllEvents();
  res.json({
    total: events.length,
    events,
  });
});

app.get('/api/events/:id', (req, res) => {
  const event = getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ ok: false, message: 'Event not found' });
  }

  return res.json({ ok: true, event });
});

app.get('/api/categories', (_req, res) => {
  res.json({ ok: true, categories: SEED_CATEGORIES });
});

app.get('/api/cities', (_req, res) => {
  res.json({ ok: true, cities: SEED_CITIES });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, message: 'Name, email, and message are required.' });
  }

  return res.json({
    ok: true,
    message: 'Thanks! Your note has been received by The Spotlightt team.',
    submission: { name, email, message },
  });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ ok: false, message: 'Email is required.' });
  }

  try {
    insertNewsletter(String(email).trim());
    return res.json({
      ok: true,
      message: 'Welcome to the Spotlightt Circle. Early access invites are on the way.',
      email,
    });
  } catch (error) {
    return res.status(409).json({
      ok: false,
      message: 'This email is already subscribed.',
    });
  }
});

app.post('/api/bookings', (req, res) => {
  const { eventId, ticketType, quantity, coupon, name, email, phone, paymentMethod } = req.body ?? {};

  if (!eventId || !name || !email || !phone) {
    return res.status(400).json({ ok: false, message: 'Booking information is incomplete.' });
  }

  const event = getEventById(eventId);
  if (!event) {
    return res.status(404).json({ ok: false, message: 'Event not found.' });
  }

  const pricePerTicket = ticketType === 'premium' ? event.premiumPrice : ticketType === 'vip' ? event.vipPrice : event.ticketPrice;
  const subtotal = pricePerTicket * Number(quantity ?? 1);
  const discount = 0;
  const amount = Math.max(0, subtotal - discount);
  const bookingRef = `SPT${Math.floor(100000 + Math.random() * 900000)}`;
  const bookingId = `b-${Date.now()}`;

  const booking = {
    id: bookingId,
    booking_ref: bookingRef,
    event_id: event.id,
    ticket_type: ticketType,
    quantity: Number(quantity ?? 1),
    coupon: coupon || null,
    price_per_ticket: pricePerTicket,
    subtotal,
    discount,
    amount,
    name,
    email,
    phone,
    payment_method: paymentMethod || 'upi',
    payment_status: 'paid',
    transaction_id: `TXN_${Date.now().toString(36).toUpperCase()}`,
    qr_data: JSON.stringify({ ref: bookingRef, eventId: event.id, name, qty: Number(quantity ?? 1) }),
    status: 'confirmed',
    created_at: new Date().toISOString(),
  };

  try {
    insertBooking(booking);
    return res.status(201).json({ ok: true, booking: { ...booking, bookingRef }, message: 'Ticket booked successfully.' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Booking could not be saved.' });
  }
});

app.post('/api/performers/register', (req, res) => {
  const payload = req.body ?? {};
  const { eventId, categoryId, name, email, phone, instagram, age, city, title, language, experience, description, duration } = payload;

  if (!eventId || !categoryId || !name || !email || !phone || !title) {
    return res.status(400).json({ ok: false, message: 'Performer registration details are incomplete.' });
  }

  const event = getEventById(eventId);
  if (!event) {
    return res.status(404).json({ ok: false, message: 'Event not found.' });
  }

  const regId = `p-${Date.now()}`;
  const registration = {
    id: regId,
    event_id: event.id,
    category_id: categoryId,
    name,
    email,
    phone,
    instagram: instagram || '@spotlightt',
    age: String(age || '22'),
    city: city || 'Chandigarh',
    title,
    language: language || 'Hindi / Hinglish',
    experience: experience || 'Beginner',
    description: description || 'Original performance ready for the stage.',
    duration: Number(duration || 5),
    application_status: 'approved',
    payment_status: 'paid',
    transaction_id: `REG_${Date.now().toString(36).toUpperCase()}`,
    assigned_slot: 'Slot Pending',
    certificate_url: `https://thespotlightt.co/certificates/${regId}`,
    created_at: new Date().toISOString(),
  };

  try {
    insertRegistration(registration);
    return res.status(201).json({ ok: true, registration, message: 'Performer registration successful.' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Registration could not be saved.' });
  }
});

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    return res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Spotlightt API is running on http://localhost:${port}`);
});
