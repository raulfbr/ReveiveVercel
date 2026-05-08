# 30 - Checklist Go/No-go da Reuniao e do Piloto

Data e hora: 08/05/2026 12:34
Projeto: Revive - Ministerio de Voluntariado
Tema: Pronto para apresentar, validar e iniciar piloto
Responsavel: Raul

## Objetivo

Definir se o time esta pronto para apresentar a proposta, demonstrar o MVP e iniciar o piloto do Painel de Cuidado.

Este checklist ajuda a separar tres situacoes:

1. Pronto para discutir estrategia.
2. Pronto para demonstrar o MVP.
3. Pronto para usar dados reais em piloto.

## Regra principal

Se algo critico de dados reais, privacidade ou acesso nao estiver pronto, ainda assim a reuniao pode acontecer usando apenas a demo publica com dados ficticios.

Nao precisamos travar a conversa estrategica por falta de ambiente real.

## Go para reuniao estrategica

A reuniao pode discutir e decidir a proposta se:

`[ ]` O grupo entende que Dados/Escalas comeca por Painel de Cuidado.

`[ ]` A frase central esta clara: dados sao para cuidado, nao cobranca.

`[ ]` O kit da reuniao esta disponivel em `/demo/dados/kit`.

`[ ]` A apresentacao publica esta disponivel em `/demo/dados/apresentacao`.

`[ ]` A demo publica esta disponivel em `/demo/dados`.

`[ ]` A demo usa somente dados ficticios.

`[ ]` As decisoes esperadas da reuniao estao claras.

Resultado:

`[ ]` Go para reuniao estrategica.

`[ ]` No-go para reuniao estrategica.

## Go para demonstracao publica

A demo publica pode ser enviada ou apresentada se:

`[ ]` O grupo sabe que os dados sao ficticios.

`[ ]` A rota `/demo/dados/kit` abre.

`[ ]` A rota `/demo/dados/apresentacao` abre.

`[ ]` A rota `/demo/dados` abre.

`[ ]` O botao de copiar mensagem/resumo funciona no ambiente usado.

`[ ]` Ninguem vai interpretar a demo como base real.

Resultado:

`[ ]` Go para demo publica.

`[ ]` No-go para demo publica.

## Go para demonstracao autenticada

A demonstracao autenticada pode acontecer se:

`[ ]` Supabase esta configurado.

`[ ]` Login esta funcionando.

`[ ]` Usuario admin esta criado e ativo.

`[ ]` Rota `/dados` exige autenticacao.

`[ ]` Rota `/voluntarios` exige autenticacao.

`[ ]` Rota `/dados/importar` exige admin.

`[ ]` Migrations principais foram aplicadas.

`[ ]` Migration `20260508_0004_volunteer_care_fields.sql` foi aplicada.

`[ ]` Migration `20260508_0005_volunteer_import_logs.sql` foi aplicada, se for demonstrar auditoria.

`[ ]` Migration `20260508_0006_volunteer_import_log_created_ids.sql` foi aplicada, se for demonstrar detalhe de importacao.

Resultado:

`[ ]` Go para demonstracao autenticada.

`[ ]` No-go para demonstracao autenticada.

## Go para usar dados reais

Usar dados reais somente se:

`[ ]` Acesso ao painel foi definido.

`[ ]` Responsavel por Dados/Escalas foi definido.

`[ ]` Quem atualiza dados foi definido.

`[ ]` Privacidade foi revisada.

`[ ]` Planilha nao contem informacoes sensiveis.

`[ ]` Observacoes estao neutras e curtas.

`[ ]` Base piloto tem tamanho controlado.

`[ ]` Pessoas autorizadas entendem que os dados sao para cuidado.

Resultado:

`[ ]` Go para dados reais.

`[ ]` No-go para dados reais.

## Go para importacao CSV

Importar CSV no sistema somente se:

`[ ]` O arquivo usa o template correto.

`[ ]` O arquivo tem no maximo 200 linhas.

`[ ]` Campos obrigatorios estao preenchidos.

`[ ]` `active` usa apenas `true` ou `false`.

`[ ]` `care_status` usa apenas valores tecnicos permitidos.

`[ ]` Datas usam `AAAA-MM-DD`.

`[ ]` Areas existem no sistema.

`[ ]` Telefones duplicados foram revisados.

`[ ]` A pre-validacao em `/dados/importar` nao mostra erros criticos.

`[ ]` Privacidade foi confirmada conscientemente.

Resultado:

`[ ]` Go para importacao CSV.

`[ ]` No-go para importacao CSV.

## Go para piloto de 7 dias

Iniciar o piloto somente se:

`[ ]` Area piloto foi escolhida.

`[ ]` Dono do piloto foi definido.

`[ ]` Lider da area piloto concordou.

`[ ]` Rotina semanal foi marcada.

`[ ]` Criterios de sucesso foram definidos.

`[ ]` Proximos passos terao responsavel.

`[ ]` O grupo sabe que o piloto pode continuar, ajustar, expandir ou pausar.

Resultado:

`[ ]` Go para piloto.

`[ ]` No-go para piloto.

## Sinais de no-go critico

Nao usar dados reais se:

- nao ha responsavel pela base;
- nao ha acesso restrito;
- ha informacoes sensiveis na planilha;
- o grupo quer usar dados para cobranca;
- a base e grande demais para primeira importacao;
- ninguem vai revisar depois de importar;
- lideranca ainda nao validou finalidade e limites.

## O que fazer em caso de no-go

Se houver no-go para dados reais:

1. Fazer apenas apresentacao publica.
2. Usar dados ficticios.
3. Validar decisao estrategica.
4. Marcar uma etapa posterior para preparar Supabase, privacidade e base piloto.

Se houver no-go para importacao:

1. Corrigir a planilha.
2. Rodar pre-validacao novamente.
3. Baixar linhas validas.
4. Revisar privacidade.
5. Importar somente quando estiver seguro.

## Decisao final da reuniao

Marcar uma opcao:

`[ ]` Aprovado para piloto com dados reais.

`[ ]` Aprovado para piloto apenas com dados ficticios/teste.

`[ ]` Aprovado conceitualmente, mas ainda sem piloto.

`[ ]` Precisa revisar escopo antes de avancar.

## Resumo copiavel

```text
Decisao Go/No-go - Dados/Escalas

Reuniao estrategica:
Demo publica:
Demonstracao autenticada:
Uso de dados reais:
Importacao CSV:
Piloto de 7 dias:

Decisao final:

Proximo passo:

Responsavel:

Prazo:
```

## Recomendacao final

Se houver duvida, fazer go para estrategia e no-go para dados reais.

Validar a direcao com seguranca e preparar o ambiente real depois e melhor do que forcar uma demonstracao com dados sensiveis, acesso indefinido ou base sem revisao.
