# 04 - PRD Completo: Programa de Voluntariado Revive

Data e hora: 08/05/2026 12:36
Produto: Programa de Voluntariado Revive
Area inicial responsavel: Dados/Escalas
Responsavel pela proposta: Raul
Versao: 2.0
Status: PRD consolidado para orientar programacao

## 1. Contexto verificado

Este PRD foi consolidado a partir de duas fontes principais:

1. PDF inicial: `02-23_Reestruturacao_Estrategica_do_Ministerio_de_Voluntariado_da_Revive-Resumo.pdf`.
2. Mensagem do grupo: `03-mensagem-grupo-dados-escalas-voluntariado-revive.md`.

Fatos verificados no PDF:

- A Revive cresceu rapidamente, saindo de uma media aproximada de 300 para 400 participantes, com picos de ate 1.000 pessoas em alguns meses.
- O Ministerio de Voluntariado esta sendo reorganizado para sustentar crescimento com mais estrutura.
- O novo modelo proposto possui cinco pilares: Captacao, Integracao, Treinamento, Cuidado e Dados/Escalas.
- O programa de voluntariado deve funcionar como suporte aos lideres dos ministerios, nao como substituto da responsabilidade deles.
- A filosofia central e servir por amor a Cristo, nao por culpa, medo ou cobranca.
- Dados/Escalas deve apoiar escalas, metricas de participacao e organizacao, possivelmente avaliando ferramentas externas como Bollocks.

Fatos verificados na mensagem do grupo:

- Lucas pediu que cada area pensasse no que pode evoluir ou criar, em curto e longo prazo.
- A proposta para Dados/Escalas e nao ser area de cobranca, mas de clareza, cuidado e suporte aos lideres.
- A primeira entrega sugerida e um Mapa Vivo dos Voluntarios.
- O sistema deve responder perguntas como: quem esta servindo, quem sumiu, quem esta sobrecarregado, onde falta gente e qual proximo passo precisa acontecer.

## 2. Problema

A Revive esta crescendo e precisa cuidar melhor dos voluntarios sem depender apenas de memoria, conversas soltas, planilhas dispersas ou improviso.

Hoje, a lideranca pode ter dificuldade para responder com rapidez:

- Quem esta servindo atualmente?
- Em qual area cada pessoa serve?
- Quem esta novo e ainda nao foi integrado?
- Quem esta sem area?
- Quem precisa de contato?
- Quem pode estar sobrecarregado?
- Onde falta gente?
- Quem precisa de treinamento?
- Qual lider precisa de suporte?
- Qual proximo passo precisa acontecer nesta semana?

Sem um sistema, a igreja corre risco de:

- perder pessoas no caminho;
- sobrecarregar voluntarios fieis;
- captar pessoas sem integrar bem;
- iniciar escalas sobre uma base desatualizada;
- confundir dados com cobranca;
- deixar lideres sem visao clara da propria equipe.

## 3. Tese do produto

Dados no Revive existem para que nenhuma pessoa se perca no caminho, nenhum lider caminhe no escuro e nenhum ministerio dependa apenas de improviso.

O sistema deve ser uma ferramenta de cuidado, clareza e suporte aos lideres.

O sistema nao deve ser uma ferramenta de cobranca fria, ranking espiritual, exposicao publica ou substituto do cuidado relacional.

## 4. Objetivo do produto

Criar um programa digital para apoiar o Ministerio de Voluntariado da Revive, comecando pelo pilar Dados/Escalas, mas preparado para integrar Captacao, Integracao, Treinamento e Cuidado.

O produto deve permitir que a lideranca veja a saude da base de voluntarios, acompanhe proximos passos, organize dados e evolua gradualmente para escalas mais maduras.

## 5. Usuarios principais

### 5.1 Coordenacao do voluntariado

Precisa enxergar a saude geral do voluntariado, gargalos, areas com falta de pessoas e proximos passos.

### 5.2 Responsavel por Dados/Escalas

Precisa manter a base organizada, importar dados, revisar qualidade, gerar resumo semanal e apoiar decisao de escala futura.

### 5.3 Lideres de area

Precisam saber quem serve em sua area, quem esta ativo, quem precisa de cuidado, quem entrou recentemente e onde falta gente.

### 5.4 Responsavel por Integracao

Precisa acompanhar novos voluntarios, pessoas sem area e caminho ate primeira escala.

### 5.5 Responsavel por Cuidado

Precisa identificar pessoas que precisam de contato, pausa, retorno ou conversa.

### 5.6 Responsavel por Captacao

Precisa saber quais areas precisam de mais voluntarios e quais perfis devem ser buscados.

### 5.7 Admin do sistema

Precisa cadastrar usuarios, controlar acesso, importar dados e corrigir registros.

## 6. Principios de produto

