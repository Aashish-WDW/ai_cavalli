-- SECURITY HARDENING & ARCHITECTURAL CONSOLIDATION

-- 1. Update user_role enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'guest') THEN
        ALTER TYPE user_role ADD VALUE 'guest';
    END IF;
END
$$;

-- 2. Add user_id to guest_sessions if it doesn't exist
ALTER TABLE public.guest_sessions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.users(id);

-- 3. Update existing guest sessions to link to users via phone if possible
UPDATE public.guest_sessions gs
SET user_id = u.id
FROM public.users u
WHERE gs.guest_phone = u.phone
AND gs.user_id IS NULL;

-- 4. Tighten RLS Policies for Orders
-- Drop existing policies to avoid name collisions
DROP POLICY IF EXISTS "Public view orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Guests can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Staff view all orders" ON public.orders;
DROP POLICY IF EXISTS "Staff View All Orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;

-- New Secured Orders Policies
-- Authenticated users (including guests) can only see their own orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT
USING (auth.uid() = user_id);

-- Staff can view all orders
CREATE POLICY "Staff view all orders" ON public.orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('kitchen_manager', 'admin', 'staff')
  )
);

-- Insertion: Only allow if user_id matches or via service role (API)
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- 5. Tighten RLS Policies for Order Items
DROP POLICY IF EXISTS "Public view order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff View All Order Items" ON public.order_items;

CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Staff view all order items" ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('kitchen_manager', 'admin', 'staff')
  )
);

-- 6. Tighten RLS Policies for Guest Sessions
DROP POLICY IF EXISTS "Public read sessions" ON public.guest_sessions;
DROP POLICY IF EXISTS "Public create sessions" ON public.guest_sessions;
DROP POLICY IF EXISTS "Public update sessions" ON public.guest_sessions;
DROP POLICY IF EXISTS "Users can view own sessions" ON public.guest_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.guest_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.guest_sessions;
DROP POLICY IF EXISTS "Staff manage all sessions" ON public.guest_sessions;
DROP POLICY IF EXISTS "Staff manage sessions" ON public.guest_sessions;
DROP POLICY IF EXISTS "Staff view all sessions" ON public.guest_sessions;

CREATE POLICY "Users can view own sessions" ON public.guest_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.guest_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update own sessions" ON public.guest_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Staff manage all sessions" ON public.guest_sessions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('kitchen_manager', 'admin', 'staff')
  )
);
