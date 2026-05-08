import Link from 'next/link'
import type { Metadata } from 'next'

import { CopyTextButton } from '@/components/copy-text-button'

export const metadata: Metadata = {
  title: 'Kit da Reuniao - Dados/Escalas Revive',
  description: 'Pacote de apoio para discutir o MVP Dados/Escalas do voluntariado Revive.',
  robots: {
    follow: false,
    index: false,
  },
}

const groupMessage = `Pessoal, como nao vou conseguir participar da reuniao, deixei organizada uma proposta inicial para o pilar Dados/Escalas.

Minha recomendacao e comecarmos pequeno e pratico: antes de criar uma escala completa, validar um Painel de Cuidado.

Esse painel ajuda a enxergar quem esta ativo, quem esta sem area, quem precisa de contato, quem entrou recentemente, quais areas estao com baixa cobertura e quais proximos passos precisam acontecer nesta semana.

Frase central: Dados no Revive nao devem servir para cobranca, mas para clareza e cuidado.

Links:
- Kit da reuniao: /demo/dados/kit
- Apresentacao: /demo/dados/apresentacao
- Demo do painel: /demo/dados
- Painel real autenticado: /dados, se o ambiente com Supabase/auth estiver configurado

O que eu sugeriria decidir hoje:
1. Faz sentido comecar por Painel de Cuidado antes de escala completa?
2. Os status novo, ativo, precisa contato, em pausa e inativo fazem sentido?
3. Quem deve atualizar esses dados?
4. Quem pode visualizar o painel?
5. O resumo semanal copiavel pode virar pauta de lideranca?
6. Qual sera o primeiro piloto?`

const links = [
  {
    description: 'Pagina principal para a reuniao, com mensagem, decisoes e roteiro.',
    href: '/demo/dados/kit',
    label: 'Kit da reuniao',
  },
  {
    description: 'Explica a tese, a dor, as ondas e as decisoes a aprovar.',
    href: '/demo/dados/apresentacao',
    label: 'Apresentacao',
  },
  {
    description: 'Mostra o Painel de Cuidado com dados ficticios e seguros.',
    href: '/demo/dados',
    label: 'Demo publica',
  },
  {
    description: 'Versao real com login, Supabase e dados persistidos.',
    href: '/dados',
    label: 'Painel autenticado',
  },
  {
    description: 'Valida planilhas CSV antes de qualquer gravacao no banco.',
    href: '/dados/importar',
    label: 'Importador CSV',
  },
]

const decisions = [
  'Validar o Painel de Cuidado como primeiro MVP de Dados/Escalas.',
  'Aprovar os status: novo, ativo, precisa contato, em pausa e inativo.',
  'Definir quem pode visualizar o painel autenticado.',
  'Definir quem atualiza status, proximo passo e responsavel de cuidado.',
  'Escolher uma area piloto para a primeira semana.',
  'Usar o resumo semanal como pauta de lideranca.',
]

const meetingFlow = [
  'Ler a mensagem curta do Raul.',
  'Abrir o kit em /demo/dados/kit.',
  'Abrir a apresentacao em /demo/dados/apresentacao.',
  'Abrir a demo publica em /demo/dados.',
  'Mostrar cards, prioridades, distribuicao por area e resumo copiavel.',
  'Se o ambiente real estiver pronto, abrir /dados.',
  'Registrar decisoes, responsaveis e prazos.',
]

const objections = [
  {
    answer:
      'Nao. O painel deve ser usado para abrir conversa e cuidado, nao para expor, ranquear ou constranger voluntarios.',
    question: 'Isso pode virar cobranca?',
  },
  {
    answer:
      'Porque uma escala automatica depende de uma base confiavel. Primeiro precisamos saber quem esta ativo, sem area, em pausa ou precisando de contato.',
    question: 'Por que nao comecar direto pela escala?',
  },
  {
    answer:
      'Semanalmente, com uma rotina simples: olhar prioridades, copiar resumo, definir responsaveis e acompanhar proximos passos.',
    question: 'Como manter os dados atualizados?',
  },
]

const pilotSteps = [
  'Escolher uma ou duas areas piloto.',
  'Preencher uma base pequena com status de cuidado.',
  'Definir proximo passo e responsavel para quem precisa de contato.',
  'Abrir /dados e revisar prioridades da semana.',
  'Copiar o resumo semanal para pauta de lideranca.',
  'Ajustar campos e rotina depois do primeiro uso real.',
]

const governanceItems = [
  {
    description: 'Consolida a base, revisa inconsistencias e gera o resumo semanal.',
    title: 'Dados/Escalas',
  },
  {
    description: 'Informam entradas, pausas, necessidades de contato e baixa cobertura.',
    title: 'Lideres de area',
  },
  {
    description: 'Decide prioridade, area piloto, acessos e proximos passos da rotina.',
    title: 'Coordenacao',
  },
  {
    description: 'Acompanha pessoas novas, sem area ou precisando contato.',
    title: 'Cuidado/Integracao',
  },
]