1. Comecar pequeno e util.
2. Priorizar cuidado antes de automacao.
3. Medir para servir, nao para punir.
4. Evitar dados sensiveis desnecessarios.
5. Dar suporte aos lideres, nao tomar o lugar deles.
6. Manter linguagem humana e pastoral.
7. Criar rotina semanal simples.
8. Evoluir para escala somente depois de base confiavel.

## 7. Escopo macro do programa

O programa completo deve evoluir em cinco frentes:

1. Mapa Vivo dos Voluntarios.
2. Painel de Cuidado e qualidade da base.
3. Jornada do voluntario.
4. Escalas e historico.
5. Inteligencia ministerial.

## 8. MVP recomendado

O MVP deve ser o Mapa Vivo dos Voluntarios com Painel de Cuidado.

Motivo:

Antes de criar escala completa, a Revive precisa saber quem sao as pessoas, onde estao, qual status de cuidado possuem e qual proximo passo precisam.

O MVP deve resolver a dor anterior a escala: clareza da base.

## 9. Funcionalidades do MVP

### 9.1 Autenticacao e permissoes

Requisitos:

- Login obrigatorio para area real.
- Admin pode criar, editar e importar voluntarios.
- Viewer pode visualizar dados autorizados.
- Rotas publicas de demo usam apenas dados ficticios.

Criterios de aceite:

- Usuario nao autenticado nao acessa `/dados`, `/voluntarios` ou `/dados/importar`.
- Usuario sem permissao de admin nao importa CSV.
- Demo publica nao carrega dados reais.

### 9.2 Cadastro de voluntarios

Campos essenciais:

- nome;
- WhatsApp;
- genero, opcional;
- data de nascimento, opcional;
- data de entrada;
- endereco, opcional;
- disponibilidade;
- status ativo/inativo;
- areas vinculadas;
- papel na area;
- observacoes neutras.

Campos de cuidado:

- status de cuidado;
- ultimo contato;
- proximo passo;
- responsavel pelo cuidado;
- data de proximo retorno.

Status de cuidado:

- `new`: novo;
- `active`: ativo;
- `needs_contact`: precisa contato;
- `paused`: em pausa;
- `inactive`: inativo.

Criterios de aceite:

- Admin cria voluntario.
- Admin edita voluntario.
- Admin vincula voluntario a uma ou mais areas.
- Admin registra proximo passo e responsavel.
- Inativo nao deve aparecer como ativo no painel.

### 9.3 Areas de servico

Cada area deve possuir:

- nome;
- slug;
- status ativo;
- ordem de exibicao.

Uso inicial:

- vincular voluntarios;
- medir cobertura;
- apoiar Captacao;
- apoiar Integracao;
- preparar escala futura.

### 9.4 Painel de Cuidado

Rota principal:

- `/dados`

O painel deve exibir:

- voluntarios ativos;
- pessoas sem area;
- pessoas em atencao/sobrecarga;
- pessoas que precisam contato;
- retornos vencidos;
- areas com baixa cobertura;
- prioridades da semana;
- distribuicao por area;
- resumo semanal copiavel.

Criterios de aceite:

- Lider consegue abrir o painel e entender prioridades em menos de 2 minutos.
- Painel gera resumo copiavel para reuniao.
- Painel nao usa linguagem de ranking ou cobranca.

### 9.5 Qualidade da base

Rota:

- `/dados/qualidade`

A tela deve mostrar pendencias como:

- voluntario ativo sem area;
- ativo sem WhatsApp;
- precisa contato sem proximo passo;
- proximo passo sem responsavel;
- responsavel sem data de retorno;
- retorno vencido;
- status inconsistente.

Criterios de aceite:

- Responsavel por Dados/Escalas consegue identificar pendencias antes da reuniao.
- Cada pendencia possui link para abrir o cadastro.
- A tela separa problemas criticos de avisos.

### 9.6 Importacao CSV

Rota:

- `/dados/importar`

Objetivo:

Permitir entrada controlada de voluntarios via planilha.

Requisitos:

- Baixar template CSV.
- Aceitar separador `,` ou `;`.
- Validar no navegador.
- Revalidar no servidor.
- Exigir confirmacao de privacidade.
- Limitar a 200 registros por importacao.
- Nao sobrescrever telefone existente.
- Nao criar areas automaticamente.
- Criar novos voluntarios validos.
- Vincular area se existir.
- Registrar auditoria.

Campos aceitos:

- `name`;
- `phone`;
- `email`;
- `area`;
- `active`;
- `care_status`;
- `joined_at`;
- `last_contact_at`;
- `next_step`;
- `care_responsible`;
- `next_follow_up_at`;
- `notes`.

Observacao:

O campo `email` pode existir no CSV, mas nao deve ser gravado enquanto o modelo de voluntario nao possuir email.

Criterios de aceite:

