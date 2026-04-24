# PRD - Revive

## Metadados

- Produto: Revive
- Tipo: Plataforma web interna para gestao de voluntarios
- Organizacao: Igreja Revive
- Data: 2026-04-05
- Versao: 3.0
- Status: Aprovado para planejamento e execucao
- Base tecnica: Vercel + Supabase

---

## 1. Resumo Executivo

Revive sera uma plataforma web interna para centralizar a gestao de voluntarios da Igreja Revive com foco em simplicidade operacional, seguranca de acesso, rapidez de uso e baixa manutencao tecnica.

O MVP deve resolver quatro dores principais:

- acesso desorganizado a informacoes de voluntarios
- falta de clareza sobre distribuicao por areas
- dificuldade para identificar sobrecarga
- dependencia excessiva de planilhas e memoria operacional

O produto deve ser implementado com a combinacao mais pratica para este contexto:

- Vercel para deploy, previews e execucao da aplicacao
- Supabase para banco de dados, autenticacao e storage
- integracao Vercel + Supabase configurada desde o inicio

Essa decisao reduz configuracao manual, evita auth customizada e concentra o backend em um unico provedor com banco relacional, OAuth, RLS e storage integrados.

---

## 2. Contexto e Problema

Hoje, a gestao de voluntarios tende a acontecer de forma fragmentada, por meio de planilhas, mensagens soltas, memoria da lideranca e registros descentralizados. Esse modelo gera problemas recorrentes:

- informacoes desatualizadas ou dificeis de localizar
- pouca visibilidade sobre quem serve em quais areas
- baixa percepcao de sobrecarga
- dificuldade para consolidar bases legadas
- risco de erro em reunioes, escalas e reorganizacoes
- dependencia operacional de poucas pessoas

Na pratica, isso reduz previsibilidade, aumenta o tempo gasto em tarefas administrativas e dificulta a leitura gerencial da estrutura ministerial.

---

## 3. Oportunidade

Existe oportunidade clara para um painel interno que combine:

- login simples e seguro
- controle de acesso pelo proprio painel
- cadastro rapido de voluntarios
- leitura visual da distribuicao por area
- filtros operacionais
- importacao em massa com validacao
- identidade visual alinhada a igreja

Se a experiencia for fluida e confiavel, o sistema se torna a fonte principal de consulta e administracao da base de voluntarios.

---

## 4. Objetivos do Produto

### 4.1 Objetivos principais

- centralizar a base de voluntarios em um unico sistema confiavel
- permitir login simples com Google sem senha propria do produto
- controlar autorizacao sem depender de alteracao manual em codigo
- diferenciar consulta e administracao com baixo atrito
- oferecer leitura rapida da estrutura ministerial
- destacar sinais de sobrecarga
- permitir importacao com preview e confirmacao

### 4.2 Objetivos operacionais

- encontrar um voluntario em segundos
- liberar um novo usuario pelo painel
- alterar o papel de um usuario pelo painel
- cadastrar um novo voluntario sem fluxo burocratico
- importar uma base existente com feedback claro
- identificar rapidamente gargalos de distribuicao

### 4.3 Objetivos de negocio

- reduzir tempo administrativo
- aumentar confiabilidade dos dados
- reduzir dependencia de planilhas paralelas
- melhorar a capacidade de leitura da lideranca
- preparar base para futuras automacoes

---

## 5. Principios do Produto

- simplicidade antes de sofisticacao
- seguranca por padrao
- baixo custo cognitivo para a lideranca
- tudo que for operacional deve ser administravel pelo painel
- evitar configuracoes tecnicas recorrentes
- evitar duplicar responsabilidade entre servicos sem necessidade

---

## 6. Decisoes de Arquitetura

### 6.1 Decisao principal

O Revive deve usar:

- Next.js App Router na Vercel
- Supabase Auth para login social com Google
- Supabase Postgres como banco principal
- Supabase Storage para fotos e branding
- integracao Supabase via Vercel Marketplace sempre que possivel

### 6.2 Racional tecnico

Essa arquitetura foi escolhida porque entrega:

- deploy e previews simples na Vercel
- provisionamento mais pratico de backend pelo Marketplace
- sincronizacao automatica de variaveis de ambiente no projeto Vercel
- criacao automatica de redirects de preview no fluxo de integracao
- banco, auth e storage no mesmo ecossistema
- autorizacao forte com RLS

