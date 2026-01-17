-- Create Auth User to match your existing database record
-- Run this in Supabase SQL Editor

-- First, let's verify your user exists
SELECT id, phone, pin, name, role FROM public.users WHERE phone = '7702667922';

-- The issue is that you have a database record but no Supabase Auth user
-- You need to create the auth user manually in Supabase Dashboard:

-- 1. Go to Authentication → Users in Supabase Dashboard
-- 2. Click "Add User" (or "Invite User")
-- 3. Fill in:
--    - Email: 7702667922@example.com
--    - Password: 123456 (or any 6+ character password)
--    - Auto Confirm User: YES (important!)
-- 4. After creating, click on the user and copy the UUID
-- 5. Update your database record to match:

UPDATE public.users 
SET id = 'PASTE_THE_AUTH_USER_UUID_HERE',
    pin = '123456'
WHERE phone = '7702667922';

-- Then you can login with:
-- Phone: 7702667922
-- PIN: 123456
