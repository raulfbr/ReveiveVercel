insert into public.service_areas (name, slug, sort_order)
values
  ('Mesa de Ceia', 'mesa-de-ceia', 1),
  ('Recepcao', 'recepcao', 2),
  ('Boas-vindas', 'boas-vindas', 3),
  ('Cuidado do voluntariado', 'cuidado-voluntariado', 4),
  ('Lanche voluntariado', 'lanche-voluntariado', 5)
on conflict (slug) do update
set name = excluded.name,
    sort_order = excluded.sort_order,
    active = true;

insert into public.app_users (email, full_name, role, active)
values
  ('demo@revivevoluntariado.org', 'Conta Demo Revive', 'admin', true)
on conflict (email) do update
set full_name = excluded.full_name,
    role = excluded.role,
    active = excluded.active;

-- Este seed libera o email em app_users.
-- Para criar a senha no Supabase Auth, rode:
-- npm run seed:demo-user
