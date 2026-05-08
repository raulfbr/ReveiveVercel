# 24 - Mapa de Integracao de Dados com Outras Areas

Data e hora: 08/05/2026 12:08
Projeto: Revive - Ministerio de Voluntariado
Tema: Como Dados/Escalas serve as outras frentes do voluntariado
Responsavel: Raul

## Objetivo

Mostrar como o pilar Dados/Escalas se conecta com as outras areas do voluntariado.

A proposta nao e Dados virar uma area isolada, nem controlar o ministerio. A proposta e Dados servir como uma camada de clareza para que cada area tome decisoes melhores.

## Frase central

> Dados/Escalas nao substitui lideranca, cuidado, captacao ou integracao. Dados/Escalas ajuda cada area a enxergar melhor onde agir.

## Papel de Dados/Escalas

Dados/Escalas deve funcionar como uma central leve de informacao acionavel.

Ele recebe sinais das areas, organiza esses sinais e devolve clareza em forma de:

- prioridades;
- listas de acompanhamento;
- baixa cobertura por area;
- proximos passos;
- resumo semanal;
- indicadores saudaveis;
- alertas de cuidado.

## Mapa geral de interfaces

| Area | O que informa para Dados | O que recebe de Dados | Decisao que melhora |
|---|---|---|---|
| Captacao | Areas com falta de pessoas, perfis desejados, novas oportunidades | Areas com baixa cobertura e pessoas sem area | Onde captar primeiro |
| Integracao | Novos voluntarios, pessoas sem area, andamento de acolhimento | Lista de novos, sem area e proximos passos | Quem precisa ser integrado |
| Cuidado/Pastoreio | Sinais de pausa, necessidade de contato, acompanhamento sensivel | Lista neutra de pessoas para cuidado e retorno | Quem precisa de conversa |
| Lideres de area | Mudancas de disponibilidade, pausas, sobrecarga, entrada/saida | Visao da propria area e pendencias | Como organizar a equipe |
| Escalas/Operacao | Disponibilidade, areas ativas, capacidade minima | Base mais confiavel para escala futura | Quem pode servir onde |
| Coordenacao | Decisoes, prioridades e criterios | Scorecard semanal e riscos | O que priorizar na semana |
| Comunicacao | Necessidades de chamada, campanhas ou convites | Demandas especificas por area | O que comunicar e para quem |

## Interface com Captacao

### Dados recebe

- areas com baixa cobertura;
- tipos de voluntarios necessarios;
- demandas futuras;
- informacoes sobre pessoas interessadas;
- retornos de campanhas de convite.

### Dados entrega

- lista de areas com poucos voluntarios ativos;
- pessoas sem area que podem ser acolhidas;
- padroes de necessidade por area;
- prioridades de captacao para a semana ou mes.

### Decisoes que ajuda

- onde captar primeiro;
- qual area precisa de campanha;
- qual perfil de voluntario procurar;
- quais pessoas podem ser convidadas para uma area especifica.

## Interface com Integracao

### Dados recebe

- pessoas novas;
- status de primeiro contato;
- area de interesse;
- disponibilidade inicial;
- se a pessoa ja foi acolhida.

### Dados entrega

- lista de novos voluntarios;
- lista de pessoas sem area;
- proximos passos de integracao;
- responsavel por acompanhar;
- retornos vencidos.

### Decisoes que ajuda

- quem precisa de primeiro contato;
- quem precisa ser alocado;
- quem esta parado no processo;
- qual area pode receber novas pessoas.

## Interface com Cuidado/Pastoreio

### Dados recebe

- sinais de necessidade de contato;
- pausas combinadas;
- retornos importantes;
- situacoes que exigem acompanhamento, sem registrar detalhes sensiveis.

### Dados entrega

- lista neutra de pessoas com `precisa contato`;
- proximos passos de cuidado;
- responsavel pelo acompanhamento;
- datas de retorno.

### Decisoes que ajuda

- quem precisa ser procurado;
- quem precisa de pausa;
- quem precisa de conversa com lideranca;
- quais casos nao podem ficar invisiveis.

## Interface com Lideres de area

### Dados recebe

