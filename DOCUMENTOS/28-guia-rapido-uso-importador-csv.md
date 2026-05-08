# 28 - Guia Rapido de Uso do Importador CSV

Data e hora: 08/05/2026 12:23
Projeto: Revive - Ministerio de Voluntariado
Tema: Como usar `/dados/importar` com seguranca
Responsavel: Raul

## Objetivo

Orientar o uso pratico do importador CSV do Painel de Cuidado.

Este guia e para quem vai pegar uma planilha de voluntarios e transformar em registros no sistema sem perder o cuidado com qualidade, privacidade e duplicidade.

## Rota

`/dados/importar`

## Antes de comecar

Verificar:

`[ ]` Voce esta usando o template correto.

`[ ]` A planilha foi revisada.

`[ ]` Informacoes sensiveis foram removidas.

`[ ]` Os status usam valores tecnicos corretos.

`[ ]` As areas escritas no CSV existem no sistema.

`[ ]` A base tem no maximo 200 linhas para esta importacao.

## Template recomendado

Usar:

`DOCUMENTOS/17-template-csv-coleta-voluntarios.csv`

Dentro da tela `/dados/importar`, tambem existe o botao `Baixar template CSV`, que gera um arquivo inicial com o cabecalho correto e exemplos de preenchimento.

Campos esperados:

- `name`
- `phone`
- `email`
- `area`
- `active`
- `care_status`
- `joined_at`
- `last_contact_at`
- `next_step`
- `care_responsible`
- `next_follow_up_at`
- `notes`

## Campos obrigatorios

Obrigatorios:

- `name`
- `phone`
- `active`
- `care_status`

Observacao:

O campo `email` pode existir no CSV, mas a versao atual do cadastro de voluntarios ainda nao grava email no banco.

## Valores aceitos

### active

Usar apenas:

- `true`
- `false`

### care_status

Usar apenas:

- `new`
- `active`
- `needs_contact`
- `paused`
- `inactive`

## Regras importantes

1. Se `care_status` for `inactive`, `active` deve ser `false`.
2. Se `active` for `false`, `care_status` deve ser `inactive` ou `paused`.
3. Se `care_status` for `needs_contact`, preencher `next_step` sempre que possivel.
4. Se houver `next_step`, preencher `care_responsible` sempre que possivel.
5. Datas devem usar o formato `AAAA-MM-DD`.
6. Telefone duplicado no CSV nao sera importado.
7. Telefone que ja existe na base nao sera importado.
8. Area so sera vinculada se existir no sistema.
9. O importador nao cria areas automaticamente.
10. O importador nao sobrescreve voluntarios existentes.
11. O importador aceita CSV separado por virgula ou ponto e virgula.

## Passo a passo

1. Abrir `/dados/importar`.
2. Baixar o template CSV, se ainda nao tiver a planilha pronta.
3. Preencher ou ajustar o arquivo.
4. Selecionar o CSV.
5. Conferir o resumo de linhas lidas, validas, com erro e com aviso.
6. Corrigir erros no CSV original, se necessario.
7. Baixar linhas validas, se quiser separar a base limpa.
8. Confirmar a revisao de privacidade.
9. Clicar em `Confirmar importacao`.
10. Conferir quantos registros foram criados e ignorados.
11. Abrir `/dados`.
12. Revisar pessoas sem area, `needs_contact` e proximos passos.

## Como interpretar erros

| Erro | O que fazer |
|---|---|
| `name e obrigatorio` | Preencher nome |
| `phone e obrigatorio` | Preencher telefone |
| `active deve ser true ou false` | Trocar por `true` ou `false` |
| `care_status invalido` | Usar um dos status permitidos |
| `data deve usar AAAA-MM-DD` | Corrigir formato da data |
| `telefone ja existe na base` | Revisar se a pessoa ja esta cadastrada |
| `telefone duplicado no arquivo` | Remover ou corrigir duplicidade |
| `area nao foi encontrada` | Corrigir nome da area ou cadastrar area antes |

## Como interpretar avisos

Aviso nao bloqueia importacao, mas deve ser revisado.

Exemplos:

- `needs_contact` sem `next_step`;
- `next_step` sem responsavel;
- voluntario ativo sem area;
- observacao longa demais.

## Privacidade

Antes de importar, confirmar:

`[ ]` O arquivo nao contem diagnosticos.

`[ ]` O arquivo nao contem detalhes pastorais privados.

`[ ]` O arquivo nao contem conflitos pessoais.

`[ ]` O arquivo nao contem comentarios que exponham a pessoa.

`[ ]` Observacoes foram escritas de forma curta e neutra.

## Depois da importacao

Fazer imediatamente:

1. Abrir `/dados`.
2. Conferir os cards principais.
3. Filtrar pessoas sem area.
4. Filtrar pessoas que precisam contato.
5. Conferir proximos passos.
6. Copiar o resumo semanal.
7. Levar para a rotina de lideranca.

## Auditoria

Quando a migration `20260508_0005_volunteer_import_logs.sql` estiver aplicada, cada importacao confirmada registra:

- quem importou;
- total de linhas;
- registros criados;
- registros ignorados;
- confirmacao de privacidade;
- data e hora.

Quando a migration `20260508_0006_volunteer_import_log_created_ids.sql` tambem estiver aplicada, o log registra os IDs dos voluntarios criados.

Se a tela avisar que o registro de auditoria falhou, a importacao pode ter sido concluida, mas a migration de logs provavelmente ainda nao foi aplicada no Supabase.

A propria tela `/dados/importar` mostra as importacoes recentes quando a auditoria esta ativa.

Se a tela mostrar `Migration 0006 pendente`, a auditoria basica esta funcionando, mas os IDs individuais dos voluntarios criados ainda nao estao sendo exibidos no historico.

Quando a auditoria avancada estiver ativa, use `Ver criados` na tabela de importacoes recentes para revisar os cadastros gerados por uma importacao especifica.

Na pagina de detalhe da importacao, use o CSV copiavel para conferir ou compartilhar internamente a lista dos cadastros criados.

## Limites da versao atual

A versao atual:

- importa apenas novos voluntarios;
- nao atualiza registros existentes;
- nao faz merge;
- nao cria areas automaticamente;
- nao grava email;
- nao possui historico completo de importacoes;
- nao tem rollback em massa pela interface.

## Recomendacao final

Usar o importador primeiro com uma base pequena.

Se a primeira importacao funcionar bem, expandir aos poucos.

O objetivo nao e migrar tudo rapidamente. O objetivo e criar uma base confiavel para cuidado.
