-- Add bill_requested columns to guest_sessions
ALTER TABLE public.guest_sessions ADD COLUMN IF NOT EXISTS bill_requested boolean DEFAULT false;
ALTER TABLE public.guest_sessions ADD COLUMN IF NOT EXISTS bill_requested_at timestamp with time zone;

-- Index for quick lookup of pending bill requests
CREATE INDEX IF NOT EXISTS idx_sessions_bill_requested ON public.guest_sessions(bill_requested) WHERE bill_requested = true;