### 6.3 Decisoes explicitamente aprovadas para o MVP

#### A. Auth via Supabase, nao Auth.js

Para este projeto, o caminho mais simples e usar o Supabase Auth diretamente, com Google OAuth e fluxo SSR oficial para Next.js.

Motivo:

- elimina uma camada extra de auth
- simplifica sessao, callback e integracao com RLS
- usa o ecossistema oficial Supabase para App Router

#### B. SSR com `@supabase/ssr`

O aplicativo deve seguir o fluxo atual de server-side auth com `@supabase/ssr`, incluindo cliente de navegador, cliente de servidor e `proxy.ts` para refresh de sessao.

#### C. Sem Edge Functions no MVP

Toda logica de aplicacao deve ficar no proprio Next.js usando server actions e route handlers.

Motivo:

- menos pecas para manter
- menos duplicidade de backend
- melhor alinhamento com deploy e preview da Vercel

#### D. Sem Prisma no MVP

O banco deve ser modelado com migrations SQL do Supabase e acesso via clientes Supabase.

Motivo:

- reduz uma camada de abstracao
- evita manter schema duplicado
- aproveita melhor RLS, auth e storage do Supabase

Esta e uma decisao de implementacao por inferencia arquitetural, nao uma exigencia documental da plataforma.

#### E. Sem `service_role` no runtime normal da app

O runtime da aplicacao deve operar com sessao autenticada do usuario e RLS.

O `service_role` so deve ser aceito em cenarios restritos:

- bootstrap inicial
- scripts administrativos manuais
- manutencao controlada fora do cliente

#### F. Autorizacao em tabela propria

A autorizacao do produto nao deve viver apenas no token nem apenas em `auth.users`.

Ela deve ser controlada por uma tabela de dominio interno, `app_users`, que define:

- quem pode acessar
- qual papel possui
- se o acesso esta ativo

#### G. Storage separado por sensibilidade

Buckets recomendados:

- `branding-assets`: publico
- `volunteer-photos`: privado

Racional:

- logo e capa nao sao sensiveis e podem ser servidos de forma direta
- fotos de voluntarios sao dados internos e devem permanecer protegidas

---

## 7. Premissas do Produto

- o sistema sera usado apenas internamente pela Igreja Revive
- o MVP nao sera multi-igrejas nem multi-tenant
- a interface sera em portugues
- o ambiente principal de deploy sera a Vercel
- o backend principal sera o Supabase
- o login principal sera Google
- o controle de acesso e papeis sera gerenciado no painel
- a melhor experiencia principal sera em desktop
- o sistema deve continuar utilizavel em mobile

---

## 8. Perfis de Usuario e Permissoes

### 8.1 `viewer`

Usuario autorizado para consulta.

Pode:

- entrar com Google
- acessar dashboard
- acessar tabela e detalhes permitidos
- aplicar filtros

Nao pode:

- editar voluntarios
- importar dados
- gerenciar usuarios
- alterar branding
- alterar areas

### 8.2 `admin`

Usuario com controle operacional.

Pode:

- tudo que o `viewer` pode fazer
- cadastrar, editar, inativar e reativar voluntarios
- importar planilhas
- gerenciar areas
- gerenciar branding
- gerenciar usuarios autorizados e papeis

### 8.3 Bootstrap do primeiro admin

Mesmo com tudo gerenciavel pelo painel, um primeiro `admin` precisa existir antes.

Havera uma unica etapa manual inicial:

- inserir o email do primeiro admin na tabela `app_users` com papel `admin`

Depois disso, toda a gestao de acesso deve acontecer pelo painel.

---

## 9. Escopo do MVP

### 9.1 Modulos obrigatorios

1. Autenticacao e controle de acesso
2. Gestao de usuarios autorizados
3. Gestao de voluntarios
4. Gestao de areas de servico
5. Dashboard operacional
6. Tabela analitica e filtros
7. Importacao em massa
8. Configuracoes visuais

### 9.2 Funcionalidades obrigatorias