- CSV invalido nao grava dados.
- Linha com telefone existente e ignorada.
- Linha com area inexistente e ignorada.
- Importacao mostra criados e ignorados.
- Importacao gera log.
- Historico recente fica visivel.

### 9.7 Auditoria de importacao

O sistema deve registrar:

- usuario que importou;
- email;
- origem;
- total de linhas;
- registros criados;
- registros ignorados;
- confirmacao de privacidade;
- IDs dos voluntarios criados;
- data e hora.

Telas:

- historico em `/dados/importar`;
- detalhe em `/dados/importar/[id]`.

Criterios de aceite:

- Admin visualiza importacoes recentes.
- Admin abre detalhe de uma importacao.
- Admin ve voluntarios criados por aquela importacao.
- Admin copia CSV de conferencia.

### 9.8 Demo publica

Rotas:

- `/demo/dados/kit`;
- `/demo/dados/apresentacao`;
- `/demo/dados`.

Objetivo:

Permitir demonstracao sem expor dados reais.

Criterios de aceite:

- Demo usa dados ficticios.
- Demo possui `noindex`.
- Demo apresenta tese, painel e decisoes.
- Demo aponta para area autenticada quando configurada.

## 10. Regras de negocio

### 10.1 Status ativo e cuidado

- Se `care_status = inactive`, entao `active = false`.
- Se `active = false`, status recomendado e `inactive` ou `paused`.
- `needs_contact` deve ter `next_step` sempre que possivel.
- `next_step` deve ter responsavel sempre que possivel.

### 10.2 Sobrecarga

Leitura inicial:

- 0 areas: sem area;
- 1 a 2 areas: normal;
- 3 areas: atencao;
- 4 ou mais areas: possivel sobrecarga.

Essa regra e sinal, nao julgamento.

### 10.3 Baixa cobertura

A primeira regra pode ser simples:

- area com poucos voluntarios ativos aparece como baixa cobertura.

A regra futura deve considerar:

- tamanho da celebracao;
- numero minimo por culto;
- quantidade de voluntarios disponiveis;
- historico de presenca;
- sazonalidade.

### 10.4 Retorno vencido

Um retorno esta vencido quando `next_follow_up_at` e anterior ao dia atual.

### 10.5 Privacidade

O sistema nao deve armazenar detalhes pastorais sensiveis em campos livres.

Observacoes devem ser curtas, neutras e acionaveis.

Exemplos bons:

- fazer primeiro contato;
- confirmar disponibilidade;
- validar pausa;
- acompanhar retorno;
- conversar com lideranca.

Exemplos ruins:

- sumiu;
- problemático;
- sem compromisso;
- detalhes de conflito;
- diagnosticos;
- informacoes pastorais privadas.

## 11. Dados e entidades

### 11.1 app_users

Finalidade:

Controlar usuarios autorizados.

Campos principais:

- id;
- auth_user_id;
- email;
- full_name;
- role;
- active;
- timestamps.

### 11.2 service_areas

Finalidade:

Representar areas/ministérios de servico.

Campos principais:

- id;
- name;
- slug;
- active;
- sort_order.

### 11.3 volunteers

Finalidade:

Representar voluntarios.

Campos principais:

- id;
- name;
- normalized_name;
- whatsapp;
- normalized_whatsapp;
- birth_date;
- join_date;
- availability_status;
- care_status;
- last_contact_at;
- next_step;
- care_responsible;
- next_follow_up_at;
- notes;
- active;
- timestamps.

### 11.4 volunteer_areas

Finalidade:

Vincular voluntarios a areas.

Campos principais:

- volunteer_id;
- area_id;
- role_in_area.

### 11.5 volunteer_import_logs

Finalidade:

Auditar importacoes CSV.

Campos principais:

- id;
- created_by_app_user_id;
- created_by_email;
- source;
- total_rows;
- imported_count;
- skipped_count;
- privacy_confirmed;
- created_volunteer_ids;
- created_at.

## 12. Fluxos principais

### 12.1 Fluxo: revisar saude semanal

1. Admin/lider acessa `/dados`.
2. Ve cards principais.
3. Abre prioridades da semana.
4. Copia resumo semanal.
5. Define responsaveis por proximos passos.
6. Atualiza cadastros conforme conversas acontecem.

### 12.2 Fluxo: corrigir qualidade da base

1. Admin acessa `/dados/qualidade`.
2. Ve pendencias criticas e avisos.
3. Abre cadastro de cada voluntario.
4. Corrige area, WhatsApp, status, proximo passo, responsavel ou data.
5. Volta ao painel para conferir impacto.

### 12.3 Fluxo: importar voluntarios

1. Admin acessa `/dados/importar`.
2. Baixa template CSV.
3. Preenche planilha.
4. Seleciona CSV.
5. Sistema valida.
6. Admin revisa erros e avisos.
7. Admin confirma privacidade.
8. Admin confirma importacao.
9. Sistema grava linhas validas.
10. Sistema registra auditoria.
11. Admin revisa criados em `/dados/importar/[id]`.
12. Admin abre `/dados`.

