import type { ServiceArea, VolunteerRecord } from '@/lib/types'
import { availabilityOptions, areaRoleOptions, careStatusOptions, volunteerGenderOptions } from '@/lib/volunteers/constants'

import { SubmitButton } from '@/components/submit-button'

type VolunteerFormProps = {
  action: (formData: FormData) => void | Promise<void>
  mode: 'create' | 'edit'
  serviceAreas: ServiceArea[]
  volunteer?: VolunteerRecord
}

export function VolunteerForm({ action, mode, serviceAreas, volunteer }: VolunteerFormProps) {
  const selectedAreaIds = new Set(volunteer?.areas.map((area) => area.areaId) ?? [])
  const title = mode === 'create' ? 'Novo voluntario' : `Editar ${volunteer?.name}`

  return (
    <section className="panel section-grid">
      <div className="stack">
        <span className="eyebrow">{mode === 'create' ? 'Cadastro' : 'Atualizacao'}</span>
        <h1 className="panel-title">{title}</h1>
        <p className="muted">
          O formulario salva direto no Supabase e respeita as permissoes de escrita do papel <code>admin</code>.
        </p>
      </div>

      <form action={action} encType="multipart/form-data">
        {volunteer ? <input name="volunteer_id" type="hidden" value={volunteer.id} /> : null}

        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Nome</label>
            <input className="input" defaultValue={volunteer?.name ?? ''} id="name" name="name" required />
          </div>

          <div className="field">
            <label htmlFor="whatsapp">WhatsApp</label>
            <input className="input" defaultValue={volunteer?.whatsapp ?? ''} id="whatsapp" name="whatsapp" />
          </div>

          <div className="field">
            <label htmlFor="gender">Genero</label>
            <select className="select" defaultValue={volunteer?.gender ?? ''} id="gender" name="gender">
              <option value="">Nao informado</option>
              {volunteerGenderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="availability_status">Disponibilidade</label>
            <select
              className="select"
              defaultValue={volunteer?.availabilityStatus ?? ''}
              id="availability_status"
              name="availability_status"
            >
              <option value="">Nao informado</option>
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="care_status">Status de cuidado</label>
            <select className="select" defaultValue={volunteer?.careStatus ?? 'active'} id="care_status" name="care_status">
              {careStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="birth_date">Data de nascimento</label>
            <input className="input" defaultValue={volunteer?.birthDate ?? ''} id="birth_date" name="birth_date" type="date" />
          </div>

          <div className="field">
            <label htmlFor="join_date">Data de entrada</label>
            <input className="input" defaultValue={volunteer?.joinDate ?? ''} id="join_date" name="join_date" type="date" />
          </div>

          <div className="field">
            <label htmlFor="last_contact_at">Ultimo contato</label>
            <input
              className="input"
              defaultValue={volunteer?.lastContactAt ?? ''}
              id="last_contact_at"
              name="last_contact_at"
              type="date"
            />
          </div>

          <div className="field">
            <label htmlFor="next_follow_up_at">Proximo retorno</label>
            <input
              className="input"
              defaultValue={volunteer?.nextFollowUpAt ?? ''}
              id="next_follow_up_at"
              name="next_follow_up_at"
              type="date"
            />
          </div>

          <div className="field">
            <label htmlFor="care_responsible">Responsavel pelo cuidado</label>
            <input
              className="input"
              defaultValue={volunteer?.careResponsible ?? ''}
              id="care_responsible"
              name="care_responsible"
            />
          </div>

          <div className="field-full">
            <label htmlFor="next_step">Proximo passo</label>
            <textarea
              className="textarea textarea-compact"
              defaultValue={volunteer?.nextStep ?? ''}
              id="next_step"
              name="next_step"
            />
          </div>

          <div className="field-full">
            <label htmlFor="address">Endereco</label>
            <textarea className="textarea" defaultValue={volunteer?.address ?? ''} id="address" name="address" />
          </div>

          <div className="field-full">
            <label htmlFor="notes">Observacoes</label>
            <textarea className="textarea" defaultValue={volunteer?.notes ?? ''} id="notes" name="notes" />
          </div>

          <div className="field">
            <label htmlFor="photo">Foto</label>
            <input accept="image/png,image/jpeg,image/webp" className="input" id="photo" name="photo" type="file" />
          </div>

          <div className="field">
            <label>Status</label>
            <div className="checkbox-row">
              <input defaultChecked={volunteer ? volunteer.active : true} id="active" name="active" type="checkbox" />
              <label htmlFor="active">Voluntario ativo</label>
            </div>

            {volunteer?.photoPath ? (
              <div className="checkbox-row">
                <input id="remove_photo" name="remove_photo" type="checkbox" />
                <label htmlFor="remove_photo">Remover foto atual</label>
              </div>
            ) : null}
          </div>
        </div>

        <div className="stack" style={{ marginTop: '1.25rem' }}>
          <strong>Areas de servico</strong>
          <div className="checkbox-grid">
            {serviceAreas.map((area) => {
              const currentRole =
                volunteer?.areas.find((assignment) => assignment.areaId === area.id)?.roleInArea ?? 'member'

              return (
                <div className="checkbox-card" key={area.id}>
                  <div className="checkbox-row">
                    <input
                      defaultChecked={selectedAreaIds.has(area.id)}
                      id={`area-${area.id}`}
                      name="area_ids"
                      type="checkbox"
                      value={area.id}
                    />
                    <label htmlFor={`area-${area.id}`}>{area.name}</label>
                  </div>

                  <div className="field">
                    <label htmlFor={`area-role-${area.id}`}>Papel na area</label>
                    <select
                      className="select"
                      defaultValue={currentRole}
                      id={`area-role-${area.id}`}
                      name={`area_role_${area.id}`}
                    >
                      {areaRoleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="actions-row" style={{ marginTop: '1.5rem' }}>
          <SubmitButton>{mode === 'create' ? 'Criar voluntario' : 'Salvar alteracoes'}</SubmitButton>
        </div>
      </form>
    </section>
  )
}
