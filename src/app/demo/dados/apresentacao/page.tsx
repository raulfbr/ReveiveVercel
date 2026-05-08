import Link from 'next/link'
import type { Metadata } from 'next'

import { CopyTextButton } from '@/components/copy-text-button'

export const metadata: Metadata = {
  title: 'Apresentacao MVP Dados/Escalas - Revive',
  description: 'Apresentacao publica do MVP Dados/Escalas do voluntariado Revive.',
  robots: {
    index: false,
    follow: false,
  },
}

const waves = [
  {
    title: '1. Painel de Cuidado',
    text: 'Comecar com uma leitura simples: sem area, possivel sobrecarga, precisa contato, novos voluntarios e retornos vencidos.',
  },
  {
    title: '2. Acompanhamento',
    text: 'Registrar status de cuidado, ultimo contato, responsavel, proximo passo e proximo retorno.',
  },
  {
    title: '3. Jornada do Voluntario',
    text: 'Acompanhar interessado, primeiro contato, integracao, treinamento, primeira escala, ativo e pausa.',
  },
  {
    title: '4. Escalas com Historico',
    text: 'Evoluir para cultos/eventos, funcoes necessarias, presenca, ausencia, substituicao e carga mensal.',
  },
]

const decisions = [
  'Validar Dados/Escalas como area de clareza e cuidado, nao de cobranca.',
  'Comecar pelo Painel de Cuidado antes de construir escala completa.',
  'Usar os status: novo, ativo, precisa contato, em pausa e inativo.',
  'Adotar um resumo semanal copiavel como pauta para lideranca.',
  'Usar baixa cobertura por area para orientar captacao e redistribuicao.',
]

const groupMessage = [
  'Pessoal, deixei uma proposta simples para o pilar Dados/Escalas.',
  '',
  'A ideia central e que Dados nao sirvam para cobranca, mas para clareza e cuidado.',
  '',
  'O primeiro MVP e um Painel de Cuidado: ele mostra quem esta sem area, quem pode estar sobrecarregado, quem precisa de contato, quais areas tem baixa cobertura e quais prioridades a lideranca deveria decidir primeiro.',
  '',
  'A proposta e comecar pequeno, validar o processo de cuidado e so depois evoluir para escala completa, presenca, historico e indicadores mais maduros.',
  '',
  'Frase central: Dados no Revive existem para que nenhuma pessoa se perca no caminho, nenhum lider caminhe no escuro e nenhum ministerio dependa apenas de improviso.',
].join('\n')

export default function DadosApresentacaoPage() {
  return (
    <main className="app-layout">
      <div className="page-shell">
        <header className="app-header auth-card">
          <div className="app-brand">
            <span className="eyebrow">Revive Dados</span>
            <strong>Apresentacao do MVP</strong>
            <span className="muted">Uma proposta pequena, pratica e evolutiva para Dados/Escalas</span>
          </div>

          <nav className="nav-links">
            <Link className="nav-link" href="/demo/dados">
              Ver demo
            </Link>
            <Link className="nav-link" href="/demo/dados/kit">
              Kit
            </Link>
            <Link className="nav-link" href="/dados">
              Painel real
            </Link>
            <Link className="nav-link active" href="/demo/dados/apresentacao">
              Apresentacao
            </Link>
          </nav>
        </header>

        <div className="main-content presentation-flow">
          <section className="presentation-hero">
            <span className="eyebrow">Tese</span>
            <h1>Dados existem para cuidar melhor, nao para cobrar mais.</h1>
            <p>
              O primeiro MVP nao tenta resolver toda a escala da igreja. Ele resolve uma dor anterior: dar clareza
              sobre quem esta servindo, quem precisa de cuidado, onde falta gente e qual decisao precisa acontecer.
            </p>
          </section>

          <section className="presentation-grid">
            <article className="presentation-card">
              <span className="eyebrow">Dor atual</span>
              <h2>Informacao espalhada vira improviso.</h2>
              <p>
                Quando os dados ficam em memoria, grupos e planilhas soltas, pessoas novas podem ficar sem proximo
                passo, voluntarios podem se sobrecarregar e lideres decidem sem visao completa.
              </p>
            </article>

            <article className="presentation-card">
              <span className="eyebrow">Primeira entrega</span>
              <h2>Painel de Cuidado.</h2>
              <p>
                Cards, prioridades semanais, distribuicao por area, filtros de cuidado, WhatsApp e resumo copiavel para
                transformar dados em pauta de lideranca.
              </p>
            </article>
          </section>

          <section className="panel">
            <div className="stack">
              <span className="eyebrow">O que o MVP responde</span>
              <h2 className="panel-title">Perguntas que viram acao</h2>
            </div>

            <div className="question-grid">
              <span>Quem esta sem area?</span>
              <span>Quem precisa de contato?</span>
              <span>Quem pode estar sobrecarregado?</span>
              <span>Quais areas precisam de captacao?</span>
              <span>Quem entrou recentemente?</span>
              <span>O que devemos decidir primeiro?</span>
            </div>
          </section>

          <section className="panel">
            <div className="stack">
              <span className="eyebrow">Evolucao</span>
              <h2 className="panel-title">Ondas de entrega</h2>
            </div>

            <div className="timeline-grid">
              {waves.map((wave) => (
                <article className="timeline-card" key={wave.title}>
                  <strong>{wave.title}</strong>
                  <span className="muted">{wave.text}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="stack">
              <span className="eyebrow">Decisoes para hoje</span>
              <h2 className="panel-title">O que o time precisa aprovar</h2>
            </div>

            <div className="decision-list">
              {decisions.map((decision, index) => (
                <article className="decision-item" key={decision}>
                  <span>{index + 1}</span>
                  <strong>{decision}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="toolbar">
              <div className="stack">
                <span className="eyebrow">Mensagem pronta</span>
                <h2 className="panel-title">Texto para enviar junto com a demo</h2>
                <p className="muted">Use este texto para contextualizar a proposta no grupo.</p>
              </div>
              <CopyTextButton text={groupMessage} />
            </div>
            <pre className="copy-block">{groupMessage}</pre>
          </section>

          <section className="presentation-close">
            <span className="eyebrow">Frase final</span>
            <p>
              Dados no Revive existem para que nenhuma pessoa se perca no caminho, nenhum lider caminhe no escuro e
              nenhum ministerio dependa apenas de improviso.
            </p>
            <Link className="button" href="/demo/dados">
              Abrir demo do painel
            </Link>
            <Link className="button-secondary" href="/dados">
              Abrir painel autenticado
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
