# ConnectHub

A dual-sided marketplace for matching micro-influencers (creators) with local businesses and campaigns. Creators browse and apply to campaigns; brands post requirements and discover relevant creators.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, React Router DOM v7 |
| Styling | Tailwind CSS 3, PostCSS, Autoprefixer |
| Icons | Lucide React |
| Backend | Node.js, Express 4 (ESM) |
| ORM | Prisma 5 |
| Database | PostgreSQL (hosted on Supabase) |
| Auth | Custom JWT + email OTP + bcrypt |
| Email | Resend API |
| Frontend deploy | Vercel |
| Backend deploy | Render |

---

## Project Structure

```
connecto/
├── Frontend/
│   ├── src/
│   │   ├── App.jsx                    # Route definitions
│   │   ├── main.jsx                   # React entry point
│   │   ├── CreatorLanding.jsx         # OTP signup flow
│   │   ├── CreatorDashboard.jsx       # Authenticated creator view
│   │   ├── LoginModal.jsx             # Email/password login
│   │   ├── ProfileOnboardingModal.jsx # Profile completion modal
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   └── TermsOfService.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json                    # SPA rewrite rule
│   └── package.json
└── Backend/
    ├── src/
    │   ├── index.js                   # Express server, all routes
    │   └── utils/
    │       └── mailer.js              # OTP email via Resend
    ├── prisma/
    │   └── schema.prisma
    └── package.json
```

---

## Architecture Overview

The frontend is a React SPA that communicates with the Express backend over REST (JSON). There is no GraphQL, WebSocket, or message queue layer.

```
Browser (React SPA)
    │
    │  HTTP/JSON REST
    ▼
Express API (Node.js)
    │
    │  Prisma ORM
    ▼
PostgreSQL (Supabase)
```

**CORS:** The backend allows all origins (`origin: "*"`). Tighten this before production.

**Token storage:** JWTs are stored in `localStorage` under the key `auth_token`. The user ID is stored separately under `user_id`.

**Frontend routes:**

| Path | Component |
|---|---|
| `/` | Marketing landing page |
| `/creator` | Creator signup (OTP flow) |
| `/dashboard` | Creator campaign dashboard (auth-gated client-side) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

---

## Database Schema

Defined in `Backend/prisma/schema.prisma`.

### `CreatorProfile`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `email` | String | Unique |
| `password` | String | bcrypt hash |
| `phone` | String? | |
| `name` | String? | |
| `creator_location` | String? | |
| `audience_top_locations` | String[] | |
| `areas_of_interest` | String[] | |
| `audience_primary_age_min/max` | Int? | |
| `audience_gender_split` | String? | |
| `wallet_balance` | Decimal | Default `0` |
| `is_verified` | Boolean | |
| `profile_completion` | Int | |

### `SocialProfile`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | |
| `creator_id` | UUID | FK → CreatorProfile |
| `platform` | Enum | See below |
| `handle` | String | |
| `follower_count` | Int? | |
| `profile_image_url` | String? | |
| `url` | String? | |

`SocialPlatform` enum: `TWITTER`, `INSTAGRAM`, `YOUTUBE`, `TIKTOK`, `SNAPCHAT`, `TELEGRAM`, `WHATSAPP`, `TWITCH`, `OTHER`

### `Campaign`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | |
| `title` | String | |
| `target_audience_interests` | String[] | |
| `target_audience_location` | String? | |
| `target_audience_age_min/max` | Int? | |
| `payout_amount` | Decimal | |
| `currency` | String | Default `INR` |
| `min_followers_required` | Int? | |
| `cover_image_url` | String? | |

### `Collaboration`

Links a creator to a campaign. `status` defaults to `PENDING`.

### `OtpVerification`

| Column | Type |
|---|---|
| `email` | String (unique) |
| `otp` | String |
| `expires_at` | DateTime |

---

## API Reference

