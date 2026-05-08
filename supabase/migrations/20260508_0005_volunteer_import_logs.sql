create table if not exists public.volunteer_import_logs (
  id uuid primary key default gen_random_uuid(),
  created_by_app_user_id uuid references public.app_users(id) on delete set null,
  created_by_email text,
  source text not null default 'csv',
  total_rows integer not null default 0,
  imported_count integer not null default 0,
  skipped_count integer not null default 0,
  privacy_confirmed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_volunteer_import_logs_created_at
on public.volunteer_import_logs (created_at desc);

create index if not exists idx_volunteer_import_logs_created_by_app_user_id
on public.volunteer_import_logs (created_by_app_user_id);

alter table public.volunteer_import_logs enable row level security;

drop policy if exists "volunteer_import_logs_select_authorized" on public.volunteer_import_logs;
create policy "volunteer_import_logs_select_authorized"
on public.volunteer_import_logs
for select
to authenticated
using (public.is_authorized_user());

drop policy if exists "volunteer_import_logs_admin_insert" on public.volunteer_import_logs;
create policy "volunteer_import_logs_admin_insert"
on public.volunteer_import_logs
for insert
to authenticated
with check (public.is_admin());
