# Plano Detalhado de Implementacao - Revive

## Metadados

- Produto: Revive
- Foco: implementacao MVP com Vercel + Supabase
- Data: 2026-04-06
- Status: draft operacional detalhado
- Base: `docs/superpowers/specs/2026-04-05-revive-prd.md`
- Complementa: `docs/superpowers/plans/2026-04-05-revive-implementation-plan.md`

---

## 1. Leitura do estado atual

### 1.1 O que existe hoje neste workspace

- documentacao de produto e plano inicial
- nenhuma aplicacao Next.js criada ainda
- nenhum `package.json`, `app/`, `src/`, `supabase/` ou `vercel.json`
- a pasta atual tambem nao esta inicializada como repositorio Git

### 1.2 Implicacao pratica

O projeto esta em fase de definicao e preparo. O proximo passo correto nao e "subir para a Vercel", e sim:

1. fechar a topologia de ambientes
2. confirmar dados minimos de negocio e infraestrutura
3. criar o scaffold tecnico
4. conectar Vercel e Supabase da forma certa desde o inicio

---

## 2. Objetivo deste plano

Este plano detalha como tirar o Revive do estado documental para um MVP implantado com seguranca e previsibilidade, usando:

- Vercel para deploy, previews, ambientes e execucao da aplicacao Next.js
- Supabase para Auth, Postgres, Storage e enforcement de seguranca no banco

O foco aqui e reduzir retrabalho em cinco pontos que normalmente quebram projetos desse tipo:

- auth funcionando em producao mas quebrando em preview
- envs inconsistentes entre local, preview e producao
- RLS incompleta ou cara demais para manter
- bucket privado configurado de forma insegura
- importacao e dashboard construidos antes de fechar a espinha dorsal de auth e dados

---

## 3. Decisoes-base ja assumidas

Este plano parte das seguintes decisoes, que ja estao coerentes com o PRD atual:

- app unica em Next.js App Router
- deploy principal na Vercel
- auth via Supabase Auth com Google
- sessao SSR com `@supabase/ssr`
- banco modelado com migrations SQL do Supabase
- RLS como fronteira principal de seguranca
- autorizacao de produto em `app_users`
- bucket publico para branding
- bucket privado para fotos de voluntarios
- sem `service_role` no runtime normal da app
- sem Prisma no MVP
- sem Edge Functions no MVP

Se alguma dessas decisoes mudar, o plano ainda serve, mas precisara de ajuste nas fases de auth, dados e CI/CD.

---

## 3.1 Recorte simplificado para MVP de teste

Como o objetivo mudou para "testar o programa" e nao fazer rollout interno completo, a recomendacao muda para um corte mais enxuto.

### O que fica no MVP de teste

- login com Google
- autorizacao por `app_users`
- tela de bloqueio para nao autorizados
- cadastro, edicao e inativacao de voluntarios
- associacao de voluntarios com areas
- listagem com filtros simples

### O que sai do primeiro corte

- dominio customizado
- ambiente `staging`
- segundo projeto Supabase
- painel completo de gestao de usuarios
- importacao CSV e XLSX
- branding administravel
- dashboard analitico completo

### O que sera manual neste primeiro teste

- insercao do primeiro `admin` em `app_users`
- insercao de outros testers em `app_users`, se necessario
- seed inicial das areas

### Objetivo real deste primeiro corte

Validar rapidamente:

- se o login funciona
- se o acesso esta seguro
- se o cadastro de voluntarios atende o fluxo real
- se a listagem basica ja resolve parte do problema

---

## 4. Topologia de ambientes recomendada

### 4.1 Opcoes possiveis

#### Opcao A - um unico projeto Supabase para tudo

Vercel teria `Production`, `Preview` e `Development`, mas todos apontariam para o mesmo Supabase.

Vantagens:

- setup mais rapido
- menos custo e menos configuracao inicial

Desvantagens:

- previews podem tocar dados reais
- migrations de teste ficam perigosas
- fica facil contaminar producao com dados de QA

#### Opcao B - dois projetos Supabase, um de producao e um nao-producao

Vercel `Production` aponta para Supabase prod.
Vercel `Preview` e `Development` apontam para Supabase non-prod.

Vantagens:

- isola dados reais
- simplifica previews sem explodir custo
- reduz risco operacional no MVP

Desvantagens:

- exige duplicar algumas configuracoes de auth, buckets e seeds

#### Opcao C - Supabase com branching por fluxo de preview

Cada branch importante pode ter isolamento maior no banco.

