# 29 - Politica de Correcao Pos-importacao

Data e hora: 08/05/2026 12:32
Projeto: Revive - Ministerio de Voluntariado
Tema: Como corrigir importacoes CSV com seguranca
Responsavel: Raul

## Objetivo

Definir como agir depois de uma importacao CSV quando houver erro, duplicidade, informacao incompleta ou necessidade de ajuste.

Esta politica evita decisoes apressadas, principalmente apagamento em massa, e protege a base de voluntarios.

## Principio

Depois que dados reais entram no sistema, toda correcao precisa ser cuidadosa.

Apagar em massa deve ser a ultima opcao, nao a primeira.

## O que fazer logo apos importar

1. Abrir `/dados/importar`.
2. Conferir a mensagem de registros criados e ignorados.
3. Abrir o detalhe da importacao em `Ver criados`.
4. Copiar o CSV de conferencia.
5. Revisar os cadastros criados.
6. Abrir `/dados`.
7. Conferir pessoas sem area, `needs_contact` e proximos passos.
8. Corrigir manualmente os casos pequenos.

## Tipos de problema e decisao recomendada

| Problema | Acao recomendada | Observacao |
|---|---|---|
| Nome com erro pequeno | Corrigir manualmente no cadastro | Nao precisa reimportar |
| Telefone errado | Corrigir manualmente no cadastro | Revisar antes para evitar duplicidade futura |
| Area faltando | Corrigir manualmente no cadastro | Se muitas linhas falharam, ajustar CSV e reimportar somente faltantes |
| Status errado | Corrigir manualmente se forem poucos casos | Se for regra geral errada, revisar processo |
| Muitos registros errados | Pausar uso da base e revisar com responsavel | Nao apagar sem analise |
| Importacao duplicada | Identificar registros pelo detalhe da importacao | Avaliar remocao manual caso a caso |
| Dados sensiveis em notes | Remover imediatamente | Prioridade alta |
| CSV com formato errado | Corrigir arquivo e validar novamente | Nao insistir em importar arquivo confuso |

## Quando corrigir manualmente

Corrigir manualmente quando:

- sao poucos registros;
- o erro e simples;
- a pessoa ja foi revisada;
- apagar criaria mais risco;
- o cadastro ja pode ter sido usado em alguma decisao.

Exemplos:

- nome abreviado;
- area ausente;
- proximo passo incompleto;
- responsavel de cuidado nao preenchido;
- data em branco.

## Quando reimportar

Reimportar somente quando:

- os erros foram corrigidos no CSV;
- as linhas validas ja importadas foram removidas do novo arquivo;
- a planilha foi revisada novamente;
- privacidade foi conferida;
- a nova importacao contem apenas registros que ainda nao existem.

Regra importante:

O importador nao sobrescreve telefone existente. Portanto, reimportar a mesma base inteira tende a gerar ignorados, nao atualizacoes.

## Quando remover registros

Remover registros manualmente apenas quando:

1. houve importacao claramente errada;
2. os registros ainda nao foram usados em acompanhamento;
3. a lideranca entende o risco;
4. existe lista clara dos registros criados;
5. a remocao sera feita por pessoa autorizada.

Usar a pagina de detalhe da importacao para identificar os voluntarios criados.

## Por que nao ter rollback automatico agora

Rollback automatico parece conveniente, mas no MVP pode ser perigoso.

Riscos:

- apagar alguem que ja foi corrigido manualmente;
- apagar alguem que ja recebeu acompanhamento;
- apagar vinculos criados depois da importacao;
- desfazer trabalho legitimo;
- criar falsa sensacao de seguranca.

Por isso, a recomendacao atual e:

- ter auditoria;
- listar IDs criados;
- permitir conferencia;
- corrigir manualmente;
- avaliar rollback assistido apenas depois de mais maturidade.

## Criterios para um rollback assistido futuro

So implementar rollback assistido quando houver:

`[ ]` log confiavel com IDs criados;

`[ ]` tela de pre-visualizacao do que sera removido;

`[ ]` confirmacao explicita de admin;

`[ ]` bloqueio se algum registro foi editado depois da importacao;

`[ ]` bloqueio se houver vinculos novos;

`[ ]` registro de quem executou rollback;

`[ ]` resumo copiavel apos rollback;

`[ ]` entendimento claro da lideranca sobre o risco.

## Fluxo recomendado de correcao

```text
1. Identificar problema.
2. Abrir detalhe da importacao.
3. Copiar CSV de conferencia.
4. Separar casos simples e casos graves.
5. Corrigir casos simples manualmente.
6. Remover dados sensiveis imediatamente, se houver.
7. Para erros grandes, pausar expansao da base.
8. Revisar planilha original.
9. Reimportar apenas novos registros corrigidos, se necessario.
10. Registrar aprendizado para proxima importacao.
```

## Mensagem pronta para comunicar problema de importacao

```text
Pessoal, identificamos ajustes necessarios na ultima importacao de voluntarios.

Antes de qualquer apagamento em massa, vamos revisar os registros criados, corrigir manualmente o que for simples e remover imediatamente qualquer informacao sensivel, se houver.

O objetivo e proteger a base e evitar que uma correcao apressada gere mais erro.
```

## Definicao de pronto apos correcao

A correcao terminou quando:

`[ ]` registros criados foram revisados;

`[ ]` erros simples foram corrigidos;

`[ ]` informacoes sensiveis foram removidas;

`[ ]` pessoas sem area foram identificadas;

`[ ]` `needs_contact` tem proximo passo quando possivel;

`[ ]` responsaveis foram definidos;

`[ ]` o Painel de Cuidado foi revisado novamente.

## Recomendacao final

No MVP, preferir correcao manual orientada por auditoria em vez de rollback automatico.

Isso combina melhor com o momento atual: base pequena, piloto controlado, foco em cuidado e baixo apetite para risco destrutivo.
