import Link from 'next/link'

import { CopyTextButton } from '@/components/copy-text-button'
import { formatCareStatus, formatDate } from '@/lib/format'
import type { VolunteerRecord } from '@/lib/types'
import { getVolunteers } from '@/lib/volunteers/data'
import { getWhatsappHref } from '@/lib/volunteers/insights'

export const dynamic = 'force-dynamic'

type CareQueueItem = {
  action: string
  reason: string
  severity: 'Alta' | 'Media' | 'Baixa'
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

function isWithinNextSevenDays(value: string | null) {
  if (!value) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const limit = new Date(today)
  limit.setDate(limit.getDate() + 7)

  const date = new Date(`${value}T00:00:00`)
  return date >= today && date <= limit
}

function buildCareQueue(volunteers: VolunteerRecord[]) {
  const queue: CareQueueItem[] = []

  volunteers.forEach((volunteer) => {
    if (isPastDate(volunteer.nextFollowUpAt)) {
      queue.push({
        action: 'Retomar contato e atualizar proximo passo.',
        reason: `Retorno venceu em ${formatDate(volunteer.nextFollowUpAt)}.`,
        severity: 'Alta',
        volunteer,
      })
    }

    if (volunteer.careStatus === 'needs_contact') {
      queue.push({
        action: volunteer.nextStep || 'Definir conversa e registrar proximo passo.',
        reason: 'Status marcado como precisa contato.',
        severity: volunteer.nextStep ? 'Media' : 'Alta',
        volunteer,
      })
    }

    if (volunteer.nextStep && !volunteer.careResponsible) {
      queue.push({
        action: 'Definir responsavel pelo acompanhamento.',
        reason: 'Existe proximo passo sem responsavel.',
        severity: 'Media',
        volunteer,
      })
    }

    if (volunteer.careResponsible && !volunteer.nextFollowUpAt) {
      queue.push({
        action: 'Definir data de retorno.',
        reason: 'Existe responsavel sem data de acompanhamento.',
        severity: 'Media',
        volunteer,
      })
    }

    if (volunteer.careStatus === 'paused') {
      queue.push({
        action: 'Confirmar se a pausa continua saudavel e se ha data de retorno.',
        reason: 'Voluntario em pausa.',
        severity: 'Baixa',
        volunteer,
      })
    }

    if (volunteer.careStatus === 'new' && !volunteer.nextStep) {
      queue.push({
        action: 'Fazer primeiro contato e definir proximo passo.',
        reason: 'Voluntario novo sem proximo passo.',
        severity: 'Alta',
        volunteer,
      })
    }

    if (isWithinNextSevenDays(volunteer.nextFollowUpAt)) {
      queue.push({
        action: 'Preparar retorno combinado.',
        reason: `Retorno previsto para ${formatDate(volunteer.nextFollowUpAt)}.`,
        severity: 'Baixa',
        volunteer,
      })
    }
  })

  const severityOrder = {
    Alta: 0,
    Media: 1,
    Baixa: 2,
  }

  return queue.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
}

function getSeverityClassName(severity: CareQueueItem['severity']) {
  if (severity === 'Alta') {
    return 'badge-danger'
  }

  if (severity === 'Media') {
    return 'badge-warning'
  }

  return 'badge'
}

function getCareSummary(queue: CareQueueItem[]) {
  const high = queue.filter((item) => item.severity === 'Alta')
  const medium = queue.filter((item) => item.severity === 'Media')
  const low = queue.filter((item) => item.severity === 'Baixa')

  return [
    'Fila de Cuidado - Voluntariado Revive',
    '',
    `Pendencias altas: ${high.length}`,
    `Pendencias medias: ${medium.length}`,
    `Pendencias baixas: ${low.length}`,
    '',
    'Prioridades sugeridas:',
    ...high.slice(0, 5).map((item, index) => `${index + 1}. ${item.volunteer.name} - ${item.action}`),
    '',
    'Decisao sugerida: resolver primeiro retornos vencidos, pessoas novas sem proximo passo e precisa contato sem acao definida.',
  ].join('\n')
}

export default async function DadosCuidadoPage() {
  const volunteers = await getVolunteers({ status: 'all' })
  const queue = buildCareQueue(volunteers)
  const high = queue.filter((item) => item.severity === 'Alta')
  const medium = queue.filter((item) => item.severity === 'Media')
  const low = queue.filter((item) => item.severity === 'Baixa')
  const uniquePeople = new Set(queue.map((item) => item.volunteer.id)).size
  const needsContact = volunteers.filter((volunteer) => volunteer.careStatus === 'needs_contact')
  const paused = volunteers.filter((volunteer) => volunteer.careStatus === 'paused')
  const summary = getCareSummary(queue)

  return (
    <div className="section-grid">
      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Dados/Escalas</span>
            <h1 className="panel-title">Fila de Cuidado</h1>
            <p className="muted">
              Uma lista priorizada para acompanhar pessoas antes que ausencia, pausa ou falta de proximo passo virem esquecimento.
            </p>
          </div>
          <div className="nav-links">
            <CopyTextButton text={summary} />
            <Link className="button-secondary" href="/dados/jornada">
              Jornada
            </Link>
            <Link className="button-secondary" href="/dados">
              Painel
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="muted">Pessoas na fila</span>
          <div className="stat-value">{uniquePeople}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Alta prioridade</span>
          <div className="stat-value">{high.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Media prioridade</span>
          <div className="stat-value">{medium.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Baixa prioridade</span>
          <div className="stat-value">{low.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Precisa contato</span>
          <div className="stat-value">{needsContact.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Em pausa</span>
          <div className="stat-value">{paused.length}</div>
        </article>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Como usar</span>
            <h2 className="panel-title">Cuidar com prioridade e proximo passo</h2>
            <p className="muted">
              Resolva primeiro itens de alta prioridade. Depois confira pendencias medias, como proximo passo sem responsavel
              ou responsavel sem data de retorno.
            </p>
          </div>
        </div>
      </section>

      <section className="panel table-wrapper">
        {queue.length === 0 ? (
          <div className="empty-state">Nenhuma pendencia de cuidado encontrada.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Prioridade</th>
                <th>Voluntario</th>
                <th>Status</th>
                <th>Motivo</th>
                <th>Acao sugerida</th>
                <th>Responsavel</th>
                <th>Contato</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => {
                const whatsappHref = getWhatsappHref(item.volunteer.whatsapp)

                return (
                  <tr key={`${item.volunteer.id}-${item.reason}-${item.action}`}>
                    <td>
                      <span className={getSeverityClassName(item.severity)}>{item.severity}</span>
                    </td>
                    <td>
                      <Link href={`/voluntarios/${item.volunteer.id}`}>
                        <strong>{item.volunteer.name}</strong>
                      </Link>
                    </td>
                    <td>{formatCareStatus(item.volunteer.careStatus)}</td>
                    <td>{item.reason}</td>
                    <td>{item.action}</td>
                    <td>{item.volunteer.careResponsible || 'Definir responsavel'}</td>
                    <td>
                      {whatsappHref ? (
                        <a className="inline-link" href={whatsappHref} rel="noreferrer" target="_blank">
                          WhatsApp
                        </a>
                      ) : (
                        <span className="muted">Sem WhatsApp</span>
                      )}
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
