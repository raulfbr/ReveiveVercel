# 26 - Mini PRD de Importacao CSV de Voluntarios

Data e hora: 08/05/2026 12:11
Projeto: Revive - Ministerio de Voluntariado
Tema: Proxima evolucao tecnica do MVP Dados/Escalas
Responsavel: Raul

## Objetivo

Definir uma importacao simples e segura de voluntarios por CSV para acelerar a criacao da base piloto do Painel de Cuidado.

A importacao deve ajudar a sair de planilha para sistema sem transformar o MVP em um projeto grande de migracao.

## Problema

Hoje, o time pode organizar os dados em planilha, mas ainda precisa cadastrar ou ajustar tudo manualmente no sistema.

Isso gera risco de:

- retrabalho;
- erro de digitacao;
- dados inconsistentes;
- lentidao para testar o piloto;
- duplicidade de voluntarios;
- perda de confianca no painel.

## Decisao recomendada

Criar uma importacao CSV simples, com validacao antes de gravar.

O fluxo deve ser:

1. usuario escolhe arquivo CSV;
2. sistema le as linhas;
3. sistema valida campos e valores;
4. sistema mostra uma pre-visualizacao;
5. usuario confirma;
6. sistema grava apenas linhas validas;
7. sistema informa sucessos, erros e duplicidades.

## Fora de escopo no primeiro momento

Nao incluir agora:

- importacao por Excel `.xlsx`;
- importacao automatica recorrente;
- integracao com Google Sheets;
- deduplicacao complexa por IA;
- merge avancado de registros;
- historico completo de importacoes;
- permissao granular por area;
- rollback automatico.

## Usuario-alvo

Responsavel por Dados/Escalas ou pessoa autorizada a manter a base de voluntarios.

## Rota sugerida

`/dados/importar`

Alternativa:

`/voluntarios/importar`

Recomendacao:

Usar `/dados/importar`, porque a importacao nasce como parte do fluxo do Painel de Cuidado.

## Campos aceitos

Usar como base o arquivo:

`DOCUMENTOS/17-template-csv-coleta-voluntarios.csv`

Campos:

| Campo | Obrigatorio | Observacao |
|---|---:|---|
| name | Sim | Nome do voluntario |
| phone | Sim | Telefone, preferencialmente apenas numeros |
| email | Nao | Email |
| area | Nao | Area principal |
| active | Sim | `true` ou `false` |
| care_status | Sim | `new`, `active`, `needs_contact`, `paused`, `inactive` |
| joined_at | Nao | Data em `AAAA-MM-DD` |
| last_contact_at | Nao | Data em `AAAA-MM-DD` |
| next_step | Nao | Acao curta |
| care_responsible | Nao | Responsavel pelo acompanhamento |
| next_follow_up_at | Nao | Data em `AAAA-MM-DD` |
| notes | Nao | Observacao curta e neutra |

## Validacoes obrigatorias

### Linha

Cada linha deve ter:

`[ ]` `name` preenchido.

`[ ]` `phone` preenchido.

`[ ]` `active` preenchido com `true` ou `false`.

`[ ]` `care_status` preenchido com valor permitido.

### Status

Valores permitidos:

- `new`
- `active`
- `needs_contact`
- `paused`
- `inactive`

Regras:

1. Se `care_status = inactive`, entao `active` deve ser `false`.
2. Se `active = false`, `care_status` deve ser `inactive` ou `paused`, salvo excecao manual.
3. Se `care_status = needs_contact`, recomendar `next_step`.
4. Se `next_follow_up_at` estiver preenchido, validar formato de data.

### Datas

Datas devem estar no formato:

```text
AAAA-MM-DD
```

Exemplo:

```text
2026-05-08
```

### Privacidade

Antes de importar, o sistema deve exibir alerta:

```text
Revise se o arquivo nao contem informacoes sensiveis, detalhes pastorais privados, diagnosticos, conflitos ou comentarios que possam expor pessoas. Use apenas observacoes curtas e neutras.
```

## Duplicidade

Regra simples para MVP:

1. Verificar duplicidade por telefone.
2. Se telefone ja existir, marcar como possivel duplicado.
3. Nao sobrescrever automaticamente no primeiro MVP.
4. Permitir importar apenas novos registros validos.

Futuro:

- permitir atualizar registros existentes;
- mostrar comparacao de campos;
- escolher manter, substituir ou mesclar.

## Pre-visualizacao

Antes de gravar, mostrar:

- total de linhas lidas;
- linhas validas;
- linhas com erro;
- possiveis duplicidades;
- avisos de privacidade;
- tabela com os principais campos.

## Estados da tela

### Estado 1 - Upload

Conteudo:

- explicacao curta;
- botao de selecionar CSV;
- link para template;
- aviso de privacidade.

### Estado 2 - Validacao

Conteudo:

- resumo de linhas;
- erros por linha;
- duplicidades;
- botao para voltar/corrigir;
- botao para confirmar importacao, se houver linhas validas.

### Estado 3 - Resultado

