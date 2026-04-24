# Revive

MVP de teste para gestao de voluntarios com Next.js App Router, Vercel e Supabase.

## O que esta implementado

- login com Google via Supabase Auth
- autorizacao por `app_users`
- tela de bloqueio para usuarios sem acesso
- listagem de voluntarios com filtros simples
- detalhe de voluntario com leitura para `viewer`
- create, update, inativacao e reativacao para `admin`
- upload e exibicao de foto em bucket privado `volunteer-photos`
- migrations SQL, RLS e seed inicial

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

O app prefere `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e usa `NEXT_PUBLIC_SUPABASE_ANON_KEY` como fallback de compatibilidade.

## Setup manual restante

1. Criar um projeto Supabase de teste.
2. Configurar o provider Google no Supabase Auth.
3. Adicionar as redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://<preview>.vercel.app/auth/callback`
   - `https://<seu-dominio-ou-url-vercel>/auth/callback`
4. Aplicar as migrations em `supabase/migrations/`.
5. Executar `supabase/seed.sql`.
6. Inserir manualmente ao menos um `admin` e um `viewer` em `app_users`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
