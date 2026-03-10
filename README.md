# Nudge — Vanespårare (Habit Tracker PWA)

En mobilanpassad Next.js 15 PWA för att bygga bättre vanor. Svensk UI.

## Stack

- **Next.js 15** (App Router)
- **Supabase** (Auth + PostgreSQL)
- **Tailwind CSS** + shadcn/ui
- **TypeScript**

## Kom igång

### 1. Installera beroenden

```bash
npm install
```

### 2. Konfigurera Supabase

Skapa ett projekt på [supabase.com](https://supabase.com) och kopiera URL + anon key.

```bash
cp .env.local.example .env.local
```

Fyll i dina Supabase-nycklar i `.env.local`.

### 3. Kör databasmigrationen

Kör SQL:en i `supabase/migrations/001_initial.sql` i Supabase SQL Editor.

### 4. Aktivera Magic Link

I Supabase Dashboard → Authentication → Providers, se till att Email (Magic Link) är aktiverat.

### 5. Starta dev-servern

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## Funktioner

- **Magic Link auth** — Logga in med e-post, inget lösenord
- **Dashboard** — Lista mål med streak-räknare och vecko-heatmap
- **Check-in** — Markera mål som klart eller skippa per dag
- **CRUD** — Skapa, redigera, ta bort mål
- **Onboarding** — Välkomstflöde för nya användare
- **PWA** — Installera som app på mobilen
- **RLS** — Row Level Security — varje användare ser bara sin data

## Projektstruktur

```
src/
├── app/
│   ├── auth/login/       # Magic link login
│   ├── auth/callback/    # Auth callback
│   ├── dashboard/        # Huvudvy med mål
│   ├── goals/new/        # Skapa mål
│   ├── goals/[id]/       # Måldetalj + redigera
│   ├── onboarding/       # Välkomstflöde
│   └── profile/          # Profilsida
├── components/           # UI-komponenter
├── lib/
│   ├── supabase/         # Supabase klienter
│   ├── types.ts          # TypeScript-typer
│   ├── streak.ts         # Streak-beräkning
│   └── utils.ts          # Hjälpfunktioner
└── middleware.ts          # Auth-skydd
```
