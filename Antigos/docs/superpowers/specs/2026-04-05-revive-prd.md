# PRD - Revive

## Metadados

- Produto: Revive
- Tipo: Plataforma web interna para gestao de voluntarios
- Organizacao: Igreja Revive
- Status: Rascunho aprovado para planejamento
- Data: 2026-04-05
- Versao: 1.0

---

## 1. Resumo Executivo

Revive e uma aplicacao web interna criada para centralizar a gestao de voluntarios da igreja Revive com foco em clareza operacional, rapidez de uso e apoio a tomada de decisao. O sistema deve permitir que administradores cadastrem pessoas rapidamente, acompanhem a distribuicao dos voluntarios entre areas de servico, identifiquem sinais de sobrecarga e entendam com facilidade a evolucao da estrutura ministerial.

O produto nao deve ser tratado como um CRUD generico. Sua proposta de valor e transformar dados operacionais em visibilidade imediata para a lideranca, reduzindo friccao no cadastro, melhorando a leitura da estrutura do time e ajudando a evitar concentracao excessiva de responsabilidades nas mesmas pessoas.

O sistema sera dedicado a igreja Revive e nao precisa nascer como plataforma multi-igrejas. Ainda assim, o desenho funcional e de dados deve permitir expansoes futuras sem retrabalho estrutural severo.

---

## 2. Contexto e Problema

Hoje, a gestao de voluntarios em igrejas costuma depender de planilhas, anotacoes dispersas, memoria da lideranca e comunicacoes informais. Esse modelo gera problemas recorrentes:

- dificuldade para localizar informacoes atualizadas sobre cada voluntario
- pouca visibilidade sobre quem serve em quais areas
- baixa percepcao de sobrecarga
- dificuldade para identificar crescimento ou estagnacao do time
- inconsistencia de dados em importacoes e atualizacoes
- dependencia excessiva de poucas pessoas com conhecimento operacional

Na pratica, isso torna a administracao lenta, sujeita a erros e pouco preparada para decisoes rapidas em reunioes, escalas e reorganizacoes internas.

---

## 3. Oportunidade

Existe oportunidade clara para um painel administrativo interno, leve e bem desenhado, que combine:

- cadastro rapido de voluntarios
- leitura visual da estrutura ministerial
- alertas simples de sobrecarga
- filtros operacionais
- personalizacao visual alinhada a identidade da igreja

Se a experiencia for fluida e confiavel, o sistema pode se tornar o ponto central de consulta da lideranca para operacao diaria, acompanhamento do crescimento e preparacao de decisoes futuras.

---

## 4. Visao do Produto

Construir uma plataforma web moderna, minimalista, profissional e agradavel de usar, onde admins da igreja Revive consigam registrar, visualizar, filtrar e analisar a base de voluntarios com poucos cliques e alta confiabilidade.

O produto deve transmitir sensacao de SaaS premium interno:

- interface limpa
- leitura rapida
- navegacao simples
- feedback imediato
- baixa friccao em tarefas frequentes

---

## 5. Objetivos do Produto

### 5.1 Objetivos principais

- centralizar a base de voluntarios em um unico sistema confiavel
- permitir cadastro e edicao com friccao minima
- oferecer visao clara da distribuicao por area
- detectar voluntarios potencialmente sobrecarregados
- apoiar analises rapidas por filtros e indicadores
- refletir visualmente a identidade da igreja Revive

### 5.2 Objetivos de negocio

- reduzir tempo gasto na manutencao da base de voluntarios
- melhorar a qualidade e consistencia dos dados
- aumentar a visibilidade da lideranca sobre a estrutura do time
- reduzir risco de concentracao de servico em poucas pessoas
- preparar base organizacional para futuras automacoes

### 5.3 Objetivos operacionais do admin

- encontrar um voluntario em segundos
- cadastrar uma nova pessoa sem processo burocratico
- importar lotes de dados com validacao clara
- entender rapidamente onde faltam ou sobram pessoas
- perceber novos voluntarios e aniversariantes sem trabalho manual

---

## 6. Nao Objetivos do MVP

Os itens abaixo nao fazem parte do escopo funcional do MVP, embora possam aparecer no roadmap:

- agenda completa de escalas e convocacoes
- envio automatizado de mensagens por WhatsApp
- notificacoes push ou email transacional complexo
- portal publico de inscricao de voluntarios
- multi-igrejas, multi-campus ou multi-tenant
- analytics avancado com series historicas complexas
- permissao granular por perfil alem de Admin