Conteudo:

- quantos registros foram importados;
- quantos foram ignorados;
- quantos tinham erro;
- link para `/dados`;
- link para `/voluntarios`.

## Mensagens de erro sugeridas

| Situacao | Mensagem |
|---|---|
| Arquivo vazio | O arquivo nao possui linhas para importar. |
| Campo obrigatorio ausente | Linha X: campo `name` e obrigatorio. |
| Status invalido | Linha X: `care_status` deve ser new, active, needs_contact, paused ou inactive. |
| Data invalida | Linha X: use data no formato AAAA-MM-DD. |
| Duplicado | Linha X: telefone ja existe na base. |
| CSV invalido | Nao foi possivel ler o arquivo. Confira o separador e o cabecalho. |

## Criterios de aceite

O importador esta pronto quando:

`[ ]` A rota exige autenticacao.

`[ ]` O usuario consegue selecionar um CSV.

`[ ]` O sistema valida campos obrigatorios.

`[ ]` O sistema valida `care_status`.

`[ ]` O sistema valida datas.

`[ ]` O sistema detecta duplicidade por telefone.

`[ ]` O sistema mostra pre-visualizacao antes de gravar.

`[ ]` O sistema nao sobrescreve voluntarios existentes automaticamente.

`[ ]` O sistema grava linhas validas.

`[ ]` O sistema mostra resultado final.

`[ ]` O usuario consegue voltar para `/dados`.

## Riscos

| Risco | Mitigacao |
|---|---|
| Importar dados sensiveis | Aviso de privacidade e checklist antes de confirmar |
| Duplicar voluntarios | Deteccao por telefone |
| Quebrar consistencia de status | Validacoes obrigatorias |
| Importacao virar projeto grande | Comecar apenas com CSV simples |
| Sobrescrever dados bons | Nao atualizar existentes no MVP |

## Caminho tecnico sugerido

1. Criar rota autenticada `/dados/importar`.
2. Criar parser CSV no client ou server action.
3. Validar linhas antes de gravar.
4. Buscar telefones existentes no Supabase.
5. Mostrar pre-visualizacao.
6. Confirmar importacao.
7. Inserir apenas registros novos e validos.
8. Redirecionar ou linkar para `/dados`.

## Decisao para implementacao

Recomendacao:

Implementar primeiro sem update/merge.

Motivo:

No MVP, importar novos registros com seguranca e melhor do que tentar resolver todos os cenarios de sincronizacao de planilha.

Depois que o piloto validar valor, podemos evoluir para atualizacao de registros existentes.

## V0 implementada

Foi criada a rota autenticada:

`/dados/importar`

Escopo da V0:

- exige usuario admin;
- permite selecionar um arquivo CSV;
- le o arquivo no navegador;
- valida cabecalhos obrigatorios;
- valida `name`, `phone`, `active` e `care_status`;
- valida datas em formato `AAAA-MM-DD`;
- detecta telefone duplicado dentro do arquivo;
- detecta telefone que ja existe na base atual;
- mostra pre-visualizacao com erros e avisos;
- permite baixar um novo CSV apenas com linhas validas;
- nao grava dados no Supabase ainda.

Essa decisao e intencional: primeiro validamos qualidade e seguranca da base; depois adicionamos a acao de confirmar importacao.

## V1 implementada

A rota `/dados/importar` agora tambem permite confirmar a importacao de linhas validas.

Escopo da V1:

- revalida o CSV no servidor antes de gravar;
- exige usuario admin;
- exige confirmacao explicita de privacidade antes de gravar;
- limita a importacao a no maximo 200 voluntarios por vez neste MVP;
- nao sobrescreve voluntarios existentes;
- ignora linhas que falharem na validacao do servidor;
- cria registros em `volunteers`;
- vincula area quando o nome ou slug informado existe em `service_areas`;
- revalida `/dados` e `/voluntarios`;
- mostra quantidade de registros criados e ignorados.

Limitacoes mantidas:

- nao atualiza registros existentes;
- nao faz merge;
- nao importa email porque o modelo atual de voluntario nao possui campo `email`;
- nao cria areas automaticamente;
- nao mantem historico de importacoes ainda.

## V1.1 implementada

Foram adicionadas duas protecoes:

1. Confirmacao explicita de privacidade antes da importacao.
2. Limite de ate 200 voluntarios por importacao.

Motivo:

O importador ja grava no banco. Portanto, antes de permitir a importacao, o usuario precisa confirmar que revisou privacidade, removeu informacoes sensiveis e entende que apenas linhas validas serao importadas.

O limite de 200 registros evita que o MVP seja usado como migracao grande antes de existir historico, rollback e revisao mais robusta.

## V1.2 implementada

Foi adicionada uma protecao de consistencia na criacao com area.

Comportamento:

1. O servidor cria o voluntario.
2. Se houver area informada, tenta criar o vinculo em `volunteer_areas`.
3. Se o vinculo com a area falhar, o voluntario recem-criado e removido.
4. A linha e contada como ignorada.

