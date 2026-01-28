-- FIX FOR GUEST REGISTRATION
-- The 'pin' column was originally NOT NULL, but since we are using OTP-only for guests, 
-- we need to allow NULL values for users who don't use a PIN.

ALTER TABLE public.users ALTER COLUMN pin DROP NOT NULL;
