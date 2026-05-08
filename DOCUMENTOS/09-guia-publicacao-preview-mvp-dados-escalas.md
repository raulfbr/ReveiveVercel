# 09 - Guia de Publicacao e Preview do MVP Dados/Escalas

Data e hora: 08/05/2026 11:20
Projeto: Revive - Ministerio de Voluntariado
Objetivo: compartilhar o MVP fora da maquina local com seguranca e clareza.

## Situacao atual

O MVP ja pode ser visto localmente em:

- Apresentacao: `http://127.0.0.1:3001/demo/dados/apresentacao`
- Demo do painel: `http://127.0.0.1:3001/demo/dados`
- Kit da reuniao: `http://127.0.0.1:3001/demo/dados/kit`
- Painel autenticado: `http://127.0.0.1:3001/dados`
- Importador CSV autenticado: `http://127.0.0.1:3001/dados/importar`
- App real autenticado: `http://127.0.0.1:3001/voluntarios`

Esses links locais funcionam apenas na maquina do Raul enquanto o servidor estiver rodando.

Na versao autenticada, o fluxo pos-login deve abrir `/dados` primeiro. A rota `/voluntarios` fica como cadastro e detalhe operacional.

## Melhor caminho para hoje

Se a reuniao for remota ou se o grupo precisa ver sem configurar nada, existem duas opcoes boas:

1. Gravar um video curto navegando pela apresentacao e pela demo.
2. Publicar um preview na Vercel e enviar o link.

## Opcao A - Video curto

Recomendado quando:

- a reuniao e hoje;
- nao ha tempo para configurar Supabase;
- voce quer evitar problemas de login, deploy ou acesso.

Roteiro:

1. Abrir `/demo/dados/apresentacao`.
2. Explicar a tese em 30 segundos.
3. Abrir `/demo/dados`.
4. Mostrar cards, prioridades, distribuicao por area e filtros.
5. Clicar em `Copiar resumo`.
6. Fechar com a frase central.

Duracao ideal: 3 a 5 minutos.

## Opcao B - Preview publico na Vercel

Recomendado quando:

- o grupo precisa clicar e navegar;
- existe repositorio conectado na Vercel;
- a demo publica e suficiente para a conversa.

Cuidados:

- As rotas de demo usam dados ficticios.
- As rotas de demo estao marcadas como `noindex`.
- Nao rodar o seed de demonstracao em producao.
- A URL de preview deve ser apresentada como demo, nao como sistema real.

Rotas para enviar apos publicar:

- `/demo/dados/kit`
- `/demo/dados/apresentacao`
- `/demo/dados`
- `/dados`, apenas se o ambiente de preview estiver com Supabase/auth configurado e acesso restrito

## Opcao C - Demonstracao autenticada com Supabase

Recomendado quando:

- ja existe Supabase de teste configurado;
- ja existe admin em `app_users`;
- a equipe quer ver dados persistidos.

Passos:

1. Aplicar as migrations.
2. Aplicar `supabase/migrations/20260508_0004_volunteer_care_fields.sql`.
3. Rodar `supabase/demo_seed_dados_escalas.sql` apenas no ambiente de teste.
4. Entrar com admin.
5. Abrir `/dados`.
6. Abrir `/dados/importar` para validar a planilha antes de cadastrar ou importar.
7. Abrir `/voluntarios` para validar cadastro e detalhe.

## Checklist antes de compartilhar

1. Confirmar que `npm run build` passa.
2. Confirmar que a rota `/demo/dados/kit` abre.
3. Confirmar que a rota `/demo/dados/apresentacao` abre.
4. Confirmar que a rota `/demo/dados` abre.
5. Se for demonstrar ambiente real, confirmar que `/dados` exige login e carrega os dados corretos.
6. Explicar que os dados da demo sao ficticios.
7. Enviar tambem a mensagem do arquivo `07-mensagem-final-grupo-demo-mvp-dados-escalas.md`.

## Frase para acompanhar o link

Pessoal, deixei uma demo simples do pilar Dados/Escalas. A ideia nao e substituir cuidado pastoral por numeros, mas dar clareza para os lideres enxergarem quem precisa de acompanhamento, onde falta gente e quais decisoes precisam acontecer primeiro.
