-- FIX: issue_categories and forum_categories got Row Level Security turned on
-- (from the "Run and enable RLS" prompt) but never got a read policy, so
-- every query against them was silently returning zero rows.
-- These are just public lookup/reference tables — safe to allow anyone to read.

alter table issue_categories enable row level security;
create policy "Public read issue categories" on issue_categories for select using (true);

alter table forum_categories enable row level security;
create policy "Public read forum categories" on forum_categories for select using (true);
