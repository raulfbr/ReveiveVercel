alter table public.volunteer_import_logs
add column if not exists created_volunteer_ids uuid[] not null default '{}'::uuid[];

create index if not exists idx_volunteer_import_logs_created_volunteer_ids
on public.volunteer_import_logs using gin (created_volunteer_ids);
