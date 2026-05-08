import Link from 'next/link'

import { CopyTextButton } from '@/components/copy-text-button'
import { getServiceAreas, getVolunteers } from '@/lib/volunteers/data'
import { getAreaDistribution, getWhatsappHref } from '@/lib/volunteers/insights'

export const dynamic = 'force-dynamic'

function getPriorityLabel(level: string) {
  if (level === 'critical') {
    return {
      className: 'badge-danger',
      label: 'Alta',
    }
  }

  if (level === 'low') {
    return {
      className: 'badge-warning',
      label: 'Media',
    }
  }

  return {
    className: 'badge',
    label: 'Baixa',
  }
}

function getCaptacaoSummary({
  lowCoverageCount,
  unassignedCount,
  criticalAreas,
}: {
  criticalAreas: string[]
  lowCoverageCount: number
  unassignedCount: number
}) {
  return [
    'Resumo Captacao - Dados/Escalas',
    '',
    `Areas com baixa cobertura: ${lowCoverageCount}`,
    `Pessoas ativas sem area: ${unassignedCount}`,
    '',
    'Areas prioritarias:',
    ...(criticalAreas.length > 0 ? criticalAreas.map((area, index) => `${index + 1}. ${area}`) : ['Nenhuma area critica encontrada.']),
    '',
    'Acao sugerida:',
    '1. Conversar com lideres das areas prioritarias.',
    '2. Revisar pessoas sem area antes de captar novas.',
    '3. Definir uma chamada especifica para as areas com maior necessidade.',
  ].join('\n')
}

export default async function DadosCaptacaoPage() {
  const [serviceAreas, volunteers] = await Promise.all([
    getServiceAreas(),
    getVolunteers({ status: 'all' }),
  ])
  const activeVolunteers = volunteers.filter((volunteer) => volunteer.active)
  const unassignedVolunteers = activeVolunteers.filter((volunteer) => volunteer.areas.length === 0)
  const areaDistribution = getAreaDistribution(activeVolunteers, serviceAreas)
  const lowCoverageAreas = areaDistribution.filter((area) => area.level !== 'healthy')
  const criticalAreas = lowCoverageAreas.map((area) => area.areaName)
  const overloadedSignals = areaDistribution.reduce((sum, area) => sum + area.overloadedCount, 0)
  const summary = getCaptacaoSummary({
    criticalAreas,
    lowCoverageCount: lowCoverageAreas.length,
    unassignedCount: unassignedVolunteers.length,
  })

  return (
    <div className="section-grid">
      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Dados/Escalas</span>
            <h1 className="panel-title">Captacao orientada por dados</h1>
            <p className="muted">
              Uma visao para decidir onde captar, onde redistribuir e quais pessoas sem area precisam de encaminhamento.
            </p>
          </div>
          <div className="nav-links">
            <CopyTextButton text={summary} />
            <Link className="button-secondary" href="/dados/mapa">
              Mapa Vivo
            </Link>
            <Link className="button-secondary" href="/dados">
              Painel
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="muted">Areas ativas</span>
          <div className="stat-value">{serviceAreas.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Baixa cobertura</span>
          <div className="stat-value">{lowCoverageAreas.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Sem area</span>
          <div className="stat-value">{unassignedVolunteers.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Sinais de sobrecarga</span>
          <div className="stat-value">{overloadedSignals}</div>
        </article>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Prioridade de captacao</span>
            <h2 className="panel-title">Onde precisamos reforcar primeiro?</h2>
            <p className="muted">
              Antes de chamar novas pessoas, revise tambem quem ja esta ativo e ainda nao tem area.
            </p>
          </div>
        </div>

        <div className="area-grid">
          {areaDistribution.map((area) => {
            const priority = getPriorityLabel(area.level)

            return (
              <article className="area-card" key={area.areaId}>
                <div className="toolbar compact-toolbar">
                  <strong>{area.areaName}</strong>
                  <span className={priority.className}>{priority.label}</span>
                </div>
                <div className="stat-value">{area.volunteerCount}</div>
                <span className="muted">{area.label}</span>
                <span className="muted">
                  {area.overloadedCount > 0
                    ? `${area.overloadedCount} pessoa(s) tambem aparecem em possivel sobrecarga`
                    : 'Sem sinal de sobrecarga nesta area'}
                </span>
              </article>
            )
          })}
        </div>
      </section>

      <section className="panel table-wrapper">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Redistribuicao antes de captacao</span>
            <h2 className="panel-title">Pessoas ativas sem area</h2>
            <p className="muted">
              Essas pessoas podem ser acolhidas ou direcionadas antes de uma campanha externa.
            </p>
          </div>
        </div>

        {unassignedVolunteers.length === 0 ? (
          <div className="empty-state">Nenhum voluntario ativo sem area encontrado.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Voluntario</th>
                <th>Status</th>
                <th>Proximo passo</th>
                <th>Contato</th>
                <th>Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {unassignedVolunteers.map((volunteer) => {
                const whatsappHref = getWhatsappHref(volunteer.whatsapp)

                return (
                  <tr key={volunteer.id}>
                    <td>
                      <strong>{volunteer.name}</strong>
                    </td>
                    <td>{volunteer.careStatus}</td>
                    <td>{volunteer.nextStep || 'Definir area de interesse'}</td>
                    <td>
                      {whatsappHref ? (
                        <a className="inline-link" href={whatsappHref} rel="noreferrer" target="_blank">
                          WhatsApp
                        </a>
                      ) : (
                        <span className="muted">Nao informado</span>
                      )}
                    </td>
                    <td>
                      <Link className="inline-link" href={`/voluntarios/${volunteer.id}`}>
                        Abrir
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
