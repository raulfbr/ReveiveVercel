# 10 - Backlog Priorizado Pos-Reuniao Dados/Escalas

Data e hora: 08/05/2026 11:20
Projeto: Revive - Ministerio de Voluntariado
Objetivo: transformar a validacao do MVP em proximas entregas claras.

## Se a proposta for aprovada

Executar nesta ordem.

## P0 - Preparar demonstracao real

Objetivo: sair da demo ficticia e mostrar o app autenticado com dados persistidos.

Tarefas:

1. Aplicar a migration `20260508_0004_volunteer_care_fields.sql`.
2. Rodar `supabase/demo_seed_dados_escalas.sql` no Supabase de teste.
3. Garantir um usuario admin em `app_users`.
4. Entrar em `/voluntarios`.
5. Validar cards, prioridades, filtros, resumo copiavel e detalhe do voluntario.

Criterio de pronto:

- Lider consegue ver o Painel de Cuidado com dados persistidos.

## P1 - Ajustar linguagem com a equipe

Objetivo: garantir que a area de Dados seja percebida como cuidado, nao fiscalizacao.

Tarefas:

1. Validar nomes dos status.
2. Validar termos como `possivel sobrecarga`, `precisa contato` e `baixa cobertura`.
3. Definir quem pode ver observacoes sensiveis.
4. Definir o ritmo do resumo semanal.

Criterio de pronto:

- Equipe concorda com a linguagem e o uso dos alertas.

## P2 - Fluxo semanal real

Objetivo: transformar o painel em rotina.

Tarefas:

1. Definir responsavel por atualizar dados.
2. Definir dia da semana para revisar prioridades.
3. Enviar o primeiro resumo semanal para lideranca.
4. Registrar feedback dos lideres.

Criterio de pronto:

- Primeiro ciclo semanal de cuidado concluido.

## P3 - Melhorias do produto

Objetivo: evoluir o MVP com base no uso real.

Tarefas:

1. Criar historico de follow-ups.
2. Adicionar filtros por status de cuidado.
3. Adicionar tela especifica de Dados/Escalas, separada de voluntarios.
4. Criar exportacao CSV do resumo.
5. Criar permissao futura para lider ver apenas sua area.

Criterio de pronto:

- Produto deixa de ser apenas painel e vira rotina operacional.

## P4 - Escalas reais

Objetivo: iniciar sistema de escala somente depois de validar o processo de cuidado.

Tarefas:

1. Modelar cultos/eventos.
2. Modelar funcoes necessarias por area.
3. Registrar voluntarios escalados.
4. Registrar presenca, ausencia e substituicao.
5. Calcular carga mensal por pessoa.

Criterio de pronto:

- Lider consegue planejar escala e enxergar impacto na carga dos voluntarios.

## Decisao recomendada

Nao pular direto para P4.

Primeiro validar P0, P1 e P2. Se a equipe nao criar o habito de usar dados para cuidado, um sistema de escala completo pode virar apenas mais uma ferramenta de cobranca.
