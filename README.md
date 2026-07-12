# RD Engineering - Corporate Portal

RD Engineering is a premier industrial engineering website built with Next.js, TypeScript, Tailwind CSS, Prisma, and Supabase. The portal features dynamic project galleries, quote request workflows, structured careers application pipeline, and a secure administration panel.

---

## Technical Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Framer Motion (Theme-aware dark/light modes)
- **Database:** Supabase PostgreSQL (via Prisma ORM)
- **Email Delivery:** Resend API with SMTP fallback
- **Messaging:** WhatsApp Business Cloud API fallback to direct link
- **Deployment:** Vercel

---

## Local Development Setup

### 1. Installation
Clone or navigate to the project directory and install dependencies:
```bash
npm install
```

### 2. Configure Database & Environment
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the values in `.env.local` with your active service credentials:
- **Supabase URL / Key:** Found in your Supabase dashboard under Project Settings > API.
- **DATABASE_URL / DIRECT_URL:** PostgreSQL connection strings found in Supabase > Database. Add `?pgbouncer=true` to your pooled database URL.
- **Resend API Key:** Register on [Resend](https://resend.com) to get an API key.
- **WhatsApp Cloud API:** Found in your Meta for Developers portal under WhatsApp > Getting Started.

### 3. Database Initialization & Migrations
Sync your local Prisma schema with your live Supabase database and run migrations:
```bash
# Push database schema directly to Supabase
npx prisma db push

# Generate Prisma Client types
npx prisma generate

# Seed initial tables (creates Admin account and core services list)
npm run db:seed
```

### 4. Admin Panel Login
Once seeded, navigate to `http://localhost:3000/admin/login` and log in with:
- **Username:** `admin`
- **Password:** `admin123`

---

## Production Deployment (Vercel)

1. Connect this repository to your **Vercel** dashboard.
2. In Vercel Project settings, configure all environment variables specified in `.env.local`.
3. Set the **Build Command** to `npx prisma generate && next build`.
4. Deploy the project. The custom `vercel.json` provides strict security headers to keep client submissions secure.

---

## Supabase Row Level Security (RLS)
The database tables are protected using Supabase Row Level Security.
- Public read access is permitted on public contents (Blogs, Services, Projects, Gallery, FAQs).
- Public write-only access is permitted on submission tables (Contacts, Quotes, Careers, PageViews) to allow visitors to submit forms.
- Full read/write administrative access is granted only to authenticated users.

The full DDL schema and policy definitions are saved in [supabase.sql](./supabase.sql). You can copy and execute it directly in the Supabase SQL Editor.