Vantagens:

- isolamento tecnico superior
- melhor para times maiores e ciclos intensos de migracao

Desvantagens:

- maior complexidade operacional
- exige disciplina maior com migrations e lifecycle de branches
- pode ser exagero para o primeiro MVP

### 4.2 Recomendacao

A recomendacao para o **MVP de teste** e a **Opcao A**, temporariamente.

Ou seja:

- um projeto Vercel
- um projeto Supabase de teste
- local, preview e production apontando para o mesmo backend de teste

Essa simplificacao so e aceitavel enquanto:

- nao houver dados sensiveis reais em volume relevante
- o sistema estiver em validacao controlada
- as migrations ainda estiverem mudando rapido

Quando o produto for aprovado para uso interno mais serio, o caminho recomendado passa a ser a **Opcao B** com Supabase separado para producao e non-prod.

Para o MVP de teste, a Opcao A entrega o melhor equilibrio entre:

- seguranca
- simplicidade
- custo
- previsibilidade de deploy

### 4.3 Mapeamento recomendado

- `main` -> Vercel `Production` -> Supabase `test`
- qualquer branch de trabalho -> Vercel `Preview` -> Supabase `test`
- maquina local -> Vercel `Development` ou `.env.local` -> Supabase `test`

### 4.4 Quando criar um `Staging` separado

So vale criar `Custom Environment` na Vercel depois que existir ao menos um destes cenarios:

- necessidade de homologacao formal
- aprovacao por lideranca antes de promover para producao
- testes de importacao com base quase real
- validacao de dominio, redirects e OAuth sem tocar producao

Para o MVP inicial de teste, `Production + Preview + Development` continuam suficientes, mas todos podem usar o mesmo backend temporariamente.

---

## 5. Estrategia de Vercel

### 5.1 Provisionamento

1. Criar o projeto Vercel.
2. Conectar o repositorio Git quando o scaffold existir.
3. Definir `main` como production branch.
4. Habilitar preview deployments por branch.
5. Instalar a integracao Supabase via Marketplace se a conta e o projeto permitirem.

### 5.2 Ambientes na Vercel

#### Production

Usado apenas para deploy oficial.

Deve conter:

- envs apontando para Supabase `test`
- `NEXT_PUBLIC_SITE_URL` com a URL publica usada no teste, se houver

#### Preview

Usado para branches e validacoes antes do merge.

Deve conter:

- envs apontando para Supabase `test`
- sem `NEXT_PUBLIC_SITE_URL` fixada para producao final
- redirects de auth compativeis com preview URL

#### Development

Usado localmente com `vercel env pull` ou `vercel dev`.

Deve conter:

- envs equivalentes ao projeto Supabase `test`
- chaves e URLs que permitam simular auth e storage sem tocar producao

### 5.3 Regras importantes de envs

- variaveis alteradas na Vercel so afetam novos deploys
- preview envs podem ser branch-specific
- branch-specific envs devem ser usadas so quando houver necessidade real
- `NEXT_PUBLIC_SITE_URL` deve ficar restrita ao ambiente de producao
- preview deve depender do hostname do deploy atual

### 5.4 Variaveis minimas esperadas

#### Publicas

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` como fallback temporario, se necessario
- `NEXT_PUBLIC_SITE_URL` apenas em producao

#### Servidor

- `SUPABASE_SERVICE_ROLE_KEY` apenas para scripts administrativos fora do runtime da app, se realmente for necessario

### 5.5 Observacao sobre `VERCEL_URL`

O hostname do deploy pode ser usado para redirects dinamicos em preview.

Na pratica do Revive, a regra deve ser:

- producao usa a URL publica escolhida para o teste
- preview usa URL do deploy atual
- local usa `http://localhost:3000`

### 5.6 Dominio

Planejamento recomendado:

1. usar inicialmente o dominio gerado pela Vercel
2. configurar dominio customizado apenas depois de validar o MVP
3. atualizar `Site URL` e redirect URLs no Supabase quando o dominio final existir
4. testar login na URL real do teste antes de abrir para outros usuarios

---

## 6. Estrategia de Supabase

### 6.1 Provisionamento

#### Projeto `test`

Responsavel por:

- auth do MVP
- dados de teste
- previews
- desenvolvimento local
- buckets de teste
- policies iniciais

### 6.2 Regiao

Idealmente a regiao do Supabase deve ficar proxima da base principal de usuarios.

Como o uso estimado e interno e local, a escolha deve priorizar:

