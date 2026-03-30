# 🚀 Job Tracker

Track your job applications and land your first tech job in 2026!
Real auth with Supabase — sign in from any device and your data follows you.

---

## Quick Start

### 1. Set up Supabase (free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project**, give it a name, set a database password, pick a region
3. Wait for it to finish provisioning (~1 min)

### 2. Create the database tables

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste the entire contents of `supabase-schema.sql` into the editor
4. Click **Run** — you should see "Success. No rows returned"

### 3. Get your API keys

1. Go to **Settings → API** in your Supabase dashboard
2. Copy the **Project URL** and **anon public** key

### 4. Configure the app

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 5. Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Enable Google Sign-In (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or use an existing one)
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
4. Set **Authorized redirect URIs** to:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```
   (Find your project ref in Supabase → Settings → General)
5. Copy the **Client ID** and **Client Secret**
6. In Supabase dashboard, go to **Authentication → Providers → Google**
7. Enable it and paste your Client ID and Client Secret
8. Save

Google Sign-In will now work alongside email/password.

---

## Project Structure

```
src/
├── app/
│   ├── auth/callback/
│   │   └── route.ts          # OAuth redirect handler
│   ├── globals.css            # Theme variables & all styles
│   ├── layout.tsx             # Root layout with metadata
│   └── page.tsx               # Main page (auth flow + dashboard)
├── components/
│   ├── AddJobForm.tsx         # New application form
│   ├── AuthPage.tsx           # Sign in / Sign up / Google OAuth
│   ├── Header.tsx             # Top nav bar with sign out
│   ├── JobRow.tsx             # Expandable job row with status controls
│   ├── Motivation.tsx         # Dynamic encouragement banner
│   ├── ProfileSetup.tsx       # First-time name & goal setup
│   └── StatCard.tsx           # Stat counter card
├── hooks/
│   ├── useAuth.ts             # Supabase auth state & methods
│   └── useJobTracker.ts       # Jobs + profile CRUD via Supabase
├── lib/
│   ├── constants.ts           # Status config, work types, style maps
│   ├── supabase-browser.ts    # Browser Supabase client
│   └── supabase-server.ts     # Server Supabase client
├── middleware.ts               # Session refresh middleware
└── types/
    └── index.ts               # TypeScript interfaces

supabase-schema.sql             # Database tables + RLS policies
.env.local.example              # Env vars template
```

## Features

- **Real authentication** — Email/Password + Google OAuth via Supabase
- **Cloud database** — Postgres with Row Level Security (your data is private)
- **Cross-device sync** — sign in anywhere, data is always there
- **Add applications** — company, position, remote/on-site/hybrid, location
- **Status management** — pending → accepted / rejected (click any row)
- **Live counters** — total, pending, accepted, rejected
- **Filter & search** — by status, work type, or free text search
