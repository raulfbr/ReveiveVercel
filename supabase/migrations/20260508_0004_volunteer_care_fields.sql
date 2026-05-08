do $$
begin
  if not exists (select 1 from pg_type where typname = 'volunteer_care_status') then
    create type public.volunteer_care_status as enum ('new', 'active', 'needs_contact', 'paused', 'inactive');
  end if;
end
$$;

alter table public.volunteers
  add column if not exists care_status public.volunteer_care_status not null default 'active',
  add column if not exists last_contact_at date,
  add column if not exists next_step text,
  add column if not exists care_responsible text,
  add column if not exists next_follow_up_at date;

create index if not exists idx_volunteers_care_status on public.volunteers (care_status);
create index if not exists idx_volunteers_last_contact_at on public.volunteers (last_contact_at);
create index if not exists idx_volunteers_next_follow_up_at on public.volunteers (next_follow_up_at);

update public.volunteers
set care_status = 'inactive'
where active = false;
