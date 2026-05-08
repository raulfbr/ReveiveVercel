# 11 - Plano de Execucao para Reuniao e MVP Dados/Escalas

Data e hora: 08/05/2026 11:49
Projeto: Revive - Ministerio de Voluntariado
Tema: Execucao pratica do pilar Dados/Escalas
Responsavel: Raul

## Objetivo deste documento

Dar ao grupo um caminho simples para discutir a proposta mesmo sem a presenca do Raul na reuniao, aprovar as decisoes certas e sair com uma primeira entrega pequena, concreta e util.

A ideia central e:

> Dados no Revive existem para que nenhuma pessoa se perca no caminho, nenhum lider caminhe no escuro e nenhum ministerio dependa apenas de improviso.

## Decisao estrategica recomendada

Comecar pelo Painel de Cuidado, nao por um motor completo de escalas.

Motivo:

Um sistema de escala so funciona bem quando a base de pessoas esta minimamente confiavel. Antes de automatizar escala, precisamos responder perguntas basicas:

- Quem esta ativo?
- Quem esta sem area?
- Quem entrou recentemente e ainda precisa de integracao?
- Quem precisa de contato?
- Qual area esta com baixa cobertura?
- Quem tem proximo passo pendente?
- Quais lideres precisam agir primeiro nesta semana?

Esse caminho reduz risco, gera valor rapido e prepara o terreno para uma escala mais madura depois.

## O que ja temos para mostrar

1. Apresentacao publica em `/demo/dados/apresentacao`.
2. Demo publica do painel em `/demo/dados`.
3. Kit publico da reuniao em `/demo/dados/kit`.
4. Painel autenticado real em `/dados`.
5. Importador CSV autenticado em `/dados/importar`, hoje como pre-validacao segura.
6. Cadastro e detalhe operacional em `/voluntarios`.
7. Campos de cuidado preparados para Supabase.
8. Resumo semanal copiavel para virar pauta de lideranca.
9. Documentos de apoio, PRD, roteiro, checklist, guia de publicacao e backlog.

## Como conduzir a conversa hoje

Sugestao de ordem:

1. Abrir com a frase: "Dados nao entram para cobrar pessoas, mas para dar clareza para cuidar melhor."
2. Abrir o kit em `/demo/dados/kit`.
3. Mostrar a apresentacao em `/demo/dados/apresentacao`.
4. Reforcar que a demo usa dados ficticios e nao expoe ninguem.
5. Abrir a demo em `/demo/dados`.
6. Mostrar os cards de cuidado: sem area, precisa contato, atencao/sobrecarga, novos e retornos vencidos.
7. Mostrar as prioridades da semana.
8. Mostrar a distribuicao por area.
9. Mostrar o botao de copiar resumo.
10. Se o ambiente autenticado estiver pronto, abrir `/dados`.
11. Fechar pedindo as decisoes objetivas abaixo.

## Decisoes que o grupo precisa aprovar

1. Validar que o primeiro MVP sera um Painel de Cuidado de voluntarios.
2. Validar os status de cuidado: novo, ativo, precisa contato, em pausa e inativo.
3. Definir quem pode visualizar o painel autenticado.
4. Definir quem atualiza os dados de cuidado.
5. Definir a frequencia do resumo semanal.
6. Aprovar que a escala completa vira uma proxima onda, depois da base de pessoas estar confiavel.

## Entrega pequena que ja resolve uma dor

Entrega inicial:

Um painel que mostra, toda semana, quais voluntarios precisam de atencao e quais areas precisam de reforco.

Dor resolvida:

Hoje o cuidado tende a depender da memoria, de conversas espalhadas e da percepcao individual de cada lider. O painel transforma isso em uma pauta comum, simples e objetiva.

Resultado esperado:

- Menos gente esquecida.
- Menos improviso.
- Mais clareza para lideres.
- Mais rapidez para acolher novos voluntarios.
- Mais base para captar, redistribuir e cuidar.

## Limites importantes para nao prometer alem do MVP

O MVP nao deve ser apresentado como:

- sistema completo de escala automatica;
- ferramenta de cobranca;
- ranking de voluntarios;
- exposicao publica de faltas;
- substituto do cuidado pastoral ou relacional;
- solucao final para todo o ministerio.

O MVP deve ser apresentado como:

- painel de clareza;
- pauta semanal de cuidado;
- base para tomada de decisao;
- primeiro passo para profissionalizar Dados/Escalas;
- ponte entre cuidado, captacao, integracao e futura escala.

## Plano de execucao em ondas

### Onda 1 - Hoje

Objetivo: alinhar visao e aprovar direcao.

Entregas:

- Apresentacao publica.
- Demo publica.
- Mensagem pronta para o grupo.
- Decisoes sugeridas.
- Backlog priorizado.

### Onda 2 - Proximos 7 dias

Objetivo: transformar demo em uso real controlado.

Entregas:

- Aplicar migration de campos de cuidado.
- Preencher pequena base real ou base de teste.
- Validar `/dados` com acesso autenticado.
- Definir responsavel por atualizar status e proximos passos.
- Rodar primeira pauta semanal com lideres.

### Onda 3 - Proximos 30 dias

Objetivo: criar rotina de acompanhamento.

Entregas:

- Revisao semanal dos indicadores.
- Lista de voluntarios sem area.
- Lista de voluntarios precisando contato.
- Analise de baixa cobertura por area.
- Primeira rotina de follow-up.
- Ajuste dos status conforme uso real.

### Onda 4 - Depois da base confiavel

Objetivo: evoluir para escala com menos risco.

Entregas possiveis:

- Disponibilidade por voluntario.
- Preferencias de area e horario.
- Historico de participacao.
- Sugestao de escala.
- Alertas de sobrecarga.
- Confirmacao de presenca.

## Mensagem curta para enviar junto com os links

Pessoal, deixei uma proposta bem pratica para o pilar Dados/Escalas. Minha recomendacao e comecarmos pelo Painel de Cuidado antes de tentar criar uma escala completa.

A razao e simples: antes de automatizar escala, precisamos enxergar bem quem esta ativo, quem esta sem area, quem precisa de contato, onde falta gente e qual proximo passo precisa acontecer.

Links para olhar:

- Kit da reuniao: `/demo/dados/kit`
- Apresentacao: `/demo/dados/apresentacao`
- Demo do painel: `/demo/dados`
- Painel real autenticado: `/dados`, se o ambiente estiver configurado

O ponto principal que eu queria deixar para a reuniao e: dados aqui nao sao para cobrar pessoas, mas para ajudar a igreja a cuidar melhor e caminhar com menos improviso.

## Criterio de sucesso desta reuniao

A reuniao foi bem-sucedida se o grupo sair com clareza sobre:

1. Qual dor inicial vamos resolver.
2. Qual MVP vamos priorizar.
3. Quem pode acessar os dados.
4. Quem atualiza as informacoes.
5. Qual sera a primeira rotina semanal.
6. O que fica para depois.

## Recomendacao final

Minha recomendacao e aprovar o MVP como Painel de Cuidado e usar a proxima semana para testar com um grupo pequeno, antes de expandir para todo o voluntariado.

Essa e a decisao mais segura: entrega valor rapido, evita excesso de complexidade e cria base real para uma futura escala bem feita.