- voluntarios ativos;
- saidas ou pausas;
- sobrecarga percebida;
- novas pessoas chegando;
- necessidades especificas da area.

### Dados entrega

- visao da area;
- pendencias de cuidado;
- pessoas sem proximo passo;
- baixa cobertura;
- resumo semanal.

### Decisoes que ajuda

- quem acompanhar;
- onde realocar;
- quando pedir reforco;
- quais prioridades levar para coordenacao.

## Interface com Escalas/Operacao

### Dados recebe

- disponibilidade;
- capacidade minima por area;
- frequencia desejada;
- restricoes importantes;
- historico futuro de presenca, quando existir.

### Dados entrega

- base de pessoas mais confiavel;
- status atualizado;
- areas com risco de baixa cobertura;
- possiveis sinais de sobrecarga.

### Decisoes que ajuda

- quando iniciar escala mais estruturada;
- quem pode entrar na escala;
- quais areas nao tem base suficiente;
- onde a escala ainda seria precipitada.

## Interface com Coordenacao

### Dados recebe

- prioridades do ministerio;
- decisoes de acesso;
- criterios de cuidado;
- direcionamento sobre area piloto;
- feedback sobre a rotina.

### Dados entrega

- scorecard semanal;
- riscos;
- gargalos;
- backlog priorizado;
- resumo de decisoes.

### Decisoes que ajuda

- qual area atacar primeiro;
- qual risco precisa ser mitigado;
- quando expandir;
- quando pausar ou ajustar.

## Interface com Comunicacao

### Dados recebe

- campanhas planejadas;
- necessidades de comunicacao;
- oportunidades de convite;
- informacoes que podem ser divulgadas publicamente.

### Dados entrega

- demandas especificas por area;
- temas de chamada para voluntariado;
- informacao agregada, sem expor pessoas;
- prioridades de comunicacao.

### Decisoes que ajuda

- qual convite fazer;
- qual area divulgar;
- que mensagem usar;
- quando comunicar uma necessidade de reforco.

## Fluxo semanal recomendado

1. Lideres informam mudancas relevantes.
2. Dados/Escalas atualiza a base.
3. Painel mostra prioridades.
4. Coordenacao define foco da semana.
5. Cuidado/Integracao acompanha pessoas.
6. Captacao recebe necessidades por area.
7. Comunicacao apoia convites especificos.
8. Dados/Escalas fecha o resumo semanal.

## O que Dados precisa pedir para as areas

Pedido simples:

```text
Toda semana, cada lider informa apenas mudancas relevantes:

1. Entrou alguem novo?
2. Alguem saiu ou pausou?
3. Alguem precisa de contato?
4. Existe area com baixa cobertura?
5. Existe algum proximo passo que precisa ser acompanhado?
```

## O que Dados deve devolver para as areas

Devolutiva simples:

```text
Resumo semanal de Dados/Escalas:

1. Pessoas novas:
2. Pessoas sem area:
3. Pessoas que precisam contato:
4. Areas com baixa cobertura:
5. Proximos passos com responsavel:
6. Decisoes pendentes:
```

## Risco principal

O risco e Dados virar apenas cobranca de preenchimento.

Como evitar:

- pedir poucos dados;
- devolver valor rapidamente;
- transformar informacao em decisao;
- mostrar que a area ajuda lideres, nao fiscaliza lideres;
- manter linguagem de cuidado.

## Melhor argumento para a reuniao

Dados/Escalas deve existir para tirar peso da memoria das pessoas e colocar clareza na rotina do ministerio.

Se cada area informa pequenos sinais e Dados devolve uma pauta clara, todo o voluntariado ganha:

- Captacao sabe onde focar;
- Integracao sabe quem acolher;
- Cuidado sabe quem procurar;
- Lideres sabem o que priorizar;
- Coordenacao sabe onde decidir;
- Escalas futuras nascem sobre uma base mais confiavel.

## Recomendacao final

Na reuniao, apresentar Dados/Escalas como uma area de servico as outras areas.

Nao como controle.

Nao como burocracia.

Nao como relatorio por relatorio.

Mas como uma forma de transformar sinais dispersos em cuidado organizado.
