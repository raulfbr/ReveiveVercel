# 27 - Registro de Implementacao do Importador CSV V0

Data e hora: 08/05/2026 12:11
Projeto: Revive - Ministerio de Voluntariado
Tema: Implementacao inicial da rota `/dados/importar`
Responsavel: Raul

## O que foi implementado

Foi criada a primeira versao da tela de importacao CSV para Dados/Escalas.

Rota:

`/dados/importar`

## Escopo da V0

Esta versao faz pre-validacao e pre-visualizacao.

Ela ainda nao grava dados no banco.

## Funcionalidades

1. Upload de arquivo CSV.
2. Leitura do arquivo no navegador.
3. Validacao de cabecalho.
4. Validacao de campos obrigatorios.
5. Validacao de `active`.
6. Validacao de `care_status`.
7. Validacao de datas.
8. Avisos para proximos passos incompletos.
9. Aviso para voluntario ativo sem area.
10. Deteccao de duplicidade de telefone dentro do CSV.
11. Deteccao de telefone ja existente na base.
12. Resumo de linhas lidas, validas, com erro, com aviso e duplicadas.
13. Tabela de pre-visualizacao.
14. Alerta de privacidade antes da importacao.
15. Download de um CSV limpo contendo apenas linhas sem erro.

## Arquivos alterados

- `src/components/csv-volunteer-import-preview.tsx`
- `src/app/(app)/dados/importar/page.tsx`
- `src/app/(app)/dados/page.tsx`
- `DOCUMENTOS/26-mini-prd-importacao-csv-voluntarios.md`

## Decisao de produto

Nao implementar gravacao no banco nesta primeira versao.

Motivo:

O risco de importar dados ruins, duplicados ou sensiveis e maior do que o ganho de gravar imediatamente.

A V0 ajuda o grupo a revisar a planilha com seguranca e prepara a proxima etapa.

## Incremento V0.1

Foi adicionado o botao `Baixar linhas validas`.

Ele gera um novo CSV no navegador contendo apenas linhas sem erro, mantendo o mesmo cabecalho tecnico do template.

Essa melhoria permite que o time:

- separe rapidamente o que ja esta pronto;
- corrija erros no arquivo original sem misturar dados validos e invalidos;
- leve para a proxima etapa uma base menor e mais confiavel;
- evite gravar qualquer informacao no banco antes da revisao humana.

## Proxima evolucao

Depois de validar a V0, implementar:

1. Server Action para confirmar importacao.
2. Insercao apenas de linhas validas.
3. Revalidacao de `/dados` e `/voluntarios`.
4. Resultado final com registros criados e ignorados.
5. Historico simples de importacao, se necessario.

## Criterio para avancar

Avancar para gravacao quando:

`[ ]` O CSV piloto foi validado sem erros criticos.

`[ ]` O grupo concordou com as regras de duplicidade.

`[ ]` A privacidade dos campos foi revisada.

`[ ]` A base piloto esta pequena o suficiente para testar com seguranca.

`[ ]` Existe responsavel por corrigir erros antes de importar.

## Incremento V1

Foi adicionada a confirmacao real de importacao.

Arquivos novos/alterados:

- `src/app/(app)/dados/importar/actions.ts`
- `src/app/(app)/dados/importar/page.tsx`
- `src/components/csv-volunteer-import-preview.tsx`

Comportamento:

1. A tela continua validando o CSV no navegador.
2. O usuario pode baixar linhas validas.
3. O usuario pode confirmar importacao.
4. O servidor revalida o CSV recebido.
5. O servidor consulta telefones existentes.
6. O servidor consulta areas ativas.
7. Linhas invalidas sao ignoradas.
8. Linhas validas criam voluntarios.
9. Area e vinculada apenas se existir no sistema.
10. `/dados` e `/voluntarios` sao revalidados.

Decisao de seguranca:

A importacao continua nao sobrescrevendo voluntarios existentes.

Isso protege a base real enquanto o time ainda valida o processo de coleta.

## Incremento V1.1

Foram adicionadas protecoes antes da gravacao:

1. Checkbox obrigatorio de revisao de privacidade.
2. Validacao no servidor exigindo `privacy_confirmed = yes`.
3. Limite de 200 voluntarios por importacao.

Essa camada reduz o risco de importar dados sensiveis sem revisao ou usar o MVP como migracao em massa antes de haver uma rotina madura de auditoria.

## Incremento V1.2

Foi corrigido o risco de registro parcial quando a importacao cria um voluntario, mas falha ao vincular a area.

Novo comportamento:

1. Cria o voluntario.
2. Tenta criar o vinculo com area.
3. Se o vinculo falhar, remove o voluntario recem-criado.
4. Conta a linha como ignorada.