Base URL is set via `VITE_API_URL` on the frontend.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/request-otp` | — | Generate and email a 6-digit OTP |
| `POST` | `/api/auth/verify-otp` | — | Validate OTP → returns short-lived `verifiedToken` (15 min) |
| `POST` | `/api/auth/register` | — | Create account using `verifiedToken` + password → returns JWT |
| `POST` | `/api/auth/login` | — | Email + password → returns JWT |
| `POST` | `/api/profile/complete` | Bearer | Create or update creator profile and social profiles |
| `GET` | `/api/profile/me` | Bearer | Fetch authenticated user's profile |
| `GET` | `/api/campaigns` | Bearer | Paginated campaign list (`?offset=0&limit=6`) |
| `GET` | `/health` | — | Health check |

**Authorization header format:**

```
Authorization: Bearer <token>
```

---

## Authentication

Registration uses a 3-step OTP flow:

1. **Request OTP** — a 6-digit code is generated, stored in `OtpVerification` with a 10-minute expiry, and sent to the user's email via Resend.
2. **Verify OTP** — the code is validated and a short-lived JWT (`{ email, verified: true }`, 15 min) is returned.
3. **Register** — the client sends the `verifiedToken` + chosen password. The backend creates a `CreatorProfile` with a bcrypt-hashed password and issues a 7-day JWT (`{ id }`).

Login is a straightforward email + bcrypt comparison → 7-day JWT.

There are no refresh tokens, OAuth providers, or password reset flows currently.

---

## Environment Variables

Neither `.env.example` file exists. Create these manually before running.

### `Backend/.env`

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?pgbouncer=true
JWT_SECRET=your-secret-here
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=Connecto <noreply@yourdomain.com>  # optional, has default
PORT=5000                                             # optional, defaults to 5000
```

### `Frontend/.env`

```env
VITE_API_URL=http://localhost:5000
```

> The `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` variables exist in the live `.env` but the Supabase JS client is not used anywhere in the source code. Skip them for local dev.

---

## Local Setup

### Prerequisites

- Node.js ≥ 18
- A PostgreSQL database (local or Supabase free tier)
- A [Resend](https://resend.com) account for OTP emails (optional — the server skips sending if `RESEND_API_KEY` is absent)

### 1. Clone

```bash
git clone https://github.com/sunilj24-maker/Connecto.git
cd Connecto/connecto
```

### 2. Backend

```bash
cd Backend
npm install
```

Create `Backend/.env` with the variables listed above, then:

```bash
# Generate the Prisma client
npx prisma generate

# Push the schema to your database (creates tables)
npx prisma db push

# Start the development server (nodemon)
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend

```bash
cd ../Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

Vite starts at `http://localhost:5173`.

### 4. Production build (frontend)

```bash
npm run build    # outputs to dist/
npm run preview  # serve the dist/ build locally
```

---

## Deployment

### Frontend → Vercel

The `Frontend/vercel.json` contains a catch-all rewrite rule that sends all paths to `index.html`, enabling client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Set `VITE_API_URL` to your Render backend URL in the Vercel project environment settings.

### Backend → Render

Set all `Backend/.env` variables as environment variables in your Render service.

The start command is:

```bash
npm run build && npm start
# expands to: prisma generate && node src/index.js
```

---

## Known Limitations

- **All routes in one file.** `Backend/src/index.js` is ~500 lines with no router splitting.
- **Campaign apply is not implemented.** The "Apply For" button on the dashboard has no handler and no corresponding API endpoint.
- **Saved campaigns and collaborations** have schema models but no API endpoints.
- **`enrichment.service.js`** (social profile scraping via RapidAPI) and **`findMatchingCreators.ts`** (campaign matching algorithm) are not imported anywhere — they are non-functional stubs.
- **Mixed module systems.** The backend uses ESM; `enrichment.service.js` uses CommonJS `require`.
- **`sortCampaigns`** in `CreatorDashboard.jsx` reads `a.interests` but the API returns `target_audience_interests` — the sort does nothing.
- **No test suite.** No unit, integration, or e2e tests exist.
