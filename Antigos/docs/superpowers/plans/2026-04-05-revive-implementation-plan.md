# Plano de Implementacao - Revive

## Metadados

- Produto: Revive
- Tipo de documento: Plano detalhado de implementacao
- Base de origem: `docs/superpowers/specs/2026-04-05-revive-prd.md`
- Data: 2026-04-05
- Versao: 1.0
- Status: Pronto para execucao

---

## 1. Objetivo do Plano

Este documento transforma o PRD aprovado em um plano de execucao detalhado. O objetivo e sair de uma visao de produto para uma sequencia clara de implementacao, cobrindo:

- ordem de construcao
- dependencias tecnicas
- milestones
- backlog inicial executavel
- criterios de validacao
- riscos e mitigacoes
- estrategia de testes

O plano foi escrito para um cenario de produto novo, com baixo legado tecnico e foco em entrega de um MVP completo, conforme definido no PRD.

---

## 2. Premissas de Execucao

### 2.1 Premissas de produto

- o sistema sera usado apenas pela igreja Revive
- existira apenas um perfil funcional no MVP: `Admin`
- todas as funcionalidades centrais do PRD entram no MVP
- o idioma da interface sera portugues

### 2.2 Premissas tecnicas

Para tornar o planejamento acionavel, este plano assume a seguinte base tecnica:

- frontend web em React com TypeScript
- framework recomendavel: Next.js com App Router
- Supabase como backend completo
- armazenamento de fotos e assets de branding no Supabase Storage
- design system leve, com tokens de tema e componentes reutilizaveis

Se outro framework for escolhido, a ordem de entrega ainda vale, mas alguns detalhes de implementacao mudam.

### 2.3 Premissas operacionais

- estimativas abaixo consideram 1 pessoa full-stack
- com 2 ou mais pessoas, alguns blocos podem ser paralelizados
- como o repositorio ainda nao esta inicializado em Git, o plano esta sendo salvo apenas em arquivo local

---

## 3. Estrategia de Entrega

### 3.1 Principio central

A implementacao deve seguir a logica:

1. fundacao e seguranca
2. modelo de dados
3. shell da aplicacao
4. CRUD principal
5. leitura operacional
6. importacao em massa
7. personalizacao e refinamento
8. endurecimento para entrega

### 3.2 Motivo dessa ordem

- autenticacao e RLS precisam existir antes de qualquer tela interna
- o modelo de dados precisa estar estavel antes de dashboard e importacao
- o CRUD de voluntarios valida o dominio central antes dos modulos analiticos
- a importacao em massa reaproveita regras do cadastro e da tabela
- refinamentos visuais devem acontecer depois da espinha dorsal funcional

### 3.3 Regra de execucao

Nao avancar para o proximo milestone sem:

- criterio de saida atendido
- validacao manual do fluxo principal do milestone
- ajuste de erros criticos encontrados

---

## 4. Arquitetura Alvo

## 4.1 Camadas

- camada de interface: paginas, layout, componentes, tabelas, formularios e feedback visual
- camada de aplicacao: validacoes, mapeamento de dados, filtros, regras de apresentacao e fluxos
- camada de backend Supabase: auth, banco, policies, storage e eventuais RPCs

## 4.2 Estrutura funcional esperada

- autenticacao e protecao de rotas
- dashboard
- modulo de voluntarios
- modulo de importacao
- modulo de configuracoes
- modulo de admins

## 4.3 Buckets de storage recomendados

- `volunteer-photos`
- `branding-assets`

## 4.4 Tabelas principais

- `admin_profiles`
- `volunteers`
- `service_areas`
- `volunteer_areas`
- `app_settings`
- `import_jobs`

## 4.5 Funcoes ou recursos recomendados no backend

- helper para verificar se usuario autenticado e admin ativo
- normalizacao de WhatsApp
- suporte a agregacoes para dashboard
- endpoint server-side ou acao segura para criacao de admins
- endpoint server-side ou acao segura para importacao

