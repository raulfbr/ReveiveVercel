# 16 - Dicionario de Dados do Painel de Cuidado de Voluntarios

Data e hora: 08/05/2026 11:55
Projeto: Revive - Ministerio de Voluntariado
Tema: Padronizacao dos dados do MVP Dados/Escalas
Responsavel: Raul

## Objetivo

Padronizar os nomes, significados e valores dos principais campos usados no Painel de Cuidado.

Esse documento evita um problema comum: cada pessoa usar um termo diferente para a mesma coisa, dificultando importacao, leitura do painel e manutencao da base.

## Principio

Separar linguagem pastoral/operacional da linguagem tecnica do sistema.

Exemplo:

- Na reuniao, podemos falar `precisa contato`.
- No banco/sistema, o valor tecnico deve ser `needs_contact`.

Essa separacao permite que a interface fique humana e simples, enquanto a base permanece consistente.

## Campos principais

| Campo no CSV | Campo no sistema | Obrigatorio | Tipo | Exemplo | Observacao |
|---|---|---:|---|---|---|
| name | `name` | Sim | texto | Ana Souza | Nome completo ou nome conhecido |
| phone | `phone` | Sim | texto | 11999999999 | Preferir apenas numeros |
| email | `email` | Nao | texto | ana@email.com | Pode ficar vazio |
| area | `area` | Nao | texto | Recepcao | Area principal de servico |
| active | `active` | Sim | booleano | true | Usar `true` ou `false` |
| care_status | `care_status` | Sim | enum | active | Usar valores tecnicos padronizados |
| joined_at | `joined_at` | Nao | data | 2026-05-01 | Data de entrada ou cadastro |
| last_contact_at | `last_contact_at` | Nao | data | 2026-05-03 | Ultimo contato relevante |
| next_step | `next_step` | Nao | texto | Conversar sobre area | Proximo passo curto e acionavel |
| care_responsible | `care_responsible` | Nao | texto | Lucas | Quem acompanha |
| next_follow_up_at | `next_follow_up_at` | Nao | data | 2026-05-15 | Proxima data de acompanhamento |
| notes | `notes` | Nao | texto | Prefere domingo | Evitar dados sensiveis |

## Valores de `care_status`

| Termo para conversa | Valor tecnico | Quando usar |
|---|---|---|
| Novo | `new` | Pessoa nova ou ainda em integracao |
| Ativo | `active` | Pessoa servindo normalmente |
| Precisa contato | `needs_contact` | Pessoa que precisa de conversa, cuidado ou decisao |
| Em pausa | `paused` | Pessoa temporariamente afastada ou em descanso combinado |
| Inativo | `inactive` | Pessoa que nao esta servindo atualmente |

## Regras de consistencia

1. Se `care_status` for `inactive`, entao `active` deve ser `false`.
2. Se `active` for `false`, o `care_status` normalmente deve ser `inactive` ou `paused`.
3. Se `care_status` for `needs_contact`, o campo `next_step` deve ser preenchido sempre que possivel.
4. Se houver `next_step`, e recomendado preencher `care_responsible`.
5. Se houver `care_responsible`, e recomendado preencher `next_follow_up_at`.
6. Pessoas sem `area` devem aparecer como prioridade de integracao/alocacao.

## Datas

Usar formato ISO:

```text
AAAA-MM-DD
```

Exemplos:

- `2026-05-08`
- `2026-05-15`
- `2026-06-01`

Evitar formatos ambiguuos como:

- `08/05/26`
- `05/08/2026`
- `sexta-feira`

## Campos que devem ser evitados no MVP

Nao coletar no primeiro momento:

- detalhes medicos;
- conflitos pessoais;
- informacoes pastorais sensiveis;
- diagnosticos;
- justificativas longas;
- comentarios que exponham a pessoa;
- historico de faltas como forma de cobranca.

Se algo sensivel precisar ser acompanhado, registrar apenas um proximo passo neutro:

- `conversar com lideranca`;
- `acompanhar retorno`;
- `confirmar disponibilidade`;
- `validar pausa`;
- `fazer primeiro contato`.

## Exemplo de registro bom

| Campo | Valor |
|---|---|
| name | Bruno Lima |
| phone | 11988888888 |
| area |  |
| active | true |
| care_status | new |
| next_step | Fazer primeiro contato e entender area de interesse |
| care_responsible | Raul |
| next_follow_up_at | 2026-05-10 |

Por que e bom:

- mostra que a pessoa e nova;
- nao expoe informacao sensivel;
- deixa claro o proximo passo;
- define quem acompanha;
- tem data de retorno.

## Exemplo de registro ruim

| Campo | Valor |
|---|---|
| name | Bruno Lima |
| care_status | problema |
| notes | Nao apareceu varias vezes e talvez esteja desanimado |

Por que e ruim:

- usa status nao padronizado;
- mistura interpretacao com fato;
- pode constranger a pessoa;
- nao define proximo passo;
- nao define responsavel.

## Template CSV

Arquivo recomendado:

`DOCUMENTOS/17-template-csv-coleta-voluntarios.csv`

Esse arquivo usa nomes tecnicos de campo para facilitar importacao futura.

## Recomendacao final

Usar linguagem humana na conversa e na interface, mas manter valores tecnicos padronizados na base.

Isso permite que o Painel de Cuidado seja simples para lideres e consistente para o sistema.