---

## 7. Usuarios e Stakeholders

### 7.1 Usuario principal

`Admin`

Perfil unico de acesso no MVP. Representa secretaria, lideranca operacional, pastores ou coordenadores com permissao para consultar, cadastrar, editar e administrar dados internos do sistema.

### 7.2 Stakeholders indiretos

- lideres de ministerio que dependem de informacoes corretas
- coordenadores que precisam enxergar distribuicao de pessoas
- equipe pastoral que acompanha crescimento, integracao e saude da estrutura de servico

---

## 8. Premissas do Produto

- o sistema sera usado apenas internamente pela igreja Revive
- o acesso sera restrito a admins autenticados
- nao havera auto-cadastro publico
- Supabase sera o backend principal para autenticacao, banco de dados e armazenamento de arquivos
- a operacao precisa funcionar bem em desktop e mobile
- o MVP inclui todo o escopo central pedido no prompt original
- o MVP tambem inclui dados operacionais adicionais para disponibilidade, observacoes internas e papel do voluntario por area

---

## 9. Escopo do MVP

### 9.1 Modulos do MVP

1. Autenticacao e controle de acesso
2. Cadastro e gestao de voluntarios
3. Gestao de areas de servico
4. Importacao em massa por CSV e Excel
5. Dashboard operacional
6. Tabela analitica de voluntarios com filtros
7. Configuracoes visuais da plataforma

### 9.2 Funcionalidades obrigatorias do MVP

- login com email e senha
- bloqueio de sign-up publico
- criacao de novo admin por admin autenticado
- cadastro manual completo de voluntario
- upload de foto com clique e drag and drop
- associacao de voluntario a multiplas areas
- visualizacao de tags por area
- calculo automatico de idade
- calculo automatico de tempo de igreja
- destaque para voluntarios novos
- indicador visual de sobrecarga
- listagem filtravel por area, genero, tempo de igreja e status
- importacao em massa com preview e confirmacao
- validacao de duplicidades por nome e WhatsApp
- painel com cards, graficos e listas principais
- configuracao de logo, capa, cor primaria e fonte

### 9.3 Extensoes operacionais incluidas no MVP

- status de disponibilidade do voluntario
- observacoes internas
- papel por area de servico, como membro, lider ou coordenador
- inativacao sem exclusao definitiva

---

## 10. Fora de Escopo Imediato

Mesmo sendo produto completo no MVP, estes itens devem ficar explicitamente fora da primeira entrega:

- controle de escalas por data
- convocacoes por evento ou culto
- integracao oficial com API de WhatsApp
- historico detalhado de alteracoes com auditoria avancada
- anexos diversos por voluntario alem da foto
- relatorios exportaveis sofisticados em PDF

---

## 11. Proposta de Valor

O Revive deve entregar tres beneficios centrais:

- velocidade: admins executam tarefas frequentes sem complexidade
- visibilidade: a estrutura do time fica legivel em poucos segundos
- cuidado operacional: o sistema ajuda a identificar excesso de distribuicao por voluntario antes que isso vire problema

---

## 12. Jornadas Principais

### 12.1 Jornada 1 - Login e acesso

1. Admin acessa a aplicacao.
2. Informa email e senha.
3. Sistema autentica via Supabase Auth.
4. Admin entra no dashboard.
5. Se nao autenticado, qualquer rota interna redireciona para login.

### 12.2 Jornada 2 - Cadastro manual de voluntario

1. Admin acessa "Novo voluntario".
2. Faz upload da foto.
3. Preenche dados pessoais e operacionais.
4. Seleciona uma ou mais areas.
5. Define disponibilidade e observacoes internas, se necessario.
6. Salva registro.
7. Sistema recalcula indicadores e atualiza listagens.

### 12.3 Jornada 3 - Criacao de novo admin

1. Admin autenticado acessa funcionalidade interna de criar admin.
2. Informa email e dados basicos.
3. Sistema cria conta via Supabase Auth.
4. Novo admin passa a poder acessar a plataforma.

### 12.4 Jornada 4 - Importacao em massa

