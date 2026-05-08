# 23 - Metricas e Indicadores do Painel de Cuidado

Data e hora: 08/05/2026 12:06
Projeto: Revive - Ministerio de Voluntariado
Tema: Indicadores saudaveis para o MVP Dados/Escalas
Responsavel: Raul

## Objetivo

Definir indicadores simples para acompanhar o Painel de Cuidado sem transformar dados em cobranca fria.

O foco das metricas deve ser clareza, cuidado, integracao e capacidade de acao da lideranca.

## Principio central

Medir para cuidar melhor, nao para comparar pessoas.

Indicadores bons ajudam a responder:

- quem precisa de proximo passo;
- onde falta gente;
- se a base esta confiavel;
- se a lideranca esta agindo;
- se o voluntariado esta ficando mais acompanhado.

Indicadores ruins podem gerar:

- ranking de voluntarios;
- exposicao;
- culpa;
- ansiedade;
- cobranca sem conversa;
- decisoes apressadas.

## Scorecard semanal recomendado

| Indicador | Pergunta que responde | Como calcular | Leitura saudavel |
|---|---|---|---|
| Voluntarios ativos | Quantas pessoas estao servindo hoje? | Total com `active = true` | Ajuda a entender tamanho da base viva |
| Sem area | Quem ainda precisa ser integrado/alocado? | Total ativo sem `area` | Quanto menor, melhor a integracao |
| Precisa contato | Quem precisa de cuidado ou decisao? | Total com `care_status = needs_contact` | Deve gerar proximo passo, nao julgamento |
| Novos 30 dias | Quem entrou recentemente? | Entradas nos ultimos 30 dias | Ajuda integracao e acolhimento |
| Proximos passos abertos | Quantas acoes precisam acontecer? | Total com `next_step` preenchido | Precisa ter responsavel e prazo |
| Retornos vencidos | Quais acompanhamentos passaram do prazo? | `next_follow_up_at` anterior a hoje | Ajuda a nao esquecer pessoas |
| Baixa cobertura por area | Onde pode faltar gente? | Areas com poucos ativos | Ajuda Captacao e redistribuicao |
| Qualidade da base | Os dados estao confiaveis? | Campos essenciais faltando ou inconsistentes | Quanto menor a inconsistencia, melhor |

## Indicadores minimos para o MVP

Se for medir apenas o essencial, comecar por estes cinco:

1. Voluntarios ativos.
2. Pessoas sem area.
3. Pessoas que precisam contato.
4. Proximos passos abertos.
5. Retornos vencidos.

Esses indicadores ja conseguem gerar uma pauta semanal objetiva.

## Indicadores que devem ser evitados no inicio

Evitar no MVP:

- ranking de voluntarios por presenca;
- ranking de lideres por quantidade de problemas;
- comparacao publica entre areas;
- exposicao de quem faltou;
- taxa individual de compromisso;
- pontuacao de desempenho espiritual ou ministerial;
- qualquer indicador que pareca julgamento sem conversa.

Esses indicadores podem ate parecer eficientes, mas criam risco cultural e pastoral alto.

## Diferenca entre indicador e decisao

Um indicador nao decide sozinho.

Exemplo:

`care_status = needs_contact` nao significa que a pessoa esta errada.

Significa apenas:

> alguem precisa conversar, entender e acompanhar.

O dado aponta uma porta. A lideranca ainda precisa entrar com discernimento, escuta e cuidado.

## Leitura dos principais sinais

### Sem area aumentando

Pode indicar:

- integracao lenta;
- captacao sem encaminhamento;
- falta de clareza sobre oportunidades;
- ausencia de responsavel por alocacao.

Acao recomendada:

- definir responsavel por contato;
- mapear areas que podem receber;
- criar proximo passo para cada pessoa.

### Precisa contato aumentando

Pode indicar:

- pessoas sem acompanhamento;
- sobrecarga;
- pausas nao formalizadas;
- mudancas de disponibilidade;
- necessidade de cuidado pastoral ou relacional.

Acao recomendada:

- revisar lista semanalmente;
- atribuir responsavel;
- registrar proximo passo neutro;
- evitar conclusoes sem conversa.

### Retornos vencidos aumentando

Pode indicar:

- rotina semanal falhando;
- muitos proximos passos sem dono;
- excesso de pendencias;
- falta de cadencia.

Acao recomendada:

- reduzir quantidade de pendencias;
- definir prazos realistas;
- priorizar os casos mais importantes;
- revisar governanca.

### Baixa cobertura por area

Pode indicar:

- necessidade de captacao;
- distribuicao desigual;
- area com baixa visibilidade;
- area com muitos voluntarios em pausa.

Acao recomendada:

- conectar Dados/Escalas com Captacao;
- comunicar necessidades especificas;
- pensar em realocacao;
- validar com lider da area.

## Scorecard de reuniao

Modelo para copiar semanalmente:

```text
Scorecard semanal - Dados/Escalas

Voluntarios ativos:
Sem area:
Precisam contato:
Novos nos ultimos 30 dias:
Proximos passos abertos:
Retornos vencidos:
Areas com baixa cobertura:

Prioridades da semana:
1.
2.
3.

Decisoes tomadas:
1.
2.
3.

Responsaveis:
1.
2.
3.
```

## Metas recomendadas para o primeiro mes

Evitar metas agressivas.

Metas saudaveis para os primeiros 30 dias:

| Meta | Por que importa |
|---|---|
| 100% das pessoas piloto com status de cuidado | Base minima organizada |
| 100% de `needs_contact` com proximo passo | Nenhum alerta sem acao |
| 80% de proximos passos com responsavel | Clareza de acompanhamento |
| Revisao semanal feita por 4 semanas | Criar cadencia |
| Reduzir pessoas sem area no piloto | Melhorar integracao |

## Como apresentar os numeros

Preferir linguagem de cuidado:

- `pessoas para acompanhar`;
- `proximos passos`;
- `areas que precisam reforco`;
- `base a revisar`;
- `retornos vencidos`.

Evitar linguagem de cobranca:

- `faltosos`;
- `problematicos`;
- `descomprometidos`;
- `inadimplentes`;
- `ranking`;
- `baixa performance`.

## Indicador de maturidade do pilar Dados/Escalas

Nivel 1 - Base visivel:

- sabemos quem esta ativo;
- sabemos quem esta sem area;
- sabemos quem precisa contato.

Nivel 2 - Rotina semanal:

- existe revisao recorrente;
- proximos passos tem responsavel;
- retorno vencido e acompanhado.

Nivel 3 - Decisao orientada por dados:

- captacao olha baixa cobertura;
- integracao olha novos e sem area;
- lideranca usa resumo semanal.

Nivel 4 - Escala mais madura:

- disponibilidade e historico entram no processo;
- risco de sobrecarga e percebido;
- escala passa a ser sugerida com base mais confiavel.

## Definicao de sucesso do painel

O painel esta funcionando se:

`[ ]` A lideranca sabe quem precisa de contato.

`[ ]` Pessoas sem area ficam visiveis.

`[ ]` Proximos passos tem dono.

`[ ]` O resumo semanal ajuda a reuniao.

`[ ]` Os dados sao revisados com frequencia.

`[ ]` Ninguem usa indicadores para expor ou constranger voluntarios.

## Recomendacao final

No primeiro ciclo, medir menos e agir melhor.

Cinco indicadores bem usados valem mais do que vinte indicadores bonitos que nao geram cuidado concreto.
