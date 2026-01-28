-- MIGRATE USERS TO EMAIL AUTH
-- 1. Add email column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email text UNIQUE;

-- 2. Populate email for existing users (using phone as placeholder if missing)
-- This is a temporary measure to avoid breaking existing staff accounts
UPDATE public.users 
SET email = phone || '@example.com' 
WHERE email IS NULL;

-- 3. Make email mandatory for future records
-- ALTER TABLE public.users ALTER COLUMN email SET NOT NULL; -- Keeping optional for now to avoid migration issues

-- 4. Create an index for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);

-- 5. Update guest_sessions table
ALTER TABLE public.guest_sessions ADD COLUMN IF NOT EXISTS guest_email text;
CREATE INDEX IF NOT EXISTS guest_sessions_email_idx ON public.guest_sessions (guest_email);

-- 5. Update auth settings (Note: This is just documentation, you must do this in Supabase Dashboard)
-- Go to Authentication > Providers > Email
-- 1. Enable Email Provider
-- 2. Enable "Confirm Email" (Recommended)
-- 3. Enable "OTP" if using sign-in with OTP
