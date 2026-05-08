# 18 - Checklist de Qualidade dos Dados antes da Importacao

Data e hora: 08/05/2026 11:55
Projeto: Revive - Ministerio de Voluntariado
Tema: Revisao da base antes de usar no Painel de Cuidado
Responsavel: Raul

## Objetivo

Garantir que a primeira base de voluntarios esteja minimamente limpa, consistente e segura antes de ser usada no Painel de Cuidado.

Esse checklist deve ser usado antes de importar dados para o sistema ou antes de cadastrar manualmente uma base piloto.

## Checklist essencial

### Identificacao

`[ ]` Todos os registros tem `name`.

`[ ]` Nomes duplicados foram revisados.

`[ ]` Apelidos foram padronizados quando necessario.

`[ ]` Nao ha linhas vazias no meio da planilha.

### Contato

`[ ]` Todos os registros tem `phone`.

`[ ]` Telefones estao sem espacos, parenteses ou tracos, quando possivel.

`[ ]` Telefones obviamente invalidos foram revisados.

`[ ]` Emails foram revisados quando preenchidos.

### Area

`[ ]` Areas foram escritas de forma padronizada.

`[ ]` Pessoas sem area foram deixadas com `area` em branco, nao com textos variados.

`[ ]` Areas antigas ou informais foram revisadas.

`[ ]` A lideranca entende que pessoa sem area nao e erro, mas prioridade de integracao.

### Status de cuidado

`[ ]` Todos os registros tem `care_status`.

`[ ]` Todos os valores de `care_status` usam apenas:

- `new`
- `active`
- `needs_contact`
- `paused`
- `inactive`

`[ ]` Nao ha valores como `ok`, `pendente`, `problema`, `sumiu`, `afastado` ou textos livres no campo de status.

`[ ]` Pessoas com `care_status = inactive` estao com `active = false`.

`[ ]` Pessoas com `active = false` foram revisadas para confirmar se devem ser `inactive` ou `paused`.

### Proximo passo

`[ ]` Pessoas com `care_status = needs_contact` tem `next_step` preenchido sempre que possivel.

`[ ]` Proximos passos estao escritos como acao, nao como julgamento.

`[ ]` Proximos passos tem responsavel quando necessario.

`[ ]` Datas de acompanhamento usam formato `AAAA-MM-DD`.

### Privacidade

`[ ]` O campo `notes` nao contem informacoes sensiveis.

`[ ]` Nao ha detalhes pastorais privados na planilha.

`[ ]` Nao ha diagnosticos, conflitos pessoais ou justificativas longas.

`[ ]` Observacoes foram reduzidas a informacoes praticas e neutras.

`[ ]` A planilha sera compartilhada apenas com pessoas autorizadas.

## Exemplos de ajuste antes de importar

| Antes | Depois | Motivo |
|---|---|---|
| `sumiu` | `needs_contact` | Status precisa ser padronizado |
| `nao vem mais` | `inactive` | Evitar frase informal no status |
| `precisa conversar porque esta mal` | `conversar com lideranca` | Reduz exposicao sensivel |
| `Recepcao`, `recepÃ§Ã£o`, `RecepÃ§Ã£o` | `Recepcao` | Padronizar area |
| `11 99999-9999` | `11999999999` | Facilitar importacao |

## Regra de ouro

Se a informacao nao ajuda a definir uma acao de cuidado, provavelmente nao precisa estar na planilha.

## Definicao de pronto

A base esta pronta para o primeiro uso quando:

`[ ]` Os campos obrigatorios estao preenchidos.

`[ ]` Os status estao padronizados.

`[ ]` Pessoas que precisam de contato tem proximo passo.

`[ ]` Dados sensiveis foram removidos.

`[ ]` A lideranca sabe quem vai atualizar a base.

`[ ]` O painel sera usado em uma rotina semanal clara.

## Recomendacao final

Nao esperar a base ficar perfeita para comecar.

Mas tambem nao comecar com uma base confusa.

O melhor caminho e um piloto pequeno, revisado, com poucos campos e boa disciplina semanal.
