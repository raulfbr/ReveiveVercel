import Link from 'next/link'

import { getVolunteers } from '@/lib/volunteers/data'
import { formatCareStatus, formatDate } from '@/lib/format'
import type { VolunteerRecord } from '@/lib/types'

export const dynamic = 'force-dynamic'

type QualityIssue = {
  description: string
  href: string
  kind: 'error' | 'warning'
  title: string
  volunteer: VolunteerRecord
}

function isPastDate(value: string | null) {
  if (!value) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const date = new Date(`${value}T00:00:00`)
  return date < today
}

function buildQualityIssues(volunteers: VolunteerRecord[]) {
  const issues: QualityIssue[] = []

  volunteers.forEach((volunteer) => {
    const href = `/voluntarios/${volunteer.id}`

    if (volunteer.active && volunteer.areas.length === 0) {
      issues.push({
        description: 'Voluntario ativo sem area vinculada. Precisa de alocacao ou revisao.',
        href,
        kind: 'warning',
        title: 'Sem area',
        volunteer,
      })
    }

    if (volunteer.active && !volunteer.whatsapp) {
      issues.push({
        description: 'Voluntario ativo sem WhatsApp. Isso dificulta contato e acompanhamento.',
        href,
        kind: 'warning',
        title: 'Sem WhatsApp',
        volunteer,
      })
    }

    if (volunteer.careStatus === 'needs_contact' && !volunteer.nextStep) {
      issues.push({
        description: 'Marcado como precisa contato, mas sem proximo passo definido.',
        href,
        kind: 'error',
        title: 'Precisa contato sem acao',
        volunteer,
      })
    }

    if (volunteer.nextStep && !volunteer.careResponsible) {
      issues.push({
        description: 'Existe proximo passo, mas nao ha responsavel pelo acompanhamento.',
        href,
        kind: 'warning',
        title: 'Sem responsavel',
        volunteer,
      })
    }

    if (volunteer.careResponsible && !volunteer.nextFollowUpAt) {
      issues.push({
        description: 'Existe responsavel, mas nao ha data de retorno definida.',
        href,
        kind: 'warning',
        title: 'Sem data de retorno',
        volunteer,
      })
    }

    if (isPastDate(volunteer.nextFollowUpAt)) {
      issues.push({
        description: `Retorno previsto para ${formatDate(volunteer.nextFollowUpAt)} ja venceu.`,
        href,
        kind: 'error',
        title: 'Retorno vencido',
        volunteer,
      })
    }

    if (!volunteer.active && volunteer.careStatus !== 'inactive' && volunteer.careStatus !== 'paused') {
      issues.push({
        description: 'Voluntario inativo com status de cuidado inconsistente.',
        href,
        kind: 'error',
        title: 'Status inconsistente',
        volunteer,
      })
    }
  })

  return issues
}

function getIssueClassName(kind: QualityIssue['kind']) {
  return kind === 'error' ? 'badge-danger' : 'badge-warning'
}

export default async function DadosQualidadePage() {
  const volunteers = await getVolunteers({ status: 'all' })
  const issues = buildQualityIssues(volunteers)
  const activeVolunteers = volunteers.filter((volunteer) => volunteer.active)
  const criticalIssues = issues.filter((issue) => issue.kind === 'error')
  const warningIssues = issues.filter((issue) => issue.kind === 'warning')
  const volunteersWithIssues = new Set(issues.map((issue) => issue.volunteer.id)).size
  const qualityScore =
    volunteers.length === 0 ? 100 : Math.max(0, Math.round(100 - (volunteersWithIssues / volunteers.length) * 100))

  return (
    <div className="section-grid">
      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Dados/Escalas</span>
            <h1 className="panel-title">Qualidade da base</h1>
            <p className="muted">
              Revisao pratica para encontrar dados incompletos, inconsistentes ou sem proximo passo.
            </p>
          </div>
          <div className="nav-links">
            <Link className="button-secondary" href="/dados/importar">
              Importar CSV
            </Link>
            <Link className="button-secondary" href="/dados">
              Voltar ao painel
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="muted">Score de qualidade</span>
          <div className="stat-value">{qualityScore}%</div>
        </article>
        <article className="stat-card">
          <span className="muted">Voluntarios na base</span>
          <div className="stat-value">{volunteers.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Ativos</span>
          <div className="stat-value">{activeVolunteers.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Com pendencia</span>
          <div className="stat-value">{volunteersWithIssues}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Criticas</span>
          <div className="stat-value">{criticalIssues.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Avisos</span>
          <div className="stat-value">{warningIssues.length}</div>
        </article>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Como usar</span>
            <h2 className="panel-title">Priorize criticas antes da reuniao</h2>
            <p className="muted">
              Corrija primeiro pessoas com retorno vencido, precisa contato sem acao e status inconsistente.
              Depois trate avisos como WhatsApp, area, responsavel e data de retorno.
            </p>
          </div>
        </div>
      </section>

      <section className="panel table-wrapper">
        {issues.length === 0 ? (
          <div className="empty-state">Nenhuma pendencia de qualidade encontrada na base.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Prioridade</th>
                <th>Voluntario</th>
                <th>Status</th>
                <th>Pendencia</th>
                <th>Acao</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={`${issue.volunteer.id}-${issue.title}`}>
                  <td>
                    <span className={getIssueClassName(issue.kind)}>
                      {issue.kind === 'error' ? 'Critica' : 'Aviso'}
                    </span>
                  </td>
                  <td>
                    <div className="stack">
                      <strong>{issue.volunteer.name}</strong>
                      <span className="muted">{issue.volunteer.whatsapp || 'WhatsApp nao informado'}</span>
                    </div>
                  </td>
                  <td>{formatCareStatus(issue.volunteer.careStatus)}</td>
                  <td>
                    <div className="stack">
                      <strong>{issue.title}</strong>
                      <span className="muted">{issue.description}</span>
                    </div>
                  </td>
                  <td>
                    <Link className="inline-link" href={issue.href}>
                      Abrir cadastro
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