- latencia baixa
- residencia de dados aceitavel para a organizacao
- menor distancia entre Vercel e Supabase, quando possivel

### 6.3 Integracao com Vercel

Quando a integracao nativa estiver disponivel e fizer sentido para a conta, ela deve ser preferida porque reduz atrito em:

- sync de env vars
- conexao do projeto ao backend
- configuracao de previews
- criacao de redirect URLs para previews

### 6.4 Auth

O projeto Supabase deve iniciar com:

- Google provider habilitado
- URLs de redirect corretas
- `Site URL` da URL principal do teste
- wildcard de previews para deploys Vercel

### 6.5 Banco

Toda estrutura de dados do produto deve nascer por migration versionada.

Nao usar:

- criacao manual dispersa no dashboard como fonte principal
- alteracoes de schema sem migration correspondente

### 6.6 Storage

Criar ao menos:

- `branding-assets` como bucket publico
- `volunteer-photos` como bucket privado

Definir tambem:

- tipos de arquivo aceitos
- limite maximo por arquivo
- naming convention consistente
- estrategia de overwrite versus versionamento

---

## 7. Estrategia de auth e sessao

### 7.1 Modelo recomendado

Usar o fluxo oficial SSR do Supabase para Next.js App Router com:

- cliente browser
- cliente server
- `proxy.ts` para refresh de cookies

### 7.2 Estrutura de codigo recomendada

- `app/(auth)/login/page.tsx`
- `app/auth/callback/route.ts`
- `app/auth/blocked/page.tsx`
- `app/(app)/layout.tsx`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/proxy.ts`
- `proxy.ts`
- `lib/auth/current-user.ts`
- `lib/auth/permissions.ts`

### 7.3 Regras de protecao

- proteger leitura sensivel no servidor
- proteger qualquer escrita no servidor
- nunca confiar apenas em estado visual do cliente
- nao usar `getSession()` como unica fonte para proteger caminhos sensiveis no servidor
- preferir verificacao validada de claims e consulta autorizativa em `app_users`

### 7.4 Fluxo de login

1. usuario clica em entrar com Google
2. app monta `redirectTo` conforme ambiente
3. Supabase inicia OAuth
4. Google autentica
5. Supabase retorna ao callback permitido
6. callback troca codigo por sessao
7. servidor consulta `app_users`
8. se ativo, libera app
9. se inativo ou ausente, redireciona para bloqueio

### 7.5 Bootstrap do primeiro admin

Continuar com a regra atual:

- inserir manualmente o primeiro email em `app_users`

Depois disso:

- todo novo acesso deve ser gerenciado pelo painel

### 7.6 URLs e redirects

Configuracao recomendada no Supabase:

- `Site URL` = URL principal usada no teste
- Redirect URLs adicionais:
  - `http://localhost:3000/**`
  - `https://*-<team-ou-account-slug>.vercel.app/**`

Quando existir dominio final, preferir redirect URL exata.

---

## 8. Estrategia de dados, migrations e RLS

### 8.1 Ordem de migrations

Sequencia sugerida:

1. extensoes e helpers
2. enums
3. tabelas base
4. constraints e indices
5. funcoes helper para autorizacao
6. enable RLS
7. policies de tabelas
8. buckets e policies de storage
9. seed base

### 8.2 Estrutura sugerida de arquivos

- `supabase/migrations/20260406_0001_extensions.sql`
- `supabase/migrations/20260406_0002_enums.sql`
- `supabase/migrations/20260406_0003_tables_core.sql`
- `supabase/migrations/20260406_0004_indexes_constraints.sql`
- `supabase/migrations/20260406_0005_auth_helpers.sql`
- `supabase/migrations/20260406_0006_rls_tables.sql`
- `supabase/migrations/20260406_0007_storage.sql`
- `supabase/seed.sql`

### 8.3 Tabelas do MVP

- `app_users`
- `volunteers`
- `service_areas`
- `volunteer_areas`
- `app_settings`
- `import_jobs`

### 8.4 Principios de modelagem

- `email` sempre em lowercase
- normalizar nome e WhatsApp para busca e deduplicacao
- manter colunas `created_at` e `updated_at`
- usar soft disable com `active` quando houver impacto operacional
- separar papel do usuario interno do papel do voluntario por area

### 8.5 RLS - diretrizes

- habilitar RLS em todas as tabelas expostas
- usar `to authenticated` nas policies quando aplicavel
- evitar policies sem filtro explicito
- usar helper function para testar `admin`, se isso simplificar a leitura
- manter autorizacao do produto fora de `raw_user_meta_data`

