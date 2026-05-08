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
  const selectedFilterLabel =
    attentionFilterOptions.find((option) => option.value === attentionFilter)?.label ?? 'Todas as pessoas'
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
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Painel da semana</span>
          <h1>Quem precisa de cuidado agora?</h1>
          <p>
            A primeira dobra agora é operacional: ver sinais, escolher pessoas e sair com próximos passos claros para a liderança.
          </p>
        </div>

        <div className="decision-strip" aria-label="Decisões sugeridas para a semana">
          <article>
            <span>1</span>
            <strong>Priorizar contatos</strong>
            <small>{insights.needsContact.length + insights.followUpDue.length} pessoas com contato ou retorno pendente</small>
          </article>
          <article>
            <span>2</span>
            <strong>Conectar sem área</strong>
            <small>{insights.unassigned.length} pessoas precisam de integração prática</small>
          </article>
          <article>
            <span>3</span>
            <strong>Reequilibrar carga</strong>
            <small>{attentionCount} sinais de atenção ou possível sobrecarga</small>
          </article>
        </div>
      </section>

      <section className="quick-actions-grid" aria-label="Atalhos de cuidado">
        <Link className="metric-card urgent" href={getFilterHref('needs_contact')}>
          <span className="muted">Agir primeiro</span>
          <strong>{insights.needsContact.length}</strong>
          <small>Precisam contato</small>
        </Link>
        <Link className="metric-card warning" href={getFilterHref('follow_up_due')}>
          <span className="muted">Retomar</span>
          <strong>{insights.followUpDue.length}</strong>
          <small>Retornos vencidos</small>
        </Link>
        <Link className="metric-card warning" href={getFilterHref('unassigned')}>
          <span className="muted">Integrar</span>
          <strong>{insights.unassigned.length}</strong>
          <small>Sem área</small>
        </Link>
        <Link className="metric-card" href={getFilterHref('new')}>
          <span className="muted">Acompanhar</span>
          <strong>{insights.newVolunteers.length}</strong>
          <small>Novos 30 dias</small>
        </Link>
        <Link className="metric-card" href={getFilterHref('overloaded')}>
          <span className="muted">Cuidar carga</span>
          <strong>{attentionCount}</strong>
          <small>Atenção/sobrecarga</small>
        </Link>
        <Link className="metric-card" href={getFilterHref('birthday')}>
          <span className="muted">Celebrar</span>
          <strong>{insights.birthdaysThisMonth.length}</strong>
          <small>Aniversariantes</small>
        </Link>
      </section>

      <section className="care-workspace">
        <aside className="panel care-sidebar" aria-label="Visões rápidas de cuidado">
          <div className="stack">
            <span className="eyebrow">Visões rápidas</span>
            <h2 className="panel-title">Troque a lente sem perder a lista</h2>
            <p className="muted">
              O filtro fica ao lado das pessoas para a liderança entender causa e ação no mesmo lugar.
            </p>
          </div>

          <div className="filter-list">
            {attentionFilterOptions.map((option) => (
              <Link
                className={option.value === attentionFilter ? 'filter-row active' : 'filter-row'}
                href={getFilterHref(option.value)}
                key={option.value}
              >
                <span>{option.label}</span>
              </Link>
            ))}
          </div>

          <div className="sidebar-actions">
            <Link className="button-secondary" href="/voluntarios">
              Abrir cadastro completo
            </Link>
            <Link className="button-secondary" href="/dados/cuidado">
              Ver plano de cuidado
            </Link>
          </div>
        </aside>

        <div className="panel care-main">
          <div className="toolbar">
            <div className="stack">
              <span className="eyebrow">Pessoas para agir agora</span>
              <h2 className="panel-title">{selectedFilterLabel}</h2>
              <p className="muted">
                {volunteers.length} pessoa{volunteers.length === 1 ? '' : 's'} visível{volunteers.length === 1 ? '' : 'eis'} nesta visão.
              </p>
            </div>
            <Link className="button" href="/voluntarios/novo">
              Novo voluntário
            </Link>
          </div>

          {volunteers.length === 0 ? (
            <div className="empty-state">Nenhum voluntário encontrado para esta visão.</div>
          ) : (
            <div className="volunteer-action-list">
              {volunteers.map((volunteer) => {
                const loadStatus = getAreaLoadStatus(volunteer)
                const attentionLabels = getVolunteerAttentionLabels(volunteer)
                const whatsappHref = getWhatsappHref(volunteer.whatsapp)
                const visibleLabels = attentionLabels.length > 0 ? attentionLabels : ['Sem alerta adicional']

                return (
                  <article className="volunteer-action-card" key={volunteer.id}>
                    <div className="volunteer-action-header">
                      <div className="stack">
                        <Link href={`/voluntarios/${volunteer.id}`}>
                          <strong>{volunteer.name}</strong>
                        </Link>
                        <span className={loadStatus.className}>{loadStatus.label}</span>
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

                    <div className="signal-row">
                      {visibleLabels.map((label) => (
                        <span className="signal-chip" key={`${volunteer.id}-${label}`}>
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="next-step-box">
                      <span className="eyebrow">Próximo passo</span>
                      <p>{volunteer.nextStep || 'Definir responsável e próximo contato.'}</p>
                    </div>

                    <div className="mini-meta">
                      <span>
                        Áreas:{' '}
                        {volunteer.areas.length > 0
                          ? volunteer.areas.map((area) => area.areaName).join(', ')
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

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Distribuição por área</span>
            <h2 className="panel-title">Onde precisamos captar ou redistribuir?</h2>
            <p className="muted">Leitura por quantidade de voluntários ativos vinculados a cada área.</p>
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
            <div className="empty-state">Nenhuma prioridade automática encontrada.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Resumo semanal</span>
            <h2 className="panel-title">Texto pronto para liderança</h2>
            <p className="muted">Copie para levar a pauta da semana ao grupo de liderança.</p>
          </div>
          <CopyTextButton text={weeklySummary} />
        </div>
        <pre className="copy-block">{weeklySummary}</pre>
      </section>
    </div>
  )
}