const privacyRules = [
  'Demo publica usa apenas dados ficticios.',
  'Dados reais ficam somente em rotas autenticadas.',
  'Coletar apenas dados necessarios para cuidado e organizacao.',
  'Evitar observacoes sensiveis, julgamentos ou detalhes pastorais privados.',
  'Compartilhar planilhas e prints apenas com pessoas autorizadas.',
]

const sevenDayPlan = [
  'Dia 0: aprovar area piloto, dono do piloto, acesso e data da revisao.',
  'Dia 1: preparar uma base pequena com dados minimos.',
  'Dia 2: revisar qualidade, status e privacidade da base.',
  'Dia 3: cadastrar ou importar dados e abrir /dados.',
  'Dia 4: conduzir primeira leitura com lideranca.',
  'Dia 5: executar contatos e atualizar proximos passos.',
  'Dia 6: coletar feedback da rotina.',
  'Dia 7: decidir continuar, ajustar, expandir ou pausar.',
]

const metricItems = [
  {
    description: 'Mostra o tamanho da base viva que precisa ser acompanhada.',
    title: 'Voluntarios ativos',
  },
  {
    description: 'Aponta pessoas que precisam de integracao ou alocacao.',
    title: 'Sem area',
  },
  {
    description: 'Indica quem precisa de conversa, cuidado ou decisao.',
    title: 'Precisa contato',
  },
  {
    description: 'Ajuda a garantir que toda prioridade tenha acao, dono e prazo.',
    title: 'Proximos passos',
  },
]

const areaInterfaces = [
  {
    description: 'Recebe baixa cobertura e devolve prioridade de onde captar primeiro.',
    title: 'Captacao',
  },
  {
    description: 'Mostra novos voluntarios, pessoas sem area e proximos passos.',
    title: 'Integracao',
  },
  {
    description: 'Aponta quem precisa de conversa sem expor detalhes sensiveis.',
    title: 'Cuidado',
  },
  {
    description: 'Entrega scorecard semanal, riscos e decisoes pendentes.',
    title: 'Coordenacao',
  },
]

const roadmapItems = [
  {
    description: 'Provar valor com piloto pequeno, resumo semanal e proximos passos.',
    title: '0-30 dias',
  },
  {
    description: 'Consolidar rotina, governanca, qualidade da base e conexao com areas.',
    title: '31-60 dias',
  },
  {
    description: 'Preparar disponibilidade, cobertura minima e regras para escala futura.',
    title: '61-90 dias',
  },
  {
    description: 'Evoluir para escala apoiada por dados confiaveis, nao por improviso.',
    title: 'Depois de 90 dias',
  },
]