### 8.6 Regras iniciais por tabela

#### `app_users`

- `admin` le e gerencia todos
- usuario autenticado pode ler apenas o proprio registro quando necessario

#### `volunteers`

- `viewer` e `admin` podem ler
- apenas `admin` escreve

#### `service_areas`

- `viewer` e `admin` podem ler
- apenas `admin` escreve

#### `volunteer_areas`

- `viewer` e `admin` podem ler
- apenas `admin` escreve

#### `app_settings`

- leitura para usuarios autorizados
- escrita apenas por `admin`

#### `import_jobs`

- leitura e escrita apenas por `admin`

### 8.7 Performance de policy

No desenho das policies:

- preferir checks simples
- evitar joins desnecessarios
- quando usar `auth.uid()`, considerar a forma recomendada em query encapsulada
- adicionar filtros explicitos nas consultas de aplicacao, mesmo com RLS

---

## 9. Estrategia de storage

### 9.1 `branding-assets`

- bucket publico
- upload apenas por `admin`
- usado para logo e capa
- leitura direta por URL publica

### 9.2 `volunteer-photos`

- bucket privado
- upload apenas por `admin`
- leitura por URL assinada curta ou acesso autenticado controlado

### 9.3 Convencao de paths

- `branding/logo/<timestamp>-<slug>`
- `branding/cover/<timestamp>-<slug>`
- `volunteers/<volunteer-id>/<timestamp>-photo`

### 9.4 Regras de upload

- validar MIME type no servidor
- limitar tamanho maximo do arquivo
- definir se imagem sera recortada ou apenas redimensionada
- decidir se overwrite sera permitido

### 9.5 Regra de exibicao

Para foto privada de voluntario:

- nao persistir URL assinada no banco
- persistir apenas o path
- gerar URL assinada sob demanda

---

## 10. Ondas de implementacao

## 10.0 Recorte executavel do MVP de teste

### Incluir agora

- Onda 0
- Onda 1
- Onda 2
- Onda 3
- Onda 5
- uma versao reduzida da Onda 6 apenas com listagem e filtros simples

### Adiar

- Onda 4 como modulo completo de gestao de usuarios
- Onda 7 importacao
- Onda 8 branding
- dashboard analitico completo da Onda 6
- Onda 9 como endurecimento final de rollout

### Forma pratica de pensar esse corte

O primeiro teste precisa responder apenas:

1. conseguimos entrar no sistema com seguranca?
2. conseguimos cadastrar e consultar voluntarios?
3. a estrutura de areas funciona?

Se a resposta for sim, ai vale investir em importacao, dashboard e acabamento.

## 10.1 Onda 0 - Preparacao do workspace

### Objetivo

Criar base operacional do projeto antes do primeiro deploy.

### Entregas

- repositorio Git inicializado
- scaffold Next.js criado
- padrao de branch definido
- documento de setup criado

### Tarefas

- inicializar Git
- criar app com Next.js App Router e TypeScript
- configurar lint e scripts padrao
- validar `npm run build`
- registrar convencoes de branch e deploy

### Criterio de saida

- app sobe localmente
- projeto esta pronto para ser importado na Vercel

## 10.2 Onda 1 - Infra Vercel + Supabase

### Objetivo

Fechar conexao entre aplicacao, deploy e backend.

### Entregas

- projeto Vercel criado
- projeto Supabase `test` criado
- envs mapeadas por ambiente
- bootstrap de redirect URLs definido

### Tarefas

- criar ou conectar projetos Supabase
- instalar integracao Supabase na Vercel, se possivel
- popular envs em `Production`, `Preview` e `Development`
- configurar URL principal de teste
- validar preview deployment minimo

### Criterio de saida

- deploy preview sobe
- deploy production consegue buildar
- app resolve envs corretas por ambiente

## 10.3 Onda 2 - Auth SSR e `app_users`

### Objetivo

Fechar acesso seguro antes de qualquer modulo interno.

### Entregas

- login Google
- callback funcional
- bloqueio de nao autorizados
- `app_users` operacional
- primeiro admin funcional

### Tarefas

- configurar Google provider no projeto `test`
- criar `client.ts`, `server.ts`, `proxy.ts`
- criar rota de callback
- criar pagina de login e bloqueio
- criar migration de `app_users`
- implementar vinculacao de `auth_user_id`
- implementar logout

### Criterio de saida

