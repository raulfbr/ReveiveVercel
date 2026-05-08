# 21 - Privacidade e Seguranca dos Dados do Voluntariado

Data e hora: 08/05/2026 12:01
Projeto: Revive - Ministerio de Voluntariado
Tema: Uso responsavel dos dados no MVP Dados/Escalas
Responsavel: Raul

## Objetivo

Definir limites praticos para coleta, acesso, uso e compartilhamento dos dados do voluntariado no Painel de Cuidado.

Este documento nao substitui orientacao juridica. Ele traduz principios de privacidade em regras simples para o MVP nascer com cuidado, proporcionalidade e seguranca.

## Referencias oficiais consultadas

- LGPD - Ministerio da Saude: https://www.gov.br/saude/pt-br/acesso-a-informacao/lgpd
- Principios fundamentais da LGPD - gov.br/Funasa: https://www.gov.br/funasa/pt-br/acesso-a-informacao/lei-geral-de-protecao-de-dados-pessoais-lgpd/principios-fundamentais-da-lgpd-1
- Guia orientativo da ANPD sobre agentes de tratamento e encarregado: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-para-definicoes-dos-agentes-de-tratamento-de-dados-pessoais-e-do-encarregado

## Principio central

Coletar o minimo necessario para cuidar melhor.

No contexto do MVP, o dado deve existir para:

- organizar a base de voluntarios;
- facilitar integracao;
- identificar pessoas sem area;
- lembrar proximos passos;
- orientar cuidado e captacao;
- apoiar decisoes da lideranca.

O dado nao deve existir para:

- expor pessoas;
- constranger voluntarios;
- criar ranking;
- registrar informacoes sensiveis sem necessidade;
- substituir conversa;
- alimentar julgamento frio.

## Relacao com principios da LGPD

| Principio | Aplicacao pratica no MVP |
|---|---|
| Finalidade | Explicar que os dados servem para cuidado, organizacao e acompanhamento do voluntariado |
| Adequacao | Coletar apenas dados compativeis com essa finalidade |
| Necessidade | Evitar campos desnecessarios ou detalhes sensiveis |
| Transparencia | Deixar claro quem usa os dados e para qual proposito |
| Qualidade dos dados | Manter dados corretos, atuais e revisados |
| Seguranca | Restringir acesso e proteger planilhas, sistema e credenciais |
| Prevencao | Evitar exposicao, compartilhamento indevido e comentarios sensiveis |
| Nao discriminacao | Nao usar dados para excluir, rotular ou tratar pessoas de forma abusiva |
| Responsabilizacao | Definir responsaveis, rotina e regras de acesso |

## Dados que podem ser coletados no MVP

Coleta recomendada:

- nome;
- telefone;
- email, se necessario;
- area principal;
- status de cuidado;
- se esta ativo ou nao;
- data de entrada;
- ultimo contato;
- proximo passo;
- responsavel pelo cuidado;
- data de proximo acompanhamento;
- observacoes curtas e neutras.

## Dados que devem ser evitados

Evitar registrar:

- detalhes de saude;
- diagnosticos;
- conflitos familiares;
- confissoes;
- problemas financeiros;
- detalhes pastorais privados;
- julgamentos sobre carater;
- justificativas longas;
- historico de faltas como instrumento de cobranca;
- qualquer informacao que nao gere uma acao pratica de cuidado.

## Como escrever observacoes de forma segura

Preferir frases neutras:

- `fazer primeiro contato`;
- `confirmar disponibilidade`;
- `validar pausa`;
- `acompanhar retorno`;
- `conversar com lideranca`;
- `entender area de interesse`;
- `definir proximo passo`.

Evitar frases como:

- `sumiu`;
- `esta problematica`;
- `nao tem compromisso`;
- `briga com lideranca`;
- `esta mal emocionalmente`;
- `faltou muitas vezes sem justificativa`.

## Regras de acesso

O painel e as planilhas devem ser acessados apenas por pessoas com responsabilidade real sobre voluntariado, cuidado, dados ou lideranca.

