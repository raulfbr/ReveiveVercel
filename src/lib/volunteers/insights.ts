import type { ServiceArea, VolunteerRecord } from '@/lib/types'

export type AttentionFilter = 'all' | 'unassigned' | 'attention' | 'overloaded' | 'new' | 'birthday-month'

export const attentionFilterOptions: Array<{ value: AttentionFilter; label: string }> = [
  { value: 'all', label: 'Todas as leituras' },
  { value: 'unassigned', label: 'Sem area' },
  { value: 'attention', label: 'Atencao: 3 areas' },
  { value: 'overloaded', label: 'Possivel sobrecarga' },
  { value: 'new', label: 'Novos 30 dias' },
  { value: 'birthday-month', label: 'Aniversariantes do mes' },
]

export type AreaLoadLevel = 'unassigned' | 'normal' | 'attention' | 'overloaded'

type AreaLoadStatus = {
  level: AreaLoadLevel
  label: string
  className: string
}

export function parseAttentionFilter(value: string | null): AttentionFilter {
  return attentionFilterOptions.some((option) => option.value === value) ? (value as AttentionFilter) : 'all'
}

export function getAreaLoadStatus(volunteer: VolunteerRecord): AreaLoadStatus {
  const areaCount = volunteer.areas.length

  if (areaCount === 0) {
    return {
      level: 'unassigned',
      label: 'Sem area',
      className: 'badge-warning',
    }
  }

  if (areaCount >= 4) {
    return {
      level: 'overloaded',
      label: 'Possivel sobrecarga',
      className: 'badge-danger',
    }
  }

  if (areaCount === 3) {
    return {
      level: 'attention',
      label: 'Atencao: 3 areas',
      className: 'badge-warning',
    }
  }

  return {
    level: 'normal',
    label: 'Carga normal',
    className: 'badge',
  }
}

export function isNewVolunteer(joinDate: string | null, referenceDate = new Date()) {
  if (!joinDate) {
    return false
  }

  const joinedAt = new Date(`${joinDate}T00:00:00`)
  const diffInDays = (referenceDate.getTime() - joinedAt.getTime()) / (1000 * 60 * 60 * 24)

  return diffInDays >= 0 && diffInDays <= 30
}

export function isBirthdayThisMonth(birthDate: string | null, referenceDate = new Date()) {
  if (!birthDate) {
    return false
  }

  const [, month] = birthDate.split('-')
  return Number(month) === referenceDate.getMonth() + 1
}

