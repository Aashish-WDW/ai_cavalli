-- COMPLETE FIX FOR RLS ON USERS TABLE
-- Run this entire script in Supabase SQL Editor

-- Step 1: Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can insert own record" ON public.users;
DROP POLICY IF EXISTS "Users can read own record" ON public.users;
DROP POLICY IF EXISTS "Staff can read all users" ON public.users;
DROP POLICY IF EXISTS "Allow insert own user" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.users;

-- Step 2: Temporarily disable RLS to allow signup
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Step 3: (Optional) Re-enable RLS with simple policies after testing
-- Uncomment these lines after you successfully create a user:

-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow all authenticated users full access" ON public.users
--   FOR ALL
--   USING (auth.role() = 'authenticated')
--   WITH CHECK (auth.role() = 'authenticated');