---

## 5. Rotas e Superficies do Produto

## 5.1 Rotas recomendadas

- `/login`
- `/dashboard`
- `/voluntarios`
- `/voluntarios/novo`
- `/voluntarios/[id]`
- `/importar`
- `/configuracoes`
- `/admins`

## 5.2 Componentes de alto valor

- layout autenticado
- cards de resumo
- tabela filtravel
- formulario de voluntario
- uploader de imagem
- seletor multiplo de areas
- modal ou pagina de criacao de admin
- wizard de importacao
- painel de configuracoes visuais

---

## 6. Sequenciamento Macro

## 6.1 Visao geral dos milestones

- M0: Fundacao tecnica
- M1: Supabase, autenticacao e seguranca
- M2: Modelo de dados e seeds
- M3: Shell da aplicacao e design base
- M4: CRUD de voluntarios
- M5: Tabela, filtros e indicadores derivados
- M6: Dashboard operacional
- M7: Importacao em massa
- M8: Configuracoes e personalizacao
- M9: QA, endurecimento e entrega

## 6.2 Estimativa macro

Estimativa para 1 dev full-stack:

- faixa enxuta: 14 a 17 dias uteis
- faixa conservadora: 18 a 24 dias uteis

Maior fator de variacao:

- complexidade da importacao
- polimento visual
- definicao do fluxo seguro de criacao de admin

---

## 7. Milestones Detalhados

## 7.1 M0 - Fundacao tecnica

### Objetivo

Criar a base do projeto, preparar ambiente, estrutura de pastas, configuracoes essenciais e convencoes.

### Entregas

- projeto frontend inicializado
- TypeScript configurado
- biblioteca de UI e tokens base definidos
- lint e formatter configurados
- variaveis de ambiente documentadas
- cliente Supabase configurado

### Tarefas

- definir stack final
- criar estrutura inicial da aplicacao
- configurar acesso ao Supabase
- preparar layout minimo para paginas publicas e privadas
- definir padrao de componentes e naming
- criar arquivo `.env.example`

### Dependencias

- nenhuma

### Criterio de saida

- projeto sobe localmente
- conexao com Supabase funciona
- layout basico existe

### Estimativa

- 0.5 a 1.5 dias

---

## 7.2 M1 - Supabase, autenticacao e seguranca

### Objetivo

Fechar a base de acesso do sistema antes de construir modulos internos.

### Entregas

- login funcional com email e senha
- sign-up publico desativado
- rotas protegidas
- estrutura de perfil admin
- estrategia segura para criar admins

### Tarefas

- configurar auth no Supabase
- definir politica de usuarios permitidos
- criar `admin_profiles`
- proteger paginas autenticadas
- implementar logout
- desenhar fluxo de criacao de novo admin sem expor service role no cliente

### Decisao tecnica importante

A criacao de novo admin nao deve ser feita diretamente do cliente com permissao ampla. O ideal e usar:

- rota server-side protegida
- ou acao backend protegida
- ou Edge Function protegida

### Dependencias

- M0 concluido

### Criterio de saida

- usuario nao autenticado nao acessa rotas internas
- usuario autenticado admin acessa dashboard placeholder
- criacao de admin tem desenho tecnico validado

### Estimativa

- 1 a 2 dias

---

## 7.3 M2 - Modelo de dados e seeds

### Objetivo

Implementar o dominio base do produto diretamente no banco.

### Entregas

- enums definidos
- tabelas criadas
- chaves estrangeiras aplicadas
- indices principais criados
- seeds de areas inseridos
- RLS basico em tabelas centrais

### Tarefas

- criar enums de genero, disponibilidade e papel por area
- criar tabelas do PRD
- adicionar timestamps e indices
- criar restricoes de unicidade onde fizer sentido
- popular `service_areas`
- revisar politica de leitura e escrita por admins