export function getWhatsappHref(whatsapp: string | null) {
  if (!whatsapp) {
    return null
  }

  const digits = whatsapp.replace(/\D/g, '')

  if (!digits) {
    return null
  }

  const numberWithCountryCode = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${numberWithCountryCode}`
}

export function getVolunteerAttentionLabels(volunteer: VolunteerRecord) {
  const labels: string[] = []
  const loadStatus = getAreaLoadStatus(volunteer)

  if (volunteer.careStatus === 'needs_contact') {
    labels.push('Precisa contato')
  }

  if (volunteer.careStatus === 'paused') {
    labels.push('Em pausa')
  }

  if (volunteer.nextFollowUpAt && isFollowUpDue(volunteer.nextFollowUpAt)) {
    labels.push('Retorno vencido')
  }

  if (loadStatus.level !== 'normal') {
    labels.push(loadStatus.label)
  }

  if (isNewVolunteer(volunteer.joinDate)) {
    labels.push('Novo 30 dias')
  }

  if (isBirthdayThisMonth(volunteer.birthDate)) {
    labels.push('Aniversariante')
  }

  return labels
}

export function isFollowUpDue(nextFollowUpAt: string | null, referenceDate = new Date()) {
  if (!nextFollowUpAt) {
    return false
  }

  const followUpAt = new Date(`${nextFollowUpAt}T00:00:00`)
  return followUpAt.getTime() <= referenceDate.getTime()
}

export function filterVolunteersByAttention(volunteers: VolunteerRecord[], filter: AttentionFilter) {
  if (filter === 'all') {
    return volunteers
  }

  return volunteers.filter((volunteer) => {
    const loadStatus = getAreaLoadStatus(volunteer)

    switch (filter) {
      case 'unassigned':
        return loadStatus.level === 'unassigned'
      case 'attention':
        return loadStatus.level === 'attention'
      case 'overloaded':
        return loadStatus.level === 'overloaded'
      case 'new':
        return isNewVolunteer(volunteer.joinDate)
      case 'birthday-month':
        return isBirthdayThisMonth(volunteer.birthDate)
      default:
        return true
    }
  })
}

export function getVolunteerInsights(volunteers: VolunteerRecord[]) {
  const activeVolunteers = volunteers.filter((volunteer) => volunteer.active)
  const unassigned = activeVolunteers.filter((volunteer) => getAreaLoadStatus(volunteer).level === 'unassigned')
  const attention = activeVolunteers.filter((volunteer) => getAreaLoadStatus(volunteer).level === 'attention')
  const overloaded = activeVolunteers.filter((volunteer) => getAreaLoadStatus(volunteer).level === 'overloaded')
  const newVolunteers = activeVolunteers.filter((volunteer) => isNewVolunteer(volunteer.joinDate))
  const birthdaysThisMonth = activeVolunteers.filter((volunteer) => isBirthdayThisMonth(volunteer.birthDate))
  const focusList = activeVolunteers.filter((volunteer) => getVolunteerAttentionLabels(volunteer).length > 0)
  const needsContact = activeVolunteers.filter((volunteer) => volunteer.careStatus === 'needs_contact')
  const followUpDue = activeVolunteers.filter((volunteer) => isFollowUpDue(volunteer.nextFollowUpAt))

  return {
    activeVolunteers,
    unassigned,
    attention,
    overloaded,
    newVolunteers,
    birthdaysThisMonth,
    focusList,
    needsContact,
    followUpDue,
  }
}

export function getAreaDistribution(volunteers: VolunteerRecord[], serviceAreas?: ServiceArea[]) {
  const activeVolunteers = volunteers.filter((volunteer) => volunteer.active)
  const areaMap = new Map<
    string,
    {
      areaId: string
      areaName: string
      volunteerCount: number
      overloadedCount: number
    }
  >()

  serviceAreas?.forEach((area) => {
    areaMap.set(area.id, {
      areaId: area.id,
      areaName: area.name,
      volunteerCount: 0,
      overloadedCount: 0,
    })
  })

  activeVolunteers.forEach((volunteer) => {
    const loadStatus = getAreaLoadStatus(volunteer)

    volunteer.areas.forEach((area) => {
      const current = areaMap.get(area.areaId) ?? {
        areaId: area.areaId,
        areaName: area.areaName,
        volunteerCount: 0,
        overloadedCount: 0,
      }

      areaMap.set(area.areaId, {
        ...current,
        volunteerCount: current.volunteerCount + 1,
        overloadedCount: current.overloadedCount + (loadStatus.level === 'overloaded' ? 1 : 0),
      })
    })
  })

  return Array.from(areaMap.values())
    .map((area) => ({
      ...area,
      level: area.volunteerCount === 0 ? 'empty' : area.volunteerCount <= 2 ? 'low' : 'healthy',
      label:
        area.volunteerCount === 0
          ? 'Sem voluntarios ativos'
          : area.volunteerCount <= 2
            ? 'Baixa cobertura'
            : 'Cobertura inicial saudavel',
    }))
    .sort((first, second) => first.volunteerCount - second.volunteerCount || first.areaName.localeCompare(second.areaName))
}

export type WeeklyActionItem = {
  title: string
  description: string
  priority: 'Alta' | 'Media' | 'Baixa'
}

export function getWeeklyActionItems(
  insights: ReturnType<typeof getVolunteerInsights>,
  areaDistribution: ReturnType<typeof getAreaDistribution>,
): WeeklyActionItem[] {
  const lowCoverageAreas = areaDistribution.filter((area) => area.level !== 'healthy')
  const careAttentionNames = Array.from(
    new Set([...insights.needsContact, ...insights.followUpDue].map((volunteer) => volunteer.name)),
  )
  const overloadedNames = [...insights.overloaded, ...insights.attention].map((volunteer) => volunteer.name)
  const actionItems: WeeklyActionItem[] = []

  if (insights.unassigned.length > 0) {
    actionItems.push({
      title: 'Integrar voluntarios sem area',
      description: `${insights.unassigned.length} pessoa(s) precisam de area e lider responsavel. Primeiro caso: ${insights.unassigned[0]?.name}.`,
      priority: 'Alta',
    })
  }

  if (careAttentionNames.length > 0) {
    actionItems.push({
      title: 'Retomar contatos de cuidado',
      description: `${careAttentionNames.length} pessoa(s) aparecem como precisa contato ou retorno vencido: ${careAttentionNames
        .slice(0, 3)
        .join(', ')}.`,
      priority: 'Alta',
    })
  }

  if (overloadedNames.length > 0) {
    actionItems.push({
      title: 'Revisar possivel sobrecarga',
      description: `${overloadedNames.length} pessoa(s) servem em 3 ou mais areas: ${overloadedNames.slice(0, 3).join(', ')}.`,
      priority: 'Media',
    })
  }

  if (lowCoverageAreas.length > 0) {
    actionItems.push({
      title: 'Direcionar captacao por area',
      description: `${lowCoverageAreas.length} area(s) tem baixa cobertura: ${lowCoverageAreas
        .slice(0, 3)
        .map((area) => area.areaName)
        .join(', ')}.`,
      priority: 'Media',
    })
  }

  if (insights.newVolunteers.length > 0) {
    actionItems.push({
      title: 'Acompanhar novos voluntarios',
      description: `${insights.newVolunteers.length} pessoa(s) entraram nos ultimos 30 dias e precisam de proximo passo claro.`,
      priority: 'Media',
    })
  }

  if (insights.birthdaysThisMonth.length > 0) {
    actionItems.push({
      title: 'Celebrar aniversariantes',
      description: `${insights.birthdaysThisMonth.length} oportunidade(s) de cuidado relacional neste mes.`,
      priority: 'Baixa',
    })
  }

  return actionItems.slice(0, 5)
}
