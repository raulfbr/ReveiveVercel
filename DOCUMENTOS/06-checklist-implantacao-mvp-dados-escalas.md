# 06 - Checklist de Implantacao do MVP Dados/Escalas

Data e hora: 08/05/2026 11:20
Projeto: Revive - Ministerio de Voluntariado
Objetivo: sair da demo publica para uma demonstracao autenticada com dados de teste.

## Caminho recomendado

1. Usar `/demo/dados` para apresentar a ideia sem depender de Supabase.
2. Aplicar a migration de cuidado no Supabase de teste.
3. Rodar o seed de demonstracao.
4. Entrar no painel autenticado em `/dados`.
5. Abrir `/voluntarios` para validar cadastro e detalhe.
6. Mostrar que a mesma logica funciona com dados persistidos.

## Arquivos envolvidos

- Migration: `supabase/migrations/20260508_0004_volunteer_care_fields.sql`
- Seed de demo: `supabase/demo_seed_dados_escalas.sql`
- Demo publica: `/demo/dados`
- Painel autenticado: `/dados`
- App real: `/voluntarios`

## Ordem de execucao no Supabase

1. Aplicar migrations existentes.
2. Aplicar `20260508_0004_volunteer_care_fields.sql`.
3. Executar `supabase/demo_seed_dados_escalas.sql` somente em ambiente de teste.
4. Garantir que existe um usuario `admin` em `app_users`.
5. Fazer login com esse admin.

## O que validar na tela real

- Cards de cuidado aparecem no topo.
- Voluntarios ficticios aparecem na listagem.
- Existe pelo menos uma pessoa sem area.
- Existe pelo menos uma pessoa em possivel sobrecarga.
- Existe pelo menos uma pessoa marcada como precisa contato.
- Existem prioridades da semana.
- O resumo semanal pode ser copiado.
- O detalhe do voluntario mostra ultimo contato, proximo retorno, responsavel e proximo passo.

## Observacao importante

O seed de demonstracao e intencionalmente separado do `supabase/seed.sql`. Ele nao deve ser rodado em producao.

As rotas `/demo/dados` e `/demo/dados/apresentacao` usam dados ficticios e foram marcadas como `noindex`. Mesmo assim, se o projeto for publicado em URL compartilhavel, elas devem ser apresentadas como demo e nao como area operacional real.

## Frase para explicar a implantacao

Primeiro mostramos a ideia com dados ficticios em `/demo/dados`. Depois aplicamos a mesma logica no app real, usando Supabase, para provar que o MVP ja pode virar processo semanal de cuidado.
