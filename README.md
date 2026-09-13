# DefaultApp — Next.js + Supabase starter

A production-ready starting point for every app you build. Fork it, clone your
fork, point it at a fresh Supabase project, push the migration, and start
building features — auth is already wired.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript ·
Tailwind CSS v4 · shadcn/ui · Supabase (`@supabase/ssr`)

**Included:**

- Email/password auth: sign up, sign in, forgot/reset password, change password
- Google OAuth (add more providers in `src/components/auth/oauth-buttons.tsx`)
- `@supabase/ssr` clients — browser, server, proxy — with token refresh handled
  by the Next.js **Proxy** (`src/proxy.ts`) session guard
- Route protection out of the box: `/`, `/login`, `/signup`,
  `/forgot-password`, `/update-password`, `/auth/*` are public; everything else
  requires a session
- Public marketing landing (`/`), auth pages under `(auth)`, and a protected
  dashboard shell under `(app)` with a user menu + sign out
- A `profiles` table with `role`, `handle_new_user` trigger, `updated_at`
  trigger, and Row Level Security — shipped as a migration
- **Roles & admin**: the first user to sign up becomes `super_admin`; a
  super-admin-only **Users & roles** page (`/admin/users`) lets you change any
  user's role. `user` / `admin` / `super_admin`, with a DB guard so the last
  super admin can't be demoted
- Dark/light theme, toasts, and shadcn/ui components

---

## Create a new app from this template

> **Do not commit to this template repo.** Always fork it and work on the fork
> so the base template stays clean and reusable for future projects.

### 1. Fork this repository

Fork it on GitHub (or your Git host) into your own account/organization. Name
the fork after the app you are about to build.

### 2. Clone your fork

```bash
git clone <your-fork-url> MyNewApp
cd MyNewApp
```

### 3. Set up the app

```bash
# Install dependencies
npm install

# Create your local env file
cp .env.example .env.local
```

Then continue with the Supabase setup below.

### 3a. Create a hosted Supabase project

1. Create a project at https://supabase.com/dashboard (or `supabase projects create`).
2. Get the **Project URL** and **anon key** from **Project Settings → API**
   and paste them into `.env.local`.
3. Get the **service_role** key too (server-only; never expose it).
4. Link and push the schema:

   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

### 3b. (Or) run Supabase locally with Docker

```bash
supabase start          # boots Postgres + Auth + Studio
# then copy the printed anon key / URL into .env.local
supabase db reset       # applies migrations + seed.sql
```

Regenerate `src/types/database.ts` against your linked remote project any time:

```bash
supabase link --project-ref <ref>
supabase gen types typescript --linked > src/types/database.ts
```

### 4. Configure Auth in the Supabase dashboard

Project Settings → Authentication:

- **URL Configuration**: set Site URL to `http://localhost:3000` and add
  `http://localhost:3000/auth/callback` to redirect URLs.
- **Providers → Google**: enable, enter your OAuth Client ID/Secret from
  https://console.cloud.google.com, and add your Supabase redirect URL to the
  Google app's authorized redirect URIs.
- **Email**: choose whether to require email confirmation. The UI handles both
  (immediate session vs. "check your inbox").
- **Settings**: set **Minimum password length** to `6` (or change
  `MIN_PASSWORD_LENGTH` in `src/lib/auth/constants.ts` and
  `minimum_password_length` in `supabase/config.toml` to match).
- **Redirect URLs**: add both `http://localhost:3000/auth/callback` and your
  deployed `https://<your-domain>/auth/callback`.

### 5. Run it

```bash
npm run dev
```

Visit http://localhost:3000 → sign up → you land on `/dashboard`.

---

## Project structure

```
src/
├── proxy.ts                  # Next.js Proxy: session refresh + route guard
├── app/
│   ├── page.tsx              # public landing
│   ├── (auth)/               # login, signup, forgot/reset password
│   ├── auth/callback/route.ts# OAuth + email-link code exchange
│   └── (app)/                # protected: dashboard, settings, admin/users
├── components/
│   ├── admin/                # role select control
│   ├── auth/                 # forms + submit button + messages
│   ├── ui/                   # shadcn/ui components
│   ├── providers.tsx         # ThemeProvider + Toaster
│   └── user-menu.tsx         # avatar dropdown + sign out
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # browser client
│   │   ├── server.ts         # server component / action client
│   │   ├── proxy.ts          # updateSession() used by src/proxy.ts
│   │   ├── admin.ts          # getSupabaseAdmin() - service role (server only)
│   │   └── queries.ts        # getSessionProfile() and friends
│   ├── admin/
│   │   └── actions.ts        # updateUserRole() (super admins only)
│   ├── auth/
│   │   ├── actions.ts        # server actions: sign in/up, reset, sign out
│   │   ├── constants.ts      # MIN_PASSWORD_LENGTH
│   │   ├── helpers.ts        # route classification + safe next-path
│   │   ├── roles.ts          # UserRole, labels, isSuperAdmin()
│   │   └── state.ts          # form action state types
│   ├── env.ts                # zod-validated public env (fails fast)
│   ├── name.ts               # getInitials()
│   └── site.ts               # app name/url config
└── types/database.ts         # typed Database (regenerate per project)

supabase/
├── migrations/20260101000000_initial_schema.sql
├── migrations/20260102000000_roles_and_admin.sql
└── config.toml
```

## Roles & permissions

| Role          | Can do                                                        |
| ------------- | ------------------------------------------------------------- |
| `user`        | Use the app; read/update their own profile                    |
| `admin`       | Reserved for app-specific powers (extend as needed)           |
| `super_admin` | Everything above + view all users and change anyone's role    |

- The **first user to sign up** is automatically `super_admin`.
- On an existing project, pushing the `roles_and_admin` migration promotes the
  earliest user to `super_admin` if none exists yet.
- Role changes happen on **`/admin/users`** (super admins only) and are enforced
  by app logic **and** RLS. A database trigger prevents demoting the last
  super admin.
- Add `admin`-level checks with `isSuperAdmin()` / `normalizeRole()` from
  `src/lib/auth/roles.ts`, or write new RLS policies using `public.get_my_role()`.

## Making it your own

1. Rename `package.json` → `name`, and edit `src/lib/site.ts` (name + url).
2. Update `metadata`/SEO in `src/app/layout.tsx`.
3. Extend `profiles` (columns, indexes) in a new migration under
   `supabase/migrations/`.
4. Add features as route groups inside `src/app/(app)/` — they inherit the
   authenticated shell.
5. Use the pattern in `lib/supabase/queries.ts` for server reads, and add
   `role`-based helpers beside it when you introduce authorization.

## Deploying

`NEXT_PUBLIC_*` variables are inlined into the client bundle **at build time**,
so you must set them in your hosting provider (e.g. Vercel → Environment
Variables) *before* building, and rebuild after changing them:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` — your public origin, e.g. `https://app.example.com`.
  Required for OAuth/email redirects to work in production.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only.

If any of the three public variables are missing, the app throws a clear
configuration error at startup (`src/lib/env.ts`) instead of failing silently.

## Scripts

| Command              | Description                      |
| -------------------- | -------------------------------- |
| `npm run dev`        | Start the dev server             |
| `npm run build`      | Production build                 |
| `npm run start`      | Run the production build         |
| `npm run lint`       | ESLint                           |
| `npm run typecheck`  | TypeScript type check (`tsc`)    |
| `supabase db push`   | Apply migrations to linked project |
| `supabase db reset`  | Reset + re-seed local database   |
