# Spotlightt

> **Become The Spotlight.**

Spotlightt is a cinematic live-entertainment platform built for discovering and experiencing live shows such as stand-up comedy, poetry, music and open mics.

## Why Spotlightt?

Live entertainment is fragmented across social posts, event pages and word of mouth. Spotlightt brings discovery into one focused experience designed around the excitement of being at a live show.

## Features

- Discover live entertainment and upcoming shows
- Explore stand-up comedy, poetry, music and open-mic experiences
- Cinematic, premium visual design focused on the event experience
- Responsive experience for desktop and mobile
- Motion-driven interactions and polished UI details
- AI-ready foundation using Google's Gemini SDK

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** for development and production builds
- **Tailwind CSS** for styling
- **Motion** for animations
- **Lucide React** for icons
- **Express** for server-side functionality
- **Google GenAI SDK** for AI capabilities

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The development server runs on port `3000`.

### Production build

```bash
npm run build
```

### Type check

```bash
npm run lint
```

## Environment Variables

If you enable server-side or Gemini functionality, keep credentials in environment variables rather than committing them to GitHub.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

Never commit real API keys, tokens, passwords or private credentials.

## Project Structure

```text
Spotlightt/
├── src/              # React application
├── public/            # Static assets
├── index.html         # Application entry HTML
├── package.json       # Dependencies and scripts
└── README.md          # Project documentation
```

## Product Direction

Spotlightt is designed to grow from an event-discovery experience into a complete live-entertainment platform, including event discovery, performer profiles, booking flows, event management and AI-powered experiences.

## Status

**Active development**

## License

No open-source license has been added yet. Until a license is explicitly provided, all rights are reserved by the repository owner.