- login com Google
- callback de auth server-side
- bloqueio de usuarios nao autorizados
- tela de acesso bloqueado
- tela de usuarios com papeis `viewer` e `admin`
- cadastro manual de voluntario
- edicao, inativacao e reativacao
- associacao com multiplas areas
- papel do voluntario em cada area
- upload de foto
- tabela com filtros operacionais
- dashboard com indicadores principais
- importacao CSV e XLSX
- preview antes da confirmacao
- branding com logo, capa e cor principal

### 9.3 Fora de escopo no MVP

- signup publico
- senha propria do produto
- escala por culto ou evento
- convocacoes por WhatsApp
- notificacoes push
- multi-campus
- multi-tenant
- motor complexo de permissoes por acao
- analytics historico avancado
- Edge Functions dedicadas

---

## 10. Jornadas Principais

### 10.1 Login autorizado

1. O usuario clica em entrar com Google.
2. O Supabase Auth inicia o fluxo OAuth.
3. O callback do Next.js troca o codigo por sessao.
4. O sistema consulta `app_users`.
5. Se o email estiver ativo, libera a area interna.
6. Se o email nao estiver ativo, redireciona para a tela de acesso bloqueado.

### 10.2 Liberacao de um novo usuario

1. Um `admin` acessa a area de usuarios.
2. Cadastra email e papel.
3. O usuario passa a poder entrar com a propria conta Google.
4. No primeiro login, o sistema vincula o `auth_user_id` ao registro autorizado.

### 10.3 Cadastro manual de voluntario

1. Um `admin` acessa "Novo voluntario".
2. Faz upload da foto, se desejar.
3. Preenche dados pessoais e operacionais.
4. Seleciona areas de servico.
5. Define papel por area.
6. Salva o registro.
7. O sistema atualiza listagem e indicadores.

### 10.4 Consulta operacional

1. `viewer` ou `admin` acessa o dashboard.
2. Visualiza cards, listas e distribuicoes.
3. Usa filtros na tabela de voluntarios.
4. Identifica novos voluntarios, aniversariantes e sobrecarga.

### 10.5 Importacao em massa

1. Um `admin` envia um CSV ou XLSX.
2. O sistema interpreta colunas e gera preview.
3. O sistema sinaliza campos faltantes, datas invalidas e duplicidades potenciais.
4. O `admin` confirma a importacao.
5. O sistema persiste os registros validos e devolve resumo final.

### 10.6 Branding

1. Um `admin` acessa configuracoes.
2. Atualiza logo, capa e cor principal.
3. O sistema persiste os dados.
4. A interface passa a refletir a identidade escolhida.

---

## 11. Requisitos Funcionais

### 11.1 Autenticacao e sessao

- RF-01: O sistema deve permitir login com Google via Supabase Auth.
- RF-02: O sistema deve usar callback server-side para concluir o fluxo OAuth.
- RF-03: O sistema deve manter sessao autenticada com a estrategia oficial SSR do Supabase para Next.js.
- RF-04: O sistema deve permitir logout seguro.
- RF-05: O sistema deve invalidar acesso interno quando nao houver usuario autorizado correspondente.

### 11.2 Autorizacao e usuarios internos

- RF-06: O sistema deve possuir uma tabela interna de autorizacao de usuarios.
- RF-07: O sistema deve permitir listar usuarios autorizados.
- RF-08: O sistema deve permitir cadastrar novo email autorizado.
- RF-09: O sistema deve permitir definir papel `viewer` ou `admin`.
- RF-10: O sistema deve permitir alterar papel.
- RF-11: O sistema deve permitir inativar acesso sem apagar historico.
- RF-12: O sistema deve vincular o usuario autenticado ao registro interno quando houver correspondencia por email.

### 11.3 Voluntarios

- RF-13: O sistema deve permitir criar voluntario manualmente.
- RF-14: O sistema deve permitir editar voluntario existente.
- RF-15: O sistema deve permitir inativar e reativar voluntario.
- RF-16: O sistema deve permitir upload de foto.
- RF-17: O sistema deve armazenar nome, genero, data de nascimento, data de entrada, endereco, WhatsApp, disponibilidade e observacoes.
- RF-18: O sistema deve associar um voluntario a multiplas areas.
- RF-19: O sistema deve permitir definir papel do voluntario em cada area.

### 11.4 Areas de servico

