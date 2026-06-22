---
name: project-compass-setup
description: Architecture and tech stack for the Compass survey app (two-app monorepo)
metadata:
  type: project
---

Compass is a survey platform split into two Next.js apps in a pnpm monorepo at `/Users/elena/changemaker-compas-client/`.

**Why:** User wants to create surveys via a GUI (Payload CMS), serve them to end users (client app), collect emails, compute scores, and eventually email results.

**Apps:**
- `client/` — user-facing survey site (Next.js 16, Mantine 7, Supabase, react-hook-form, Zod). Runs on port 3000.
- `admin/` — Payload CMS admin panel for creating surveys (Next.js 15, Payload 3, Mantine 7, Supabase/Postgres). Runs on port 3001.

**Key data model (Payload collections):**
- `surveys` — title, slug, questions (array with type: multiple_choice | text | scale), resultRanges (score → label/description), published flag
- `responses` — survey (relation), email, answers (JSON), score, resultLabel
- `users` — admin users with auth

**Environment variables needed:**
- `client/.env.local`: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- `admin/.env.local`: DATABASE_URL (Supabase Postgres connection string), PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL

**How to apply:** When suggesting next steps, the priority order is: (1) set up Supabase credentials, (2) build survey form rendering in client, (3) add email sending after dynamic forms work.

**Not yet built:** survey listing page, survey form page, results page, email sending.