export default function DadosMeetingKitPage() {
  return (
    <main className="demo-shell">
      <div className="demo-container">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">R</span>
            <div className="brand-copy">
              <span className="eyebrow">Revive Dados</span>
              <strong>Kit da Reuniao</strong>
              <span className="muted">Pacote pratico para decidir e executar</span>
            </div>
          </div>

          <nav className="nav-links">
            <Link className="nav-link active" href="/demo/dados/kit">
              Kit
            </Link>
            <Link className="nav-link" href="/demo/dados/apresentacao">
              Apresentacao
            </Link>
            <Link className="nav-link" href="/demo/dados">
              Demo
            </Link>
            <Link className="nav-link" href="/dados">
              Painel real
            </Link>
          </nav>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Para enviar antes da reuniao</span>
            <h1>Uma pagina para o grupo entender, discutir e decidir.</h1>
            <p>
              A proposta e simples: comecar Dados/Escalas pelo Painel de Cuidado,
              antes de tentar automatizar toda a escala. Primeiro organizamos a base
              de pessoas, depois evoluimos para processos mais complexos.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/demo/dados/apresentacao">
                Abrir apresentacao
              </Link>
              <Link className="button-secondary" href="/demo/dados">
                Ver demo
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <span className="eyebrow">Frase central</span>
            <p className="quote">
              Dados no Revive existem para que nenhuma pessoa se perca no caminho,
              nenhum lider caminhe no escuro e nenhum ministerio dependa apenas de
              improviso.
            </p>
          </div>
        </section>

        <section className="section-grid">
          <div className="panel accent-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Decisao recomendada</span>
                <h2 className="panel-title">Aprovar o Painel de Cuidado como primeiro MVP</h2>
                <p className="muted">
                  A escala completa deve vir depois que a base de pessoas estiver
                  minimamente confiavel. Primeiro, precisamos enxergar quem esta ativo,
                  quem esta sem area e quem precisa de acompanhamento.
                </p>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Piloto de 7 dias</span>
                <h2 className="panel-title">Menor teste util</h2>
              </div>
            </div>
            <ol className="numbered-list">
              {pilotSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Roadmap</span>
              <h2 className="panel-title">Comecar pequeno sem pensar pequeno</h2>
              <p className="muted">
                A escala completa entra melhor quando a base de pessoas, a rotina de
                cuidado e a governanca estiverem funcionando.
              </p>
            </div>
          </div>
          <div className="cards-grid compact">
            {roadmapItems.map((item) => (
              <article className="metric-card" key={item.title}>
                <span className="metric-label">{item.title}</span>
                <p className="muted">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Integracao entre areas</span>
              <h2 className="panel-title">Dados/Escalas como area de servico</h2>
              <p className="muted">
                A funcao de Dados nao e controlar as outras frentes, mas organizar
                sinais e devolver clareza para Captacao, Integracao, Cuidado e
                Coordenacao.
              </p>
            </div>
          </div>
          <div className="cards-grid compact">
            {areaInterfaces.map((item) => (
              <article className="metric-card" key={item.title}>
                <span className="metric-label">{item.title}</span>
                <p className="muted">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Metricas saudaveis</span>
              <h2 className="panel-title">Medir para cuidar, nao para ranquear</h2>
              <p className="muted">
                O painel deve acompanhar sinais que geram acao pastoral e operacional,
                evitando comparacoes publicas ou indicadores de cobranca.
              </p>
            </div>
          </div>
          <div className="cards-grid compact">
            {metricItems.map((item) => (
              <article className="metric-card" key={item.title}>
                <span className="metric-label">{item.title}</span>
                <p className="muted">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Piloto guiado</span>
              <h2 className="panel-title">Plano de 7 dias para provar valor</h2>
              <p className="muted">
                O primeiro ciclo deve ser pequeno o bastante para executar e claro o
                bastante para decidir se continua, ajusta ou expande.
              </p>
            </div>
          </div>
          <ol className="numbered-list">
            {sevenDayPlan.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Privacidade</span>
              <h2 className="panel-title">Dados tambem sao cuidado</h2>
              <p className="muted">
                O MVP deve nascer com limites claros: minimo necessario, acesso
                restrito, demo ficticia e nenhuma exposicao de informacoes sensiveis.
              </p>
            </div>
          </div>
          <ul className="bullet-list">
            {privacyRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Governanca leve</span>
              <h2 className="panel-title">Quem faz o painel continuar vivo</h2>
              <p className="muted">
                O MVP precisa de rotina, nao de burocracia. A reuniao deve sair com
                responsaveis claros para informar, atualizar, decidir e acompanhar.
              </p>
            </div>
          </div>
          <div className="cards-grid compact">
            {governanceItems.map((item) => (
              <article className="metric-card" key={item.title}>
                <span className="metric-label">{item.title}</span>
                <p className="muted">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Mensagem pronta</span>
              <h2 className="panel-title">Texto para mandar no grupo</h2>
              <p className="muted">
                Copie e envie como contribuicao do Raul para orientar a conversa.
              </p>
            </div>
            <CopyTextButton text={groupMessage} />
          </div>
          <pre className="copy-block">{groupMessage}</pre>
        </section>

        <section className="section-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Links</span>
                <h2 className="panel-title">Ordem recomendada</h2>
              </div>
            </div>
            <div className="stack">
              {links.map((item) => (
                <Link className="list-card" href={item.href} key={item.href}>
                  <strong>{item.label}</strong>
                  <span className="muted">{item.description}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Decisoes</span>
                <h2 className="panel-title">O que precisa sair da reuniao</h2>
              </div>
            </div>
            <ol className="numbered-list">
              {decisions.map((decision) => (
                <li key={decision}>{decision}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Conducao</span>
                <h2 className="panel-title">Roteiro de 10 minutos</h2>
              </div>
            </div>
            <ol className="numbered-list">
              {meetingFlow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">FAQ rapido</span>
                <h2 className="panel-title">Objecoes provaveis</h2>
              </div>
            </div>
            <div className="stack">
              {objections.map((item) => (
                <article className="list-card" key={item.question}>
                  <strong>{item.question}</strong>
                  <span className="muted">{item.answer}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="panel accent-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Fechamento</span>
              <h2 className="panel-title">Melhor proxima acao</h2>
              <p className="muted">
                Aprovar um piloto pequeno de uma semana com uma ou duas areas, usando
                dados minimos, acesso restrito e uma rotina semanal de revisao.
              </p>
            </div>
            <Link className="button" href="/dados">
              Abrir painel autenticado
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
