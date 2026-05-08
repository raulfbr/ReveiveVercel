import { createSupabaseServerClient } from '@/lib/supabase/server'
import type {
  AvailabilityStatus,
  ServiceArea,
  VolunteerAreaAssignment,
  VolunteerAreaRole,
  VolunteerCareStatus,
  VolunteerGender,
  VolunteerRecord,
} from '@/lib/types'
import { getVolunteerPhotoUrl } from '@/lib/volunteers/storage'

type VolunteerFilters = {
  areaId?: string | null
  status?: 'active' | 'inactive' | 'all'
}

type ServiceAreaRow = {
  id: string
  name: string
  slug: string
  active: boolean
  sort_order: number
}

type VolunteerAreaRow = {
  area_id: string
  role_in_area: VolunteerAreaRole
  service_areas: ServiceAreaRow | ServiceAreaRow[] | null
}

type VolunteerRow = {
  id: string
  name: string
  normalized_name: string
  photo_path: string | null
  gender: VolunteerGender | null
  birth_date: string | null
  join_date: string | null
  address: string | null
  whatsapp: string | null
  normalized_whatsapp: string | null
  availability_status: AvailabilityStatus | null
  care_status: VolunteerCareStatus
  last_contact_at: string | null
  next_step: string | null
  care_responsible: string | null
  next_follow_up_at: string | null
  notes: string | null
  active: boolean
  created_at: string
  updated_at: string
  volunteer_areas: VolunteerAreaRow[] | null
}

function isVolunteerAreaAssignment(
  value: VolunteerAreaAssignment | null,
): value is VolunteerAreaAssignment {
  return value !== null
}

function mapServiceArea(row: ServiceAreaRow): ServiceArea {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    active: row.active,
    sortOrder: row.sort_order,
  }
}

function mapVolunteer(row: VolunteerRow): VolunteerRecord {
  const areas = Array.isArray(row.volunteer_areas)
    ? row.volunteer_areas
        .map((assignment) => {
          const area = Array.isArray(assignment.service_areas)
            ? assignment.service_areas[0]
            : assignment.service_areas

          if (!area) {
            return null
          }

          return {
            areaId: assignment.area_id,
            areaName: area.name,
            areaSlug: area.slug,
            roleInArea: assignment.role_in_area,
          }
        })
        .filter(isVolunteerAreaAssignment)
    : []

  return {
    id: row.id,
    name: row.name,
    normalizedName: row.normalized_name,
    photoPath: row.photo_path,
    gender: row.gender,
    birthDate: row.birth_date,
    joinDate: row.join_date,
    address: row.address,
    whatsapp: row.whatsapp,
    normalizedWhatsapp: row.normalized_whatsapp,
    availabilityStatus: row.availability_status,
    careStatus: row.care_status,
    lastContactAt: row.last_contact_at,
    nextStep: row.next_step,
    careResponsible: row.care_responsible,
    nextFollowUpAt: row.next_follow_up_at,
    notes: row.notes,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    areas,
  }
}

export async function getServiceAreas() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('service_areas')
    .select('id, name, slug, active, sort_order')
    .eq('active', true)
    .order('sort_order')
    .order('name')

  if (error) {
    throw new Error(`Falha ao carregar areas: ${error.message}`)
  }

  return (data ?? []).map(mapServiceArea)
}

export async function getVolunteers(filters: VolunteerFilters = {}) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('volunteers')
    .select(
      `
        id,
        name,
        normalized_name,
        photo_path,
        gender,
        birth_date,
        join_date,
        address,
        whatsapp,
        normalized_whatsapp,
        availability_status,
        care_status,
        last_contact_at,
        next_step,
        care_responsible,
        next_follow_up_at,
        notes,
        active,
        created_at,
        updated_at,
        volunteer_areas (
          area_id,
          role_in_area,
          service_areas (
            id,
            name,
            slug,
            active,
            sort_order
          )
        )
      `,
    )
    .order('name')

  if (error) {
    throw new Error(`Falha ao carregar voluntarios: ${error.message}`)
  }

  const volunteers = ((data ?? []) as VolunteerRow[]).map(mapVolunteer)

  return volunteers.filter((volunteer) => {
    const statusFilter = filters.status ?? 'active'
    const statusMatches =
      statusFilter === 'all' ||
      (statusFilter === 'active' && volunteer.active) ||
      (statusFilter === 'inactive' && !volunteer.active)

    const areaMatches =
      !filters.areaId || volunteer.areas.some((assignment) => assignment.areaId === filters.areaId)

    return statusMatches && areaMatches
  })
}

export async function getVolunteerById(volunteerId: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('volunteers')
    .select(
      `
        id,
        name,
        normalized_name,
        photo_path,
        gender,
        birth_date,
        join_date,
        address,
        whatsapp,
        normalized_whatsapp,
        availability_status,
        care_status,
        last_contact_at,
        next_step,
        care_responsible,
        next_follow_up_at,
        notes,
        active,
        created_at,
        updated_at,
        volunteer_areas (
          area_id,
          role_in_area,
          service_areas (
            id,
            name,
            slug,
            active,
            sort_order
          )
        )
      `,
    )
    .eq('id', volunteerId)
    .maybeSingle()

  if (error) {
    throw new Error(`Falha ao carregar o voluntario: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const volunteer = mapVolunteer(data as VolunteerRow)
  volunteer.photoUrl = await getVolunteerPhotoUrl(supabase, volunteer.photoPath)
  return volunteer
}