- admin autorizado entra
- email sem acesso e bloqueado
- preview e local autenticam corretamente

## 10.4 Onda 3 - Modelo de dados, RLS e storage

### Objetivo

Montar a espinha dorsal segura do sistema.

### Entregas

- enums
- tabelas
- indices
- policies
- buckets

### Tarefas

- escrever migrations completas
- criar helper de autorizacao SQL
- habilitar RLS
- criar policies por tabela
- criar buckets e policies de storage
- aplicar seed inicial de areas

### Criterio de saida

- migrations aplicam limpas no ambiente `test`
- policies permitem o fluxo do admin
- policies bloqueiam escrita de `viewer`

## 10.5 Onda 4 - Shell autenticado e gestao de usuarios

### Objetivo

Remover dependencia de SQL apos o bootstrap inicial.

### Entregas

- layout autenticado
- navegacao principal
- CRUD de usuarios internos

### Observacao para o MVP de teste

Este modulo pode ser adiado.

No primeiro corte:

- o primeiro `admin` entra por seed SQL
- outros testers podem ser inseridos manualmente em `app_users`
- a tela de gestao de usuarios pode ficar para a segunda fase

### Tarefas

- criar layout autenticado
- criar navegacao lateral ou superior
- listar usuarios autorizados
- criar, editar e inativar `app_users`
- restringir modulo a `admin`

### Criterio de saida

- `admin` administra acessos pelo painel
- `viewer` nao entra nessa area

## 10.6 Onda 5 - CRUD de voluntarios e fotos

### Objetivo

Entregar o nucleo operacional do produto.

### Entregas

- cadastro manual
- edicao
- inativacao e reativacao
- upload e troca de foto
- vinculo com areas

### Tarefas

- implementar formulario por secoes
- validar schema no servidor
- salvar `volunteer_areas`
- gerar URL assinada para exibicao de foto
- tratar remocao e troca de imagem

### Criterio de saida

- admin opera fluxo completo de voluntario
- fotos privadas aparecem somente para usuarios autorizados

## 10.7 Onda 6 - Dashboard, tabela e filtros

### Objetivo

Transformar dados em leitura operacional.

### Entregas

- cards
- tabela filtravel
- badges de novo e sobrecarga
- listas derivadas

### Observacao para o MVP de teste

Nesta fase, reduzir para:

- listagem de voluntarios
- filtros simples por area e status
- contagem basica de ativos

Sem necessidade de:

- distribuicoes visuais
- cards avancados
- listas analiticas

### Tarefas

- criar camada unica de calculos derivados
- implementar consultas com filtros explicitos
- montar dashboard e listagem
- validar coerencia entre cards e tabela

### Criterio de saida

- `viewer` consulta tudo que precisa
- numeros batem entre widgets e listagem

## 10.8 Onda 7 - Importacao

### Objetivo

Permitir absorver base legada com seguranca.

### Entregas

- upload CSV e XLSX
- preview
- validacao
- confirmacao
- resumo final

### Tarefas

- escolher parser
- definir shape normalizado intermediario
- implementar auto-mapeamento
- validar duplicidade
- persistir `import_jobs`

### Criterio de saida

- arquivo real pode ser analisado antes de gravar
- erros ficam claros
- apenas admin importa

## 10.9 Onda 8 - Branding e configuracoes

### Objetivo

Fechar o produto visual sem exigir codigo para ajustes simples.

### Entregas

- nome da igreja
- logo
- capa
- cor principal

### Tarefas

- criar tela de configuracoes
- persistir `app_settings`
- usar bucket publico para branding
- aplicar tokens de tema dinamicos com fallback

### Criterio de saida

- configuracoes persistem entre sessoes
- UI reflete a identidade definida

## 10.10 Onda 9 - Hardening, rollout e operacao

### Objetivo

Preparar uso interno real.

### Entregas

- revisao de auth
- revisao de RLS
- revisao responsiva
- logs basicos e checklist de go-live

### Tarefas

- testar local, preview e producao
- revisar mensagens de erro
- revisar logs de runtime
- validar dominio, OAuth e redirects finais
- rodar checklist operacional

### Criterio de saida

- fluxo principal confiavel
- risco operacional controlado

---

## 11. Estrategia de testes e validacao

### 11.1 Testes obrigatorios por ambiente

#### Local

- login com Google no ambiente `test`
- callback funcional
- CRUD basico
- URLs assinadas para fotos

#### Preview

