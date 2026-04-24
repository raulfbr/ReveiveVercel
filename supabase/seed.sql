insert into public.service_areas (name, slug, sort_order)
values
  ('Recepcao', 'recepcao', 1),
  ('Louvor', 'louvor', 2),
  ('Midia', 'midia', 3),
  ('Kids', 'kids', 4),
  ('Intercessao', 'intercessao', 5)
on conflict (slug) do update
set name = excluded.name,
    sort_order = excluded.sort_order;

-- Insira manualmente ao menos um admin e um viewer para testar o MVP:
-- insert into public.app_users (email, full_name, role, active)
-- values
--   ('admin@exemplo.com', 'Admin Teste', 'admin', true),
--   ('viewer@exemplo.com', 'Viewer Teste', 'viewer', true);
