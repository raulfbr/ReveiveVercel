# Plano de Implementacao - Revive

## Metadados

- Produto: Revive
- Tipo de documento: Plano de execucao
- Base de origem: `docs/superpowers/specs/2026-04-05-revive-prd.md`
- Data: 2026-04-05
- Versao: 2.0
- Status: Pronto para execucao tecnica

---

## 1. Objetivo do Plano

Este plano transforma o PRD consolidado em uma sequencia executavel de trabalho, com foco em:

- ordem correta de implementacao
- menor risco tecnico no inicio
- menor configuracao manual recorrente
- uso pratico da integracao Vercel + Supabase
- validacao progressiva de auth, RLS, storage e dados

A prioridade e entregar um MVP funcional e seguro antes de investir em refinamentos cosmeticos ou automacoes secundarias.

---

## 2. Decisoes Tecnicas Recomendadas

### 2.1 Stack recomendada

- Next.js App Router
- TypeScript
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- `@supabase/supabase-js`
- `@supabase/ssr`
- Supabase CLI para migrations, seeds e types

### 2.2 Decisoes de implementacao

- usar Next.js como unica camada de aplicacao no MVP
- usar server actions e route handlers para escrita e callback
- evitar Edge Functions no inicio
- evitar Prisma no MVP
- evitar `service_role` no runtime normal
- usar RLS como fronteira principal de seguranca
- usar tabela `app_users` como origem de autorizacao
- usar bucket publico para branding e bucket privado para fotos

### 2.3 Decisao sobre chaves do Supabase

Como a documentacao atual do Supabase esta em transicao de `anon key` para `publishable key`, a app deve ter uma camada de configuracao que:

- prefira `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` se existir
- use `NEXT_PUBLIC_SUPABASE_ANON_KEY` apenas como fallback de compatibilidade

### 2.4 Decisao sobre bootstrap de acesso

O primeiro `admin` sera criado manualmente por SQL ou dashboard.

Depois disso:

- todo acesso novo e gerenciado no painel
- nenhum novo admin depende de editar codigo
- nenhum novo admin depende de alterar env

---

## 3. Checklist de Bootstrap do Ambiente

### 3.1 Vercel

1. Criar o projeto na Vercel.
2. Conectar o repositorio quando existir.
3. Instalar a integracao Supabase via Marketplace.
4. Confirmar as envs sincronizadas no projeto.
5. Configurar previews habilitados.

### 3.2 Supabase

1. Criar ou conectar o projeto Supabase pela integracao.
2. Confirmar URL do projeto e chaves disponiveis.
3. Habilitar Google como provider de Auth.
4. Configurar Site URL e Redirect URLs.
5. Preparar bucket `branding-assets`.
6. Preparar bucket `volunteer-photos`.
7. Validar previews e redirects automaticos gerados pela integracao.

### 3.3 Google OAuth

1. Criar OAuth Client para web.
2. Adicionar origins de localhost e producao.
3. Adicionar callback URL do Supabase.
4. Salvar Client ID e Client Secret no provider Google do Supabase.
5. Idealmente configurar dominio customizado antes do rollout interno.

### 3.4 Bootstrap inicial de dados

1. Executar migrations base.
2. Inserir seed inicial de areas.
3. Inserir um registro inicial em `app_users` para o primeiro admin.
4. Validar primeiro login real.

---

## 4. Arquitetura Alvo

### 4.1 Camadas

- camada de interface: paginas, layouts, formularios, tabela, dashboard
- camada de aplicacao: validacoes, mapeamento, autorizacao, importacao, branding
- camada de plataforma: Supabase Auth, Postgres, Storage, RLS

### 4.2 Estrategia de backend

O Next.js sera o backend de orquestracao do MVP.

Responsabilidades do Next.js:

- iniciar login com Google
- concluir callback OAuth
- validar usuario autorizado
- executar acoes de escrita
- gerar URLs de acesso quando necessario
- compor consultas para dashboard e tabela
- executar importacao com preview e confirmacao