1. Admin envia arquivo CSV ou Excel.
2. Sistema interpreta colunas e sugere mapeamento.
3. Admin revisa preview.
4. Sistema sinaliza duplicidades, inconsistencias e colunas obrigatorias faltantes.
5. Admin confirma importacao.
6. Sistema importa linhas validas e retorna resumo com sucessos, avisos e falhas.

### 12.5 Jornada 5 - Analise operacional

1. Admin acessa dashboard.
2. Visualiza cards-resumo e indicadores.
3. Filtra por area, genero ou tempo de igreja.
4. Identifica voluntarios novos, aniversariantes e casos de sobrecarga.
5. Usa a tabela para localizar e agir sobre registros.

### 12.6 Jornada 6 - Personalizacao visual

1. Admin acessa configuracoes.
2. Faz upload de logo e imagem de capa.
3. Define cor primaria e fonte.
4. Sistema atualiza interface dinamicamente.

---

## 13. Requisitos Funcionais

### 13.1 Autenticacao e Acesso

- RF-01: O sistema deve permitir login com email e senha via Supabase Auth.
- RF-02: O sistema deve bloquear cadastros publicos.
- RF-03: O sistema deve restringir todas as rotas internas a admins autenticados.
- RF-04: O sistema deve oferecer funcionalidade interna para criacao de novo admin.
- RF-05: O sistema deve manter sessao autenticada conforme politica do Supabase.
- RF-06: O sistema deve permitir logout seguro.

### 13.2 Gestao de Voluntarios

- RF-07: O sistema deve permitir criar voluntario manualmente.
- RF-08: O sistema deve permitir editar voluntario existente.
- RF-09: O sistema deve permitir inativar voluntario sem excluir dados.
- RF-10: O sistema deve permitir reativar voluntario.
- RF-11: O sistema deve armazenar foto do voluntario em storage.
- RF-12: O sistema deve exibir foto em formularios, cards e tabela.
- RF-13: O sistema deve capturar nome, genero, data de nascimento, data de entrada, endereco, WhatsApp e status.
- RF-14: O sistema deve capturar disponibilidade do voluntario.
- RF-15: O sistema deve registrar observacoes internas.
- RF-16: O sistema deve associar voluntario a uma ou mais areas.
- RF-17: O sistema deve permitir definir papel do voluntario em cada area.

### 13.3 Areas de Servico

- RF-18: O sistema deve possuir tabela de areas de servico pre-populada.
- RF-19: O sistema deve permitir listar quantidade de voluntarios por area.
- RF-20: O sistema deve manter relacionamento muitos-para-muitos entre voluntarios e areas.
- RF-21: O sistema deve permitir expansao futura do catalogo de areas sem retrabalho estrutural.

### 13.4 Importacao em Massa

- RF-22: O sistema deve aceitar upload de CSV.
- RF-23: O sistema deve aceitar upload de Excel.
- RF-24: O fluxo de importacao deve ter tres etapas: upload, preview e confirmacao.
- RF-25: O sistema deve tentar mapear colunas automaticamente quando possivel.
- RF-26: O sistema deve permitir ajuste manual do mapeamento antes da confirmacao.
- RF-27: O sistema deve interpretar multiplas areas separadas por virgula.
- RF-28: O sistema deve validar campos obrigatorios.
- RF-29: O sistema deve identificar possiveis duplicidades por nome e ou WhatsApp.
- RF-30: O sistema deve apresentar feedback claro por linha com erro.
- RF-31: O sistema deve retornar resumo final da importacao.

### 13.5 Dashboard

- RF-32: O sistema deve exibir total de voluntarios.
- RF-33: O sistema deve exibir total de voluntarios ativos.
- RF-34: O sistema deve exibir novos no mes com base em `join_date`.
- RF-35: O sistema deve exibir distribuicao por genero.
- RF-36: O sistema deve exibir aniversariantes do mes com foto, nome e data.
- RF-37: O sistema deve exibir quantidade de voluntarios por area.
- RF-38: O sistema deve exibir indicador de sobrecarga por quantidade de areas.
- RF-39: O sistema deve permitir leitura rapida com hierarquia visual forte.

### 13.6 Tabela Analitica

