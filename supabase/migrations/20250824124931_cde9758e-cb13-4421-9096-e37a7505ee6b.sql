-- 1) Update the existing trigger to handle profile creation properly
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role, created_at)
  values (
    new.id, 
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    case 
      when lower(new.email) IN ('omar@fixco.se', 'omar@dinadress.se') then 'owner'
      else 'customer' 
    end,
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    role = case when profiles.role is null then excluded.role else profiles.role end;
  return new;
end;
$$ language plpgsql security definer;

-- 2) Ensure trigger exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3) Backfill: create profiles for existing auth.users that don't have profiles
insert into public.profiles (id, email, first_name, last_name, role, created_at, user_type, loyalty_tier, loyalty_points, total_spent)
select 
  u.id, 
  u.email, 
  coalesce(u.raw_user_meta_data->>'first_name', split_part(u.email, '@', 1)),
  coalesce(u.raw_user_meta_data->>'last_name', ''),
  case 
    when lower(u.email) IN ('omar@fixco.se', 'omar@dinadress.se') then 'owner'
    else 'customer' 
  end,
  u.created_at,
  'private'::user_type,
  'bronze'::loyalty_tier,
  0,
  0
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

-- 4) Create a KPI function for dashboard
create or replace function public.kpi_today()
returns json as $$
declare
  res json;
begin
  select json_build_object(
    'bookings', (select count(*) from bookings where created_at::date = now()::date),
    'revenue', (select coalesce(sum(total_amount), 0) from invoices where issue_date = now()::date and status = 'paid'),
    'rot_savings', (select coalesce(sum(rot_amount + rut_amount), 0) from invoices where issue_date = now()::date and status = 'paid'),
    'new_users', (select count(*) from profiles where created_at::date = now()::date),
    'pending_quotes', (select count(*) from quotes where status = 'sent'),
    'unpaid_invoices', (select count(*) from invoices where status in ('sent', 'overdue'))
  ) into res;
  return res;
end;
$$ language plpgsql stable security definer;

-- 5) Create admin policies for full access to profiles
create policy "admin_profiles_select_all" on public.profiles
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and p.role in ('owner', 'admin')
    )
  );

create policy "admin_profiles_update_all" on public.profiles  
  for update to authenticated
  using (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and p.role in ('owner', 'admin')
    )
  );