Sugestao de acesso:

- responsavel por Dados/Escalas;
- coordenacao do voluntariado;
- lideres autorizados;
- responsavel por cuidado/integracao;
- lideranca ministerial, quando necessario.

Nao recomendado:

- acesso publico;
- envio da planilha em grupos amplos;
- compartilhamento com pessoas sem responsabilidade no processo;
- prints com dados pessoais em conversas abertas.

## Regras para compartilhamento

Antes de compartilhar qualquer informacao, perguntar:

1. Essa pessoa precisa mesmo acessar esse dado?
2. Existe uma forma mais resumida ou anonima de compartilhar?
3. O dado ajuda a decidir uma acao de cuidado?
4. O compartilhamento pode constranger alguem?
5. O canal e seguro e restrito?

Se a resposta gerar duvida, nao compartilhar.

## Cuidados com a demo publica

A demo publica deve usar apenas dados ficticios.

Rotas publicas:

- `/demo/dados/kit`
- `/demo/dados/apresentacao`
- `/demo/dados`

Essas rotas nao devem carregar dados reais de voluntarios.

Dados reais devem ficar apenas em ambiente autenticado, com permissao adequada:

- `/dados`
- `/voluntarios`

## Cuidados com planilhas

Se a base estiver em Google Sheets, Excel ou CSV:

1. Usar acesso restrito.
2. Evitar permissao publica por link.
3. Nao enviar arquivo em grupo amplo.
4. Remover informacoes sensiveis.
5. Manter uma pessoa responsavel pela versao atual.
6. Evitar copias paralelas.
7. Apagar ou arquivar planilhas antigas quando nao forem mais necessarias.

## Cuidados no sistema

Recomendacoes para o sistema:

- exigir login para rotas reais;
- manter regras de permissao no Supabase;
- nao expor dados reais em rotas publicas;
- nao registrar informacoes sensiveis em `notes`;
- usar campos objetivos de proximo passo;
- revisar acesso periodicamente;
- separar demo de producao;
- usar dados ficticios em preview publico.

## Aviso simples para voluntarios

Texto sugerido:

```text
Usamos algumas informacoes basicas dos voluntarios para organizar o ministerio, acompanhar integracao, cuidar de proximos passos e apoiar a lideranca. Esses dados devem ser acessados apenas por pessoas autorizadas e usados com finalidade de cuidado, organizacao e comunicacao do voluntariado.
```

## Politica de retencao simples

Sugestao inicial:

| Tipo de informacao | Retencao sugerida |
|---|---|
| Dados cadastrais basicos | Enquanto a pessoa estiver ativa ou relacionada ao voluntariado |
| Status de cuidado | Revisar semanalmente ou mensalmente |
| Proximos passos | Manter apenas enquanto forem relevantes |
| Observacoes | Revisar e limpar periodicamente |
| Dados de pessoas inativas | Manter apenas o necessario para historico operacional |

## Checklist antes de usar dados reais

`[ ]` O grupo sabe qual e a finalidade do painel.

`[ ]` A demo publica usa apenas dados ficticios.

`[ ]` Dados reais ficam apenas em rotas autenticadas.

`[ ]` Existe responsavel pela base.

`[ ]` Acesso foi definido e restrito.

`[ ]` Informacoes sensiveis foram removidas.

`[ ]` Observacoes foram escritas de forma neutra.

`[ ]` Existe rotina de revisao e limpeza.

`[ ]` O grupo entende que dados servem para cuidado, nao cobranca.

## Linha vermelha

Se uma informacao pode envergonhar, expor ou rotular uma pessoa, ela provavelmente nao deve estar no painel.

O maximo que o MVP precisa registrar e o suficiente para gerar uma acao de cuidado respeitosa.

## Recomendacao final

Tratar privacidade como parte do cuidado.

No voluntariado, proteger dados nao e apenas obrigacao tecnica. E tambem uma forma de honrar pessoas, preservar confianca e impedir que uma ferramenta boa seja usada de um jeito frio ou indevido.
