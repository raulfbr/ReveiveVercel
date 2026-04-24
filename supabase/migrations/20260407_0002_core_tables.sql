create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  full_name text,
  role public.app_role not null default 'viewer',
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  last_login_at timestamptz
);

create table if not exists public.service_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  normalized_name text not null,
  photo_path text,
  gender public.volunteer_gender,
  birth_date date,
  join_date date,
  address text,
  whatsapp text,
  normalized_whatsapp text,
  availability_status public.availability_status,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.volunteer_areas (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid not null references public.volunteers(id) on delete cascade,
  area_id uuid not null references public.service_areas(id) on delete restrict,
  role_in_area public.volunteer_area_role not null default 'member',
  created_at timestamptz not null default timezone('utc', now()),
  unique (volunteer_id, area_id)
);

create index if not exists idx_app_users_email on public.app_users (email);
create index if not exists idx_app_users_auth_user_id on public.app_users (auth_user_id);
create index if not exists idx_service_areas_active on public.service_areas (active);
create index if not exists idx_volunteers_active on public.volunteers (active);
create index if not exists idx_volunteers_normalized_name on public.volunteers (normalized_name);
create index if not exists idx_volunteers_normalized_whatsapp on public.volunteers (normalized_whatsapp);
create index if not exists idx_volunteer_areas_volunteer_id on public.volunteer_areas (volunteer_id);
create index if not exists idx_volunteer_areas_area_id on public.volunteer_areas (area_id);

drop trigger if exists set_app_users_updated_at on public.app_users;
create trigger set_app_users_updated_at
before update on public.app_users
for each row
execute function public.set_updated_at();

drop trigger if exists set_volunteers_updated_at on public.volunteers;
create trigger set_volunteers_updated_at
before update on public.volunteers
for each row
execute function public.set_updated_at();

