import type { AvailabilityStatus, VolunteerAreaRole, VolunteerCareStatus, VolunteerGender } from '@/lib/types'

export const volunteerGenderOptions: Array<{ value: VolunteerGender; label: string }> = [
  { value: 'female', label: 'Feminino' },
  { value: 'male', label: 'Masculino' },
  { value: 'other', label: 'Outro' },
  { value: 'prefer_not_to_say', label: 'Prefere nao informar' },
]

export const availabilityOptions: Array<{ value: AvailabilityStatus; label: string }> = [
  { value: 'available', label: 'Disponivel' },
  { value: 'limited', label: 'Disponibilidade limitada' },
  { value: 'unavailable', label: 'Indisponivel' },
]

export const areaRoleOptions: Array<{ value: VolunteerAreaRole; label: string }> = [
  { value: 'member', label: 'Membro' },
  { value: 'leader', label: 'Lider' },
  { value: 'coordinator', label: 'Coordenador' },
]

export const careStatusOptions: Array<{ value: VolunteerCareStatus; label: string }> = [
  { value: 'new', label: 'Novo' },
  { value: 'active', label: 'Ativo em acompanhamento' },
  { value: 'needs_contact', label: 'Precisa contato' },
  { value: 'paused', label: 'Em pausa' },
  { value: 'inactive', label: 'Inativo' },
]
