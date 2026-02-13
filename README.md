
# Ai Cavalli – Restaurant Management App

## Overview
Ai Cavalli is a modern restaurant management system built with Next.js, React, and TypeScript. It features custom authentication, role-based access control (RBAC), and a modular architecture for handling customers, kitchen staff, admins, and guests.

## Features
- Custom PIN-based authentication (no Supabase Auth dependency)
- Roles: STUDENT, OUTSIDER, KITCHEN, ADMIN
- Secure session management with cookies and session tokens
- Modular route protection via middleware and layouts
- Admin panel for user management
- Kitchen and customer interfaces
- PostgreSQL database (Supabase hosted)

## Project Structure
```
app/           # Next.js App Router pages and layouts
components/    # UI and layout components
lib/           # Auth, context, database, and utility code
public/        # Static assets
```

## Database Setup
- Main schema: `lib/database/schema.sql`
- Seed data: `lib/database/seed.sql`
- Menu seed: `lib/database/seed_menu.sql`
- Latest migration: `lib/database/auth_safe_migration.sql`

Apply SQL files using Supabase SQL Editor or `psql` CLI.

## Development
1. Clone the repo and install dependencies:
	```sh
	npm install
	```
2. Set up your `.env.local` with Supabase credentials.
3. Run the dev server:
	```sh
	npm run dev
	```

## Auth System
- PIN login for all roles (6 digits)
- Session tokens stored in DB and cookies
- Role normalization for legacy DB values
- Route protection via middleware

## Scripts
- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run lint` – Lint code

## Notes
- Only the following SQL files are needed: `schema.sql`, `seed.sql`, `seed_menu.sql`, `auth_safe_migration.sql`
- All other `.sql` files are legacy and can be ignored or deleted

## License
MIT
