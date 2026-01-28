-- Guest Sessions Table
create table if not exists public.guest_sessions (
  id uuid primary key default uuid_generate_v4(),
  guest_phone text not null,
  guest_name text not null,
  table_name text not null,
  num_guests integer,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone,
  total_amount decimal(10,2) default 0,
  status text default 'active', -- 'active', 'ended'
  payment_method text, -- 'cash', 'upi', 'card'
  payment_status text default 'pending', -- 'pending', 'paid'
  upi_transaction_id text,
  whatsapp_sent boolean default false,
  whatsapp_sent_at timestamp with time zone,
  whatsapp_message_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add session_id to orders table
alter table public.orders add column if not exists session_id uuid references public.guest_sessions(id);

-- RLS Policies for Guest Sessions
alter table public.guest_sessions enable row level security;

-- Users can read their own sessions, Staff can read all
create policy "Users can read own sessions" on public.guest_sessions for select
  using (auth.uid() = user_id OR exists (
    select 1 from public.users 
    where id = auth.uid() 
    and role in ('kitchen_manager', 'admin', 'staff')
  ));

-- Insertion is allowed during guest registration (handled via service role in API) 
-- but for RLS we allow authenticated users to insert their own session record if needed.
create policy "Users can insert own sessions" on public.guest_sessions for insert 
  with check (auth.uid() = user_id);

-- Staff can manage (update/delete) all sessions
create policy "Staff manage sessions" on public.guest_sessions for all
  using (
    exists (
      select 1 from public.users 
      where id = auth.uid() 
      and role in ('kitchen_manager', 'admin', 'staff')
    )
  );

-- Indexes for performance
create index if not exists idx_sessions_phone on public.guest_sessions(guest_phone);
create index if not exists idx_sessions_status on public.guest_sessions(status);
create index if not exists idx_sessions_created_at on public.guest_sessions(created_at);
create index if not exists idx_orders_session_id on public.orders(session_id);

-- Function to update session total when orders change
create or replace function update_session_total()
returns trigger as $$
declare
  target_session_id uuid;
begin
  -- Get the session_id (works for INSERT, UPDATE, DELETE)
  target_session_id := coalesce(new.session_id, old.session_id);
  
  -- Only update if there's a session_id
  if target_session_id is not null then
    update public.guest_sessions
    set total_amount = (
      select coalesce(sum(total), 0)
      from public.orders
      where session_id = target_session_id
    )
    where id = target_session_id;
  end if;
  
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- Trigger to auto-update session total
drop trigger if exists tr_update_session_total on public.orders;
create trigger tr_update_session_total
after insert or update or delete on public.orders
for each row
execute function update_session_total();