- RF-20: O sistema deve possuir cadastro de areas de servico.
- RF-21: O sistema deve permitir ativar e inativar areas.
- RF-22: O sistema deve exibir quantidade de voluntarios por area.
- RF-23: O sistema deve manter relacionamento muitos-para-muitos entre voluntarios e areas.

### 11.5 Dashboard e consulta

- RF-24: O sistema deve exibir total de voluntarios.
- RF-25: O sistema deve exibir total de voluntarios ativos.
- RF-26: O sistema deve exibir novos no periodo recente.
- RF-27: O sistema deve exibir distribuicao por genero.
- RF-28: O sistema deve exibir aniversariantes do mes.
- RF-29: O sistema deve exibir distribuicao por area.
- RF-30: O sistema deve destacar casos de sobrecarga.
- RF-31: O sistema deve exibir tabela de voluntarios com filtros por area, genero, tempo de igreja, status, disponibilidade e sobrecarga.

### 11.6 Importacao

- RF-32: O sistema deve aceitar arquivos CSV.
- RF-33: O sistema deve aceitar arquivos XLSX.
- RF-34: O fluxo deve ter upload, preview e confirmacao.
- RF-35: O sistema deve tentar mapear colunas automaticamente.
- RF-36: O sistema deve permitir ajuste manual do mapeamento.
- RF-37: O sistema deve validar campos obrigatorios antes da gravacao.
- RF-38: O sistema deve sinalizar duplicidades potenciais.
- RF-39: O sistema deve retornar resumo final da importacao.

### 11.7 Configuracoes

- RF-40: O sistema deve permitir upload de logo.
- RF-41: O sistema deve permitir upload de imagem de capa.
- RF-42: O sistema deve permitir definir cor principal.
- RF-43: O sistema deve aplicar branding na interface.

---

## 12. Regras de Negocio

- RN-01: Ter conta Google nao concede acesso automaticamente.
- RN-02: Apenas usuarios ativos em `app_users` podem acessar a aplicacao.
- RN-03: Apenas `admin` pode realizar escrita em dados operacionais.
- RN-04: `viewer` possui acesso somente de consulta.
- RN-05: Todo voluntario deve possuir nome.
- RN-06: WhatsApp e o identificador operacional preferencial, mas nao obrigatorio.
- RN-07: `idade` deve ser calculada automaticamente com base na data de nascimento.
- RN-08: `tempo de igreja` deve ser calculado automaticamente com base em `join_date`.
- RN-09: Voluntario com menos de 30 dias pode receber badge de "Novo".
- RN-10: O indicador de sobrecarga depende da quantidade de areas ativas por voluntario.
- RN-11: Ate 2 areas representa situacao normal.
- RN-12: 3 areas representa atencao.
- RN-13: 4 ou mais areas representa sobrecarga.
- RN-14: Voluntarios inativos nao entram nos indicadores padrao do dashboard.
- RN-15: Foto do voluntario e opcional.
- RN-16: O papel do voluntario por area deve existir no relacionamento, nao na pessoa.
- RN-17: Observacoes internas devem ser exibidas apenas a usuarios com permissao adequada.
- RN-18: A gestao de acesso apos o bootstrap inicial deve ocorrer exclusivamente pelo painel.

---

## 13. Modelo Conceitual de Dados

### 13.1 `auth.users`

Tabela gerenciada pelo Supabase Auth para identidade e sessao.

### 13.2 `app_users`

Tabela de autorizacao e papeis internos.

- `id` (uuid, PK)
- `auth_user_id` (uuid, unique, nullable)
- `email` (text, unique, armazenado em lowercase)
- `full_name` (text, nullable)
- `role` (enum: viewer, admin)
- `active` (boolean, default true)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `created_by` (uuid, nullable)
- `last_login_at` (timestamp, nullable)

### 13.3 `volunteers`

