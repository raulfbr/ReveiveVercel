import Link from 'next/link'

import { CopyTextButton } from '@/components/copy-text-button'
import { formatAreaRole, formatCareStatus, formatDate } from '@/lib/format'
import type { VolunteerRecord } from '@/lib/types'
import { getVolunteers } from '@/lib/volunteers/data'
import { getWhatsappHref } from '@/lib/volunteers/insights'

export const dynamic = 'force-dynamic'

type TrainingQueueItem = {
  action: string
  group: string
  priority: 'Alta' | 'Media' | 'Baixa'
  reason: string
  volunteer: VolunteerRecord
}

function isRecentJoin(value: string | null) {
  if (!value) {
    return false
  }

  const joinDate = new Date(`${value}T00:00:00`)
  const today = new Date()
  const diffInMs = today.getTime() - joinDate.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  return diffInDays >= 0 && diffInDays <= 45
}

function hasLeadershipRole(volunteer: VolunteerRecord) {
  return volunteer.areas.some(
    (assignment) => assignment.roleInArea === 'leader' || assignment.roleInArea === 'coordinator',
  )
}

function buildTrainingQueue(volunteers: VolunteerRecord[]) {
  const queue: TrainingQueueItem[] = []

  volunteers.forEach((volunteer) => {
    if (!volunteer.active) {
      return
    }

    if (volunteer.careStatus === 'needs_contact') {
      queue.push({
        action: 'Conversar antes de encaminhar para treinamento.',
        group: 'Cuidado antes de treinamento',
        priority: 'Alta',
        reason: 'Pessoa precisa contato antes de avancar no processo.',
        volunteer,
      })
    }

    if (volunteer.careStatus === 'new' || isRecentJoin(volunteer.joinDate)) {
      queue.push({
        action: 'Enviar trilha inicial de cultura, visao e servico voluntario.',
        group: 'Treinamento inicial',
        priority: 'Alta',
        reason: 'Pessoa nova ou entrada recente.',
        volunteer,
      })
    }

    if (volunteer.areas.length === 0) {
      queue.push({
        action: 'Fazer orientacao de areas antes de treinamento especifico.',
        group: 'Orientacao antes de area',
        priority: 'Media',
        reason: 'Pessoa ativa ainda sem area vinculada.',
        volunteer,
      })
    }

    if (hasLeadershipRole(volunteer)) {
      queue.push({
        action: 'Incluir em formacao de lideranca e alinhamento de cultura.',
        group: 'Formacao de lideranca',
        priority: 'Media',
        reason: 'Pessoa atua como lider ou coordenador em alguma area.',
        volunteer,
      })
    }

    if (volunteer.areas.length >= 3) {
      queue.push({
        action: 'Reforcar cultura de descanso, limites e servico sustentavel.',
        group: 'Reciclagem de cultura',
        priority: 'Baixa',
        reason: 'Pessoa serve em varias areas e pode precisar de alinhamento de carga.',
        volunteer,
      })
    }
  })

  const priorityOrder = {
    Alta: 0,
    Media: 1,
    Baixa: 2,
  }

  return queue.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
}

function getPriorityClassName(priority: TrainingQueueItem['priority']) {
  if (priority === 'Alta') {
    return 'badge-danger'
  }

  if (priority === 'Media') {
    return 'badge-warning'
  }

  return 'badge'
}

function getTrainingSummary(queue: TrainingQueueItem[]) {
  const initial = queue.filter((item) => item.group === 'Treinamento inicial')
  const leadership = queue.filter((item) => item.group === 'Formacao de lideranca')
  const orientation = queue.filter((item) => item.group === 'Orientacao antes de area')
  const careFirst = queue.filter((item) => item.group === 'Cuidado antes de treinamento')

  return [
    'Fila de Treinamento - Voluntariado Revive',
    '',
    `Treinamento inicial: ${initial.length}`,
    `Orientacao antes de area: ${orientation.length}`,
    `Cuidado antes de treinamento: ${careFirst.length}`,
    `Formacao de lideranca: ${leadership.length}`,
    '',
    'Prioridades sugeridas:',
    '1. Resolver cuidado antes de treinamento quando houver precisa contato.',
    '2. Enviar trilha inicial para novos voluntarios.',
    '3. Orientar pessoas sem area antes de treinamento especifico.',
    '4. Separar lideres/coordenadores para formacao continua.',
  ].join('\n')
}

export default async function DadosTreinamentoPage() {
  const volunteers = await getVolunteers({ status: 'all' })
  const queue = buildTrainingQueue(volunteers)
  const uniquePeople = new Set(queue.map((item) => item.volunteer.id)).size
  const initialCount = queue.filter((item) => item.group === 'Treinamento inicial').length
  const orientationCount = queue.filter((item) => item.group === 'Orientacao antes de area').length
  const careFirstCount = queue.filter((item) => item.group === 'Cuidado antes de treinamento').length
  const leadershipCount = queue.filter((item) => item.group === 'Formacao de lideranca').length
  const summary = getTrainingSummary(queue)

  return (
    <div className="section-grid">
      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Dados/Escalas</span>
            <h1 className="panel-title">Fila de Treinamento</h1>
            <p className="muted">
              Uma leitura para priorizar integracao inicial, orientacao de areas e formacao de lideranca.
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
          <span className="muted">Inicial</span>
          <div className="stat-value">{initialCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Sem area</span>
          <div className="stat-value">{orientationCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Cuidado antes</span>
          <div className="stat-value">{careFirstCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Lideranca</span>
          <div className="stat-value">{leadershipCount}</div>
        </article>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Como usar</span>
            <h2 className="panel-title">Treinamento entra depois de clareza e cuidado</h2>
            <p className="muted">
              Pessoas em `precisa contato` devem receber conversa antes de treinamento. Pessoas novas devem receber
              trilha inicial. Pessoas sem area precisam de orientacao antes de treinamento especifico.
            </p>
          </div>
        </div>
      </section>

      <section className="panel table-wrapper">
        {queue.length === 0 ? (
          <div className="empty-state">Nenhuma prioridade de treinamento encontrada.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Prioridade</th>
                <th>Grupo</th>
                <th>Voluntario</th>
                <th>Status</th>
                <th>Areas</th>
                <th>Motivo</th>
                <th>Acao</th>
                <th>Contato</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => {
                const whatsappHref = getWhatsappHref(item.volunteer.whatsapp)

                return (
                  <tr key={`${item.group}-${item.volunteer.id}-${item.reason}`}>
                    <td>
                      <span className={getPriorityClassName(item.priority)}>{item.priority}</span>
                    </td>
                    <td>{item.group}</td>
                    <td>
                      <div className="stack">
                        <Link href={`/voluntarios/${item.volunteer.id}`}>
                          <strong>{item.volunteer.name}</strong>
                        </Link>
                        <span className="muted">Entrada: {formatDate(item.volunteer.joinDate)}</span>
                      </div>
                    </td>
                    <td>{formatCareStatus(item.volunteer.careStatus)}</td>
                    <td>
                      <div className="stack">
                        {item.volunteer.areas.length > 0 ? (
                          item.volunteer.areas.map((area) => (
                            <span className="muted" key={`${item.volunteer.id}-${area.areaId}`}>
                              {area.areaName} / {formatAreaRole(area.roleInArea)}
                            </span>
                          ))
                        ) : (
                          <span className="muted">Sem area</span>
                        )}
                      </div>
                    </td>
                    <td>{item.reason}</td>
                    <td>{item.action}</td>
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
