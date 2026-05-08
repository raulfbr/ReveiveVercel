import { CopyTextButton } from '@/components/copy-text-button'
import { demoScheduleEvent, reviveMinistries } from '@/lib/schedules/demo-data'
import {
  buildScheduleWhatsAppText,
  getCoverageStatusLabel,
  getMinistryCoverage,
  getRequirementCoverage,
  getScheduleInsights,
  getStatusClassName,
  getStatusLabel,
} from '@/lib/schedules/insights'

export const dynamic = 'force-dynamic'

export default function EscalasPage() {
  const event = demoScheduleEvent
  const insights = getScheduleInsights(event)
  const whatsappSummary = buildScheduleWhatsAppText(event, insights)
  const highPriorityAlerts = insights.alerts.filter((alert) => alert.severity === 'alta')
  const mediumPriorityAlerts = insights.alerts.filter((alert) => alert.severity === 'media')

  return (
    <div className="section-grid">
      <section className="hero-panel schedule-hero">
        <div className="hero-copy">
          <span className="eyebrow">Escalas + Cuidado</span>
          <h1>Escala da Semana</h1>
          <p>
            {event.dateLabel} · {event.typeLabel} às {event.startsAt}. Veja quem está servindo, onde falta gente e quais
            cuidados precisam de atenção antes do domingo.
          </p>
          <div className="actions-row">
            <CopyTextButton copiedLabel="Escala copiada" label="Copiar escala para WhatsApp" text={whatsappSummary} />
          </div>
        </div>

        <div className="decision-strip" aria-label="Decisões principais da escala">
          <article>
            <span>1</span>
            <strong>Fechar vagas abertas</strong>
            <small>
              {insights.missingCount} vaga{insights.missingCount === 1 ? '' : 's'} ainda precisa
              {insights.missingCount === 1 ? '' : 'm'} de responsável.
            </small>
          </article>
          <article>
            <span>2</span>
            <strong>Resolver conflitos</strong>
            <small>
              {insights.duplicateVolunteerNames.length} pessoa
              {insights.duplicateVolunteerNames.length === 1 ? '' : 's'} aparece
              {insights.duplicateVolunteerNames.length === 1 ? '' : 'm'} em mais de uma função.
            </small>
          </article>
          <article>
            <span>3</span>
            <strong>Cuidar de quem serve</strong>
            <small>
              {highPriorityAlerts.length + mediumPriorityAlerts.length} alerta
              {highPriorityAlerts.length + mediumPriorityAlerts.length === 1 ? '' : 's'} para a liderança revisar.
            </small>
          </article>
        </div>
      </section>

      <section className="quick-actions-grid" aria-label="Resumo da escala">
        <article className="metric-card">
          <span className="muted">Ministérios ativos</span>
          <strong>{insights.activeMinistryCount}</strong>
          <small>com escala neste culto</small>
        </article>
        <article className="metric-card">
          <span className="muted">Vagas necessárias</span>
          <strong>{insights.requiredCount}</strong>
          <small>funções planejadas</small>
        </article>
        <article className="metric-card">
          <span className="muted">Preenchidas</span>
          <strong>{insights.assignmentCount}</strong>
          <small>{insights.confirmedCount} confirmadas</small>
        </article>
        <article className={insights.missingCount > 0 ? 'metric-card warning' : 'metric-card'}>
          <span className="muted">Vagas abertas</span>
          <strong>{insights.missingCount}</strong>
          <small>para fechar antes do culto</small>
        </article>
        <article className={highPriorityAlerts.length > 0 ? 'metric-card urgent' : 'metric-card'}>
          <span className="muted">Alertas altos</span>
          <strong>{highPriorityAlerts.length}</strong>
          <small>conflito ou função vazia</small>
        </article>
      </section>

      <section className="schedule-workspace">
        <aside className="panel schedule-sidebar">
          <div className="stack">
            <span className="eyebrow">Base real</span>
            <h2 className="panel-title">17 ministérios mapeados</h2>
            <p className="muted">
              Esta tela já usa a estrutura ministerial informada para guiar a próxima onda de banco e edição real.
            </p>
          </div>

          <div className="ministry-chip-list" aria-label="Ministérios oficiais da Revive">
            {reviveMinistries.map((ministry) => (
              <span className={event.ministries.some((item) => item.name === ministry) ? 'signal-chip active' : 'signal-chip'} key={ministry}>
                {ministry}
              </span>
            ))}
          </div>

          <div className="next-step-box">
            <span className="eyebrow">Modo atual</span>
            <p>
              Protótipo read-only. Serve para aprovar experiência, linguagem e regras antes de criar tabelas de escala no
              Supabase.
            </p>
          </div>
        </aside>

        <div className="schedule-main">
          <section className="panel">
            <div className="toolbar">
              <div className="stack">
                <span className="eyebrow">Escala por ministério</span>
                <h2 className="panel-title">Cobertura do próximo domingo</h2>
                <p className="muted">Cada bloco mostra função, responsáveis e pendências para fechar a escala.</p>
              </div>
            </div>

            <div className="schedule-ministry-grid">
              {event.ministries.map((ministry) => {
                const ministryCoverage = getMinistryCoverage(ministry)

                return (
                  <article className="schedule-ministry-card" key={ministry.id}>
                    <div className="toolbar compact-toolbar">
                      <div className="stack">
                        <strong>{ministry.name}</strong>
                        <span className="muted">{ministry.description}</span>
                      </div>
                      <span className={ministryCoverage.status === 'complete' ? 'badge' : 'badge-warning'}>
                        {getCoverageStatusLabel(ministryCoverage.status)}
                      </span>
                    </div>

                    <div className="schedule-progress-shell" aria-label={`${ministry.name}: ${ministryCoverage.assignedCount} de ${ministryCoverage.requiredCount}`}>
                      <span
                        className="schedule-progress-bar"
                        style={{
                          width:
                            ministryCoverage.requiredCount > 0
                              ? `${Math.min((ministryCoverage.assignedCount / ministryCoverage.requiredCount) * 100, 100)}%`
                              : '100%',
                        }}
                      />
                    </div>

                    <div className="schedule-requirement-list">
                      {ministry.requirements.map((requirement) => {
                        const coverage = getRequirementCoverage(requirement)

                        return (
                          <div className="schedule-requirement" key={requirement.id}>
                            <div className="schedule-requirement-header">
                              <div className="stack">
                                <strong>{requirement.front}</strong>
                                <span className="muted">{requirement.role}</span>
                              </div>
                              <span className={coverage.status === 'complete' ? 'badge' : coverage.status === 'empty' ? 'badge-danger' : 'badge-warning'}>
                                {coverage.assignedCount}/{requirement.requiredCount}
                              </span>
                            </div>

                            <div className="schedule-assignment-list">
                              {requirement.assignments.map((assignment) => (
                                <div className="schedule-assignment" key={`${requirement.id}-${assignment.name}`}>
                                  <div className="stack">
                                    <strong>{assignment.name}</strong>
                                    {assignment.note ? <span className="muted">{assignment.note}</span> : null}
                                  </div>
                                  <span className={getStatusClassName(assignment.status)}>{getStatusLabel(assignment.status)}</span>
                                </div>
                              ))}

                              {Array.from({ length: coverage.missingCount }).map((_, index) => (
                                <div className="schedule-assignment missing" key={`${requirement.id}-missing-${index}`}>
                                  <span>Vaga aberta</span>
                                  <span className="badge-danger">Pendente</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="panel">
            <div className="toolbar">
              <div className="stack">
                <span className="eyebrow">Alertas da liderança</span>
                <h2 className="panel-title">O que precisa ser decidido antes do culto?</h2>
                <p className="muted">Alertas aqui são sinais de coordenação e cuidado, não cobrança automática.</p>
              </div>
            </div>

            <div className="schedule-alert-list">
              {insights.alerts.map((alert) => (
                <article className={`schedule-alert ${alert.severity}`} key={`${alert.title}-${alert.detail}`}>
                  <span className={alert.severity === 'alta' ? 'badge-danger' : alert.severity === 'media' ? 'badge-warning' : 'badge'}>
                    {alert.severity === 'alta' ? 'Alta' : alert.severity === 'media' ? 'Média' : 'Baixa'}
                  </span>
                  <strong>{alert.title}</strong>
                  <span className="muted">{alert.detail}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="toolbar">
              <div className="stack">
                <span className="eyebrow">WhatsApp</span>
                <h2 className="panel-title">Mensagem pronta para enviar</h2>
                <p className="muted">Copie para alinhar a escala no grupo sem depender de planilha solta.</p>
              </div>
              <CopyTextButton copiedLabel="Escala copiada" label="Copiar escala" text={whatsappSummary} />
            </div>

            <pre className="copy-block">{whatsappSummary}</pre>
          </section>
        </div>
      </section>
    </div>
  )
}