### Recomendacoes tecnicas

- indexar `volunteer_areas.volunteer_id`
- indexar `volunteer_areas.area_id`
- indexar `volunteers.active`
- indexar `volunteers.join_date`
- considerar coluna normalizada ou funcao para WhatsApp

### Dependencias

- M1 concluido

### Criterio de saida

- banco representa corretamente o dominio
- dados seed aparecem
- usuarios admin autenticados conseguem operar nas tabelas autorizadas

### Estimativa

- 1 a 1.5 dias

---

## 7.4 M3 - Shell da aplicacao e design base

### Objetivo

Criar a espinha dorsal visual do produto antes das telas de negocio.

### Entregas

- layout autenticado
- navegacao principal
- sistema de espacamento, tipografia e cores base
- componentes-base reutilizaveis
- estados padrao de loading, empty e erro

### Tarefas

- criar layout principal da area autenticada
- montar menu lateral ou navegacao equivalente
- definir tokens de tema
- preparar componentes de card, button, input, select, tag e table shell
- aplicar base responsiva

### Dependencias

- M0 concluido

### Criterio de saida

- as rotas principais existem em forma de casca navegavel
- a interface ja reflete a direcao visual do PRD

### Estimativa

- 1 a 1.5 dias

---

## 7.5 M4 - CRUD de voluntarios

### Objetivo

Construir o nucleo do produto: cadastro, edicao, status, foto e vinculo com areas.

### Entregas

- formulario de cadastro completo
- upload de foto funcional
- tela de edicao
- inativacao e reativacao
- persistencia de areas e papel por area

### Tarefas

- construir formulario dividido por secoes claras
- implementar uploader com preview
- conectar salvamento ao banco
- implementar edicao por id
- implementar status ativo ou inativo
- permitir adicionar e remover areas
- permitir definir papel em cada area

### Dependencias

- M2 concluido
- M3 concluido

### Criterio de saida

- admin consegue criar voluntario do inicio ao fim
- admin consegue editar e inativar
- foto e areas aparecem corretamente apos salvar

### Estimativa

- 2 a 3 dias

---

## 7.6 M5 - Tabela, filtros e indicadores derivados

### Objetivo

Dar capacidade de leitura operacional da base antes do dashboard completo.

### Entregas

- listagem principal de voluntarios
- idade calculada
- tempo de igreja calculado
- quantidade de areas por voluntario
- destaques de sobrecarga
- badge de novo voluntario
- filtros operacionais

### Tarefas

- decidir se calculos acontecem no frontend, em view SQL ou consulta composta
- montar tabela principal
- adicionar filtros por area, genero, tempo de igreja e status
- aplicar badges e destaques visuais
- validar comportamento mobile

### Recomendacao tecnica

Se possivel, centralizar calculos repetidos em uma view ou camada de mapeamento, para evitar logica duplicada entre tabela e dashboard.

### Dependencias

- M4 concluido

### Criterio de saida

- admin encontra e interpreta dados principais sem entrar no detalhe do registro
- sobrecarga aparece corretamente

### Estimativa

- 1.5 a 2.5 dias

---

## 7.7 M6 - Dashboard operacional

### Objetivo

Transformar a base consolidada em leitura gerencial rapida.

### Entregas

- cards de resumo
- distribuicao por genero
- aniversariantes do mes
- voluntarios por area
- area de insights com sobrecarga

### Tarefas

- definir consultas ou agregacoes necessarias
- montar cards superiores
- construir grafico de genero
- construir lista ou cards de aniversariantes
- construir ranking ou grafico por area
- incluir visoes de atencao para sobrecarga

### Dependencias

- M5 concluido

### Criterio de saida

- dashboard resume a operacao real
- numeros batem com a base
- carregamento e leitura sao fluidos

### Estimativa

- 1.5 a 2.5 dias

---