### 12.4 Fluxo: demonstrar proposta

1. Abrir `/demo/dados/kit`.
2. Mostrar mensagem, tese e decisoes.
3. Abrir `/demo/dados/apresentacao`.
4. Abrir `/demo/dados`.
5. Se ambiente real estiver pronto, abrir `/dados`.

## 13. Roadmap de programacao

### Fase 1 - Base e painel

Status: em andamento/implementado parcialmente.

Entregas:

- autenticacao;
- cadastro de voluntarios;
- areas;
- Painel de Cuidado;
- campos de cuidado;
- resumo semanal;
- demo publica.

### Fase 2 - Qualidade e importacao

Status: em andamento/implementado parcialmente.

Entregas:

- qualidade da base;
- importador CSV;
- auditoria de importacao;
- detalhe de importacao;
- conferencia CSV.

### Fase 3 - Jornada do voluntario

Entregas futuras:

- interessado;
- primeiro contato;
- entrevista;
- treinamento;
- primeira escala;
- ativo;
- pausa;
- retorno;
- inativo.

### Fase 4 - Treinamento

Entregas futuras:

- catalogo de treinamentos;
- treinamento obrigatorio inicial;
- status de conclusao;
- voluntarios pendentes de treinamento;
- lider responsavel pela liberacao.

### Fase 5 - Escalas

Entregas futuras:

- eventos/cultos;
- funcoes necessarias por area;
- disponibilidade;
- escala manual assistida;
- confirmacao de presenca;
- ausencia;
- substituicao;
- historico de participacao.

### Fase 6 - Inteligencia ministerial

Entregas futuras:

- retencao;
- gargalos por area;
- tempo entre interesse e primeira escala;
- necessidade de captacao;
- sobrecarga mensal;
- painel para coordenacao.

## 14. Fora de escopo imediato

Nao implementar agora:

- ranking de voluntarios;
- pontuacao espiritual;
- cobranca automatica;
- WhatsApp automatico;
- escala totalmente automatica;
- rollback automatico de importacao;
- IA decidindo cuidado;
- exposicao publica de presenca ou ausencia.

## 15. Criterios de sucesso do MVP

O MVP e bem-sucedido se:

- lideranca consegue ver quem precisa de contato;
- pessoas sem area ficam visiveis;
- novos voluntarios recebem proximo passo;
- areas com baixa cobertura aparecem;
- resumo semanal ajuda a reuniao;
- base fica mais confiavel;
- importacao reduz retrabalho sem comprometer privacidade;
- Dados/Escalas passa a apoiar Captacao, Integracao, Cuidado e lideres.

## 16. Riscos

| Risco | Mitigacao |
|---|---|
| Dados virarem cobranca | Linguagem de cuidado e guardrails culturais |
| Dados sensiveis em notes | Confirmacao de privacidade e orientacao clara |
| Importacao baguncar base | Validacao client/server, limite de 200 e auditoria |
| Escala ser feita cedo demais | Roadmap exige base confiavel primeiro |
| Lideres nao atualizarem dados | Rotina semanal simples e responsaveis claros |
| Sistema virar burocracia | Poucos campos, foco em acao e resumo copiavel |

## 17. Requisitos nao funcionais

- Interface simples e responsiva.
- Rotas reais sempre autenticadas.
- Demo publica sem dados reais.
- RLS no Supabase.
- Validacao redundante em acoes sensiveis.
- Auditoria para importacao.
- Linguagem clara e pastoral.
- Sem dependencia de automacao externa no MVP.

## 18. Decisoes de produto ja tomadas

- Comecar por Painel de Cuidado, nao escala completa.
- Tratar Dados/Escalas como suporte aos lideres.
- Usar status padronizados de cuidado.
- Fazer importacao CSV conservadora.
- Nao sobrescrever voluntarios existentes na importacao.
- Nao implementar rollback automatico ainda.
- Usar demo publica apenas com dados ficticios.

## 19. Proximas decisoes pendentes

- Quem sera o dono operacional de Dados/Escalas?
- Quem tera acesso admin?
- Quais areas entram no piloto?
- Quais campos sao obrigatorios para a primeira base real?
- Quando comecar modulo de jornada?
- Quando comecar modulo de treinamento?
- Quando iniciar escala assistida?

## 20. Recomendacao final

A melhor versao inicial do programa nao e um sistema completo de escalas.

A melhor versao inicial e um sistema que ajuda a Revive a enxergar, cuidar e organizar pessoas.

A escala vira uma consequencia natural quando a base estiver confiavel, a rotina semanal estiver funcionando e os lideres estiverem usando os dados para tomar decisoes melhores.
