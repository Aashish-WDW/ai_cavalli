-- RUN THIS IN SUPABASE SQL EDITOR TO FIX GUEST LOGIN
-- This adds the 'guest' role to your existing user_role enum

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'guest') THEN
        ALTER TYPE user_role ADD VALUE 'guest';
    END IF;
END
$$;
