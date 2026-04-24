create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'viewer');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'volunteer_gender') then
    create type public.volunteer_gender as enum ('female', 'male', 'other', 'prefer_not_to_say');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'availability_status') then
    create type public.availability_status as enum ('available', 'limited', 'unavailable');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'volunteer_area_role') then
    create type public.volunteer_area_role as enum ('member', 'leader', 'coordinator');
  end if;
end
$$;

