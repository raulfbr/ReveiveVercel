-- Demo seed for the Dados/Escalas MVP.
-- Run only in a test/dev Supabase project after applying all migrations.
-- This file prepares the first five volunteer fronts requested for the Revive presentation.

insert into public.service_areas (name, slug, sort_order, active)
values
  ('Mesa de Ceia', 'mesa-de-ceia', 1, true),
  ('Recepcao', 'recepcao', 2, true),
  ('Boas-vindas', 'boas-vindas', 3, true),
  ('Cuidado do voluntariado', 'cuidado-voluntariado', 4, true),
  ('Lanche voluntariado', 'lanche-voluntariado', 5, true)
on conflict (slug) do update
set name = excluded.name,
    sort_order = excluded.sort_order,
    active = excluded.active;

update public.service_areas
set active = false
where slug in ('louvor', 'midia', 'kids', 'intercessao');

insert into public.app_users (email, full_name, role, active)
values
  ('demo@revivevoluntariado.org', 'Conta Demo Revive', 'admin', true)
on conflict (email) do update
set full_name = excluded.full_name,
    role = excluded.role,
    active = excluded.active;

delete from public.volunteers
where normalized_whatsapp in (
  '11999991001',
  '11999991002',
  '11999991003',
  '11999991004',
  '11999991005',
  '11999991006',
  '11999991007',
  '11999991008',
  '11999991009',
  '11999991010'
)
   or normalized_name in (
     'ana martins demo',
     'bruno oliveira demo',
     'carol santos demo',
     'daniel costa demo',
     'fernanda costa demo',
     'ester almeida demo',
     'gustavo lima demo',
     'helena rocha demo',
     'igor nunes demo',
     'juliana pereira demo'
   );

