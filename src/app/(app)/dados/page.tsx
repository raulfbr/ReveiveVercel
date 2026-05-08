import Link from 'next/link'

import { CopyTextButton } from '@/components/copy-text-button'
import { getServiceAreas, getVolunteers } from '@/lib/volunteers/data'
import {
  attentionFilterOptions,
  filterVolunteersByAttention,
  getAreaDistribution,
  getAreaLoadStatus,
  getVolunteerAttentionLabels,
  getVolunteerInsights,
  getWhatsappHref,
  getWeeklyActionItems,
  parseAttentionFilter,
} from '@/lib/volunteers/insights'

type DadosPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const dynamic = 'force-dynamic'

function getSingleSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

function getFilterHref(filter: string) {
  return filter === 'all' ? '/dados' : `/dados?attention=${filter}`
}

export default async function DadosPage({ searchParams }: DadosPageProps) {
  const params = await searchParams
  const attentionFilter = parseAttentionFilter(getSingleSearchParam(params.attention))
  const [serviceAreas, baseVolunteers] = await Promise.all([
    getServiceAreas(),
    getVolunteers({ status: 'active' }),
  ])
  const volunteers = filterVolunteersByAttention(baseVolunteers, attentionFilter)
  const insights = getVolunteerInsights(baseVolunteers)
  const areaDistribution = getAreaDistribution(baseVolunteers, serviceAreas)
  const weeklyActionItems = getWeeklyActionItems(insights, areaDistribution)
  const attentionCount = insights.attention.length + insights.overloaded.length
  const lowCoverageCount = areaDistribution.filter((area) => area.level !== 'healthy').length
  const weeklySummary = [
    'Resumo Dados/Escalas - Semana',
    '',
    `1. Novos voluntarios sem proximo passo consolidado: ${insights.newVolunteers.length}`,
    `2. Pessoas sem area: ${insights.unassigned.length}`,
    `3. Pessoas servindo em muitas areas: ${attentionCount}`,
    `4. Pessoas que precisam contato: ${insights.needsContact.length}`,
    `5. Retornos vencidos: ${insights.followUpDue.length}`,
    `6. Areas com baixa cobertura: ${lowCoverageCount}`,
    '',
    'Prioridades sugeridas:',
    ...weeklyActionItems.map((item, index) => `${index + 1}. [${item.priority}] ${item.title} - ${item.description}`),
    '',
    'Decisao sugerida: conversar primeiro com quem esta sem area, com retorno vencido, em possivel sobrecarga ou em area com baixa cobertura.',
  ].join('\n')

  return (
    <div className="section-grid">
      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Dados/Escalas</span>
            <h1 className="panel-title">Painel de Cuidado</h1>
            <p className="muted">
              Uma leitura semanal para orientar cuidado, captacao e decisoes com menos improviso.
            </p>
          </div>
          <div className="nav-links">
            <Link className="button-secondary" href="/dados/integracao">
              Integracao
            </Link>
            <Link className="button-secondary" href="/dados/treinamento">
              Treinamento
            </Link>
            <Link className="button-secondary" href="/dados/cuidado">
              Cuidado
            </Link>
            <Link className="button-secondary" href="/dados/captacao">
              Captacao
            </Link>
            <Link className="button-secondary" href="/dados/jornada">
              Jornada
            </Link>
            <Link className="button-secondary" href="/dados/mapa">
              Mapa Vivo
            </Link>
            <Link className="button-secondary" href="/dados/qualidade">
              Qualidade da base
            </Link>
            <Link className="button-secondary" href="/dados/importar">
              Importar CSV
            </Link>
            <Link className="button-secondary" href="/voluntarios">
              Ver cadastro completo
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="muted">Voluntarios ativos</span>
          <div className="stat-value">{insights.activeVolunteers.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Sem area</span>
          <div className="stat-value">{insights.unassigned.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Atencao/sobrecarga</span>
          <div className="stat-value">{attentionCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Precisa contato</span>
          <div className="stat-value">{insights.needsContact.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Retornos vencidos</span>
          <div className="stat-value">{insights.followUpDue.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Areas baixa cobertura</span>
          <div className="stat-value">{lowCoverageCount}</div>
        </article>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Filtros</span>
            <h2 className="panel-title">Ver por leitura de cuidado</h2>
          </div>
        </div>

        <div className="filter-pills">
          {attentionFilterOptions.map((option) => (
            <Link
              className={option.value === attentionFilter ? 'filter-pill active' : 'filter-pill'}
              href={getFilterHref(option.value)}
              key={option.value}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Prioridades da semana</span>
            <h2 className="panel-title">O que a lideranca deveria decidir primeiro?</h2>
            <p className="muted">Sugestoes geradas a partir dos sinais atuais do painel.</p>
          </div>
        </div>

        <div className="priority-grid">
          {weeklyActionItems.length > 0 ? (
            weeklyActionItems.map((item) => (
              <article className="priority-card" key={item.title}>
                <span className={item.priority === 'Alta' ? 'badge-danger' : item.priority === 'Media' ? 'badge-warning' : 'badge'}>
                  {item.priority}
                </span>
                <strong>{item.title}</strong>
                <span className="muted">{item.description}</span>
              </article>
            ))
          ) : (
            <div className="empty-state">Nenhuma prioridade automatica encontrada.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Distribuicao por area</span>
            <h2 className="panel-title">Onde precisamos captar ou redistribuir?</h2>
            <p className="muted">Leitura por quantidade de voluntarios ativos vinculados a cada area.</p>
          </div>
        </div>

        <div className="area-grid">
          {areaDistribution.map((area) => (
            <article className="area-card" key={area.areaId}>
              <div className="toolbar compact-toolbar">
                <strong>{area.areaName}</strong>
                <span className={area.level === 'healthy' ? 'badge' : 'badge-warning'}>{area.label}</span>
              </div>
              <div className="stat-value">{area.volunteerCount}</div>
              <span className="muted">
                {area.overloadedCount > 0
                  ? `${area.overloadedCount} tambem aparecem em possivel sobrecarga`
                  : 'Sem sinal de sobrecarga nessa area'}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Resumo semanal</span>
            <h2 className="panel-title">Texto pronto para lideranca</h2>
            <p className="muted">Copie para levar a pauta da semana ao grupo de lideranca.</p>
          </div>
          <CopyTextButton text={weeklySummary} />
        </div>
        <pre className="copy-block">{weeklySummary}</pre>
      </section>

      <section className="panel table-wrapper">
        {volunteers.length === 0 ? (
          <div className="empty-state">Nenhum voluntario encontrado para o filtro atual.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Voluntario</th>
                <th>Cuidado</th>
                <th>Proximo passo</th>
                <th>Areas</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => {
                const loadStatus = getAreaLoadStatus(volunteer)
                const attentionLabels = getVolunteerAttentionLabels(volunteer)
                const whatsappHref = getWhatsappHref(volunteer.whatsapp)

                return (
                  <tr key={volunteer.id}>
                    <td>
                      <div className="stack">
                        <Link href={`/voluntarios/${volunteer.id}`}>
                          <strong>{volunteer.name}</strong>
                        </Link>
                        {whatsappHref ? (
                          <a className="inline-link" href={whatsappHref} rel="noreferrer" target="_blank">
                            Chamar no WhatsApp
                          </a>
                        ) : (
                          <span className="muted">WhatsApp nao informado</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="stack">
                        <span className={loadStatus.className}>{loadStatus.label}</span>
                        <span className="muted">
                          {attentionLabels.length > 0 ? attentionLabels.join(' / ') : 'Sem alerta adicional'}
                        </span>
                      </div>
                    </td>
                    <td>{volunteer.nextStep || 'Sem proximo passo registrado.'}</td>
                    <td>
                      <div className="stack">
                        {volunteer.areas.length > 0 ? (
                          volunteer.areas.map((area) => (
                            <span className="muted" key={`${volunteer.id}-${area.areaId}`}>
                              {area.areaName}
                            </span>
                          ))
                        ) : (
                          <span className="muted">Sem area vinculada</span>
                        )}
                      </div>
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
