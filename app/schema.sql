-- EthanolWatch database schema
-- Run this in Supabase: Project > SQL Editor > New Query > paste > Run

-- ============ ISSUE CATEGORIES (fixed list, used everywhere) ============
create table issue_categories (
  id text primary key,           -- e.g. 'mileage_drop'
  label text not null,           -- e.g. 'Mileage drop'
  description text
);

insert into issue_categories (id, label, description) values
  ('mileage_drop', 'Mileage drop', 'Fewer km/l after switching fuel, unrelated to driving habits.'),
  ('engine_knocking', 'Engine knocking / rough idle', 'Hesitation and vibration, mostly in older engines.'),
  ('fuel_pump', 'Fuel pump failure', 'Premature wear surfacing as hard starts or stalling.'),
  ('seal_wear', 'Rubber & seal wear', 'Fuel-line and gasket degradation over time.'),
  ('warning_light', 'Warning lights', 'Check-engine indicators with no obvious mechanical cause.'),
  ('corrosion', 'Corrosion', 'Metal parts corroding faster than expected.'),
  ('hard_start', 'Hard starting', 'Difficulty starting, especially cold starts.'),
  ('other', 'Other', 'Anything that doesn''t fit the above.');

-- ============ REPORTS (the core structured data) ============
create table reports (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),

  -- vehicle
  vehicle_make text not null,
  vehicle_model text not null,
  vehicle_year int,
  vehicle_type text check (vehicle_type in ('car','two_wheeler','commercial','other')),
  fuel_type text check (fuel_type in ('petrol','flex_fuel')),

  -- location
  city text not null,
  state text not null,

  -- issue
  issue_category text references issue_categories(id) not null,
  severity text check (severity in ('mild','moderate','severe')),
  onset text check (onset in ('sudden','gradual')),
  odometer_km int,
  description text,
  photo_url text,

  -- moderation
  status text default 'published' check (status in ('published','flagged','removed'))
);

create index reports_category_idx on reports (issue_category);
create index reports_state_idx on reports (state);
create index reports_created_idx on reports (created_at desc);

-- ============ FORUM ============
create table forum_categories (
  id text primary key,        -- e.g. 'vehicle_brand'
  label text not null,
  sort_order int default 0
);

insert into forum_categories (id, label, sort_order) values
  ('by_brand', 'By Vehicle Brand', 1),
  ('mileage_performance', 'Mileage & Performance', 2),
  ('engine_fuel_system', 'Engine & Fuel System', 3),
  ('general_policy', 'General & Policy', 4);

create table forum_threads (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  category_id text references forum_categories(id) not null,
  title text not null,
  body text not null,
  linked_issue_category text references issue_categories(id),
  created_at timestamptz default now(),
  status text default 'published' check (status in ('published','flagged','removed'))
);

create table forum_replies (
  id bigint generated always as identity primary key,
  thread_id bigint references forum_threads(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz default now(),
  status text default 'published' check (status in ('published','flagged','removed'))
);

create index forum_threads_category_idx on forum_threads (category_id);
create index forum_replies_thread_idx on forum_replies (thread_id);

-- ============ USER PROFILES (extends Supabase auth.users) ============
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  created_at timestamptz default now(),
  is_moderator boolean default false
);

-- ============ ROW LEVEL SECURITY ============
-- Anyone can read published content. Only logged-in users can insert.
-- Users can only edit/delete their own content. Moderators can do anything (handle via service role in admin tools).

alter table reports enable row level security;
create policy "Public read published reports" on reports for select using (status = 'published');
create policy "Logged-in users can submit reports" on reports for insert with check (auth.uid() = user_id);

alter table forum_threads enable row level security;
create policy "Public read published threads" on forum_threads for select using (status = 'published');
create policy "Logged-in users can create threads" on forum_threads for insert with check (auth.uid() = user_id);

alter table forum_replies enable row level security;
create policy "Public read published replies" on forum_replies for select using (status = 'published');
create policy "Logged-in users can reply" on forum_replies for insert with check (auth.uid() = user_id);

alter table profiles enable row level security;
create policy "Public read profiles" on profiles for select using (true);
create policy "Users manage own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