with inserted_volunteers as (
  insert into public.volunteers (
    name,
    normalized_name,
    gender,
    birth_date,
    join_date,
    whatsapp,
    normalized_whatsapp,
    availability_status,
    care_status,
    last_contact_at,
    next_step,
    care_responsible,
    next_follow_up_at,
    notes,
    active
  )
  values
    (
      'Ana Martins Demo',
      'ana martins demo',
      'female',
      '1990-05-12',
      current_date - interval '730 days',
      '(11) 99999-1001',
      '11999991001',
      'available',
      'active',
      current_date - interval '8 days',
      'Confirmar escala da Mesa de Ceia no primeiro domingo do mes.',
      'Raul',
      current_date + interval '6 days',
      'Referencia da Mesa de Ceia. Esta frente acontece apenas no primeiro domingo do mes.',
      true
    ),
    (
      'Bruno Oliveira Demo',
      'bruno oliveira demo',
      'male',
      '1987-09-03',
      current_date - interval '420 days',
      '(11) 99999-1002',
      '11999991002',
      'limited',
      'needs_contact',
      current_date - interval '45 days',
      'Conversar sobre carga e ajustar frequencia na Recepcao.',
      'Lucas',
      current_date - interval '5 days',
      'Lider da Recepcao. Ajuda a organizar duas pessoas na frente e duas atras.',
      true
    ),
    (
      'Carol Santos Demo',
      'carol santos demo',
      'female',
      '1997-05-28',
      current_date - interval '210 days',
      '(11) 99999-1003',
      '11999991003',
      'available',
      'active',
      current_date - interval '14 days',
      'Manter na frente da Recepcao e treinar uma pessoa nova.',
      'Raul',
      current_date + interval '10 days',
      'Recepcao - frente. Boa comunicacao com visitantes.',
      true
    ),
    (
      'Daniel Costa Demo',
      'daniel costa demo',
      'male',
      '1992-12-12',
      current_date - interval '360 days',
      '(11) 99999-1004',
      '11999991004',
      'available',
      'active',
      current_date - interval '18 days',
      'Confirmar se o casal prefere servir junto ou alternado.',
      'Gui',
      current_date + interval '4 days',
      'Recepcao - atras. Serve como casal com Fernanda em algumas escalas.',
      true
    ),
    (
      'Fernanda Costa Demo',
      'fernanda costa demo',
      'female',
      '1993-03-18',
      current_date - interval '355 days',
      '(11) 99999-1005',
      '11999991005',
      'available',
      'active',
      current_date - interval '18 days',
      'Alinhar escala conjunta com Daniel quando fizer sentido.',
      'Gui',
      current_date + interval '4 days',
      'Recepcao - atras e Boas-vindas. Pode servir como casal com Daniel.',
      true
    ),
    (
      'Ester Almeida Demo',
      'ester almeida demo',
      'female',
      '2001-01-21',
      current_date - interval '9 days',
      '(11) 99999-1006',
      '11999991006',
      'available',
      'new',
      current_date - interval '2 days',
      'Fazer conversa de integracao e decidir primeira frente.',
      'Raul',
      current_date + interval '2 days',
      'Nova voluntaria ainda sem area definida. Excelente exemplo para a fila de integracao.',
      true
    ),
    (
      'Gustavo Lima Demo',
      'gustavo lima demo',
      'male',
      '1984-08-09',
      current_date - interval '900 days',
      '(11) 99999-1007',
      '11999991007',
      'limited',
      'active',
      current_date - interval '12 days',
      'Mapear quem pode ajudar no cuidado ativo dos voluntarios.',
      'Lucas',
      current_date + interval '14 days',
      'Coordenador do Cuidado do voluntariado.',
      true
    ),
    (
      'Helena Rocha Demo',
      'helena rocha demo',
      'female',
      '1995-11-30',
      current_date - interval '180 days',
      null,
      null,
      'available',
      'active',
      current_date - interval '6 days',
      'Atualizar WhatsApp e confirmar disponibilidade mensal.',
      'Raul',
      current_date + interval '8 days',
      'Cuidado do voluntariado. Sem WhatsApp cadastrado para demonstrar qualidade da base.',
      true
    ),
    (
      'Igor Nunes Demo',
      'igor nunes demo',
      'male',
      '1989-06-07',
      current_date - interval '540 days',
      '(11) 99999-1009',
      '11999991009',
      'limited',
      'paused',
      current_date - interval '30 days',
      'Revisar pausa antes de voltar ao Lanche voluntariado.',
      'Lucas',
      current_date + interval '21 days',
      'Lider do Lanche voluntariado em pausa temporaria.',
      true
    ),
    (
      'Juliana Pereira Demo',
      'juliana pereira demo',
      'female',
      '1998-04-16',
      current_date - interval '260 days',
      '(11) 99999-1010',
      '11999991010',
      'available',
      'needs_contact',
      current_date - interval '50 days',
      'Verificar possivel sobrecarga por atuar em tres frentes.',
      'Raul',
      current_date - interval '1 day',
      'Apoia Mesa de Ceia, Lanche e Cuidado. Boa para demonstrar alerta de sobrecarga.',
      true
    )
  returning id, normalized_name
),
area_lookup as (
  select id, slug from public.service_areas
  where slug in ('mesa-de-ceia', 'recepcao', 'boas-vindas', 'cuidado-voluntariado', 'lanche-voluntariado')
),
assignments as (
  select v.id as volunteer_id, a.id as area_id, 'coordinator'::public.volunteer_area_role as role_in_area
  from inserted_volunteers v
  join area_lookup a on a.slug = 'mesa-de-ceia'
  where v.normalized_name = 'ana martins demo'

  union all
  select v.id, a.id, 'leader'::public.volunteer_area_role
  from inserted_volunteers v
  join area_lookup a on a.slug = 'recepcao'
  where v.normalized_name = 'bruno oliveira demo'

  union all
  select v.id, a.id, 'member'::public.volunteer_area_role
  from inserted_volunteers v
  join area_lookup a on a.slug = 'recepcao'
  where v.normalized_name in ('carol santos demo', 'daniel costa demo', 'fernanda costa demo')

  union all
  select v.id, a.id, 'member'::public.volunteer_area_role
  from inserted_volunteers v
  join area_lookup a on a.slug = 'boas-vindas'
  where v.normalized_name in ('daniel costa demo', 'fernanda costa demo')

  union all
  select v.id, a.id, case when v.normalized_name = 'gustavo lima demo' then 'coordinator'::public.volunteer_area_role else 'member'::public.volunteer_area_role end
  from inserted_volunteers v
  join area_lookup a on a.slug = 'cuidado-voluntariado'
  where v.normalized_name in ('gustavo lima demo', 'helena rocha demo', 'juliana pereira demo')

  union all
  select v.id, a.id, case when v.normalized_name = 'igor nunes demo' then 'leader'::public.volunteer_area_role else 'member'::public.volunteer_area_role end
  from inserted_volunteers v
  join area_lookup a on a.slug = 'lanche-voluntariado'
  where v.normalized_name in ('igor nunes demo', 'juliana pereira demo')

  union all
  select v.id, a.id, 'member'::public.volunteer_area_role
  from inserted_volunteers v
  join area_lookup a on a.slug = 'mesa-de-ceia'
  where v.normalized_name = 'juliana pereira demo'
)
insert into public.volunteer_areas (volunteer_id, area_id, role_in_area)
select volunteer_id, area_id, role_in_area from assignments
on conflict (volunteer_id, area_id) do update
set role_in_area = excluded.role_in_area;