## 7.8 M7 - Importacao em massa

### Objetivo

Permitir carga de dados em lote com seguranca, preview e confiabilidade.

### Entregas

- upload de CSV e XLSX
- mapeamento de colunas
- preview antes de confirmar
- validacao de campos
- sinalizacao de duplicidade
- resumo final da importacao

### Tarefas

- definir biblioteca de parsing de CSV e XLSX
- criar fluxo em 3 passos
- criar heuristica de auto-mapeamento
- implementar validacao por linha
- implementar interpretacao de areas separadas por virgula
- decidir estrategia de confirmacao: lote unico, lotes menores ou fila simples
- registrar `import_jobs`

### Decisoes tecnicas importantes

- validacao pesada deve acontecer fora da UI pura
- importacao deve ter feedback claro por etapa
- o processo nao pode depender apenas de sucesso silencioso

### Dependencias

- M2 concluido
- M4 concluido
- M5 concluido

### Criterio de saida

- admin consegue importar arquivo real com preview e confirmacao
- linhas invalidas sao claramente explicadas
- duplicidades sao visiveis antes da escrita final

### Estimativa

- 3 a 4.5 dias

---

## 7.9 M8 - Configuracoes e personalizacao

### Objetivo

Entregar identidade visual administravel sem mexer em codigo.

### Entregas

- tela de configuracoes
- upload de logo
- upload de capa
- alteracao de cor primaria
- alteracao de fonte
- aplicacao dinamica das configuracoes

### Tarefas

- criar tabela `app_settings`
- criar fluxo de upload dos assets
- ligar configuracoes ao tema da interface
- garantir fallbacks visuais

### Dependencias

- M3 concluido

### Criterio de saida

- alteracoes visuais persistem
- interface reflete a identidade da igreja

### Estimativa

- 1 a 1.5 dias

---

## 7.10 M9 - QA, endurecimento e entrega

### Objetivo

Fechar o MVP para uso real com confiabilidade minima aceitavel.

### Entregas

- revisao de erros e estados vazios
- revisao responsiva
- revisao de seguranca basica
- validacao fim a fim dos fluxos principais
- checklist de entrega

### Tarefas

- testar login, logout e bloqueio de rotas
- testar cadastro, edicao e inativacao
- testar upload de foto
- testar dashboard com base vazia e base populada
- testar importacao com erro e com sucesso
- revisar mensagens de erro
- revisar performance percebida

### Dependencias

- M1 ate M8 concluidos

### Criterio de saida

- fluxos principais estao estaveis
- sistema pode ser apresentado e utilizado de forma controlada

### Estimativa

- 2 a 3 dias

---

## 8. Plano Tecnico por Modulo

## 8.1 Autenticacao e admins

### Implementar

- tela de login
- guard de rota
- logout
- perfil admin
- criacao de novo admin

### Cuidados

- nao usar service role no cliente
- validar admin ativo antes de conceder acesso interno
- evitar depender apenas da existencia de sessao; exigir correspondencia em `admin_profiles`

### Validacao

- usuario autenticado sem perfil admin nao deve operar a area interna
- usuario admin deve acessar tudo

---

## 8.2 Voluntarios

### Implementar

- CRUD
- foto
- status
- disponibilidade
- observacoes
- areas
- papel por area

### Cuidados

- separar dados do voluntario de dados do vinculo com area
- validar formatos de data
- normalizar WhatsApp

### Validacao

- registro criado aparece corretamente na tabela
- edicao reflete nas agregacoes do dashboard

---

## 8.3 Tabela e filtros

### Implementar

- listagem principal
- filtros combinaveis
- calculos derivados
- badges e cores de risco

### Cuidados

- evitar logica duplicada entre tabela e dashboard
- cuidar da legibilidade em telas menores

### Validacao

- filtros combinados retornam dados coerentes
- destaques de risco seguem a regra do PRD

---

## 8.4 Dashboard

