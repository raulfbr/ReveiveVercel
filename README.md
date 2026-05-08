# Revive

MVP de teste para gestao de voluntarios com Next.js App Router, Vercel e Supabase.

## O que esta implementado

- login com email/senha para demonstracao
- login com Google via Supabase Auth para uso interno
- autorizacao por `app_users`
- tela de bloqueio para usuarios sem acesso
- listagem de voluntarios com filtros simples
- detalhe de voluntario com leitura para `viewer`
- create, update, inativacao e reativacao para `admin`
- upload e exibicao de foto em bucket privado `volunteer-photos`
- MVP Dados/Escalas com Painel de Cuidado, Mapa Vivo, Jornada, Integracao, Treinamento, Cuidado, Captacao e Qualidade da Base
- importacao de voluntarios por CSV com validacao e historico
- demo publica para apresentacao sem login
- migrations SQL, RLS, seed inicial e seed de demonstracao

## Conta demo para apresentacao

Use somente em ambiente de teste ou preview.

- email: `demo@revivevoluntariado.org`
- senha: `ReviveDemo2026!`
- papel: `admin`

A tela `/login` ja mostra esses dados para facilitar a apresentacao quando voce nao estiver presente.

Importante: essa conta e propositalmente generica. Nao use essa senha em ambiente de producao real.

## Frentes iniciais do voluntariado

O seed de demonstracao comeca com estas 5 frentes:

1. `Mesa de Ceia`: acontece apenas no primeiro domingo do mes.
2. `Recepcao`: duas pessoas na frente e duas atras; em alguns casos pode ser casal.
3. `Boas-vindas`.
4. `Cuidado do voluntariado`.
5. `Lanche voluntariado`.

O arquivo `supabase/demo_seed_dados_escalas.sql` popula 10 voluntarios ficticios, incluindo exemplos de:

- pessoa nova sem area definida;
- pessoa com retorno vencido;
- pessoa sem WhatsApp cadastrado;
- pessoa em pausa;
- pessoa atuando em tres frentes, para demonstrar alerta de sobrecarga;
- casal servindo junto na Recepcao.

## Rotas para testar

Publicas, sem login:

- `http://127.0.0.1:3001/demo/dados/kit`
- `http://127.0.0.1:3001/demo/dados/apresentacao`
- `http://127.0.0.1:3001/demo/dados`

Autenticadas, apos login:

- `http://127.0.0.1:3001/dados`
- `http://127.0.0.1:3001/dados/mapa`
- `http://127.0.0.1:3001/dados/jornada`
- `http://127.0.0.1:3001/dados/integracao`
- `http://127.0.0.1:3001/dados/treinamento`
- `http://127.0.0.1:3001/dados/cuidado`
- `http://127.0.0.1:3001/dados/captacao`
- `http://127.0.0.1:3001/dados/qualidade`
- `http://127.0.0.1:3001/dados/importar`
- `http://127.0.0.1:3001/voluntarios`

## Publicar no GitHub e Vercel

Fluxo recomendado:

1. Criar um projeto Supabase de teste.
2. Aplicar todas as migrations de `supabase/migrations/` em ordem.
3. Rodar `supabase/seed.sql`.
4. Rodar `supabase/demo_seed_dados_escalas.sql`.
5. Criar a conta demo no Supabase Auth com `npm run seed:demo-user` ou manualmente pelo painel do Supabase.
6. Subir o projeto para o GitHub.
7. Importar o repositorio na Vercel.
8. Configurar as variaveis de ambiente na Vercel.
9. Fazer deploy.
10. Testar `/login` e `/dados` no dominio da Vercel.

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`, opcional se a publishable key ja estiver preenchida
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_DEMO_AUTH_EMAIL`
- `NEXT_PUBLIC_DEMO_AUTH_PASSWORD`

Para rodar o script `npm run seed:demo-user`, tambem preencha localmente:

- `SUPABASE_SERVICE_ROLE_KEY`
- `DEMO_AUTH_EMAIL`
- `DEMO_AUTH_PASSWORD`
- `DEMO_AUTH_FULL_NAME`
- `DEMO_AUTH_ROLE`

Nao coloque `SUPABASE_SERVICE_ROLE_KEY` em codigo publico, componente client ou variavel `NEXT_PUBLIC`. Ela serve apenas para script administrativo.

## Criar a conta demo

Opcao recomendada pelo terminal:

```bash
npm run seed:demo-user
```

Esse comando:

- cria ou atualiza o usuario no Supabase Auth;
- confirma o email automaticamente;
- cria ou atualiza o registro em `app_users`;
- vincula `auth_user_id` para o login funcionar direto.

Opcao manual pelo Supabase:

1. Abra o painel do Supabase.
2. Va em Authentication > Users.
3. Crie um usuario com email `demo@revivevoluntariado.org` e senha `ReviveDemo2026!`.
4. Marque o email como confirmado.
5. Rode `supabase/seed.sql` para garantir o registro em `app_users`.
6. No primeiro login, o app tenta vincular automaticamente esse email via `claim_app_user`.

## Setup Supabase

Depois de criar o projeto Supabase:

1. Aplique as migrations em `supabase/migrations/`.
2. Execute `supabase/seed.sql`.
3. Execute `supabase/demo_seed_dados_escalas.sql`.
4. Configure o provider Google se tambem quiser login interno via Google.
5. Adicione as redirect URLs quando usar Google:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3001/auth/callback`
   - `https://<preview>.vercel.app/auth/callback`
   - `https://<seu-dominio-ou-url-vercel>/auth/callback`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run seed:demo-user`

## MVP Dados/Escalas

Ideia central:

> Dados no Revive existem para que nenhuma pessoa se perca no caminho, nenhum lider caminhe no escuro e nenhum ministerio dependa apenas de improviso.

Depois do login, usuarios autorizados sao direcionados para `/dados`, que e a tela principal do MVP Dados/Escalas.

Arquivos de apoio:

- PRD: `DOCUMENTOS/04-prd-mvp-dados-escalas-voluntariado-revive.md`
- roteiro: `DOCUMENTOS/05-roteiro-apresentacao-mvp-dados-escalas.md`
- checklist de implantacao: `DOCUMENTOS/06-checklist-implantacao-mvp-dados-escalas.md`
- mensagem final para o grupo: `DOCUMENTOS/07-mensagem-final-grupo-demo-mvp-dados-escalas.md`
- guia de publicacao/preview: `DOCUMENTOS/09-guia-publicacao-preview-mvp-dados-escalas.md`
- migration de cuidado: `supabase/migrations/20260508_0004_volunteer_care_fields.sql`
- seed de demonstracao: `supabase/demo_seed_dados_escalas.sql`
