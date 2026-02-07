# Timecard

A mobile-responsive time card web application for tracking daily work hours with GPS-based location detection and interactive charts.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (authentication + PostgreSQL database)
- **Charting**: Recharts
- **Geolocation**: Browser Geolocation API + reverse geocoding (OpenStreetMap Nominatim or Google Geocoding API)

## Features

- Email/password authentication (sign up, login, forgot password)
- Interactive bar chart showing last 10 days of hours worked
- Click chart bars to edit existing time entries
- Log new time entries with auto-calculated hours
- GPS-based city/state auto-detection
- Manual location override
- PWA support (installable on mobile)
- Mobile-first responsive design
- Protected routes via middleware
- Row Level Security on all database tables

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account and project

## Setup

### 1. Clone and install

```bash
git clone https://github.com/halliday2026/timecard.git
cd timecard
npm install
```

### 2. Configure environment

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
GOOGLE_GEOCODING_API_KEY=              # Optional: leave empty for free Nominatim
```

### 3. Set up the database

Run the SQL migration in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Paste the contents of `supabase/migrations/001_create_time_entries.sql`
4. Click **Run**

This creates the `time_entries` table with indexes, RLS policies, and an auto-updating `updated_at` trigger.

### 4. Configure Supabase Auth

In your Supabase dashboard under **Authentication > Settings**:

- Ensure **Email** provider is enabled
- Set **Confirm email** to **disabled** for immediate login after signup (or enable for production)
- Add your app URL to **Site URL** (e.g., `http://localhost:3000` for development)

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    (auth)/           # Auth pages (login, signup, forgot-password)
    (app)/            # Protected app pages
      dashboard/      # Main dashboard with chart and time logging
    api/
      geocode/        # Reverse geocoding API proxy
    layout.tsx        # Root layout with metadata and PWA setup
    manifest.ts       # PWA manifest
    globals.css       # Tailwind + CSS custom properties
  components/
    charts/           # Recharts bar chart wrapper
    dashboard/        # Dashboard client component
    layout/           # Header with logout
    timecard/         # Time entry modal form
    ui/               # Reusable UI components (EmptyState)
  hooks/
    useGeolocation.ts # Browser geolocation + reverse geocoding hook
  lib/
    supabase/         # Supabase client utilities (browser, server, middleware)
  types/
    database.ts       # TypeScript types for database tables
supabase/
  migrations/         # SQL migration scripts
public/
  sw.js               # Service worker for PWA
  *.png               # Favicon and PWA icon assets
```

## Production Build

```bash
npm run build
npm start
```

## Geocoding

By default, the app uses the free **OpenStreetMap Nominatim** API for reverse geocoding (converting GPS coordinates to city/state). This has a 1 request/second rate limit enforced server-side.

To use **Google Geocoding API** instead (higher rate limits), set `GOOGLE_GEOCODING_API_KEY` in your `.env.local`.