Motivo:

Evitar que a importacao deixe registros parcialmente criados quando a etapa de vinculo com area falhar.

Observacao:

Isso nao substitui uma transacao completa de banco, mas torna o MVP mais seguro enquanto ainda nao existe uma RPC transacional dedicada para importacao.

## V1.3 implementada

Foi adicionada uma orientacao de pos-importacao na tela `/dados/importar`.

Depois de importar, a tela agora orienta o usuario a:

1. abrir o Painel de Cuidado;
2. revisar os cadastros;
3. conferir pessoas sem area ou com `needs_contact`;
4. garantir que proximos passos tenham responsavel;
5. usar o resumo semanal para a pauta de lideranca.

Motivo:

A importacao nao deve terminar no ato tecnico de gravar dados. Ela precisa conduzir a pessoa para a rotina de cuidado.

## V1.4 implementada

Foi adicionado um resumo copiavel depois da importacao.

O resumo inclui:

- registros criados;
- registros ignorados;
- proximos passos recomendados;
- orientacao para abrir `/dados`, revisar prioridades e usar o resumo semanal.

Motivo:

Facilitar prestacao de contas para a lideranca e transformar a importacao em uma comunicacao simples, nao apenas em um evento tecnico.

## V1.5 implementada

Foi adicionado o botao `Baixar template CSV` na propria tela `/dados/importar`.

Motivo:

O usuario nao deve depender de abrir a pasta `DOCUMENTOS` para comecar uma importacao. A propria ferramenta agora gera um CSV inicial com cabecalho correto e exemplos de preenchimento.

## V1.6 implementada

O parser de CSV agora detecta automaticamente separador por virgula ou ponto e virgula.

Motivo:

Em alguns ambientes, especialmente planilhas configuradas em portugues, arquivos CSV podem ser exportados com `;` em vez de `,`. A pre-validacao no navegador e a revalidacao no servidor agora aceitam os dois formatos.

## V1.7 implementada

Foi adicionada a tabela de auditoria `volunteer_import_logs`.

Migration:

`supabase/migrations/20260508_0005_volunteer_import_logs.sql`

Campos registrados:

- usuario do app que importou;
- email do usuario;
- origem `csv`;
- total de linhas;
- registros criados;
- registros ignorados;
- confirmacao de privacidade;
- data e hora da importacao.

Comportamento:

Se a importacao funcionar, mas o log falhar porque a migration ainda nao foi aplicada, a tela avisa o usuario sem desfazer a importacao.

## V1.8 implementada

A tela `/dados/importar` agora mostra as ultimas importacoes registradas em `volunteer_import_logs`.

A tabela exibe:

- data;
- usuario;
- total de linhas;
- registros criados;
- registros ignorados;
- confirmacao de privacidade.

Se a tabela de logs ainda nao existir no ambiente, a tela continua funcionando e orienta aplicar a migration `20260508_0005_volunteer_import_logs.sql`.

## V1.9 implementada

Foi adicionada auditoria avancada dos IDs criados.

Migration:

`supabase/migrations/20260508_0006_volunteer_import_log_created_ids.sql`

Novo campo:

- `created_volunteer_ids`

Comportamento:

1. A importacao guarda os IDs dos voluntarios criados no log.
2. Se a migration V1.9 ainda nao estiver aplicada, o sistema tenta salvar o log no formato anterior.
3. A tela avisa quando o log basico foi salvo, mas a auditoria avancada ainda depende da migration nova.

Motivo:

Registrar os IDs criados abre caminho para revisao pos-importacao, auditoria mais precisa e eventual rollback assistido no futuro.

## V1.10 implementada

A tabela de importacoes recentes agora detecta auditoria avancada.

Comportamento:

1. A tela tenta ler `created_volunteer_ids`.
2. Se a coluna existir, mostra quantos IDs foram registrados por importacao.
3. Se a coluna ainda nao existir, faz fallback para o log basico.
4. A tela informa que a migration `20260508_0006_volunteer_import_log_created_ids.sql` esta pendente.

Motivo:

Permitir que ambientes em diferentes estagios de migration continuem usando o importador sem quebrar a tela.

## V1.11 implementada

Foi criada a pagina de detalhe de uma importacao:

`/dados/importar/[id]`

Ela permite:

- revisar os voluntarios criados por uma importacao;
- abrir cada cadastro individual;
- copiar um resumo da importacao;
- conferir data, usuario, criados, ignorados e IDs registrados.

Motivo:

Transformar a auditoria avancada em uma ferramenta pratica de revisao pos-importacao, nao apenas em dado armazenado no banco.

## V1.12 implementada

A pagina de detalhe da importacao agora gera um CSV copiavel dos cadastros criados.

Campos:

- `id`
- `name`
- `whatsapp`
- `active`
- `care_status`
- `next_step`

Motivo:

Facilitar conferencia manual, prestacao de contas e comparacao dos registros criados por uma importacao especifica, sem adicionar ainda uma acao destrutiva de rollback.
