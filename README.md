# EthanolWatch — deployment guide (100% free stack)

This gets the full site — homepage, report form, live map, forum, data page — live on
your domain for $0/month, using Supabase (free tier) and Vercel (free tier).

## Part 1 — Set up the database (Supabase)

1. Go to https://supabase.com → sign up (free, no card needed) → **New project**.
2. Pick a name (e.g. `ethanolwatch`), set a database password (save it somewhere), pick the
   region closest to India (Singapore is usually closest).
3. Once the project finishes provisioning, go to **SQL Editor** → **New query**.
4. Open `schema.sql` from this project, paste the whole thing in, click **Run**.
   This creates every table (reports, forum threads/replies, categories, profiles) and
   locks them down with row-level security so people can only read published content and
   only insert their own posts.
5. Go to **Authentication → Providers** and turn on **Anonymous sign-ins**. This lets people
   submit a report or forum post without creating a password — it's what "no signup, two
   minutes" relies on. (You can require real accounts later if you want stronger moderation.)
6. Go to **Project Settings → API**. Copy the **Project URL** and the **anon public** key —
   you'll need both in Part 3.

## Part 2 — Push the code to GitHub

1. Create a free GitHub account if you don't have one: https://github.com
2. Create a new empty repository, e.g. `ethanolwatch`.
3. From this project folder, run:
   ```
   git init
   git add .
   git commit -m "Initial EthanolWatch site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ethanolwatch.git
   git push -u origin main
   ```

## Part 3 — Deploy (Vercel)

1. Go to https://vercel.com → sign up with your GitHub account (free, no card needed).
2. Click **Add New → Project**, select your `ethanolwatch` repo, click **Import**.
3. Before deploying, add environment variables (from Part 1, step 6):
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon public key
4. Click **Deploy**. In about a minute you'll get a live URL like
   `ethanolwatch.vercel.app`.

## Part 4 — Point your domain at it

1. In Vercel, go to your project → **Settings → Domains** → add `ethanolwatch.com`.
2. Vercel will show you 1-2 DNS records to add (usually an A record and/or CNAME).
3. Go to wherever you bought the domain (GoDaddy, Namecheap, etc.) → DNS settings →
   add the records Vercel showed you.
4. DNS changes take anywhere from a few minutes to a few hours to take effect. Once it
   does, ethanolwatch.com will serve the live site, with free SSL automatically handled
   by Vercel.

## What's already working after this

- Homepage with live ticker, state-level map, issue-frequency chart, forum preview —
  all reading real data from Supabase
- Report form → writes directly to the `reports` table → shows up on the homepage
  within a minute (data refreshes every 60s)
- Forum: browse by category, start a thread, reply to threads
- Data page: full breakdown by category and by state
- Guide page: static knowledge base content

## Local development (optional, if you want to preview changes before deploying)

```
npm install
cp .env.example .env.local   # then fill in your Supabase URL + key
npm run dev
```
Visit http://localhost:3000

## Sensible next steps, in order

1. **Seed a few real reports yourself** before launch so the homepage doesn't look empty.
2. **Photo upload** on the report form — Supabase Storage has a free tier; ask me to wire
   this in once you're ready, it's a small addition to the existing form.
3. **Moderation view** — a simple page (protected by a moderator flag on your account) to
   flag/remove reports or threads. Worth adding once you have real traffic.
4. **"Ask a mechanic" forum category and FFV section** — add once there's enough volume
   to justify splitting them out from the general categories.
5. **Quarterly data report** — once you have a meaningful number of reports, a written
   summary of the data page is strong, citable content for journalists/YouTubers.

## Cost check

Supabase free tier: 500MB database, 1GB file storage, 50,000 monthly active users —
comfortably enough for a long time. Vercel free tier: unlimited personal projects,
100GB bandwidth/month. You will not be charged unless you explicitly upgrade a plan.
