# Real Live Website Setup for Spotlightt

This project is being upgraded from a local prototype into a real website architecture.

## Production flow

Frontend -> API -> Database -> Automation

## Components added

- SQLite database via better-sqlite3
- Data service layer for persistent storage
- API endpoints for bookings and performer registration
- Newsletter persistence
- Seed data loaded into the database automatically

## How it works now

- Events are read from the database instead of only browser memory
- Booking requests are stored in the `bookings` table
- Performer registration requests are stored in the `registrations` table
- Newsletter signups are saved in `newsletter`

## Next production upgrades

1. Connect Razorpay or Stripe for live payments
2. Add email automation via Resend / SendGrid
3. Add admin dashboard with login
4. Deploy frontend to Vercel
5. Deploy backend to Render or Railway
6. Use Supabase / Neon for cloud database in production

## Local database path

The app creates the SQLite DB under:

`data/spotlightt.db`

## Important note

This is still a local-first production foundation. For public live deployment, you should move the database to a cloud-managed DB and expose a real public API.