### Implementar

- cards
- grafico de genero
- aniversariantes
- voluntarios por area
- bloco de sobrecarga

### Cuidados

- garantir consistencia entre consultas
- decidir criterio de ativos em todas as agregacoes

### Validacao

- numeracao do dashboard bate com a tabela

---

## 8.5 Importacao em massa

### Implementar

- upload
- mapping
- preview
- validacao
- confirmacao
- resumo

### Cuidados

- risco alto de ambiguidade em planilhas reais
- duplicidade deve ser sugestao clara, nao erro invisivel
- importacao precisa ser reprodutivel e auditavel no minimo basico

### Validacao

- importar arquivo de teste pequeno
- importar arquivo com erros
- importar arquivo com areas separadas por virgula

---

## 8.6 Configuracoes

### Implementar

- branding assets
- cor primaria
- fonte
- persistencia

### Cuidados

- manter fallback seguro quando configuracoes nao existirem
- nao quebrar layout com fontes ruins ou asset ausente

### Validacao

- refresh nao perde configuracao

---

## 9. Banco de Dados e Supabase - Plano Especifico

## 9.1 Ordem recomendada de implementacao no banco

1. enums
2. tabelas principais
3. constraints e foreign keys
4. indices
5. seeds
6. policies
7. storage

## 9.2 Enums recomendados

- `gender_enum`
- `availability_status_enum`
- `role_in_area_enum`
- `import_job_status_enum`

## 9.3 Policies recomendadas

Em todas as tabelas internas:

- select apenas para admin autenticado ativo
- insert apenas para admin autenticado ativo
- update apenas para admin autenticado ativo
- delete bloqueado ou fortemente restringido no MVP

## 9.4 Bucket policies

- leitura autenticada controlada
- upload apenas por admins
- nomes de arquivos previsiveis e seguros

## 9.5 Seeds obrigatorios

- areas de servico iniciais
- registro base de `app_settings`, se o sistema exigir

---

## 10. Estrategia de Calculos Derivados

## 10.1 Idade

Opcoes:

- calcular no frontend
- calcular em SQL view
- calcular em camada de mapeamento do servidor

### Recomendacao

Usar camada centralizada de mapeamento ou view para evitar divergencia.

## 10.2 Tempo de igreja

Mesma recomendacao da idade.

## 10.3 Quantidade de areas

Recomendado:

- obter por agregacao no backend
- ou por view com count por voluntario

## 10.4 Status de sobrecarga

Recomendado derivar de `area_count` em um unico lugar reutilizavel.

---

## 11. Estrategia de Importacao

## 11.1 Fluxo tecnico sugerido

1. upload do arquivo no cliente
2. parse inicial para preview
3. mapeamento e ajuste de colunas
4. envio da estrutura normalizada para validacao server-side
5. retorno das linhas validas, com aviso ou erro
6. confirmacao explicita do admin
7. escrita final no banco
8. registro do resultado em `import_jobs`

## 11.2 Validacoes minimas por linha

- nome preenchido
- datas validas
- genero reconhecivel
- areas reconheciveis ou trataveis
- WhatsApp normalizavel quando presente

## 11.3 Duplicidade

Heuristicas recomendadas:

- match por WhatsApp normalizado
- match por nome normalizado
- match combinado nome + data de nascimento, se existir

## 11.4 Comportamento em caso de duplicidade

- mostrar sugestao
- permitir ignorar
- permitir importar como novo
- permitir atualizar o existente apenas se esse caminho estiver muito claro

No MVP, se atualizar o existente complicar demais o fluxo, pode ser adiado para um subpasso posterior e ficar apenas:

- ignorar
- importar como novo

---

## 12. Estrategia de Testes

## 12.1 Testes manuais obrigatorios