- `id` (uuid, PK)
- `name` (text)
- `normalized_name` (text)
- `photo_path` (text, nullable)
- `gender` (enum)
- `birth_date` (date, nullable)
- `join_date` (date, nullable)
- `address` (text, nullable)
- `whatsapp` (text, nullable)
- `normalized_whatsapp` (text, nullable)
- `availability_status` (enum)
- `notes` (text, nullable)
- `active` (boolean, default true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 13.4 `service_areas`

- `id` (uuid, PK)
- `name` (text, unique)
- `slug` (text, unique)
- `active` (boolean, default true)
- `sort_order` (integer)
- `created_at` (timestamp)

### 13.5 `volunteer_areas`

- `id` (uuid, PK)
- `volunteer_id` (uuid, FK)
- `area_id` (uuid, FK)
- `role_in_area` (enum: member, leader, coordinator)
- `created_at` (timestamp)

### 13.6 `app_settings`

- `id` (uuid, PK)
- `church_name` (text)
- `logo_path` (text, nullable)
- `cover_path` (text, nullable)
- `primary_color` (text, nullable)
- `updated_at` (timestamp)
- `updated_by` (uuid, nullable)

### 13.7 `import_jobs`

- `id` (uuid, PK)
- `file_name` (text)
- `file_type` (text)
- `status` (enum: uploaded, validated, imported, failed)
- `total_rows` (integer)
- `success_rows` (integer)
- `error_rows` (integer)
- `created_at` (timestamp)
- `created_by` (uuid, nullable)

---

## 14. Estrategia de Acesso, Auth e RLS

### 14.1 Autenticacao

- login com Google via Supabase Auth
- fluxo OAuth concluido em rota de callback do Next.js
- sessao mantida com a estrategia SSR oficial do Supabase

### 14.2 Autorizacao

- autorizacao definida pela tabela `app_users`
- `viewer` e `admin` sao os unicos papeis do MVP
- usuario autenticado sem registro ativo em `app_users` nao acessa a area interna

### 14.3 RLS

Todas as tabelas da app em schema exposto devem ter RLS habilitado.

Diretriz de politicas:

- `app_users`: leitura e gestao por `admin`, leitura minima do proprio registro quando necessario
- `volunteers`, `service_areas`, `volunteer_areas`, `app_settings`: leitura por `viewer` e `admin`, escrita por `admin`
- `import_jobs`: acesso apenas por `admin`

---

## 15. Estrategia de Storage

### 15.1 Bucket `branding-assets`

Uso:

- logo
- capa

Politica:

- bucket publico
- escrita restrita a `admin`

### 15.2 Bucket `volunteer-photos`

Uso:

- fotos de voluntarios

Politica:

- bucket privado
- upload e manutencao apenas por `admin`
- leitura mediada por sessao autorizada

---

## 16. Dashboard e Indicadores

### 16.1 Cards principais

- total de voluntarios
- voluntarios ativos
- novos no periodo
- total de usuarios autorizados ativos

### 16.2 Visualizacoes

- distribuicao por genero
- aniversariantes do mes
- voluntarios por area
- lista de atencao por sobrecarga

### 16.3 Filtros

- area de servico
- genero
- tempo de igreja
- status
- disponibilidade
- nivel de sobrecarga

---

## 17. UX/UI e Experiencia

### 17.1 Direcao visual

- limpa
- moderna
- profissional
- objetiva
- leitura rapida

### 17.2 Requisitos de experiencia

- baixo atrito para tarefas frequentes
- navegacao simples
- estados claros de loading, erro e vazio
- boa hierarquia visual
- responsividade funcional em mobile
- experiencia principal otimizada para desktop

### 17.3 Tela de acesso

- CTA unico: entrar com Google
- mensagem clara de bloqueio para nao autorizados
- sem convite, senha ou signup publico

---

## 18. Requisitos Nao Funcionais

- RNF-01: Interface em portugues.
- RNF-02: Deploy principal e previews na Vercel.
- RNF-03: Banco, auth e storage no Supabase.
- RNF-04: O sistema deve priorizar baixa configuracao manual.
- RNF-05: A integracao deve minimizar sincronizacao manual de variaveis de ambiente.
- RNF-06: O sistema deve funcionar bem com bases pequenas e medias.
- RNF-07: O sistema deve proteger dados internos com RLS e politicas de storage.
- RNF-08: O runtime normal da app nao deve depender de `service_role`.
- RNF-09: O produto deve permitir evolucao futura sem retrabalho estrutural severo.

---

## 19. Setup Inicial Obrigatorio

As seguintes configuracoes manuais sao inevitaveis no inicio do projeto:

1. Criar o projeto na Vercel.
2. Instalar a integracao da Supabase via Vercel Marketplace.
3. Conectar o recurso Supabase ao projeto Vercel.
4. Confirmar as envs sincronizadas no projeto.
5. Configurar o provedor Google no Supabase.
6. Configurar no Google Cloud:
   - JavaScript origins de desenvolvimento e producao
   - redirect URI de callback do Supabase
7. Inserir manualmente o primeiro `admin` em `app_users`.

### 19.1 Recomendacoes fortes de setup

- configurar dominio customizado antes do rollout amplo
- usar o callback do Supabase conforme documentacao do provider Google
- adicionar URLs de desenvolvimento e producao desde o inicio
- validar previews e redirects gerados pela integracao Vercel + Supabase antes do uso interno

### 19.2 Observacao importante sobre chaves

A documentacao atual do Supabase esta em transicao entre `anon key` e `publishable key`.

O app deve ser preparado para:

- preferir a publishable key quando disponivel
- aceitar fallback temporario para as variaveis `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Essa compatibilidade reduz atrito entre o fluxo atual da integracao da Vercel e a direcao atual da documentacao do Supabase.

---

## 20. Riscos e Mitigacoes

### 20.1 Riscos de produto

- excesso de campos reduzir velocidade de cadastro
- base legada vir com baixa qualidade
- papeis mal usados gerarem confusao entre consulta e administracao

### 20.2 Riscos tecnicos

- configuracao incorreta do Google OAuth bloquear acesso
- RLS mal configurada travar uso legitimo ou abrir acesso indevido
- bucket privado mal configurado quebrar exibicao de fotos
- importacao real trazer mais ambiguidade do que a base de teste

### 20.3 Mitigacoes

- validar auth e autorizacao no primeiro milestone
- validar storage cedo com fluxo real de upload e leitura
- usar migrations versionadas e nao mudancas manuais dispersas
- testar preview, localhost e producao no fluxo de OAuth
- manter importacao com preview e confirmacao obrigatorios

---

## 21. Metricas de Sucesso

### 21.1 Metricas de uso

- numero de usuarios autorizados ativos
- numero de acessos mensais
- percentual da base de voluntarios registrada

### 21.2 Metricas operacionais

- tempo medio para cadastrar um voluntario
- tempo medio para liberar um novo usuario
- percentual de linhas importadas com sucesso
- tempo medio para localizar um voluntario

### 21.3 Metricas de valor

- visibilidade da distribuicao por area
- identificacao de concentracao de servico
- reducao do uso de planilhas paralelas

---

## 22. Criterios de Aceite do MVP

- usuario autorizado entra com Google sem fluxo adicional de senha
- usuario nao autorizado e bloqueado com clareza
- `viewer` nao consegue escrever dados operacionais
- `admin` consegue gerenciar usuarios, voluntarios, areas, importacao e branding
- dashboard e tabela batem com a base real
- upload de foto funciona com bucket privado
- branding persiste e reaparece apos refresh
- importacao apresenta preview, validacao e resumo final

---

## 23. Proximos Passos

Com este PRD consolidado, o proximo documento deve:

- detalhar a ordem de implementacao
- transformar as decisoes em milestones tecnicos
- fechar a estrategia de migrations, RLS, auth SSR e storage
- definir a sequencia de validacao
- criar um checklist de bootstrap do ambiente

---

## 24. Base Oficial Consultada

Decisoes deste PRD foram validadas contra documentacao oficial:

- Vercel Marketplace Storage: https://vercel.com/docs/marketplace-storage
- Supabase for Vercel: https://vercel.com/marketplace/supabase
- Supabase Auth with Next.js: https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Supabase Login with Google: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Secure Data: https://supabase.com/docs/guides/database/secure-data
- Supabase CLI: https://supabase.com/docs/reference/cli

---

## 25. Conclusao

O Revive deve nascer como uma plataforma interna simples de operar, segura no acesso e forte na leitura da operacao de voluntarios.

A melhor decisao para este momento e concentrar a camada de backend no Supabase e manter a aplicacao inteira na Vercel com Next.js. Isso reduz atrito de configuracao, evita complexidade desnecessaria e cria uma base solida para o MVP sem sacrificar seguranca ou capacidade de evolucao.
