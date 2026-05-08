import type { ScheduleAssignment, ScheduleEvent, ScheduleMinistry, ScheduleRequirement } from './demo-data'

export type ScheduleAlert = {
  detail: string
  severity: 'alta' | 'media' | 'baixa'
  title: string
}

export type RequirementCoverage = {
  assignedCount: number
  missingCount: number
  percentage: number
  status: 'complete' | 'partial' | 'empty'
}

export type MinistryCoverage = {
  assignedCount: number
  missingCount: number
  requiredCount: number
  status: 'complete' | 'partial' | 'empty'
}

export type ScheduleInsights = {
  activeMinistryCount: number
  alerts: ScheduleAlert[]
  assignmentCount: number
  confirmedCount: number
  duplicateVolunteerNames: string[]
  missingCount: number
  plannedCount: number
  requiredCount: number
}

function getAssignments(event: ScheduleEvent) {
  return event.ministries.flatMap((ministry) =>
    ministry.requirements.flatMap((requirement) =>
      requirement.assignments.map((assignment) => ({
        assignment,
        ministry,
        requirement,
      })),
    ),
  )
}

export function getRequirementCoverage(requirement: ScheduleRequirement): RequirementCoverage {
  const assignedCount = requirement.assignments.length
  const missingCount = Math.max(requirement.requiredCount - assignedCount, 0)
  const percentage =
    requirement.requiredCount > 0 ? Math.min(Math.round((assignedCount / requirement.requiredCount) * 100), 100) : 100

  return {
    assignedCount,
    missingCount,
    percentage,
    status: assignedCount === 0 ? 'empty' : missingCount > 0 ? 'partial' : 'complete',
  }
}

export function getMinistryCoverage(ministry: ScheduleMinistry): MinistryCoverage {
  const requiredCount = ministry.requirements.reduce((total, requirement) => total + requirement.requiredCount, 0)
  const assignedCount = ministry.requirements.reduce((total, requirement) => total + requirement.assignments.length, 0)
  const missingCount = Math.max(requiredCount - assignedCount, 0)

  return {
    assignedCount,
    missingCount,
    requiredCount,
    status: assignedCount === 0 ? 'empty' : missingCount > 0 ? 'partial' : 'complete',
  }
}

export function getScheduleInsights(event: ScheduleEvent): ScheduleInsights {
  const assignments = getAssignments(event)
  const requiredCount = event.ministries.reduce(
    (total, ministry) => total + ministry.requirements.reduce((sum, requirement) => sum + requirement.requiredCount, 0),
    0,
  )
  const assignmentCount = assignments.length
  const missingCount = event.ministries.reduce(
    (total, ministry) =>
      total + ministry.requirements.reduce((sum, requirement) => sum + getRequirementCoverage(requirement).missingCount, 0),
    0,
  )
  const confirmedCount = assignments.filter(({ assignment }) => assignment.status === 'confirmed').length
  const plannedCount = assignments.filter(({ assignment }) => assignment.status === 'planned').length
  const duplicateVolunteerNames = getDuplicateVolunteerNames(assignments.map(({ assignment }) => assignment.name))
  const alerts: ScheduleAlert[] = []

  event.ministries.forEach((ministry) => {
    ministry.requirements.forEach((requirement) => {
      const coverage = getRequirementCoverage(requirement)

      if (coverage.missingCount > 0) {
        alerts.push({
          detail: `${ministry.name} / ${requirement.front} precisa de mais ${coverage.missingCount} pessoa${
            coverage.missingCount === 1 ? '' : 's'
          }.`,
          severity: coverage.status === 'empty' ? 'alta' : 'media',
          title: coverage.status === 'empty' ? 'Função sem responsável' : 'Vaga aberta',
        })
      }
    })
  })

  duplicateVolunteerNames.forEach((name) => {
    const contexts = assignments
      .filter(({ assignment }) => assignment.name === name)
      .map(({ ministry, requirement }) => `${ministry.name} / ${requirement.front}`)
      .join(' e ')

    alerts.push({
      detail: `${name} aparece em ${contexts}. Confirmar se é intencional ou se precisa redistribuir.`,
      severity: 'alta',
      title: 'Possível choque de escala',
    })
  })

  assignments
    .filter(({ assignment }) => assignment.careSignal)
    .forEach(({ assignment, ministry }) => {
      alerts.push({
        detail: `${assignment.name} (${ministry.name}): ${assignment.careSignal}`,
        severity: 'baixa',
        title: 'Sinal de cuidado',
      })
    })

  event.notes.forEach((note) => {
    alerts.push({
      detail: note,
      severity: note.includes('Protótipo') ? 'baixa' : 'media',
      title: note.includes('Mesa de Ceia') ? 'Regra especial' : 'Observação',
    })
  })

  return {
    activeMinistryCount: event.ministries.length,
    alerts,
    assignmentCount,
    confirmedCount,
    duplicateVolunteerNames,
    missingCount,
    plannedCount,
    requiredCount,
  }
}

function getDuplicateVolunteerNames(names: string[]) {
  const counts = new Map<string, number>()

  names.forEach((name) => {
    counts.set(name, (counts.get(name) ?? 0) + 1)
  })

  return [...counts.entries()].filter(([, count]) => count > 1).map(([name]) => name)
}

export function getStatusLabel(status: ScheduleAssignment['status']) {
  switch (status) {
    case 'confirmed':
      return 'Confirmado'
    case 'planned':
      return 'Planejado'
    case 'pending':
      return 'Pendente'
  }
}

export function getStatusClassName(status: ScheduleAssignment['status']) {
  switch (status) {
    case 'confirmed':
      return 'badge'
    case 'planned':
      return 'badge-warning'
    case 'pending':
      return 'badge-danger'
  }
}

export function getCoverageStatusLabel(status: MinistryCoverage['status'] | RequirementCoverage['status']) {
  switch (status) {
    case 'complete':
      return 'Completo'
    case 'partial':
      return 'Parcial'
    case 'empty':
      return 'Sem responsável'
  }
}

export function buildScheduleWhatsAppText(event: ScheduleEvent, insights: ScheduleInsights) {
  const lines = [
    `Escala Revive - ${event.dateLabel}`,
    `${event.typeLabel} - ${event.startsAt}`,
    '',
    `Resumo: ${insights.assignmentCount}/${insights.requiredCount} vagas preenchidas. ${insights.missingCount} vaga${
      insights.missingCount === 1 ? '' : 's'
    } aberta${insights.missingCount === 1 ? '' : 's'}.`,
    '',
  ]

  event.ministries.forEach((ministry) => {
    lines.push(ministry.name)

    ministry.requirements.forEach((requirement) => {
      const coverage = getRequirementCoverage(requirement)
      const names =
        requirement.assignments.length > 0
          ? requirement.assignments.map((assignment) => assignment.name).join(', ')
          : 'falta definir'
      const missingText =
        coverage.missingCount > 0 ? ` | Pendente: falta ${coverage.missingCount}` : ' | Completo'

      lines.push(`- ${requirement.front}: ${names}${missingText}`)
    })

    lines.push('')
  })

  const priorityAlerts = insights.alerts.filter((alert) => alert.severity !== 'baixa')

  if (priorityAlerts.length > 0) {
    lines.push('Alertas:')
    priorityAlerts.slice(0, 6).forEach((alert) => {
      lines.push(`- ${alert.title}: ${alert.detail}`)
    })
  }

  return lines.join('\n').trim()
}