- login valido
- login invalido
- acesso sem autenticacao
- logout
- criar admin
- criar voluntario
- editar voluntario
- inativar e reativar voluntario
- upload de foto
- aplicar filtros
- validar dashboard
- importar planilha valida
- importar planilha com erros
- trocar branding

## 12.2 Testes automatizados recomendados

- utilitarios de normalizacao
- calculos derivados
- regras de sobrecarga
- parser e validadores de importacao
- protecao de rota

## 12.3 Casos de teste de risco alto

- usuario autenticado sem admin_profile
- area removida ou inativa
- upload de imagem falhando
- planilha com colunas duplicadas
- planilha com area inexistente
- voluntario com tres e quatro areas

---

## 13. Paralelizacao Possivel

Se houver 2 pessoas:

- pessoa 1: Supabase, banco, auth e importacao
- pessoa 2: layout, CRUD, tabela e dashboard

Se houver 3 pessoas:

- pessoa 1: auth, RLS, banco e seeds
- pessoa 2: CRUD, tabela e filtros
- pessoa 3: dashboard, importacao e configuracoes

Ponto de alinhamento obrigatorio antes de paralelizar:

- contrato do modelo de dados
- contrato de rotas
- definicao de componentes base

---

## 14. Backlog Executavel

| ID | Tema | Tarefa | Depends On | Prioridade | Complexidade |
| --- | --- | --- | --- | --- | --- |
| FND-01 | Fundacao | Inicializar projeto web com TypeScript | - | Alta | M |
| FND-02 | Fundacao | Configurar lint, formatter e envs | FND-01 | Alta | P |
| FND-03 | Fundacao | Integrar cliente Supabase | FND-01 | Alta | P |
| AUTH-01 | Auth | Configurar email/senha no Supabase | FND-03 | Alta | P |
| AUTH-02 | Auth | Desativar sign-up publico | AUTH-01 | Alta | P |
| AUTH-03 | Auth | Criar tabela `admin_profiles` | AUTH-01 | Alta | P |
| AUTH-04 | Auth | Implementar login e logout | AUTH-01 | Alta | M |
| AUTH-05 | Auth | Proteger rotas autenticadas | AUTH-04 | Alta | M |
| AUTH-06 | Auth | Implementar criacao segura de admin | AUTH-03 | Alta | M |
| DB-01 | Banco | Criar enums principais | AUTH-03 | Alta | P |
| DB-02 | Banco | Criar tabela `volunteers` | DB-01 | Alta | M |
| DB-03 | Banco | Criar tabela `service_areas` | DB-01 | Alta | P |
| DB-04 | Banco | Criar tabela `volunteer_areas` | DB-02 | Alta | M |
| DB-05 | Banco | Criar tabela `app_settings` | DB-01 | Media | P |
| DB-06 | Banco | Criar tabela `import_jobs` | DB-01 | Media | P |
| DB-07 | Banco | Criar indices e constraints | DB-02 | Alta | M |
| DB-08 | Banco | Popular areas iniciais | DB-03 | Alta | P |
| DB-09 | Banco | Configurar RLS | DB-02 | Alta | M |
| UI-01 | UI | Criar shell autenticado | FND-01 | Alta | M |
| UI-02 | UI | Criar componentes base | UI-01 | Alta | M |
| VOL-01 | Voluntarios | Criar formulario de cadastro | DB-04 | Alta | M |
| VOL-02 | Voluntarios | Implementar upload de foto | VOL-01 | Alta | M |
| VOL-03 | Voluntarios | Implementar criacao de voluntario | VOL-01 | Alta | M |
| VOL-04 | Voluntarios | Implementar edicao e status | VOL-03 | Alta | M |
| VOL-05 | Voluntarios | Implementar vinculo de areas e papel | VOL-03 | Alta | M |
| LIST-01 | Listagem | Criar tabela principal | VOL-03 | Alta | M |
| LIST-02 | Listagem | Calcular idade e tempo de igreja | LIST-01 | Alta | P |
| LIST-03 | Listagem | Implementar filtros | LIST-01 | Alta | M |
| LIST-04 | Listagem | Implementar badges e risco visual | LIST-02 | Alta | P |
| DASH-01 | Dashboard | Criar cards de resumo | LIST-01 | Alta | P |
| DASH-02 | Dashboard | Criar grafico de genero | LIST-01 | Media | M |
| DASH-03 | Dashboard | Criar aniversariantes do mes | LIST-01 | Media | P |
| DASH-04 | Dashboard | Criar voluntarios por area | LIST-01 | Alta | M |
| DASH-05 | Dashboard | Criar insight de sobrecarga | LIST-04 | Alta | P |
| IMP-01 | Importacao | Definir parser CSV/XLSX | DB-04 | Alta | P |
| IMP-02 | Importacao | Construir upload e preview | IMP-01 | Alta | M |
| IMP-03 | Importacao | Implementar mapping de colunas | IMP-02 | Alta | M |
| IMP-04 | Importacao | Implementar validacoes por linha | IMP-03 | Alta | M |
| IMP-05 | Importacao | Implementar duplicidade e resumo | IMP-04 | Alta | M |
| IMP-06 | Importacao | Persistir import job | DB-06 | Media | P |
| CFG-01 | Configuracoes | Criar tabela de settings | DB-05 | Media | P |
| CFG-02 | Configuracoes | Implementar uploads de logo e capa | CFG-01 | Media | M |
| CFG-03 | Configuracoes | Implementar cor primaria e fonte | CFG-01 | Media | M |
| CFG-04 | Configuracoes | Aplicar tema dinamico | CFG-03 | Media | M |
| QA-01 | QA | Revisar responsividade | UI-01 | Alta | M |
| QA-02 | QA | Revisar erros, empty e loading states | VOL-03 | Alta | M |
| QA-03 | QA | Executar checklist fim a fim | DASH-05 | Alta | M |

