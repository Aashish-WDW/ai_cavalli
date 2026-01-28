-- OTP Codes Table for WhatsApp OTP Authentication
create table if not exists public.otp_codes (
  id uuid primary key default uuid_generate_v4(),
  phone text not null,
  otp_hash text not null, -- bcrypt hash of OTP for security
  expires_at timestamp with time zone not null,
  used boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  verified_at timestamp with time zone
);

-- Indexes for performance
create index if not exists idx_otp_phone on public.otp_codes(phone);
create index if not exists idx_otp_expires on public.otp_codes(expires_at);
create index if not exists idx_otp_used on public.otp_codes(used);

-- RLS Policies
alter table public.otp_codes enable row level security;

-- Only service role can access OTP codes (security)
create policy "Service role only" on public.otp_codes
  using (auth.role() = 'service_role');

-- Function to clean up expired OTPs (run periodically)
create or replace function delete_expired_otps()
returns void as $$
begin
  delete from public.otp_codes 
  where expires_at < now() - interval '1 hour';
end;
$$ language plpgsql security definer;

-- Optional: Add auth_method column to users table (for gradual migration)
alter table public.users add column if not exists auth_method text default 'otp'; -- 'pin' or 'otp'

-- Comment: To run cleanup manually, execute: SELECT delete_expired_otps();
