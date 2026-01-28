-- EMERGENCY FIX: Restore FULL functionality across ALL portals
-- This unblocks Kitchen, Admin Menu, User Control, and CMS while we fix the underlying Auth session issue.
-- Run this in the Supabase SQL Editor.

-- 1. Order Items (Kitchen management)
DROP POLICY IF EXISTS "Public manage order_items" ON public.order_items;
DROP POLICY IF EXISTS "Public view order_items" ON public.order_items;
DROP POLICY IF EXISTS "Staff view all order_items" ON public.order_items;
CREATE POLICY "Emergency manage order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);

-- 2. Orders (Status updates)
DROP POLICY IF EXISTS "Public manage orders" ON public.orders;
DROP POLICY IF EXISTS "Public view orders" ON public.orders;
DROP POLICY IF EXISTS "Staff view all orders" ON public.orders;
CREATE POLICY "Emergency manage orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- 3. Menu & Categories (Admin management)
DROP POLICY IF EXISTS "Public view menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "Admin manage menu_items" ON public.menu_items;
CREATE POLICY "Emergency manage menu_items" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public view categories" ON public.categories;
DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Emergency manage categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- 4. Users (User Control portal)
DROP POLICY IF EXISTS "Public view users" ON public.users;
DROP POLICY IF EXISTS "Admin manage users" ON public.users;
CREATE POLICY "Emergency manage users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- 5. Announcements (CMS portal)
DROP POLICY IF EXISTS "Public view announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admin manage announcements" ON public.announcements;
CREATE POLICY "Emergency manage announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);