- login com Google usando URL do deploy
- bloqueio de usuario nao autorizado
- carregamento de dashboard e listagem
- upload de foto em bucket privado do ambiente `test`

#### Production

- login com a URL principal usada no teste
- callback com a URL principal usada no teste
- admin real entra
- viewer real consulta
- listagem principal carrega

### 11.2 Testes automatizados recomendados

- normalizacao de nome
- normalizacao de WhatsApp
- regras de sobrecarga
- validadores de importacao
- guards de permissao
- helper de resolucao de URL base

### 11.3 Casos criticos

- preview autenticando e redirecionando para producao
- local autenticando e redirecionando para preview
- `viewer` chamando escrita por action ou route handler
- policy de storage permitindo leitura indevida
- importacao criando duplicatas por normalizacao falha

---

## 12. Dados necessarios para fechar o plano sem risco

## 12.1 Bloqueantes de infraestrutura

- nome do projeto na Vercel
- time ou conta da Vercel que hospedara o projeto
- slug do time ou conta para compor redirect wildcard
- branch principal desejada
- decisao entre Supabase novo ou projeto Supabase ja existente
- regiao desejada do Supabase

## 12.2 Bloqueantes de auth

- conta Google Workspace ou contas livres?
- existe restricao por dominio de email ou a autorizacao sera apenas por `app_users`?
- quem sera o primeiro `admin`?
- ja existe projeto no Google Cloud para OAuth?

## 12.3 Bloqueantes de negocio

- lista inicial de areas de servico
- definicao final dos papeis por area: `member`, `leader`, `coordinator` estao corretos?
- campos obrigatorios reais no cadastro de voluntario
- regra final de disponibilidade

## 12.4 Bloqueantes de importacao

Nao sao mais bloqueantes para o MVP de teste, porque importacao sai do primeiro corte.

## 12.5 Bloqueantes de branding

Nao sao mais bloqueantes para o MVP de teste, porque branding sai do primeiro corte.

## 12.6 Dados importantes, mas nao bloqueantes

- volume esperado de voluntarios no primeiro ano
- numero estimado de usuarios internos
- politica de backup e retencao desejada
- restricoes de LGPD ou politica interna da igreja
- limite maximo aceitavel para fotos

---

## 13. Perguntas de maior impacto para responder antes do scaffold

1. Vamos usar apenas um projeto Supabase de teste neste primeiro corte?
2. O acesso sera liberado apenas por `app_users` ou tambem por dominio de email?
3. Quais emails devem entrar como testers iniciais em `app_users`?
4. Quais areas devem entrar no seed inicial?
5. Quais campos serao obrigatorios no cadastro de voluntario?

Se essas cinco respostas existirem, o scaffold tecnico ja pode comecar com muito menos risco.

---

## 14. Ordem operacional recomendada a partir daqui

1. confirmar topologia de ambientes
2. confirmar dados bloqueantes acima
3. criar scaffold Next.js
4. iniciar Git e conectar Vercel
5. provisionar um unico Supabase `test`
6. fechar auth SSR e `app_users`
7. escrever migrations e policies
8. entregar CRUD de voluntarios e listagem simples
9. testar com usuarios reais
10. decidir depois se vale subir para fase 2

---

## 15. Fontes oficiais verificadas em 2026-04-06

- Vercel Deployments: https://vercel.com/docs/deployments
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
- Vercel Environments: https://vercel.com/docs/deployments/environments
- Supabase for Vercel: https://vercel.com/marketplace/supabase
- Supabase Auth with Next.js: https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Supabase SSR for Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase Redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- Supabase Social Login: https://supabase.com/docs/guides/auth/social-login
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage Access Control: https://supabase.com/docs/guides/storage/security/access-control
- Supabase Storage Buckets Fundamentals: https://supabase.com/docs/guides/storage/buckets/fundamentals
- Supabase Serving Assets from Storage: https://supabase.com/docs/guides/storage/serving/downloads

---

## 16. Conclusao

O Revive nao precisa apenas de um app Next.js. Ele precisa de um desenho de ambientes que mantenha preview segura, auth previsivel e dados protegidos desde o primeiro deploy.

Hoje, o melhor caminho e:

- Vercel com `Production`, `Preview` e `Development`
- um unico Supabase `test`
- auth SSR oficial
- redirect URLs bem separadas por ambiente
- RLS e storage definidos antes do CRUD amplo
- corte funcional enxuto para aprender rapido

Com os dados listados na secao 12, este plano pode ser convertido em execucao tecnica imediatamente.
