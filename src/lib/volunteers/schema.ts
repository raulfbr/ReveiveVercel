import { z } from 'zod'

import type { AvailabilityStatus, VolunteerAreaRole, VolunteerGender } from '@/lib/types'

const genderEnum = z.enum(['female', 'male', 'other', 'prefer_not_to_say'])
const availabilityEnum = z.enum(['available', 'limited', 'unavailable'])
const areaRoleEnum = z.enum(['member', 'leader', 'coordinator'])

function getOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function isIsoDate(value: string | null) {
  if (!value) {
    return true
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeWhatsapp(value: string | null) {
  if (!value) {
    return null
  }

  const digits = value.replace(/\D/g, '')
  return digits.length > 0 ? digits : null
}

const volunteerFormSchema = z.object({
  name: z.string().trim().min(1, 'Nome e obrigatorio.'),
  active: z.boolean(),
  gender: genderEnum.nullable(),
  birthDate: z.string().nullable().refine(isIsoDate, 'Data de nascimento invalida.'),
  joinDate: z.string().nullable().refine(isIsoDate, 'Data de entrada invalida.'),
  address: z.string().max(500).nullable(),
  whatsapp: z.string().max(40).nullable(),
  availabilityStatus: availabilityEnum.nullable(),
  notes: z.string().max(2000).nullable(),
  removePhoto: z.boolean(),
  selectedAreas: z.array(z.string()).default([]),
  rolesByArea: z.record(z.string(), areaRoleEnum).default({}),
})

export type ParsedVolunteerInput = {
  name: string
  normalizedName: string
  active: boolean
  gender: VolunteerGender | null
  birthDate: string | null
  joinDate: string | null
  address: string | null
  whatsapp: string | null
  normalizedWhatsapp: string | null
  availabilityStatus: AvailabilityStatus | null
  notes: string | null
  removePhoto: boolean
  selectedAreas: string[]
  rolesByArea: Record<string, VolunteerAreaRole>
}

export function parseVolunteerFormData(formData: FormData): {
  input: ParsedVolunteerInput
  photoFile: File | null
} {
  const selectedAreas = formData
    .getAll('area_ids')
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)

  const rolesByArea = Object.fromEntries(
    selectedAreas.map((areaId) => {
      const areaRole = formData.get(`area_role_${areaId}`)
      return [areaId, typeof areaRole === 'string' ? areaRole : 'member']
    }),
  )

  const parsed = volunteerFormSchema.parse({
    name: getOptionalString(formData.get('name')) ?? '',
    active: formData.get('active') === 'on',
    gender: (getOptionalString(formData.get('gender')) as VolunteerGender | null) ?? null,
    birthDate: getOptionalString(formData.get('birth_date')),
    joinDate: getOptionalString(formData.get('join_date')),
    address: getOptionalString(formData.get('address')),
    whatsapp: getOptionalString(formData.get('whatsapp')),
    availabilityStatus:
      (getOptionalString(formData.get('availability_status')) as AvailabilityStatus | null) ?? null,
    notes: getOptionalString(formData.get('notes')),
    removePhoto: formData.get('remove_photo') === 'on',
    selectedAreas,
    rolesByArea,
  })

  const photoEntry = formData.get('photo')
  const photoFile = photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : null

  return {
    input: {
      name: parsed.name,
      normalizedName: normalizeName(parsed.name),
      active: parsed.active,
      gender: parsed.gender,
      birthDate: parsed.birthDate,
      joinDate: parsed.joinDate,
      address: parsed.address,
      whatsapp: parsed.whatsapp,
      normalizedWhatsapp: normalizeWhatsapp(parsed.whatsapp),
      availabilityStatus: parsed.availabilityStatus,
      notes: parsed.notes,
      removePhoto: parsed.removePhoto,
      selectedAreas: parsed.selectedAreas,
      rolesByArea: parsed.rolesByArea,
    },
    photoFile,
  }
}

