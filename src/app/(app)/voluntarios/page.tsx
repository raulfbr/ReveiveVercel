import Link from 'next/link'

import { requireAppUser } from '@/lib/auth/current-user'
import { formatAreaRole, formatAvailabilityStatus, formatDate } from '@/lib/format'
import { getServiceAreas, getVolunteers } from '@/lib/volunteers/data'

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
  const errorMessage = getSingleSearchParam(params.error)
  const successMessage = getSuccessMessage(getSingleSearchParam(params.saved))

  const [serviceAreas, volunteers] = await Promise.all([getServiceAreas(), getVolunteers({ areaId, status })])

  const activeCount = volunteers.filter((volunteer) => volunteer.active).length

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
          <span className="muted">Seu papel</span>
          <div className="stat-value">{appUser.role}</div>
        </article>
      </section>

      {errorMessage ? <p className="error-message">{decodeURIComponent(errorMessage)}</p> : null}
      {successMessage ? <p className="success-message">{successMessage}</p> : null}

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Leitura operacional</span>
            <h1 className="panel-title">Voluntarios</h1>
            <p className="muted">Listagem simples com filtro por area e status para validar o fluxo principal do MVP.</p>
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

      <section className="panel table-wrapper">
        {volunteers.length === 0 ? (
          <div className="empty-state">Nenhum voluntario encontrado para o filtro atual.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Voluntario</th>
                <th>Status</th>
                <th>Disponibilidade</th>
                <th>Areas</th>
                <th>Entrada</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td>
                    <div className="stack">
                      <Link href={`/voluntarios/${volunteer.id}`}>
                        <strong>{volunteer.name}</strong>
                      </Link>
                      <span className="muted">{volunteer.whatsapp || 'WhatsApp nao informado'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={volunteer.active ? 'badge' : 'badge-danger'}>
                      {volunteer.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>{formatAvailabilityStatus(volunteer.availabilityStatus)}</td>
                  <td>
                    <div className="stack">
                      {volunteer.areas.length > 0 ? (
                        volunteer.areas.map((area) => (
                          <span className="muted" key={`${volunteer.id}-${area.areaId}`}>
                            {area.areaName} · {formatAreaRole(area.roleInArea)}
                          </span>
                        ))
                      ) : (
                        <span className="muted">Sem area vinculada</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(volunteer.joinDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