Responsabilidades do Supabase:

- identidade e sessao
- persistencia relacional
- storage
- enforcement de acesso no banco via RLS

### 4.3 Estrutura de rotas recomendada

- `/login`
- `/auth/callback`
- `/auth/blocked`
- `/dashboard`
- `/usuarios`
- `/voluntarios`
- `/voluntarios/novo`
- `/voluntarios/[id]`
- `/areas`
- `/importar`
- `/configuracoes`

### 4.4 Estrutura de codigo recomendada

- `app/`
- `app/auth/callback/route.ts`
- `app/(auth)/login/page.tsx`
- `app/(app)/layout.tsx`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/auth/permissions.ts`
- `lib/auth/current-user.ts`
- `lib/volunteers/`
- `lib/imports/`
- `lib/settings/`
- `proxy.ts`
- `supabase/migrations/`
- `supabase/seed.sql`

---

## 5. Estrategia de Entrega

### 5.1 Ordem correta de construcao

1. plataforma e auth
2. modelo de dados e RLS
3. shell da aplicacao
4. gestao de usuarios internos
5. CRUD de voluntarios
6. leitura operacional
7. importacao
8. branding
9. QA e go-live

### 5.2 Motivo da ordem

- auth e autorizacao precisam estar corretos antes de qualquer dado sensivel
- RLS precisa estar testada antes de abrir CRUD amplo
- gestao de usuarios precisa existir cedo para nao depender de SQL depois do bootstrap inicial
- dashboard depende de dados e calculos confiaveis
- importacao reaproveita regras do dominio e da validacao

### 5.3 Regra de progresso

Nao avancar para o proximo milestone sem:

- criterio de saida atendido
- fluxo principal validado manualmente
- principais erros tratados
- risco de seguranca do milestone controlado

---

## 6. Milestones Detalhados

## 6.1 M0 - Integracao de plataforma

### Objetivo

Fechar o ambiente base para o time trabalhar com previsibilidade.

### Entregas

- projeto Next.js inicializado
- Vercel configurada
- integracao Supabase instalada na Vercel
- envs base disponiveis
- Supabase CLI inicializado
- scaffold SSR configurado

### Tarefas

- criar a aplicacao com App Router
- configurar TypeScript, lint e formatter
- instalar `@supabase/supabase-js` e `@supabase/ssr`
- criar camada `env` com suporte a publishable key e fallback anon key
- configurar clientes browser e server do Supabase
- configurar `proxy.ts`
- documentar bootstrap do ambiente

### Criterio de saida

- projeto sobe localmente
- projeto sobe em preview na Vercel
- variaveis de ambiente estao resolvidas corretamente

### Estimativa

- 0.5 a 1.5 dias

---

## 6.2 M1 - Auth, callback e bootstrap do primeiro acesso

### Objetivo

Fechar o fluxo de login antes de qualquer modulo interno.

### Entregas

- login com Google
- callback server-side funcional
- tela de acesso bloqueado
- verificacao de sessao no app
- primeira politica de autorizacao por `app_users`

### Tarefas

- configurar Google provider no Supabase
- criar rota `/auth/callback`
- criar tela `/login`
- criar tela `/auth/blocked`
- implementar leitura do usuario atual
- criar tabela `app_users`
- inserir primeiro admin
- vincular `auth_user_id` no primeiro login autorizado
- implementar logout

### Criterio de saida

- usuario autorizado entra no sistema
- usuario nao autorizado e bloqueado
- primeiro admin entra sem SQL adicional apos bootstrap

### Estimativa

- 1 a 2 dias

---

## 6.3 M2 - Banco, migrations, RLS e storage

### Objetivo

Criar a espinha dorsal do dominio com seguranca consistente.

### Entregas

- enums criados
- tabelas criadas
- indices e constraints criados
- seeds iniciais criados
- buckets de storage criados
- RLS aplicada nas tabelas expostas

### Tarefas

- criar enums de papel, genero, disponibilidade, papel por area e status de importacao
- criar tabelas `app_users`, `volunteers`, `service_areas`, `volunteer_areas`, `app_settings`, `import_jobs`
- adicionar colunas normalizadas para busca e duplicidade
- adicionar FKs e unicidade
- criar seed das areas
- configurar bucket publico `branding-assets`
- configurar bucket privado `volunteer-photos`
- escrever policies de banco por papel
- escrever policies de storage por bucket

### Criterio de saida

- migrations executam sem erro
- RLS protege tabelas centrais
- buckets aceitam operacao conforme o papel esperado

### Estimativa

- 1.5 a 2.5 dias

---

## 6.4 M3 - Shell da aplicacao e modulo de usuarios

### Objetivo

Entregar a navegacao autenticada e remover a dependencia operacional do bootstrap manual.

### Entregas

- layout autenticado
- navegacao principal
- pagina de usuarios
- criacao, alteracao e inativacao de usuarios internos
- protecao visual por papel

### Tarefas

- criar layout autenticado
- criar navegacao principal
- criar componentes base de formulario e tabela
- implementar listagem de `app_users`
- implementar criacao e edicao de usuarios
- exibir papel atual do usuario logado
- proteger a area de usuarios para `admin`

### Criterio de saida

- `admin` gerencia usuarios pelo painel
- `viewer` nao acessa modulo de usuarios

### Estimativa

- 1 a 2 dias

---

## 6.5 M4 - CRUD de voluntarios

### Objetivo

Entregar o nucleo do dominio do produto.

### Entregas

- formulario de cadastro
- edicao por id
- inativacao e reativacao
- upload de foto
- vinculo com areas
- papel por area

### Tarefas

- criar formulario de voluntario por secoes
- validar dados com esquema unico no servidor
- normalizar nome e WhatsApp na escrita
- implementar upload para bucket privado
- implementar remocao e troca de foto
- implementar persistencia de `volunteer_areas`
- implementar detalhamento e edicao

### Criterio de saida

- `admin` consegue criar, editar, inativar e reativar voluntario
- fotos podem ser enviadas e exibidas conforme autorizacao

### Estimativa

- 2 a 3 dias

---

## 6.6 M5 - Tabela analitica e dashboard

### Objetivo

Transformar os dados consolidados em leitura operacional rapida.

### Entregas

- tabela filtravel
- calculos derivados
- destaques de novo e sobrecarga
- dashboard com cards e distribuicoes principais

### Tarefas

- definir camada unica para calculos derivados
- montar consulta da tabela principal
- implementar filtros combinados
- aplicar badges de novo e risco
- montar cards do dashboard
- montar distribuicao por genero
- montar contagem por area
- montar aniversariantes do mes
- montar lista de atencao por sobrecarga

### Criterio de saida

- `viewer` e `admin` consultam dados coerentes
- numeros do dashboard batem com a listagem

### Estimativa

- 2 a 3 dias

---

## 6.7 M6 - Importacao em massa

### Objetivo

Permitir migracao de base legada com seguranca e clareza.

### Entregas

- upload CSV e XLSX
- preview antes de gravar
- mapping de colunas
- validacao por linha
- resumo final de importacao

### Tarefas

- escolher parser de CSV e XLSX
- criar fluxo upload -> preview -> confirmacao
- implementar auto-mapeamento de colunas
- implementar validacao de datas, genero, areas e obrigatoriedade
- implementar heuristica de duplicidade por nome e WhatsApp normalizados
- persistir `import_jobs`
- retornar resumo com sucessos, avisos e falhas

### Criterio de saida

- arquivo real pode ser analisado antes de gravar
- erros e duplicidades aparecem com clareza
- apenas `admin` acessa a importacao

### Estimativa

- 3 a 4.5 dias

---

## 6.8 M7 - Branding e configuracoes

### Objetivo

Entregar identidade visual administravel sem tocar em codigo.

### Entregas

- configuracao de nome da igreja
- upload de logo
- upload de capa
- cor principal persistida
- aplicacao do branding na interface

### Tarefas

- criar tela de configuracoes
- persistir `app_settings`
- implementar upload em bucket publico
- aplicar tokens de tema derivados das configuracoes
- garantir fallbacks quando o branding nao existir

### Criterio de saida

- configuracoes persistem e reaparecem apos refresh
- interface reflete a identidade visual definida

### Estimativa

- 1 a 1.5 dias

---

## 6.9 M8 - QA, endurecimento e go-live

### Objetivo

Fechar o MVP para uso controlado real.

### Entregas

- revisao de auth e RLS
- revisao de estados vazios e erro
- revisao responsiva
- validacao dos fluxos principais
- checklist de go-live

### Tarefas

- testar login autorizado e bloqueado
- testar troca de papel de usuario
- testar CRUD de voluntario
- testar bucket privado de fotos
- testar dashboard com base vazia e base preenchida
- testar importacao com arquivo valido e invalido
- revisar mensagens de erro
- revisar logs principais

### Criterio de saida

- sistema opera com seguranca minima aceitavel
- fluxos principais estao estaveis para uso interno controlado

### Estimativa

- 1.5 a 2.5 dias

---

## 7. Ordem de Execucao Recomendada

1. M0
2. M1
3. M2
4. M3
5. M4
6. M5
7. M6
8. M7
9. M8

### 7.1 Estimativa macro

Para 1 pessoa full-stack:

- faixa enxuta: 13 a 17 dias uteis
- faixa conservadora: 18 a 23 dias uteis

Maior fator de variacao:

- irregularidade da base de importacao
- refinamento de UX
- ajustes de OAuth e RLS entre localhost, preview e producao

---

## 8. Plano de Banco e RLS

### 8.1 Ordem de banco recomendada

1. enums
2. tabelas
3. constraints e indices
4. seeds
5. policies de banco
6. policies de storage

### 8.2 Policies de alto nivel

- `app_users`: `admin` gerencia todos; leitura propria quando necessario
- `volunteers`: leitura para `viewer` e `admin`; escrita para `admin`
- `service_areas`: leitura para `viewer` e `admin`; escrita para `admin`
- `volunteer_areas`: leitura para `viewer` e `admin`; escrita para `admin`
- `app_settings`: leitura para autorizados; escrita para `admin`
- `import_jobs`: leitura e escrita apenas para `admin`

### 8.3 Recomendacoes de indice

- indice por `app_users.email`
- indice por `app_users.auth_user_id`
- indice por `volunteers.normalized_name`
- indice por `volunteers.normalized_whatsapp`
- indice por `volunteers.active`
- indice por `volunteers.join_date`
- indice por `volunteer_areas.volunteer_id`
- indice por `volunteer_areas.area_id`

---

## 9. Estrategia de Auth e Acesso

### 9.1 Fluxo recomendado

1. usuario clica em entrar com Google
2. browser inicia `signInWithOAuth`
3. Supabase redireciona para Google
4. Google retorna ao callback configurado
5. rota `/auth/callback` faz `exchangeCodeForSession`
6. app consulta `app_users`
7. se autorizado, segue para area interna
8. se nao autorizado, vai para `/auth/blocked`

### 9.2 Regras de implementacao

- usar `proxy.ts` para refresh de sessao
- nao confiar apenas em checagem visual no cliente
- validar papel no servidor para qualquer acao de escrita
- evitar `getSession()` como unico mecanismo de protecao em caminhos sensiveis

### 9.3 Fluxo do primeiro login autorizado

- usuario autentica com Google
- sistema encontra registro por email em `app_users`
- se `auth_user_id` estiver vazio, salva o id do usuario autenticado
- atualiza `last_login_at`

---

## 10. Estrategia de Storage

### 10.1 `branding-assets`

- bucket publico
- usado para logo e capa
- upload apenas por `admin`
- leitura direta simplificada

### 10.2 `volunteer-photos`

- bucket privado
- usado apenas para fotos internas
- upload apenas por `admin`
- leitura autenticada, preferencialmente via URL assinada de curta duracao quando necessario

### 10.3 Convencao de paths

- `branding/logo/<timestamp>-<slug>`
- `branding/cover/<timestamp>-<slug>`
- `volunteers/<volunteer-id>/<timestamp>-photo`

---

## 11. Estrategia de Importacao

### 11.1 Fluxo tecnico

1. upload local do arquivo
2. parse inicial no cliente para preview rapido
3. mapeamento manual quando necessario
4. validacao server-side da estrutura normalizada
5. exibicao de erros, avisos e duplicidades
6. confirmacao explicita
7. gravacao final no banco
8. persistencia de `import_jobs`

### 11.2 Regras minimas de validacao

- nome obrigatorio
- datas validas
- genero reconhecivel ou tratavel
- areas reconhecidas ou claramente rejeitadas
- WhatsApp normalizavel quando presente

### 11.3 Duplicidade

Heuristica recomendada:

- match por `normalized_whatsapp`
- match por `normalized_name`
- match combinado nome + data de nascimento quando existir

### 11.4 Escopo de decisao para o MVP

O MVP deve permitir no minimo:

- ignorar linha invalida
- importar linha valida
- sinalizar duplicidade potencial

Atualizar registro existente durante a importacao pode ser deixado para fase posterior se complicar demais o fluxo.

---

## 12. Estrategia de Testes

### 12.1 Testes manuais obrigatorios

- login com usuario autorizado
- login com usuario nao autorizado
- logout
- criacao de `viewer`
- promocao de `viewer` para `admin`
- cadastro de voluntario
- edicao de voluntario
- inativacao e reativacao
- upload e exibicao de foto
- filtros da tabela
- dashboard com dados vazios e reais
- importacao valida
- importacao invalida
- branding persistido

### 12.2 Testes automatizados recomendados

- normalizacao de nome e WhatsApp
- regras de sobrecarga
- validadores de importacao
- regras de permissao
- utilitarios de auth e configuracao

### 12.3 Casos de risco alto

- usuario autenticado sem `app_users` ativo
- `viewer` tentando chamar acao de escrita
- bucket privado com policy incorreta
- callback OAuth funcionando em localhost e quebrando em preview
- area inativa ainda vinculada a voluntario historico
- planilha com colunas duplicadas ou area inexistente

---

## 13. Checklist de Go-Live

- Vercel em producao validada
- Supabase conectado corretamente
- Google OAuth validado em producao
- dominio principal definido
- primeiro admin validado
- usuarios internos iniciais criados
- RLS revisada nas tabelas principais
- bucket publico e privado revisados
- dashboard coerente
- importacao validada com arquivo real
- mensagens de erro revisadas

---

## 14. Primeira Onda de Execucao Recomendada

Se a implementacao for comecar agora, a melhor sequencia pratica e:

1. criar app Next.js e integrar Supabase
2. fechar callback OAuth e tela de bloqueio
3. criar `app_users` e bootstrap do primeiro admin
4. escrever migrations e policies centrais
5. subir shell autenticado e modulo de usuarios
6. entregar CRUD de voluntarios ponta a ponta

Essa onda reduz a maior parte do risco estrutural antes de dashboard e importacao.

---

## 15. Base Oficial Consultada

- Vercel Marketplace Storage: https://vercel.com/docs/marketplace-storage
- Supabase for Vercel: https://vercel.com/marketplace/supabase
- Supabase Auth with Next.js: https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Supabase Login with Google: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Secure Data: https://supabase.com/docs/guides/database/secure-data
- Supabase CLI: https://supabase.com/docs/reference/cli

---

## 16. Conclusao

A melhor decisao para implementar o Revive e usar o Supabase como backend completo e manter a camada de aplicacao inteira na Vercel com Next.js.

Isso reduz configuracao manual, evita duplicidade de backend, preserva seguranca com RLS e permite que a equipe concentre esforco em fluxo, usabilidade e confiabilidade do produto em vez de infraestrutura dispersa.
