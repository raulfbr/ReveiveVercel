import Link from 'next/link'

import { CopyTextButton } from '@/components/copy-text-button'
import { formatCareStatus, formatDate } from '@/lib/format'
import type { VolunteerRecord } from '@/lib/types'
import { getVolunteers } from '@/lib/volunteers/data'
import { getWhatsappHref } from '@/lib/volunteers/insights'

export const dynamic = 'force-dynamic'

type IntegrationQueueItem = {
  action: string
  group: string
  priority: 'Alta' | 'Media' | 'Baixa'
  reason: string
  volunteer: VolunteerRecord
}

function daysSince(value: string | null) {
  if (!value) {
    return null
  }

  const start = new Date(`${value}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diffInMs = today.getTime() - start.getTime()
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
}

function isNewVolunteer(volunteer: VolunteerRecord) {
  if (volunteer.careStatus === 'new') {
    return true
  }

  const days = daysSince(volunteer.joinDate)
  return days !== null && days >= 0 && days <= 30
}

function buildIntegrationQueue(volunteers: VolunteerRecord[]) {
  const queue: IntegrationQueueItem[] = []

  volunteers.forEach((volunteer) => {
    if (!volunteer.active) {
      return
    }

    const daysFromJoin = daysSince(volunteer.joinDate)
    const isNew = isNewVolunteer(volunteer)

    if (isNew && volunteer.areas.length === 0) {
      queue.push({
        action: 'Fazer primeiro contato, entender interesse e indicar uma area inicial.',
        group: 'Novo sem area',
        priority: 'Alta',
        reason: 'Pessoa nova ainda nao foi conectada a uma area.',
        volunteer,
      })
    }

    if (isNew && volunteer.areas.length > 0 && !volunteer.nextStep) {
      queue.push({
        action: 'Confirmar acolhimento com lider da area e registrar proximo passo.',
        group: 'Novo com area sem proximo passo',
        priority: 'Media',
        reason: 'Pessoa nova ja tem area, mas ainda nao tem acompanhamento registrado.',
        volunteer,
      })
    }

    if (volunteer.areas.length === 0 && volunteer.careStatus !== 'needs_contact') {
      queue.push({
        action: 'Mapear area de interesse e encaminhar para lider responsavel.',
        group: 'Sem area',
        priority: 'Media',
        reason: 'Pessoa ativa sem area vinculada.',
        volunteer,
      })
    }

    if (volunteer.nextStep && !volunteer.careResponsible) {
      queue.push({
        action: 'Definir responsavel por acompanhar integracao.',
        group: 'Sem responsavel',
        priority: 'Media',
        reason: 'Existe proximo passo, mas ninguem responsavel.',
        volunteer,
      })
    }

    if (daysFromJoin !== null && daysFromJoin > 30 && volunteer.careStatus === 'new') {
      queue.push({
        action: 'Revisar se ainda e novo, se ja foi integrado ou se precisa contato.',
        group: 'Novo ha mais de 30 dias',
        priority: 'Alta',
        reason: `Entrada registrada ha ${daysFromJoin} dias e status ainda esta como novo.`,
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

function getPriorityClassName(priority: IntegrationQueueItem['priority']) {
  if (priority === 'Alta') {
    return 'badge-danger'
  }

  if (priority === 'Media') {
    return 'badge-warning'
  }

  return 'badge'
}

function getIntegrationSummary(queue: IntegrationQueueItem[]) {
  const newWithoutArea = queue.filter((item) => item.group === 'Novo sem area')
  const withoutArea = queue.filter((item) => item.group === 'Sem area')
  const oldNew = queue.filter((item) => item.group === 'Novo ha mais de 30 dias')
  const withoutResponsible = queue.filter((item) => item.group === 'Sem responsavel')

  return [
    'Fila de Integracao - Voluntariado Revive',
    '',
    `Novos sem area: ${newWithoutArea.length}`,
    `Ativos sem area: ${withoutArea.length}`,
    `Novos ha mais de 30 dias: ${oldNew.length}`,
    `Proximos passos sem responsavel: ${withoutResponsible.length}`,
    '',
    'Prioridades sugeridas:',
    '1. Fazer primeiro contato com novos sem area.',
    '2. Encaminhar pessoas ativas sem area para lideres.',
    '3. Revisar quem continua como novo depois de 30 dias.',
    '4. Definir responsavel para cada proximo passo.',
  ].join('\n')
}

export default async function DadosIntegracaoPage() {
  const volunteers = await getVolunteers({ status: 'all' })
  const queue = buildIntegrationQueue(volunteers)
  const uniquePeople = new Set(queue.map((item) => item.volunteer.id)).size
  const newWithoutAreaCount = queue.filter((item) => item.group === 'Novo sem area').length
  const withoutAreaCount = queue.filter((item) => item.group === 'Sem area').length
  const oldNewCount = queue.filter((item) => item.group === 'Novo ha mais de 30 dias').length
  const withoutResponsibleCount = queue.filter((item) => item.group === 'Sem responsavel').length
  const summary = getIntegrationSummary(queue)

  return (
    <div className="section-grid">
      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Dados/Escalas</span>
            <h1 className="panel-title">Fila de Integracao</h1>
            <p className="muted">
              Uma lista para acompanhar chegada, primeiro contato, area inicial e responsavel de integracao.
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
          <span className="muted">Novos sem area</span>
          <div className="stat-value">{newWithoutAreaCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Ativos sem area</span>
          <div className="stat-value">{withoutAreaCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Novo 30+ dias</span>
          <div className="stat-value">{oldNewCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Sem responsavel</span>
          <div className="stat-value">{withoutResponsibleCount}</div>
        </article>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Como usar</span>
            <h2 className="panel-title">Integracao precisa virar proximo passo</h2>
            <p className="muted">
              Priorize novos sem area, pessoas ativas sem area e voluntarios que seguem como novos
              depois de 30 dias. Cada pessoa deve ter um encaminhamento claro.
            </p>
          </div>
        </div>
      </section>

      <section className="panel table-wrapper">
        {queue.length === 0 ? (
          <div className="empty-state">Nenhuma pendencia de integracao encontrada.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Prioridade</th>
                <th>Grupo</th>
                <th>Voluntario</th>
                <th>Status</th>
                <th>Entrada</th>
                <th>Area atual</th>
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
                      <Link href={`/voluntarios/${item.volunteer.id}`}>
                        <strong>{item.volunteer.name}</strong>
                      </Link>
                    </td>
                    <td>{formatCareStatus(item.volunteer.careStatus)}</td>
                    <td>{formatDate(item.volunteer.joinDate)}</td>
                    <td>
                      {item.volunteer.areas.length > 0
                        ? item.volunteer.areas.map((area) => area.areaName).join(', ')
                        : 'Sem area'}
                    </td>
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
