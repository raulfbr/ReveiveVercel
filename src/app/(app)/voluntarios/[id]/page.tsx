import { notFound } from 'next/navigation'

import { VolunteerForm } from '@/components/volunteers/volunteer-form'
import { requireAppUser } from '@/lib/auth/current-user'
import {
  formatAreaRole,
  formatAvailabilityStatus,
  formatCareStatus,
  formatDate,
  formatDateTime,
  formatGender,
} from '@/lib/format'
import { getServiceAreas, getVolunteerById } from '@/lib/volunteers/data'
import { getAreaLoadStatus, getVolunteerAttentionLabels, getWhatsappHref } from '@/lib/volunteers/insights'

import { updateVolunteerAction } from '../actions'

export const dynamic = 'force-dynamic'

type VolunteerDetailPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getSingleSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

function getSuccessMessage(saved: string | null) {
  switch (saved) {
    case 'updated':
      return 'Voluntario atualizado com sucesso.'
    case 'deactivated':
      return 'Voluntario inativado.'
    case 'reactivated':
      return 'Voluntario reativado.'
    case 'created':
      return 'Voluntario criado com sucesso.'
    default:
      return null
  }
}

export default async function VolunteerDetailPage({ params, searchParams }: VolunteerDetailPageProps) {
  const appUser = await requireAppUser()
  const { id } = await params
  const search = await searchParams
  const volunteer = await getVolunteerById(id)

  if (!volunteer) {
    notFound()
  }

  const serviceAreas = await getServiceAreas()
  const errorMessage = getSingleSearchParam(search.error)
  const successMessage = getSuccessMessage(getSingleSearchParam(search.saved))
  const loadStatus = getAreaLoadStatus(volunteer)
  const attentionLabels = getVolunteerAttentionLabels(volunteer)
  const whatsappHref = getWhatsappHref(volunteer.whatsapp)

  return (
    <div className="section-grid">
      {errorMessage ? <p className="error-message">{decodeURIComponent(errorMessage)}</p> : null}
      {successMessage ? <p className="success-message">{successMessage}</p> : null}

      <section className="panel detail-grid">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Detalhe</span>
            <h1 className="panel-title">{volunteer.name}</h1>
            <div className="status-row">
              <span className={volunteer.active ? 'badge' : 'badge-danger'}>
                {volunteer.active ? 'Ativo' : 'Inativo'}
              </span>
              <span className={loadStatus.className}>{loadStatus.label}</span>
              <span className="badge">{formatCareStatus(volunteer.careStatus)}</span>
              <span className="badge-warning">{appUser.role === 'admin' ? 'Edicao liberada' : 'Somente leitura'}</span>
            </div>
          </div>

          <div className="photo-frame">
            {volunteer.photoUrl ? (
              <>
                {/* The photo uses a short-lived signed URL from Supabase Storage. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={`Foto de ${volunteer.name}`} src={volunteer.photoUrl} />
              </>
            ) : (
              <span className="muted">Sem foto</span>
            )}
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Genero</label>
            <div>{formatGender(volunteer.gender)}</div>
          </div>

          <div className="field">
            <label>Disponibilidade</label>
            <div>{formatAvailabilityStatus(volunteer.availabilityStatus)}</div>
          </div>

          <div className="field">
            <label>Nascimento</label>
            <div>{formatDate(volunteer.birthDate)}</div>
          </div>

          <div className="field">
            <label>Entrada</label>
            <div>{formatDate(volunteer.joinDate)}</div>
          </div>

          <div className="field">
            <label>WhatsApp</label>
            <div>
              {whatsappHref ? (
                <a className="inline-link" href={whatsappHref} rel="noreferrer" target="_blank">
                  {volunteer.whatsapp}
                </a>
              ) : (
                'Nao informado'
              )}
            </div>
          </div>

          <div className="field">
            <label>Ultima atualizacao</label>
            <div>{formatDateTime(volunteer.updatedAt)}</div>
          </div>

          <div className="field">
            <label>Ultimo contato</label>
            <div>{formatDate(volunteer.lastContactAt)}</div>
          </div>

          <div className="field">
            <label>Proximo retorno</label>
            <div>{formatDate(volunteer.nextFollowUpAt)}</div>
          </div>

          <div className="field">
            <label>Responsavel pelo cuidado</label>
            <div>{volunteer.careResponsible || 'Nao informado'}</div>
          </div>

          <div className="field-full">
            <label>Proximo passo</label>
            <div>{volunteer.nextStep || 'Sem proximo passo registrado.'}</div>
          </div>

          <div className="field-full">
            <label>Endereco</label>
            <div>{volunteer.address || 'Nao informado'}</div>
          </div>

          <div className="field-full">
            <label>Observacoes</label>
            <div>{volunteer.notes || 'Sem observacoes.'}</div>
          </div>

          <div className="field-full">
            <label>Leitura de cuidado</label>
            <div className="stack">
              <span className={loadStatus.className}>{loadStatus.label}</span>
              {attentionLabels.length > 0 ? (
                attentionLabels.map((label) => <span key={label}>{label}</span>)
              ) : (
                <span className="muted">Sem alerta adicional pelos dados atuais.</span>
              )}
            </div>
          </div>

          <div className="field-full">
            <label>Areas</label>
            <div className="stack">
              {volunteer.areas.length > 0 ? (
                volunteer.areas.map((area) => (
                  <span key={`${volunteer.id}-${area.areaId}`}>
                    {area.areaName} - {formatAreaRole(area.roleInArea)}
                  </span>
                ))
              ) : (
                <span className="muted">Nenhuma area vinculada.</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {appUser.role === 'admin' ? (
        <>
          <VolunteerForm action={updateVolunteerAction} mode="edit" serviceAreas={serviceAreas} volunteer={volunteer} />

          <section className="panel">
            <div className="stack">
              <h2 className="panel-title">Acoes rapidas</h2>
              <p className="muted">As mudancas de status tambem passam pela validacao de papel no servidor.</p>
            </div>

            <div className="actions-row" style={{ marginTop: '1rem' }}>
              {volunteer.active ? (
                <form action={updateVolunteerAction}>
                  <input name="volunteer_id" type="hidden" value={volunteer.id} />
                  <input name="intent" type="hidden" value="deactivate" />
                  <button className="button-danger" type="submit">
                    Inativar voluntario
                  </button>
                </form>
              ) : (
                <form action={updateVolunteerAction}>
                  <input name="volunteer_id" type="hidden" value={volunteer.id} />
                  <input name="intent" type="hidden" value="reactivate" />
                  <button className="button-secondary" type="submit">
                    Reativar voluntario
                  </button>
                </form>
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
