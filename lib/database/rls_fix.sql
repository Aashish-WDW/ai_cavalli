-- Add missing RLS policy to allow users to insert their own record during signup

-- Allow authenticated users to insert their own user record
create policy "Users can insert own record" on public.users for insert
  with check (auth.uid() = id);

-- Allow users to read their own record
create policy "Users can read own record" on public.users for select
  using (auth.uid() = id);

-- Allow staff/admin to read all users
create policy "Staff can read all users" on public.users for select
  using (
    exists (
      select 1 from public.users 
      where id = auth.uid() 
      and role in ('kitchen_manager', 'admin', 'staff')
    )
  );
