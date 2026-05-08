import type { AvailabilityStatus, VolunteerAreaRole, VolunteerCareStatus, VolunteerGender } from '@/lib/types'

export function formatDate(value: string | null) {
  if (!value) {
    return 'Nao informado'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
  }).format(new Date(`${value}T00:00:00`))
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatGender(value: VolunteerGender | null) {
  switch (value) {
    case 'female':
      return 'Feminino'
    case 'male':
      return 'Masculino'
    case 'other':
      return 'Outro'
    case 'prefer_not_to_say':
      return 'Prefere nao informar'
    default:
      return 'Nao informado'
  }
}

export function formatAvailabilityStatus(value: AvailabilityStatus | null) {
  switch (value) {
    case 'available':
      return 'Disponivel'
    case 'limited':
      return 'Disponibilidade limitada'
    case 'unavailable':
      return 'Indisponivel'
    default:
      return 'Nao informado'
  }
}

export function formatAreaRole(value: VolunteerAreaRole) {
  switch (value) {
    case 'leader':
      return 'Lider'
    case 'coordinator':
      return 'Coordenador'
    default:
      return 'Membro'
  }
}

export function formatCareStatus(value: VolunteerCareStatus) {
  switch (value) {
    case 'new':
      return 'Novo'
    case 'needs_contact':
      return 'Precisa contato'
    case 'paused':
      return 'Em pausa'
    case 'inactive':
      return 'Inativo'
    default:
      return 'Ativo em acompanhamento'
  }
}
