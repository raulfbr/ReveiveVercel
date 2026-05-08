# 22 - Plano de Piloto de 7 Dias do Painel de Cuidado

Data e hora: 08/05/2026 12:05
Projeto: Revive - Ministerio de Voluntariado
Tema: Execucao controlada do MVP Dados/Escalas
Responsavel: Raul

## Objetivo

Executar um piloto pequeno, seguro e mensuravel do Painel de Cuidado em 7 dias.

O objetivo nao e validar tudo. O objetivo e descobrir rapidamente se o painel ajuda a lideranca a enxergar pessoas, tomar decisoes e acompanhar proximos passos.

## Hipotese do piloto

Se usarmos uma base pequena de voluntarios com status de cuidado, area, proximo passo e responsavel, entao a lideranca conseguira conduzir uma pauta semanal mais clara e agir antes que pessoas fiquem esquecidas.

## Escopo recomendado

Comecar com:

- uma ou duas areas piloto;
- poucos voluntarios;
- dados minimos;
- acesso restrito;
- uma revisao semanal;
- registro simples de aprendizados.

Evitar no piloto:

- escala automatica;
- importacao complexa;
- muitos campos;
- varias areas ao mesmo tempo;
- automacoes;
- relatorios avancados.

## Papeis do piloto

| Papel | Responsabilidade |
|---|---|
| Dono do piloto | Garante que o teste avance e fecha aprendizados |
| Dados/Escalas | Organiza base, revisa dados e abre o painel |
| Lider da area piloto | Confirma quem esta ativo, sem area ou precisando contato |
| Cuidado/Integracao | Acompanha pessoas novas, sem area ou precisando conversa |
| Coordenacao | Decide proximos passos e remove bloqueios |

## Dia 0 - Decisao da reuniao

Objetivo:

Sair da reuniao com o piloto autorizado.

Checklist:

`[ ]` Area piloto definida.

`[ ]` Dono do piloto definido.

`[ ]` Quem atualiza os dados definido.

`[ ]` Quem pode acessar `/dados` definido.

`[ ]` Data da primeira revisao semanal definida.

`[ ]` Limites de privacidade reforcados.

Saida esperada:

```text
Vamos testar o Painel de Cuidado por 7 dias com a area __________.
Responsavel pelo piloto: __________.
Primeira revisao: ____/____/______.
```

## Dia 1 - Preparar a base

Objetivo:

Montar uma base pequena e suficiente.

Checklist:

`[ ]` Copiar o template `17-template-csv-coleta-voluntarios.csv`.

`[ ]` Preencher nome, telefone, area, ativo e status de cuidado.

`[ ]` Marcar pessoas novas.

`[ ]` Marcar pessoas sem area.

`[ ]` Marcar pessoas que precisam contato.

`[ ]` Remover informacoes sensiveis.

Saida esperada:

Uma planilha simples e revisada.

## Dia 2 - Revisar qualidade dos dados

Objetivo:

Evitar que o painel nasca com dados confusos.

Checklist:

`[ ]` Usar o checklist `18-checklist-qualidade-dados-antes-importacao.md`.

`[ ]` Revisar duplicados.

`[ ]` Padronizar areas.

`[ ]` Padronizar `care_status`.

`[ ]` Garantir que `needs_contact` tenha proximo passo quando possivel.

`[ ]` Confirmar que dados sensiveis nao entraram.

Saida esperada:

Base pronta para cadastro/importacao.

## Dia 3 - Colocar os dados no sistema

Objetivo:

Levar a base piloto para o ambiente autenticado.

Checklist:

`[ ]` Confirmar que as migrations foram aplicadas.

`[ ]` Confirmar que `/dados` exige login.

`[ ]` Cadastrar ou importar a base piloto.

`[ ]` Abrir `/dados`.

`[ ]` Conferir cards principais.

`[ ]` Conferir lista de prioridades.

`[ ]` Conferir distribuicao por area.

Saida esperada:

Painel carregando a base piloto.

## Dia 4 - Primeira leitura com lideranca

Objetivo:

Transformar dados em decisao.

Roteiro:

1. Abrir `/dados`.
2. Ver pessoas sem area.
3. Ver pessoas que precisam contato.
4. Ver novos voluntarios.
5. Ver areas com baixa cobertura.
6. Copiar resumo semanal.
7. Definir responsavel e prazo para cada proximo passo.

Saida esperada:

Lista curta de acoes com dono e prazo.

## Dia 5 - Executar os primeiros contatos

Objetivo:

Validar se o painel gera cuidado pratico.

Checklist:

`[ ]` Contatar pessoas novas.

`[ ]` Contatar pessoas sem area.

`[ ]` Contatar pessoas marcadas como `needs_contact`.

`[ ]` Registrar proximo passo.

`[ ]` Atualizar status quando necessario.

Saida esperada:

Pessoas acompanhadas e painel atualizado.

## Dia 6 - Coletar feedback

Objetivo:

Aprender o que funcionou e o que precisa mudar.

Perguntas:

1. O painel ajudou a enxergar algo que estava invisivel?
2. As prioridades fizeram sentido?
3. Os status foram claros?
4. Faltou algum campo essencial?
5. Sobrou algum campo desnecessario?
6. A rotina foi leve ou pesada?
7. O resumo semanal ajudou a conversa?

Saida esperada:

Lista de ajustes simples para a proxima semana.

## Dia 7 - Decidir continuidade

Objetivo:

Decidir se o piloto deve continuar, ajustar ou expandir.

Opcoes:

`[ ]` Continuar por mais uma semana com a mesma area.

`[ ]` Ajustar campos/status antes de continuar.

`[ ]` Expandir para mais uma area.

`[ ]` Pausar para resolver bloqueios.

CritÃ©rios de decisao:

`[ ]` O painel gerou clareza.

`[ ]` A lideranca conseguiu definir proximos passos.

`[ ]` As pessoas certas foram acompanhadas.

`[ ]` A rotina nao ficou pesada demais.

`[ ]` Os dados ficaram seguros e bem usados.

## Indicadores do piloto

Medir de forma simples:

| Indicador | Como medir |
|---|---|
| Pessoas sem area | Quantidade antes e depois da semana |
| Pessoas precisando contato | Quantidade acompanhada |
| Proximos passos definidos | Quantidade com responsavel e prazo |
| Areas com baixa cobertura | Areas identificadas para decisao |
| Qualidade dos dados | Quantidade de inconsistencias encontradas |
| Utilidade percebida | Feedback da lideranca |

## Template de resultado do piloto

```text
Resultado do piloto - Painel de Cuidado

Area piloto:
Periodo:
Dono do piloto:

O que funcionou:

O que ficou confuso:

Pessoas acompanhadas:

Decisoes tomadas:

Ajustes necessarios:

Recomendacao:
[ ] continuar
[ ] ajustar
[ ] expandir
[ ] pausar
```

## Decisao recomendada

Se o piloto gerar ao menos uma decisao concreta de cuidado, uma pessoa acompanhada ou uma area com necessidade clara, ele ja provou valor suficiente para continuar por mais uma semana.

O objetivo do primeiro ciclo nao e perfeicao. E criar tracao.
