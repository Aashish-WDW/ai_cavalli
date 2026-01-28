-- Add session-based bill columns
ALTER TABLE public.bills ADD COLUMN IF NOT EXISTS session_id uuid REFERENCES public.guest_sessions(id);
ALTER TABLE public.bills ADD COLUMN IF NOT EXISTS guest_name text;
ALTER TABLE public.bills ADD COLUMN IF NOT EXISTS guest_phone text;
ALTER TABLE public.bills ADD COLUMN IF NOT EXISTS table_name text;

-- Index for session-based bill lookup
CREATE INDEX IF NOT EXISTS idx_bills_session_id ON public.bills(session_id);

-- Make order_id optional since we now support session-based bills
ALTER TABLE public.bills ALTER COLUMN order_id DROP NOT NULL;
