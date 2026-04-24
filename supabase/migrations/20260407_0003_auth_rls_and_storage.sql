create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.app_users
  where auth_user_id = auth.uid()
    and active = true
  limit 1;
$$;

create or replace function public.is_authorized_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.app_users
    where auth_user_id = auth.uid()
      and active = true
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'admin', false);
$$;

create or replace function public.claim_app_user(p_email text)
returns table (
  id uuid,
  auth_user_id uuid,
  email text,
  full_name text,
  role public.app_role,
  active boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return;
  end if;

  return query
  update public.app_users
     set auth_user_id = coalesce(public.app_users.auth_user_id, auth.uid()),
         last_login_at = timezone('utc', now()),
         updated_at = timezone('utc', now())
   where lower(public.app_users.email) = lower(p_email)
     and public.app_users.active = true
     and (public.app_users.auth_user_id is null or public.app_users.auth_user_id = auth.uid())
  returning public.app_users.id,
            public.app_users.auth_user_id,
            public.app_users.email,
            public.app_users.full_name,
            public.app_users.role,
            public.app_users.active;
end;
$$;

grant execute on function public.current_app_role() to authenticated;
grant execute on function public.is_authorized_user() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.claim_app_user(text) to authenticated;

alter table public.app_users enable row level security;
alter table public.service_areas enable row level security;
alter table public.volunteers enable row level security;
alter table public.volunteer_areas enable row level security;

drop policy if exists "app_users_select_own" on public.app_users;
create policy "app_users_select_own"
on public.app_users
for select
to authenticated
using (auth.uid() = auth_user_id);

drop policy if exists "app_users_admin_all" on public.app_users;
create policy "app_users_admin_all"
on public.app_users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "service_areas_select_authorized" on public.service_areas;
create policy "service_areas_select_authorized"
on public.service_areas
for select
to authenticated
using (public.is_authorized_user());

drop policy if exists "service_areas_admin_write" on public.service_areas;
create policy "service_areas_admin_write"
on public.service_areas
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "volunteers_select_authorized" on public.volunteers;
create policy "volunteers_select_authorized"
on public.volunteers
for select
to authenticated
using (public.is_authorized_user());

drop policy if exists "volunteers_admin_write" on public.volunteers;
create policy "volunteers_admin_write"
on public.volunteers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "volunteer_areas_select_authorized" on public.volunteer_areas;
create policy "volunteer_areas_select_authorized"
on public.volunteer_areas
for select
to authenticated
using (public.is_authorized_user());

drop policy if exists "volunteer_areas_admin_write" on public.volunteer_areas;
create policy "volunteer_areas_admin_write"
on public.volunteer_areas
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('volunteer-photos', 'volunteer-photos', false)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "volunteer_photos_select_authorized" on storage.objects;
create policy "volunteer_photos_select_authorized"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'volunteer-photos'
  and public.is_authorized_user()
);

drop policy if exists "volunteer_photos_admin_insert" on storage.objects;
create policy "volunteer_photos_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'volunteer-photos'
  and public.is_admin()
);

drop policy if exists "volunteer_photos_admin_update" on storage.objects;
create policy "volunteer_photos_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'volunteer-photos'
  and public.is_admin()
)
with check (
  bucket_id = 'volunteer-photos'
  and public.is_admin()
);

drop policy if exists "volunteer_photos_admin_delete" on storage.objects;
create policy "volunteer_photos_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'volunteer-photos'
  and public.is_admin()
);