Essa decisao evita que o painel receba voluntarios sem area por falha tecnica durante a importacao.

## Incremento V1.3

Foi adicionada uma etapa visual de pos-importacao.

Quando a importacao termina, a tela passa a mostrar:

- quantidade de registros criados;
- quantidade de registros ignorados;
- link para abrir `/dados`;
- link para revisar `/voluntarios`;
- checklist curto de conferencia apos importacao.

Essa melhoria conecta a importacao com o objetivo real do MVP: revisar o painel e gerar proximos passos de cuidado.

## Incremento V1.4

Foi adicionado um resumo copiavel de pos-importacao.

O usuario pode copiar uma mensagem com:

- quantidade de registros criados;
- quantidade de registros ignorados;
- proximos passos de conferencia;
- orientacao para abrir o Painel de Cuidado.

Essa melhoria ajuda Dados/Escalas a comunicar rapidamente o resultado da importacao para coordenacao ou lideranca.

## Incremento V1.5

Foi adicionado o botao `Baixar template CSV` na tela de importacao.

Agora o operador consegue gerar o arquivo inicial direto no app, sem precisar localizar manualmente `DOCUMENTOS/17-template-csv-coleta-voluntarios.csv`.

Isso reduz atrito e diminui o risco de planilhas nascerem com cabecalho incorreto.

## Incremento V1.6

Foi adicionada deteccao automatica de separador CSV.

O importador agora aceita:

- CSV separado por virgula;
- CSV separado por ponto e virgula.

A mesma regra foi aplicada no componente client-side e na Server Action, mantendo a validacao redundante dos dois lados.

## Incremento V1.7

Foi adicionada auditoria basica de importacao.

Arquivos:

- `supabase/migrations/20260508_0005_volunteer_import_logs.sql`
- `src/app/(app)/dados/importar/actions.ts`
- `src/app/(app)/dados/importar/page.tsx`

Cada importacao confirmada tenta registrar:

- quem importou;
- email do usuario;
- total de linhas;
- registros criados;
- registros ignorados;
- confirmacao de privacidade;
- data/hora.

O log e nao bloqueante: se a importacao funcionar mas a tabela ainda nao existir no ambiente, a tela informa a falha de auditoria e orienta aplicar a migration.

## Incremento V1.8

Foi adicionada uma tabela de importacoes recentes em `/dados/importar`.

Ela mostra os ultimos logs de importacao com:

- data e hora;
- usuario;
- total de linhas;
- registros criados;
- registros ignorados;
- confirmacao de privacidade.

Se a migration de logs ainda nao tiver sido aplicada, a tela exibe uma orientacao sem bloquear o uso do importador.

## Incremento V1.9

Foi adicionada auditoria avancada com IDs dos voluntarios criados.

Arquivos:

- `supabase/migrations/20260508_0006_volunteer_import_log_created_ids.sql`
- `src/app/(app)/dados/importar/actions.ts`
- `src/app/(app)/dados/importar/page.tsx`

Novo comportamento:

- cada importacao tenta salvar `created_volunteer_ids`;
- se a coluna ainda nao existir, tenta salvar log basico sem os IDs;
- se o log basico funcionar, a tela informa que a auditoria avancada ainda depende da migration V1.9.

Essa decisao preserva compatibilidade e prepara o caminho para revisao ou rollback assistido de importacoes.

## Incremento V1.10

Foi adicionada deteccao de auditoria avancada na tela `/dados/importar`.

A tela agora:

- tenta carregar `created_volunteer_ids`;
- mostra quantos IDs foram registrados quando a migration V1.9 esta aplicada;
- faz fallback para o log basico quando a coluna ainda nao existe;
- orienta aplicar `20260508_0006_volunteer_import_log_created_ids.sql`.

Isso evita quebra de interface em ambientes parcialmente migrados.

## Incremento V1.11

Foi criada a pagina de detalhe de importacao:

- `src/app/(app)/dados/importar/[id]/page.tsx`

Tambem foi adicionado link `Ver criados` na tabela de importacoes recentes.

A pagina mostra:

- resumo da importacao;
- voluntarios criados;
- status de cuidado;
- WhatsApp;
- proximo passo;
- link para abrir cada cadastro;
- botao para copiar resumo.

Essa tela ajuda na revisao pos-importacao e prepara terreno para recursos futuros de rollback assistido.

## Incremento V1.12

Foi adicionado um CSV copiavel na pagina de detalhe da importacao.

O bloco lista os cadastros criados com:

- id;
- nome;
- WhatsApp;
- ativo;
- status de cuidado;
- proximo passo.

A decisao foi manter essa etapa como conferencia segura, sem implementar rollback automatico ainda.
