import Link from 'next/link'

import { CopyTextButton } from '@/components/copy-text-button'
import { formatCareStatus, formatDate } from '@/lib/format'
import type { VolunteerCareStatus, VolunteerRecord } from '@/lib/types'
import { getServiceAreas, getVolunteers } from '@/lib/volunteers/data'
import {
  getAreaLoadStatus,
  getVolunteerAttentionLabels,
  getWhatsappHref,
} from '@/lib/volunteers/insights'

export const dynamic = 'force-dynamic'

type MapaVivoPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const careStatusOptions: Array<{
  label: string
  value: VolunteerCareStatus | 'all'
}> = [
  { label: 'Todos', value: 'all' },
  { label: 'Novo', value: 'new' },
  { label: 'Ativo', value: 'active' },
  { label: 'Precisa contato', value: 'needs_contact' },
  { label: 'Em pausa', value: 'paused' },
  { label: 'Inativo', value: 'inactive' },
]

function getSingleSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

function getVolunteerSearchText(volunteer: VolunteerRecord) {
  return normalizeSearch(
    [
      volunteer.name,
      volunteer.whatsapp ?? '',
      volunteer.careResponsible ?? '',
      volunteer.nextStep ?? '',
      ...volunteer.areas.map((area) => area.areaName),
    ].join(' '),
  )
}

function filterVolunteers(
  volunteers: VolunteerRecord[],
  filters: {
    areaId: string
    careStatus: string
    query: string
  },
) {
  const normalizedQuery = normalizeSearch(filters.query)

  return volunteers.filter((volunteer) => {
    const queryMatches = !normalizedQuery || getVolunteerSearchText(volunteer).includes(normalizedQuery)
    const careStatusMatches = filters.careStatus === 'all' || volunteer.careStatus === filters.careStatus
    const areaMatches =
      filters.areaId === 'all' || volunteer.areas.some((assignment) => assignment.areaId === filters.areaId)

    return queryMatches && careStatusMatches && areaMatches
  })
}

function getMapaSummary(volunteers: VolunteerRecord[]) {
  const active = volunteers.filter((volunteer) => volunteer.active)
  const unassigned = volunteers.filter((volunteer) => volunteer.active && volunteer.areas.length === 0)
  const needsContact = volunteers.filter((volunteer) => volunteer.careStatus === 'needs_contact')
  const withoutNextStep = needsContact.filter((volunteer) => !volunteer.nextStep)

  return [
    'Mapa Vivo dos Voluntarios - Revive',
    '',
    `Voluntarios visiveis: ${volunteers.length}`,
    `Ativos: ${active.length}`,
    `Sem area: ${unassigned.length}`,
    `Precisam contato: ${needsContact.length}`,
    `Precisam contato sem proximo passo: ${withoutNextStep.length}`,
    '',
    'Primeiras acoes sugeridas:',
    '1. Revisar pessoas sem area.',
    '2. Definir proximo passo para quem precisa contato.',
    '3. Conferir responsaveis e retornos.',
  ].join('\n')
}

export default async function MapaVivoPage({ searchParams }: MapaVivoPageProps) {
  const params = await searchParams
  const [serviceAreas, volunteers] = await Promise.all([getServiceAreas(), getVolunteers({ status: 'all' })])
  const query = getSingleSearchParam(params.q) ?? ''
  const careStatus = getSingleSearchParam(params.care_status) ?? 'all'
  const areaId = getSingleSearchParam(params.area_id) ?? 'all'
  const filteredVolunteers = filterVolunteers(volunteers, {
    areaId,
    careStatus,
    query,
  })
  const activeCount = filteredVolunteers.filter((volunteer) => volunteer.active).length
  const unassignedCount = filteredVolunteers.filter((volunteer) => volunteer.active && volunteer.areas.length === 0).length
  const needsContactCount = filteredVolunteers.filter((volunteer) => volunteer.careStatus === 'needs_contact').length
  const overloadedCount = filteredVolunteers.filter((volunteer) => volunteer.areas.length >= 3).length
  const mapaSummary = getMapaSummary(filteredVolunteers)

  return (
    <div className="section-grid">
      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Dados/Escalas</span>
            <h1 className="panel-title">Mapa Vivo dos Voluntarios</h1>
            <p className="muted">
              Uma visao unificada para encontrar pessoas, areas, status, contatos e proximos passos.
            </p>
          </div>
          <div className="nav-links">
            <CopyTextButton text={mapaSummary} />
            <Link className="button-secondary" href="/dados/qualidade">
              Qualidade da base
            </Link>
            <Link className="button-secondary" href="/dados">
              Painel
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="muted">Visiveis</span>
          <div className="stat-value">{filteredVolunteers.length}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Ativos</span>
          <div className="stat-value">{activeCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Sem area</span>
          <div className="stat-value">{unassignedCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Precisa contato</span>
          <div className="stat-value">{needsContactCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">3+ areas</span>
          <div className="stat-value">{overloadedCount}</div>
        </article>
      </section>

      <section className="panel">
        <form className="filters-form">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="q">Buscar</label>
              <input
                className="input"
                defaultValue={query}
                id="q"
                name="q"
                placeholder="Nome, WhatsApp, area ou proximo passo"
              />
            </div>
            <div className="field">
              <label htmlFor="care_status">Status de cuidado</label>
              <select className="select" defaultValue={careStatus} id="care_status" name="care_status">
                {careStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="area_id">Area</label>
              <select className="select" defaultValue={areaId} id="area_id" name="area_id">
                <option value="all">Todas</option>
                {serviceAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="nav-links">
            <button className="button" type="submit">
              Filtrar mapa
            </button>
            <Link className="button-secondary" href="/dados/mapa">
              Limpar filtros
            </Link>
          </div>
        </form>
      </section>

      <section className="panel table-wrapper">
        {filteredVolunteers.length === 0 ? (
          <div className="empty-state">Nenhum voluntario encontrado para os filtros atuais.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Voluntario</th>
                <th>Contato</th>
                <th>Status</th>
                <th>Areas</th>
                <th>Ultimo contato</th>
                <th>Proximo passo</th>
                <th>Responsavel</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map((volunteer) => {
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
                        <span className={volunteer.active ? 'badge' : 'badge-warning'}>
                          {volunteer.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    <td>
                      {whatsappHref ? (
                        <a className="inline-link" href={whatsappHref} rel="noreferrer" target="_blank">
                          Chamar no WhatsApp
                        </a>
                      ) : (
                        <span className="muted">Nao informado</span>
                      )}
                    </td>
                    <td>
                      <div className="stack">
                        <span>{formatCareStatus(volunteer.careStatus)}</span>
                        <span className={loadStatus.className}>{loadStatus.label}</span>
                        {attentionLabels.length > 0 ? (
                          <span className="muted">{attentionLabels.join(' / ')}</span>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <div className="stack">
                        {volunteer.areas.length > 0 ? (
                          volunteer.areas.map((area) => (
                            <span className="muted" key={`${volunteer.id}-${area.areaId}`}>
                              {area.areaName}
                            </span>
                          ))
                        ) : (
                          <span className="muted">Sem area</span>
                        )}
                      </div>
                    </td>
                    <td>{formatDate(volunteer.lastContactAt)}</td>
                    <td>{volunteer.nextStep || 'Sem proximo passo'}</td>
                    <td>{volunteer.careResponsible || 'Sem responsavel'}</td>
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