---

## 15. Definition of Done

Uma entrega so deve ser considerada concluida quando:

- comportamento principal funciona
- dados persistem corretamente
- erros principais possuem feedback compreensivel
- estados vazios nao quebram a interface
- responsividade minima foi verificada
- regra de negocio central foi testada

---

## 16. Ordem de Execucao Recomendada

Se for executar em linha reta, a ordem ideal e:

1. FND-01 a FND-03
2. AUTH-01 a AUTH-06
3. DB-01 a DB-09
4. UI-01 e UI-02
5. VOL-01 a VOL-05
6. LIST-01 a LIST-04
7. DASH-01 a DASH-05
8. IMP-01 a IMP-06
9. CFG-01 a CFG-04
10. QA-01 a QA-03

---

## 17. Checklist de Go-Live do MVP

- auth validado
- rotas protegidas
- RLS revisado
- fotos funcionando
- configuracoes visuais persistindo
- tabela responsiva usavel
- dashboard coerente
- importacao validada com arquivo real
- mensagens de erro revisadas
- base inicial de areas carregada

---

## 18. Proximos Passos Imediatos

Assim que a execucao comecar, a ordem pratica recomendada para o primeiro ciclo de trabalho e:

1. inicializar a aplicacao e configurar Supabase
2. implementar auth e `admin_profiles`
3. modelar o banco completo com seeds
4. subir shell autenticado
5. entregar o CRUD de voluntarios ponta a ponta

Esses cinco passos criam a espinha dorsal do produto e reduzem o risco do restante da implementacao.

---

## 19. Conclusao

O plano acima organiza o Revive para ser construido com prioridade correta: primeiro seguranca e dominio, depois operacao, depois analise e por fim refinamento. Isso reduz retrabalho e ajuda a manter o MVP completo sem perder controle da complexidade.

Com esse documento e o PRD aprovado, a proxima etapa natural e converter esse plano em tarefas de execucao e iniciar o primeiro milestone tecnico.
