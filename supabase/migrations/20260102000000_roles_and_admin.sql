-- ==========================================================================
-- Roles + admin management
-- --------------------------------------------------------------------------
-- Roles: 'user' (default), 'admin', 'super_admin'.
-- The FIRST user to sign up becomes 'super_admin'. Existing projects that
-- already have users get their earliest user promoted (so there is always an
-- admin). Only super admins may change roles (enforced by RLS + server action),
-- and the last super admin can never be demoted (enforced by trigger).
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. Restrict role values.
-- --------------------------------------------------------------------------
alter table public.profiles
    drop constraint if exists profiles_role_check;

alter table public.profiles
    add constraint profiles_role_check
    check (role in ('user', 'admin', 'super_admin'));

-- --------------------------------------------------------------------------
-- 2. First user to sign up becomes super admin.
-- --------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    is_first_user boolean;
begin
    select not exists (select 1 from public.profiles) into is_first_user;

    insert into public.profiles (id, email, full_name, avatar_url, role)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'avatar_url',
        case when is_first_user then 'super_admin' else 'user' end
    )
    on conflict (id) do nothing;

    return new;
end;
$$;

-- --------------------------------------------------------------------------
-- 3. Backfill: if a project already has users but no super admin, promote the
--    earliest user so the app is manageable.
-- --------------------------------------------------------------------------
update public.profiles
set role = 'super_admin'
where id = (
    select id
    from public.profiles
    order by created_at asc
    limit 1
)
and not exists (select 1 from public.profiles where role = 'super_admin');

-- --------------------------------------------------------------------------
-- 4. Helper: the current user's role. SECURITY DEFINER so it can be used in
--    RLS policies on profiles without recursion (owner bypasses RLS).
-- --------------------------------------------------------------------------
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
    select role from public.profiles where id = auth.uid();
$$;

-- --------------------------------------------------------------------------
-- 5. RLS: super admins can view and update every profile.
-- --------------------------------------------------------------------------
drop policy if exists "Super admins can view all profiles" on public.profiles;
create policy "Super admins can view all profiles"
    on public.profiles for select
    to authenticated
    using (public.get_my_role() = 'super_admin');

drop policy if exists "Super admins can update any profile" on public.profiles;
create policy "Super admins can update any profile"
    on public.profiles for update
    to authenticated
    using (public.get_my_role() = 'super_admin')
    with check (public.get_my_role() = 'super_admin');

-- --------------------------------------------------------------------------
-- 6. Never allow the last super admin to be demoted.
-- --------------------------------------------------------------------------
create or replace function public.protect_last_super_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if old.role = 'super_admin' and new.role <> 'super_admin' then
        if (select count(*) from public.profiles where role = 'super_admin') <= 1 then
            raise exception 'At least one super admin must remain';
        end if;
    end if;
    return new;
end;
$$;

drop trigger if exists profiles_protect_last_super_admin on public.profiles;
create trigger profiles_protect_last_super_admin
    before update on public.profiles
    for each row
    execute function public.protect_last_super_admin();
