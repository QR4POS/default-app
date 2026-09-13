-- ==========================================================================
-- DefaultApp initial schema
-- --------------------------------------------------------------------------
-- A public `profiles` table for every auth user, created automatically on
-- signup (handle_new_user trigger) with the metadata provided at signup
-- (full_name, avatar_url). Extend this table (e.g. more columns) as needed.
-- ==========================================================================

create table if not exists public.profiles (
    id         uuid primary key references auth.users (id) on delete cascade,
    email      text,
    full_name  text,
    avatar_url text,
    role       text not null default 'user' check (char_length(role) <= 50),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public profile for each auth user.';

-- --------------------------------------------------------------------------
-- Backfill: populate profiles for auth users created before this migration.
-- --------------------------------------------------------------------------
insert into public.profiles (id, email, full_name, avatar_url)
select
    id,
    email,
    raw_user_meta_data ->> 'full_name',
    raw_user_meta_data ->> 'avatar_url'
from auth.users
on conflict (id) do nothing;

-- --------------------------------------------------------------------------
-- Trigger: create a profile row on every new auth user.
-- --------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, email, full_name, avatar_url)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'avatar_url'
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- --------------------------------------------------------------------------
-- Trigger: keep updated_at fresh.
-- --------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
    before update on public.profiles
    for each row execute function public.handle_updated_at();

-- --------------------------------------------------------------------------
-- Row Level Security.
-- Users may read and update their own profile only. Use the service-role key
-- (lib/supabase/admin.ts) for any admin/server-side cross-user access.
-- --------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
    on public.profiles for select
    to authenticated
    using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
    on public.profiles for update
    to authenticated
    using (auth.uid() = id)
    with check (auth.uid() = id);
