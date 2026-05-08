# 15 - Modelo de Planilha para Coleta de Dados de Voluntarios

Data e hora: 08/05/2026 11:54
Projeto: Revive - Ministerio de Voluntariado
Tema: Base inicial para o Painel de Cuidado
Responsavel: Raul

## Objetivo

Definir uma planilha simples para levantar os dados minimos necessarios para alimentar o MVP Dados/Escalas.

A proposta e coletar apenas o suficiente para gerar cuidado e clareza, evitando uma planilha grande demais logo no inicio.

## Principio da coleta

Coletar poucos dados, mas dados acionaveis.

Um dado acionavel e aquele que ajuda a responder:

- quem precisa de contato;
- quem esta sem area;
- quem e novo;
- quem esta ativo ou em pausa;
- qual proximo passo deve acontecer;
- quem e responsavel por acompanhar.

## Colunas recomendadas para a planilha

| Coluna | Obrigatorio | Exemplo | Observacao |
|---|---:|---|---|
| nome | Sim | Ana Souza | Nome completo ou nome conhecido pela lideranca |
| telefone | Sim | 11999999999 | Usar apenas numeros, se possivel |
| email | Nao | ana@email.com | Util se o sistema usar comunicacao futura |
| area_principal | Nao | Recepcao | Deixar vazio se ainda nao tiver area |
| status_cuidado | Sim | ativo | Usar valores padronizados abaixo |
| ativo | Sim | sim | Indica se a pessoa esta atualmente ativa |
| data_entrada | Nao | 2026-05-01 | Ajuda a identificar novos voluntarios |
| ultimo_contato | Nao | 2026-05-03 | Ajuda a saber quando alguem foi acompanhado |
| proximo_passo | Nao | Conversar sobre area de servico | Deve ser curto e pratico |
| responsavel_cuidado | Nao | Lucas | Quem vai acompanhar o proximo passo |
| data_proximo_acompanhamento | Nao | 2026-05-15 | Data para retorno ou follow-up |
| observacoes | Nao | Prefere servir aos domingos | Campo livre, usar com cuidado |

## Valores padronizados

### status_cuidado

Na conversa com lideres, usar estes termos:

- `novo`
- `ativo`
- `precisa_contato`
- `em_pausa`
- `inativo`

Para importacao ou uso tecnico no sistema, usar os valores abaixo:

| Termo na conversa | Valor tecnico |
|---|---|
| novo | `new` |
| ativo | `active` |
| precisa_contato | `needs_contact` |
| em_pausa | `paused` |
| inativo | `inactive` |

Descricao:

| Valor | Significado |
|---|---|
| novo | Pessoa nova no voluntariado ou ainda em integracao |
| ativo | Pessoa servindo normalmente |
| precisa_contato | Pessoa que precisa de conversa, cuidado ou decisao |
| em_pausa | Pessoa temporariamente afastada ou em descanso combinado |
| inativo | Pessoa que nao esta servindo atualmente |

### ativo

Usar apenas:

- `sim`
- `nao`

Regra simples:

Se `status_cuidado` for `inativo`, o campo `ativo` deve ser `nao`.

Se `ativo` for `nao`, o status normalmente deve ser `inativo` ou `em_pausa`.

## Exemplo de linhas preenchidas

| nome | telefone | email | area_principal | status_cuidado | ativo | data_entrada | ultimo_contato | proximo_passo | responsavel_cuidado | data_proximo_acompanhamento | observacoes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Ana Souza | 11999999999 | ana@email.com | Recepcao | ativo | sim | 2026-04-12 | 2026-05-01 | Confirmar disponibilidade de junho | Lucas | 2026-05-15 | Prefere domingo |
| Bruno Lima | 11988888888 |  |  | novo | sim | 2026-05-05 |  | Fazer primeiro contato | Raul | 2026-05-10 | Veio pelo GC |
| Carla Mendes | 11977777777 | carla@email.com | Kids | precisa_contato | sim | 2025-11-20 | 2026-04-01 | Entender se precisa de pausa | Mariana | 2026-05-09 |  |
| Diego Alves | 11966666666 |  | Louvor | em_pausa | nao | 2024-08-03 | 2026-04-28 | Retornar em junho | Lucas | 2026-06-02 | Pausa combinada |

## Como usar na pratica

1. Escolher uma ou duas areas para o primeiro teste.
2. Preencher apenas as colunas essenciais.
3. Evitar observacoes sensiveis ou muito pessoais.
4. Revisar os status com os lideres.
5. Importar ou cadastrar os dados no sistema.
6. Abrir `/dados` para validar se o painel ajuda a decidir proximos passos.
7. Ajustar a planilha depois do primeiro uso real.

## Cuidados com privacidade

Como a planilha pode conter telefone, status e informacoes de cuidado, ela deve ser compartilhada apenas com pessoas autorizadas.

Evitar registrar detalhes sensiveis como:

- problemas familiares;
- informacoes medicas;
- conflitos pessoais;
- confissoes;
- detalhes pastorais privados;
- qualquer informacao que nao seja necessaria para a acao do ministerio.

Quando houver algo sensivel, usar apenas uma frase neutra, por exemplo:

- `precisa conversa com lideranca`;
- `acompanhar retorno`;
- `verificar disponibilidade`;
- `pausa combinada`.

## Menor versao possivel

Se o time quiser comecar ainda menor, usar somente:

| Coluna | Obrigatorio |
|---|---:|
| nome | Sim |
| telefone | Sim |
| area_principal | Nao |
| status_cuidado | Sim |
| ativo | Sim |
| proximo_passo | Nao |
| responsavel_cuidado | Nao |

Essa versao ja permite gerar valor no Painel de Cuidado.

## Template pronto

Foi criado tambem um arquivo CSV com os campos tecnicos ja alinhados ao sistema:

`DOCUMENTOS/17-template-csv-coleta-voluntarios.csv`

Para entender o significado de cada campo e valor, usar:

`DOCUMENTOS/16-dicionario-dados-painel-cuidado-voluntarios.md`

## Definicao de pronto

A primeira planilha esta pronta quando:

`[ ]` Tem pelo menos uma area piloto.

`[ ]` Todos os voluntarios tem `nome`.

`[ ]` Todos os voluntarios tem `telefone`.

`[ ]` Todos os voluntarios tem `status_cuidado`.

`[ ]` Todos os voluntarios tem `ativo`.

`[ ]` Pessoas sem area estao claramente identificadas.

`[ ]` Pessoas que precisam de contato tem `proximo_passo`.

`[ ]` Existe um responsavel pelo acompanhamento.

## Recomendacao

Comecar com a menor versao possivel e expandir somente quando a rotina semanal estiver funcionando.

Um painel simples com dados confiaveis e melhor do que um painel completo com dados desatualizados.
