import Link from 'next/link'

import { CopyTextButton } from '@/components/copy-text-button'
import { requireAppUser } from '@/lib/auth/current-user'
import { formatAreaRole, formatAvailabilityStatus, formatCareStatus, formatDate } from '@/lib/format'
import { getServiceAreas, getVolunteers } from '@/lib/volunteers/data'
import {
  attentionFilterOptions,
  filterVolunteersByAttention,
  getAreaLoadStatus,
  getAreaDistribution,
  getVolunteerAttentionLabels,
  getVolunteerInsights,
  getWhatsappHref,
  getWeeklyActionItems,
  parseAttentionFilter,
} from '@/lib/volunteers/insights'

type VolunteersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const dynamic = 'force-dynamic'

function getSingleSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

function getSuccessMessage(saved: string | null) {
  switch (saved) {
    case 'created':
      return 'Voluntario criado com sucesso.'
    case 'updated':
      return 'Voluntario atualizado com sucesso.'
    case 'deactivated':
      return 'Voluntario inativado.'
    case 'reactivated':
      return 'Voluntario reativado.'
    default:
      return null
  }
}

export default async function VolunteersPage({ searchParams }: VolunteersPageProps) {
  const appUser = await requireAppUser()
  const params = await searchParams
  const areaId = getSingleSearchParam(params.area)
  const status = (getSingleSearchParam(params.status) as 'active' | 'inactive' | 'all' | null) ?? 'active'
  const attentionFilter = parseAttentionFilter(getSingleSearchParam(params.attention))
  const errorMessage = getSingleSearchParam(params.error)
  const successMessage = getSuccessMessage(getSingleSearchParam(params.saved))

  const [serviceAreas, baseVolunteers] = await Promise.all([getServiceAreas(), getVolunteers({ areaId, status })])
  const volunteers = filterVolunteersByAttention(baseVolunteers, attentionFilter)
  const insights = getVolunteerInsights(baseVolunteers)
  const areaDistribution = getAreaDistribution(baseVolunteers, serviceAreas)
  const weeklyActionItems = getWeeklyActionItems(insights, areaDistribution)

  const activeCount = volunteers.filter((volunteer) => volunteer.active).length
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
      <section className="stats-grid">
        <article className="stat-card">
          <span className="muted">Voluntarios visiveis</span>
          <div className="stat-value">{volunteers.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Ativos no filtro</span>
          <div className="stat-value">{activeCount}</div>
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
          <span className="muted">Novos 30 dias</span>
          <div className="stat-value">{insights.newVolunteers.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Aniversariantes</span>
          <div className="stat-value">{insights.birthdaysThisMonth.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Precisa contato</span>
          <div className="stat-value">{insights.needsContact.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Areas baixa cobertura</span>
          <div className="stat-value">{lowCoverageCount}</div>
        </article>
      </section>

      {errorMessage ? <p className="error-message">{decodeURIComponent(errorMessage)}</p> : null}
      {successMessage ? <p className="success-message">{successMessage}</p> : null}

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Dados/Escalas</span>
            <h1 className="panel-title">Painel de cuidado</h1>
            <p className="muted">
              Leitura simples para enxergar sem area, novos, aniversariantes e possiveis sobrecargas.
            </p>
          </div>

          {appUser.role === 'admin' ? (
            <Link className="button" href="/voluntarios/novo">
              Novo voluntario
            </Link>
          ) : null}
        </div>

        <form className="filters-form" method="get">
          <div className="field">
            <label htmlFor="area">Area</label>
            <select className="select" defaultValue={areaId ?? ''} id="area" name="area">
              <option value="">Todas as areas</option>
              {serviceAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="status">Status</label>
            <select className="select" defaultValue={status} id="status" name="status">
              <option value="active">Somente ativos</option>
              <option value="inactive">Somente inativos</option>
              <option value="all">Todos</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="attention">Leitura de cuidado</label>
            <select className="select" defaultValue={attentionFilter} id="attention" name="attention">
              {attentionFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="actions-row">
            <button className="button-secondary" type="submit">
              Aplicar filtros
            </button>
            <Link className="button-secondary" href="/voluntarios">
              Limpar
            </Link>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Resumo semanal</span>
            <h2 className="panel-title">Pauta de cuidado para lideranca</h2>
            <p className="muted">Use estes sinais como abertura de conversa, nao como cobranca automatica.</p>
          </div>
        </div>

        <div className="summary-grid">
          <article className="summary-card">
            <strong>Novos sem acompanhamento inicial</strong>
            <span className="muted">{insights.newVolunteers.length} voluntarios nos ultimos 30 dias</span>
          </article>
          <article className="summary-card">
            <strong>Precisa contato</strong>
            <span className="muted">{insights.needsContact.length} marcados para conversa ou cuidado</span>
          </article>
          <article className="summary-card">
            <strong>Pessoas sem area</strong>
            <span className="muted">{insights.unassigned.length} precisam de integracao operacional</span>
          </article>
          <article className="summary-card">
            <strong>Possivel excesso de carga</strong>
            <span className="muted">{attentionCount} servem em 3 ou mais areas</span>
          </article>
          <article className="summary-card">
            <strong>Aniversariantes do mes</strong>
            <span className="muted">{insights.birthdaysThisMonth.length} oportunidades de cuidado e celebracao</span>
          </article>
          <article className="summary-card">
            <strong>Retornos vencidos</strong>
            <span className="muted">{insights.followUpDue.length} proximos passos precisam ser retomados</span>
          </article>
          <article className="summary-card">
            <strong>Areas com baixa cobertura</strong>
            <span className="muted">{lowCoverageCount} precisam de captacao ou redistribuicao</span>
          </article>
        </div>

        <div className="copy-panel">
          <div className="toolbar">
            <div className="stack">
              <strong>Resumo pronto para compartilhar</strong>
              <span className="muted">Copie para levar a pauta da semana ao grupo de lideranca.</span>
            </div>
            <CopyTextButton text={weeklySummary} />
          </div>
          <pre className="copy-block">{weeklySummary}</pre>
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
            <div className="empty-state">Nenhuma prioridade automatica encontrada para o filtro atual.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Distribuicao por area</span>
            <h2 className="panel-title">Onde precisamos captar ou redistribuir?</h2>
            <p className="muted">Leitura simples por quantidade de voluntarios ativos vinculados a cada area.</p>
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

      <section className="panel table-wrapper">
        {volunteers.length === 0 ? (
          <div className="empty-state">Nenhum voluntario encontrado para o filtro atual.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Voluntario</th>
                <th>Status</th>
                <th>Cuidado</th>
                <th>Disponibilidade</th>
                <th>Areas</th>
                <th>Entrada</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => {
                const loadStatus = getAreaLoadStatus(volunteer)
                const whatsappHref = getWhatsappHref(volunteer.whatsapp)
                const attentionLabels = getVolunteerAttentionLabels(volunteer)

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
                      <span className={volunteer.active ? 'badge' : 'badge-danger'}>
                        {volunteer.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div className="stack">
                        <span className={loadStatus.className}>{loadStatus.label}</span>
                        <span className="muted">{formatCareStatus(volunteer.careStatus)}</span>
                        {attentionLabels.length > 0 ? (
                          <span className="muted">{attentionLabels.join(' / ')}</span>
                        ) : (
                          <span className="muted">Sem alerta adicional</span>
                        )}
                      </div>
                    </td>
                    <td>{formatAvailabilityStatus(volunteer.availabilityStatus)}</td>
                    <td>
                      <div className="stack">
                        {volunteer.areas.length > 0 ? (
                          volunteer.areas.map((area) => (
                            <span className="muted" key={`${volunteer.id}-${area.areaId}`}>
                              {area.areaName} - {formatAreaRole(area.roleInArea)}
                            </span>
                          ))
                        ) : (
                          <span className="muted">Sem area vinculada</span>
                        )}
                      </div>
                    </td>
                    <td>{formatDate(volunteer.joinDate)}</td>
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
