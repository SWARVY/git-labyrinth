-- ============================================================
-- 1. user_characters
-- ============================================================
create table if not exists public.user_characters (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  language    text not null,
  level       smallint not null default 1,
  total_bytes bigint not null default 0,
  is_locked   boolean not null default false,
  updated_at  timestamptz not null default now(),

  unique (user_id, language)
);

-- RLS
alter table public.user_characters enable row level security;

create policy "Users can read own characters"
  on public.user_characters for select
  using (auth.uid() = user_id);

create policy "Users can insert own characters"
  on public.user_characters for insert
  with check (auth.uid() = user_id);

create policy "Users can update own characters"
  on public.user_characters for update
  using (auth.uid() = user_id);

-- ============================================================
-- 2. profiles
-- ============================================================
create table if not exists public.profiles (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  equipped_char_id uuid references public.user_characters(id) on delete set null,
  stats_cache      jsonb,
  updated_at       timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);
