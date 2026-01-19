-- CLEAN GHOST USERS GUIDE
-- 
-- If you have users who were deleted from the 'public.users' table but still exist in 'auth.users',
-- they will block new registrations with the same phone number.
--
-- TO FIX THIS MANUALLY:
-- 1. Open your Supabase Dashboard.
-- 2. Go to 'Authentication' -> 'Users'.
-- 3. Search for the phone number (e.g. 1234567890@example.com).
-- 4. Delete the user from the Auth table.
--
-- TO PREVENT THIS FOR FUTURE DELETIONS:
-- You can run the following SQL to create a trigger that keeps tables in sync.
-- NOTE: This requires 'security definer' and happens at the system level.

/*
CREATE OR REPLACE FUNCTION public.sync_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- This attempts to delete from auth.users when public.users row is removed
  -- NOTE: This only works if the DB role has permissions to modify the auth schema.
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_public_user_deleted
  AFTER DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_deletion();
*/
