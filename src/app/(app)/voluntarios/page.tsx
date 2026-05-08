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
      return 'Voluntário criado com sucesso.'
    case 'updated':
      return 'Voluntário atualizado com sucesso.'
    case 'deactivated':
      return 'Voluntário inativado.'
    case 'reactivated':
      return 'Voluntário reativado.'
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
  const selectedAreaName = areaId ? serviceAreas.find((area) => area.id === areaId)?.name ?? 'Área selecionada' : 'Todas as áreas'
  const selectedAttentionLabel =
    attentionFilterOptions.find((option) => option.value === attentionFilter)?.label ?? 'Todas as pessoas'
  const statusLabel = status === 'active' ? 'Somente ativos' : status === 'inactive' ? 'Somente inativos' : 'Todos'
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
      <section className="hero-panel compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Mesa de trabalho</span>
          <h1>Voluntários com contexto, não só cadastro</h1>
          <p>
            Use esta tela para filtrar, conversar, abrir ficha e registrar o próximo passo sem perder a visão da semana.
          </p>
        </div>

        {appUser.role === 'admin' ? (
          <Link className="button" href="/voluntarios/novo">
            Novo voluntário
          </Link>
        ) : null}
      </section>

      {errorMessage ? <p className="error-message">{decodeURIComponent(errorMessage)}</p> : null}
      {successMessage ? <p className="success-message">{successMessage}</p> : null}

      <section className="care-workspace">
        <aside className="panel care-sidebar">
          <div className="stack">
            <span className="eyebrow">Filtros de trabalho</span>
            <h2 className="panel-title">Ajuste a lista aqui</h2>
            <p className="muted">
              Os filtros ficam grudados na lista para ficar claro o que mudou e quem apareceu.
            </p>
          </div>

          <form className="filters-form vertical-filters" method="get">
            <div className="field">
              <label htmlFor="area">Área</label>
              <select className="select" defaultValue={areaId ?? ''} id="area" name="area">
                <option value="">Todas as áreas</option>
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
              <button className="button" type="submit">
                Aplicar filtros
              </button>
              <Link className="button-secondary" href="/voluntarios">
                Limpar
              </Link>
            </div>
          </form>

          <div className="active-filter-box">
            <span className="eyebrow">Visão atual</span>
            <strong>{selectedAttentionLabel}</strong>
            <span className="muted">{selectedAreaName}</span>
            <span className="muted">{statusLabel}</span>
          </div>
        </aside>

        <div className="panel care-main">
          <div className="toolbar">
            <div className="stack">
              <span className="eyebrow">Lista acionável</span>
              <h2 className="panel-title">
                {volunteers.length} voluntário{volunteers.length === 1 ? '' : 's'} encontrado{volunteers.length === 1 ? '' : 's'}
              </h2>
              <p className="muted">
                Abra a ficha, chame no WhatsApp ou use o próximo passo para conduzir a conversa.
              </p>
            </div>
          </div>

          {volunteers.length === 0 ? (
            <div className="empty-state">Nenhum voluntário encontrado para o filtro atual.</div>
          ) : (
            <div className="volunteer-action-list">
              {volunteers.map((volunteer) => {
                const loadStatus = getAreaLoadStatus(volunteer)
                const whatsappHref = getWhatsappHref(volunteer.whatsapp)
                const attentionLabels = getVolunteerAttentionLabels(volunteer)

                return (
                  <article className="volunteer-action-card" key={volunteer.id}>
                    <div className="volunteer-action-header">
                      <div className="stack">
                        <Link href={`/voluntarios/${volunteer.id}`}>
                          <strong>{volunteer.name}</strong>
                        </Link>
                        <div className="status-row">
                          <span className={volunteer.active ? 'badge' : 'badge-danger'}>
                            {volunteer.active ? 'Ativo' : 'Inativo'}
                          </span>
                          <span className={loadStatus.className}>{loadStatus.label}</span>
                          <span className="badge-warning">{formatCareStatus(volunteer.careStatus)}</span>
                        </div>
                      </div>

                      <div className="actions-row">
                        {whatsappHref ? (
                          <a className="button-secondary compact-button" href={whatsappHref} rel="noreferrer" target="_blank">
                            WhatsApp
                          </a>
                        ) : null}
                        <Link className="button-secondary compact-button" href={`/voluntarios/${volunteer.id}`}>
                          Ver ficha
                        </Link>
                      </div>
                    </div>

                    <div className="next-step-box">
                      <span className="eyebrow">Próximo passo</span>
                      <p>{volunteer.nextStep || 'Sem próximo passo registrado.'}</p>
                    </div>

                    <div className="signal-row">
                      {(attentionLabels.length > 0 ? attentionLabels : ['Sem alerta adicional']).map((label) => (
                        <span className="signal-chip" key={`${volunteer.id}-${label}`}>
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="mini-meta">
                      <span>{formatAvailabilityStatus(volunteer.availabilityStatus)}</span>
                      <span>Entrada: {formatDate(volunteer.joinDate)}</span>
                      <span>
                        Áreas:{' '}
                        {volunteer.areas.length > 0
                          ? volunteer.areas.map((area) => `${area.areaName} - ${formatAreaRole(area.roleInArea)}`).join(', ')
                          : 'sem área vinculada'}
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="muted">Voluntários visíveis</span>
          <div className="stat-value">{volunteers.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Ativos no filtro</span>
          <div className="stat-value">{activeCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Sem área</span>
          <div className="stat-value">{insights.unassigned.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Atenção/sobrecarga</span>
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
          <span className="muted">Áreas baixa cobertura</span>
          <div className="stat-value">{lowCoverageCount}</div>
        </article>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Resumo semanal</span>
            <h2 className="panel-title">Pauta de cuidado para liderança</h2>
            <p className="muted">Use estes sinais como abertura de conversa, não como cobrança automática.</p>
          </div>
        </div>

        <div className="summary-grid">
          <article className="summary-card">
            <strong>Novos sem acompanhamento inicial</strong>
            <span className="muted">{insights.newVolunteers.length} voluntários nos últimos 30 dias</span>
          </article>
          <article className="summary-card">
            <strong>Precisa contato</strong>
            <span className="muted">{insights.needsContact.length} marcados para conversa ou cuidado</span>
          </article>
          <article className="summary-card">
            <strong>Pessoas sem área</strong>
            <span className="muted">{insights.unassigned.length} precisam de integração operacional</span>
          </article>
          <article className="summary-card">
            <strong>Possível excesso de carga</strong>
            <span className="muted">{attentionCount} servem em 3 ou mais áreas</span>
          </article>
          <article className="summary-card">
            <strong>Aniversariantes do mês</strong>
            <span className="muted">{insights.birthdaysThisMonth.length} oportunidades de cuidado e celebração</span>
          </article>
          <article className="summary-card">
            <strong>Retornos vencidos</strong>
            <span className="muted">{insights.followUpDue.length} próximos passos precisam ser retomados</span>
          </article>
          <article className="summary-card">
            <strong>Áreas com baixa cobertura</strong>
            <span className="muted">{lowCoverageCount} precisam de captação ou redistribuição</span>
          </article>
        </div>

        <div className="copy-panel">
          <div className="toolbar">
            <div className="stack">
              <strong>Resumo pronto para compartilhar</strong>
              <span className="muted">Copie para levar a pauta da semana ao grupo de liderança.</span>
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
            <h2 className="panel-title">O que a liderança deveria decidir primeiro?</h2>
            <p className="muted">Sugestões geradas a partir dos sinais atuais do painel.</p>
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
            <div className="empty-state">Nenhuma prioridade automática encontrada para o filtro atual.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Distribuição por área</span>
            <h2 className="panel-title">Onde precisamos captar ou redistribuir?</h2>
            <p className="muted">Leitura simples por quantidade de voluntários ativos vinculados a cada área.</p>
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
                  ? `${area.overloadedCount} também aparecem em possível sobrecarga`
                  : 'Sem sinal de sobrecarga nessa área'}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
