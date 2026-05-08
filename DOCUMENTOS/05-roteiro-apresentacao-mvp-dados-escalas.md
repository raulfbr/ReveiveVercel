# 05 - Roteiro de Apresentacao do MVP Dados/Escalas

Data e hora: 08/05/2026 11:20
Projeto: Revive - Ministerio de Voluntariado
Tema: Demonstracao do Painel de Cuidado
Responsavel: Raul

## Objetivo da demonstracao

Mostrar que a area de Dados/Escalas pode entregar valor rapidamente sem esperar um sistema completo de escala.

A proposta e demonstrar uma primeira versao que ajuda a lideranca a enxergar pessoas, riscos e proximos passos.

## Link da demo local

`http://127.0.0.1:3001/demo/dados`

## Link da apresentacao local

`http://127.0.0.1:3001/demo/dados/apresentacao`

## Link do kit da reuniao local

`http://127.0.0.1:3001/demo/dados/kit`

## Fala de abertura

Pessoal, a ideia dessa primeira versao nao e resolver toda a escala da igreja agora. Antes disso, precisamos resolver uma dor anterior: enxergar quem esta servindo, quem precisa de cuidado, onde falta gente e qual proximo passo precisa acontecer.

Dados aqui nao entram como cobranca, mas como clareza para cuidar melhor.

## Roteiro em 5 minutos

1. Abrir o kit em `/demo/dados/kit`.
2. Copiar ou ler a mensagem pronta.
3. Abrir a apresentacao em `/demo/dados/apresentacao`.
4. Explicar a tese: dados existem para cuidar melhor, nao para cobrar mais.
5. Mostrar as decisoes que o time precisa aprovar.
6. Abrir a demo em `/demo/dados`.
7. Mostrar os cards principais: ativos, sem area, atencao/sobrecarga, precisa contato, novos e retornos vencidos.
8. Explicar que cada card vira uma pauta objetiva para conversa com lideres.
9. Mostrar as prioridades da semana para provar que o painel ajuda a decidir.
10. Mostrar a distribuicao por area para conectar Dados com Captacao.
11. Usar os filtros para mostrar pessoas sem area, em sobrecarga e novas.
12. Mostrar a coluna de proximo passo.
13. Clicar em "Copiar resumo" para demonstrar que o painel vira uma pauta pratica.
14. Se o Supabase/auth estiver configurado, abrir `/dados` para mostrar que a mesma logica ja existe na area autenticada.
15. Fechar dizendo que o objetivo e cuidar antes que a ausencia vire afastamento.

## Decisoes sugeridas para a reuniao

1. Validar Dados/Escalas como area de clareza e cuidado, nao de cobranca.
2. Comecar pelo Painel de Cuidado antes de construir escala completa.
3. Usar os status: novo, ativo, precisa contato, em pausa e inativo.
4. Adotar um resumo semanal copiavel como pauta para lideranca.
5. Usar baixa cobertura por area para orientar captacao e redistribuicao.

## Pontos que precisam ficar claros

- A demo usa dados ficticios.
- A operacao real continua na area autenticada do sistema.
- O MVP nao cria ranking de voluntarios.
- O MVP nao expoe faltas publicamente.
- O MVP nao substitui o cuidado do lider.
- O MVP ajuda o lider a saber onde agir primeiro.

## Frase final

Dados no Revive existem para que nenhuma pessoa se perca no caminho, nenhum lider caminhe no escuro e nenhum ministerio dependa apenas de improviso.

## Proximo passo apos validacao

Aplicar a migration de cuidado no Supabase, preencher alguns dados reais e demonstrar a versao autenticada em `/dados`. A rota `/voluntarios` fica como apoio operacional para cadastro, detalhe e manutencao da base.