- RF-40: O sistema deve exibir tabela moderna com foto, nome, genero, idade, tempo de igreja, areas, quantidade de areas e status.
- RF-41: O sistema deve destacar voluntarios com tres areas.
- RF-42: O sistema deve destacar voluntarios com quatro ou mais areas.
- RF-43: O sistema deve exibir badge de "Novo" para voluntarios com menos de 30 dias de entrada.
- RF-44: O sistema deve permitir filtros por area.
- RF-45: O sistema deve permitir filtros por genero.
- RF-46: O sistema deve permitir filtros por tempo de igreja.
- RF-47: O sistema deve permitir filtro por status ativo ou inativo.

### 13.7 Configuracoes

- RF-48: O sistema deve permitir upload do logo da igreja.
- RF-49: O sistema deve permitir upload de imagem de capa.
- RF-50: O sistema deve permitir definir cor primaria.
- RF-51: O sistema deve permitir definir tipografia.
- RF-52: O sistema deve aplicar as alteracoes visualmente em toda a aplicacao.

---

## 14. Regras de Negocio

- RN-01: Apenas admins autenticados podem acessar o sistema.
- RN-02: Nao existe auto-cadastro publico.
- RN-03: Todo voluntario deve possuir nome e pelo menos um identificador operacional confiavel, preferencialmente WhatsApp.
- RN-04: `idade` deve ser calculada automaticamente a partir de `birth_date`, considerando a data atual.
- RN-05: `tempo de igreja` deve ser calculado automaticamente a partir de `join_date`.
- RN-06: Um voluntario sera considerado `novo` quando `join_date` estiver dentro dos ultimos 30 dias corridos.
- RN-07: O indicador de sobrecarga deve considerar a quantidade de areas ativas vinculadas ao voluntario.
- RN-08: Ate 2 areas = normal.
- RN-09: Exatamente 3 areas = alerta leve.
- RN-10: 4 ou mais areas = alerta de sobrecarga.
- RN-11: Voluntarios inativos nao devem compor os indicadores operacionais padrao do dashboard, salvo quando o admin aplicar filtro especifico.
- RN-12: Duplicidade deve ser validada por nome normalizado, WhatsApp normalizado ou combinacao de ambos.
- RN-13: A importacao em massa nao deve concluir de forma silenciosa se houver erros relevantes; o admin precisa visualizar os avisos antes da confirmacao.
- RN-14: Foto do voluntario e opcional, mas o sistema deve apresentar avatar padrao quando ausente.
- RN-15: O papel do voluntario em uma area deve ser tratado por vinculo de area, e nao como atributo global da pessoa.
- RN-16: Observacoes internas devem ser visiveis apenas para admins.
- RN-17: O sistema deve priorizar simplicidade operacional sobre configuracoes excessivas.

---

## 15. Modelo Conceitual de Dados

O modelo abaixo parte da estrutura original pedida e adiciona apenas o necessario para suportar o uso real do produto.

### 15.1 Autenticacao

#### Supabase Auth

- usuarios autenticados do sistema

#### Tabela recomendada: `admin_profiles`

- `id` (uuid, PK, referencia ao usuario autenticado)
- `full_name` (text)
- `email` (text)
- `created_at` (timestamp)
- `created_by` (uuid, nullable)
- `active` (boolean)

### 15.2 Tabela `volunteers`

