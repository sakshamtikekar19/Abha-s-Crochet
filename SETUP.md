# Crochet App – Setup Guide

## 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### Required for full functionality

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Same as above |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key (test or live) | [Razorpay Dashboard](https://dashboard.razorpay.com) → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | Same as above (server-only, never exposed) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number with country code (e.g. 919876543210) | Your business number |
| `NEXT_PUBLIC_INSTAGRAM_HANDLE` | Instagram username (no @) | Your handle |
| `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY` | For orders & admin (bypasses RLS) | See "Supabase service key" in section 2 |
| `ADMIN_EMAIL` | Owner email for admin login | Your email |
| `ADMIN_PASSWORD` | Owner password for admin login | Choose a secure password |
| `ADMIN_SECRET` | Secret for signing session cookies | Choose any random string |
| `OWNER_EMAIL` | Email for order notifications | Your email |
| `RESEND_API_KEY` | Resend API key for sending emails | [resend.com](https://resend.com) → API Keys |

---

## 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the migration:
   - Open `supabase/migrations/001_products.sql`
   - Copy and paste the contents
   - Execute
3. Run the second migration for orders:
   - Open `supabase/migrations/002_orders.sql`
   - Copy and paste the contents
   - Execute
4. Run the third migration for delivery address:
   - Open `supabase/migrations/003_orders_customer_address.sql`
   - Copy and paste the contents
   - Execute
5. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the service key (see below) to `.env.local`.

#### Supabase service key

Go to your project: [Supabase Dashboard → Your Project → Settings → API](https://supabase.com/dashboard/project/_/settings/api).

- **Legacy keys**: Open the **"Project API keys"** or **"Legacy API Keys"** section. Copy the **`service_role`** key (a long JWT starting with `eyJ...`). Add to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY=...`
- **New secret key**: If you see **"API Keys"** with a **"Create secret key"** or **"Secret keys"** option, create one and copy it (starts with `sb_secret_...`). Add to `.env.local` as `SUPABASE_SECRET_KEY=...` (or `SUPABASE_SERVICE_ROLE_KEY=...`)

The app accepts either format.

Products will load from Supabase. If Supabase is not configured, the app falls back to static product data. Successful Razorpay payments are saved to the `orders` table.

---

## 3. Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com).
2. Use **Test Mode** for development (toggle in dashboard).
3. Go to **Settings → API Keys** and generate keys.
4. Add `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env.local`.

If Razorpay is not configured, **Buy Now** falls back to opening WhatsApp. Successful payments are verified and saved to Supabase. The owner receives an email with complete order and delivery details (requires `OWNER_EMAIL` and `RESEND_API_KEY`).

---

## 4. Orders (Supabase)

Successful Razorpay payments are verified and saved to the `orders` table. To view orders:

1. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` in `.env.local`.
2. Go to `/admin/login` and sign in with your email and password.
3. After login, manage **Products** at `/admin/products` and **Orders** at `/admin/orders`.

---

## 5. Order notification email

When a payment succeeds, the owner receives an email with full order and delivery details.

1. Sign up at [resend.com](https://resend.com).
2. Get an API key from **API Keys**.
3. Add to `.env.local`:
   - `OWNER_EMAIL` – your email (where order notifications go)
   - `RESEND_API_KEY` – your Resend API key
   - `ORDER_EMAIL_FROM` – sender address (use `onboarding@resend.dev` for testing; verify your domain for production)

---

## 6. WhatsApp & Instagram

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Use country code + number, no `+` (e.g. `919876543210` for India).
- `NEXT_PUBLIC_INSTAGRAM_HANDLE`: Username only (e.g. `handmadecrochet`).

---

## 7. Run the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Production Deployment (Vercel)

1. Push to GitHub.
2. Import project in [Vercel](https://vercel.com).
3. Add all environment variables in **Settings → Environment Variables**.
4. Deploy.