- `id` (uuid, PK)
- `name` (text)
- `photo_url` (text)
- `gender` (enum: male, female, other)
- `birth_date` (date)
- `join_date` (date)
- `address` (text)
- `whatsapp` (text)
- `availability_status` (enum: available, limited, unavailable)
- `notes` (text)
- `active` (boolean, default true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 15.3 Tabela `service_areas`

- `id` (uuid, PK)
- `name` (text, unique)
- `active` (boolean, default true)
- `sort_order` (integer)
- `created_at` (timestamp)

Areas iniciais:

- Parking
- Welcome
- Reception
- Kids
- Youth
- Connection Space
- Worship
- Football
- Sound
- Projection
- Maintenance

### 15.4 Tabela `volunteer_areas`

- `id` (uuid, PK)
- `volunteer_id` (uuid, FK)
- `area_id` (uuid, FK)
- `role_in_area` (enum: member, leader, coordinator)
- `created_at` (timestamp)

### 15.5 Tabela recomendada: `app_settings`

- `id` (uuid, PK)
- `church_name` (text)
- `logo_url` (text)
- `cover_url` (text)
- `primary_color` (text)
- `font_family` (text)
- `updated_at` (timestamp)
- `updated_by` (uuid)

### 15.6 Tabela recomendada: `import_jobs`

- `id` (uuid, PK)
- `file_name` (text)
- `file_type` (text)
- `status` (enum: uploaded, validated, imported, failed)
- `total_rows` (integer)
- `success_rows` (integer)
- `error_rows` (integer)
- `created_at` (timestamp)
- `created_by` (uuid)

---

## 16. Dashboard e Indicadores

### 16.1 Cards de resumo

#### Card 1 - Total de voluntarios

- definicao: total de registros de voluntarios
- variacao futura: permitir visualizacao de total geral e total ativo

#### Card 2 - Voluntarios ativos

- definicao: registros com `active = true`

#### Card 3 - Novos no mes

- definicao: voluntarios com `join_date` no mes corrente

### 16.2 Distribuicao por genero

- visual sugerido: grafico de pizza ou barras
- objetivo: leitura rapida da composicao da base

### 16.3 Aniversariantes do mes

- objetivo: dar visibilidade humana e relacional a base
- conteudo: foto, nome, data de aniversario e eventual destaque amigavel

### 16.4 Voluntarios por area

- lista ou grafico ordenado automaticamente por quantidade
- considerar por padrao apenas voluntarios ativos

### 16.5 Indicador de sobrecarga

- objetivo: mostrar pessoas potencialmente concentrando muitas frentes
- aplicacao: dashboard, listagem e filtros
- faixas:
- 0 a 2 areas: normal
- 3 areas: atencao
- 4 ou mais: sobrecarga

### 16.6 Filtros operacionais

- por area de servico
- por genero
- por tempo de igreja
- por status ativo ou inativo
- por faixa de sobrecarga

---

## 17. Cadastro e Edicao de Voluntarios

### 17.1 Campos do formulario

- foto
- nome
- genero
- data de nascimento
- data de entrada na igreja
- WhatsApp
- endereco
- disponibilidade
- observacoes internas
- areas de servico
- papel em cada area
- status ativo

### 17.2 Requisitos de experiencia

- layout limpo e arejado
- hierarquia clara entre secoes
- baixo atrito de preenchimento
- componentes simples e previsiveis
- feedback imediato em validacoes e salvamento

### 17.3 Comportamentos importantes

- upload de foto com clique e drag and drop
- preview imediato da imagem
- multiselect de areas com tags visuais
- possibilidade de remover ou trocar areas facilmente
- exibicao do papel desempenhado por area

---

## 18. Importacao em Massa

### 18.1 Objetivo

Permitir que a equipe carregue bases existentes sem precisar cadastrar tudo manualmente, preservando qualidade e controle.

### 18.2 Formatos aceitos

- CSV
- XLSX

### 18.3 Fluxo

1. Upload do arquivo
2. Preview com mapeamento
3. Confirmacao de importacao

### 18.4 Regras de validacao

- nome obrigatorio
- ao menos um identificador de contato recomendado
- datas devem respeitar formato valido
- genero deve ser convertido para valores aceitos
- areas separadas por virgula devem ser quebradas corretamente
- areas desconhecidas devem gerar aviso e permitir ajuste antes da confirmacao
- linhas com duplicidade potencial devem ser sinalizadas

### 18.5 Comportamento recomendado para duplicidade

No MVP, o sistema deve privilegiar seguranca e clareza:

- sinalizar possivel duplicidade
- permitir que o admin ignore a linha, importe como novo ou substitua o registro existente quando isso fizer sentido
- registrar resumo do resultado final por linha

### 18.6 Resultado esperado

Ao final, o admin deve receber:

- total de linhas processadas
- total importado com sucesso
- total com erro
- total ignorado por duplicidade ou decisao do admin
- resumo textual dos principais problemas encontrados

---

## 19. Tabela de Voluntarios

### 19.1 Colunas

- foto
- nome
- genero
- idade
- tempo de igreja
- areas de servico
- numero de areas
- disponibilidade
- status

### 19.2 Indicadores visuais

- linha neutra para 0 a 2 areas
- destaque amarelo suave para 3 areas
- destaque vermelho suave para 4 ou mais areas
- badge discreto "Novo" para menos de 30 dias

### 19.3 Requisitos de UX

- hover suave
- boa densidade de informacao sem poluicao
- tipografia legivel
- responsividade
- bom comportamento em telas menores

---

## 20. Configuracoes e Personalizacao

### 20.1 Objetivo

Permitir que a plataforma tenha identidade visual coerente com a igreja Revive sem necessidade de alterar codigo.

### 20.2 Configuracoes do MVP

- logo da igreja
- imagem de capa
- cor primaria
- fonte principal

### 20.3 Requisitos

- aplicacao dinamica das mudancas
- persistencia das configuracoes
- preview claro quando possivel
- fallback visual seguro caso algum asset falhe

---

## 21. UX/UI e Design System

### 21.1 Direcao visual

- minimalista
- limpa
- profissional
- premium

### 21.2 Regras visuais

- uso generoso de espaco em branco
- base neutra em branco e cinzas claros
- uma cor primaria principal configuravel
- alertas em amarelo suave e vermelho suave
- icones simples
- pouca ornamentacao
- estados de hover e foco discretos, mas perceptiveis

### 21.3 Tipografia

- familia sans-serif moderna
- excelente legibilidade em tabela, cards e formularios
- contraste e hierarquia claros

### 21.4 Comportamento de interface

- feedback instantaneo em acoes
- carregamentos curtos com estados visuais claros
- transicoes suaves e discretas
- densidade equilibrada entre informacao e respiracao visual

---

## 22. Responsividade

### 22.1 Diretriz

O produto deve ser mobile-first, mas sem comprometer a experiencia de escritorio, que sera o principal ambiente administrativo.

### 22.2 Requisitos

- cards devem empilhar corretamente em telas menores
- tabela deve ter estrategia responsiva usavel
- formularios devem funcionar bem em celular
- navegacao deve ser simples e tocavel
- filtros e acoes principais devem continuar acessiveis no mobile

---

## 23. Performance

### 23.1 Objetivos

- carregamento rapido da aplicacao
- interacoes com baixa percepcao de espera
- atualizacao de interface apos acoes sem confusao para o usuario

### 23.2 Requisitos nao funcionais de performance

- dashboard deve carregar rapidamente com datasets pequenos e medios
- listagem deve suportar paginacao ou estrategia equivalente
- upload de imagens deve ser otimizado
- importacao em massa deve fornecer feedback de progresso

---

## 24. Seguranca

### 24.1 Principios

- acesso restrito a admins
- nenhum dado exposto publicamente
- autenticacao centralizada pelo Supabase
- controle de permissao por politicas de banco

### 24.2 Requisitos

- uso de RLS nas tabelas relevantes
- bucket de storage protegido
- criacao de admin disponivel apenas para admins existentes
- validacao de sessao em todas as areas internas
- logs basicos de falha de autenticacao e erro operacional quando possivel

---

## 25. Requisitos Nao Funcionais

- RNF-01: Interface em portugues.
- RNF-02: Experiencia consistente em desktop e mobile.
- RNF-03: Design limpo e profissional, sem poluicao visual.
- RNF-04: Navegacao simples, intuitiva e de baixo aprendizado.
- RNF-05: Estrutura pronta para futuras extensoes como escalas e notificacoes.
- RNF-06: Dados protegidos por autenticacao e politicas de acesso.
- RNF-07: Feedbacks de sucesso e erro devem ser claros e acionaveis.
- RNF-08: Componentes devem priorizar legibilidade e clareza.

---

## 26. Estrutura Futura e Expansibilidade

O produto deve nascer simples, mas com estrutura que permita evolucao futura para:

- modulo de escala de voluntarios
- integracao com WhatsApp
- notificacoes por aniversario ou convocacao
- analise historica de crescimento por periodo
- visao por ministerio e por lider
- relatorios exportaveis

Essa preparacao nao exige implementar esses recursos no MVP, mas requer evitar modelagem que bloqueie tais evolucoes.

---

## 27. Dependencias

- conta e projeto Supabase configurados
- buckets de storage definidos
- politicas de autenticacao e acesso configuradas
- definicao visual inicial da identidade da igreja
- base minima de areas pre-populada
- padrao de importacao de planilhas validado com dados reais

---

## 28. Riscos

### 28.1 Riscos de produto

- baixa qualidade dos dados importados da base atual
- resistencia de uso se a importacao gerar muitos conflitos sem clareza
- falta de padrao no preenchimento de WhatsApp
- excesso de campos no cadastro reduzir velocidade operacional

### 28.2 Riscos tecnicos

- politicas de acesso mal configuradas podem travar operacao ou expor dados
- storage sem regra clara pode quebrar upload de foto
- modelagem de importacao insuficiente pode dificultar manutencao futura

### 28.3 Mitigacoes

- definir campos obrigatorios e normalizacao
- usar validacoes claras e preview confiavel na importacao
- testar permissao e upload desde o inicio
- manter o formulario completo, mas com organizacao visual leve

---

## 29. Metricas de Sucesso

### 29.1 Metricas de uso

- percentual da base total registrada no sistema
- quantidade de voluntarios ativos mantidos atualizados
- numero de acessos mensais dos admins

### 29.2 Metricas operacionais

- tempo medio para cadastrar um novo voluntario
- tempo medio para importar uma base com sucesso
- percentual de linhas importadas sem erro
- tempo medio para encontrar um voluntario especifico

### 29.3 Metricas de valor

- quantidade de voluntarios marcados com sobrecarga
- distribuicao por area visivel e atualizada
- capacidade de identificar crescimento mensal da base

---

## 30. Backlog Inicial do MVP

### Epic 1 - Fundacao e acesso

- tela de login
- protecao de rotas
- logout
- criacao interna de admin
- tabela de perfis admin

### Epic 2 - Base de voluntarios

- cadastro manual
- upload de foto
- edicao
- inativacao e reativacao
- disponibilidade e observacoes

### Epic 3 - Areas e relacionamentos

- seed das areas iniciais
- vinculo muitos-para-muitos
- papel do voluntario por area
- contagem por area

### Epic 4 - Dashboard

- cards de resumo
- distribuicao por genero
- aniversariantes do mes
- voluntarios por area
- indicador de sobrecarga

### Epic 5 - Tabela e filtros

- listagem principal
- calculo de idade
- calculo de tempo de igreja
- filtros operacionais
- badges e destaques visuais

### Epic 6 - Importacao em massa

- upload CSV e XLSX
- mapeamento de colunas
- preview
- validacao de duplicidade
- confirmacao e resumo final

### Epic 7 - Configuracoes

- logo
- capa
- cor primaria
- fonte
- aplicacao dinamica

### Epic 8 - Qualidade e entrega

- estados de loading e erro
- empty states
- responsividade
- refinamento visual
- testes principais de fluxo

---

## 31. Criterios de Aceite por Modulo

### 31.1 Autenticacao

- somente usuarios autenticados acessam telas internas
- sign-up publico esta desativado
- admin logado consegue criar novo admin

### 31.2 Cadastro de voluntario

- e possivel criar, editar, inativar e reativar voluntario
- foto pode ser enviada e exibida corretamente
- areas podem ser vinculadas em multiselecao
- papel por area pode ser definido

### 31.3 Dashboard

- cards exibem dados corretos
- aniversariantes do mes aparecem corretamente
- voluntarios por area respeitam dados ativos
- sobrecarga e destacada conforme regras

### 31.4 Tabela

- idade e tempo de igreja sao calculados automaticamente
- badge "Novo" aparece corretamente
- destaques por sobrecarga funcionam
- filtros retornam resultados coerentes

### 31.5 Importacao

- arquivo pode ser enviado
- preview aparece antes da confirmacao
- colunas podem ser mapeadas
- erros e duplicidades sao apresentados com clareza
- resumo final informa o resultado da operacao

### 31.6 Configuracoes

- logo e capa podem ser enviados
- cor primaria e fonte podem ser alteradas
- alteracoes sao aplicadas na interface

---

## 32. Indicacoes para Planejamento Tecnico

Este PRD foi escrito para servir como base direta de planejamento. Na proxima etapa, o plano de execucao deve:

- quebrar o MVP em milestones
- separar entregas de infraestrutura, dados, interface e validacao
- definir estrategia de seeds, RLS e storage
- detalhar fluxos de importacao
- transformar backlog em tarefas implementaveis
- estabelecer estrategia minima de testes para login, cadastro, dashboard e importacao

---

## 33. Conclusao

Revive deve ser uma plataforma interna elegante e objetiva, pensada para uso diario real pela lideranca da igreja. O produto precisa equilibrar simplicidade e poder operacional: facil de usar no cadastro, forte em leitura gerencial e claro ao sinalizar concentracao de servico.

Se bem executado, o sistema se tornara a fonte central de verdade sobre a estrutura de voluntarios da igreja Revive e a base natural para futuros modulos de escala, comunicacao e acompanhamento ministerial.
